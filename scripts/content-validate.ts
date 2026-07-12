import fs from 'node:fs/promises';
import path from 'node:path';
import { CONTENT_LOCALES, PAGE_DOCUMENT_REQUIRED, isRecord, sameShape } from './content-schema.ts';

const contentRoot = path.resolve(process.cwd(), 'content');
const errors: string[] = [];
const warnings: string[] = [];

async function readJson(file: string) {
  try { return JSON.parse(await fs.readFile(file, 'utf8')) as unknown; }
  catch (error) { errors.push(`${path.relative(process.cwd(), file)}: invalid JSON (${String(error)})`); return null; }
}

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(file));
    else if (entry.name.endsWith('.json')) files.push(file);
  }
  return files;
}

function validateDocument(file: string, value: unknown) {
  if (!isRecord(value)) { errors.push(`${file}: document must be an object`); return; }
  for (const key of PAGE_DOCUMENT_REQUIRED) if (!(key in value)) errors.push(`${file}: missing ${key}`);
  if (value.schemaVersion !== 1) errors.push(`${file}: unsupported schemaVersion`);
  if (typeof value.pageId !== 'string') errors.push(`${file}: pageId must be a string`);
  if (!CONTENT_LOCALES.includes(value.locale as typeof CONTENT_LOCALES[number])) errors.push(`${file}: unsupported locale`);
  if (value.sourceLocale !== 'en') errors.push(`${file}: sourceLocale must be en`);
  if (!['draft', 'review', 'approved'].includes(String(value.status))) errors.push(`${file}: unsupported status`);
  if (!isRecord(value.seo) || typeof value.seo.title !== 'string' || typeof value.seo.description !== 'string') errors.push(`${file}: invalid seo block`);
  if ('approved' === value.status && (!String(value.revision).startsWith('v1-') || !String(value.sourceRevision).startsWith('v1-'))) errors.push(`${file}: approved documents need revisions`);
  const raw = JSON.stringify(value.content ?? '');
  if (/Ã.|Â.|â€|ï¿½|Ø.|Ù./u.test(raw)) warnings.push(`${file}: possible encoding artifact detected`);
  if (value.status === 'approved' && /\[TRANSLATION REVIEW REQUIRED\]/u.test(raw)) errors.push(`${file}: review marker in approved content`);
}

const pageFiles = (await walk(path.join(contentRoot, 'pages'))).filter((file) => !file.endsWith(`${path.sep}page.json`) && !file.endsWith(`${path.sep}facts.json`));
for (const file of pageFiles) validateDocument(path.relative(process.cwd(), file), await readJson(file));

for (const dirEntry of await fs.readdir(path.join(contentRoot, 'pages'), { withFileTypes: true })) {
  if (!dirEntry.isDirectory()) continue;
  const pageDir = path.join(contentRoot, 'pages', dirEntry.name);
  const pageManifest = path.join(pageDir, 'page.json');
  if (await fs.stat(pageManifest).catch(() => null)) {
    const manifest = await readJson(pageManifest);
    if (!isRecord(manifest) || manifest.schemaVersion !== 1 || typeof manifest.pageId !== 'string' || !Array.isArray(manifest.fields)) errors.push(`${path.relative(process.cwd(), pageManifest)}: invalid page manifest`);
  }
}

// Every non-project page must have the same field tree as English and may not
// silently publish against an older source revision.
for (const dirEntry of await fs.readdir(path.join(contentRoot, 'pages'), { withFileTypes: true })) {
  if (!dirEntry.isDirectory() || dirEntry.name === 'projects') continue;
  const pageDir = path.join(contentRoot, 'pages', dirEntry.name);
  const source = await readJson(path.join(pageDir, 'en.json'));
  if (!source) continue;
  for (const locale of CONTENT_LOCALES) {
    const file = path.join(pageDir, `${locale}.json`);
    const value = await readJson(file);
    if (!value) continue;
    const shapeIssues = sameShape(isRecord(source) ? source.content : null, isRecord(value) ? value.content : null);
    if (shapeIssues.length) errors.push(`${path.relative(process.cwd(), file)}: shape mismatch (${shapeIssues.slice(0, 3).join(', ')})`);
    if (isRecord(value) && value.status === 'approved' && isRecord(source) && value.sourceRevision !== source.sourceRevision) errors.push(`${path.relative(process.cwd(), file)}: sourceRevision does not match English`);
  }
}

const projectRoot = path.join(contentRoot, 'pages', 'projects');
for (const project of await fs.readdir(projectRoot, { withFileTypes: true }).catch(() => [])) {
  if (!project.isDirectory()) continue;
  const dir = path.join(projectRoot, project.name);
  const sourceFile = path.join(dir, 'en.json');
  const source = await readJson(sourceFile);
  for (const locale of CONTENT_LOCALES) {
    const file = path.join(dir, `${locale}.json`);
    const value = await readJson(file);
    if (!value) continue;
    const sourceContent = isRecord(source) ? source.content : null;
    const targetContent = isRecord(value) ? value.content : null;
    const shapeIssues = sameShape(sourceContent, targetContent);
    if (shapeIssues.length) errors.push(`${path.relative(process.cwd(), file)}: shape mismatch (${shapeIssues.slice(0, 3).join(', ')})`);
    if (isRecord(value) && value.status === 'approved' && isRecord(source) && value.sourceRevision !== source.sourceRevision) errors.push(`${path.relative(process.cwd(), file)}: sourceRevision does not match English`);
  }
}

if (warnings.length) console.warn(warnings.join('\n'));
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`Content validation passed (${pageFiles.length} locale documents).`);
