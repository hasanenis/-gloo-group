import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

type EditorEntry = { id: string; file: string; label: string; en: string; tr: string; dz: string };
type Segment = { id: string; file: string; index: number; source: string; current: string; context: string };
type Result = { id: string; text: string };

const ROOT = process.cwd();
const API = 'http://127.0.0.1:3030/api/entries';
const credentialPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
  || path.join(ROOT, '.secrets', 'gcp', 'translation-service-account.json');
const credential = JSON.parse(await readFile(credentialPath, 'utf8')) as { project_id?: string };
if (!credential.project_id) throw new Error('Google Cloud service account is missing project_id.');
process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialPath;

const model = process.env.GEMINI_POLISH_MODEL || 'gemini-2.5-pro';
const location = process.env.GOOGLE_CLOUD_LOCATION || 'global';
const ai = new GoogleGenAI({ vertexai: true, project: credential.project_id, location, apiVersion: 'v1' });
const apply = process.argv.includes('--apply');
const startAt = process.argv.includes('--start') ? Number(process.argv[process.argv.indexOf('--start') + 1]) : 0;
const limit = process.argv.includes('--limit') ? Number(process.argv[process.argv.indexOf('--limit') + 1]) : Number.POSITIVE_INFINITY;
const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function generateWithRetry(prompt: string) {
  for (let attempt = 0; attempt < 7; attempt += 1) {
    try {
      return await ai.models.generateContent({
        model,
        contents: prompt,
        config: { temperature: 0.35, responseMimeType: 'application/json' },
      });
    } catch (error) {
      const status = (error as { status?: number }).status;
      if (status !== 429 || attempt === 6) throw error;
      const delay = Math.min(60_000, 10_000 * (attempt + 1));
      process.stdout.write(`Vertex AI rate limit; retrying in ${delay / 1000}s.\n`);
      await wait(delay);
    }
  }
  throw new Error('Gemini retry loop exited unexpectedly.');
}

const response = await fetch(API);
if (!response.ok) throw new Error(`Translation editor API failed: ${response.status}`);
const groups = await response.json() as Record<string, EditorEntry[] | { error: string }>;
const segments: Segment[] = [];
for (const [file, entries] of Object.entries(groups)) {
  if (!Array.isArray(entries) || file.endsWith('projectContent.generated.ts')) continue;
  entries.forEach((entry, index) => {
    if (!entry.en.trim() || !entry.tr.trim()) return;
    segments.push({
      id: `${file}#${index}`,
      file,
      index,
      source: entry.en,
      current: entry.tr,
      context: `${file}; ${entry.label}. Kullanıcıya görünen web sitesi metni. Başlıksa kısa, bilgi değeriyse yalın, açıklamaysa akıcı yaz.`,
    });
  });
}

if (process.argv.includes('--count')) {
  process.stdout.write(`${segments.length}\n`);
  process.exit(0);
}

const selected = segments.slice(startAt, Number.isFinite(limit) ? startAt + limit : segments.length);
const results: Result[] = [];
for (let offset = 0; offset < selected.length; offset += 24) {
  const batch = selected.slice(offset, offset + 24);
  const prompt = `
Sen kıdemli bir Türkçe dijital içerik editörüsün. Igloo Construction web sitesindeki aşağıdaki metinleri doğal, güncel ve profesyonel Türkçeyle sıfırdan yaz.

Kurallar:
- Bu kelimesi kelimesine çeviri değildir. İngilizce kaynak yalnızca anlam ve olgular içindir; İngilizce cümle yapısını kopyalama.
- Sayıları, özel adları, yerleri, teknik kısaltmaları ve gerçekleri koru; bilgi ekleme veya çıkarma.
- Metin Türkiye Türkçesinde ilk okumada doğal duyulmalı. Yarı İngilizce, yarı Türkçe ifade kesinlikle bırakma.
- Sakin, güven veren ve somut bir kurumsal ton kullan. Yapay pazarlama dili ve AI klişesi kullanma.
- "bir araya getiriyor", "bütüncül yaklaşım", "yaşam alanı sunuyor", "model sergiliyor", "teslim modeli", "konum notları", "program kapsamında" gibi çeviri kokan kalıpları kullanma.
- "içermektedir", "kapsamaktadır", "gerçekleştirilmiştir" gibi bürokratik yapıları kısa ve etken Türkçeye çevir.
- "delivery" her yerde "teslim" değildir; bağlama göre "yapım", "uygulama", "tamamlama" veya cümleyi yeniden kur.
- "programme" her yerde "program" değildir; konut sınıfı, proje veya iş kapsamı anlamına göre doğal karşılığını seç.
- "promotional housing": bağlama göre "destekli konut (LPA)", "serbest satışlı konut (LPL)" veya "kamu konutu (LPP)". "Promosyon konutu" ifadesini kullanma.
- CTA kısa ve eylem odaklı; başlık güçlü ama abartısız; bilgi kartı kısa; açıklama akıcı olmalı.
- Her kayıt için yalnızca nihai Türkçe metni döndür.

Örnekler:
- KÖTÜ: "Cezayir genelinde mühendislik kontrolü ile teslim edilen konut programları."
  İYİ: "Cezayir'in farklı kentlerinde, mühendislik disipliniyle tamamlanan konut projeleri."
- KÖTÜ: "İnşa edilmiş kanıt, vaatler değil."
  İYİ: "Söz değil, tamamlanmış işler."
- KÖTÜ: "Teslim disiplini"
  İYİ: "Planlı ve kontrollü yapım"
- KÖTÜ: "Konut ve karma kullanım teslimi"
  İYİ: "Konut ve karma kullanım projelerinde uzmanlık"

Girdi JSON:
${JSON.stringify(batch)}

Çıktı tam olarak şu biçimde bir JSON dizisi olsun: [{"id":"...","text":"..."}]
`;
  const generated = await generateWithRetry(prompt);
  const parsed = JSON.parse(generated.text ?? '[]') as Result[];
  if (parsed.length !== batch.length) throw new Error(`Gemini returned ${parsed.length}/${batch.length} records at offset ${offset}.`);
  const expected = new Set(batch.map((segment) => segment.id));
  for (const result of parsed) {
    if (!expected.has(result.id) || !result.text?.trim()) throw new Error(`Invalid Gemini result: ${result.id}`);
    results.push({ id: result.id, text: result.text.trim() });
  }
  process.stdout.write(`Polished ${Math.min(offset + batch.length, selected.length)}/${selected.length}.\n`);
  await wait(2_000);
}

const artifactPath = path.join(ROOT, 'artifacts', 'translation-drafts', `editor-tr-gemini-polished-${startAt}-${startAt + results.length}.json`);
await mkdir(path.dirname(artifactPath), { recursive: true });
await writeFile(artifactPath, `${JSON.stringify({ model, generatedAt: new Date().toISOString(), results }, null, 2)}\n`, 'utf8');

if (apply) {
  const byId = new Map(selected.map((segment) => [segment.id, segment]));
  for (const result of results) {
    const segment = byId.get(result.id);
    if (!segment) throw new Error(`Missing source segment for ${result.id}`);
    const save = await fetch(`${API}/save`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ file: segment.file, index: segment.index, locale: 'tr', value: result.text }),
    });
    if (!save.ok) throw new Error(`Failed to save ${result.id}: ${await save.text()}`);
  }
  process.stdout.write(`Applied ${results.length} polished Turkish editor strings.\n`);
} else {
  process.stdout.write(`Dry run only. Review ${path.relative(ROOT, artifactPath)} before --apply.\n`);
}
