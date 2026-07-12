import { projects, type ProjectRecord } from './projects';
import {
  getProjectContent,
  localized,
  type LocalizedList,
  type ProjectContent,
  type ProjectFaq,
  type ProjectFact,
  type ProjectImage,
} from './projectContent';
import { pickLocaleText, type Locale } from '../i18n/runtime';
import {
  localizedProjectScope,
  localizedProjectShortTitle,
  localizedProjectStatus,
  localizedProjectTitle,
} from './projects';

export type BatProjectFact = {
  label: string;
  value: string;
};

export type BatProjectDisplayTitles = {
  heroTitle: string;
  heroTitleLines: string[];
  editorialTitle: string;
  relatedTitle: string;
};

export type BatProjectPageModel = {
  slug: string;
  project: ProjectRecord;
  content: ProjectContent;
  displayTitles: BatProjectDisplayTitles;
  hero: {
    pretitle: string;
    title: string;
    titleLines: string[];
    image: ProjectImage;
    facts: BatProjectFact[];
  };
  editorialText: {
    title: string;
    paragraphs: string[];
  };
  featureMedia: {
    image: ProjectImage;
    caption: string;
  };
  relatedProjects: ProjectRecord[];
  extraSections: {
    technicalFacts: BatProjectFact[];
    companyParagraphs: string[];
    faq: ProjectFaq[];
    details: ProjectFact[];
    programme: LocalizedList[];
    nearby: LocalizedList | null;
    closing: {
      title: string;
      body: string;
    };
  };
};

type BatProjectModelOptions = {
  displayTitleOverride?: string;
};

const CURATED_SHORT_TITLES: Record<string, string> = {
  'douaouda-300-500-housing': '300/500 Housing',
  'sidi-abdallah-200-1200-housing': 'Public Housing',
  'staoueli-11-41-villas': '11/41 Villas',
  rahmania: 'Douira',
  'said-hamdine-mixed-real-estate': 'Mixed Complex',
  'rouiba-4-promotional-villas': 'Four Villas',
  'sidi-benour-50-housing': '50 Housing',
  'dely-brahim-240-housing': '240 Housing',
  'bas-mazagran-200-38-housing': '200 + 38 Housing',
  'reghaia-bouraada-250-housing': '250 Housing',
  'boudouaou-70-10-housing': '70 + 10 Housing',
};

function uniqueFacts(facts: BatProjectFact[]) {
  const seen = new Set<string>();
  return facts.filter((fact) => {
    const key = `${fact.label}::${fact.value}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function splitHeadline(text: string, targetLines = 3) {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return [''];

  const words = normalized.split(' ');
  if (words.length <= 2) return [normalized];

  const lines: string[] = [];
  let current = '';
  const totalLength = normalized.length;
  const lineCount = Math.min(targetLines, totalLength > 110 ? 3 : totalLength > 48 ? 2 : 1);

  if (lineCount === 1) return [normalized];

  const targetLength = totalLength / lineCount;

  for (let index = 0; index < words.length; index += 1) {
    const word = words[index];
    const next = current ? `${current} ${word}` : word;
    const remainingWords = words.length - index - 1;
    const remainingLines = lineCount - lines.length - 1;

    if (current && next.length > targetLength && remainingWords >= remainingLines) {
      lines.push(current);
      current = word;
      continue;
    }

    current = next;
  }

  if (current) lines.push(current);
  return lines.slice(0, lineCount);
}

function firstNonEmpty(...values: Array<string | null | undefined>) {
  return values.find((value) => typeof value === 'string' && value.trim().length > 0)?.trim() ?? '';
}

function normalizeProjectTitle(title: string) {
  const normalized = title
    .replace(/\bwith\b.*$/i, '')
    .replace(/\band\b.*$/i, '')
    .replace(/\b(Assisted|Promotional|Public|Free)\b/gi, '')
    .replace(/\bUnits?\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return normalized || title.trim();
}

function resolveDisplayTitles(project: ProjectRecord, locale: Locale, options: BatProjectModelOptions = {}): BatProjectDisplayTitles {
  const resolvedTitle = firstNonEmpty(
    options.displayTitleOverride,
    localizedProjectShortTitle(project, locale),
    CURATED_SHORT_TITLES[project.slug],
    project.coverLines[1],
    project.menuTitle,
    normalizeProjectTitle(project.title),
  );

  return {
    heroTitle: resolvedTitle,
    heroTitleLines: splitHeadline(resolvedTitle, 3),
    editorialTitle: resolvedTitle,
    relatedTitle: resolvedTitle,
  };
}

function projectLabel(project: ProjectRecord, _locale: Locale) {
  // Proper-noun project labels are not translated; kept consistent across locales.
  return project.menuTitle;
}

function buildHeroFacts(project: ProjectRecord, content: ProjectContent, locale: Locale) {
  const fromContent = [
    ...content.meta.map((fact) => ({
      label: localized(fact.label, locale),
      value: localized(fact.value, locale),
    })),
    ...content.details.slice(0, 4).map((fact) => ({
      label: localized(fact.label, locale),
      value: localized(fact.value, locale),
    })),
  ];

  const fallbackFacts: BatProjectFact[] = [
    { label: pickLocaleText(locale, { en: 'Status', fr: 'Statut', dz: 'الحالة', tr: 'Durum' }), value: localizedProjectStatus(project, locale) },
    { label: pickLocaleText(locale, { en: 'Location', fr: 'Localisation', dz: 'الموقع', tr: 'Konum' }), value: project.location },
    { label: pickLocaleText(locale, { en: 'Scope', fr: 'Périmètre', dz: 'نطاق الخدمة', tr: 'İşin Kapsamı' }), value: localizedProjectScope(project, locale) },
  ];

  return uniqueFacts([...fromContent, ...fallbackFacts])
    .filter((fact) => {
      const label = fact.label.toLowerCase();
      const value = fact.value.trim();
      if (!value || value.length > 80) return false;
      return !['objective', 'description', 'presentation'].some((blocked) => label.includes(blocked));
    })
    .slice(0, 4);
}

function buildTechnicalFacts(project: ProjectRecord, content: ProjectContent, locale: Locale) {
  return uniqueFacts([
    ...content.details.slice(0, 4).map((fact) => ({
      label: localized(fact.label, locale),
      value: localized(fact.value, locale),
    })),
    { label: pickLocaleText(locale, { en: 'Status', fr: 'Statut', dz: 'الحالة', tr: 'Durum' }), value: localizedProjectStatus(project, locale) },
    { label: pickLocaleText(locale, { en: 'Location', fr: 'Localisation', dz: 'الموقع', tr: 'Konum' }), value: project.location },
  ]).slice(0, 6);
}

export function buildBatProjectPageModel(project: ProjectRecord, locale: Locale, options: BatProjectModelOptions = {}): BatProjectPageModel {
  const content = getProjectContent(project);
  const fallbackHeroImage: ProjectImage = {
    src: project.images[0],
    alt: {
      en: localizedProjectTitle(project, 'en'),
      fr: localizedProjectTitle(project, 'fr'),
      dz: localizedProjectTitle(project, 'ar-DZ'),
      tr: localizedProjectTitle(project, 'tr'),
    },
  };
  const heroImage =
    content.images.hero[0] ??
    content.images.intro ??
    content.images.featured[0] ??
    content.images.mosaic[0] ??
    fallbackHeroImage;

  const featureImage =
    content.images.featureGallery[0] ??
    content.images.mosaic[0] ??
    content.images.hero[1] ??
    heroImage;

  const editorialParagraphs = [
    ...content.summary.map((paragraph) => localized(paragraph, locale)),
    ...content.description.map((paragraph) => localized(paragraph, locale)),
  ].filter(Boolean).slice(0, 3);

  const relatedProjects = projects.filter((item) => item.slug !== project.slug).slice(0, 5);
  const displayTitles = resolveDisplayTitles(project, locale, options);

  return {
    slug: project.slug,
    project,
    content,
    displayTitles,
    hero: {
      pretitle: projectLabel(project, locale),
      title: displayTitles.heroTitle,
      titleLines: displayTitles.heroTitleLines,
      image: heroImage,
      facts: buildHeroFacts(project, content, locale),
    },
    editorialText: {
      title: displayTitles.editorialTitle,
      paragraphs: editorialParagraphs,
    },
    featureMedia: {
      image: featureImage,
      caption: localized(featureImage.caption ?? content.seo, locale),
    },
    relatedProjects,
    extraSections: {
      technicalFacts: buildTechnicalFacts(project, content, locale),
      companyParagraphs: [
        localized(content.authority, locale),
        localized(content.seo, locale),
      ].filter(Boolean),
      faq: content.faq,
      details: content.details,
      programme: content.facilityGroups,
      nearby: content.nearby,
      closing: {
        title: localized(content.title, locale),
        body: localized(content.seo, locale),
      },
    },
  };
}
