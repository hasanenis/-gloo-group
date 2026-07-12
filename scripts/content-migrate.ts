import fs from 'node:fs/promises';
import path from 'node:path';
import { projects } from '../src/data/projects.ts';
import { getProjectContent } from '../src/data/projectContent.ts';
import { homepageContent } from '../src/data/homepageContent.ts';

export const CONTENT_LOCALES = ['en', 'fr', 'tr', 'ar-DZ'] as const;
export type ContentLocale = (typeof CONTENT_LOCALES)[number];

const root = path.resolve(process.cwd(), 'content');
const now = new Date().toISOString();

function clean(value: string): string {
  // Source modules already expose repaired Unicode values. Do not run the
  // legacy runtime repair here: it was designed for browser fallback strings
  // and can reinterpret valid accented characters when used during export.
  return value.replace(/\u0000/g, '');
}

function selectLocalized(value: unknown, locale: ContentLocale): unknown {
  if (typeof value === 'string') return clean(value);
  if (Array.isArray(value)) return value.map((entry) => selectLocalized(entry, locale));
  if (!value || typeof value !== 'object') return value;
  const record = value as Record<string, unknown>;
  const localizedKeys = ['en', 'fr', 'tr', 'ar-DZ', 'dz'];
  if (localizedKeys.some((key) => key in record) && typeof record.en === 'string') {
    const selected = record[locale] ?? (locale === 'ar-DZ' ? record.dz : undefined);
    return typeof selected === 'string' ? clean(selected) : '';
  }
  return Object.fromEntries(Object.entries(record).map(([key, entry]) => [key, selectLocalized(entry, locale)]));
}

function strings(value: unknown, prefix = 'content'): Array<{ key: string; kind: string; required: boolean }> {
  if (typeof value === 'string') return [{ key: prefix, kind: /(?:title|heading|eyebrow)/i.test(prefix) ? 'heading' : 'body', required: true }];
  if (Array.isArray(value)) return value.flatMap((entry, index) => strings(entry, `${prefix}[${index}]`));
  if (!value || typeof value !== 'object') return [];
  return Object.entries(value).flatMap(([key, entry]) => strings(entry, `${prefix}.${key}`));
}

function revision(value: unknown): string {
  const json = JSON.stringify(value);
  let hash = 2166136261;
  for (let i = 0; i < json.length; i += 1) {
    hash ^= json.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `v1-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

async function writeJson(file: string, value: unknown) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function document(pageId: string, locale: ContentLocale, content: unknown, seo: Record<string, string>, sourceRevision: string, status: 'approved' | 'review' = 'approved') {
  const currentRevision = revision({ pageId, locale, content, seo });
  return { schemaVersion: 1, pageId, locale, sourceLocale: 'en', revision: currentRevision, sourceRevision, status, updatedAt: now, seo, content };
}

async function buildProjectPages() {
  for (const project of projects) {
    const pageId = `projects/${project.slug}`;
    const pageContent = getProjectContent(project);
    const source = selectLocalized(pageContent, 'en');
    const sourceRevision = revision(source);
    const pageMeta = {
      schemaVersion: 1,
      pageId,
      path: `/projects/${project.slug}`,
      sourceLocale: 'en',
      fields: strings(source),
      facts: {
        slug: project.slug,
        title: project.title,
        location: project.location,
        status: project.status,
        sourceSlides: project.sourceSlides,
        client: project.client ?? null,
        architect: project.architect ?? null,
        formOfContract: project.formOfContract ?? null,
      },
    };
    const dir = path.join(root, 'pages', 'projects', project.slug);
    await writeJson(path.join(dir, 'page.json'), pageMeta);
    await writeJson(path.join(dir, 'facts.json'), pageMeta.facts);
    for (const locale of CONTENT_LOCALES) {
      const content = selectLocalized(pageContent, locale);
      const title = String((content as Record<string, unknown>).title ?? project.title);
      const description = String((content as Record<string, unknown>).seo ?? (content as Record<string, unknown>).summary ?? project.summary);
      const status = locale === 'en' || strings(content).every(({ key }) => key.length > 0) ? 'approved' : 'review';
      await writeJson(path.join(dir, `${locale}.json`), document(pageId, locale, content, {
        title,
        description,
        socialTitle: title,
        socialDescription: description,
      }, sourceRevision, status));
    }
  }
}

const sharedCopy: Record<ContentLocale, Record<string, string>> = {
  en: { home: 'Home', projects: 'Projects', company: 'Company', contact: 'Contact', services: 'Services', allProjects: 'All projects', openProject: 'Open project', readMore: 'Read more', previous: 'Previous', next: 'Next', languageSelector: 'Language selector', projectOverview: 'Project overview', projectDetails: 'Details & location', construction: 'Construction delivery', projectGallery: 'Project gallery', facilities: 'Housing & infrastructure', nearby: "What's around", faq: 'Frequently asked questions', relatedProjects: 'Featured projects', discuss: 'Discuss a project' },
  fr: { home: 'Accueil', projects: 'Projets', company: 'Entreprise', contact: 'Contact', services: 'Services', allProjects: 'Tous les projets', openProject: 'Ouvrir le projet', readMore: 'Lire la suite', previous: 'Précédent', next: 'Suivant', languageSelector: 'Sélecteur de langue', projectOverview: 'Présentation du projet', projectDetails: 'Détails et localisation', construction: 'Réalisation des travaux', projectGallery: 'Galerie du projet', facilities: 'Logements et infrastructures', nearby: 'À proximité', faq: 'Questions fréquentes', relatedProjects: 'Projets sélectionnés', discuss: 'Parler d’un projet' },
  tr: { home: 'Ana sayfa', projects: 'Projeler', company: 'Kurumsal', contact: 'İletişim', services: 'Hizmetler', allProjects: 'Tüm projeler', openProject: 'Projeyi aç', readMore: 'Devamını okuyun', previous: 'Önceki', next: 'Sonraki', languageSelector: 'Dil seçimi', projectOverview: 'Proje özeti', projectDetails: 'Detaylar ve konum', construction: 'Yapım süreci', projectGallery: 'Proje galerisi', facilities: 'Konut ve altyapı', nearby: 'Yakın çevre', faq: 'Sık sorulan sorular', relatedProjects: 'Öne çıkan projeler', discuss: 'Proje hakkında konuşalım' },
  'ar-DZ': { home: 'الرئيسية', projects: 'المشاريع', company: 'الشركة', contact: 'اتصل بنا', services: 'الخدمات', allProjects: 'جميع المشاريع', openProject: 'فتح المشروع', readMore: 'اقرأ المزيد', previous: 'السابق', next: 'التالي', languageSelector: 'اختيار اللغة', projectOverview: 'نظرة عامة على المشروع', projectDetails: 'التفاصيل والموقع', construction: 'تنفيذ الأشغال', projectGallery: 'معرض المشروع', facilities: 'السكن والبنية التحتية', nearby: 'ما يحيط بالمشروع', faq: 'الأسئلة الشائعة', relatedProjects: 'مشاريع مختارة', discuss: 'ناقش مشروعًا' },
};

async function buildGeneralPages() {
  const homeSource = selectLocalized(homepageContent, 'en');
  const homeRevision = revision(homeSource);
  await writeJson(path.join(root, 'pages', 'home', 'page.json'), { schemaVersion: 1, pageId: 'home', path: '/', sourceLocale: 'en', fields: strings(homeSource) });
  for (const locale of CONTENT_LOCALES) {
    const content = selectLocalized(homepageContent, locale);
    const title = locale === 'en' ? 'Igloo Construction — Building for Algeria' : locale === 'fr' ? 'Igloo Construction — Construire pour l’Algérie' : locale === 'tr' ? 'Igloo Construction — Cezayir için inşa ediyoruz' : 'إيغلو للإنشاءات — نبني من أجل الجزائر';
    const hero = (content as Record<string, unknown>).hero as Record<string, unknown> | undefined;
    const description = typeof hero?.lead === 'string' ? hero.lead : title;
    await writeJson(path.join(root, 'pages', 'home', `${locale}.json`), document('home', locale, content, { title, description, socialTitle: title, socialDescription: description }, homeRevision));
  }

  const pages: Record<string, { title: Record<ContentLocale, string>; content: Record<ContentLocale, Record<string, unknown>> }> = {
    about: {
      title: { en: 'Company | Igloo Construction', fr: 'Entreprise | Igloo Construction', tr: 'Kurumsal | Igloo Construction', 'ar-DZ': 'الشركة | إيغلو للإنشاءات' },
      content: {
        en: { eyebrow: 'Company', heading: 'A technical team focused on site delivery.', body: 'Founded in 2018 in Algiers, SARL Igloo Yapi Construction delivers residential and mixed-use projects through coordinated engineering, procurement and site teams.' },
        fr: { eyebrow: 'Entreprise', heading: 'Une équipe technique mobilisée sur le chantier.', body: 'Fondée en 2018 à Alger, SARL Igloo Yapi Construction réalise des projets résidentiels et mixtes grâce à une coordination étroite entre études, achats et équipes de chantier.' },
        tr: { eyebrow: 'Kurumsal', heading: 'Projeyi sahada yöneten teknik ekip.', body: '2018’de Cezayir’de kurulan SARL Igloo Yapi Construction, mühendislik, satın alma ve saha ekiplerini koordineli biçimde bir araya getirerek konut ve karma kullanım projeleri yürütür.' },
        'ar-DZ': { eyebrow: 'الشركة', heading: 'فريق تقني يقود التنفيذ في الورشة.', body: 'تأسست شركة SARL Igloo Yapi Construction في الجزائر عام 2018، وتنجز المشاريع السكنية ومتعددة الاستخدامات من خلال تنسيق وثيق بين الهندسة والمشتريات وفرق الموقع.' },
      },
    },
    contact: {
      title: { en: 'Contact | Igloo Construction', fr: 'Contact | Igloo Construction', tr: 'İletişim | Igloo Construction', 'ar-DZ': 'اتصل بنا | إيغلو للإنشاءات' },
      content: {
        en: { eyebrow: 'Contact', heading: 'Start a project conversation.', lead: 'Speak directly with the Igloo team in Bir Khadem. Send the location, programme and available documents; we will route the request to the right person.' },
        fr: { eyebrow: 'Contact', heading: 'Parlons de votre projet.', lead: 'Échangez directement avec l’équipe Igloo à Bir Khadem. Envoyez le lieu, le programme et les documents disponibles ; nous transmettrons votre demande au bon interlocuteur.' },
        tr: { eyebrow: 'İletişim', heading: 'Projenizi birlikte konuşalım.', lead: 'Bir Khadem’deki Igloo ekibiyle doğrudan iletişime geçin. Konumu, proje kapsamını ve mevcut belgeleri paylaşın; talebinizi doğru kişiye yönlendirelim.' },
        'ar-DZ': { eyebrow: 'اتصل بنا', heading: 'لنبدأ الحديث عن مشروعكم.', lead: 'تواصلوا مباشرة مع فريق إيغلو في بئر خادم. أرسلوا الموقع والبرنامج والوثائق المتاحة، وسنوجّه الطلب إلى الشخص المناسب.' },
      },
    },
    'projects-index': {
      title: { en: 'Projects | Igloo Construction', fr: 'Projets | Igloo Construction', tr: 'Projeler | Igloo Construction', 'ar-DZ': 'المشاريع | إيغلو للإنشاءات' },
      content: {
        en: { eyebrow: 'Projects', heading: 'A portfolio built on delivery.', lead: 'Residential programmes, villas, commercial premises, roads and networks delivered across Algeria.' },
        fr: { eyebrow: 'Projets', heading: 'Un portefeuille fondé sur la réalisation.', lead: 'Programmes résidentiels, villas, locaux commerciaux, voiries et réseaux réalisés à travers l’Algérie.' },
        tr: { eyebrow: 'Projeler', heading: 'Teslimat deneyimiyle oluşan bir portföy.', lead: 'Cezayir genelinde tamamlanan konut, villa, ticari alan, yol ve altyapı projeleri.' },
        'ar-DZ': { eyebrow: 'المشاريع', heading: 'محفظة مشاريع تقوم على الإنجاز.', lead: 'برامج سكنية وفيلات ومحلات تجارية وطرق وشبكات أُنجزت في مختلف أنحاء الجزائر.' },
      },
    },
    'not-found': {
      title: { en: 'Page not found | Igloo Construction', fr: 'Page introuvable | Igloo Construction', tr: 'Sayfa bulunamadı | Igloo Construction', 'ar-DZ': 'الصفحة غير موجودة | إيغلو للإنشاءات' },
      content: {
        en: { heading: 'This page is not available.', cta: 'Return to home' },
        fr: { heading: 'Cette page n’est pas disponible.', cta: 'Retour à l’accueil' },
        tr: { heading: 'Bu sayfa bulunamadı.', cta: 'Ana sayfaya dön' },
        'ar-DZ': { heading: 'هذه الصفحة غير متاحة.', cta: 'العودة إلى الرئيسية' },
      },
    },
  };
  for (const [pageId, page] of Object.entries(pages)) {
    const source = page.content.en;
    const sourceRevision = revision(source);
    await writeJson(path.join(root, 'pages', pageId, 'page.json'), { schemaVersion: 1, pageId, path: pageId === 'projects-index' ? '/projects' : `/${pageId}`, sourceLocale: 'en', fields: strings(source) });
    for (const locale of CONTENT_LOCALES) {
      const content = page.content[locale];
      const title = page.title[locale];
      await writeJson(path.join(root, 'pages', pageId, `${locale}.json`), document(pageId, locale, content, { title, description: String(content.lead ?? content.heading), socialTitle: title, socialDescription: String(content.lead ?? content.heading) }, sourceRevision));
    }
  }

  for (const locale of CONTENT_LOCALES) await writeJson(path.join(root, 'shared', `${locale}.json`), { schemaVersion: 1, locale, sourceLocale: 'en', revision: revision(sharedCopy[locale]), sourceRevision: revision(sharedCopy.en), status: 'approved', content: sharedCopy[locale] });
}

async function buildReferenceFiles() {
  await writeJson(path.join(root, 'terminology', 'protected-terms.json'), {
    schemaVersion: 1,
    terms: [
      { source: 'LPA', protected: true, domain: 'housing', fr: 'LPA', tr: 'LPA', 'ar-DZ': 'LPA', notes: 'Keep the programme acronym.' },
      { source: 'LPL', protected: true, domain: 'housing', fr: 'LPL', tr: 'LPL', 'ar-DZ': 'LPL', notes: 'Keep the programme acronym.' },
      { source: 'LPP', protected: true, domain: 'housing', fr: 'LPP', tr: 'LPP', 'ar-DZ': 'LPP', notes: 'Keep the programme acronym.' },
      { source: 'VRD', protected: true, domain: 'construction', fr: 'VRD', tr: 'VRD', 'ar-DZ': 'VRD', notes: 'Voirie et réseaux divers; preserve acronym in project facts.' },
      { source: 'R+8', protected: true, domain: 'construction', fr: 'R+8', tr: 'R+8', 'ar-DZ': 'R+8' },
      { source: 'R+9', protected: true, domain: 'construction', fr: 'R+9', tr: 'R+9', 'ar-DZ': 'R+9' },
      { source: 'SARL Igloo Yapi Construction', protected: true, domain: 'company', fr: 'SARL Igloo Yapi Construction', tr: 'SARL Igloo Yapi Construction', 'ar-DZ': 'SARL Igloo Yapi Construction' },
    ],
  });
  const guides: Record<ContentLocale, string> = {
    en: '# English editorial guide\n\nUse precise, restrained construction language. Preserve project facts and avoid generic marketing claims.\n',
    fr: '# Guide éditorial français\n\nÉcrire comme une entreprise de construction active en Algérie : français naturel, précis et sobre. Respecter les espaces typographiques et les accents.\n',
    tr: '# Türkçe editoryal rehber\n\nDoğal, kurumsal ve teknik Türkçe kullanın. Kelime kelime çeviriden kaçının; proje gerçeklerini değiştirmeyin.\n',
    'ar-DZ': '# الدليل التحريري العربي\n\nاستخدموا عربية فصحى واضحة ومهنية، مع الحفاظ على أسماء المشاريع والأرقام والاختصارات التقنية.\n',
  };
  for (const [locale, guide] of Object.entries(guides)) await fs.mkdir(path.join(root, 'style-guides'), { recursive: true }).then(() => fs.writeFile(path.join(root, 'style-guides', `${locale}.md`), guide, 'utf8'));
}

await buildGeneralPages();
await buildProjectPages();
await buildReferenceFiles();
console.log(`Content migration complete: ${projects.length + 5} pages × ${CONTENT_LOCALES.length} locales`);
