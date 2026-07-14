import fs from 'node:fs/promises';
import path from 'node:path';
import { CONTENT_LOCALES, PAGE_DOCUMENT_REQUIRED, isRecord, sameShape } from './content-schema.ts';

const contentRoot = path.resolve(process.cwd(), 'content');
const errors: string[] = [];
const warnings: string[] = [];
const deepMode = process.env.CONTENT_VALIDATE_DEEP === 'error' || process.env.CONTENT_VALIDATE_DEEP === 'warning'
  ? process.env.CONTENT_VALIDATE_DEEP
  : 'off';
let runTargetGates: ((input: Record<string, unknown>) => { issues: Array<Record<string, unknown>> }) | null = null;
let protectedTerms: unknown = null;
let fieldContracts: unknown = null;
let projectOverrides: unknown = null;
if (deepMode !== 'off') {
  const gates = await import('./localization-gates.mjs');
  runTargetGates = gates.runTargetGates as typeof runTargetGates;
  protectedTerms = JSON.parse(await fs.readFile(path.join(contentRoot, 'terminology', 'protected-terms.json'), 'utf8'));
  fieldContracts = JSON.parse(await fs.readFile(path.join(contentRoot, 'field-contracts.json'), 'utf8'));
  projectOverrides = (await import('./localization-rules.mjs')).PROJECT_OVERRIDES;
}

const INTERNAL_METADATA_KEYS = new Set(['pipelineMeta', 'model', 'prompt', 'promptVersion', 'qaDiagnostics', 'approvalMetadata', 'cost', 'tokenData', 'fallbackDetails', 'artifactRoot', 'jobId', 'origin', 'rulesVersion', 'fieldContractsHash', 'styleGuideHash', 'exemplarsHash', 'terminologyHash']);
function scanCanonicalMetadata(value: unknown, file: string, currentPath = '') {
  if (Array.isArray(value)) { value.forEach((item, index) => scanCanonicalMetadata(item, file, `${currentPath}[${index}]`)); return; }
  if (!isRecord(value)) return;
  for (const [key, child] of Object.entries(value)) {
    const childPath = currentPath ? `${currentPath}.${key}` : key;
    if (INTERNAL_METADATA_KEYS.has(key)) errors.push(`${file}: internal pipeline metadata is not allowed at ${childPath}`);
    scanCanonicalMetadata(child, file, childPath);
  }
}

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
  // Historical approved content uses labels such as v3-natural-fr while the
  // canonical approval workflow emits v1-<hash>. Both are valid revision
  // identifiers; only an unversioned value is invalid.
  const validRevision = (revision: unknown) => /^v\d+[-:]/u.test(String(revision));
  if ('approved' === value.status && (!validRevision(value.revision) || !validRevision(value.sourceRevision))) errors.push(`${file}: approved documents need revisions`);
  const raw = JSON.stringify(value.content ?? '');
  if (/Ã.|Â.|â€|ï¿½|Ø.|Ù./u.test(raw)) warnings.push(`${file}: possible encoding artifact detected`);
  if (value.status === 'approved' && /\[TRANSLATION REVIEW REQUIRED\]/u.test(raw)) errors.push(`${file}: review marker in approved content`);
  scanCanonicalMetadata(value, file);
}

const pageFiles = (await walk(path.join(contentRoot, 'pages'))).filter((file) => !file.endsWith(`${path.sep}page.json`) && !file.endsWith(`${path.sep}facts.json`));
const documents = new Map<string, unknown>();
for (const file of pageFiles) {
  const relative = path.relative(process.cwd(), file).replaceAll(path.sep, '/');
  const value = await readJson(file);
  documents.set(relative, value);
  validateDocument(relative, value);
}

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

if (deepMode !== 'off' && runTargetGates) {
  const waiversFile = path.join(contentRoot, 'terminology', 'validation-waivers.json');
  const waiversDocument = await fs.readFile(waiversFile, 'utf8').then(JSON.parse).catch(() => ({ schemaVersion: 1, waivers: [] }));
  if (!Array.isArray(waiversDocument.waivers)) errors.push('content/terminology/validation-waivers.json: waivers must be an array');
  else waiversDocument.waivers.forEach((waiver: unknown, index: number) => {
    if (!isRecord(waiver) || typeof waiver.file !== 'string' || typeof waiver.path !== 'string' || typeof waiver.type !== 'string' || typeof waiver.reason !== 'string' || typeof waiver.addedAt !== 'string' || !waiver.reason.trim()) errors.push(`content/terminology/validation-waivers.json: invalid waiver at index ${index}`);
  });
  const isWaived = (file: string, item: Record<string, unknown>) => (waiversDocument.waivers || []).some((waiver: Record<string, unknown>) => waiver.file === file && waiver.path === (item.path || item.id) && waiver.type === item.type);
  for (const relative of pageFiles.map((file) => path.relative(process.cwd(), file).replaceAll(path.sep, '/'))) {
    const target = documents.get(relative);
    if (!isRecord(target) || target.locale === 'en') continue;
    const sourceRelative = relative.replace(/\\(fr|tr|ar-DZ)\.json$/u, '\\en.json').replace(/\/(fr|tr|ar-DZ)\.json$/u, '/en.json');
    const source = documents.get(sourceRelative);
    if (!isRecord(source)) continue;
    const pageId = String(target.pageId || '');
    const facts = pageId.startsWith('projects/') ? await fs.readFile(path.join(contentRoot, 'pages', ...pageId.split('/'), 'facts.json'), 'utf8').then(JSON.parse).catch(() => null) : null;
    const report = runTargetGates({ sourceDoc: source, targetDoc: target, locale: target.locale, facts, terminology: protectedTerms, fieldContracts, pageId, projectOverrides });
    for (const item of report.issues) {
      if (isWaived(relative, item)) continue;
      const message = `${relative}: ${String(item.code || item.type)} at ${String(item.path || item.id || '<document>')}: ${String(item.message || 'deep localization gate issue')}`;
      if (deepMode === 'error' && item.severity === 'blocker') errors.push(message);
      else warnings.push(message);
    }
  }
}

if (warnings.length) console.warn(warnings.join('\n'));
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`Content validation passed (${pageFiles.length} locale documents).`);
