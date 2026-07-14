import { pickLocaleText, type Locale } from '../i18n/runtime';
import { getPageContent } from '../content';

/**
 * Localized homepage/about/contact copy. English and French are always
 * authored; Algerian Arabic (dz) and Turkish (tr) are optional and fall
 * back to English when absent (see `homepageText()` helper).
 */
export type HomepageText = { en: string; fr: string; dz?: string; tr?: string };

/** Resolve a HomepageText value for the active locale, falling back to English. */
export function homepageText(value: HomepageText, locale: Locale): string {
  return pickLocaleText(locale, value);
}

export type HomepageMetric = {
  value: string;
  label: HomepageText;
  detail?: HomepageText;
};

export type HomepageProcessStep = {
  id: 'coordination' | 'engineering' | 'site' | 'monitoring' | 'handover';
  title: HomepageText;
  body: HomepageText;
};

export type HomepageProof = {
  title: HomepageText;
  body: HomepageText;
};

const legacyHomepageContent = {
  hero: {
    eyebrow: {
      en: 'SARL Igloo Yapi Construction',
      fr: 'SARL Igloo Yapi Construction',
      dz: 'SARL Igloo Yapi Construction',
      tr: 'SARL Igloo Yapı Construction',
    },
    title: {
      en: 'Building for Algeria. Built to last.',
      fr: "Construire pour l'Algérie. Bâtir pour durer.",
      dz: 'نبنيو للجزائر. بناء يدوم.',
      tr: 'Cezayir için inşa ediyoruz. Sağlam ve uzun ömürlü.',
    },
    lead: {
      en: 'Residential and mixed-use programmes delivered with engineering control, site discipline and long-term construction quality across Algeria.',
      fr: "Partout en Algérie, nous réalisons des programmes résidentiels et mixtes avec une maîtrise rigoureuse des études, du chantier et de la qualité d'exécution.",
      dz: 'برامج سكنية ومختلطة نسلّموها بمراقبة هندسية، انضباط في الورشة وجودة بناء تدوم عبر كامل الجزائر.',
      tr: "Cezayir'in farklı bölgelerinde, mühendislik disiplini, şantiye kontrolü ve uzun ömürlü kalite anlayışıyla konut ve karma kullanım projeleri inşa ediyoruz.",
    },
    primaryCta: {
      en: 'Explore projects',
      fr: 'Découvrir nos projets',
      dz: 'شوف المشاريع',
      tr: 'Projeleri İnceleyin',
    },
    secondaryCta: {
      en: 'Contact team',
      fr: 'Contacter notre équipe',
      dz: 'تواصل مع الفريق',
      tr: 'Bize Ulaşın',
    },
    trustFacts: [
      { value: 'Est. 2018', label: { en: 'Algiers-based', fr: 'Implantée à Alger', dz: 'مقرها الجزائر العاصمة', tr: 'Cezayir merkezli' } },
      { value: '11', label: { en: 'projects', fr: 'projets', dz: 'مشاريع', tr: 'proje' } },
      { value: '2,500+', label: { en: 'housing units', fr: 'logements', dz: 'وحدة سكنية', tr: 'konut' } },
      { value: '4', label: { en: 'wilayas covered', fr: 'wilayas couvertes', dz: 'ولايات مغطّاة', tr: 'vilayet' } },
      { value: 'Category 6', label: { en: 'certified contractor', fr: 'Entreprise qualifiée', dz: 'مقاول مصنّف', tr: 'sertifikalı yüklenici' } },
    ] satisfies HomepageMetric[],
  },
  manifesto: {
    eyebrow: {
      en: 'Construction with proof',
      fr: 'Le savoir-faire en actes',
      dz: 'بناء بالدليل',
      tr: 'İşimiz, kanıtımız.',
    },
    title: {
      en: 'We build the framework for durable everyday life.',
      fr: 'Nous bâtissons des lieux de vie pensés pour durer.',
      dz: 'نبنيو الإطار تاع حياة يومية تدوم.',
      tr: 'Uzun ömürlü bir yaşamın temellerini atıyoruz.',
    },
    body: {
      en: 'From housing blocks and villas to commercial premises, roads and networks, Igloo coordinates the trades that turn a programme into a place that works.',
      fr: "Immeubles résidentiels, villas, locaux commerciaux, voiries et réseaux : Igloo coordonne l'ensemble des corps de métier pour livrer des projets cohérents, fonctionnels et durables.",
      dz: 'من العمارات السكنية والفيلات للمحلات التجارية، الطرقات والشبكات، Igloo تنسّق بين الحرفيين باش تحوّل البرنامج لمكان يخدم بصحّ.',
      tr: 'Konut bloklarından villalara, ticari birimlerden yol ve altyapı işlerine kadar Igloo, bir projeyi sahada işler hale getiren tüm disiplinleri aynı yapım düzeni içinde koordine eder.',
    },
    credential: {
      en: 'Professional Qualification and Classification Certificate, Category 6',
      fr: 'Certificat de qualification et de classification professionnelles – Catégorie 6',
      dz: 'شهادة التأهيل والتصنيف المهني، الفئة 6',
      tr: 'Mesleki Yeterlilik ve Sınıflandırma Belgesi, Kategori 6',
    },
    metrics: [
      {
        value: '2018',
        label: { en: 'founded in Algiers', fr: 'Fondée à Alger', dz: 'تأسّست في الجزائر العاصمة', tr: 'Kuruluş: Cezayir' },
        detail: { en: 'Bir Khadem operational base', fr: 'Base opérationnelle à Bir Khadem', dz: 'قاعدة العمل في بئر خادم', tr: 'Bir Khadem Merkez Ofis' },
      },
      {
        value: '11',
        label: { en: 'portfolio projects', fr: 'Projets réalisés ou en cours', dz: 'مشاريع في المحفظة', tr: 'Proje' },
        detail: { en: 'completed and current programmes', fr: 'Programmes livrés et en cours', dz: 'برامج مسلّمة وأخرى قيد الإنجاز', tr: 'Tamamlanan ve Devam Eden Projeler' },
      },
      {
        value: '2,500+',
        label: { en: 'housing units connected to programmes', fr: 'Logements réalisés ou en cours', dz: 'وحدة سكنية مرتبطة بالبرامج', tr: 'Konut' },
        detail: { en: 'residential and mixed-use scope', fr: 'Programmes résidentiels et mixtes', dz: 'نطاق سكني ومختلط', tr: 'Konut ve Karma Kullanım Projeleri' },
      },
      {
        value: '4',
        label: { en: 'wilayas represented', fr: 'Wilayas couvertes', dz: 'ولايات ممثّلة', tr: 'Vilayet' },
        detail: { en: 'Tipaza, Algiers, Mostaganem, Boumerdes', fr: 'Tipaza, Alger, Mostaganem, Boumerdès', dz: 'تيبازة، الجزائر العاصمة، مستغانم، بومرداس', tr: 'Tipaza, Cezayir, Mostaganem, Bumerdes' },
      },
    ] satisfies HomepageMetric[],
  },
  featuredProjects: {
    eyebrow: {
      en: 'Selected work',
      fr: 'Projets sélectionnés',
      dz: 'أعمال مختارة',
      tr: 'Örnek Projeler',
    },
    title: {
      en: 'Built evidence, not promises.',
      fr: 'Des réalisations concrètes, pas de simples promesses.',
      dz: 'دليل مبني، ماشي وعود.',
      tr: 'Söz değil, tamamlanmış işler.',
    },
    lead: {
      en: 'A portfolio of housing, villas, commercial premises, roads and networks, shown through real project scope and location proof.',
      fr: 'Explorez notre portfolio : logements, villas, locaux commerciaux, voiries et réseaux. Chaque projet est présenté avec son envergure et sa localisation réelles.',
      dz: 'محفظة تحتوي سكنات، فيلات، محلات تجارية، طرقات وشبكات، معروضة بنطاق حقيقي ودليل الموقع.',
      tr: 'Gerçek proje verileri ve konum bilgileriyle desteklenen konut, villa, ticari yapı, yol ve altyapı projelerimiz.',
    },
  },
  process: {
    eyebrow: {
      en: 'Delivery discipline',
      fr: "Maîtrise de l'exécution",
      dz: 'انضباط التسليم',
      tr: 'Planlı ve Kontrollü Yapım',
    },
    title: {
      en: 'From first coordination to handover.',
      fr: 'Des premières études à la réception des travaux',
      dz: 'من أول تنسيق حتى التسليم.',
      tr: 'Planlamadan anahtar teslime.',
    },
    lead: {
      en: 'A clear technical structure keeps each programme moving through planning, engineering control, site execution and final delivery.',
      fr: "Une organisation technique claire accompagne chaque opération, des études et de la coordination jusqu'à l'exécution, au contrôle et à la livraison.",
      dz: 'هيكلة تقنية واضحة تخلّي كل برنامج يتقدّم من التخطيط، المراقبة الهندسية، تنفيذ الورشة حتى التسليم النهائي.',
      tr: 'Her projeyi; planlama, mühendislik denetimi, şantiye uygulamaları ve tamamlama süreçlerini içeren net bir teknik yapıyla yönetiriz.',
    },
    steps: [
      {
        id: 'coordination',
        title: {
          en: 'Pre-construction coordination',
          fr: 'Coordination avant travaux',
          dz: 'التنسيق قبل الانطلاق',
          tr: 'İnşaat Öncesi Planlama',
        },
        body: {
          en: 'Scope, programme requirements, quantities and site constraints are aligned before work moves on site.',
          fr: 'La portée, les exigences du programme, les quantités et les contraintes du site sont alignées avant l’intervention.',
          dz: 'النطاق، متطلبات البرنامج، الكميات وقيود الورشة يتنسّقوا قبل ما تبدا الأشغال.',
          tr: 'Saha çalışmalarına başlamadan önce işin kapsamını, proje gereksinimlerini, metrajları ve şantiye koşullarını netleştiririz.',
        },
      },
      {
        id: 'engineering',
        title: {
          en: 'Engineering & TCE control',
          fr: 'Ingénierie & contrôle TCE',
          dz: 'الهندسة ومراقبة الأشغال الثانوية',
          tr: 'Mühendislik ve Tüm Disiplinlerin Kontrolü',
        },
        body: {
          en: 'Engineers, architects and technical managers coordinate secondary trades, structures, MEP, roads and networks.',
          fr: 'Ingénieurs, architectes et responsables techniques coordonnent les corps d’état, structures, MEP, voiries et réseaux.',
          dz: 'المهندسين، المعماريين والمسؤولين التقنيين ينسّقوا بين الحرف الثانوية، الهياكل، الشبكات، الطرقات.',
          tr: 'Mühendis, mimar ve teknik yöneticilerimiz; taşıyıcı sistem, tesisat (MEP), yollar, altyapı ve diğer tüm imalatların uyum içinde ilerlemesini sağlar.',
        },
      },
      {
        id: 'site',
        title: {
          en: 'Site execution',
          fr: 'Exécution de chantier',
          dz: 'تنفيذ الورشة',
          tr: 'Şantiye Uygulamaları',
        },
        body: {
          en: 'Construction managers and site teams organise daily progress, trade sequencing and material movement.',
          fr: 'Les conducteurs de travaux et équipes de chantier organisent l’avancement, les enchaînements et les approvisionnements.',
          dz: 'مسؤولي الورشة والفرق ينظّموا التقدّم اليومي، ترتيب الحرف وحركة المواد.',
          tr: 'Şantiye yöneticileri ve saha ekiplerimiz, günlük ilerlemeyi, imalatların sıralamasını ve malzeme akışını organize eder.',
        },
      },
      {
        id: 'monitoring',
        title: {
          en: 'Quality, safety & schedule monitoring',
          fr: 'Qualité, sécurité & planning',
          dz: 'مراقبة الجودة، السلامة والجدول الزمني',
          tr: 'Kalite, İş Güvenliği ve İş Programı Kontrolü',
        },
        body: {
          en: 'Delivery is tracked against technical requirements, safety rules, finish quality and contractual milestones.',
          fr: 'La livraison est suivie selon les exigences techniques, les règles de sécurité, la qualité de finition et les jalons contractuels.',
          dz: 'التسليم يتراقب حسب المتطلبات التقنية، قواعد السلامة، جودة التشطيب والمحطات التعاقدية.',
          tr: 'İmalatların ilerleyişini; teknik şartnamelere, güvenlik kurallarına, işçilik kalitesine ve sözleşmedeki terminlere göre denetleriz.',
        },
      },
      {
        id: 'handover',
        title: {
          en: 'Handover & aftercare',
          fr: 'Réception et suivi',
          dz: 'التسليم والمتابعة',
          tr: 'Teslim ve Garanti Süreci',
        },
        body: {
          en: 'Final works are closed with practical readiness, documentation and attention to the long-term use of each place.',
          fr: "La réception des travaux finaux s'accompagne d'une préparation opérationnelle, d'une documentation complète et d'une attention particulière à la pérennité de chaque lieu.",
          dz: 'الأشغال الأخيرة تتقفل بجاهزية عملية، توثيق واهتمام بالاستعمال طويل المدى تاع كل مكان.',
          tr: 'Projelerimizi, yapıları kullanıma hazır hale getirerek, tüm belgeleri tamamlayarak ve her mekanın uzun ömürlü kullanımını gözeterek teslim ederiz.',
        },
      },
    ] satisfies HomepageProcessStep[],
  },
  about: {
    eyebrow: {
      en: 'Company profile',
      fr: "Présentation de l'entreprise",
      dz: 'ملف الشركة',
      tr: 'Şirket Profili',
    },
    title: {
      en: 'Built with expertise. Delivered with control.',
      fr: 'Réalisé avec expertise. Livré avec maîtrise.',
      dz: 'مبني بالخبرة. مسلّم بمراقبة.',
      tr: 'Uzmanlıkla inşa ederiz. Süreci kontrolle yönetiriz.',
    },
    credential: {
      en: 'Professional Qualification & Classification Certificate - Category 6',
      fr: 'Certificat de qualification et de classification professionnelles – Catégorie 6',
      dz: 'شهادة التأهيل والتصنيف المهني - الفئة 6',
      tr: 'Mesleki Yeterlilik ve Sınıflandırma Belgesi - Kategori 6',
    },
    paragraphs: [
      {
        en: 'Founded in 2018 and managed by civil engineer Adem Talay, SARL Igloo Yapi Construction works from Bir Khadem, Algiers, on residential and mixed-use programmes across Algeria.',
        fr: 'Fondée en 2018 et dirigée par l’ingénieur en génie civil Adem Talay, SARL Igloo Yapi Construction intervient depuis Bir Khadem, Alger, sur des programmes résidentiels et mixtes en Algérie.',
        dz: 'تأسّست سنة 2018 ويسيّرها المهندس المدني آدم طالاي، SARL Igloo Yapi Construction تخدم من بئر خادم، الجزائر العاصمة، على برامج سكنية ومختلطة عبر كامل الجزائر.',
        tr: "SARL Igloo Yapi Construction, 2018 yılında inşaat mühendisi Adem Talay tarafından kurulmuştur. Şirket, Cezayir'in Bir Khadem kentindeki merkezinden, ülke genelinde konut ve karma kullanım projeleri yürütmektedir.",
      },
      {
        en: 'The company holds a Professional Qualification and Classification Certificate, Category 6, and operates with a qualified building manager, engineers, architects, construction managers and site staff.',
        fr: 'L’entreprise détient un Certificat de qualification et de classification professionnelles, Catégorie 6, et s’appuie sur un responsable bâtiment, des ingénieurs, architectes, conducteurs de travaux et équipes de chantier.',
        dz: 'الشركة عندها شهادة التأهيل والتصنيف المهني، الفئة 6، وتخدم بمسؤول بناية مؤهّل، مهندسين، معماريين، مسؤولي ورشة وفرق ميدانية.',
        tr: 'Şirketimiz, Kategori 6 Mesleki Yeterlilik ve Sınıflandırma Belgesine sahiptir. Bünyesinde yetkin bir teknik müdür, mühendisler, mimarlar, şantiye yöneticileri ve saha personeli görev yapmaktadır.',
      },
    ] satisfies HomepageText[],
    metrics: [
      {
        value: '2018',
        label: { en: 'Established', fr: 'Établie', dz: 'تأسّست', tr: 'Kuruluş' },
      },
      {
        value: '11',
        label: { en: 'Projects delivered and underway', fr: 'Projets livrés et en cours', dz: 'مشاريع مسلّمة وقيد الإنجاز', tr: 'Tamamlanan ve Devam Eden Projeler' },
      },
      {
        value: '2,500+',
        label: { en: 'Homes delivered or underway', fr: 'Logements livrés ou en cours', dz: 'سكنات مسلّمة أو قيد الإنجاز', tr: 'Tamamlanan ve İnşa Halindeki Konutlar' },
      },
    ] satisfies HomepageMetric[],
    proofs: [
      {
        title: { en: 'Category 6 Contractor', fr: 'Entrepreneur Catégorie 6', dz: 'مقاول الفئة 6', tr: 'Kategori 6 Yüklenici' },
        body: {
          en: 'Professional Qualification and Classification Certificate, Category 6.',
          fr: 'Certificat de qualification et de classification professionnelles, Catégorie 6.',
          dz: 'شهادة التأهيل والتصنيف المهني، الفئة 6.',
          tr: 'Mesleki Yeterlilik ve Sınıflandırma Belgesi, Kategori 6.',
        },
      },
      {
        title: { en: 'Multidisciplinary Team', fr: 'Équipe pluridisciplinaire', dz: 'فريق متعدد الاختصاصات', tr: 'Çok Yönlü Ekip' },
        body: {
          en: 'Building manager, three engineers, two architects, construction managers, HR, accountant, buyer and site teams.',
          fr: 'Responsable de la construction, trois ingénieurs, deux architectes, conducteurs de travaux, RH, comptable, acheteur et équipes de chantier.',
          dz: 'مسؤول بناية، ثلاثة مهندسين، معماريّين، مسؤولي ورشة، موارد بشرية، محاسب، مشتري وفرق ميدانية.',
          tr: 'Proje yöneticisi, üç mühendis, iki mimar, şantiye şefleri, İK, muhasebe, satın alma ve saha ekipleri.',
        },
      },
      {
        title: { en: 'Residential & Mixed-use Expertise', fr: 'Expertise résidentielle et mixte', dz: 'خبرة سكنية ومختلطة', tr: 'Konut ve Karma Kullanım Uzmanlığı' },
        body: {
          en: 'Housing, villas, commercial premises, roads, networks, services and exterior works.',
          fr: 'Logements, villas, locaux commerciaux, voiries, réseaux, services et aménagements extérieurs.',
          dz: 'سكنات، فيلات، محلات تجارية، طرقات، شبكات، خدمات وتهيئة خارجية.',
          tr: 'Konutlar, villalar, ticari mekanlar, yollar, altyapı ağları ve çevre düzenleme işleri.',
        },
      },
    ] satisfies HomepageProof[],
  },
  footprint: {
    eyebrow: {
      en: 'Project footprint',
      fr: 'Empreinte du projet',
      dz: 'انتشار المشاريع',
      tr: 'Faaliyet Coğrafyamız',
    },
    title: {
      en: 'Algeria & Beyond',
      fr: 'Algérie et au-delà',
      dz: 'الجزائر وأبعد',
      tr: 'Cezayir ve Çevresi',
    },
    lead: {
      en: 'Eleven project locations across four highlighted wilayas, with a dense Algiers delivery belt and active reach toward Mostaganem and Boumerdes.',
      fr: 'Onze implantations de projets dans quatre wilayas mises en évidence, avec une forte concentration autour d’Alger et une présence vers Mostaganem et Boumerdès.',
      dz: 'حداش موقع مشروع عبر أربع ولايات، بتركيز كبير حول الجزائر العاصمة وحضور فعّال نحو مستغانم وبومرداس.',
      tr: "Cezayir'in öne çıkan dört vilayetinde, on bir farklı lokasyonda projelerimiz bulunuyor. Başta Cezayir şehri çevresinde yoğunlaşan faaliyetlerimiz, Mostaganem ve Bumerdes yönünde genişleyerek devam ediyor.",
    },
    selectedLabel: {
      en: 'Selected project',
      fr: 'Projet sélectionné',
      dz: 'المشروع المختار',
      tr: 'Seçili proje',
    },
    openProject: {
      en: 'Open project',
      fr: 'Voir le projet',
      dz: 'افتح المشروع',
      tr: 'Projeyi Görüntüle',
    },
    statusCompleted: {
      en: 'Completed',
      fr: 'Livré',
      dz: 'مسلّم',
      tr: 'Tamamlandı',
    },
    statusInProgress: {
      en: 'In progress',
      fr: 'En cours',
      dz: 'قيد الإنجاز',
      tr: 'Devam ediyor',
    },
    stats: [
      { value: '11', label: { en: 'project pins', fr: 'Marqueurs de projet', dz: 'مواقع مشاريع', tr: 'Proje Konumu' } },
      { value: '4', label: { en: 'highlighted wilayas', fr: 'Wilayas phares', dz: 'ولايات بارزة', tr: 'Öne Çıkan Vilayetler' } },
      { value: '1', label: { en: 'north-coast delivery belt', fr: 'Axe de livraison nord', dz: 'حزام التسليم الشمالي', tr: 'Kuzey Sahili Proje Bölgesi' } },
    ] satisfies HomepageMetric[],
  },
  footer: {
    eyebrow: {
      en: 'Project discussion',
      fr: 'Parlons projet',
      dz: 'نقاش مشروع',
      tr: 'Proje Görüşmesi',
    },
    title: {
      en: 'Let’s discuss the next durable programme.',
      fr: 'Parlons du prochain programme durable.',
      dz: 'خلينا نحكيو على البرنامج الجاي اللي يدوم.',
      tr: 'Bir sonraki projeniz için görüşelim.',
    },
    lead: {
      en: 'Speak with an Algiers-based team experienced in residential, mixed-use, roads, networks and coordinated site delivery.',
      fr: 'Échangez avec une équipe basée à Alger, expérimentée dans les programmes résidentiels et mixtes, les voiries, les réseaux et la coordination de chantier.',
      dz: 'تواصل مع فريق مقره في الجزائر العاصمة، عنده خبرة في السكن، البرامج المختلطة، الطرقات، الشبكات وتنسيق الورشات.',
      tr: 'Konut, karma kullanım projeleri, yol, altyapı ağları ve koordineli şantiye yönetimi konularında deneyimli, Cezayir merkezli ekibimizle iletişime geçin.',
    },
    emailLabel: {
      en: 'Email Igloo',
      fr: 'E-mail Igloo',
      dz: 'راسل Igloo',
      tr: 'E-posta Gönderin',
    },
    phoneLabel: {
      en: 'Call Algeria office',
      fr: "Appeler le bureau d'Alger",
      dz: 'عيّط لمكتب الجزائر',
      tr: 'Cezayir Ofisini Arayın',
    },
    proofLine: {
      en: 'Bir Khadem, Algiers · Category 6 certified contractor · Residential and mixed-use delivery',
      fr: 'Bir Khadem, Alger · Entreprise certifiée catégorie 6 · Réalisations résidentielles et mixtes',
      dz: 'بئر خادم، الجزائر · مقاول مصنّف درجة 6 · إنجاز سكني ومختلط',
      tr: 'Bir Khadem, Cezayir · Kategori 6 sertifikalı yüklenici · Konut ve karma kullanım projeleri',
    },
  },
};

export const homepageProjectProofs: Record<string, HomepageText> = {
  'douaouda-300-500-housing': {
    en: 'Assisted promotional housing in Douaouda with professional premises, exterior works and TCE delivery.',
    fr: 'Logements promotionnels aidés à Douaouda, incluant locaux professionnels, aménagements extérieurs et réalisation TCE.',
    dz: 'سكنات ترقوية مدعّمة في الدواودة بمحلات مهنية، تهيئة خارجية وتسليم كامل الأشغال.',
    tr: "Douaouda'da destekli konut (LPA) projesi: İş yerleri, çevre düzenlemesi ve tüm iş kalemlerini kapsayan anahtar teslimi uygulama.",
  },
  'sidi-abdallah-200-1200-housing': {
    en: 'Public promotional housing in Sidi Abdallah with R+9 buildings and commercial/professional premises.',
    fr: 'Logements promotionnels publics à Sidi Abdallah, avec bâtiments R+9 et locaux commerciaux/professionnels.',
    dz: 'سكنات ترقوية عمومية في سيدي عبد الله بعمارات أرضي+9 ومحلات تجارية/مهنية.',
    tr: "Sidi Abdallah'da kamu konutu (LPP) projesi: Zemin+9 katlı binalar, ticari alanlar ve iş yerleri.",
  },
  'staoueli-11-41-villas': {
    en: 'Standing villa delivery at Les Pastorales with secondary trades, roads and utility networks.',
    fr: 'Villas de standing aux Pastorales, incluant corps d’état secondaires, voiries et réseaux divers.',
    dz: 'تسليم فيلات راقية في لي باستورال بحرف ثانوية، طرقات وشبكات متنوعة.',
    tr: "Les Pastorales'de lüks villa projesi: İnce işlerin, yolların ve altyapı ağlarının yapımı.",
  },
  rahmania: {
    en: 'Two commercial centres serving a 2,500-home residential programme in Douira, Algiers.',
    fr: 'Deux centres commerciaux au sein d’un programme résidentiel de 2 500 logements à Douira, Alger.',
    dz: 'مركزين تجاريين يخدموا برنامج سكني تاع 2500 مسكن في الدويرة، الجزائر العاصمة.',
    tr: "Cezayir, Douira'daki 2.500 konutluk yerleşim alanına hizmet veren iki ticaret merkezi.",
  },
  'said-hamdine-mixed-real-estate': {
    en: 'Five residential blocks, 202 free promotional units, one basement parking level and three commercial entre-sols with a mezzanine on a steeply sloping site.',
    fr: 'Cinq blocs résidentiels, 202 logements promotionnels libres, un sous-sol de parking et trois entre-sols commerciaux avec mezzanine sur un terrain à forte pente.',
    dz: 'خمسة عمارات سكنية، 202 وحدة ترقوية حرة، طابق سفلي واحد للمواقف وثلاثة طوابق تجارية نصفية مع ميزانين على أرضية شديدة الانحدار.',
    tr: 'Beş konut bloğu, 202 serbest satışlı daire, bir bodrum otoparkı ve mezzaninli üç ticari ara kat; proje eğimli bir arazide yer alıyor.',
  },
  'rouiba-4-promotional-villas': {
    en: 'Four promotional villas in Rouiba delivered with TCE, VRD and exterior site works.',
    fr: 'Quatre villas promotionnelles à Rouiba, livrées avec TCE, VRD et aménagements extérieurs.',
    dz: 'أربع فيلات ترقوية في الرويبة، مسلّمة بكامل الأشغال، الشبكات والتهيئة الخارجية.',
    tr: "Rouiba'da dört serbest satışlı villa; tüm mühendislik (TCE), altyapı (VRD) ve çevre düzenleme işleriyle birlikte tamamlandı.",
  },
  'sidi-benour-50-housing': {
    en: 'High-rise R+13 residential delivery within the Sidi Benour promotional housing programme.',
    fr: "Construction d'un ensemble résidentiel R+13 dans le cadre du programme de logements promotionnels de Sidi Benour.",
    dz: 'إنجاز سكني شاهق أرضي+13 ضمن برنامج سيدي بنور للسكن الترقوي.',
    tr: 'Sidi Benour serbest satışlı konut projesi kapsamında 13 katlı (R+13) bir konut bloğu tamamlandı.',
  },
  'dely-brahim-240-housing': {
    en: 'A 240-unit vertical residential programme with commercial areas, services and underground parking.',
    fr: 'Un programme résidentiel vertical de 240 logements, comprenant des commerces, des services et un parking en sous-sol.',
    dz: 'برنامج سكني عمودي تاع 240 وحدة بمساحات تجارية، خدمات وبارك تحت الأرض.',
    tr: '240 daireli konut projesi; ticari alanlar, sosyal donatılar ve kapalı otopark içeriyor.',
  },
  'bas-mazagran-200-38-housing': {
    en: 'A seven-block seaside programme in Mostaganem, combining assisted and free promotional housing with commercial premises and now entering delivery phase.',
    fr: 'Un programme balnéaire de sept blocs à Mostaganem, associant logements aidés, logements libres et locaux commerciaux, actuellement en phase de livraison.',
    dz: 'برنامج ساحلي من سبع عمارات في مستغانم يجمع بين السكن المدعّم والسكن الحر والمحلات التجارية، وهو الآن في مرحلة التسليم.',
    tr: "Mostaganem'de deniz kıyısındaki yedi bloklu proje; LPA ve LPL konutları ile ticari alanları kapsıyor ve teslim aşamasına girdi.",
  },
  'reghaia-bouraada-250-housing': {
    en: 'A 250-unit Reghaia programme with commercial premises, concierge spaces and multi-block execution.',
    fr: 'Un programme de 250 logements à Reghaia, incluant des locaux commerciaux, des conciergeries et une réalisation sur plusieurs blocs.',
    dz: 'برنامج 250 وحدة في الرغاية بمحلات تجارية، فضاءات حراسة وتنفيذ متعدد العمارات.',
    tr: "Reghaia'da 250 konutluk, çok bloklu bir proje. Ticari alanlar ve danışma hizmet birimleri de içeriyor.",
  },
  'boudouaou-70-10-housing': {
    en: 'A Boumerdes programme of 70 assisted and 10 free promotional units with commercial/professional premises.',
    fr: 'Un programme à Boumerdès de 70 logements aidés et 10 logements promotionnels libres, avec des locaux commerciaux ou professionnels.',
    dz: 'برنامج في بومرداس تاع 70 وحدة مدعّمة و10 حرة بمحلات تجارية/مهنية.',
    tr: "Boumerdes'te 70 destekli (LPA) ve 10 serbest satışlı (LPL) konutun yanı sıra ticari ve ofis alanlarını barındıran bir proje.",
  },
};

function localizedHomeNode(path: string, locale: Locale): unknown {
  const content = getPageContent<Record<string, unknown>>('home', locale).content;
  if (!path) return content;
  return path.split('.').reduce<unknown>((current, segment) => {
    if (!current || typeof current !== 'object') return undefined;
    return (current as Record<string, unknown>)[segment];
  }, content);
}

function buildLocalizedHomeNode(path = ''): unknown {
  const english = localizedHomeNode(path, 'en');
  if (typeof english === 'string') {
    // Numeric metrics and stable step identifiers are facts/keys, not copy.
    // Keep them scalar so existing presentation components never receive a
    // `{ en, fr, ... }` object where they expect a React key or a number.
    if (path.endsWith('.value') || path.endsWith('.id')) return english;
    // The legacy homepage shape uses `dz` for Algerian Arabic. Keep that
    // adapter key here so `pickLocaleText('ar-DZ', ...)` can resolve it.
    const locales = [
      ['en', 'en'],
      ['fr', 'fr'],
      ['tr', 'tr'],
      ['dz', 'ar-DZ'],
    ] as const;
    return Object.fromEntries(locales.map(([key, locale]) => [key, localizedHomeNode(path, locale)]));
  }
  if (Array.isArray(english)) return english.map((_, index) => buildLocalizedHomeNode(path ? `${path}.${index}` : String(index)));
  if (english && typeof english === 'object') {
    return Object.fromEntries(Object.keys(english as Record<string, unknown>).map((key) => [key, buildLocalizedHomeNode(path ? `${path}.${key}` : key)]));
  }
  return english;
}

/** Canonical page JSON projected into the legacy component shape during migration. */
export const homepageContent = buildLocalizedHomeNode() as typeof legacyHomepageContent;

export function localize(value: HomepageText, locale: Locale): string {
  return pickLocaleText(locale, value);
}
