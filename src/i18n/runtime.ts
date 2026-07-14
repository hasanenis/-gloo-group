export type Locale = 'en' | 'fr' | 'ar-DZ' | 'tr';
export type LegacyLocale = 'dz';
export type StoredLocale = Locale | LegacyLocale;

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

export type LocalizedString = {
  en: string;
  fr?: string;
  'ar-DZ'?: string;
  dz?: string;
  tr?: string;
};

// Match both double-encoded text (Ãƒ...) and the more common single-pass
// UTF-8 mojibake (Ø§, Ù„, Ã¼, etc.) before it reaches the UI.
const MOJIBAKE_MARKERS = /(?:[ÃÂÄÅØÙâð][^\x00-\x7F]|ï¿½)/u;

function decodeMojibakeOnce(value: string): string | null {
  try {
    const bytes = Uint8Array.from(value, (character) => character.charCodeAt(0) & 0xff);
    const decoded = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    return decoded === value ? null : decoded;
  } catch {
    return null;
  }
}

/** Repairs UTF-8 bytes that were accidentally decoded as Windows-1252/Latin-1. */
export function repairMojibake(value: string): string {
  let repaired = value;
  for (let pass = 0; pass < 3 && MOJIBAKE_MARKERS.test(repaired); pass += 1) {
    const decoded = decodeMojibakeOnce(repaired);
    if (!decoded || decoded === repaired) break;
    if ((decoded.match(MOJIBAKE_MARKERS) ?? []).length >= (repaired.match(MOJIBAKE_MARKERS) ?? []).length) break;
    repaired = decoded;
  }
  return repaired;
}

function hasArabic(value: string) {
  return /[\u0600-\u06ff]/u.test(value);
}

function hasLatinWords(value: string) {
  return (value.match(/[A-Za-zÀ-ÿ]+/gu) ?? []).length;
}

function isAcronymToken(word: string) {
  return /^(?:[A-Z]{2,6}|[A-Z]?\d+(?:[+/.-][A-Z\d]+)*)$/.test(word);
}

function hasMixedArabicLatinWords(value: string) {
  const latinWords = value.match(/[A-Za-zÀ-ÿ]+/gu) ?? [];
  return latinWords.some((word) => !isAcronymToken(word));
}

function hasForeignSentenceConnectors(value: string) {
  return (value.match(/\b(?:and|with|the|from|into|for|including|et|avec|des|les|du|de|la|le)\b/giu) ?? []).length;
}

/** Avoids displaying generated seed strings that visibly mix whole sentences. */
function isUsableForLocale(value: string, locale: Locale) {
  if (!value.trim()) return false;
  if (locale === 'ar-DZ') {
    // Arabic copy may legitimately contain company names, people and
    // technical abbreviations in Latin script. Only reject a value when it
    // contains no Arabic at all and reads like a foreign sentence.
    if (!hasArabic(value) && hasMixedArabicLatinWords(value)) return false;
  }
  if (locale === 'tr' && (hasArabic(value) || hasForeignSentenceConnectors(value) > 1)) return false;
  return true;
}

export function normalizeLocale(value: string | null | undefined): Locale {
  if (value === 'fr' || value === 'ar-DZ' || value === 'tr' || value === 'en') return value;
  if (value === 'dz') return 'ar-DZ';
  return 'en';
}

export function isLocale(value: string | null): value is StoredLocale {
  return value === 'en' || value === 'fr' || value === 'ar-DZ' || value === 'tr' || value === 'dz';
}

export function legacyLocale(locale: Locale): LegacyLocale | Locale {
  return locale === 'ar-DZ' ? 'dz' : locale;
}

export function pickLocaleText(locale: Locale, value: LocalizedString): string {
  const direct = repairMojibake(value[locale] ?? value[legacyLocale(locale)] ?? '');
  return isUsableForLocale(direct, locale) ? direct : repairMojibake(value.en);
}
