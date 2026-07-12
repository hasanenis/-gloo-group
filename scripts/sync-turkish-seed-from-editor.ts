import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

type EditorEntry = { en: string; tr: string };
type Catalog = Record<string, { site: Record<string, string> }>;

const ROOT = process.cwd();
const response = await fetch('http://127.0.0.1:3030/api/entries');
if (!response.ok) throw new Error(`Translation editor API failed: ${response.status}`);
const groups = await response.json() as Record<string, EditorEntry[] | { error: string }>;
const candidates = new Map<string, Set<string>>();

for (const [file, entries] of Object.entries(groups)) {
  if (!Array.isArray(entries) || file.endsWith('projectContent.generated.ts')) continue;
  for (const entry of entries) {
    const source = entry.en.trim();
    const translated = entry.tr.trim();
    if (!source || !translated) continue;
    if (!candidates.has(source)) candidates.set(source, new Set());
    candidates.get(source)?.add(translated);
  }
}

const enPath = path.join(ROOT, 'config', 'locales', 'site.en.yml');
const trPath = path.join(ROOT, 'config', 'locales', 'site.tr.yml');
const enCatalog = JSON.parse(await readFile(enPath, 'utf8')) as Catalog;
const trCatalog = JSON.parse(await readFile(trPath, 'utf8')) as Catalog;
let updated = 0;
let ambiguous = 0;
let unmatched = 0;

for (const [key, source] of Object.entries(enCatalog.en.site)) {
  if (key.startsWith('projectContent.') || !source.trim()) continue;
  const options = candidates.get(source.trim());
  if (!options?.size) {
    unmatched += 1;
    continue;
  }
  if (options.size > 1) {
    ambiguous += 1;
    continue;
  }
  const translated = [...options][0];
  if (trCatalog.tr.site[key] !== translated) {
    trCatalog.tr.site[key] = translated;
    updated += 1;
  }
}

await writeFile(trPath, `${JSON.stringify(trCatalog, null, 2)}\n`, 'utf8');
process.stdout.write(`Updated ${updated} Turkish seed strings; ${ambiguous} ambiguous; ${unmatched} unmatched.\n`);
