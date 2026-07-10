import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generatedProjectContent } from '../src/data/projectContent.generated';
import { homepageContent, homepageProjectProofs } from '../src/data/homepageContent';
import { companyProfile, heroSlides, imageSliderImages, projects } from '../src/data/projects';
import { dictionary, pickLocaleText, type Locale, type LocalizedString } from '../src/i18n';

const locales: Locale[] = ['en', 'fr', 'dz', 'tr'];
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = join(root, 'config', 'locales');

type Flat = Record<string, string>;

function isLocalizedString(value: unknown): value is LocalizedString {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'en' in value &&
      typeof (value as Record<string, unknown>).en === 'string',
  );
}

function collectLocalizedStrings(value: unknown, path: string[], rows: Array<{ key: string; value: LocalizedString }>) {
  if (isLocalizedString(value)) {
    rows.push({ key: path.join('.'), value });
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => collectLocalizedStrings(item, [...path, String(index)], rows));
    return;
  }

  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => {
      if (typeof item === 'function') return;
      collectLocalizedStrings(item, [...path, key], rows);
    });
  }
}

function collectPlainProjectStrings(rows: Array<{ key: string; value: LocalizedString }>) {
  projects.forEach((project) => {
    const base = ['projects', project.slug, 'record'];
    rows.push(
      { key: [...base, 'title'].join('.'), value: { en: project.title, fr: project.menuTitle } },
      { key: [...base, 'menuTitle'].join('.'), value: { en: project.menuTitle, fr: project.menuTitle } },
      { key: [...base, 'chapterLabel'].join('.'), value: { en: project.chapterLabel } },
      { key: [...base, 'location'].join('.'), value: { en: project.location, fr: project.location } },
      { key: [...base, 'summary'].join('.'), value: { en: project.summary } },
      { key: [...base, 'details'].join('.'), value: { en: project.details } },
      { key: [...base, 'scope'].join('.'), value: { en: project.scope } },
      { key: [...base, 'coverLine0'].join('.'), value: { en: project.coverLines[0], fr: project.coverLines[0] } },
      { key: [...base, 'coverLine1'].join('.'), value: { en: project.coverLines[1], fr: project.coverLines[1] } },
    );
  });

  heroSlides.forEach((slide, index) => {
    rows.push({ key: `heroSlides.${index}.caption`, value: { en: slide.caption, fr: slide.caption } });
  });

  imageSliderImages.forEach((image, index) => {
    rows.push({ key: `imageSliderImages.${index}.src`, value: { en: image, fr: image } });
  });
}

function buildLocale(locale: Locale) {
  const rows: Array<{ key: string; value: LocalizedString }> = [];
  collectLocalizedStrings(dictionary.en, ['ui'], rows);
  collectLocalizedStrings(homepageContent, ['homepage'], rows);
  collectLocalizedStrings(homepageProjectProofs, ['homepageProjectProofs'], rows);
  collectLocalizedStrings(companyProfile, ['companyProfile'], rows);
  collectLocalizedStrings(generatedProjectContent, ['projectContent'], rows);
  collectPlainProjectStrings(rows);

  return rows.reduce<Flat>((flat, row) => {
    flat[row.key] = locale === 'en' ? row.value.en : pickLocaleText(locale, row.value);
    return flat;
  }, {});
}

mkdirSync(outputDir, { recursive: true });

locales.forEach((locale) => {
  const payload = {
    [locale]: {
      site: buildLocale(locale),
    },
  };

  writeFileSync(join(outputDir, `site.${locale}.yml`), `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
});
