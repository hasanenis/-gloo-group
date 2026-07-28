import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { i18n, type Messages } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { uiMessages, type UiMessageKey } from './i18n/messages';
import { repairMojibake } from './i18n/runtime';
import { runtimeCatalogs } from './i18n/catalogs.generated';
import { getSharedContent } from './content';
import { documentLanguageTag } from './data/siteSeo';

export type Locale = 'en' | 'fr' | 'ar-DZ' | 'tr';
export type LegacyLocale = 'dz';
export type StoredLocale = Locale | LegacyLocale;
export type { UiMessageKey } from './i18n/messages';

/**
 * Locales that render right-to-left. Currently Algerian Arabic.
 * Used to set `document.documentElement.dir` for correct layout flow.
 */
export const RTL_LOCALES: ReadonlySet<Locale> = new Set(['ar-DZ']);

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  'ar-DZ': 'الدارجة الجزائرية',
  tr: 'Türkçe',
};

export const LOCALE_BADGES: Record<Locale, string> = {
  en: 'EN',
  fr: 'FR',
  'ar-DZ': 'DZ',
  tr: 'TR',
};

export const LOCALE_CODES: ReadonlyArray<Locale> = ['en', 'fr', 'ar-DZ', 'tr'];

/** URL segment used for each supported locale. Keep these short and stable so
 * localized routes remain indexable and easy to share. */
export const LOCALE_PATH_SEGMENTS: Record<Locale, string> = {
  en: 'en',
  fr: 'fr',
  tr: 'tr',
  'ar-DZ': 'ar',
};

const LOCALE_SEGMENT_TO_LOCALE: Record<string, Locale> = {
  en: 'en',
  fr: 'fr',
  tr: 'tr',
  ar: 'ar-DZ',
  'ar-dz': 'ar-DZ',
  dz: 'ar-DZ',
};

export type LocalizedString = {
  en: string;
  fr?: string;
  'ar-DZ'?: string;
  dz?: string;
  tr?: string;
};

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: UiMessageKey) => string;
};

const STORAGE_KEY = 'igloo:locale';
const catalogMessagesByLocale: Record<Locale, Messages> = {
  en: runtimeCatalogs.en as unknown as Messages,
  fr: runtimeCatalogs.fr as unknown as Messages,
  'ar-DZ': runtimeCatalogs['ar-DZ'] as unknown as Messages,
  tr: runtimeCatalogs.tr as unknown as Messages,
};
const loadedLocales = new Set<Locale>();
const sharedUiKeys: Partial<Record<UiMessageKey, string>> = {
  home: 'home',
  projects: 'projects',
  company: 'company',
  contact: 'contact',
  services: 'services',
  allProjects: 'allProjects',
  openProject: 'openProject',
  readMore: 'readMore',
  previous: 'previous',
  next: 'next',
  languageSelector: 'languageSelector',
  projectOverview: 'projectOverview',
  projectDetails: 'projectDetails',
  construction: 'construction',
  projectGallery: 'projectGallery',
  facilities: 'facilities',
  whatsAround: 'nearby',
  faq: 'faq',
  relatedProjects: 'relatedProjects',
  chat: 'discuss',
};

function repairCatalogValue(value: unknown): unknown {
  if (typeof value === 'string') return repairMojibake(value);
  if (Array.isArray(value)) return value.map(repairCatalogValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, repairCatalogValue(entry)]));
  }
  return value;
}

export function normalizeLocale(value: string | null | undefined): Locale {
  if (value === 'fr' || value === 'ar-DZ' || value === 'tr' || value === 'en') return value;
  if (value === 'dz') return 'ar-DZ';
  return 'en';
}

export function localeFromPathname(pathname: string): Locale | undefined {
  const segment = pathname.split('/').filter(Boolean)[0]?.toLowerCase();
  return segment ? LOCALE_SEGMENT_TO_LOCALE[segment] : undefined;
}

export function localePathSegment(locale: Locale): string {
  return LOCALE_PATH_SEGMENTS[locale];
}

/** Prefix a route with a locale exactly once, preserving query and hash. */
export function localizedPath(locale: Locale, path = '/'): string {
  const match = path.match(/^([^?#]*)([?#].*)?$/);
  const pathname = match?.[1] || '/';
  const suffix = match?.[2] || '';
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const withoutLocale = normalized.replace(/^\/(?:en|fr|tr|ar|ar-dz|dz)(?=\/|$)/i, '') || '/';
  return `/${localePathSegment(locale)}${withoutLocale === '/' ? '' : withoutLocale}${suffix}`;
}

export function isLocale(value: string | null): value is StoredLocale {
  return value === 'en' || value === 'fr' || value === 'ar-DZ' || value === 'tr' || value === 'dz';
}

export function legacyLocale(locale: Locale): LegacyLocale | Locale {
  return locale === 'ar-DZ' ? 'dz' : locale;
}

async function loadCatalog(locale: Locale) {
  if (loadedLocales.has(locale)) return;

  i18n.load(locale, repairCatalogValue(catalogMessagesByLocale[locale]) as Messages);
  loadedLocales.add(locale);
}

export async function preloadLocaleCatalogs(locales: ReadonlyArray<Locale> = LOCALE_CODES) {
  await Promise.all(locales.map((locale) => loadCatalog(locale)));
}

export function pickLocaleText(locale: Locale, value: LocalizedString): string {
  const direct = value[locale] ?? value[legacyLocale(locale)] ?? value.en;
  return repairMojibake(direct);
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const pathLocale = localeFromPathname(location.pathname);
  const [locale, setLocaleState] = useState<Locale>(() =>
    pathLocale ?? normalizeLocale(localStorage.getItem(STORAGE_KEY)),
  );
  const [catalogVersion, setCatalogVersion] = useState(0);
  const [catalogReady, setCatalogReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setCatalogReady(false);

    const desiredLocale = pathLocale ?? locale;
    if (desiredLocale !== locale) {
      setLocaleState(desiredLocale);
      return () => {
        cancelled = true;
      };
    }

    void loadCatalog(desiredLocale).then(() => {
      if (cancelled) return;
      setCatalogReady(true);
      setCatalogVersion((version) => version + 1);
    });

    return () => {
      cancelled = true;
    };
  }, [pathLocale, locale]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = documentLanguageTag(locale);
    document.documentElement.dir = RTL_LOCALES.has(locale) ? 'rtl' : 'ltr';
    i18n.activate(locale);
  }, [locale]);

  /**
   * Activate the next catalog before changing React state. The application
   * surface is keyed by locale, so locale-specific GSAP and line-splitting
   * effects are cleaned up by React rather than requiring a browser reload.
   */
  const setLocale = useCallback((next: Locale) => {
    if (next === locale) return;

    setCatalogReady(false);
    void loadCatalog(next).then(() => {
      i18n.activate(next);
      localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.lang = documentLanguageTag(next);
      document.documentElement.dir = RTL_LOCALES.has(next) ? 'rtl' : 'ltr';
      navigate(localizedPath(next, `${location.pathname}${location.search}${location.hash}`));
    });
  }, [locale, location.hash, location.pathname, location.search, navigate]);

  const value = useMemo<LocaleContextValue>(() => ({
    locale,
    setLocale,
    t: (key) => {
      const sharedKey = sharedUiKeys[key];
      if (sharedKey) {
        const sharedValue = getSharedContent(locale).content[sharedKey];
        if (typeof sharedValue === 'string' && sharedValue.trim()) return repairMojibake(sharedValue);
      }
      return i18n._(uiMessages[key]);
    },
  }), [catalogVersion, locale, setLocale]);

  if (!catalogReady) return null;

  return (
    <I18nProvider i18n={i18n}>
      <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
    </I18nProvider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used inside LocaleProvider.');
  return context;
}

export function LocaleToggle({ className = '' }: { className?: string }) {
  const { locale, setLocale, t } = useLocale();
  return (
    <div
      className={`inline-flex items-center border border-current/30 text-[10px] font-semibold tracking-[0.14em] ${className}`}
      aria-label={t('languageSelector')}
    >
      {LOCALE_CODES.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLocale(option)}
          aria-pressed={locale === option}
          className={`px-2.5 py-1.5 transition-colors ${locale === option ? 'bg-[#e1251b] text-white' : 'hover:text-[#e1251b]'}`}
        >
          {LOCALE_BADGES[option]}
        </button>
      ))}
    </div>
  );
}
