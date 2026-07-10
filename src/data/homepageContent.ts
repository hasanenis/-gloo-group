import { pickLocaleText, type Locale } from '../i18n/runtime';

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

export const homepageContent = {
  hero: {
    eyebrow: {
      en: 'SARL Igloo Yapi Construction',
      fr: 'SARL Igloo Yapi Construction',
      dz: 'SARL Igloo Yapi Construction',
      tr: 'SARL Igloo Yapi Construction',
    },
    title: {
      en: 'Building for Algeria. Built to last.',
      fr: 'Construire pour l’Algérie. Bâtir pour durer.',
      dz: 'نبنيو للجزائر. بناء يدوم.',
      tr: 'Cezayir için inşa ediyoruz. Kalıcı olsun diye.',
    },
    lead: {
      en: 'Residential and mixed-use programmes delivered with engineering control, site discipline and long-term construction quality across Algeria.',
      fr: 'Des programmes résidentiels et mixtes réalisés avec maîtrise technique, discipline de chantier et qualité durable en Algérie.',
      dz: 'برامج سكنية ومختلطة نسلّموها بمراقبة هندسية، انضباط في الورشة وجودة بناء تدوم عبر كامل الجزائر.',
      tr: 'Cezayir genelinde mühendislik kontrolü, saha disiplini ve uzun ömürlü inşaat kalitesiyle teslim edilen konut ve karma kullanım programları.',
    },
    primaryCta: {
      en: 'Explore projects',
      fr: 'Voir les projets',
      dz: 'شوف المشاريع',
      tr: 'Projeleri keşfedin',
    },
    secondaryCta: {
      en: 'Contact team',
      fr: 'Contacter l’équipe',
      dz: 'تواصل مع الفريق',
      tr: 'Ekiple iletişime geçin',
    },
    trustFacts: [
      { value: 'Est. 2018', label: { en: 'Algiers-based', fr: 'Basée à Alger', dz: 'مقرها الجزائر العاصمة', tr: 'Cezayir merkezli' } },
      { value: '11', label: { en: 'projects', fr: 'projets', dz: 'مشاريع', tr: 'proje' } },
      { value: '2,500+', label: { en: 'housing units', fr: 'logements', dz: 'وحدة سكنية', tr: 'konut birimi' } },
      { value: '4', label: { en: 'wilayas covered', fr: 'wilayas couvertes', dz: 'ولايات مغطّاة', tr: 'kapsanan il' } },
      { value: 'Category 6', label: { en: 'certified contractor', fr: 'entreprise certifiée', dz: 'مقاول مصنّف', tr: 'sertifikalı yüklenici' } },
    ] satisfies HomepageMetric[],
  },
  manifesto: {
    eyebrow: {
      en: 'Construction with proof',
      fr: 'Construction avec preuves',
      dz: 'بناء بالدليل',
      tr: 'Kanıtlı inşaat',
    },
    title: {
      en: 'We build the framework for durable everyday life.',
      fr: 'Nous bâtissons le cadre d’une vie quotidienne durable.',
      dz: 'نبنيو الإطار تاع حياة يومية تدوم.',
      tr: 'Kalıcı bir günlük yaşamın çerçevesini inşa ediyoruz.',
    },
    body: {
      en: 'From housing blocks and villas to commercial premises, roads and networks, Igloo coordinates the trades that turn a programme into a place that works.',
      fr: 'Des immeubles résidentiels aux villas, des locaux commerciaux aux voiries et réseaux, Igloo coordonne les corps de métier qui transforment un programme en lieu fonctionnel.',
      dz: 'من العمارات السكنية والفيلات للمحلات التجارية، الطرقات والشبكات، Igloo تنسّق بين الحرفيين باش تحوّل البرنامج لمكان يخدم بصحّ.',
      tr: 'Konut bloklarından villalara, ticari alanlardan yollara ve altyapı ağlarına kadar Igloo, bir programı işleyen bir mekâna dönüştüren tüm iş kollarını koordine eder.',
    },
    credential: {
      en: 'Professional Qualification and Classification Certificate, Category 6',
      fr: 'Certificat de qualification et de classification professionnelles, catégorie 6',
      dz: 'شهادة التأهيل والتصنيف المهني، الفئة 6',
      tr: 'Mesleki Yeterlilik ve Sınıflandırma Belgesi, Kategori 6',
    },
    metrics: [
      {
        value: '2018',
        label: { en: 'founded in Algiers', fr: 'création à Alger', dz: 'تأسّست في الجزائر العاصمة', tr: 'Cezayir\'de kuruldu' },
        detail: { en: 'Bir Khadem operational base', fr: 'base opérationnelle à Bir Khadem', dz: 'قاعدة العمل في بئر خادم', tr: 'Bir Khadem operasyon merkezi' },
      },
      {
        value: '11',
        label: { en: 'portfolio projects', fr: 'projets au portefeuille', dz: 'مشاريع في المحفظة', tr: 'portföy projesi' },
        detail: { en: 'completed and current programmes', fr: 'programmes livrés et en cours', dz: 'برامج مسلّمة وأخرى قيد الإنجاز', tr: 'tamamlanan ve devam eden programlar' },
      },
      {
        value: '2,500+',
        label: { en: 'housing units connected to programmes', fr: 'logements liés aux programmes', dz: 'وحدة سكنية مرتبطة بالبرامج', tr: 'programlara bağlı konut birimi' },
        detail: { en: 'residential and mixed-use scope', fr: 'portée résidentielle et mixte', dz: 'نطاق سكني ومختلط', tr: 'konut ve karma kullanım kapsamı' },
      },
      {
        value: '4',
        label: { en: 'wilayas represented', fr: 'wilayas représentées', dz: 'ولايات ممثّلة', tr: 'temsil edilen il' },
        detail: { en: 'Tipaza, Algiers, Mostaganem, Boumerdes', fr: 'Tipaza, Alger, Mostaganem, Boumerdes', dz: 'تيبازة، الجزائر العاصمة، مستغانم، بومرداس', tr: 'Tipaza, Cezayir, Mostaganem, Bumerdes' },
      },
    ] satisfies HomepageMetric[],
  },
  featuredProjects: {
    eyebrow: {
      en: 'Selected work',
      fr: 'Réalisations sélectionnées',
      dz: 'أعمال مختارة',
      tr: 'Seçilmiş çalışmalar',
    },
    title: {
      en: 'Built evidence, not promises.',
      fr: 'Des références construites, pas des promesses.',
      dz: 'دليل مبني، ماشي وعود.',
      tr: 'Vaat değil, inşa edilmiş kanıt.',
    },
    lead: {
      en: 'A portfolio of housing, villas, commercial premises, roads and networks, shown through real project scope and location proof.',
      fr: 'Un portefeuille de logements, villas, locaux commerciaux, voiries et réseaux, présenté par portée réelle et localisation.',
      dz: 'محفظة تحتوي سكنات، فيلات، محلات تجارية، طرقات وشبكات، معروضة بنطاق حقيقي ودليل الموقع.',
      tr: 'Gerçek proje kapsamı ve konum kanıtıyla gösterilen konut, villa, ticari alan, yol ve altyapı ağlarından oluşan bir portföy.',
    },
  },
  process: {
    eyebrow: {
      en: 'Delivery discipline',
      fr: 'Discipline de livraison',
      dz: 'انضباط التسليم',
      tr: 'Teslim disiplini',
    },
    title: {
      en: 'From first coordination to handover.',
      fr: 'De la coordination initiale à la réception.',
      dz: 'من أول تنسيق حتى التسليم.',
      tr: 'İlk koordinasyondan teslime kadar.',
    },
    lead: {
      en: 'A clear technical structure keeps each programme moving through planning, engineering control, site execution and final delivery.',
      fr: 'Une structure technique claire accompagne chaque programme de la planification au contrôle d’exécution, jusqu’à la livraison.',
      dz: 'هيكلة تقنية واضحة تخلّي كل برنامج يتقدّم من التخطيط، المراقبة الهندسية، تنفيذ الورشة حتى التسليم النهائي.',
      tr: 'Net bir teknik yapı, her programı planlamadan mühendislik kontrolüne, saha uygulamasından nihai teslime kadar ilerletir.',
    },
    steps: [
      {
        id: 'coordination',
        title: {
          en: 'Pre-construction coordination',
          fr: 'Coordination avant travaux',
          dz: 'التنسيق قبل الانطلاق',
          tr: 'İnşaat öncesi koordinasyon',
        },
        body: {
          en: 'Scope, programme requirements, quantities and site constraints are aligned before work moves on site.',
          fr: 'La portée, les exigences du programme, les quantités et les contraintes du site sont alignées avant l’intervention.',
          dz: 'النطاق، متطلبات البرنامج، الكميات وقيود الورشة يتنسّقوا قبل ما تبدا الأشغال.',
          tr: 'Kapsam, program gereksinimleri, miktarlar ve saha kısıtları, çalışma başlamadan önce uyumlu hale getirilir.',
        },
      },
      {
        id: 'engineering',
        title: {
          en: 'Engineering & TCE control',
          fr: 'Ingénierie & contrôle TCE',
          dz: 'الهندسة ومراقبة الأشغال الثانوية',
          tr: 'Mühendislik ve TCE kontrolü',
        },
        body: {
          en: 'Engineers, architects and technical managers coordinate secondary trades, structures, MEP, roads and networks.',
          fr: 'Ingénieurs, architectes et responsables techniques coordonnent les corps d’état, structures, MEP, voiries et réseaux.',
          dz: 'المهندسين، المعماريين والمسؤولين التقنيين ينسّقوا بين الحرف الثانوية، الهياكل، الشبكات، الطرقات.',
          tr: 'Mühendisler, mimarlar ve teknik yöneticiler; ikincil işleri, yapıyı, tesisatı, yolları ve altyapı ağlarını koordine eder.',
        },
      },
      {
        id: 'site',
        title: {
          en: 'Site execution',
          fr: 'Exécution de chantier',
          dz: 'تنفيذ الورشة',
          tr: 'Saha uygulaması',
        },
        body: {
          en: 'Construction managers and site teams organise daily progress, trade sequencing and material movement.',
          fr: 'Les conducteurs de travaux et équipes de chantier organisent l’avancement, les enchaînements et les approvisionnements.',
          dz: 'مسؤولي الورشة والفرق ينظّموا التقدّم اليومي، ترتيب الحرف وحركة المواد.',
          tr: 'Şantiye şefleri ve saha ekipleri, günlük ilerlemeyi, iş sıralamasını ve malzeme akışını düzenler.',
        },
      },
      {
        id: 'monitoring',
        title: {
          en: 'Quality, safety & schedule monitoring',
          fr: 'Qualité, sécurité & planning',
          dz: 'مراقبة الجودة، السلامة والجدول الزمني',
          tr: 'Kalite, güvenlik ve program takibi',
        },
        body: {
          en: 'Delivery is tracked against technical requirements, safety rules, finish quality and contractual milestones.',
          fr: 'La livraison est suivie selon les exigences techniques, les règles de sécurité, la qualité de finition et les jalons contractuels.',
          dz: 'التسليم يتراقب حسب المتطلبات التقنية، قواعد السلامة، جودة التشطيب والمحطات التعاقدية.',
          tr: 'Teslimat; teknik gereklilikler, güvenlik kuralları, işçilik kalitesi ve sözleşme kilometre taşlarına göre izlenir.',
        },
      },
      {
        id: 'handover',
        title: {
          en: 'Handover & aftercare',
          fr: 'Réception & suivi',
          dz: 'التسليم والمتابعة',
          tr: 'Teslim ve sonrası takip',
        },
        body: {
          en: 'Final works are closed with practical readiness, documentation and attention to the long-term use of each place.',
          fr: 'Les travaux finaux sont clôturés avec préparation pratique, documentation et attention à l’usage durable de chaque lieu.',
          dz: 'الأشغال الأخيرة تتقفل بجاهزية عملية، توثيق واهتمام بالاستعمال طويل المدى تاع كل مكان.',
          tr: 'Son işler; pratik hazırlık, dokümantasyon ve her mekânın uzun vadeli kullanımına özen gösterilerek kapatılır.',
        },
      },
    ] satisfies HomepageProcessStep[],
  },
  about: {
    eyebrow: {
      en: 'Company profile',
      fr: 'Profil entreprise',
      dz: 'ملف الشركة',
      tr: 'Şirket profili',
    },
    title: {
      en: 'Built with expertise. Delivered with control.',
      fr: 'Construit avec expertise. Livre avec maitrise.',
      dz: 'مبني بالخبرة. مسلّم بمراقبة.',
      tr: 'Uzmanlıkla inşa edildi. Kontrolle teslim edildi.',
    },
    credential: {
      en: 'Professional Qualification & Classification Certificate - Category 6',
      fr: 'Certificat de qualification et classification - categorie 6',
      dz: 'شهادة التأهيل والتصنيف المهني - الفئة 6',
      tr: 'Mesleki Yeterlilik ve Sınıflandırma Belgesi - Kategori 6',
    },
    paragraphs: [
      {
        en: 'Founded in 2018 and managed by civil engineer Adem Talay, SARL Igloo Yapi Construction works from Bir Khadem, Algiers, on residential and mixed-use programmes across Algeria.',
        fr: 'Fondée en 2018 et dirigée par l’ingénieur en génie civil Adem Talay, SARL Igloo Yapi Construction intervient depuis Bir Khadem, Alger, sur des programmes résidentiels et mixtes en Algérie.',
        dz: 'تأسّست سنة 2018 ويسيّرها المهندس المدني آدم طالاي، SARL Igloo Yapi Construction تخدم من بئر خادم، الجزائر العاصمة، على برامج سكنية ومختلطة عبر كامل الجزائر.',
        tr: 'İnşaat mühendisi Adem Talay tarafından yönetilen SARL Igloo Yapi Construction, 2018\'de kuruldu ve Bir Khadem, Cezayir merkezinden Cezayir genelinde konut ve karma kullanım programları yürütüyor.',
      },
      {
        en: 'The company holds a Professional Qualification and Classification Certificate, Category 6, and operates with a qualified building manager, engineers, architects, construction managers and site staff.',
        fr: 'L’entreprise détient un Certificat de qualification et de classification professionnelles, catégorie 6, et s’appuie sur un responsable bâtiment, des ingénieurs, architectes, conducteurs de travaux et équipes de chantier.',
        dz: 'الشركة عندها شهادة التأهيل والتصنيف المهني، الفئة 6، وتخدم بمسؤول بناية مؤهّل، مهندسين، معماريين، مسؤولي ورشة وفرق ميدانية.',
        tr: 'Şirket, Kategori 6 Mesleki Yeterlilik ve Sınıflandırma Belgesine sahiptir; yetkin bir bina yöneticisi, mühendisler, mimarlar, şantiye şefleri ve saha ekibiyle faaliyet gösterir.',
      },
    ] satisfies HomepageText[],
    metrics: [
      {
        value: '2018',
        label: { en: 'Established', fr: 'Etablie', dz: 'تأسّست', tr: 'Kuruluş' },
      },
      {
        value: '11',
        label: { en: 'Projects delivered and underway', fr: 'Projets livres et en cours', dz: 'مشاريع مسلّمة وقيد الإنجاز', tr: 'Teslim edilen ve devam eden proje' },
      },
      {
        value: '2,500+',
        label: { en: 'Homes delivered or underway', fr: 'Logements livres ou en cours', dz: 'سكنات مسلّمة أو قيد الإنجاز', tr: 'Teslim edilen veya devam eden konut' },
      },
    ] satisfies HomepageMetric[],
    proofs: [
      {
        title: { en: 'Category 6 Contractor', fr: 'Entrepreneur categorie 6', dz: 'مقاول الفئة 6', tr: 'Kategori 6 Yüklenici' },
        body: {
          en: 'Professional Qualification and Classification Certificate, Category 6.',
          fr: 'Certificat de qualification et de classification professionnelles, catégorie 6.',
          dz: 'شهادة التأهيل والتصنيف المهني، الفئة 6.',
          tr: 'Mesleki Yeterlilik ve Sınıflandırma Belgesi, Kategori 6.',
        },
      },
      {
        title: { en: 'Multidisciplinary Team', fr: 'Equipe pluridisciplinaire', dz: 'فريق متعدد الاختصاصات', tr: 'Çok Disiplinli Ekip' },
        body: {
          en: 'Building manager, three engineers, two architects, construction managers, HR, accountant, buyer and site teams.',
          fr: 'Responsable bâtiment, trois ingénieurs, deux architectes, conducteurs de travaux, RH, comptable, acheteur et équipes chantier.',
          dz: 'مسؤول بناية، ثلاثة مهندسين، معماريّين، مسؤولي ورشة، موارد بشرية، محاسب، مشتري وفرق ميدانية.',
          tr: 'Bina yöneticisi, üç mühendis, iki mimar, şantiye şefleri, İK, muhasebeci, satın alma sorumlusu ve saha ekipleri.',
        },
      },
      {
        title: { en: 'Residential & Mixed-use Expertise', fr: 'Expertise residentielle et mixte', dz: 'خبرة سكنية ومختلطة', tr: 'Konut ve Karma Kullanım Uzmanlığı' },
        body: {
          en: 'Housing, villas, commercial premises, roads, networks, services and exterior works.',
          fr: 'Logements, villas, locaux commerciaux, voiries, réseaux, services et aménagements extérieurs.',
          dz: 'سكنات، فيلات، محلات تجارية، طرقات، شبكات، خدمات وتهيئة خارجية.',
          tr: 'Konut, villa, ticari alan, yol, altyapı ağı, hizmetler ve dış mekân işleri.',
        },
      },
    ] satisfies HomepageProof[],
  },
  footprint: {
    eyebrow: {
      en: 'Project footprint',
      fr: 'Empreinte projet',
      dz: 'انتشار المشاريع',
      tr: 'Proje ayak izi',
    },
    title: {
      en: 'Algeria & Beyond',
      fr: 'Algérie & au-delà',
      dz: 'الجزائر وأبعد',
      tr: 'Cezayir ve Ötesi',
    },
    lead: {
      en: 'Eleven project locations across four highlighted wilayas, with a dense Algiers delivery belt and active reach toward Mostaganem and Boumerdes.',
      fr: 'Onze implantations de projets dans quatre wilayas mises en évidence, avec une forte concentration autour d’Alger et une présence vers Mostaganem et Boumerdès.',
      dz: 'حداش موقع مشروع عبر أربع ولايات، بتركيز كبير حول الجزائر العاصمة وحضور فعّال نحو مستغانم وبومرداس.',
      tr: 'Yoğun bir Cezayir teslim hattı ve Mostaganem ile Bumerdes\'e uzanan aktif kapsamla, dört öne çıkan ilde on bir proje konumu.',
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
      tr: 'Projeyi aç',
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
      { value: '11', label: { en: 'project pins', fr: 'pins projet', dz: 'مواقع مشاريع', tr: 'proje işareti' } },
      { value: '4', label: { en: 'highlighted wilayas', fr: 'wilayas mises en évidence', dz: 'ولايات بارزة', tr: 'öne çıkan il' } },
      { value: '1', label: { en: 'north-coast delivery belt', fr: 'axe de livraison nord', dz: 'حزام التسليم الشمالي', tr: 'kuzey kıyı teslim hattı' } },
    ] satisfies HomepageMetric[],
  },
  footer: {
    eyebrow: {
      en: 'Project discussion',
      fr: 'Discussion projet',
      dz: 'نقاش مشروع',
      tr: 'Proje görüşmesi',
    },
    title: {
      en: 'Let’s discuss the next durable programme.',
      fr: 'Parlons du prochain programme durable.',
      dz: 'خلينا نحكيو على البرنامج الجاي اللي يدوم.',
      tr: 'Bir sonraki kalıcı programı konuşalım.',
    },
    lead: {
      en: 'Speak with an Algiers-based team experienced in residential, mixed-use, roads, networks and coordinated site delivery.',
      fr: 'Échangez avec une équipe basée à Alger, expérimentée dans les programmes résidentiels et mixtes, les voiries, les réseaux et la coordination de chantier.',
      dz: 'تواصل مع فريق مقره في الجزائر العاصمة، عنده خبرة في السكن، البرامج المختلطة، الطرقات، الشبكات وتنسيق الورشات.',
      tr: 'Konut, karma kullanım, yollar, altyapı ağları ve koordineli saha tesliminde deneyimli Cezayir merkezli ekiple görüşün.',
    },
    emailLabel: {
      en: 'Email Igloo',
      fr: 'E-mail Igloo',
      dz: 'راسل Igloo',
      tr: 'Igloo’ya e-posta',
    },
    phoneLabel: {
      en: 'Call Algeria office',
      fr: 'Appeler le bureau Algérie',
      dz: 'عيّط لمكتب الجزائر',
      tr: 'Cezayir ofisini ara',
    },
    proofLine: {
      en: 'Bir Khadem, Algiers · Category 6 certified contractor · Residential and mixed-use delivery',
      fr: 'Bir Khadem, Alger · Entreprise certifiée catégorie 6 · Réalisation résidentielle et mixte',
      dz: 'بئر خادم، الجزائر · مقاول مصنّف درجة 6 · إنجاز سكني ومختلط',
      tr: 'Bir Khadem, Cezayir · Kategori 6 sertifikalı yüklenici · Konut ve karma kullanım teslimi',
    },
  },
};

export const homepageProjectProofs: Record<string, HomepageText> = {
  'douaouda-300-500-housing': {
    en: 'Assisted promotional housing in Douaouda with professional premises, exterior works and TCE delivery.',
    fr: 'Logements promotionnels aidés à Douaouda avec locaux professionnels, aménagements extérieurs et réalisation TCE.',
    dz: 'سكنات ترقوية مدعّمة في الدواودة بمحلات مهنية، تهيئة خارجية وتسليم كامل الأشغال.',
    tr: 'Douaouda\'da profesyonel alanlar, dış mekân işleri ve TCE teslimatıyla desteklenen promosyonel konut.',
  },
  'sidi-abdallah-200-1200-housing': {
    en: 'Public promotional housing in Sidi Abdallah with R+9 buildings and commercial/professional premises.',
    fr: 'Logements promotionnels publics à Sidi Abdellah avec bâtiments R+9 et locaux commerciaux/professionnels.',
    dz: 'سكنات ترقوية عمومية في سيدي عبد الله بعمارات أرضي+9 ومحلات تجارية/مهنية.',
    tr: 'Sidi Abdallah\'da R+9 binalar ve ticari/profesyonel alanlarla kamu promosyonel konutu.',
  },
  'staoueli-11-41-villas': {
    en: 'Standing villa delivery at Les Pastorales with secondary trades, roads and utility networks.',
    fr: 'Villas de standing aux Pastorales avec corps d’état secondaires, voiries et réseaux divers.',
    dz: 'تسليم فيلات راقية في لي باستورال بحرف ثانوية، طرقات وشبكات متنوعة.',
    tr: 'Les Pastorales\'de ikincil işler, yollar ve altyapı ağlarıyla üst düzey villa teslimatı.',
  },
  rahmania: {
    en: 'Two commercial centres serving a 2,500-home residential programme in Douira, Algiers.',
    fr: 'Deux centres commerciaux au sein d’un programme de 2 500 logements à Douera, Alger.',
    dz: 'مركزين تجاريين يخدموا برنامج سكني تاع 2500 مسكن في الدويرة، الجزائر العاصمة.',
    tr: 'Cezayir Douira\'da 2.500 konutluk bir yerleşim programına hizmet eden iki ticaret merkezi.',
  },
  'said-hamdine-mixed-real-estate': {
    en: 'Five residential blocks, 202 free promotional units, commercial levels and two basement parking floors.',
    fr: 'Cinq blocs résidentiels, 202 logements promotionnels libres, niveaux commerciaux et deux sous-sols de parking.',
    dz: 'خمسة عمارات سكنية، 202 وحدة ترقوية حرة، طوابق تجارية وطابقين بارك تحت الأرض.',
    tr: 'Beş konut bloğu, 202 serbest promosyonel birim, ticari katlar ve iki bodrum katı otopark.',
  },
  'rouiba-4-promotional-villas': {
    en: 'Four promotional villas in Rouiba delivered with TCE, VRD and exterior site works.',
    fr: 'Quatre villas promotionnelles à Rouiba réalisées avec TCE, VRD et aménagements extérieurs.',
    dz: 'أربع فيلات ترقوية في الرويبة، مسلّمة بكامل الأشغال، الشبكات والتهيئة الخارجية.',
    tr: 'Ruiba\'da TCE, VRD ve dış saha işleriyle teslim edilen dört promosyonel villa.',
  },
  'sidi-benour-50-housing': {
    en: 'High-rise R+13 residential delivery within the Sidi Benour promotional housing programme.',
    fr: 'Réalisation résidentielle R+13 au sein du programme de logements promotionnels de Sidi Benour.',
    dz: 'إنجاز سكني شاهق أرضي+13 ضمن برنامج سيدي بنور للسكن الترقوي.',
    tr: 'Sidi Benour promosyonel konut programı kapsamında R+13 yüksek katlı konut teslimatı.',
  },
  'dely-brahim-240-housing': {
    en: 'A 240-unit vertical residential programme with commercial areas, services and underground parking.',
    fr: 'Un programme résidentiel vertical de 240 logements avec commerces, services et parking en sous-sol.',
    dz: 'برنامج سكني عمودي تاع 240 وحدة بمساحات تجارية، خدمات وبارك تحت الأرض.',
    tr: 'Ticari alanlar, hizmetler ve yeraltı otoparkıyla 240 birimlik dikey konut programı.',
  },
  'bas-mazagran-200-38-housing': {
    en: 'A seven-block Mostaganem programme combining assisted and free promotional housing with commercial premises.',
    fr: 'Un programme de sept blocs à Mostaganem associant logements aidés, logements libres et locaux commerciaux.',
    dz: 'برنامج سبعة عمارات في مستغانم يجمع بين السكن المدعّم، الحر ومحلات تجارية.',
    tr: 'Mostaganem\'de yardımlı ve serbest promosyonel konutu ticari alanlarla birleştiren yedi bloklu program.',
  },
  'reghaia-bouraada-250-housing': {
    en: 'A 250-unit Reghaia programme with commercial premises, concierge spaces and multi-block execution.',
    fr: 'Un programme de 250 logements à Reghaia avec locaux commerciaux, conciergeries et exécution multi-blocs.',
    dz: 'برنامج 250 وحدة في الرغاية بمحلات تجارية، فضاءات حراسة وتنفيذ متعدد العمارات.',
    tr: 'Ticari alanlar, kapıcı bölümleri ve çok bloklu uygulamayla Reghaia\'da 250 birimlik program.',
  },
  'boudouaou-70-10-housing': {
    en: 'A Boumerdes programme of 70 assisted and 10 free promotional units with commercial/professional premises.',
    fr: 'Un programme à Boumerdès de 70 logements aidés et 10 libres avec locaux commerciaux/professionnels.',
    dz: 'برنامج في بومرداس تاع 70 وحدة مدعّمة و10 حرة بمحلات تجارية/مهنية.',
    tr: 'Bumerdes\'de ticari/profesyonel alanlarla 70 yardımlı ve 10 serbest promosyonel birim programı.',
  },
};

export function localize(value: HomepageText, locale: Locale): string {
  return pickLocaleText(locale, value);
}
