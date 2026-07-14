/**
 * Versioned editorial rules for the Igloo localization pipeline.
 *
 * This is deliberately data, not one giant system prompt: rules can be
 * reviewed, diffed and tested independently from the provider/model choice.
 */
export const RULES_VERSION = '2026.5';

export const EN_SOURCE_EDITOR_MANDATE = [
  'You are Ultra Cloud Codex, the Tier-1 English source editor for a professional Algerian construction company.',
  'Write as an experienced contractor-side copywriter, not as an architecture magazine, urban-design journal or property brochure.',
  'Perform complete source rectification and restrained factual editing, not architectural elevation, creative copywriting or promotional positioning.',
  'Repair grammar, French bleed-through, punctuation and translated syntax completely.',
  'Prefer plain construction language: location, project type, units, floors, documented scope, construction status, contractor role, finishes, roads and utility networks, and handover. Use architectural or spatial terms only when the approved facts require them.',
  'Never use critic or developer language such as active frontage, urban integration, design intention, vertical composition, facade composition, master plan, architectural language, spatial narrative, landmark, iconic or contemporary lifestyle.',
  'Eliminate tautologies and increase information density: summary, description and FAQ fields must each perform a different editorial job.',
  'Architectural elevation changes diction, not the evidence base: preserve the same propositions and factual scope. Do not add new programme scope, density, ownership, utility independence, completion status, performance claims or visual interpretation. Never infer facts from an image unless the field is an image alt/caption and the feature is visibly described.',
  'Do not expand roads and pedestrian access into grading, drainage, water supply, power connections or other civil-works details unless those details already appear in the source page. Do not turn contemporary into high-performance, private, self-contained, high-density or premium.',
  'Never turn an official technical fact into a marketing claim. Preserve every number, acronym, proper name, placeholder, image path and JSON field id.',
  'Keep numeric glyphs exactly as supplied (for example 4, 202, 300/500 and R+8); never spell a source number out as words.',
  'Do not invent coastal, monolithic, premium, civic, detached or other architectural claims unless they are supported by the source facts or image context.',
  'For R+N, do not reduce the level count to "N-storey"; if expanded, write ground floor plus N upper floors. For VRD and TCE, expand the acronym naturally at first mention and retain the official acronym where it is a scope label.',
].join('\n');

export const LOCALE_RULES = {
  en: {
    name: 'International architectural English',
    instruction: 'Write precise, native British/International architectural English. Remove French syntax and literal translation loops without changing facts. Expand technical acronyms at first mention when the field allows it, then retain the official acronym. Keep UI headings punchy and short (maximum 4–5 words) unless the field explicitly requires more detail.',
  },
  fr: {
    name: 'French used by Algerian construction professionals',
    instruction: 'Write idiomatic, formal French used in Algeria. Apply accents, French punctuation spacing, non-breaking spaces before : ; ? ! where appropriate, and typographic apostrophes. Keep LPA, LPL, LPP, VRD, TCE and R+N as protected technical terms. Keep UI headings punchy and short (maximum 4–5 words) unless the field explicitly requires more detail.',
  },
  tr: {
    name: 'Natural Turkish construction editorial language',
    instruction: 'Write clear, restrained Turkish for a professional construction company. Translate the verified function of foreign property and service terms instead of transliterating them. Prefer established Turkish construction terms; keep official Algerian programme acronyms and measured facts intact. Read each sentence as native corporate Turkish before returning it. Keep UI headings punchy and short (maximum 4–5 words) unless the field explicitly requires more detail.',
  },
  'ar-DZ': {
    name: 'Modern Standard Arabic for Algeria',
    instruction: 'Write concise Modern Standard Arabic with Algerian construction terminology. Keep Latin acronyms, project numbers, phone numbers and URLs bidi-safe; do not mix sentence direction. Keep UI headings punchy and short (maximum 4–5 words) unless the field explicitly requires more detail.',
  },
};

export const BANNED_MARKETING_PHRASES = [
  'beautiful view',
  'family-friendly',
  'magnificent site',
  'built with expertise',
  'delivered with mastery',
  'good quality',
  'architectural excellence',
  'landmark development',
  'optimises urban density',
  'optimizes urban density',
  'complex vertical coordination',
  'pushes the portfolio upward',
  'parking entre-sols',
  'active frontage',
  'urban integration',
  'design intention',
  'vertical composition',
  'facade composition',
  'architectural language',
  'spatial narrative',
  'master plan',
  'landmark',
  'iconic',
  'contemporary lifestyle',
];

const UNSUPPORTED_ENRICHMENT_PATTERNS = [
  /\bprivate residential development\b/iu,
  /\bself-contained residential enclave\b/iu,
  /\bhigh-performance building envelope\b/iu,
  /\bhigh-specification (?:interior|exterior) finishes\b/iu,
  /\b(?:site )?drainage\b/iu,
  /\b(?:domestic )?water supply lines?\b/iu,
  /\belectrical grid connections?\b/iu,
  /\bstrict tolerances?\b/iu,
  /\bhigh-density\b/iu,
  /\brobust utility connections?\b/iu,
  /\bindependent service connections?\b/iu,
  /\bfully serviced plots?\b/iu,
  /\beach plot\b/iu,
  /\bprivate outdoor spaces?\b/iu,
  /\boptim(?:ise|ize)[sd]? plot boundaries\b/iu,
  /\bhigh-durability\b/iu,
];

export const PROJECT_OVERRIDES = {
  'douaouda-300-500-housing': {
    label: 'Doudouda completion ratio',
    requiredFacts: {
      fr: '300 logements réalisés sur un total de 500',
      tr: '500 konutun 300’ü tamamlandı',
      'ar-DZ': 'تم إنجاز 300 مسكن من أصل 500',
    },
  },
  'staoueli-11-41-villas': {
    label: 'Staoueli villa interiors',
    instruction: 'Describe the interior spatial development and the villas’ volumetric organisation when the source field discusses the project scope. Do not invent room counts or finishes.',
  },
  'said-hamdine-mixed-real-estate': {
    label: 'Said Hamdine steep site',
    requiredFacts: {
      fr: 'terrain en forte pente ; 01 sous-sol parking et 03 entre-sols commerces avec mezzanine',
      tr: 'dik eğimli arazi; 1 bodrum otopark katı ve asma katlı 3 ticari ara kat',
      'ar-DZ': 'أرض شديدة الانحدار؛ طابق سفلي واحد لمواقف السيارات وثلاثة طوابق تجارية نصفية مع ميزانين',
    },
  },
  'dely-brahim-240-housing': {
    label: '240-unit vertical zoning',
    requiredFacts: {
      fr: '03 sous-sols et 03 entre-sols de parking, 03 niveaux de commerces avec terrasse du RDC au 2e étage, puis les logements du 3e au 33e étage avec 08 logements par étage',
      tr: '3 bodrum ve 3 ara otopark katı; zemin kattan 2. kata kadar teraslı 3 ticari kat; konutlar 3. kattan 33. kata kadar, her katta 8 daire',
      'ar-DZ': 'ثلاثة طوابق سفلية وثلاثة طوابق نصفية لمواقف السيارات، وثلاثة طوابق تجارية مع شرفة من الطابق الأرضي إلى الطابق الثاني، ثم المساكن من الطابق الثالث إلى الطابق الثالث والثلاثين بثماني وحدات في كل طابق',
    },
  },
  'bas-mazagran-200-38-housing': {
    label: 'Bas Mazagran coastal delivery',
    requiredFacts: {
      fr: 'projet balnéaire actuellement en phase de livraison',
      tr: 'teslim aşamasındaki kıyı yerleşim projesi',
      'ar-DZ': 'مشروع ساحلي في مرحلة التسليم',
    },
  },
};

function compact(value) {
  return JSON.stringify(value, null, 2);
}

export function buildEditorialBrief({ pageId, target, manifest, facts, terminology }) {
  const locale = LOCALE_RULES[target] || LOCALE_RULES.en;
  const slug = pageId.startsWith('projects/') ? pageId.slice('projects/'.length) : null;
  const override = slug ? PROJECT_OVERRIDES[slug] : null;
  return [
    `Rules version: ${RULES_VERSION}`,
    `Target register: ${locale.name}.`,
    locale.instruction,
    'Return only the requested JSON array/object. Never emit Markdown fences, commentary or extra keys.',
    'Preserve every source fact, number, acronym, proper name, placeholder and field key. Never silently replace a technical acronym with a marketing synonym.',
    'Keep numeric glyphs exactly as supplied; never spell a source number out as words or alter a slash, plus sign or range.',
    'Do not convert R+N into merely “N-storey”: if expanded, explain it as ground floor plus N upper floors. Do not turn LPA/LPL/LPP or promotionnel into “premium” unless the authoritative facts explicitly say premium.',
    'For VRD, prefer “roads and utility networks” on first English mention and keep “VRD” where it is an official scope label. For TCE, prefer “all-trades delivery” or “all-trades package”; never use unexplained literal French fragments.',
    'Summary, description and FAQ fields must have distinct jobs. Do not copy the same sentence into multiple fields; each should add a different fact or answer.',
    'Field roles are strict: summary is a short direct project identification; description explains only the documented scope or distribution; authority is one concise sentence about recorded contractor scope or delivery status; captions describe only visible subjects or work; FAQ answers must answer their matching question in the first clause.',
    'For content.faq[i].answer, answer content.faq[i].question, not another FAQ item and not the hero summary. If the question asks about the ground floor, begin with the ground-floor use. If the question asks about scope, begin with the recorded scope.',
    'For content.images.*.caption, use one plain construction-site sentence. Name the visible material, element, activity or location; do not describe design intention, urban integration, facade composition, spatial narrative or unseen systems.',
    'For content.authority, remove adjectives and interpretation. A concise statement such as "The scope covered TCE and VRD works" is preferred to a paragraph about what the project is defined by.',
    target === 'tr' ? 'For Turkish, do not use mimarlık or şehircilik jargon such as kentsel bütünleşme, kentsel entegrasyon, cephe kurgusu, cephe artikülasyonu, cephe eklemlenmesi, düşey entegrasyon, tasarım niyeti, hacimsel hizalanma, aktif cephe, mekânsal anlatı, master plan or çağdaş yaşam. Prefer direct contractor terms such as proje, konut, blok, kat, zemin kat, ticari alan, yapım işleri, saha işleri, altyapı, teslim and tamamlandı.' : '',
    target === 'tr' ? 'Naturalise foreign property terminology by function: concierge facilities/spaces -> "site hizmetleri için ayrılmış alanlar/bölümler"; rent-to-own housing -> "kira ödeyerek satın alınabilen konutlar"; commercial premises -> "ticari alanlar"; ground-floor commercial premises -> "zemin kattaki ticari alanlar". Never write konsiyerj, kirala-satın al, kira ödemeli mülkiyet or kira ödemeli konut.' : '',
    target === 'tr' ? 'Before returning a Turkish field, ask silently whether an experienced Turkish contractor would publish that exact sentence. If not, rebuild the sentence in direct Turkish rather than replacing isolated words.' : '',
    'Rephrase only what the source page supports. Do not add implied ownership, density, performance, utility, completion or architectural claims.',
    'Do not invent architectural claims such as monolithic, coastal master plan, detached, premium, or civic unless the source facts or image evidence support them.',
    `Never use these generic marketing phrases: ${BANNED_MARKETING_PHRASES.join('; ')}.`,
    override ? `Project-specific rule (${override.label}): ${override.instruction || 'Preserve and explicitly include the required facts below when relevant.'}` : '',
    override?.requiredFacts?.[target] ? `Required localized fact when relevant: ${override.requiredFacts[target]}` : '',
    `Page manifest/context:\n${compact(manifest || {})}`,
    `Project facts (authoritative, not translated as free copy):\n${compact(facts || {})}`,
    `Protected terminology:\n${compact(terminology || {})}`,
  ].filter(Boolean).join('\n\n');
}

export function sourceQualityIssues(segments) {
  const issues = [];
  const editorialFields = segments.filter(({ path }) => /content\.(?:summary|description|faq)\./u.test(path));
  const tokenize = (value) => new Set(String(value).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').split(/\s+/u).filter((word) => word.length > 3));
  const similarity = (left, right) => {
    const a = tokenize(left); const b = tokenize(right);
    if (!a.size || !b.size) return 0;
    let common = 0; for (const word of a) if (b.has(word)) common += 1;
    return common / Math.min(a.size, b.size);
  };
  for (const segment of segments) {
    if (/\b(?:promotionnels|logements|corps d[’']etat|realise|realisees)\b/iu.test(segment.source)) {
      issues.push({ id: segment.path, severity: 'warning', type: 'source-rectification', message: 'English source contains French construction syntax or unaccented French terminology.' });
    }
  }
  for (const segment of segments) {
    if (BANNED_MARKETING_PHRASES.some((phrase) => segment.source.toLowerCase().includes(phrase))) {
      issues.push({ id: segment.path, severity: 'warning', type: 'generic-marketing', message: 'English source contains a banned generic marketing phrase.' });
    }
    if (/\b(?:monolithic|premium|civic|detached|coastal master plan)\b/iu.test(segment.source)) {
      issues.push({ id: segment.path, severity: 'warning', type: 'unsupported-claim', message: 'English source contains an architectural or market-positioning claim that must be checked against facts.' });
    }
  }
  for (let index = 0; index < editorialFields.length; index += 1) {
    for (let other = index + 1; other < editorialFields.length; other += 1) {
      const left = editorialFields[index]; const right = editorialFields[other];
      if (similarity(left.source, right.source) >= 0.82) {
        issues.push({ id: `${left.path}|${right.path}`, severity: 'warning', type: 'tautology', message: 'Summary, description or FAQ fields are too semantically similar; rewrite them with distinct information roles.' });
      }
    }
  }
  return issues;
}

export function sourceCandidateQualityIssues(sourceSegments, candidateSegments) {
  const sourceText = sourceSegments.map((segment) => segment.source).join(' ');
  const sourceByPath = new Map(sourceSegments.map((segment) => [segment.path, segment.source]));
  const wordCount = (value) => String(value).trim().split(/\s+/u).filter(Boolean).length;
  const issues = [];
  for (const segment of candidateSegments) {
    const original = sourceByPath.get(segment.path);
    if (original && wordCount(original) >= 10 && wordCount(segment.source) > wordCount(original) * 1.45) {
      issues.push({ id: segment.path, severity: 'blocker', type: 'length-expansion', message: 'Candidate is substantially longer than its source field; check for invented scope or unsupported detail.' });
    }
    for (const pattern of UNSUPPORTED_ENRICHMENT_PATTERNS) {
      const match = segment.source.match(pattern);
      if (match && !pattern.test(sourceText)) {
        issues.push({ id: segment.path, severity: 'blocker', type: 'unsupported-enrichment', phrase: match[0], message: 'Candidate introduces a technical, ownership or performance claim not present in the English source.' });
      }
    }
  }
  return issues;
}
