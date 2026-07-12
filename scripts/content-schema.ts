export const CONTENT_LOCALES = ['en', 'fr', 'tr', 'ar-DZ'] as const;
export type ContentLocale = (typeof CONTENT_LOCALES)[number];

export const PAGE_DOCUMENT_REQUIRED = ['schemaVersion', 'pageId', 'locale', 'sourceLocale', 'revision', 'sourceRevision', 'status', 'seo', 'content'] as const;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function collectLeaves(value: unknown, path = ''): string[] {
  if (typeof value === 'string') return [path];
  if (Array.isArray(value)) return value.flatMap((entry, index) => collectLeaves(entry, `${path}[${index}]`));
  if (!isRecord(value)) return [];
  return Object.entries(value).flatMap(([key, entry]) => collectLeaves(entry, path ? `${path}.${key}` : key));
}

export function sameShape(source: unknown, target: unknown, path = ''): string[] {
  // Nullable editorial sections (for example `nearby`) may be intentionally
  // absent in one locale while the source remains present, so they do not
  // represent a translation key mismatch.
  if (source === null || target === null) return [];
  if (typeof source === 'string') return typeof target === 'string' ? [] : [path || '<root>'];
  if (Array.isArray(source)) {
    if (!Array.isArray(target) || source.length !== target.length) return [path || '<root>'];
    return source.flatMap((entry, index) => sameShape(entry, target[index], `${path}[${index}]`));
  }
  if (!isRecord(source) || !isRecord(target)) return [path || '<root>'];
  const issues: string[] = [];
  for (const key of Object.keys(source)) {
    if (!(key in target)) issues.push(`${path ? `${path}.` : ''}${key}`);
    else issues.push(...sameShape(source[key], target[key], `${path ? `${path}.` : ''}${key}`));
  }
  for (const key of Object.keys(target)) if (!(key in source)) issues.push(`${path ? `${path}.` : ''}${key} (extra)`);
  return issues;
}
