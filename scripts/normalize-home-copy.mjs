import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { writeJsonAtomic } from './localization-content.mjs';

const root = new URL('../content/pages/home/', import.meta.url);
const set = (object, path, value) => {
  const parts = path.replaceAll(']', '').split(/[.[]/u).filter(Boolean);
  let cursor = object;
  for (const part of parts.slice(0, -1)) cursor = cursor[part];
  cursor[parts.at(-1)] = value;
};
const stable = (value) => Array.isArray(value)
  ? `[${value.map(stable).join(',')}]`
  : value && typeof value === 'object'
    ? `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`
    : JSON.stringify(value);
const fnvRevision = (value) => {
  const json = JSON.stringify(value);
  let hash = 2166136261;
  for (let index = 0; index < json.length; index += 1) {
    hash ^= json.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `v1-${(hash >>> 0).toString(16).padStart(8, '0')}`;
};
const targetRevision = (document) => `v1-${crypto.createHash('sha256').update(stable(document)).digest('hex').slice(0, 16)}`;

const common = {
  en: {
    'seo.title': 'SARL Igloo Yapi Construction — Building across Algeria',
    'seo.description': 'Category 6 certified contractor delivering residential, mixed-use and civil infrastructure projects across Algeria.',
    'seo.socialTitle': 'SARL Igloo Yapi Construction — Projects across Algeria',
    'seo.socialDescription': 'Residential, mixed-use and civil infrastructure projects delivered by a Category 6 certified contractor.',
    'content.hero.title': 'Building across Algeria',
    'content.hero.lead': 'Residential and mixed-use projects managed from engineering and site work through to handover.',
    'content.hero.primaryCta': 'View projects',
    'content.hero.secondaryCta': 'Contact the team',
    'content.hero.trustFacts[1].label': 'Projects',
    'content.hero.trustFacts[2].label': 'Housing units',
    'content.hero.trustFacts[3].label': 'Wilayas covered',
    'content.hero.trustFacts[4].label': 'Certified contractor',
    'content.manifesto.eyebrow': 'Construction with control',
    'content.manifesto.title': 'One coordinated team for complex construction',
    'content.manifesto.body': 'We coordinate housing, villas, commercial premises, all trades and civil infrastructure from preparation through delivery.',
    'content.manifesto.metrics[1].label': 'Projects',
    'content.manifesto.metrics[1].detail': 'Completed and active programmes',
    'content.manifesto.metrics[2].label': 'Housing units',
    'content.manifesto.metrics[2].detail': 'Residential and mixed-use programmes',
    'content.featuredProjects.lead': 'A portfolio of residential, mixed-use and civil works across Algeria.',
    'content.process.eyebrow': 'Project process',
    'content.process.title': 'From planning to handover',
    'content.process.lead': 'Each project moves through a clear sequence of planning, coordination, construction, checks and handover.',
    'content.process.steps[0].title': 'Pre-construction planning',
    'content.process.steps[0].body': 'We align quantities, requirements and site logistics before work starts on site.',
    'content.process.steps[1].title': 'Engineering and trade coordination',
    'content.process.steps[1].body': 'Engineers, architects and trade teams coordinate the technical work and interfaces.',
    'content.process.steps[2].title': 'On-site construction',
    'content.process.steps[2].body': 'Site managers organise daily work, sequencing, materials and progress on site.',
    'content.process.steps[3].title': 'Quality and programme checks',
    'content.process.steps[3].body': 'We check materials, safety, workmanship and progress against the project requirements.',
    'content.process.steps[4].title': 'Handover',
    'content.process.steps[4].body': 'We complete the records, close the remaining works and hand the project to the client.',
    'content.about.title': 'A technical team focused on site delivery',
    'content.about.proofs[0].title': 'Category 6 contractor',
    'content.about.proofs[0].body': 'Professional Qualification and Classification Certificate, Category 6.',
    'content.about.proofs[2].title': 'Residential and mixed-use work',
    'content.about.proofs[2].body': 'Housing, villas, commercial premises, roads and utility networks.',
    'content.footprint.title': 'Projects across northern Algeria',
    'content.footprint.lead': 'Eleven projects across four wilayas, from the Algiers area to Tipaza, Mostaganem and Boumerdes.',
    'content.footprint.stats[0].label': 'Projects',
    'content.footprint.stats[1].label': 'Wilayas',
    'content.footprint.stats[2].label': 'Coastal area',
    'content.footer.title': 'Discuss your next project',
    'content.footer.lead': 'Speak with our Algiers-based engineering and site teams about residential, mixed-use or infrastructure work.'
  },
  fr: {
    'seo.title': 'SARL Igloo Yapi Construction — Construire en Algérie',
    'seo.description': 'Entreprise qualifiée en catégorie 6, spécialisée dans les projets résidentiels, mixtes et d’infrastructures civiles en Algérie.',
    'seo.socialTitle': 'SARL Igloo Yapi Construction — Projets en Algérie',
    'seo.socialDescription': 'Des projets résidentiels, mixtes et d’infrastructures civiles réalisés par une entreprise qualifiée en catégorie 6.',
    'content.hero.title': 'Construire en Algérie',
    'content.hero.lead': 'Des projets résidentiels et mixtes suivis de l’ingénierie au chantier, jusqu’à la réception.',
    'content.hero.primaryCta': 'Voir les projets',
    'content.hero.secondaryCta': 'Contacter l’équipe',
    'content.hero.trustFacts[1].label': 'Projets',
    'content.hero.trustFacts[2].label': 'Logements',
    'content.hero.trustFacts[3].label': 'Wilayas couvertes',
    'content.hero.trustFacts[4].label': 'Entreprise qualifiée',
    'content.manifesto.eyebrow': 'Une construction maîtrisée',
    'content.manifesto.title': 'Une équipe coordonnée pour les projets complexes',
    'content.manifesto.body': 'Nous coordonnons logements, villas, locaux commerciaux, tous corps d’état et infrastructures civiles, de la préparation à la livraison.',
    'content.manifesto.metrics[1].label': 'Projets',
    'content.manifesto.metrics[1].detail': 'Programmes achevés et en cours',
    'content.manifesto.metrics[2].label': 'Logements',
    'content.manifesto.metrics[2].detail': 'Programmes résidentiels et mixtes',
    'content.featuredProjects.lead': 'Un portfolio de projets résidentiels, mixtes et d’infrastructures civiles en Algérie.',
    'content.process.eyebrow': 'Le déroulement d’un projet',
    'content.process.title': 'De la préparation à la réception',
    'content.process.lead': 'Chaque projet suit une séquence claire : préparation, coordination, travaux, contrôles et réception.',
    'content.process.steps[0].title': 'Préparation du chantier',
    'content.process.steps[0].body': 'Nous alignons les métrés, les exigences et la logistique avant le démarrage des travaux.',
    'content.process.steps[1].title': 'Ingénierie et coordination des lots',
    'content.process.steps[1].body': 'Ingénieurs, architectes et équipes de chantier coordonnent les études et les interfaces entre les lots.',
    'content.process.steps[2].title': 'Réalisation sur site',
    'content.process.steps[2].body': 'Les responsables de chantier organisent les travaux, les séquences, les matériaux et l’avancement quotidien.',
    'content.process.steps[3].title': 'Contrôle qualité et planning',
    'content.process.steps[3].body': 'Nous vérifions les matériaux, la sécurité, la qualité d’exécution et l’avancement du projet.',
    'content.process.steps[4].title': 'Réception',
    'content.process.steps[4].body': 'Nous finalisons les documents, levons les réserves et remettons l’ouvrage au client.',
    'content.about.title': 'Une équipe technique mobilisée sur le chantier',
    'content.about.proofs[0].title': 'Entreprise qualifiée en catégorie 6',
    'content.about.proofs[0].body': 'Certificat de Qualification et de Classification Professionnelle, catégorie 6.',
    'content.about.proofs[2].title': 'Projets résidentiels et mixtes',
    'content.about.proofs[2].body': 'Logements, villas, locaux commerciaux, voiries et réseaux.',
    'content.footprint.title': 'Des projets dans le nord de l’Algérie',
    'content.footprint.lead': 'Onze projets répartis sur quatre wilayas, d’Alger à Tipaza, Mostaganem et Boumerdès.',
    'content.footprint.stats[0].label': 'Projets',
    'content.footprint.stats[1].label': 'Wilayas',
    'content.footprint.stats[2].label': 'Zone côtière',
    'content.footer.title': 'Parlons de votre prochain projet',
    'content.footer.lead': 'Échangez avec nos équipes d’ingénierie et de chantier basées à Alger au sujet de vos projets résidentiels, mixtes ou d’infrastructure.'
  },
  tr: {
    'seo.title': 'SARL Igloo Yapi Construction — Cezayir’de Yapı Projeleri',
    'seo.description': 'Cezayir genelinde konut, karma kullanım ve altyapı projeleri gerçekleştiren Kategori 6 sertifikalı yüklenici.',
    'seo.socialTitle': 'SARL Igloo Yapi Construction — Cezayir’de Projeler',
    'seo.socialDescription': 'Konut, karma kullanım ve altyapı projeleri gerçekleştiren Kategori 6 sertifikalı yüklenici.',
    'content.hero.title': 'Cezayir genelinde yapı projeleri',
    'content.hero.lead': 'Konut ve karma kullanım projelerini mühendislikten şantiye çalışmalarına ve teslime kadar yönetiyoruz.',
    'content.hero.primaryCta': 'Projeleri incele',
    'content.hero.secondaryCta': 'Ekiple iletişime geç',
    'content.hero.trustFacts[1].label': 'Proje',
    'content.hero.trustFacts[2].label': 'Konut birimi',
    'content.hero.trustFacts[3].label': 'Çalışılan vilayet',
    'content.hero.trustFacts[4].label': 'Sertifikalı yüklenici',
    'content.manifesto.eyebrow': 'Kontrollü yapım süreci',
    'content.manifesto.title': 'Karmaşık projeleri tek ekip olarak yönetiyoruz',
    'content.manifesto.body': 'Konut, villa, ticari alan, tüm yapım işleri ve altyapı ağlarını hazırlıktan teslime kadar koordine ediyoruz.',
    'content.manifesto.metrics[1].label': 'Proje',
    'content.manifesto.metrics[1].detail': 'Tamamlanan ve devam eden işler',
    'content.manifesto.metrics[2].label': 'Konut birimi',
    'content.manifesto.metrics[2].detail': 'Konut ve karma kullanım projeleri',
    'content.featuredProjects.lead': 'Cezayir genelinde konut, karma kullanım ve altyapı projelerinden oluşan portföyümüz.',
    'content.process.eyebrow': 'Proje süreci',
    'content.process.title': 'Hazırlıktan teslime kadar',
    'content.process.lead': 'Her proje; hazırlık, koordinasyon, yapım, kontroller ve teslim adımlarından oluşan net bir süreçle ilerler.',
    'content.process.steps[0].title': 'Yapım öncesi hazırlık',
    'content.process.steps[0].body': 'İşe başlamadan önce metrajları, teknik gereklilikleri ve saha lojistiğini netleştiriyoruz.',
    'content.process.steps[1].title': 'Mühendislik ve ekip koordinasyonu',
    'content.process.steps[1].body': 'Mühendisler, mimarlar ve saha ekipleri teknik çalışmaları ve iş kalemleri arasındaki bağlantıları koordine eder.',
    'content.process.steps[2].title': 'Şantiye uygulaması',
    'content.process.steps[2].body': 'Şantiye yöneticileri günlük işleri, iş sırasını, malzeme akışını ve ilerlemeyi yönetir.',
    'content.process.steps[3].title': 'Kalite ve iş programı kontrolü',
    'content.process.steps[3].body': 'Malzeme, iş güvenliği, uygulama kalitesi ve ilerlemeyi proje gerekliliklerine göre kontrol ederiz.',
    'content.process.steps[4].title': 'Teslim',
    'content.process.steps[4].body': 'Belgeleri tamamlar, kalan işleri kapatır ve projeyi işverene teslim ederiz.',
    'content.about.title': 'Projeyi sahada yöneten teknik ekip',
    'content.about.paragraphs[0]': '2018 yılında kurulan ve inşaat mühendisi Adem Talay tarafından yönetilen SARL Igloo Yapi Construction, Cezayir’in Bir Khadem bölgesinden konut ve karma kullanım projeleri yürütmektedir.',
    'content.about.proofs[0].title': 'Kategori 6 yüklenicisi',
    'content.about.proofs[0].body': 'Mesleki Yeterlilik ve Sınıflandırma Belgesi, Kategori 6.',
    'content.about.proofs[2].title': 'Konut ve karma kullanım projeleri',
    'content.about.proofs[2].body': 'Konut blokları, villalar, ticari alanlar, yollar ve altyapı ağları.',
    'content.footprint.title': 'Kuzey Cezayir’de projeler',
    'content.footprint.lead': 'Cezayir, Tipaza, Mostaganem ve Boumerdes olmak üzere dört vilayete yayılan 11 proje.',
    'content.footprint.stats[0].label': 'Proje',
    'content.footprint.stats[1].label': 'Vilayet',
    'content.footprint.stats[2].label': 'Kıyı bölgesi',
    'content.footer.title': 'Bir sonraki projenizi görüşelim',
    'content.footer.lead': 'Konut, karma kullanım veya altyapı projeleriniz için Cezayir merkezli mühendislik ve saha ekiplerimizle görüşün.'
  },
  'ar-DZ': {
    'seo.title': 'SARL Igloo Yapi Construction — مشاريع البناء في الجزائر',
    'seo.description': 'مقاول مؤهل في الفئة 6 ينجز مشاريع سكنية ومختلطة وأشغال البنية التحتية المدنية في الجزائر.',
    'seo.socialTitle': 'SARL Igloo Yapi Construction — مشاريع في الجزائر',
    'seo.socialDescription': 'مشاريع سكنية ومختلطة وأشغال بنية تحتية تنجزها مؤسسة مؤهلة في الفئة 6.',
    'content.hero.title': 'مشاريع بناء في مختلف أنحاء الجزائر',
    'content.hero.lead': 'ندير المشاريع السكنية والمختلطة من مرحلة الهندسة وأشغال الورشة حتى التسليم.',
    'content.hero.primaryCta': 'استعرض المشاريع',
    'content.hero.secondaryCta': 'تواصل مع الفريق',
    'content.hero.trustFacts[1].label': 'مشروعاً',
    'content.hero.trustFacts[2].label': 'وحدة سكنية',
    'content.hero.trustFacts[3].label': 'ولايات',
    'content.hero.trustFacts[4].label': 'مقاول مؤهل',
    'content.manifesto.eyebrow': 'تنفيذ منضبط',
    'content.manifesto.title': 'فريق واحد لتنسيق المشاريع المعقدة',
    'content.manifesto.body': 'ننسق السكنات والفيلات والمحال التجارية وكافة الأشغال وشبكات البنية التحتية من التحضير إلى التسليم.',
    'content.manifesto.metrics[1].label': 'مشروعاً',
    'content.manifesto.metrics[1].detail': 'مشاريع منجزة وأخرى قيد التنفيذ',
    'content.manifesto.metrics[2].label': 'وحدة سكنية',
    'content.manifesto.metrics[2].detail': 'برامج سكنية ومختلطة',
    'content.featuredProjects.lead': 'سجل مشاريع سكنية ومختلطة وأشغال بنية تحتية في مختلف أنحاء الجزائر.',
    'content.process.eyebrow': 'مراحل المشروع',
    'content.process.title': 'من التحضير إلى التسليم',
    'content.process.lead': 'يمر كل مشروع بمراحل واضحة تشمل التحضير والتنسيق والتنفيذ والمراقبة والتسليم.',
    'content.process.steps[0].title': 'التحضير قبل الأشغال',
    'content.process.steps[0].body': 'نحدد الكميات والمتطلبات التقنية ولوجستيات الموقع قبل انطلاق الأشغال.',
    'content.process.steps[1].title': 'تنسيق الهندسة والأشغال',
    'content.process.steps[1].body': 'ينسق المهندسون والمعماريون وفرق الورشة الأعمال التقنية والروابط بين مختلف الأشغال.',
    'content.process.steps[2].title': 'التنفيذ في الورشة',
    'content.process.steps[2].body': 'ينظم مسؤولو الورشة الأعمال اليومية وتسلسلها وتدفق المواد ونسبة التقدم.',
    'content.process.steps[3].title': 'مراقبة الجودة والبرنامج',
    'content.process.steps[3].body': 'نراقب المواد والسلامة وجودة التنفيذ والتقدم وفق متطلبات المشروع.',
    'content.process.steps[4].title': 'التسليم',
    'content.process.steps[4].body': 'نستكمل الوثائق ونغلق الأشغال المتبقية ونسلم المشروع إلى صاحب العمل.',
    'content.about.title': 'فريق تقني يقود التنفيذ في الورشة',
    'content.about.paragraphs[0]': 'تأسست شركة SARL Igloo Yapi Construction عام 2018 ويقودها المهندس المدني Adem Talay، وتنشط من بئر خادم بالجزائر العاصمة في تنفيذ مشاريع سكنية ومختلطة عبر الجزائر.',
    'content.about.proofs[0].title': 'مقاول مؤهل في الفئة 6',
    'content.about.proofs[0].body': 'شهادة التأهيل والتصنيف المهني، الفئة 6.',
    'content.about.proofs[2].title': 'مشاريع سكنية ومختلطة',
    'content.about.proofs[2].body': 'مجمعات سكنية وفيلات ومحال تجارية وطرق وشبكات.',
    'content.footprint.title': 'مشاريع في شمال الجزائر',
    'content.footprint.lead': 'أحد عشر مشروعاً موزعة على أربع ولايات: الجزائر العاصمة وتيبازة ومستغانم وبومرداس.',
    'content.footprint.stats[0].label': 'مشروعاً',
    'content.footprint.stats[1].label': 'ولايات',
    'content.footprint.stats[2].label': 'منطقة ساحلية',
    'content.footer.title': 'ناقش مشروعك القادم معنا',
    'content.footer.lead': 'تواصل مع فرق الهندسة والورشة في الجزائر العاصمة بشأن مشاريعك السكنية أو المختلطة أو مشاريع البنية التحتية.'
  }
};

const documents = {};
for (const locale of Object.keys(common)) {
  const file = new URL(`${locale}.json`, root);
  const document = JSON.parse(await fs.readFile(file, 'utf8'));
  for (const [path, value] of Object.entries(common[locale])) set(document, path, value);
  documents[locale] = document;
}
const sourceRevision = fnvRevision(documents.en.content);
documents.en.sourceRevision = sourceRevision;
documents.en.revision = fnvRevision({ pageId: documents.en.pageId, locale: 'en', content: documents.en.content, seo: documents.en.seo });
for (const locale of ['fr', 'tr', 'ar-DZ']) {
  documents[locale].sourceRevision = sourceRevision;
  const copy = { ...documents[locale] };
  delete copy.revision;
  delete copy.status;
  delete copy.updatedAt;
  documents[locale].revision = targetRevision(copy);
}
for (const [locale, document] of Object.entries(documents)) {
  document.status = 'approved';
  document.updatedAt = new Date().toISOString();
  await writeJsonAtomic(fileURLToPath(new URL(`${locale}.json`, root)), document);
}
console.log(JSON.stringify({ sourceRevision, locales: Object.keys(documents) }));
