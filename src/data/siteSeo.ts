import type { Locale } from '../i18n';

export type BrandEntity = {
  legalName: string;
  brandName: string;
  alternateNames: string[];
  url: string;
  logo: string;
  sameAs: string[];
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  email: string;
  telephone: string[];
  areaServed: string[];
};

export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://igloogroupe.com').replace(/\/$/u, '');

export type HreflangAlternate = {
  hreflang: string;
  locale: Locale;
};

/** One canonical company entity for every locale and every public brand name. */
export const brandEntity: BrandEntity = {
  legalName: 'SARL Igloo Yapi Construction',
  brandName: 'Igloo Construction',
  alternateNames: [
    'Igloo',
    '\u0130gloo',
    'Igloo Groupe',
    '\u0130gloo Groupe',
    'Igloo Group',
    '\u0130gloo Group',
    'Igloo B\u00e2timent',
    '\u0130gloo B\u00e2timent',
    'Igloo Batiment',
    '\u0130gloo Batiment',
    'Igloo Construction',
    '\u0130gloo Construction',
    'Igloo Yap\u0131',
    '\u0130gloo Yap\u0131',
    'Igloo Yapi',
    '\u0130gloo Yapi',
  ],
  url: SITE_URL,
  logo: `${SITE_URL}/brand-logo.svg`,
  sameAs: [],
  address: {
    streetAddress: 'No. 8, Rue Krouch Slimane, Closan Jean Lot no. 1-31, RDC',
    addressLocality: 'Bir Khadem',
    addressRegion: 'Algiers',
    addressCountry: 'DZ',
  },
  email: 'info@igloogroupe.com',
  telephone: [],
  areaServed: ['Algeria', 'Algiers', 'Tipaza', 'Mostaganem', 'Boumerdes'],
};

/** Hreflang annotations intentionally include both generic French and French-Algerian variants. */
export const HREFLANG_ALTERNATES: ReadonlyArray<HreflangAlternate> = [
  { hreflang: 'en', locale: 'en' },
  { hreflang: 'fr', locale: 'fr' },
  { hreflang: 'fr-DZ', locale: 'fr' },
  { hreflang: 'tr', locale: 'tr' },
  { hreflang: 'ar-DZ', locale: 'ar-DZ' },
];

export const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/homepage/company-profile-showcase.png`;

export const SERVICE_SLUGS = [
  'general-contracting',
  'residential-construction',
  'commercial-construction',
  'infrastructure-works',
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export function isServiceSlug(value: string | undefined): value is ServiceSlug {
  return Boolean(value && SERVICE_SLUGS.includes(value as ServiceSlug));
}

export function localeHreflang(locale: Locale): string {
  return locale === 'ar-DZ' ? 'ar-DZ' : locale;
}

/** Document-language tag used in the rendered HTML and structured metadata. */
export function documentLanguageTag(locale: Locale): string {
  return locale === 'fr' ? 'fr-DZ' : locale;
}
