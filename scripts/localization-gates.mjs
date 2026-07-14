/**
 * Shared deterministic quality gates for localized editorial documents.
 *
 * This module deliberately has no network or project-specific imports. It is
 * used by the offline test suite, batch jobs, approval commands, human edits,
 * and the TypeScript content validator.
 */

const ARABIC_INDIC_DIGITS = '\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669';
const EXTENDED_ARABIC_INDIC_DIGITS = '\u06f0\u06f1\u06f2\u06f3\u06f4\u06f5\u06f6\u06f7\u06f8\u06f9';
const GROUPING_SEPARATORS = /[.,\u00a0\u202f ]/u;
const DECIMAL_SEPARATORS = /[.,]/u;
const NUMBER_ATOM = '\\d+(?:(?:[.,\\u00a0\\u202f ])\\d+)*';
// Arabic prose commonly attaches the conjunction waw directly to a number
// (for example, "و38" or "و3"). Treat that conjunction as a valid numeric
// boundary without relaxing protection against digits embedded in words or
// technical identifiers.
const NUMERIC_START = '(?:(?<![\\p{L}\\d])|(?<=و))';

const DEFAULT_ALLOWED_LATIN = [
  'AADL', 'OPGI', 'LPA', 'LPL', 'LPP', 'TCE', 'VRD', 'MEP',
  'Igloo', 'Construction', 'SARL', 'Yapi', 'Boudouaou', 'Boumerdes',
  'Dely Brahim', 'Douaouda', 'Douira', 'Tipaza', 'Rahmania', 'Staoueli',
  'Rouiba', 'Reghaia', 'Bouraada', 'Sidi Abdallah', 'Sidi Benour',
  'Bas Mazagran', 'Bois des Cars', 'Alger', 'Algiers', 'R+8', 'R+9', 'R+13',
];

const FOREIGN_CONNECTORS = {
  tr: /(?<![\p{L}])(?:and|with|the|from|into|for|including|et|avec|des|les|du|la|le)(?![\p{L}])/giu,
  fr: /(?<![\p{L}])(?:and|with|the|from|into|for|including)(?![\p{L}])/giu,
};
const FOREIGN_ARABIC_UI_WORDS = /(?<![\p{L}])(?:project|type|total|housing|units?|market-rate|objective|client|nearby|places|number|blocks?|typologie|blocs?|completed|location|status)(?![\p{L}])/giu;

const NUMBER_WORDS = {
  en: {
    0: ['zero'], 1: ['one'], 2: ['two'], 3: ['three'], 4: ['four'],
    5: ['five'], 6: ['six'], 7: ['seven'], 8: ['eight'], 9: ['nine'],
    10: ['ten'], 11: ['eleven'], 12: ['twelve'],
  },
  fr: {
    0: ['zéro'], 1: ['un', 'une'], 2: ['deux'], 3: ['trois'], 4: ['quatre'],
    5: ['cinq'], 6: ['six'], 7: ['sept'], 8: ['huit'], 9: ['neuf'],
    10: ['dix'], 11: ['onze'], 12: ['douze'],
  },
  tr: {
    0: ['sıfır'], 1: ['bir'], 2: ['iki'], 3: ['üç'], 4: ['dört'],
    5: ['beş'], 6: ['altı'], 7: ['yedi'], 8: ['sekiz'], 9: ['dokuz'],
    10: ['on'], 11: ['on bir'], 12: ['on iki'],
  },
  'ar-DZ': {
    0: ['صفر'], 1: ['واحد', 'واحدة'], 2: ['اثنان', 'اثنين'], 3: ['ثلاثة'],
    4: ['أربعة'], 5: ['خمسة'], 6: ['ستة'], 7: ['سبعة'], 8: ['ثماني', 'ثمانية'],
    9: ['تسعة'], 10: ['عشرة'], 11: ['أحد عشر', 'إحدى عشرة'], 12: ['اثنا عشر', 'اثنتا عشرة'],
  },
};

function toAsciiDigits(text) {
  let output = '';
  for (const char of String(text ?? '')) {
    const arabicIndex = ARABIC_INDIC_DIGITS.indexOf(char);
    if (arabicIndex >= 0) { output += String(arabicIndex); continue; }
    const extendedIndex = EXTENDED_ARABIC_INDIC_DIGITS.indexOf(char);
    if (extendedIndex >= 0) { output += String(extendedIndex); continue; }
    output += char;
  }
  return output;
}

function stripLeadingZeroes(value) {
  const stripped = String(value).replace(/^0+(?=\d)/u, '');
  return stripped || '0';
}

function normalizeDecimal(integerPart, fractionPart) {
  const integer = stripLeadingZeroes(String(integerPart).replace(/[^\d]/gu, ''));
  const fraction = String(fractionPart).replace(/[^\d]/gu, '').replace(/0+$/u, '');
  return `${integer}.${fraction || '0'}`;
}

function localeGroupingAllowed(separator, locale) {
  if (separator === ' ' || separator === '\u00a0' || separator === '\u202f') return true;
  if (locale === 'en') return separator === ',';
  return separator === '.';
}

function splitNumericRun(raw) {
  return String(raw).split(/[.,\u00a0\u202f ]/u);
}

function isWhitespaceOnlyGrouping(raw, locale) {
  const parts = splitNumericRun(raw);
  if (parts.length < 2 || !parts.slice(1).every((part) => part.length === 3)) return false;
  const separators = [...String(raw).matchAll(/[.,\u00a0\u202f ]/gu)].map((match) => match[0]);
  if (!separators.every((separator) => localeGroupingAllowed(separator, locale))) return false;
  // "300 500" is more likely two values than a grouped 300500 value. A
  // one-to-three digit group such as "2 500" remains a valid grouping.
  if (separators.every((separator) => /\s/u.test(separator)) && parts[0].length === 3) return false;
  return true;
}

function genericNumberToken(raw, start, locale) {
  const ascii = toAsciiDigits(raw);
  const separatorMatches = [...ascii.matchAll(/[.,\u00a0\u202f ]/gu)];
  if (!separatorMatches.length) {
    return [{ raw: String(raw), normalized: stripLeadingZeroes(ascii), type: 'integer', start, end: start + String(raw).length }];
  }

  const parts = splitNumericRun(ascii);
  const separators = separatorMatches.map((match) => match[0]);
  const grouped = parts.length > 1
    && parts.slice(1).every((part) => part.length === 3)
    && (separators.every((separator) => localeGroupingAllowed(separator, locale)) || (parts.length === 2 && separators.length === 1))
    && !(separators.every((separator) => /\s/u.test(separator)) && parts[0].length === 3);

  if (grouped) {
    return [{
      raw: String(raw),
      normalized: stripLeadingZeroes(parts.join('')),
      type: 'integer',
      start,
      end: start + String(raw).length,
    }];
  }

  const decimalIndex = Math.max(ascii.lastIndexOf(','), ascii.lastIndexOf('.'));
  if (decimalIndex >= 0) {
    const integerPart = ascii.slice(0, decimalIndex).replace(/[.,\u00a0\u202f ]/gu, '');
    const fractionPart = ascii.slice(decimalIndex + 1).replace(/[.,\u00a0\u202f ]/gu, '');
    return [{
      raw: String(raw),
      normalized: normalizeDecimal(integerPart, fractionPart),
      type: 'decimal',
      start,
      end: start + String(raw).length,
    }];
  }

  const result = [];
  let offset = 0;
  for (const part of parts) {
    const partStart = String(raw).indexOf(part, offset);
    result.push({ raw: part, normalized: stripLeadingZeroes(part), type: 'integer', start: start + partStart, end: start + partStart + part.length });
    offset = partStart + part.length;
  }
  return result;
}

function makeToken(raw, start, end, type, normalized, endpoints) {
  return { raw: String(raw), normalized, type, start, end, ...(endpoints ? { endpoints } : {}) };
}

function overlaps(spans, start, end) {
  return spans.some((span) => start < span.end && end > span.start);
}

/**
 * Tokenize publication numbers while retaining their semantic type and
 * source positions. Locale-specific grouping is only accepted when the
 * separator is valid for that locale and the surrounding context is
 * unambiguous.
 */
export function tokenizeNumbers(text, locale = 'en') {
  const original = String(text ?? '');
  const ascii = toAsciiDigits(original);
  const spans = [];
  const tokens = [];
  const add = (start, end, type, normalized, endpoints) => {
    if (overlaps(spans, start, end)) return;
    spans.push({ start, end });
    tokens.push(makeToken(original.slice(start, end), start, end, type, normalized, endpoints));
  };

  const rangePattern = new RegExp(`${NUMERIC_START}(\\d{1,4})(?:st|nd|rd|th|e|º|°)?\\s*(?:[-–—]|(?:au|à|to)(?:\\s+the)?)\\s*(\\d{1,4})(?:st|nd|rd|th|e|º|°)?(?![\\p{L}\\d])`, 'giu');
  for (const match of ascii.matchAll(rangePattern)) {
    const start = match.index ?? 0;
    const end = start + match[0].length;
    const endpoints = [stripLeadingZeroes(match[1]), stripLeadingZeroes(match[2])];
    add(start, end, /(?:st|nd|rd|th|e|º|°)/iu.test(match[0]) ? 'ordinal-range' : 'range', endpoints.join('-'), endpoints);
  }

  const floorPattern = new RegExp(`${NUMERIC_START}R\\s*\\+\\s*\\d+(?![\\p{L}\\d])`, 'giu');
  for (const match of ascii.matchAll(floorPattern)) {
    const start = match.index ?? 0;
    add(start, start + match[0].length, 'floor-code', `R+${match[0].replace(/[^\d]/gu, '')}`);
  }

  const ratioPattern = new RegExp(`${NUMERIC_START}(${NUMBER_ATOM})\\s*[/⁄]\\s*(${NUMBER_ATOM})(?![\\p{L}\\d])`, 'giu');
  for (const match of ascii.matchAll(ratioPattern)) {
    const start = match.index ?? 0;
    const end = start + match[0].length;
    const left = genericNumberToken(match[1], start, locale)[0]?.normalized;
    const rightStart = start + match[0].lastIndexOf(match[2]);
    const right = genericNumberToken(match[2], rightStart, locale)[0]?.normalized;
    if (left && right) add(start, end, 'ratio', `${left}/${right}`, [left, right]);
  }

  const percentagePattern = new RegExp(`${NUMERIC_START}(${NUMBER_ATOM})\\s*(%|٪)(?![\\p{L}\\d])`, 'giu');
  for (const match of ascii.matchAll(percentagePattern)) {
    const start = match.index ?? 0;
    const number = genericNumberToken(match[1], start, locale)[0];
    if (number) add(start, start + match[0].length, 'percentage', `${number.normalized}%`);
  }

  const versionPattern = /(?<![\p{L}\d])\d{4}\.\d+(?![\p{L}\d])/gu;
  for (const match of ascii.matchAll(versionPattern)) {
    const start = match.index ?? 0;
    add(start, start + match[0].length, 'version-like', match[0]);
  }

  const ordinalPattern = new RegExp(`${NUMERIC_START}\\d{1,4}(?:st|nd|rd|th|e|º|°)(?![\\p{L}\\d])`, 'giu');
  for (const match of ascii.matchAll(ordinalPattern)) {
    const start = match.index ?? 0;
    const normalized = stripLeadingZeroes(match[0].replace(/(?:st|nd|rd|th|e|º|°)$/iu, ''));
    add(start, start + match[0].length, 'ordinal', normalized);
  }

  const genericPattern = new RegExp(`${NUMERIC_START}${NUMBER_ATOM}(?![\\p{L}\\d])`, 'gu');
  for (const match of ascii.matchAll(genericPattern)) {
    const start = match.index ?? 0;
    const end = start + match[0].length;
    if (overlaps(spans, start, end)) continue;
    for (const token of genericNumberToken(match[0], start, locale)) add(token.start, token.end, token.type, token.normalized);
  }

  return tokens.sort((a, b) => a.start - b.start || a.end - b.end);
}

/** Backward-compatible normalized values for older callers and reports. */
export function normalizeDigitRuns(text, locale = 'en') {
  return tokenizeNumbers(text, locale).flatMap((token) => {
    if (token.type === 'ratio' || token.type === 'range' || token.type === 'ordinal-range') return token.endpoints || token.normalized.split('-');
    if (token.type === 'floor-code') return [token.normalized.slice(2)];
    if (token.type === 'percentage') return [token.normalized.replace(/%$/u, '')];
    return [token.normalized];
  });
}

function multiset(values) {
  const map = new Map();
  for (const value of values) map.set(value, (map.get(value) || 0) + 1);
  return map;
}

function issue({ code, severity = 'blocker', path = null, sourceText = '', targetText = '', message, type = code }) {
  return { code, severity, path, id: path, sourceText, targetText, type, message };
}

function isComparableNumber(token) {
  return token.type !== 'version-like';
}

function sameNumber(a, b) {
  const sameRangeType = ['range', 'ordinal-range'].includes(a.type) && ['range', 'ordinal-range'].includes(b.type);
  return (a.type === b.type || sameRangeType) && a.normalized === b.normalized;
}

function floorCodeValue(token) {
  return token?.type === 'floor-code' ? Number(String(token.normalized).slice(2)) : null;
}

function floorExpansionContext(text, locale, token) {
  const value = String(text ?? '');
  const context = value.slice(Math.max(0, token.start - 60), Math.min(value.length, token.end + 60));
  if (locale === 'en') return /ground\s+floor[\s\S]{0,40}(?:upper\s+)?floors?/iu.test(context);
  if (locale === 'fr') return /rez[-\s]?de[-\s]?chaussée|étages?/iu.test(context);
  if (locale === 'tr') return /zemin|kat/iu.test(context);
  if (locale === 'ar-DZ') return /طابق|أرضي|أرضية/iu.test(context);
  return false;
}

function floorExpansionEquivalent(sourceToken, targetToken, sourceText, targetText, targetLocale) {
  const sourceFloor = floorCodeValue(sourceToken);
  const targetFloor = floorCodeValue(targetToken);
  if (sourceToken?.type === 'integer' && targetFloor !== null) {
    return Number(sourceToken.normalized) === targetFloor && floorExpansionContext(sourceText, 'en', sourceToken);
  }
  if (sourceFloor !== null && targetToken?.type === 'integer') {
    return sourceFloor === Number(targetToken.normalized) && floorExpansionContext(targetText, targetLocale, targetToken);
  }
  return false;
}

/** Compare type-aware numeric tokens and reject changed or extra values. */
export function numberPreservationIssues(sourceText, targetText, locale = 'en', path = null) {
  // Canonical source documents are English, so source punctuation follows
  // English grouping rules even when the target locale uses comma decimals.
  const sourceTokens = tokenizeNumbers(sourceText, 'en').filter(isComparableNumber);
  const targetTokens = tokenizeNumbers(targetText, locale).filter(isComparableNumber);
  const issues = [];
  const used = new Set();

  for (const sourceToken of sourceTokens) {
    const exactIndex = targetTokens.findIndex((targetToken, index) => !used.has(index) && sameNumber(sourceToken, targetToken));
    if (exactIndex >= 0) { used.add(exactIndex); continue; }

    const sameValueIndex = targetTokens.findIndex((targetToken, index) => !used.has(index) && targetToken.normalized === sourceToken.normalized);
    if (sameValueIndex >= 0) {
      const targetToken = targetTokens[sameValueIndex];
      used.add(sameValueIndex);
      issues.push(issue({
        code: 'NUMBER_TYPE_MISMATCH',
        path,
        sourceText,
        targetText,
        type: 'number',
        message: `Number type changed from ${sourceToken.type} (${sourceToken.raw}) to ${targetToken.type} (${targetToken.raw}).`,
      }));
      continue;
    }

    const duplicatedFloorCode = sourceToken.type === 'integer'
      && sourceTokens.some((otherToken) => otherToken.type === 'floor-code' && floorCodeValue(otherToken) === Number(sourceToken.normalized));
    const exactTargetFloorCode = duplicatedFloorCode
      && targetTokens.findIndex((targetToken, index) => !used.has(index) && targetToken.type === 'floor-code' && floorCodeValue(targetToken) === Number(sourceToken.normalized));
    if (duplicatedFloorCode && exactTargetFloorCode >= 0) {
      issues.push(issue({
        code: 'NUMBER_FLOOR_EXPANSION',
        severity: 'warning',
        path,
        sourceText,
        targetText,
        type: 'number',
        message: `Source integer ${sourceToken.raw} shares an equivalent floor code with a later source token.`,
      }));
      continue;
    }

    const floorEquivalentIndex = targetTokens.findIndex((targetToken, index) => !used.has(index) && floorExpansionEquivalent(sourceToken, targetToken, sourceText, targetText, locale));
    if (floorEquivalentIndex >= 0) {
      const targetToken = targetTokens[floorEquivalentIndex];
      used.add(floorEquivalentIndex);
      issues.push(issue({
        code: 'NUMBER_FLOOR_EXPANSION',
        severity: 'warning',
        path,
        sourceText,
        targetText,
        type: 'number',
        message: `Source ${sourceToken.type} (${sourceToken.raw}) is represented by an equivalent floor expansion/code (${targetToken.raw}).`,
      }));
      continue;
    }

    const numeric = Number(sourceToken.normalized);
    const words = NUMBER_WORDS[locale]?.[numeric] || [];
    const spelledOut = sourceToken.type === 'integer'
      && Number.isInteger(numeric)
      && numeric >= 0
      && numeric <= 12
      && words.some((word) => new RegExp(`(?<![\\p{L}])${word.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')}(?![\\p{L}])`, 'iu').test(String(targetText)));
    issues.push(issue({
      code: spelledOut ? 'NUMBER_WRITTEN_FORM' : 'NUMBER_MISSING',
      severity: spelledOut ? 'warning' : 'blocker',
      path,
      sourceText,
      targetText,
      type: 'number',
      message: spelledOut
        ? `Source number ${sourceToken.raw} appears as an approved written form in the target locale.`
        : `Source ${sourceToken.type} not preserved: ${sourceToken.raw}`,
    }));
  }

  for (const [index, targetToken] of targetTokens.entries()) {
    if (!used.has(index)) {
      const numeric = targetToken.type === 'floor-code' ? floorCodeValue(targetToken) : Number(targetToken.normalized);
      const matchingSourceFloor = sourceTokens.some((sourceToken) => floorCodeValue(sourceToken) === numeric);
      const matchingUsedTargetFloor = targetTokens.some((otherToken, otherIndex) => otherIndex !== index && used.has(otherIndex) && floorCodeValue(otherToken) === numeric);
      const matchingSourceExpandedInteger = targetToken.type === 'floor-code' && sourceTokens.some((sourceToken) => sourceToken.type === 'integer' && Number(sourceToken.normalized) === numeric && floorExpansionContext(sourceText, 'en', sourceToken));
      if (targetToken.type === 'floor-code' && matchingSourceExpandedInteger) {
        used.add(index);
        issues.push(issue({
          code: 'NUMBER_FLOOR_EXPANSION',
          severity: 'warning',
          path,
          sourceText,
          targetText,
          type: 'number',
          message: `Target floor code ${targetToken.raw} makes the source floor wording explicit.`,
        }));
        continue;
      }
      if (targetToken.type === 'integer' && floorExpansionContext(targetText, locale, targetToken) && (matchingSourceFloor || matchingUsedTargetFloor)) {
        used.add(index);
        issues.push(issue({
          code: 'NUMBER_FLOOR_EXPANSION',
          severity: 'warning',
          path,
          sourceText,
          targetText,
          type: 'number',
          message: `Target expansion number ${targetToken.raw} repeats an equivalent floor code.`,
        }));
        continue;
      }
      const writtenSource = targetToken.type === 'integer'
        && Number.isInteger(numeric)
        && numeric >= 0
        && numeric <= 12
        && (NUMBER_WORDS.en[numeric] || []).some((word) => new RegExp(`(?<![\\p{L}])${word}(?![\\p{L}])`, 'iu').test(String(sourceText)));
      if (writtenSource) {
        used.add(index);
        issues.push(issue({
          code: 'NUMBER_WRITTEN_FORM',
          severity: 'warning',
          path,
          sourceText,
          targetText,
          type: 'number',
          message: `Target number ${targetToken.raw} corresponds to an approved written form in the English source.`,
        }));
        continue;
      }
      issues.push(issue({
        code: 'NUMBER_EXTRA',
        path,
        sourceText,
        targetText,
        type: 'number',
        message: `Target contains an unsupported extra ${targetToken.type}: ${targetToken.raw}`,
      }));
    }
  }
  return issues;
}

function acceptedTermForms(term, locale) {
  const accepted = term?.accepted?.[locale] || term?.acceptedForms?.[locale];
  if (Array.isArray(accepted)) return accepted.filter(Boolean).map(String);
  if (typeof accepted === 'string' && accepted) return [accepted];
  return [term?.[locale] || term?.source].filter(Boolean).map(String);
}

export function protectedTermIssues(sourceText, targetText, locale, terms = []) {
  const issues = [];
  for (const term of terms || []) {
    if (!term?.source || !String(sourceText).includes(term.source)) continue;
    const accepted = acceptedTermForms(term, locale);
    if (accepted.length && !accepted.some((value) => String(targetText).includes(value))) {
      issues.push(issue({ code: 'PROTECTED_TERM_MISSING', path: null, sourceText, targetText, type: 'protected-term', message: `Missing protected term; expected one of: ${accepted.join(', ')}` }));
    }
  }
  return issues;
}

function protectedLatinPattern(terms = []) {
  const values = [...DEFAULT_ALLOWED_LATIN, ...terms.flatMap((term) => [term.source, ...Object.values(term).filter((value) => typeof value === 'string')])]
    .filter(Boolean)
    .map((value) => String(value).replace(/[.*+?^${}()|[\]\\]/gu, '\\$&'));
  return new RegExp(`(?:${values.join('|')})`, 'giu');
}

function stripAllowedLatin(text, terms) {
  return String(text)
    .replace(/https?:\/\/[^\s"']+/giu, ' ')
    .replace(protectedLatinPattern(terms), ' ')
    .replace(/\bF[345]\b/giu, ' ')
    .replace(/\bR\s*\+\s*\d+\b/giu, ' ');
}

/** Conservative locale leakage checks; proper names, codes and URLs are allowed. */
export function foreignLeakageIssues(text, locale, path = null, terms = []) {
  const value = String(text ?? '').trim();
  if (!value) return [];
  const issues = [];
  if (/[‪-‮⁦-⁩‎‏]/u.test(value)) {
    issues.push(issue({ code: 'BIDI_CONTROL_CHARACTER', path, targetText: value, type: 'foreign-leakage', message: 'Content must not contain bidi control characters.' }));
  }
  const stripped = stripAllowedLatin(value, terms);
  const latinWords = stripped.match(/[A-Za-zÀ-ÿ]+/gu) || [];

  if (locale === 'tr') {
    const connectorCount = (stripped.match(FOREIGN_CONNECTORS.tr) || []).length;
    if (/[\p{Script=Arabic}]/u.test(value)) {
      issues.push(issue({ code: 'FOREIGN_SCRIPT_LEAKAGE', path, targetText: value, type: 'foreign-leakage', message: 'Turkish text contains Arabic-script sentence content.' }));
    } else if (connectorCount > 1) {
      issues.push(issue({ code: 'FOREIGN_CONNECTOR_LEAKAGE', path, targetText: value, type: 'foreign-leakage', message: `Turkish text contains ${connectorCount} repeated foreign connector words.` }));
    } else if (connectorCount === 1) {
      issues.push(issue({ code: 'FOREIGN_CONNECTOR_LEAKAGE', severity: 'warning', path, targetText: value, type: 'foreign-leakage', message: 'Turkish text contains one suspicious foreign connector word.' }));
    }
  } else if (locale === 'fr') {
    const connectorCount = (stripped.match(FOREIGN_CONNECTORS.fr) || []).length;
    if (connectorCount > 1) {
      issues.push(issue({ code: 'FOREIGN_CONNECTOR_LEAKAGE', path, targetText: value, type: 'foreign-leakage', message: `French text contains ${connectorCount} repeated English connector words.` }));
    } else if (connectorCount === 1) {
      issues.push(issue({ code: 'FOREIGN_CONNECTOR_LEAKAGE', severity: 'warning', path, targetText: value, type: 'foreign-leakage', message: 'French text contains one suspicious English connector word.' }));
    }
  } else if (locale === 'ar-DZ') {
    const arabicWords = value.match(/[\p{Script=Arabic}]+/gu) || [];
    const isSentenceLength = value.split(/\s+/u).filter(Boolean).length >= 6;
    const hasForeignUiWords = FOREIGN_ARABIC_UI_WORDS.test(stripped);
    if (hasForeignUiWords) {
      issues.push(issue({ code: 'FOREIGN_UI_LEAKAGE', path, targetText: value, type: 'foreign-leakage', message: 'Arabic text contains an untranslated English UI word.' }));
    } else if (isSentenceLength && arabicWords.length === 0 && latinWords.length > 0) {
      issues.push(issue({ code: 'ARABIC_CONTENT_MISSING', path, targetText: value, type: 'foreign-leakage', message: 'Sentence-length Arabic content contains no meaningful Arabic words.' }));
    } else if (latinWords.length > 3) {
      issues.push(issue({ code: 'LATIN_LEAKAGE_REVIEW', severity: 'warning', path, targetText: value, type: 'foreign-leakage', message: `Arabic text contains ${latinWords.length} unprotected Latin-script words.` }));
    }
  }
  return issues;
}

const TURKISH_CONTRACTOR_VOICE_PATTERNS = [
  { pattern: /\bkonsiyerj\b/iu, phrase: 'konsiyerj', replacement: 'site hizmetleri için ayrılmış alanlar/bölümler' },
  { pattern: /\bkirala[\s-]*satın al\b/iu, phrase: 'kirala-satın al', replacement: 'kira ödeyerek satın alınabilen' },
  { pattern: /\bkira ödemeli (?:mülkiyet|konut)\b/iu, phrase: 'kira ödemeli mülkiyet/konut', replacement: 'kira ödeyerek satın alınabilen konutlar' },
  { pattern: /\bkira öder gibi ev sahibi\b/iu, phrase: 'kira öder gibi ev sahibi', replacement: 'kira ödeyerek satın alınabilen konutlar' },
  { pattern: /\baktif cephe\b/iu, phrase: 'aktif cephe', replacement: 'görünen fiziksel kullanımı doğrudan belirtin' },
  { pattern: /\bcephe (?:kurgusu|artikülasyonu|eklemlenmesi)\b/iu, phrase: 'cephe kurgusu/artikülasyonu/eklemlenmesi', replacement: 'görünen cephe elemanlarını doğrudan belirtin' },
  { pattern: /\bkentsel (?:bütünleşme|entegrasyon)\b/iu, phrase: 'kentsel bütünleşme/entegrasyon', replacement: 'doğrulanmış saha veya altyapı işini belirtin' },
  { pattern: /\bdüşey entegrasyon\b/iu, phrase: 'düşey entegrasyon', replacement: 'kat veya blok dağılımını doğrudan belirtin' },
  { pattern: /\btasarım (?:niyeti|dili)\b/iu, phrase: 'tasarım niyeti/dili', replacement: 'yalnızca görünen veya belgelenen unsuru belirtin' },
  { pattern: /\bmekânsal anlatı\b/iu, phrase: 'mekânsal anlatı', replacement: 'yerleşimi doğrudan belirtin' },
  { pattern: /\byerel sokak dokusu\b/iu, phrase: 'yerel sokak dokusu', replacement: 'belgelenmiş konumu veya saha işini belirtin' },
  { pattern: /\bmaster plan\b/iu, phrase: 'master plan', replacement: 'yerleşim veya blok dağılımını doğrudan belirtin' },
  { pattern: /\bsite hizmetleri bölümleri\b/iu, phrase: 'site hizmetleri bölümleri', replacement: 'site hizmetleri için ayrılmış bölümler yazın veya bu ikincil bilgiyi kısa başlıktan çıkarın' },
  { pattern: /\bbulunacak şekilde inşa edil/iu, phrase: 'bulunacak şekilde inşa edilmiştir', replacement: 'basit kullanım bilgisini "yer almaktadır" ile doğrudan belirtin' },
  { pattern: /\bkarma kullanımlı konut projesi\b/iu, phrase: 'karma kullanımlı konut projesi', replacement: 'konutları ve ticari alanları ayrı ve doğrudan belirtin' },
];

/** Block literal property translations and architecture-jury jargon in Turkish contractor copy. */
export function turkishContractorVoiceIssues(text, path = null) {
  const value = String(text ?? '').trim();
  if (!value) return [];
  return TURKISH_CONTRACTOR_VOICE_PATTERNS
    .filter(({ pattern }) => pattern.test(value))
    .map(({ phrase, replacement }) => issue({
      code: 'TURKISH_CONTRACTOR_VOICE',
      path,
      targetText: value,
      type: 'naturalness',
      message: `Turkish contractor copy contains "${phrase}"; ${replacement}.`,
    }));
}

function keyShapeIssues(source, target, path = '') {
  if (source === null || target === null) return [];
  if (typeof source === 'string') return typeof target === 'string' ? [] : [path || '<root>'];
  if (Array.isArray(source)) {
    if (!Array.isArray(target) || source.length !== target.length) return [path || '<root>'];
    return source.flatMap((item, index) => keyShapeIssues(item, target[index], `${path}[${index}]`));
  }
  if (!source || typeof source !== 'object' || !target || typeof target !== 'object' || Array.isArray(target)) return [path || '<root>'];
  const issues = [];
  for (const key of Object.keys(source)) {
    if (!(key in target)) issues.push(`${path ? `${path}.` : ''}${key}`);
    else issues.push(...keyShapeIssues(source[key], target[key], `${path ? `${path}.` : ''}${key}`));
  }
  for (const key of Object.keys(target)) if (!(key in source)) issues.push(`${path ? `${path}.` : ''}${key} (extra)`);
  return issues;
}

/** Validate FAQ structure, parity, IDs and non-empty useful answers. */
export function faqParityIssues(sourceDoc, targetDoc) {
  const sourceFaq = sourceDoc?.content?.faq;
  const targetFaq = targetDoc?.content?.faq;
  if (sourceFaq == null && targetFaq == null) return [];
  const issues = [];
  if (!Array.isArray(sourceFaq) || !Array.isArray(targetFaq)) {
    return [issue({ code: 'FAQ_SHAPE_INVALID', path: 'content.faq', sourceText: JSON.stringify(sourceFaq ?? null), targetText: JSON.stringify(targetFaq ?? null), type: 'faq-parity', message: 'FAQ must remain an array in every locale.' })];
  }
  if (sourceFaq.length !== targetFaq.length) {
    issues.push(issue({ code: 'FAQ_COUNT_MISMATCH', path: 'content.faq', sourceText: String(sourceFaq.length), targetText: String(targetFaq.length), type: 'faq-parity', message: `FAQ length mismatch: source has ${sourceFaq.length}, target has ${targetFaq.length}.` }));
  }
  const expectedKeys = sourceFaq.map((item) => Object.keys(item || {}).sort());
  targetFaq.forEach((item, index) => {
    const path = `content.faq[${index}]`;
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      issues.push(issue({ code: 'FAQ_SHAPE_INVALID', path, type: 'faq-parity', message: 'FAQ item must be an object.' }));
      return;
    }
    if (expectedKeys[index] && JSON.stringify(Object.keys(item).sort()) !== JSON.stringify(expectedKeys[index])) {
      issues.push(issue({ code: 'FAQ_SHAPE_INVALID', path, type: 'faq-parity', message: 'FAQ item keys must match the English source.' }));
    }
    if (sourceFaq[index]?.id !== undefined && item.id !== sourceFaq[index].id) {
      issues.push(issue({ code: 'FAQ_ID_MISMATCH', path: `${path}.id`, sourceText: String(sourceFaq[index].id), targetText: String(item.id), type: 'faq-parity', message: 'FAQ IDs must remain stable.' }));
    }
    const question = String(item.question ?? '').trim();
    const answer = String(item.answer ?? '').trim();
    if (!question || !answer) issues.push(issue({ code: 'FAQ_EMPTY_FIELD', path, targetText: JSON.stringify(item), type: 'faq-parity', message: 'FAQ question and answer must both be non-empty.' }));
    if (question && answer && question === answer) issues.push(issue({ code: 'FAQ_QUESTION_EQUALS_ANSWER', path, targetText: question, type: 'faq-parity', message: 'FAQ answer must not equal its question.' }));
  });
  return issues;
}

const FAQ_STOPWORDS = {
  en: new Set('what is are the of how where when why which does do did this that project development site works scope include includes covered used utilised utilized'.split(/\s+/u)),
  fr: new Set('quel quelle quels quelles est sont le la les de du des comment où quand pourquoi projet site travaux portée comprend utilisé utilisée'.split(/\s+/u)),
  tr: new Set('proje projenin nedir nasıl hangi kaç ne için bu sahada kapsamında kullanılan kullanılıyor değerlendirilmektedir nelerdir'.split(/\s+/u)),
  'ar-DZ': new Set('ما هو هي هل كيف أين متى لماذا أي المشروع الموقع الأعمال نطاق يتضمن مستخدم'.split(/\s+/u)),
};

function faqTopicTokens(text, locale) {
  const lowerLocale = locale === 'tr' ? 'tr-TR' : 'en-US';
  const stopwords = FAQ_STOPWORDS[locale] || FAQ_STOPWORDS.en;
  return (String(text || '').toLocaleLowerCase(lowerLocale).match(/[\p{L}\p{N}]{3,}/gu) || [])
    .filter((token) => !stopwords.has(token));
}

function faqTokensOverlap(questionTokens, answerTokens) {
  return questionTokens.some((questionToken) => answerTokens.some((answerToken) => {
    const questionStem = questionToken.slice(0, Math.min(4, questionToken.length));
    const answerStem = answerToken.slice(0, Math.min(4, answerToken.length));
    return questionStem.length >= 3 && (questionStem === answerStem || questionToken.startsWith(answerStem) || answerToken.startsWith(questionStem));
  }));
}

/** Flag high-signal FAQ answers that visibly switch to another topic. */
export function faqCoherenceIssues(sourceDoc, targetDoc, locale = 'en') {
  const sourceFaq = sourceDoc?.content?.faq;
  const targetFaq = targetDoc?.content?.faq;
  if (!Array.isArray(sourceFaq) || !Array.isArray(targetFaq)) return [];
  const issues = [];
  targetFaq.forEach((item, index) => {
    const question = String(item?.question || '').trim();
    const answer = String(item?.answer || '').trim();
    const questionTokens = faqTopicTokens(question, locale);
    const answerTokens = faqTopicTokens(answer, locale);
    if (questionTokens.length && answerTokens.length && !faqTokensOverlap(questionTokens, answerTokens)) {
      issues.push(issue({
        code: 'FAQ_ANSWER_TOPIC_MISMATCH',
        path: `content.faq[${index}].answer`,
        sourceText: String(sourceFaq[index]?.answer || ''),
        targetText: answer,
        type: 'faq-coherence',
        message: 'FAQ answer does not reuse a high-signal topic from its matching question; check that it answers the question directly instead of switching to another project fact.',
      }));
    }
    if (locale === 'tr' && /(?:yapısal|blok(?:ların)?\s+özellik)/iu.test(question) && /(?:kira ödeyerek|ticari alan|site hizmet)/iu.test(answer)) {
      issues.push(issue({
        code: 'FAQ_OFF_TOPIC_DETAIL',
        path: `content.faq[${index}].answer`,
        sourceText: String(sourceFaq[index]?.answer || ''),
        targetText: answer,
        type: 'faq-coherence',
        message: 'Yapısal özellikler cevabı finansman, ticari alan veya site hizmeti bilgisine geçmemelidir.',
      }));
    }
    if (locale === 'tr' && /zemin kat/iu.test(question) && /(?:R\s*\+\s*\d+|\bblok|üst kat)/iu.test(answer)) {
      issues.push(issue({
        code: 'FAQ_OFF_TOPIC_DETAIL',
        path: `content.faq[${index}].answer`,
        sourceText: String(sourceFaq[index]?.answer || ''),
        targetText: answer,
        type: 'faq-coherence',
        message: 'Zemin kat kullanımı cevabı blok veya üst kat bilgisine geçmemelidir.',
      }));
    }
  });
  return issues;
}

const PLACEHOLDER_PATTERN = /\{[a-zA-Z0-9_]+\}/gu;
const URL_PATTERN = /https?:\/\/[^\s"']+/gu;

export function placeholderIssues(sourceText, targetText, path = null) {
  const issues = [];
  for (const [pattern, label, code] of [[PLACEHOLDER_PATTERN, 'placeholder token', 'PLACEHOLDER_MUTATION'], [URL_PATTERN, 'URL', 'URL_MUTATION']]) {
    const sourceMatches = multiset(String(sourceText ?? '').match(pattern) || []);
    const targetMatches = multiset(String(targetText ?? '').match(pattern) || []);
    for (const [value, count] of sourceMatches) {
      if ((targetMatches.get(value) || 0) < count) issues.push(issue({ code, path, sourceText, targetText, type: 'placeholder', message: `Missing ${label} from target: ${value}` }));
    }
  }
  return issues;
}

function collectValuesByKey(node, path, out) {
  if (Array.isArray(node)) { node.forEach((item, index) => collectValuesByKey(item, `${path}[${index}]`, out)); return; }
  if (!node || typeof node !== 'object') return;
  for (const [key, value] of Object.entries(node)) {
    const nextPath = `${path}.${key}`;
    if (typeof value === 'string' && ['src', 'href', 'route', 'path', 'id', 'code'].includes(key)) out.set(nextPath, value);
    collectValuesByKey(value, nextPath, out);
  }
}

export function imagePathIssues(sourceDoc, targetDoc) {
  const sourceImages = sourceDoc?.content?.images;
  const targetImages = targetDoc?.content?.images;
  if (!sourceImages || !targetImages) return [];
  const sourcePaths = new Map();
  const targetPaths = new Map();
  const collectSrcPaths = (node, path, out) => {
    if (Array.isArray(node)) { node.forEach((item, index) => collectSrcPaths(item, `${path}.${index}`, out)); return; }
    if (!node || typeof node !== 'object') return;
    if (typeof node.src === 'string') out.set(`${path}.src`, node.src);
    for (const [key, value] of Object.entries(node)) collectSrcPaths(value, `${path}.${key}`, out);
  };
  collectSrcPaths(sourceImages, 'content.images', sourcePaths);
  collectSrcPaths(targetImages, 'content.images', targetPaths);
  const issues = [];
  for (const [path, value] of sourcePaths) {
    if (targetPaths.get(path) !== value) issues.push(issue({ code: 'IMAGE_SRC_MUTATION', path, sourceText: value, targetText: targetPaths.get(path) || '', type: 'image-path', message: `Image src must remain byte-identical: expected ${value}` }));
  }
  for (const [path, value] of targetPaths) if (!sourcePaths.has(path)) issues.push(issue({ code: 'IMAGE_SRC_EXTRA', path, targetText: value, type: 'image-path', message: `Target contains an image src absent from the English source: ${value}` }));
  return issues;
}

export function stableIdentifierIssues(sourceDoc, targetDoc) {
  const sourceValues = new Map();
  const targetValues = new Map();
  collectValuesByKey(sourceDoc, '', sourceValues);
  collectValuesByKey(targetDoc, '', targetValues);
  const issues = [];
  for (const [path, value] of sourceValues) {
    if (targetValues.get(path) !== value) issues.push(issue({ code: 'STABLE_IDENTIFIER_MUTATION', path, sourceText: value, targetText: targetValues.get(path) || '', type: 'identifier', message: `Stable technical identifier must remain byte-identical: ${value}` }));
  }
  return issues;
}

function flattenText(value, prefix = '', out = []) {
  if (typeof value === 'string') out.push({ path: prefix, source: value });
  else if (Array.isArray(value)) value.forEach((item, index) => flattenText(item, `${prefix}[${index}]`, out));
  else if (value && typeof value === 'object') Object.entries(value).forEach(([key, child]) => flattenText(child, prefix ? `${prefix}.${key}` : key, out));
  return out;
}

function getAtPath(value, fieldPath) {
  return String(fieldPath).replace(/\[(\d+)\]/gu, '.$1').split('.').filter(Boolean).reduce((current, segment) => current?.[segment], value);
}

function factValue(facts, reference) {
  if (reference == null) return null;
  if (typeof reference !== 'string') return reference;
  const value = getAtPath(facts, reference);
  return value == null || typeof value === 'object' ? reference : value;
}

function fieldContractIssues(sourceDoc, targetDoc, facts, contracts = {}, { enforceFacts = false } = {}) {
  const issues = [];
  const entries = Object.entries(contracts?.contracts || contracts || {});
  for (const [fieldPath, contract] of entries) {
    if (!contract || typeof contract !== 'object') continue;
    const value = getAtPath(targetDoc, fieldPath);
    const text = flattenText(value, fieldPath).map((item) => item.source).join(' ').trim();
    if (!text && contract.omitWhenUnsupported) continue;
    if (Number.isFinite(contract.maxWords)) {
      for (const leaf of flattenText(value, fieldPath)) {
        if (leaf.source.split(/\s+/u).filter(Boolean).length > contract.maxWords) issues.push(issue({ code: 'FIELD_MAX_WORDS', path: leaf.path, targetText: leaf.source, type: 'field-contract', message: `${leaf.path} exceeds its ${contract.maxWords}-word contract.` }));
      }
    }
    if (enforceFacts || contract.enforceTargetFacts === true) {
      for (const fact of [...(contract.requiredFacts || []), ...(contract.requiresFact ? [contract.requiresFact] : [])]) {
        const expected = factValue(facts, fact);
        if (expected != null && String(expected) && !text.includes(String(expected))) issues.push(issue({ code: 'FIELD_REQUIRED_FACT_MISSING', path: fieldPath, targetText: text, type: 'field-contract', message: `${fieldPath} is missing required fact: ${fact}` }));
      }
      for (const fact of contract.forbiddenFacts || []) {
        const forbidden = factValue(facts, fact);
        if (forbidden != null && String(forbidden) && text.includes(String(forbidden))) issues.push(issue({ code: 'FIELD_FORBIDDEN_FACT', path: fieldPath, targetText: text, type: 'field-contract', message: `${fieldPath} contains forbidden fact: ${fact}` }));
      }
    }
    for (const repeatedPath of contract.mustNotRepeat || []) {
      const other = flattenText(getAtPath(targetDoc, repeatedPath), repeatedPath).map((item) => item.source).join(' ').trim();
      if (text && other && text === other) issues.push(issue({ code: 'FIELD_REPETITION', path: fieldPath, targetText: text, type: 'field-contract', message: `${fieldPath} repeats ${repeatedPath} verbatim.` }));
    }
  }
  return issues;
}

export function requiredFactIssues(pageId, target, editorialSegments, projectOverrides) {
  const issues = [];
  const projectSlug = String(pageId || '').startsWith('projects/') ? String(pageId).slice('projects/'.length) : null;
  const requiredFact = projectSlug ? projectOverrides?.[projectSlug]?.requiredFacts?.[target] : null;
  const text = editorialSegments.map((item) => String(item.text ?? item.source ?? '')).join(' ');
  const clauses = Array.isArray(requiredFact)
    ? requiredFact.flatMap((value) => String(value).split(/\s*[;,؛،]\s*/u))
    : String(requiredFact || '').split(/\s*[;,؛،]\s*/u);
  for (const clause of clauses.map((value) => value.trim()).filter(Boolean)) {
    if (!text.includes(clause)) {
      issues.push(issue({ code: 'PROJECT_REQUIRED_FACT_MISSING', path: 'content', targetText: text, type: 'project-override', message: `Required project fact is missing: ${clause}` }));
    }
  }
  return issues;
}

function sourceFaqAnswerIsOffTopic(source, fieldPath) {
  const match = String(fieldPath).match(/^content\.faq(?:\[(\d+)\]|\.(\d+))\.answer$/u);
  if (!match || !source?.content?.faq) return false;
  const index = Number(match[1] ?? match[2]);
  const question = String(source.content.faq[index]?.question ?? '');
  const answer = String(source.content.faq[index]?.answer ?? '');
  const questionTopics = faqTopicTokens(question, 'en');
  if (!questionTopics.length || !answer) return false;
  const answerWords = new Set(faqTopicTokens(answer, 'en'));
  return !questionTopics.some((token) => answerWords.has(token));
}

/**
 * Shared entry point. The new document-oriented shape is accepted alongside
 * the older segment-oriented shape used by existing jobs.
 */
export function runTargetGates({
  sourceDoc,
  targetDoc,
  candidateDoc,
  sourceDocument,
  targetDocument,
  locale,
  target,
  facts,
  terminology,
  protectedTerms,
  fieldContracts,
  sourceSegments,
  candidateSegments,
  pageId,
  projectOverrides,
} = {}) {
  const source = sourceDoc || sourceDocument;
  const candidate = targetDoc || targetDocument || candidateDoc;
  const targetLocale = locale || target;
  const terms = terminology || protectedTerms || { terms: [] };
  const sourceFields = sourceSegments || (source ? [...flattenText(source.seo, 'seo'), ...flattenText(source.content, 'content')] : []);
  const candidateFields = candidateSegments || (candidate ? [...flattenText(candidate.seo, 'seo'), ...flattenText(candidate.content, 'content')] : []);
  const candidateByPath = new Map(candidateFields.map((item) => [item.path, item.text ?? item.source ?? '']));
  const issues = [];
  for (const segment of sourceFields) {
    const sourceText = String(segment.source ?? segment.text ?? '');
    const targetText = String(candidateByPath.get(segment.path) ?? '');
    const repairedFaqAnswer = sourceFaqAnswerIsOffTopic(source, segment.path);
    if (!repairedFaqAnswer) {
      issues.push(...numberPreservationIssues(sourceText, targetText, targetLocale, segment.path));
      issues.push(...protectedTermIssues(sourceText, targetText, targetLocale, terms.terms).map((item) => ({ ...item, path: segment.path, id: segment.path })));
    }
    if (!String(segment.path).endsWith('.src')) issues.push(...foreignLeakageIssues(targetText, targetLocale, segment.path, terms.terms));
    if (targetLocale === 'tr' && !String(segment.path).endsWith('.src')) issues.push(...turkishContractorVoiceIssues(targetText, segment.path));
    issues.push(...placeholderIssues(sourceText, targetText, segment.path));
  }
  if (source && candidate) {
    const contentShape = keyShapeIssues(source.content, candidate.content, 'content');
    for (const shape of contentShape) issues.push(issue({ code: 'CONTENT_SHAPE_MISMATCH', path: shape, sourceText: JSON.stringify(source.content), targetText: JSON.stringify(candidate.content), type: 'shape', message: `Content shape mismatch at ${shape}.` }));
    issues.push(...faqParityIssues(source, candidate));
    issues.push(...faqCoherenceIssues(source, candidate, targetLocale));
    issues.push(...imagePathIssues(source, candidate));
    issues.push(...stableIdentifierIssues(source, candidate));
  }
  if (fieldContracts) issues.push(...fieldContractIssues(candidate || {}, candidate || {}, facts, fieldContracts, { enforceFacts: targetLocale === 'en' }));
  if (pageId && projectOverrides) issues.push(...requiredFactIssues(pageId, targetLocale, candidateFields, projectOverrides));
  const blockers = issues.filter((item) => item.severity === 'blocker');
  const warnings = issues.filter((item) => item.severity === 'warning');
  return {
    status: blockers.length ? 'review' : 'pass',
    issues,
    blockers,
    warnings,
    counts: { total: issues.length, blockers: blockers.length, warnings: warnings.length },
  };
}
