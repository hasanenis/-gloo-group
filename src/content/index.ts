import { useMemo } from 'react';
import { CONTENT_LOCALES, type ContentLocale, type PageDocument, type PageManifest, type SharedDocument } from './types';

export * from './types';

type JsonModule = { default: unknown };

const pageModules = import.meta.glob('../../content/pages/**/*.json', { eager: true }) as Record<string, JsonModule>;
const sharedModules = import.meta.glob('../../content/shared/*.json', { eager: true }) as Record<string, JsonModule>;

function normalizeLocale(locale: ContentLocale | 'dz' | string): ContentLocale {
  return locale === 'dz' ? 'ar-DZ' : (CONTENT_LOCALES.includes(locale as ContentLocale) ? locale as ContentLocale : 'en');
}

function pageModuleKey(pageId: string, locale: ContentLocale) {
  return `../../content/pages/${pageId}/${locale}.json`;
}

function assertPage<T>(value: unknown, pageId: string, locale: ContentLocale): PageDocument<T> {
  if (!value || typeof value !== 'object') throw new Error(`Missing content document: ${pageId}/${locale}`);
  const document = value as Partial<PageDocument<T>>;
  if (document.pageId !== pageId || document.locale !== locale || !document.content || !document.seo) {
    throw new Error(`Invalid content document: ${pageId}/${locale}`);
  }
  if (document.status !== 'approved') throw new Error(`Content is not approved: ${pageId}/${locale}`);
  return document as PageDocument<T>;
}

export function getPageContent<T = unknown>(pageId: string, locale: ContentLocale | 'dz' = 'en'): PageDocument<T> {
  const normalized = normalizeLocale(locale);
  const module = pageModules[pageModuleKey(pageId, normalized)];
  if (!module) throw new Error(`No page content registered for ${pageId}/${normalized}`);
  return assertPage<T>(module.default, pageId, normalized);
}

export function getSharedContent(locale: ContentLocale | 'dz' = 'en'): SharedDocument {
  const normalized = normalizeLocale(locale);
  const module = sharedModules[`../../content/shared/${normalized}.json`];
  if (!module) throw new Error(`No shared content registered for ${normalized}`);
  const value = module.default as SharedDocument;
  if (value.locale !== normalized || value.status !== 'approved') throw new Error(`Invalid shared content: ${normalized}`);
  return value;
}

export function usePageContent<T = unknown>(pageId: string, locale: ContentLocale | 'dz' = 'en') {
  const normalized = normalizeLocale(locale);
  return useMemo(() => getPageContent<T>(pageId, normalized), [pageId, normalized]);
}

export function useSharedContent(locale: ContentLocale | 'dz' = 'en') {
  const normalized = normalizeLocale(locale);
  return useMemo(() => getSharedContent(normalized), [normalized]);
}

export function getProjectPage<T = unknown>(slug: string, locale: ContentLocale | 'dz' = 'en') {
  return getPageContent<T>(`projects/${slug}`, locale);
}

export function localizedPath(locale: ContentLocale | 'dz', route: string): string {
  const normalized = normalizeLocale(locale);
  const cleanRoute = route === '/' ? '' : `/${route.replace(/^\/+/, '').replace(/\/+$/, '')}`;
  const segment = normalized === 'ar-DZ' ? 'ar' : normalized;
  return `/${segment}${cleanRoute}`;
}

export function getPageManifest(pageId: string): PageManifest {
  const key = `../../content/pages/${pageId}/page.json`;
  const module = pageModules[key];
  if (!module) throw new Error(`No page manifest registered for ${pageId}`);
  return module.default as PageManifest;
}

export function isContentLocale(value: string): value is ContentLocale {
  return CONTENT_LOCALES.includes(value as ContentLocale);
}
