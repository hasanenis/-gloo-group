import { projects, type ProjectRecord } from './projects';
import { generatedProjectContent } from './projectContent.generated';
import { pickLocaleText, type Locale } from '../i18n/runtime';
import { getProjectPage } from '../content';

export type LocalizedText = { en: string; fr: string; 'ar-DZ'?: string; dz?: string; tr?: string };
export type LocalizedList = { title: LocalizedText; items: LocalizedText[] };

export type ProjectImage = {
  src: string;
  alt: LocalizedText;
  caption?: LocalizedText;
};

export type ProjectImages = {
  hero: ProjectImage[];
  intro?: ProjectImage;
  mosaic: ProjectImage[];
  featureGallery: ProjectImage[];
  constructionGallery: ProjectImage[];
  featured: ProjectImage[];
};

export type ProjectFact = { label: LocalizedText; value: LocalizedText };
export type ProjectFaq = { question: LocalizedText; answer: LocalizedText };

export type ProjectContent = {
  slug: string;
  title: LocalizedText;
  eyebrow: LocalizedText;
  summary: LocalizedText[];
  description: LocalizedText[];
  authority: LocalizedText;
  seo: LocalizedText;
  meta: ProjectFact[];
  details: ProjectFact[];
  facilityGroups: LocalizedList[];
  nearby: LocalizedList | null;
  faq: ProjectFaq[];
  images: ProjectImages;
};

export type ProjectContentBySlug = Record<string, ProjectContent>;

const GENERATED_CONTENT_ALIASES: Record<string, string> = {
  rahmania: 'douira-commercial-centers-2500-housing',
};

function fallbackImage(project: ProjectRecord, index: number): ProjectImage {
  const src = project.images[index % project.images.length];
  return { src, alt: { en: project.title, fr: project.menuTitle } };
}

function fallbackContent(project: ProjectRecord): ProjectContent {
  const images = project.images.map((_, index) => fallbackImage(project, index));
  return {
    slug: project.slug,
    title: { en: project.title, fr: project.menuTitle },
    eyebrow: { en: project.location, fr: project.location },
    summary: [{ en: project.summary, fr: project.summary }],
    description: [{ en: project.details, fr: project.details }, { en: project.scope, fr: project.scope }],
    authority: { en: `${project.scope} delivered by ${project.title}.`, fr: `${project.scope} réalisé pour ${project.menuTitle}.` },
    seo: { en: project.summary, fr: project.summary },
    meta: [
      { label: { en: 'Status', fr: 'Statut' }, value: { en: project.chapterLabel, fr: project.chapterLabel } },
      { label: { en: 'Location', fr: 'Localisation' }, value: { en: project.location, fr: project.location } },
    ],
    details: [], facilityGroups: [], nearby: null, faq: [],
    images: { hero: images.slice(0, 3), intro: images[1] ?? images[0], mosaic: images.slice(0, 6), featureGallery: images.slice(1), constructionGallery: [], featured: images.slice(0, 1) },
  };
}

function getLegacyProjectContent(project: ProjectRecord) {
  const directContent = generatedProjectContent[project.slug];
  if (directContent) return directContent;

  const aliasedSlug = GENERATED_CONTENT_ALIASES[project.slug];
  const aliasedContent = aliasedSlug ? generatedProjectContent[aliasedSlug] : undefined;
  if (aliasedContent) {
    return {
      ...aliasedContent,
      slug: project.slug,
    };
  }

  return fallbackContent(project);
}

function canonicalProjectNode(slug: string, path = ''): unknown {
  const documents = (['en', 'fr', 'tr', 'ar-DZ'] as const).map((locale) => getProjectPage<Record<string, unknown>>(slug, locale).content);
  const english = path.split('.').filter(Boolean).reduce<unknown>((current, segment) => {
    if (!current || typeof current !== 'object') return undefined;
    return (current as Record<string, unknown>)[segment];
  }, documents[0]);
  if (typeof english === 'string') {
    const leaf = path.split('.').at(-1);
    if (leaf === 'slug' || leaf === 'src') return english;
    return Object.fromEntries((['en', 'fr', 'tr', 'ar-DZ'] as const).map((locale, index) => {
      const value = path.split('.').filter(Boolean).reduce<unknown>((current, segment) => {
        if (!current || typeof current !== 'object') return undefined;
        return (current as Record<string, unknown>)[segment];
      }, documents[index]);
      return [locale, value];
    }));
  }
  if (Array.isArray(english)) return english.map((_, index) => canonicalProjectNode(slug, path ? `${path}.${index}` : String(index)));
  if (english && typeof english === 'object') {
    return Object.fromEntries(Object.keys(english as Record<string, unknown>).map((key) => [key, canonicalProjectNode(slug, path ? `${path}.${key}` : key)]));
  }
  return english;
}

const canonicalProjectContent: ProjectContentBySlug = Object.fromEntries(
  projects.map((project) => [project.slug, canonicalProjectNode(project.slug) as ProjectContent]),
);

export function getProjectContent(project: ProjectRecord) {
  return canonicalProjectContent[project.slug] ?? getLegacyProjectContent(project);
}

export function localized(value: LocalizedText, locale: Locale) {
  return pickLocaleText(locale, value);
}

export const projectContentBySlug: ProjectContentBySlug = Object.fromEntries(
  projects.map((project) => [project.slug, getProjectContent(project)]),
);
