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
        config: { temperature: 0.3, responseMimeType: 'application/json' },
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
    const current = typeof record.fr === 'string' ? record.fr.trim() : '';
    const isImageText = keyPath.includes('.images.');
    const inScope = imagesOnly ? isImageText : includeImages || !isImageText;
    if (record.en.trim() && current && inScope) {
      segments.push({
        id: keyPath,
        source: record.en,
        current,
        context: isImageText
          ? 'Légende ou texte alternatif d’image pour une page projet d’une entreprise de construction algérienne. Rester factuel, court, précis et accessible.'
          : 'Texte éditorial visible sur une page projet d’une entreprise de construction en Algérie.',
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
Tu es un rédacteur éditorial senior francophone spécialisé dans l’architecture, le bâtiment et les projets immobiliers en Algérie.

Réécris les textes ci-dessous dans un français naturel, fluide et professionnel.

Règles impératives :
- Ce n’est pas une traduction littérale. Le texte anglais sert uniquement à comprendre les faits.
- Conserve absolument les chiffres, noms de lieux, noms de projet, sigles techniques et informations vérifiables.
- Corrige tous les accents, apostrophes, élisions et espaces typographiques françaises.
- Évite les calques de l’anglais et les formulations mécaniques comme « portée du projet », « cadre utilisable », « discipline de livraison », « construction avec preuves », « modèle de livraison », « tissu résidentiel » ou « se définit par ».
- Utilise un ton institutionnel, précis et sobre. Pas de jargon marketing gonflé, pas d’emphase artificielle.
- Les valeurs de fiche projet doivent rester courtes et claires. Les titres doivent être nets. Les paragraphes doivent se lire comme un texte rédigé par un humain.
- Conserve LPA, LPL, LPP, AADL, OPGI, TCE, VRD, MEP, R+8, R+9, F3 et F4 quand c’est pertinent.
- Si le texte actuel en français contient déjà une bonne information métier, améliore seulement la langue, ne réinvente pas le fond.
- Pour les légendes d’images, reste descriptif et factuel. N’ajoute jamais un élément non visible.
- Retourne uniquement le texte final en français pour chaque entrée.

Exemples :
- MAUVAIS : « Un programme résidentiel livré avec discipline. »
  BON : « Une opération résidentielle menée avec rigueur. »
- MAUVAIS : « Le projet transforme un programme en lieu fonctionnel. »
  BON : « Le projet réunit logements, services et réseaux dans un ensemble cohérent. »
- MAUVAIS : « Construit avec expertise. Livre avec maitrise. »
  BON : « Construit avec expertise. Livré avec maîtrise. »

Entrée JSON :
${JSON.stringify(batch)}

La sortie doit être exactement un tableau JSON au format suivant :
[{"id":"...","text":"..."}]
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

const artifactPath = path.join(ROOT, 'artifacts', 'translation-drafts', `projects-fr-gemini-polished-${start}-${start + results.length}.json`);
await mkdir(path.dirname(artifactPath), { recursive: true });
await writeFile(artifactPath, `${JSON.stringify({ model, generatedAt: new Date().toISOString(), results }, null, 2)}\n`, 'utf8');

if (apply) {
  const seedPath = path.join(ROOT, 'config', 'locales', 'site.fr.yml');
  const catalog = JSON.parse(await readFile(seedPath, 'utf8')) as { fr: { site: Record<string, string> } };
  for (const result of results) catalog.fr.site[result.id] = result.text;
  await writeFile(seedPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
  process.stdout.write(`Applied ${results.length} polished French strings to config/locales/site.fr.yml.\n`);
} else {
  process.stdout.write(`Dry run only. Review ${path.relative(ROOT, artifactPath)} before --apply.\n`);
}
