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
  telephone: ['+213 542 819 461', '+90 542 479 5700'],
  areaServed: ['Algeria', 'Algiers', 'Tipaza', 'Mostaganem', 'Boumerdes'],
};

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
