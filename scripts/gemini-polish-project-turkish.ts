import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { generatedProjectContent } from '../src/data/projectContent.generated.ts';

type Segment = { id: string; source: string; current: string; context: string };
type Result = { id: string; text: string };

const ROOT = process.cwd();
const credentialPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
  || path.join(ROOT, '.secrets', 'gcp', 'translation-service-account.json');
const credential = JSON.parse(await readFile(credentialPath, 'utf8')) as { project_id?: string };
if (!credential.project_id) throw new Error('Google Cloud service account is missing project_id.');
process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialPath;

const apply = process.argv.includes('--apply');
const includeImages = process.argv.includes('--include-images');
const imagesOnly = process.argv.includes('--images-only');
const limitIndex = process.argv.indexOf('--limit');
const limit = limitIndex >= 0 ? Number(process.argv[limitIndex + 1]) : Number.POSITIVE_INFINITY;
const startIndex = process.argv.indexOf('--start');
const start = startIndex >= 0 ? Number(process.argv[startIndex + 1]) : 0;
const model = process.env.GEMINI_POLISH_MODEL || 'gemini-2.5-pro';
const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
const ai = new GoogleGenAI({ vertexai: true, project: credential.project_id, location, apiVersion: 'v1' });

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
      process.stdout.write(`Vertex AI rate limit; retrying in ${delay / 1000}s (attempt ${attempt + 2}/7).\n`);
      await wait(delay);
    }
  }
  throw new Error('Gemini retry loop exited unexpectedly.');
}

const segments: Segment[] = [];
function visit(node: unknown, keyPath: string) {
  if (Array.isArray(node)) {
    node.forEach((value, index) => visit(value, `${keyPath}.${index}`));
    return;
  }
  if (!node || typeof node !== 'object') return;
  const record = node as Record<string, unknown>;
  if (typeof record.en === 'string' && typeof record.fr === 'string') {
    const current = typeof record.tr === 'string' ? record.tr.trim() : '';
    const isImageText = keyPath.includes('.images.');
    const inScope = imagesOnly ? isImageText : includeImages || !isImageText;
    if (record.en.trim() && current && inScope) {
      segments.push({
        id: keyPath,
        source: record.en,
        current,
        context: isImageText
          ? 'Görsel alt metni veya açıklaması: kısa, nesnel ve erişilebilir olmalı; görüntüde olmayan ayrıntı ekleme.'
          : 'Cezayirli bir inşaat şirketinin proje sayfasında görünen editoryal metin.',
      });
    }
    return;
  }
  Object.entries(record).forEach(([key, value]) => visit(value, `${keyPath}.${key}`));
}
Object.entries(generatedProjectContent).forEach(([slug, content]) => visit(content, `projectContent.${slug}`));

if (process.argv.includes('--count')) {
  process.stdout.write(`${segments.length}\n`);
  process.exit(0);
}

const selected = segments.slice(start, Number.isFinite(limit) ? start + limit : segments.length);
const results: Result[] = [];
for (let offset = 0; offset < selected.length; offset += 24) {
  const batch = selected.slice(offset, offset + 24);
  const prompt = `
Sen kıdemli bir Türkçe metin yazarı ve editörüsün. Cezayir'de faaliyet gösteren Igloo Construction'ın proje sayfalarını, Türkiye'deki nitelikli bir mimarlık ve inşaat yayını için yazıyormuş gibi yeniden kaleme al.

Bu bir çeviri değil, editoryal yerelleştirme görevidir:
- İngilizce kaynak yalnızca olguları anlamak içindir. İngilizce söz dizimini, isim tamlamalarını ve edilgen yapıları Türkçeye taşıma.
- Mevcut Türkçe metindeki sayıları, proje adlarını, yerleri ve teknik bilgileri eksiksiz koru; yeni bilgi uydurma.
- Metni önce anlamlandır, sonra bir Türk yazarın sıfırdan kuracağı biçimde yaz. Cümle Türkçede söylenmiyorsa kaynak metne sadakat uğruna koruma.
- Kurumsal, sakin ve güven veren bir ton kullan. Reklam klişesi, abartı ve yapay övgü ekleme.
- "bir araya getiriyor", "bütüncül yaklaşım", "yaşam alanı sunmak", "model sergiliyor", "teslim modeli", "konum notları", "program kapsamında" ve "öne çıkıyor" kalıplarını kullanma.
- "içermektedir", "gerçekleştirilmiştir", "hayata geçirilmiştir" ve "kapsamaktadır" gibi bürokratik yapılar yerine kısa ve doğrudan cümleler kur.
- Proje bilgi kartındaki değerler cümle değil, kısa ve yalın bilgi olmalı. SSS cevapları soruyu yeniden tekrarlamadan doğrudan yanıtlamalı.
- İngilizcedeki "promotional housing" terimini körü körüne çevirme. Teknik sınıfı ilk kullanımda "destekli konut (LPA)", "serbest satışlı konut (LPL)" veya "kamu konutu (LPP)" diye açıkla; her cümlede "promosyon" sözcüğünü tekrarlama.
- TCE, MEP, AADL, OPGI, LPA, LPL, LPP, R+8 ve F3/F4 gibi teknik gösterimleri koru.
- Cezayir yer adlarını değiştirme; yalnızca "Algeria" için "Cezayir" kullan.
- Her kayıt için yalnızca nihai Türkçe metni üret; açıklama veya not ekleme.

Üslup örnekleri:
- KÖTÜ: "Konut, dükkân ve hizmet birimlerini işlevsel bir kent dokusunda buluşturan modern bir yaşam alanı yaratmak."
  İYİ: "Konutları, dükkânları ve hizmet birimlerini aynı yerleşim içinde çözmek."
- KÖTÜ: "Proje, büyük ölçekli bir kamu konut sözleşmesiydi ve entegre inşaat destek paketlerini kapsıyordu."
  İYİ: "İş kapsamında konutların yanı sıra ortak kullanım yapıları ve saha altyapısı da tamamlandı."
- KÖTÜ: "Bu bütüncül yaklaşım projenin eksiksiz şekilde teslim edilmesini sağlamıştır."
  İYİ: "Villalar; yolları, altyapısı ve çevre düzenlemesiyle birlikte tamamlandı."
- KÖTÜ: "Sakinlerin ve site kullanıcılarının ihtiyaçlarını karşılayan modern ve işlevsel ticari alanlar sunmak."
  İYİ: "Yerleşimin günlük ihtiyaçlarına hizmet edecek ticari alanlar."

Girdi JSON:
${JSON.stringify(batch)}

Çıktı tam olarak şu biçimde bir JSON dizisi olsun: [{"id":"...","text":"..."}]
`;
  const response = await generateWithRetry(prompt);
  const parsed = JSON.parse(response.text ?? '[]') as Result[];
  if (parsed.length !== batch.length) throw new Error(`Gemini returned ${parsed.length}/${batch.length} records at offset ${offset}.`);
  const expected = new Set(batch.map((segment) => segment.id));
  for (const result of parsed) {
    if (!expected.has(result.id) || !result.text?.trim()) throw new Error(`Invalid Gemini result: ${result.id}`);
    results.push({ id: result.id, text: result.text.trim() });
  }
  process.stdout.write(`Polished ${Math.min(offset + batch.length, selected.length)}/${selected.length}.\n`);
  await wait(2_000);
}

const artifactPath = path.join(ROOT, 'artifacts', 'translation-drafts', `projects-tr-gemini-polished-${start}-${start + results.length}.json`);
await mkdir(path.dirname(artifactPath), { recursive: true });
await writeFile(artifactPath, `${JSON.stringify({ model, generatedAt: new Date().toISOString(), results }, null, 2)}\n`, 'utf8');

if (apply) {
  const seedPath = path.join(ROOT, 'config', 'locales', 'site.tr.yml');
  const catalog = JSON.parse(await readFile(seedPath, 'utf8')) as { tr: { site: Record<string, string> } };
  for (const result of results) catalog.tr.site[result.id] = result.text;
  await writeFile(seedPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
  process.stdout.write(`Applied ${results.length} polished Turkish strings to config/locales/site.tr.yml.\n`);
} else {
  process.stdout.write(`Dry run only. Review ${path.relative(ROOT, artifactPath)} before --apply.\n`);
}
