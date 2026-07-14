import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  tokenizeNumbers,
  normalizeDigitRuns,
  numberPreservationIssues,
  foreignLeakageIssues,
  turkishContractorVoiceIssues,
  faqParityIssues,
  faqCoherenceIssues,
  placeholderIssues,
  imagePathIssues,
  runTargetGates,
} from './localization-gates.mjs';

test('normalizeDigitRuns collapses thousands separators across styles', () => {
  assert.deepEqual(normalizeDigitRuns('2,500 homes', 'en'), ['2500']);
  assert.deepEqual(normalizeDigitRuns('2.500 logements', 'fr'), ['2500']);
  assert.deepEqual(normalizeDigitRuns('2 500 logements', 'fr'), ['2500']);
});

test('normalizeDigitRuns keeps a slash-separated range as two numbers', () => {
  assert.deepEqual(normalizeDigitRuns('300/500', 'en'), ['300', '500']);
});

test('normalizeDigitRuns handles Turkish apostrophe-suffixed numbers', () => {
  assert.deepEqual(normalizeDigitRuns("300'ü 500 konutun", 'tr'), ['300', '500']);
});

test('normalizeDigitRuns converts Arabic-Indic digits to ASCII', () => {
  assert.deepEqual(normalizeDigitRuns('٢٤٠ وحدة', 'ar-DZ'), ['240']);
});

test('numberPreservationIssues: matching thousands-formatted number is not a blocker', () => {
  const issues = numberPreservationIssues('2,500-home programme', "2.500 konutluk program", 'tr', 'content.summary.0');
  assert.equal(issues.length, 0);
});

test('numberPreservationIssues: missing number is a blocker', () => {
  const issues = numberPreservationIssues('240 units', 'birçok konut', 'tr', 'content.title');
  assert.equal(issues.length, 1);
  assert.equal(issues[0].severity, 'blocker');
});

test('numberPreservationIssues: spelled-out small number is a warning, not a blocker', () => {
  const issues = numberPreservationIssues('8 units per floor', 'kat başına ثماني وحدة', 'ar-DZ', 'content.details.3.value');
  assert.equal(issues.length, 1);
  assert.equal(issues[0].severity, 'warning');
});

test('foreignLeakageIssues: catches leaked English word in Turkish text', () => {
  const issues = foreignLeakageIssues('Zemin kotu ticari alanlar and bina girişleri.', 'tr', 'content.images.mosaic.3.caption');
  assert.equal(issues.length, 1);
  assert.equal(issues[0].severity, 'warning');
});

test('foreignLeakageIssues: two leaked connectors escalate to blocker', () => {
  const issues = foreignLeakageIssues('Zemin kotu ticari alanlar and bina girişleri and diğer alanlar.', 'tr', 'content.images.mosaic.3.caption');
  assert.equal(issues.length, 1);
  assert.equal(issues[0].severity, 'blocker');
});

test('foreignLeakageIssues: Arabic script inside Turkish text is a blocker', () => {
  const issues = foreignLeakageIssues('Bu proje ثماني daireden oluşur.', 'tr', 'content.description.0');
  assert.equal(issues.length, 1);
  assert.equal(issues[0].severity, 'blocker');
});

test('foreignLeakageIssues: protected acronyms do not trigger Turkish leakage', () => {
  const issues = foreignLeakageIssues('VRD ve TCE kapsamında R+8 blok teslim edildi.', 'tr', 'content.details.5.value');
  assert.equal(issues.length, 0);
});

test('turkishContractorVoiceIssues: blocks literal property-service translations', () => {
  const issues = turkishContractorVoiceIssues('Kira ödemeli mülkiyet konutları ve konsiyerj alanları yer almaktadır.', 'content.summary.0');
  assert.equal(issues.length, 2);
  assert.ok(issues.every((item) => item.code === 'TURKISH_CONTRACTOR_VOICE' && item.severity === 'blocker'));
});

test('turkishContractorVoiceIssues: accepts natural functional Turkish', () => {
  const issues = turkishContractorVoiceIssues('Kira ödeyerek satın alınabilen konutlar ile site hizmetleri için ayrılmış alanlar yer almaktadır.', 'content.summary.0');
  assert.equal(issues.length, 0);
});

test('turkishContractorVoiceIssues: blocks compressed service-space wording', () => {
  const issues = turkishContractorVoiceIssues('250 Konut, Ticari Alanlar ve Site Hizmetleri Bölümleri', 'content.title');
  assert.equal(issues.length, 1);
  assert.equal(issues[0].code, 'TURKISH_CONTRACTOR_VOICE');
});

test('foreignLeakageIssues: Arabic field with zero Arabic words is a blocker', () => {
  const issues = foreignLeakageIssues('This entire sentence stayed in English by mistake here.', 'ar-DZ', 'content.summary.0');
  assert.equal(issues.length, 1);
  assert.equal(issues[0].severity, 'blocker');
});

test('foreignLeakageIssues: Arabic field with an English UI word is a blocker', () => {
  const issues = foreignLeakageIssues('يضم هذا housing المشروع 240 وحدة سكنية.', 'ar-DZ', 'content.summary.1');
  assert.equal(issues.length, 1);
  assert.equal(issues[0].severity, 'blocker');
});

test('faqParityIssues: flags an answer identical to its question', () => {
  const source = { content: { faq: [{ question: 'What is X?', answer: 'X is a project.' }] } };
  const target = { content: { faq: [{ question: 'X nedir?', answer: 'X nedir?' }] } };
  const issues = faqParityIssues(source, target);
  assert.equal(issues.length, 1);
  assert.equal(issues[0].type, 'faq-parity');
});

test('faqParityIssues: flags a length mismatch', () => {
  const source = { content: { faq: [{ question: 'A?', answer: 'B.' }, { question: 'C?', answer: 'D.' }] } };
  const target = { content: { faq: [{ question: 'A?', answer: 'B.' }] } };
  const issues = faqParityIssues(source, target);
  assert.equal(issues.length, 1);
  assert.equal(issues[0].message.includes('length mismatch'), true);
});

test('faqParityIssues: passes on a well-formed matching FAQ', () => {
  const source = { content: { faq: [{ question: 'What is X?', answer: 'X is a project.' }] } };
  const target = { content: { faq: [{ question: 'X nedir?', answer: 'X bir projedir.' }] } };
  assert.equal(faqParityIssues(source, target).length, 0);
});

test('faqCoherenceIssues: flags an answer that switches away from the question topic', () => {
  const source = { content: { faq: [{ question: 'How is the ground floor used?', answer: 'The ground floor contains commercial premises.' }] } };
  const target = { content: { faq: [{ question: 'Projenin zemin katı nasıl kullanılıyor?', answer: 'Reghaia projesi yedi adet R+9 bloktan oluşur.' }] } };
  const issues = faqCoherenceIssues(source, target, 'tr');
  assert.ok(issues.some((item) => item.code === 'FAQ_ANSWER_TOPIC_MISMATCH'));
  assert.ok(issues.every((item) => item.severity === 'blocker'));
});

test('faqCoherenceIssues: structural FAQ rejects financing and ground-floor services', () => {
  const source = { content: { faq: [{ question: 'What are the structural features?', answer: 'Four F3/F4 apartments per floor.' }] } };
  const target = { content: { faq: [{ question: 'Blokların yapısal özellikleri nelerdir?', answer: 'Her katta dört daire vardır. Kira ödeyerek satın alınabilen konutların zemin katında ticari alanlar bulunmaktadır.' }] } };
  const issues = faqCoherenceIssues(source, target, 'tr');
  assert.ok(issues.some((item) => item.code === 'FAQ_OFF_TOPIC_DETAIL'));
});

test('placeholderIssues: flags a dropped placeholder token and URL', () => {
  const issues = placeholderIssues('Visit {siteUrl} for details, https://example.com/x', 'Detaylar için ziyaret edin', 'content.cta');
  assert.equal(issues.length, 2);
});

test('imagePathIssues: flags a mutated image src between locales', () => {
  const source = { content: { images: { hero: [{ src: '/projects/a/01.webp', alt: 'x' }] } } };
  const target = { content: { images: { hero: [{ src: '/projects/a/02.webp', alt: 'y' }] } } };
  const issues = imagePathIssues(source, target);
  assert.equal(issues.length, 1);
  assert.equal(issues[0].type, 'image-path');
});

test('runTargetGates: reproduces the dely-brahim tr leaked "and" as a warning, not a false number blocker', () => {
  const sourceSegments = [
    { path: 'content.images.mosaic.3.caption', source: 'Ground-level commercial areas and building entrances.' },
  ];
  const candidateSegments = [
    { path: 'content.images.mosaic.3.caption', text: 'Zemin kotu ticari alanlar and bina girişleri.' },
  ];
  const report = runTargetGates({
    pageId: 'projects/dely-brahim-240-housing',
    target: 'tr',
    sourceSegments,
    candidateSegments,
    protectedTerms: { terms: [] },
  });
  assert.equal(report.status, 'pass');
  assert.equal(report.warnings.length, 1);
  assert.equal(report.blockers.length, 0);
});

test('runTargetGates: 2,500 vs 2.500 does not produce a false blocker', () => {
  const sourceSegments = [{ path: 'content.summary.0', source: 'A 2,500-home residential development.' }];
  const candidateSegments = [{ path: 'content.summary.0', text: '2.500 konutluk bir yerleşim projesi.' }];
  const report = runTargetGates({
    pageId: 'projects/rahmania',
    target: 'tr',
    sourceSegments,
    candidateSegments,
    protectedTerms: { terms: [] },
  });
  assert.equal(report.blockers.length, 0);
});

test('runTargetGates: a repaired FAQ answer may drop off-topic source numbers', () => {
  const sourceDoc = {
    content: {
      faq: [{
        question: 'How is the ground floor used?',
        answer: 'The project consists of seven R+9 blocks with family housing.',
      }],
    },
  };
  const targetDoc = {
    content: {
      faq: [{
        question: 'Projenin zemin katı nasıl kullanılıyor?',
        answer: 'Zemin katta ticari alanlar ve site hizmetleri için ayrılmış bölümler yer almaktadır.',
      }],
    },
  };
  const report = runTargetGates({
    sourceDoc,
    targetDoc,
    locale: 'tr',
    terminology: { terms: [{ source: 'R+9', tr: 'R+9' }] },
  });
  assert.equal(report.blockers.filter((item) => ['NUMBER_MISSING', 'PROTECTED_TERM_MISSING'].includes(item.code)).length, 0);
});

test('tokenizeNumbers preserves typed floor codes, ratios and ranges', () => {
  assert.equal(tokenizeNumbers('R+13', 'en')[0].type, 'floor-code');
  assert.equal(tokenizeNumbers('300/500', 'en')[0].type, 'ratio');
  assert.deepEqual(tokenizeNumbers('3rd–33rd', 'en')[0].endpoints, ['3', '33']);
  assert.equal(tokenizeNumbers('3e au 33e', 'fr')[0].type, 'ordinal-range');
});

test('ordinal prose with an intervening English article matches a localized ordinal range', () => {
  assert.deepEqual(
    tokenizeNumbers('from the 3rd to the 33rd floor', 'en').map((token) => [token.type, token.normalized]),
    [['ordinal-range', '3-33']],
  );
  assert.deepEqual(
    tokenizeNumbers('du 3e au 33e étage', 'fr').map((token) => [token.type, token.normalized]),
    [['ordinal-range', '3-33']],
  );
  assert.deepEqual(
    numberPreservationIssues('from the 3rd to the 33rd floor', 'du 3e au 33e étage', 'fr'),
    [],
  );
});

test('tokenizeNumbers keeps decimal and percentage types distinct', () => {
  assert.equal(tokenizeNumbers('2.5', 'en')[0].type, 'decimal');
  assert.equal(tokenizeNumbers('2,5', 'fr')[0].normalized, '2.5');
  assert.equal(tokenizeNumbers('2.5%', 'en')[0].type, 'percentage');
  assert.equal(numberPreservationIssues('2.5%', '2.5', 'fr', 'content.summary').some((item) => item.code === 'NUMBER_TYPE_MISMATCH' || item.code === 'NUMBER_MISSING'), true);
});

test('tokenizeNumbers excludes internal version-like values from publication number matching', () => {
  assert.equal(tokenizeNumbers('pipeline 2026.3', 'en')[0].type, 'version-like');
  assert.equal(numberPreservationIssues('pipeline 2026.3', 'pipeline', 'tr', 'meta').length, 0);
});

test('tokenizeNumbers converts Arabic-Indic and Eastern Arabic-Indic digits', () => {
  assert.equal(tokenizeNumbers('\u0662\u0664\u0660', 'ar-DZ')[0].normalized, '240');
  assert.equal(tokenizeNumbers('\u06f2\u06f4\u06f0', 'ar-DZ')[0].normalized, '240');
});

test('tokenizeNumbers recognizes Arabic numerals attached to waw', () => {
  assert.deepEqual(tokenizeNumbers('200 و38 و3', 'ar-DZ').map((token) => token.normalized), ['200', '38', '3']);
  assert.deepEqual(numberPreservationIssues('200 and 38 and 3 units', '200 و38 و3 وحدة', 'ar-DZ'), []);
});

test('written Arabic small numbers downgrade a missing digit to a warning', () => {
  const issues = numberPreservationIssues('8 units', 'ثماني وحدات', 'ar-DZ', 'content.summary');
  assert.equal(issues.length, 1);
  assert.equal(issues[0].severity, 'warning');
});

test('numeric target forms of small written English numbers are warnings, not blockers', () => {
  const issues = numberPreservationIssues('a three-level base with one basement', 'un socle 03 niveaux avec 01 sous-sol', 'fr');
  assert.equal(issues.length, 2);
  assert.ok(issues.every((issue) => issue.code === 'NUMBER_WRITTEN_FORM' && issue.severity === 'warning'));
});

test('required project facts may be distributed across editorial fields', () => {
  const report = runTargetGates({
    pageId: 'projects/example',
    target: 'fr',
    sourceSegments: [],
    candidateSegments: [
      { path: 'content.summary.0', text: 'Un site en forte pente.' },
      { path: 'content.details.0.value', text: '01 sous-sol parking et 03 entre-sols commerces avec mezzanine.' },
    ],
    protectedTerms: { terms: [] },
    projectOverrides: {
      example: { requiredFacts: { fr: 'site en forte pente ; 01 sous-sol parking et 03 entre-sols commerces avec mezzanine' } },
    },
  });
  assert.equal(report.blockers.length, 0);
});

test('leading zeroes are insignificant and Turkish number suffixes are tolerated', () => {
  assert.equal(numberPreservationIssues('08 units', "08'ü birimler", 'tr', 'content.summary').length, 0);
});

test('floor-code and explicit floor wording are equivalent but visible as a warning', () => {
  const issues = numberPreservationIssues(
    'Each villa is ground floor plus 2 upper floors.',
    'Her villa zemin kat artı 2 üst kattan oluşur (R+2).',
    'tr',
  );
  assert.equal(issues.length, 1);
  assert.ok(issues.every((issue) => issue.code === 'NUMBER_FLOOR_EXPANSION' && issue.severity === 'warning'));
});

test('a target floor code can cover a duplicated source floor number and code', () => {
  const issues = numberPreservationIssues(
    'Ground floor plus 2 upper floors (R+2) individual villas',
    'فيلات فردية تتكون من طابق أرضي زائد طابقين علويين (R+2)',
    'ar-DZ',
  );
  assert.equal(issues.length, 1);
  assert.equal(issues[0].code, 'NUMBER_FLOOR_EXPANSION');
  assert.equal(issues[0].severity, 'warning');
});
