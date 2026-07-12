import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { generatedProjectContent } from '../src/data/projectContent.generated.ts';

type Target = 'tr' | 'ar-DZ';
const ROOT = process.cwd();
const targetIndex = process.argv.indexOf('--target');
const outIndex = process.argv.indexOf('--out');
const target = process.argv[targetIndex + 1] as Target | undefined;
const out = process.argv[outIndex + 1];
const includeMixed = process.argv.includes('--include-mixed');
if (!target || !['tr', 'ar-DZ'].includes(target) || !out) {
  throw new Error('Usage: tsx scripts/create-project-bulk-workset.ts --target <tr|ar-DZ> --out <file>');
}

const segments: Array<{ id: string; source: string; context: string }> = [];
function isMixedArabic(value: string) {
  const checked = value.replace(/\b(?:AADL|OPGI|LPA|LPL|TCE|MEP|Igloo(?: Construction)?|R\+\d+|F\d+)\b/giu, '');
  const latinWords = (checked.match(/[A-Za-zÀ-ÿ]+/gu) ?? []).length;
  const arabicWords = (checked.match(/[\u0600-\u06ff]+/gu) ?? []).length;
  const foreignUiWords = /(?<![\p{L}])(?:project|type|total|housing|units?|market-rate|objective|client|nearby|places|number|blocks?|typologie|blocs?|completed|location|status)(?![\p{L}])/giu.test(checked);
  return foreignUiWords || latinWords > 3 || arabicWords === 0;
}
function visit(node: unknown, keyPath: string) {
  if (Array.isArray(node)) {
    node.forEach((value, index) => visit(value, `${keyPath}.${index}`));
    return;
  }
  if (!node || typeof node !== 'object') return;
  const record = node as Record<string, unknown>;
  if (typeof record.en === 'string' && typeof record.fr === 'string') {
    const current = typeof record[target] === 'string' ? record[target].trim() : '';
    const needsTranslation = !current || (includeMixed && target === 'ar-DZ' && isMixedArabic(current));
    if (needsTranslation && record.en.trim()) {
      segments.push({
        id: keyPath,
        source: record.en,
        context: `Igloo Construction project page; field=${keyPath}; target=${target}; natural professional construction/real-estate copy; preserve project names, AADL/OPGI/LPA/LPL/TCE/MEP, measurements, R+ notation, image facts and placeholders.`,
      });
    }
    return;
  }
  Object.entries(record).forEach(([key, value]) => visit(value, `${keyPath}.${key}`));
}

Object.entries(generatedProjectContent).forEach(([slug, content]) => visit(content, `projectContent.${slug}`));
const outPath = path.resolve(ROOT, out);
await mkdir(path.dirname(outPath), { recursive: true });
await writeFile(outPath, `${JSON.stringify(segments, null, 2)}\n`, 'utf8');
process.stdout.write(`Wrote ${segments.length} ${target} project segments to ${path.relative(ROOT, outPath)}.\n`);
