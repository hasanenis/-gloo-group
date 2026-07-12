import { readFile } from 'node:fs/promises';
import path from 'node:path';

type Target = 'tr' | 'ar-DZ';
type EditorEntry = { id: string; file: string; kind: string; label: string; en: string; tr: string; dz: string };
type Draft = { target: Target; segments: Array<{ source: string; draft: string }> };

const ROOT = process.cwd();
const inputIndex = process.argv.indexOf('--input');
if (inputIndex < 0 || !process.argv[inputIndex + 1]) {
  throw new Error('Usage: tsx scripts/apply-editor-translation-draft.ts --input <draft.json>');
}

const draft = JSON.parse(await readFile(path.resolve(ROOT, process.argv[inputIndex + 1]), 'utf8')) as Draft;
if (!['tr', 'ar-DZ'].includes(draft.target)) throw new Error('Draft target must be tr or ar-DZ.');

function normalize(value: string, target: Target) {
  let result = value.trim();
  if (target === 'tr') {
    result = result
      .replace(/teşvikli konut/giu, 'destekli promosyon konutu')
      .replace(/promosyonel konut/giu, 'promosyon konutu')
      .replace(/proje tipi/giu, 'proje türü')
      .replace(/ticari yüzeyler/giu, 'ticari alanlar');
  }
  return result;
}

const bySource = new Map(
  draft.segments
    .map((segment) => [segment.source.trim(), normalize(segment.draft, draft.target)] as const)
    .filter(([source, translation]) => source && translation && (
      source !== translation || /^(?:\d{4}|AADL|OPGI|R\+\d+|BAS MAZAGRAN)$/u.test(source)
    )),
);

const response = await fetch('http://127.0.0.1:3030/api/entries');
if (!response.ok) throw new Error(`Translation editor API failed: ${response.status}`);
const groups = await response.json() as Record<string, EditorEntry[] | { error: string }>;
let applied = 0;
let skipped = 0;

for (const [file, values] of Object.entries(groups)) {
  if (!Array.isArray(values) || file.endsWith('projectContent.generated.ts')) continue;
  // The editor indexes entries by stable traversal order. Saving a string does
  // not add/remove entries, so the same index remains valid throughout a pass.
  for (let index = 0; index < values.length; index += 1) {
    const entry = values[index];
    // Composite fact()/item() helpers contain two nested locale groups in one
    // positional call. They need an AST rewrite pass; the editor endpoint is
    // intentionally used only for independently addressable entries here.
    if (file.endsWith('projectEditorialContent.ts') && entry.label.includes(' · ')) {
      skipped += 1;
      continue;
    }
    const current = draft.target === 'tr' ? entry.tr : entry.dz;
    if (current.trim()) continue;
    const translation = bySource.get(entry.en.trim());
    if (!translation) {
      skipped += 1;
      continue;
    }
    const save = await fetch('http://127.0.0.1:3030/api/entries/save', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ file, index, locale: draft.target, value: translation }),
    });
    if (!save.ok) throw new Error(`Failed to save ${file}#${index}: ${await save.text()}`);
    applied += 1;
  }
}

process.stdout.write(`Applied ${applied} ${draft.target} translations; ${skipped} unmatched entries remain.\n`);
