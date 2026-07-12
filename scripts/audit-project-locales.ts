import { generatedProjectContent } from '../src/data/projectContent.generated.ts';
import { repairMojibake } from '../src/i18n/runtime.ts';

type Locale = 'ar-DZ' | 'tr';
type IssueKind = 'missing' | 'mojibake' | 'mixed-language';
type Issue = { locale: Locale; path: string; kind: IssueKind; sample: string };

const TARGET_LOCALES: readonly Locale[] = ['ar-DZ', 'tr'];
const FOREIGN_CONNECTORS = /(?<![\p{L}])(?:and|with|the|from|into|for|including|et|avec|des|les|du|la|le)(?![\p{L}])/giu;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function auditNode(node: unknown, path: string, issues: Issue[]) {
  if (Array.isArray(node)) {
    node.forEach((item, index) => auditNode(item, `${path}.${index}`, issues));
    return;
  }

  if (!isRecord(node)) return;

  if (typeof node.en === 'string' && typeof node.fr === 'string') {
    for (const locale of TARGET_LOCALES) {
      const value = typeof node[locale] === 'string' ? node[locale].trim() : '';
      if (!value) {
        issues.push({ locale, path, kind: 'missing', sample: '' });
        continue;
      }
      if (repairMojibake(value) !== value) {
        issues.push({ locale, path, kind: 'mojibake', sample: value.slice(0, 96) });
        continue;
      }

      const latinForLanguageCheck = value.replace(/\b(?:AADL|OPGI|LPA|LPL|TCE|MEP|Igloo(?: Construction)?|Boudouaou|Boumerdes|Dely Brahim|Douaouda|Tipaza|Alger(?:ie)?|R(?=\+\d+))\b/giu, '');
      const latinWords = (latinForLanguageCheck.match(/[A-Za-zÀ-ÿ]+/gu) ?? []).length;
      const arabicWords = (value.match(/[\u0600-\u06ff]+/gu) ?? []).length;
      const foreignConnectors = (value.match(FOREIGN_CONNECTORS) ?? []).length;
      const foreignArabicUiWords = /(?<![\p{L}])(?:project|type|total|housing|units?|market-rate|objective|client|nearby|places|number|blocks?|typologie|blocs?|completed|location|status)(?![\p{L}])/giu.test(latinForLanguageCheck);
      const isApprovedProperNounOnly = !/[A-Za-zÀ-ÿ\u0600-\u06ff]/u.test(latinForLanguageCheck);
      if (isApprovedProperNounOnly) continue;
      const mixedArabic = locale === 'ar-DZ' && (foreignArabicUiWords || latinWords > 3 || arabicWords === 0);
      const mixedTurkish = locale === 'tr' && (arabicWords > 0 || foreignConnectors > 1);
      if (mixedArabic || mixedTurkish) {
        issues.push({ locale, path, kind: 'mixed-language', sample: value.slice(0, 96) });
      }
    }
    return;
  }

  Object.entries(node).forEach(([key, value]) => auditNode(value, `${path}.${key}`, issues));
}

const issues: Issue[] = [];
auditNode(generatedProjectContent, 'projectContent', issues);

const counts = issues.reduce<Record<Locale, Record<IssueKind, number>>>((result, issue) => {
  result[issue.locale][issue.kind] += 1;
  return result;
}, {
  'ar-DZ': { missing: 0, mojibake: 0, 'mixed-language': 0 },
  tr: { missing: 0, mojibake: 0, 'mixed-language': 0 },
});

for (const locale of TARGET_LOCALES) {
  const count = counts[locale];
  console.log(`${locale}: ${count.missing} missing, ${count.mojibake} encoding errors, ${count['mixed-language']} mixed-language strings`);
}

if (issues.length) {
  console.log('\nExamples:');
  issues.slice(0, 20).forEach((issue) => console.log(`- [${issue.locale}] ${issue.kind}: ${issue.path}${issue.sample ? ` — ${issue.sample}` : ''}`));
}

if (process.argv.includes('--strict') && issues.length) process.exitCode = 1;
