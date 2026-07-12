import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

type Target = 'tr' | 'ar-DZ';
type Draft = { target: Target; segments: Array<{ id: string; source: string; draft: string }> };
const ROOT = process.cwd();
const inputIndex = process.argv.indexOf('--input');
const input = process.argv[inputIndex + 1];
if (!input) throw new Error('Usage: tsx scripts/apply-project-bulk-draft.ts --input <draft.json>');
const draft = JSON.parse(await readFile(path.resolve(ROOT, input), 'utf8')) as Draft;
const file = draft.target === 'tr' ? 'config/locales/site.tr.yml' : 'config/locales/site.dz.yml';
const rootKey = draft.target === 'tr' ? 'tr' : 'dz';
const filePath = path.resolve(ROOT, file);
const catalog = JSON.parse(await readFile(filePath, 'utf8')) as Record<string, { site: Record<string, string> }>;
const translations = catalog[rootKey]?.site;
if (!translations) throw new Error(`Missing ${rootKey}.site in ${file}`);

function normalize(value: string) {
  let result = value.trim();
  if (draft.target === 'tr') {
    result = result
      .replace(/teşvikli konut/giu, 'destekli promosyon konutu')
      .replace(/promosyonel konut/giu, 'promosyon konutu')
      .replace(/proje tipi/giu, 'proje türü')
      .replace(/ticari yüzeyler/giu, 'ticari alanlar');
  }
  return result;
}

let applied = 0;
for (const segment of draft.segments) {
  const value = normalize(segment.draft);
  if (!segment.id.startsWith('projectContent.') || !value) continue;
  translations[segment.id] = value;
  applied += 1;
}
await writeFile(filePath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
process.stdout.write(`Applied ${applied} ${draft.target} project translations to ${file}.\n`);
