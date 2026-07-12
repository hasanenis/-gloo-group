import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { generatedProjectContent } from '../src/data/projectContent.generated.ts';

const ROOT = process.cwd();
const slug = process.argv[2];
if (!slug || !generatedProjectContent[slug]) {
  throw new Error('Usage: tsx scripts/create-project-translation-workset.ts <project-slug>');
}

type Segment = { id: string; source: string; context: string };
const segments: Segment[] = [];

function visit(value: unknown, pathParts: string[]) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => visit(item, [...pathParts, String(index)]));
    return;
  }
  if (!value || typeof value !== 'object') return;
  const record = value as Record<string, unknown>;
  if (typeof record.en === 'string') {
    const source = record.en.trim();
    if (source) {
      segments.push({
        id: `project.${slug}.${pathParts.join('.')}`,
        source,
        context: `Project detail route /projects/${slug}. Field path: ${pathParts.join('.')}. Preserve project names, measurements, acronyms, and factual claims.`,
      });
    }
    return;
  }
  Object.entries(record).forEach(([key, child]) => visit(child, [...pathParts, key]));
}

visit(generatedProjectContent[slug], []);
const output = path.join(ROOT, 'docs', 'localization', 'worksets', `${slug}.json`);
await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(segments, null, 2)}\n`, 'utf8');
process.stdout.write(`Prepared ${segments.length} review segments at ${path.relative(ROOT, output)}.\n`);
