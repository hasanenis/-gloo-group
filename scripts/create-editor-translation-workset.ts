import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

type Target = 'tr' | 'ar-DZ';
type EditorEntry = {
  id: string;
  file: string;
  label: string;
  en: string;
  tr: string;
  dz: string;
};

const ROOT = process.cwd();
const target = process.argv.includes('--target')
  ? process.argv[process.argv.indexOf('--target') + 1] as Target
  : undefined;
const output = process.argv.includes('--out')
  ? process.argv[process.argv.indexOf('--out') + 1]
  : undefined;
const includeGenerated = process.argv.includes('--include-generated');

if (!target || !['tr', 'ar-DZ'].includes(target) || !output) {
  throw new Error('Usage: tsx scripts/create-editor-translation-workset.ts --target <tr|ar-DZ> --out <file> [--include-generated]');
}

const response = await fetch('http://127.0.0.1:3030/api/entries');
if (!response.ok) throw new Error(`Translation editor API failed: ${response.status}`);
const groups = await response.json() as Record<string, EditorEntry[] | { error: string }>;
const seen = new Set<string>();
const segments: Array<{ id: string; source: string; context: string }> = [];

for (const [file, values] of Object.entries(groups)) {
  if (!Array.isArray(values)) continue;
  if (!includeGenerated && file.endsWith('projectContent.generated.ts')) continue;
  for (const entry of values) {
    const current = target === 'tr' ? entry.tr : entry.dz;
    if (current.trim() || !entry.en.trim()) continue;
    const dedupeKey = `${target}\u0000${entry.en}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    segments.push({
      id: entry.id,
      source: entry.en,
      context: `Igloo Construction website; file=${file}; field=${entry.label}; target=${target}; use natural professional construction and real-estate language; preserve project names, acronyms, measurements, R+ floor notation and placeholders.`,
    });
  }
}

const outPath = path.resolve(ROOT, output);
await mkdir(path.dirname(outPath), { recursive: true });
await writeFile(outPath, `${JSON.stringify(segments, null, 2)}\n`, 'utf8');
process.stdout.write(`Wrote ${segments.length} unique ${target} segments to ${path.relative(ROOT, outPath)}.\n`);
