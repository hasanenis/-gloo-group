import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const LOCALES = ['en', 'fr', 'tr', 'ar-DZ'];
export const TARGET_LOCALES = ['fr', 'tr', 'ar-DZ'];
export const LOCALE_ALIASES = { ar: 'ar-DZ', dz: 'ar-DZ' };

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT_DIR = path.resolve(HERE, '..');
export const CONTENT_DIR = path.join(ROOT_DIR, 'content');

export function normalizeLocale(value) {
  const normalized = String(value || '').trim();
  return LOCALE_ALIASES[normalized] || normalized;
}

export function assertLocale(value) {
  const locale = normalizeLocale(value);
  if (!LOCALES.includes(locale)) throw new Error(`Unsupported locale: ${value}`);
  return locale;
}

export function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function documentRevision(document) {
  const copy = { ...document };
  delete copy.revision;
  delete copy.status;
  delete copy.updatedAt;
  return crypto.createHash('sha256').update(stableStringify(copy)).digest('hex').slice(0, 16);
}

function safeSegment(value, label) {
  const text = String(value || '').trim();
  if (!text || text.includes('\0') || text.includes('\\') || text.includes('..')) throw new Error(`Invalid ${label}`);
  return text;
}

export function documentPath({ pageId, locale, shared = false }) {
  const normalizedLocale = assertLocale(locale);
  const cleanPage = safeSegment(pageId, 'pageId').replace(/^\/+|\/+$/g, '');
  if (!cleanPage) throw new Error('pageId is required');
  const base = shared ? path.join(CONTENT_DIR, 'shared') : path.join(CONTENT_DIR, 'pages', ...cleanPage.split('/').map((part) => safeSegment(part, 'pageId')));
  const target = path.resolve(base, `${normalizedLocale}.json`);
  const contentRoot = path.resolve(CONTENT_DIR);
  if (!target.startsWith(`${contentRoot}${path.sep}`)) throw new Error('Content path escapes content directory');
  return target;
}

function relativePageId(file) {
  const relative = path.relative(path.join(CONTENT_DIR, 'pages'), file);
  const parts = relative.split(path.sep);
  parts.pop();
  return parts.join('/');
}

export function validateDocument(document, { expectedPageId, expectedLocale, allowDraft = true, shared = false } = {}) {
  if (!document || typeof document !== 'object' || Array.isArray(document)) throw new Error('Page document must be an object.');
  if (document.schemaVersion !== 1) throw new Error('Unsupported page document schemaVersion; expected 1.');
  if (!shared && (typeof document.pageId !== 'string' || !document.pageId.trim())) throw new Error('Page document pageId is required.');
  if (expectedPageId && !shared && document.pageId !== expectedPageId) throw new Error(`pageId mismatch: ${document.pageId}`);
  const locale = assertLocale(document.locale);
  if (expectedLocale && locale !== assertLocale(expectedLocale)) throw new Error(`locale mismatch: ${locale}`);
  if (document.sourceLocale !== 'en') throw new Error('sourceLocale must be en.');
  if (!allowDraft && document.status !== 'approved') throw new Error('Only approved page documents may be published.');
  if (!['draft', 'review', 'approved'].includes(document.status)) throw new Error('status must be draft, review, or approved.');
  if (!shared) {
    if (!document.seo || typeof document.seo !== 'object') throw new Error('seo metadata is required.');
    for (const field of ['title', 'description', 'socialTitle', 'socialDescription']) {
      if (typeof document.seo[field] !== 'string') throw new Error(`seo.${field} must be a string.`);
    }
  }
  if (!document.content || typeof document.content !== 'object') throw new Error('content is required.');
  if (typeof document.revision !== 'string' || !document.revision) throw new Error('revision is required.');
  if (typeof document.sourceRevision !== 'string' || !document.sourceRevision) throw new Error('sourceRevision is required.');
  return document;
}

export async function readJsonDocument(file, options = {}) {
  const text = await fs.readFile(file, 'utf8');
  const document = JSON.parse(text);
  return validateDocument(document, options);
}

/** Atomic on POSIX and best-effort atomic on Windows (rename replacement fallback). */
export async function writeJsonAtomic(file, value) {
  const directory = path.dirname(file);
  await fs.mkdir(directory, { recursive: true });
  const temporary = path.join(directory, `.${path.basename(file)}.${process.pid}.${crypto.randomBytes(6).toString('hex')}.tmp`);
  try {
    await fs.writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
    try {
      await fs.rename(temporary, file);
    } catch (error) {
      if (!['EEXIST', 'EPERM', 'ENOTEMPTY'].includes(error?.code)) throw error;
      await fs.rm(file, { force: true });
      await fs.rename(temporary, file);
    }
  } finally {
    await fs.rm(temporary, { force: true }).catch(() => {});
  }
}

export async function appendApprovalDecision(decision) {
  const file = path.join(ROOT_DIR, 'artifacts', 'localization', 'approval-decisions.jsonl');
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.appendFile(file, `${JSON.stringify({ schemaVersion: 1, ...decision })}\n`, 'utf8');
  return file;
}

export async function listContentDocuments() {
  const result = [];
  async function walk(directory, type) {
    let entries;
    try { entries = await fs.readdir(directory, { withFileTypes: true }); } catch (error) { if (error?.code === 'ENOENT') return; throw error; }
    for (const entry of entries) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(file, type);
      else if (entry.isFile() && entry.name.endsWith('.json') && !entry.name.endsWith('.schema.json')) {
        if (type === 'shared' && LOCALES.includes(entry.name.slice(0, -5))) {
          result.push({ type, pageId: 'shared', locale: normalizeLocale(entry.name.slice(0, -5)), file });
        } else if (type === 'page' && LOCALES.includes(entry.name.slice(0, -5))) {
          result.push({ type, pageId: relativePageId(file), locale: normalizeLocale(entry.name.slice(0, -5)), file });
        }
      }
    }
  }
  await walk(path.join(CONTENT_DIR, 'shared'), 'shared');
  await walk(path.join(CONTENT_DIR, 'pages'), 'page');
  return result.sort((a, b) => `${a.type}/${a.pageId}/${a.locale}`.localeCompare(`${b.type}/${b.pageId}/${b.locale}`));
}

export async function readDocument({ pageId, locale, shared = false }) {
  const file = documentPath({ pageId, locale, shared });
  return readJsonDocument(file, { expectedPageId: shared ? 'shared' : pageId, expectedLocale: locale, shared });
}

export async function writeDocument({ pageId, locale, shared = false, document }) {
  const normalizedLocale = assertLocale(locale);
  const expectedPageId = shared ? 'shared' : pageId;
  validateDocument(document, { expectedPageId, expectedLocale: normalizedLocale, shared });
  const file = documentPath({ pageId: shared ? 'shared' : pageId, locale: normalizedLocale, shared });
  await writeJsonAtomic(file, document);
  return { file, document };
}

export function flattenStrings(value, prefix = '', output = []) {
  if (typeof value === 'string') {
    output.push({ path: prefix, source: value });
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => flattenStrings(item, prefix ? `${prefix}.${index}` : String(index), output));
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) flattenStrings(child, prefix ? `${prefix}.${key}` : key, output);
  }
  return output;
}

export function getAtPath(value, fieldPath) {
  return fieldPath.split('.').reduce((current, segment) => current?.[segment], value);
}

export function setAtPath(value, fieldPath, next) {
  const segments = fieldPath.split('.');
  let cursor = value;
  segments.forEach((segment, index) => {
    const last = index === segments.length - 1;
    if (last) cursor[segment] = next;
    else {
      if (!cursor[segment] || typeof cursor[segment] !== 'object') cursor[segment] = /^\d+$/.test(segments[index + 1]) ? [] : {};
      cursor = cursor[segment];
    }
  });
  return value;
}

export function clone(value) {
  return JSON.parse(JSON.stringify(value));
}
