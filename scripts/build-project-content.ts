import 'dotenv/config';
import mammoth from 'mammoth';
import sharp from 'sharp';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  localizedProjectScope,
  localizedProjectSummary,
  localizedProjectTitle,
  projects,
  type ProjectRecord,
} from '../src/data/projects.ts';
import { getProjectEditorialContent } from '../src/data/projectEditorialContent.ts';
import { curateProjectImages } from './project-image-curation.ts';

type Locale = 'en' | 'fr';
type Localized = Record<Locale, string>;
type SourceProject = {
  slug: string;
  formFile: string;
  photoFolder: string;
};
type ParsedForm = {
  title: string;
  location: string;
  completion: string;
  intro: string;
  type: string;
  contract: string;
  client: string;
  architect: string;
  highlights: string;
  construction: string;
  outcome: string;
  contribution: string;
  facts: Array<{ label: string; value: string }>;
};
type ImageAnalysis = {
  fileName: string;
  relativePath: string;
  summary?: string;
  altText?: string;
  shortCaption?: string;
  detailedDescription?: string;
  constructionStage?: string;
  dominantUseCase?: string;
  recommendedPlacements?: string[];
  bestSiteSections?: string[];
  supportingTopics?: string[];
  marketingTags?: string[];
  qualityNotes?: string[];
  doNotUseReasons?: string[];
  cropNotes?: string[];
  rationale?: string;
  confidence?: number;
  scores?: {
    hero?: number;
    banner?: number;
    support?: number;
    gallery?: number;
    exclusionRisk?: number;
    uniqueness?: number;
    composition?: number;
    cleanliness?: number;
  };
};
type AnalysisFile = { heroCandidates?: string[]; analyses?: ImageAnalysis[] };
type GeneratedCopy = {
  titleEn: string;
  titleFr: string;
  eyebrowEn: string;
  eyebrowFr: string;
  summaryEn: string[];
  summaryFr: string[];
  descriptionEn: string[];
  descriptionFr: string[];
  authorityEn: string;
  authorityFr: string;
  seoEn: string;
  seoFr: string;
  faqs: Array<{ questionEn: string; answerEn: string; questionFr: string; answerFr: string }>;
};

type SeedLocale = 'ar-DZ' | 'tr';
type SeedTranslations = Record<string, string>;
type SeedCatalogs = Record<SeedLocale, SeedTranslations>;

const ROOT = process.cwd();
const DATA_ROOT = path.join(ROOT, String.fromCodePoint(0x130) + 'gloo project data');
const FORMS_ROOT = path.join(DATA_ROOT, 'Nouveau dossier');
const PHOTOS_ROOT = path.join(DATA_ROOT, 'photos projet');
const ANALYSIS_ROOT = path.join(DATA_ROOT, 'analysis');
const PUBLIC_ROOT = path.join(ROOT, 'public', 'projects');
const OUTPUT_FILE = path.join(ROOT, 'src', 'data', 'projectContent.generated.ts');
const SEED_FILES: Record<SeedLocale, string> = {
  'ar-DZ': path.join(ROOT, 'config', 'locales', 'site.dz.yml'),
  tr: path.join(ROOT, 'config', 'locales', 'site.tr.yml'),
};

// The source documents and photo folders use different operational names.
const SOURCE_PROJECTS: SourceProject[] = [
  { slug: 'boudouaou-70-10-housing', formFile: 'BOUDOUAOU.docx', photoFolder: 'boudouaou' },
  { slug: 'dely-brahim-240-housing', formFile: 'Dely brahim.docx', photoFolder: 'dely brahim' },
  { slug: 'douaouda-300-500-housing', formFile: 'douaouda.docx', photoFolder: 'douaouda' },
  { slug: 'bas-mazagran-200-38-housing', formFile: 'Mostaganem.docx', photoFolder: 'mostaghanem' },
  { slug: 'douira-commercial-centers-2500-housing', formFile: 'Rahmania.docx', photoFolder: 'douira' },
  { slug: 'reghaia-bouraada-250-housing', formFile: 'reghaia.docx', photoFolder: 'reghaia' },
  { slug: 'rouiba-4-promotional-villas', formFile: 'Rouiba.docx', photoFolder: 'rouiba' },
  { slug: 'said-hamdine-mixed-real-estate', formFile: 'said hamdine.docx', photoFolder: 'sidi yahia' },
  { slug: 'sidi-abdallah-200-1200-housing', formFile: 'sidi abdellah.docx', photoFolder: 'sidi abdellah' },
  { slug: 'sidi-benour-50-housing', formFile: 'Sidi Benour.docx', photoFolder: 'sidi benour' },
  { slug: 'staoueli-11-41-villas', formFile: 'staouali.docx', photoFolder: 'staouali' },
];

const SOURCE_PROJECT_ALIASES: Record<string, string> = {
  'douira-commercial-centers-2500-housing': 'rahmania',
};

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.bmp']);

function repairMojibake(value: string) {
  let repaired = value;
  for (let pass = 0; pass < 3 && /(?:Ã.|Â.|â.|ð.|Ð.|Ñ.|Ø.|Ù.|Å.|Ä.|�)/u.test(repaired); pass += 1) {
    try {
      const decoded = Buffer.from(repaired, 'latin1').toString('utf8');
      if (decoded.includes('\uFFFD') || decoded === repaired) break;
      repaired = decoded;
    } catch {
      break;
    }
  }
  return repaired;
/*
  if (!/[ÃƒÃ‚Ã¢Ã˜Ã™]/.test(value)) return value;
  try {
    const repaired = Buffer.from(value, 'latin1').toString('utf8');
    return repaired.includes('\uFFFD') ? value : repaired;
  } catch {
    return value;
  }
*/
}

function usableSeedTranslation(value: string, locale: SeedLocale) {
  const repaired = repairMojibake(value).trim();
  if (!repaired) return '';

  // The legacy seed catalogs were generated through word substitution. A
  // partially translated sentence is more damaging than a clear fallback: it
  // reads as broken copy and cannot be meaningfully reviewed by an editor.
  // Keep only authored-looking target-language strings in generated content.
  // Project names and contractual acronyms may legitimately remain in Latin
  // script in Arabic editorial copy, so exclude the approved glossary before
  // counting foreign words. Connector detection still catches hybrid prose.
  const latinForLanguageCheck = repaired.replace(/\b(?:AADL|LPA|LPL|Igloo(?: Construction)?|Boudouaou|Boumerdes|Dely Brahim|Douaouda|Tipaza|Alger(?:ie)?)\b/giu, '');
  const latinWords = (latinForLanguageCheck.match(/[A-Za-zÀ-ÿ]+/gu) ?? []).length;
  const arabicWords = (repaired.match(/[\u0600-\u06ff]+/gu) ?? []).length;
  // Turkish uses the standalone conjunction/particle "de" legitimately, so
  // it cannot be treated as evidence of leftover French here.
  const foreignConnectors = (repaired.match(/(?<![\p{L}])(?:and|with|the|from|into|for|including|et|avec|des|les|du|la|le)(?![\p{L}])/giu) ?? []).length;

  if (locale === 'ar-DZ' && latinWords > 3) return '';
  if (locale === 'tr' && (arabicWords > 0 || foreignConnectors > 1)) return '';

  return repaired;
}

function clean(value: string) {
  return repairMojibake(value).replace(/\s+/g, ' ').replace(/_{3,}/g, '').trim();
}

function present(value: unknown) {
  if (typeof value !== 'string') return '';
  const normalized = clean(value);
  return normalized && !normalized.includes('___') ? normalized : '';
}

function presentList(values: unknown[], fallback: string[]) {
  const cleaned = values.map(present).filter(Boolean);
  return cleaned.length ? cleaned : fallback;
}

function lineAfter(lines: string[], startsWith: string) {
  return present(lines.find((line) => line.toLocaleLowerCase('fr').startsWith(startsWith.toLocaleLowerCase('fr'))) || '');
}

function valueAfterLabel(line: string) {
  const colon = line.indexOf(':');
  return present(colon >= 0 ? line.slice(colon + 1) : line);
}

function contentAfter(lines: string[], section: string, stopAt: string[]) {
  const start = lines.findIndex((line) => line.toLocaleLowerCase('fr').includes(section.toLocaleLowerCase('fr')));
  if (start < 0) return '';
  const collected: string[] = [];
  for (const line of lines.slice(start + 1)) {
    if (stopAt.some((marker) => line.toLocaleLowerCase('fr').includes(marker.toLocaleLowerCase('fr')))) break;
    if (line.length > 40 && !/^\d+[.)]/.test(line)) collected.push(line);
  }
  return present(collected[0] || '');
}

async function parseForm(fileName: string): Promise<ParsedForm> {
  const result = await mammoth.extractRawText({ path: path.join(FORMS_ROOT, fileName) });
  const lines = result.value.split(/\r?\n/).map(clean).filter(Boolean);
  const factLabels = [
    'Nature du projet', 'Nombre total de logements', 'Nombre de logements rÃ©alisÃ©s', 'Nombre de blocs',
    'Typologie', 'Nombre de logements par Ã©tage', 'Locaux', 'Travaux rÃ©alisÃ©s', 'Objectif',
  ];
  const facts = factLabels
    .map((label) => {
      const line = lineAfter(lines, label);
      return line ? { label: clean(line.slice(0, line.indexOf(':'))), value: valueAfterLabel(line) } : null;
    })
    .filter((fact): fact is { label: string; value: string } => Boolean(fact?.value));

  return {
    title: valueAfterLabel(lineAfter(lines, 'Nom du projet')),
    location: valueAfterLabel(lineAfter(lines, 'Localisation (ville')) || valueAfterLabel(lineAfter(lines, 'Localisation :')),
    completion: valueAfterLabel(lineAfter(lines, 'Date dâ€™achÃ¨vement')),
    intro: contentAfter(lines, 'BrÃ¨ve prÃ©sentation du projet', ['5. DÃ©tails', '5.DÃ©tails']),
    type: valueAfterLabel(lineAfter(lines, 'Nature du projet')),
    contract: valueAfterLabel(lineAfter(lines, 'Type de contrat')),
    client: valueAfterLabel(lineAfter(lines, 'Client :')),
    architect: valueAfterLabel(lineAfter(lines, 'Architecte :')),
    highlights: contentAfter(lines, 'Points forts du projet', ['8. Principales', '8.Principales']),
    construction: contentAfter(lines, 'Principales caractÃ©ristiques de construction', ['9. Ã‰tat', '9.Ã‰tat']),
    outcome: contentAfter(lines, 'Ã‰tat dâ€™avancement', ['10. Contribution', '10.Contribution']),
    contribution: contentAfter(lines, 'Contribution de lâ€™entreprise', ['11. Images', '11.Images']),
    facts,
  };
}

async function walkImages(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walkImages(fullPath);
    return entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()) ? [fullPath] : [];
  }));
  return nested.flat().sort((a, b) => a.localeCompare(b));
}

function safeFileName(fileName: string) {
  return fileName.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/(^-|-$)/g, '').toLowerCase() || 'image';
}

const FACT_LABELS_EN: Record<string, string> = {
  'nature du projet': 'Project type',
  'nombre total de logements': 'Total housing units',
  'nombre de logements rÃ©alisÃ©s': 'Housing units delivered',
  'nombre de blocs': 'Number of blocks',
  typologie: 'Typology',
  'nombre de logements par Ã©tage': 'Housing units per floor',
  locaux: 'Commercial premises',
  'locaux commerciaux et professionnels': 'Commercial and professional premises',
  'travaux rÃ©alisÃ©s': 'Works delivered',
  objectif: 'Project objective',
};

function englishFactLabel(label: string) {
  return FACT_LABELS_EN[clean(label).toLocaleLowerCase('fr')] || clean(label);
}

function englishFactValue(value: string) {
  return clean(value)
    .replace(/Logements promotionnels aidÃ©s \(LPA\) et logements promotionnels libres \(LPL\)/gi, 'Assisted promotional housing (LPA) and market-rate promotional housing (LPL)')
    .replace(/logements promotionnels aidÃ©s/gi, 'assisted promotional housing')
    .replace(/logements promotionnels libres/gi, 'market-rate promotional housing')
    .replace(/locaux commerciaux et professionnels/gi, 'commercial and professional premises')
    .replace(/locaux Ã  usage commercial et professionnel/gi, 'commercial and professional premises')
    .replace(/locaux commerciaux/gi, 'commercial premises')
    .replace(/locaux/gi, 'premises')
    .replace(/logements rÃ©alisÃ©s/gi, 'housing units delivered')
    .replace(/logements/gi, 'housing units')
    .replace(/par Ã©tage/gi, 'per floor')
    .replace(/Tous corps dâ€™Ã©tat secondaires \(TCE\)/gi, 'Secondary trades (TCE)')
    .replace(/tous corps dâ€™Ã©tat secondaires/gi, 'secondary trades')
    .replace(/viabilisation/gi, 'site servicing')
    .replace(/rÃ©seaux tertiaires/gi, 'tertiary networks')
    .replace(/rÃ©seaux divers/gi, 'utility networks')
    .replace(/voiries/gi, 'roads')
    .replace(/commerces et services de proximitÃ©/gi, 'local shops and services')
    .replace(/ensemble rÃ©sidentiel/gi, 'residential development')
    .replace(/cadre urbain fonctionnel/gi, 'functional urban setting')
    .replace(/DÃ©velopper/gi, 'Develop')
    .replace(/intÃ©grant/gi, 'integrating')
    .replace(/habitat/gi, 'housing')
    .replace(/commerces/gi, 'shops')
    .replace(/services de proximitÃ©/gi, 'local services')
    .replace(/dans un/gi, 'in a')
    .replace(/rÃ©alisÃ©s/gi, 'delivered')
    .replace(/rÃ©alisÃ©/gi, 'delivered')
    .replace(/rÃ©sidentiel/gi, 'residential')
    .replace(/commerciaux/gi, 'commercial')
    .replace(/professionnels/gi, 'professional');
}

async function optimizeImages(slug: string, photoFolder: string) {
  const inputRoot = path.join(PHOTOS_ROOT, photoFolder);
  const files = await walkImages(inputRoot);
  const outputRoot = path.join(PUBLIC_ROOT, slug);
  await mkdir(outputRoot, { recursive: true });
  const manifest = new Map<string, string>();
  await Promise.all(files.map(async (file, index) => {
    const relativePath = path.relative(inputRoot, file).replaceAll('\\', '/');
    const outputName = `${String(index + 1).padStart(2, '0')}-${safeFileName(path.parse(file).name)}.webp`;
    await sharp(file).rotate().resize({ width: 2560, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(outputRoot, outputName));
    manifest.set(relativePath, `/projects/${slug}/${outputName}`);
  }));
  return manifest;
}

async function readAnalysis(photoFolder: string): Promise<AnalysisFile | null> {
  try {
    return JSON.parse(await readFile(path.join(ANALYSIS_ROOT, photoFolder, 'analysis.json'), 'utf8')) as AnalysisFile;
  } catch {
    return null;
  }
}

function localized(en: string, fr: string): Localized {
  return { en, fr };
}

function toImage(src: string, analysis?: ImageAnalysis) {
  const english = analysis?.altText || analysis?.shortCaption || 'Igloo Construction project image';
  const french = analysis?.shortCaption || 'Image du projet Igloo Construction';
  return { src, alt: localized(english, french), caption: analysis?.shortCaption ? localized(analysis.shortCaption, analysis.shortCaption) : undefined };
}

function imageManifest(assets: Map<string, string>, analysis: AnalysisFile | null) {
  const entries = [...assets.entries()].map(([relativePath, src]) => ({ relativePath, src, analysis: analysis?.analyses?.find((item) => item.relativePath === relativePath) }));
  const curated = curateProjectImages(entries, analysis);
  const hero = curated.manifest.hero.map((item) => toImage(item.src, item.analysis));
  const intro = curated.manifest.intro ? toImage(curated.manifest.intro.src, curated.manifest.intro.analysis) : undefined;
  const mosaic = curated.manifest.mosaic.map((item) => toImage(item.src, item.analysis));
  const featureGallery = curated.manifest.featureGallery.map((item) => toImage(item.src, item.analysis));
  const construction = curated.manifest.constructionGallery.map((item) => toImage(item.src, item.analysis));
  const featured = hero.slice(0, 1);
  return { hero, intro, mosaic, featureGallery, constructionGallery: construction, featured };
}

function projectLabel(record: ProjectRecord, form: ParsedForm) {
  const text = [record.summary, record.scope, form.type, form.intro, form.highlights, form.construction].filter(present).join(' ').toLowerCase();
  if (/(mixed|mixte|commercial|commerciaux|locaux)/i.test(text) && /(housing|logements|habitat|villa|villas|residential|résidentiel)/i.test(text)) {
    return { en: 'MIXED-USE PROJECT', fr: 'PROJET MIXTE' };
  }
  if (/(villa|villas)/i.test(text)) {
    return { en: 'RESIDENTIAL PROJECT', fr: 'PROJET RÉSIDENTIEL' };
  }
  if (/(housing|logements|habitat|residential|résidentiel)/i.test(text)) {
    return { en: 'RESIDENTIAL PROJECT', fr: 'PROJET RÉSIDENTIEL' };
  }
  return { en: 'CONSTRUCTION PROJECT', fr: 'PROJET DE CONSTRUCTION' };
}

function sentence(parts: string[]) {
  return present(parts.filter(Boolean).join(' '));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function parseSeedCatalog(content: string, locale: SeedLocale): SeedTranslations {
  const parsed = JSON.parse(content) as Record<string, Record<string, SeedTranslations>>;
  const rootKey = locale === 'ar-DZ' ? 'dz' : locale;
  const catalog = parsed[rootKey]?.site;
  if (!catalog || typeof catalog !== 'object') {
    throw new Error(`Missing locale seed catalog for ${locale}`);
  }
  return catalog as SeedTranslations;
}

async function loadSeedCatalogs(): Promise<SeedCatalogs> {
  const entries = await Promise.all(
    (Object.entries(SEED_FILES) as Array<[SeedLocale, string]>).map(async ([locale, filePath]) => {
      const content = await readFile(filePath, 'utf8');
      return [locale, parseSeedCatalog(content, locale)] as const;
    }),
  );
  return Object.fromEntries(entries) as SeedCatalogs;
}

function enrichLocalizedNode(
  node: unknown,
  keyPath: string,
  seeds: SeedCatalogs,
  missing: Array<{ locale: SeedLocale; key: string }>,
): unknown {
  if (Array.isArray(node)) {
    return node.map((item, index) => enrichLocalizedNode(item, `${keyPath}.${index}`, seeds, missing));
  }

  if (!isRecord(node)) return node;

  const isLocalizedText = typeof node.en === 'string' && typeof node.fr === 'string';
  if (isLocalizedText) {
    const authoredArDz = typeof node['ar-DZ'] === 'string' ? present(node['ar-DZ']) : '';
    const authoredDz = typeof node.dz === 'string' ? present(node.dz) : '';
    const authoredTr = typeof node.tr === 'string' ? present(node.tr) : '';
    const seededArDz = usableSeedTranslation(seeds['ar-DZ'][keyPath] ?? '', 'ar-DZ');
    const seededTr = usableSeedTranslation(seeds.tr[keyPath] ?? '', 'tr');
    const arDz = authoredArDz || authoredDz || seededArDz;
    const tr = authoredTr || seededTr;

    if (!arDz) missing.push({ locale: 'ar-DZ', key: keyPath });
    if (!tr) missing.push({ locale: 'tr', key: keyPath });

    return {
      ...node,
      'ar-DZ': arDz,
      dz: arDz,
      tr,
    };
  }

  const next: Record<string, unknown> = { ...node };
  for (const [key, value] of Object.entries(node)) {
    next[key] = enrichLocalizedNode(value, `${keyPath}.${key}`, seeds, missing);
  }
  return next;
}

function generateCopy(record: ProjectRecord, form: ParsedForm): GeneratedCopy {
  const label = projectLabel(record, form);
  const titleEn = localizedProjectTitle(record, 'en');
  const titleFr = localizedProjectTitle(record, 'fr');
  const reviewedSummaryEn = localizedProjectSummary(record, 'en');
  const reviewedSummaryFr = localizedProjectSummary(record, 'fr');
  const reviewedScopeEn = localizedProjectScope(record, 'en');
  const reviewedScopeFr = localizedProjectScope(record, 'fr');
  const locationEn = englishFactValue(form.location || record.location);
  const locationFr = form.location || record.location;
  const typeEn = englishFactValue(form.type || reviewedSummaryEn);
  const typeFr = present(form.type) || reviewedSummaryFr || reviewedScopeFr;

  const summaryEn = [
    sentence([`${titleEn} is a ${label.en.toLowerCase()}.`, `It is located in ${locationEn}.`]) || reviewedSummaryEn,
    sentence([
      form.contract ? `The contract is ${englishFactValue(form.contract).toLowerCase()}.` : '',
      form.client ? `Client: ${englishFactValue(form.client)}.` : '',
      form.architect ? `Architect: ${englishFactValue(form.architect)}.` : '',
      form.completion ? `Completion: ${englishFactValue(form.completion)}.` : '',
    ]) || reviewedScopeEn,
  ];

  const summaryFr = [
    sentence([`${titleFr} est un ${label.fr.toLowerCase()}.`, locationFr ? `Localisation: ${locationFr}.` : '']) || reviewedSummaryFr,
    sentence([
      form.contract ? `Type de contrat: ${form.contract}.` : '',
      form.client ? `Client: ${form.client}.` : '',
      form.architect ? `Architecte: ${form.architect}.` : '',
      form.completion ? `Achèvement: ${form.completion}.` : '',
    ]) || reviewedScopeFr,
  ];

  const descriptionEn = [
    sentence([reviewedSummaryEn, form.type ? `Programme: ${typeEn}.` : '']) || reviewedSummaryEn,
    sentence([record.details, reviewedScopeEn ? `Scope: ${englishFactValue(reviewedScopeEn)}.` : '']) || reviewedScopeEn,
  ];

  const descriptionFr = [
    sentence([form.intro || reviewedSummaryFr, form.type ? `Nature: ${form.type}.` : '']) || reviewedSummaryFr,
    sentence([form.highlights || record.details, form.construction ? `Portée: ${form.construction}.` : '']) || form.construction || record.scope,
  ];

  const authorityEn = sentence([
    `Igloo Construction coordinates the delivery with the discipline required for ${typeEn.toLowerCase()}.`,
    form.contribution ? englishFactValue(form.contribution) : englishFactValue(reviewedScopeEn),
  ]) || `${reviewedScopeEn} delivered by ${titleEn}.`;

  const authorityFr = sentence([
    `Igloo Construction coordonne la réalisation avec la rigueur nécessaire pour ${typeFr.toLowerCase()}.`,
    form.contribution || form.outcome || reviewedScopeFr,
  ]) || `${record.scope} réalisé pour ${titleFr}.`;

  const seoEn = sentence([
    `Explore the gallery, technical details, and location notes for ${titleEn}.`,
    'The project showcases a source-led residential and mixed-use delivery model.',
  ]) || reviewedSummaryEn;

  const seoFr = sentence([
    `Découvrez la galerie, les détails techniques et les repères de localisation de ${titleFr}.`,
    'La page présente une lecture claire et sourcée du projet.',
  ]) || form.outcome || form.intro || record.summary;

  const faqs = [
    {
      questionEn: `What is ${titleEn}?`,
      answerEn: sentence([`${titleEn} is located in ${locationEn}.`, form.type ? `It is a ${typeEn.toLowerCase()}.` : reviewedSummaryEn]),
      questionFr: `Qu’est-ce que ${titleFr} ?`,
      answerFr: sentence([`${titleFr} se situe à ${locationFr}.`, form.type ? `Il s’agit d’un ${typeFr.toLowerCase()}.` : form.intro || record.summary]),
    },
    {
      questionEn: 'What was the project scope?',
      answerEn: sentence([record.details, reviewedScopeEn]),
      questionFr: 'Quelle est la portée du projet ?',
      answerFr: sentence([form.highlights || form.construction || record.details, form.contribution || record.scope]),
    },
    {
      questionEn: 'Who led the delivery?',
      answerEn: sentence([
        form.client ? `Client: ${englishFactValue(form.client)}.` : '',
        form.architect ? `Architect: ${englishFactValue(form.architect)}.` : '',
        form.contract ? `Contract: ${englishFactValue(form.contract)}.` : '',
      ]),
      questionFr: 'Qui a porté la réalisation ?',
      answerFr: sentence([
        form.client ? `Client: ${form.client}.` : '',
        form.architect ? `Architecte: ${form.architect}.` : '',
        form.contract ? `Contrat: ${form.contract}.` : '',
      ]),
    },
    {
      questionEn: 'What makes the project notable?',
      answerEn: sentence([form.outcome || reviewedSummaryEn, form.contribution || reviewedScopeEn]),
      questionFr: 'Qu’est-ce qui distingue le projet ?',
      answerFr: sentence([form.outcome || form.intro || record.summary, form.contribution || form.highlights || record.scope]),
    },
  ].filter((item) => item.answerEn && item.answerFr);

  if (record.slug === 'rahmania') {
    summaryFr[0] = 'Deux centres commerciaux réalisés à Douira dans le cadre du programme résidentiel de 2 500 logements.';
    summaryFr[1] = 'Un ensemble de commerces et de services pensé pour accompagner la vie quotidienne du quartier.';
    descriptionFr[0] = 'Travaux de réalisation en corps d’état secondaire des deux centres commerciaux du programme résidentiel de 2 500 logements à Douira. Programme : centres commerciaux.';
    descriptionFr[1] = 'Un ensemble de commerces et de services pensé pour accompagner la vie quotidienne du quartier. Portée : un centre commercial coordonné avec un grand schéma résidentiel.';
  }

  return {
    titleEn,
    titleFr,
    eyebrowEn: label.en,
    eyebrowFr: label.fr,
    summaryEn: presentList(summaryEn, [reviewedSummaryEn]),
    summaryFr: presentList(summaryFr, [reviewedSummaryFr]),
    descriptionEn: presentList(descriptionEn, [record.details, reviewedScopeEn]),
    descriptionFr: presentList(descriptionFr, [reviewedSummaryFr, reviewedScopeFr]),
    authorityEn,
    authorityFr,
    seoEn,
    seoFr,
    faqs: faqs.map((item) => ({
      questionEn: item.questionEn,
      answerEn: item.answerEn,
      questionFr: item.questionFr,
      answerFr: item.answerFr,
    })),
  };
}

async function nearbyPlacesFromMaps(location: string): Promise<string[] | null> {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key || !location) return null;
  try {
    const geocode = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${encodeURIComponent(key)}`).then((response) => response.json()) as { results?: Array<{ geometry?: { location?: { lat: number; lng: number } } }> };
    const point = geocode.results?.[0]?.geometry?.location;
    if (!point) return null;
    const places = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'places.displayName,places.formattedAddress' },
      body: JSON.stringify({ maxResultCount: 5, locationRestriction: { circle: { center: { latitude: point.lat, longitude: point.lng }, radius: 2500 } } }),
    }).then((response) => response.json()) as { places?: Array<{ displayName?: { text?: string }; formattedAddress?: string }> };
    const items = (places.places || []).slice(0, 5).flatMap((place) => place.displayName?.text ? [`${place.displayName.text}${place.formattedAddress ? ` — ${place.formattedAddress}` : ''}`] : []);
    return items.length ? items : null;
  } catch (error) {
    process.stderr.write(`Maps lookup skipped for ${location}: ${error instanceof Error ? error.message : String(error)}\n`);
    return null;
  }
}

function nearbyPlacesFromForm(form: ParsedForm, record: ProjectRecord): string[] | null {
  const text = [form.intro, form.highlights, form.construction, record.summary, record.scope].filter(present).join(' ');
  if (!text) return null;
  const cues: Array<{ pattern: RegExp; label: string }> = [
    { pattern: /axes principaux|grands axes|accÃ¨s facile|main roads?/i, label: 'Easy access to main roads' },
    { pattern: /vue sur (la )?mer|sea views?|ouverture sur la mer/i, label: 'Sea views' },
    { pattern: /centre[- ]ville|city cent(re|er)/i, label: 'Close to the city centre' },
    { pattern: /transports?|light rail|bus(es)?/i, label: 'Public transport nearby' },
    { pattern: /Ã©coles?|schools?/i, label: 'Schools nearby' },
    { pattern: /commerces?|shops?|local shops/i, label: 'Local shops nearby' },
  ];
  const items = cues.filter((cue) => cue.pattern.test(text)).map((cue) => cue.label);
  return items.length ? items : null;
}

async function nearbyPlaces(location: string, form: ParsedForm, record: ProjectRecord): Promise<string[] | null> {
  return (await nearbyPlacesFromMaps(location)) || nearbyPlacesFromForm(form, record);
}

async function main() {
  const skipMaps = process.argv.includes('--skip-maps');
  const output: Record<string, unknown> = {};
  for (const source of SOURCE_PROJECTS) {
    const record = projects.find((project) => project.slug === (SOURCE_PROJECT_ALIASES[source.slug] ?? source.slug));
    if (!record) throw new Error(`Missing project record for ${source.slug}`);
    process.stdout.write(`Building ${record.slug}...\n`);
    const [form, assets, analysis] = await Promise.all([parseForm(source.formFile), optimizeImages(source.slug, source.photoFolder), readAnalysis(source.photoFolder)]);
    const copy = generateCopy(record, form);
    const editorial = getProjectEditorialContent(record);
    const nearby = skipMaps ? nearbyPlacesFromForm(form, record) : await nearbyPlaces(form.location || record.location, form, record);
    const meta = [
      form.contract && { label: localized('Form of contract', 'Type de contrat'), value: localized(form.contract, form.contract) },
      form.client && { label: localized('Client', 'Client'), value: localized(form.client, form.client) },
      form.architect && { label: localized('Architect', 'Architecte'), value: localized(form.architect, form.architect) },
      form.type && { label: localized('Project type', 'Nature du projet'), value: localized(englishFactValue(form.type), form.type) },
    ].filter(Boolean);
    const details = [
      { label: localized('Location', 'Localisation'), value: localized(form.location || record.location, form.location || record.location) },
      form.completion && { label: localized('Completion', 'Achèvement'), value: localized(form.completion, form.completion) },
      ...form.facts.map((fact) => ({ label: localized(englishFactLabel(fact.label), fact.label), value: localized(englishFactValue(fact.value), fact.value) })),
    ].filter(Boolean);
    output[source.slug] = {
      slug: source.slug,
      title: localized(copy.titleEn, copy.titleFr),
      eyebrow: localized(copy.eyebrowEn, copy.eyebrowFr),
      summary: copy.summaryEn.map((paragraph, index) => localized(paragraph, copy.summaryFr[index] || copy.summaryFr[0] || form.intro)),
      description: copy.descriptionEn.map((paragraph, index) => localized(paragraph, copy.descriptionFr[index] || copy.descriptionFr[0] || form.highlights || form.intro)),
      authority: localized(copy.authorityEn, copy.authorityFr),
      seo: localized(copy.seoEn, copy.seoFr),
      meta,
      details,
      facilityGroups: [
        { title: localized('Project programme', 'Programme du projet'), items: form.facts.slice(0, 5).map((fact) => localized(englishFactValue(fact.value), fact.value)) },
        ...(form.construction ? [{ title: localized('Construction scope', 'Portée des travaux'), items: [localized(englishFactValue(form.construction), form.construction)] }] : []),
      ],
      nearby: nearby ? { title: localized('Nearby places', 'À proximité'), items: nearby.map((item) => localized(item, item)) } : null,
      faq: copy.faqs.map((faq) => ({ question: localized(faq.questionEn, faq.questionFr), answer: localized(faq.answerEn, faq.answerFr) })),
      images: imageManifest(assets, analysis),
    };
    if (editorial) {
      const generated = output[source.slug] as {
        summary: unknown;
        description: unknown;
        authority: unknown;
        details: unknown;
        facilityGroups: unknown;
        faq: Array<{ question: Localized; answer: Localized }>;
      };
      generated.summary = [editorial.heroDescription, editorial.intro];
      generated.description = editorial.columns;
      generated.authority = editorial.statement;
      generated.details = editorial.facts;
      generated.facilityGroups = [
        {
          title: localized('Project programme', 'Programme du projet'),
          items: editorial.scopeItems.map((item) => item.text),
        },
      ];
      // The reviewed editorial copy is authoritative for the visible project narrative.
      // Reuse it in every FAQ answer so stale form paragraphs cannot reappear after a rebuild.
      // The old form-derived answers were especially visible in French ("se situe",
      // "Algerie", duplicated full stops) and made the copy read like machine output.
      generated.faq = generated.faq.map((faq) => {
        const question = faq.question.en;
        if (question.startsWith('What is ')) {
          return { ...faq, answer: { ...editorial.heroDescription } };
        }
        if (question === 'What was the project scope?') {
          return { ...faq, answer: { ...editorial.columns[0] } };
        }
        if (question === 'Who led the delivery?') {
          return { ...faq, answer: { ...editorial.statement } };
        }
        if (question === 'What makes the project notable?') {
          return { ...faq, answer: { ...editorial.intro } };
        }
        return faq;
      });
    }
  }
  const seeds = await loadSeedCatalogs();
  const missing: Array<{ locale: SeedLocale; key: string }> = [];
  for (const [slug, value] of Object.entries(output)) {
    output[slug] = enrichLocalizedNode(value, `projectContent.${slug}`, seeds, missing);
  }
  if (missing.length && process.argv.includes('--strict-locales')) {
    const grouped = missing.reduce<Record<SeedLocale, string[]>>((acc, item) => {
      acc[item.locale].push(item.key);
      return acc;
    }, { 'ar-DZ': [], tr: [] });
    const summary = (Object.entries(grouped) as Array<[SeedLocale, string[]]>)
      .filter(([, keys]) => keys.length)
      .map(([locale, keys]) => `${locale}: ${keys.slice(0, 12).join(', ')}${keys.length > 12 ? ` … (+${keys.length - 12} more)` : ''}`)
      .join(' | ');
    throw new Error(`Missing Lingui seed translations for project content: ${summary}`);
  }

  if (missing.length) {
    const grouped = missing.reduce<Record<SeedLocale, number>>((acc, item) => {
      acc[item.locale] += 1;
      return acc;
    }, { 'ar-DZ': 0, tr: 0 });
    console.warn(
      `Skipped ${missing.length} incomplete or mixed-language seed translations ` +
      `(ar-DZ: ${grouped['ar-DZ']}, tr: ${grouped.tr}). ` +
      'Run with --strict-locales to make these gaps a blocking error.',
    );
  }
  const source = `import type { ProjectContentBySlug } from './projectContent';\n\n// Generated from Nouveau dossier forms and local project images.\nexport const generatedProjectContent: ProjectContentBySlug = ${JSON.stringify(output, null, 2)};\n`;
  await writeFile(OUTPUT_FILE, source, 'utf8');
  process.stdout.write(`Saved ${OUTPUT_FILE}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
