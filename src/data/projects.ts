import { pickLocaleText, type Locale, type LocalizedString } from '../i18n/runtime';
import { getProjectPage } from '../content';

const GITHUB_MEDIA_BASE =
  'https://raw.githubusercontent.com/hasanenis/-gloo-group/refs/heads/main/src/assets/pptx-media';

function media(name: string) {
  return `${GITHUB_MEDIA_BASE}/${name}`;
}

export type ProjectStatus = 'completed' | 'current';

export type ProjectRecord = {
  id: number;
  slug: string;
  title: string;
  menuTitle: string;
  chapterLabel: string;
  location: string;
  status: ProjectStatus;
  summary: string;
  details: string;
  scope: string;
  coverLines: [string, string];
  images: string[];
  sourceSlides: number[];
  /* Optional detail-page fields (used by ProjectDetail; fall back to sensible defaults). */
  formOfContract?: string;
  client?: string;
  architect?: string;
  repeatOrNew?: string;
  highlights?: string[];
  capability?: string;
};

export const companyProfile = {
  name: 'SARL Igloo Yapi Construction',
  address: 'No. 8, Rue Krouch Slimane, Closan Jean Lot no. 1-31, RDC, Bir Khadem - Algiers',
  phones: ['+213 542 819 461'],
  email: 'info@igloogroupe.com',
  foundedYear: 2018,
  classificationBadge: {
    en: 'Category 6',
    fr: 'Catégorie 6',
    tr: 'Kategori 6',
    'ar-DZ': 'الفئة 6',
  },
  qualificationStatement: {
    en: 'Professional Qualification and Classification Certificate',
    fr: 'Certificat de qualification et de classification professionnelles',
    "ar-DZ": 'شهادة التأهيل والتصنيف المهني',
    tr: 'Mesleki Yeterlilik ve Sınıflandırma Sertifikası',
  },
  teamStructure: {
    en: 'Qualified building manager, three engineers, two architects, construction managers, HR manager, accountant, buyer, and site staff.',
    fr: 'Un chef de projet bâtiment qualifié, trois ingénieurs, deux architectes, des conducteurs de travaux, un responsable RH, un comptable, un acheteur et les équipes de chantier.',
    "ar-DZ": 'مدير مبنى مؤهل، وثلاثة مهندسين، ومهندسان معماريان، ومديرو إنشاءات، ومدير موارد بشرية، ومحاسب، ومسؤول مشتريات، وطاقم عمل الموقع.',
    tr: 'Yetkin bir proje yöneticisi, üç mühendis, iki mimar, inşaat yöneticileri, İK müdürü, muhasebeci, satın alma uzmanı ve şantiye ekibimiz.',
  },
  overview: {
    en: [
      'Founded in 2018 in Algiers, SARL Igloo Yapi Construction specializes in residential and mixed-use developments led by civil engineer Adem Talay.',
      'Our engineers, architects, site managers, and field teams work as one coordinated structure to deliver projects with precision, efficiency, and lasting quality.',
      'We create modern, durable, and functional spaces designed for people, businesses, and communities.',
    ],
    fr: [
      'Fondée en 2018 à Alger, SARL Igloo Yapi Construction est spécialisée dans les programmes résidentiels et à usage mixte, dirigée par l\'ingénieur civil Adem Talay.',
      'Nos ingénieurs, architectes, conducteurs de travaux et équipes de chantier forment une structure coordonnée pour livrer des projets avec précision, efficacité et qualité durable.',
      'Nous créons des espaces modernes, durables et fonctionnels, pensés pour les personnes, les entreprises et les communautés.',
    ],
  },
};

export const projects: ProjectRecord[] = [
  {
    id: 1,
    slug: 'douaouda-300-500-housing',
    title: '300/500 Assisted Promotional Housing',
    menuTitle: 'Douaouda Housing',
    chapterLabel: 'Completed',
    location: 'Douaouda',
    status: 'completed',
    summary: 'Construction works for all secondary state bodies in the 300/500 LPA programme in Douaouda, with 300 homes delivered within the 500-home programme.',
    details: 'The completed phase covers 300 homes within the wider 500-home residential programme, including coordinated structural, secondary, access and site works.',
    scope: 'Residential delivery with coordinated supporting works and site infrastructure.',
    coverLines: ['Douaouda', '300/500 Housing'],
    images: [media('image8.jpeg'), media('image9.jpeg'), media('image10.jpeg')],
    sourceSlides: [4],
  },
  {
    id: 2,
    slug: 'sidi-abdallah-200-1200-housing',
    title: '200/1200 Promotional Public Housing',
    menuTitle: 'Sidi Abdallah',
    chapterLabel: 'Completed',
    location: 'Sidi Abdallah - Mahalma',
    status: 'completed',
    summary: 'Construction works for all secondary state bodies within the 200/1200 promotional public housing development in Sidi Abdallah - Mahalma.',
    details: 'A major public housing contract delivered with secondary state body works and coordinated programme execution.',
    scope: 'Large-scale public housing with integrated construction support packages.',
    coverLines: ['Sidi Abdallah', 'Public Housing'],
    images: [media('image11.jpeg'), media('image12.jpeg'), media('image13.jpeg')],
    sourceSlides: [5],
  },
  {
    id: 3,
    slug: 'staoueli-11-41-villas',
    title: '11/41 Villas and Network Works',
    menuTitle: 'Staoueli Villas',
    chapterLabel: 'Completed',
    location: 'Staoueli',
    status: 'completed',
    summary: 'Construction work in all secondary state bodies, including various road and network works for the 11/41 villas project in Staoueli.',
    details: 'The programme combines villa construction packages with the roadworks and utility network systems needed for full site readiness.',
    scope: 'Residential villas plus roads, utility networks, and coordinated site infrastructure.',
    coverLines: ['Staoueli', '11/41 Villas'],
    images: [media('image14.jpeg'), media('image15.jpeg'), media('image16.jpeg')],
    sourceSlides: [6],
  },
  {
    id: 4,
    slug: 'rahmania',
    title: 'Rahmania Commercial Centres',
    menuTitle: 'Rahmania',
    chapterLabel: 'Completed',
    location: 'Douira, Algiers',
    status: 'completed',
    summary: "Two commercial centres completed as part of Douira's 2,500-home residential development.",
    details: 'A coordinated retail and services package designed to support everyday life across a major residential district.',
    scope: 'Two commercial centres with retail, service spaces, circulation, and finishing works integrated into a larger housing masterplan.',
    coverLines: ['Commercial Centres', 'Douira'],
    images: [media('image17.jpeg'), media('image19.jpeg'), media('image20.jpeg'), media('image21.jpeg')],
    sourceSlides: [7],
  },
  {
    id: 5,
    slug: 'said-hamdine-mixed-real-estate',
    title: 'Mixed Real Estate Complex with 202 Free Promotional Housing',
    menuTitle: 'Said Hamdine',
    chapterLabel: 'Completed',
    location: 'Said Hamdine, Bir Mourad Rais, Algiers',
    status: 'completed',
    summary: 'Construction work in all secondary state bodies for a mixed real estate complex of 5 blocks and 202 free promotional housing units on a steeply sloping site, with 1 basement parking level and 3 commercial entre-sols with mezzanine.',
    details: 'A dense mixed-use residential complex delivered on a steeply sloping site, combining 202 homes, one basement parking level and three commercial entre-sols with mezzanine.',
    scope: 'Five-block mixed real estate delivery with housing, one basement parking level, and three commercial entre-sols with mezzanine.',
    coverLines: ['Said Hamdine', 'Mixed Complex'],
    images: [media('image22.jpeg'), media('image4.jpeg'), media('image5.jpeg'), media('image2.jpeg')],
    sourceSlides: [8, 9],
  },
  {
    id: 6,
    slug: 'rouiba-4-promotional-villas',
    title: '4 Promotional Villas and Network Works',
    menuTitle: 'Rouiba Villas',
    chapterLabel: 'Completed',
    location: 'Rouiba',
    status: 'completed',
    summary: 'Construction work in all secondary state bodies, including various roads and network works for 4 promotional villas in Rouiba.',
    details: 'A smaller-format residential package supported by site access, utility network coordination, and secondary works.',
    scope: 'Promotional villas delivered with road and network packages.',
    coverLines: ['Rouiba', '4 Villas'],
    images: [media('image27.jpeg'), media('image28.jpeg'), media('image29.jpeg'), media('image30.jpeg')],
    sourceSlides: [10],
  },
  {
    id: 7,
    slug: 'sidi-benour-50-housing',
    title: '50 Free Promotional Housing Units',
    menuTitle: 'Sidi Benour',
    chapterLabel: 'Completed',
    location: 'Sidi Benour, Algiers',
    status: 'completed',
    summary: 'Structural works for 50 free promotional housing units in Sidi Benour, Algiers.',
    details: 'A structural delivery package focused on the core build-out of a free promotional housing programme.',
    scope: 'Residential structural works with phased on-site execution.',
    coverLines: ['Sidi Benour', '50 Housing Units'],
    images: [media('image31.jpeg'), media('image32.jpeg'), media('image33.jpeg'), media('image34.jpeg')],
    sourceSlides: [11],
  },
  {
    id: 8,
    slug: 'dely-brahim-240-housing',
    title: '240 Free Promotional Housing with Commercial Areas',
    menuTitle: 'Dely Brahim',
    chapterLabel: 'Current',
    location: 'Dely Brahim, Algiers',
    status: 'current',
    summary: 'Construction work in all secondary state bodies with roads and networks for 240 free promotional housing units: homes from the 3rd to the 33rd floor, 8 homes per floor, 3 commercial levels with terrace, 3 basements and 3 parking entre-sols.',
    details: 'An ongoing mixed-use residential tower with 240 homes, 8 homes per floor from the 3rd to the 33rd floor, three commercial levels with terrace, three basements and three parking entre-sols.',
    scope: '240 homes, three commercial levels with terrace, three basement levels, three parking entre-sols, roads and networks.',
    coverLines: ['Dely Brahim', '240 Housing'],
    images: [media('image6.jpeg'), media('image35.jpeg'), media('image36.jpeg')],
    sourceSlides: [13],
  },
  {
    id: 9,
    slug: 'bas-mazagran-200-38-housing',
    title: '200 Assisted Housing and 38 Free Promotional Housing Units',
    menuTitle: 'Bas Mazagran',
    chapterLabel: 'Current',
    location: 'Bas Mazagran, Mostaganem',
    status: 'current',
    summary: 'Delivery-phase construction of 200 assisted promotional housing units and 38 free promotional housing units with commercial premises, roads, and networks in the seaside Bas Mazagran programme in Mostaganem.',
    details: 'A seaside residential programme in delivery phase, balancing assisted and free promotional units with accompanying commercial uses and site networks.',
    scope: 'Delivery-phase seaside housing programme with commercial premises, roads, networks and exterior works.',
    coverLines: ['Bas Mazagran', '200 + 38 Housing'],
    images: [media('image37.jpeg'), media('image38.jpeg'), media('image39.jpeg')],
    sourceSlides: [14],
  },
  {
    id: 10,
    slug: 'reghaia-bouraada-250-housing',
    title: '250 Housing Units with Commercial Rental and Concierge Services',
    menuTitle: 'Reghaia',
    chapterLabel: 'Current',
    location: 'Bouraada Site, Reghaia, Algiers Province',
    status: 'current',
    summary: 'Construction work for the remaining 250 housing units intended for commercial rental sale, with premises for commercial use and concierge services at the Bouraada site in Reghaia.',
    details: 'An ongoing housing delivery combining rental-sale residential stock with commercial premises and concierge services.',
    scope: 'Housing completion with commercial-use premises and concierge support spaces.',
    coverLines: ['Reghaia', '250 Housing'],
    images: [media('image43.jpeg'), media('image44.jpeg'), media('image45.jpeg'), media('image40.jpeg')],
    sourceSlides: [15, 16],
  },
  {
    id: 11,
    slug: 'boudouaou-70-10-housing',
    title: '70 Assisted Housing and 10 Free Promotional Housing Units',
    menuTitle: 'Boudouaou',
    chapterLabel: 'Current',
    location: 'Boudouaou, Boumerdes',
    status: 'current',
    summary: 'Realisation of 70 assisted promotional housing units and 10 free promotional housing units with 10 professional and commercial premises, including roads and networks, in Boudouaou.',
    details: 'A live mixed programme that combines residential delivery with commercial and professional premises in one coordinated site package.',
    scope: 'Housing, professional premises, commercial spaces, roads, and networks.',
    coverLines: ['Boudouaou', '70 + 10 Housing'],
    images: [media('image46.jpeg'), media('image47.jpeg'), media('image48.jpeg'), media('image49.jpeg')],
    sourceSlides: [17, 18],
  },
];

type ProjectLocalizedCopy = {
  title: LocalizedString;
  cardTitle?: LocalizedString;
  shortTitle: LocalizedString;
  status: LocalizedString;
  scope: LocalizedString;
  summary: LocalizedString;
};

const projectCopy: Record<string, ProjectLocalizedCopy> = {
  'douaouda-300-500-housing': {
    title: {
      en: '300/500 Assisted Promotional Housing',
      fr: '300/500 logements LPA à Douaouda',
      dz: '300/500 سكن ترقوي مدعّم في دواودة',
      tr: '300/500 Destekli Konut (LPA)',
    },
    shortTitle: { en: 'Douaouda Housing', fr: 'Logements Douaouda', dz: 'سكنات دواودة', tr: 'Douaouda Konutları' },
    status: { en: 'Completed', fr: 'Livré', dz: 'مكمّل', tr: 'Tamamlandı' },
    scope: {
      en: 'Residential delivery with coordinated supporting works and site infrastructure.',
      fr: 'Réalisation résidentielle avec travaux d’accompagnement et infrastructures de site coordonnées.',
      dz: 'إنجاز سكني مع الأشغال المرافقة والبنية التحتية للورشة بتنسيق كامل.',
      tr: 'Konutların altyapı ve çevre düzenleme işleriyle birlikte yapımı.',
    },
    summary: {
      en: 'Construction works for all secondary state bodies in the 300/500 LPA programme in Douaouda, with 300 homes delivered within the 500-home programme.',
      fr: 'Travaux de tous corps d’état secondaires pour le programme de 300/500 logements promotionnels aidés à Douaouda.',
      dz: 'أشغال كل الهيئات الثانوية ضمن برنامج 300/500 سكن ترقوي مدعم في دواودة.',
      tr: "Douaouda'daki 500 konutluk LPA programının tamamlanan 300 konutluk etabında tüm ince inşaat işleri.",
    },
  },
  'sidi-abdallah-200-1200-housing': {
    title: { en: '200/1200 Promotional Public Housing', fr: '200/1 200 logements LPP à Sidi Abdallah', dz: '200/1200 سكنات ترقوية عمومية', tr: '200/1200 Kamu Konutu (LPP)' },
    shortTitle: { en: 'Sidi Abdallah', fr: 'Sidi Abdallah', dz: 'سيدي عبد الله', tr: 'Sidi Abdallah' },
    status: { en: 'Completed', fr: 'Livré', dz: 'مكمّل', tr: 'Tamamlandı' },
    scope: { en: 'Large-scale public housing with integrated construction support packages.', fr: 'Programme public de grande échelle avec lots d’accompagnement intégrés.', dz: 'برنامج سكن عمومي كبير مع حزم دعم البناء مدمجة.', tr: 'Büyük ölçekli kamu konutlarının altyapı ve destekleyici tüm işleriyle yapımı.' },
    summary: { en: 'Construction works for all secondary state bodies within the 200/1200 promotional public housing development in Sidi Abdallah - Mahalma.', fr: 'Travaux de tous corps d’état secondaires du programme 200/1 200 logements promotionnels publics à Sidi Abdallah - Mahalma.', dz: 'أشغال الهيئات الثانوية لبرنامج 200/1200 سكن ترقوي عمومي في سيدي عبد الله - محالمة.', tr: "Sidi Abdallah - Mahalma'daki 200/1200 Kamu Konutu (LPP) projesinin tüm ince inşaat işleri." },
  },
  'staoueli-11-41-villas': {
    title: { en: '11/41 Villas and Network Works', fr: '11/41 villas à Staoueli - CES et VRD', dz: '11/41 فيلا وأشغال الشبكات', tr: '11/41 Villa ve Altyapı İşleri' },
    shortTitle: { en: 'Staoueli Villas', fr: 'Villas Staoueli', dz: 'فيلات سطاوالي', tr: 'Staoueli Villaları' },
    status: { en: 'Completed', fr: 'Livré', dz: 'مكمّل', tr: 'Tamamlandı' },
    scope: { en: 'Residential villas plus roads, utility networks, and coordinated site infrastructure.', fr: 'Villas résidentielles avec voiries, réseaux divers et infrastructure de site coordonnée.', dz: 'فيلات سكنية مع الطرقات، الشبكات والبنية التحتية للورشة.', tr: 'Villaların yanı sıra yol, altyapı şebekeleri ve çevre düzenleme işlerinin yapımı.' },
    summary: { en: 'Construction work in all secondary state bodies, including various road and network works for the 11/41 villas project in Staoueli.', fr: "Travaux de tous corps d'état secondaires et VRD pour le projet de 11/41 villas à Staoueli.", dz: 'أشغال كل الهيئات الثانوية مع الطرقات والشبكات لمشروع 11/41 فيلا في سطاوالي.', tr: "Staoueli'deki 11/41 villa projesinin yol, altyapı şebekeleri ve tüm ikincil inşaat işleri." },
  },
  rahmania: {
    title: { en: 'Rahmania Commercial Centres', fr: 'Centres commerciaux Rahmania', dz: 'مراكز رحمانية التجارية', tr: 'Rahmania Ticaret Merkezleri' },
    shortTitle: { en: 'Rahmania', fr: 'Rahmania', dz: 'رحمانية', tr: 'Rahmania' },
    status: { en: 'Completed', fr: 'Livré', dz: 'مكمّل', tr: 'Tamamlandı' },
    scope: { en: 'Two commercial centres with retail, service spaces, circulation, and finishing works integrated into a larger housing masterplan.', fr: 'Deux centres commerciaux, incluant commerces, services, espaces de circulation et travaux de finition, intégrés à un vaste programme résidentiel.', dz: 'زوج مراكز تجارية بمحلات، خدمات، حركة داخلية وتشطيبات داخل برنامج سكني كبير.', tr: 'Geniş kapsamlı bir konut yerleşimi projesi dahilinde, perakende ve hizmet birimleri, ortak kullanım alanları ile ince işleri tamamlanmış iki ticaret merkezi.' },
    summary: { en: "Two commercial centres completed as part of Douira's 2,500-home residential development.", fr: 'Deux centres commerciaux livrés dans le programme résidentiel de 2 500 logements à Douira.', dz: 'زوج مراكز تجارية تكمّلو ضمن برنامج 2500 سكن في دويرة.', tr: "Douira'daki 2.500 konutluk yerleşim projesi kapsamında tamamlanan iki ticaret merkezi." },
  },
  'said-hamdine-mixed-real-estate': {
    title: { en: 'Mixed Real Estate Complex with 202 Free Promotional Housing', fr: 'Ensemble immobilier mixte de 202 logements LPL à Saïd Hamdine', dz: 'مجمع عقاري مختلط مع 202 سكن ترقوي حر', tr: '202 Serbest Satışlı Konutluk Karma Gayrimenkul Projesi' },
    shortTitle: { en: 'Said Hamdine', fr: 'Saïd Hamdine', dz: 'سعيد حمدين', tr: 'Said Hamdine' },
    status: { en: 'Completed', fr: 'Livré', dz: 'مكمّل', tr: 'Tamamlandı' },
    scope: { en: 'Five-block mixed real estate delivery with housing, one basement parking level, and three commercial entre-sols with mezzanine.', fr: 'Ensemble immobilier mixte de cinq blocs, comprenant des logements, un sous-sol de parking et trois entre-sols commerciaux avec mezzanine.', dz: 'إنجاز عقاري مختلط من خمسة بلوكات مع سكنات، وطابق سفلي واحد لمواقف السيارات، وثلاثة طوابق تجارية نصفية مع ميزانين.', tr: 'Beş bloklu karma proje: konutlar, bir bodrum otopark katı ve asma katlı üç ticari entre-sol.' },
    summary: { en: 'Construction work in all secondary state bodies for a mixed real estate complex of 5 blocks and 202 free promotional housing units on a steeply sloping site, with one basement parking level and three commercial entre-sols with mezzanine.', fr: "Réalisation des travaux de tous corps d'état secondaires pour un ensemble immobilier mixte de 5 blocs et 202 logements LPL sur un terrain à forte pente, avec un sous-sol de parking et trois entre-sols commerciaux avec mezzanine.", dz: 'أشغال الهيئات الثانوية لمجمع مختلط من 5 بلوكات و202 سكن ترقوي حر على أرضية شديدة الانحدار، مع طابق سفلي لمواقف السيارات وثلاثة طوابق تجارية نصفية مع ميزانين.', tr: 'Eğimli bir arazide yer alan beş bloklu karma projenin tüm ince işleri: 202 serbest satışlı konut, bir bodrum otoparkı ve asma katlı üç ticari entre-sol.' },
  },
  'rouiba-4-promotional-villas': {
    title: { en: '4 Promotional Villas and Network Works', fr: '4 villas promotionnelles à Rouiba — VRD', dz: '4 فيلات ترقوية وأشغال الشبكات', tr: '4 Adet Villa ve Altyapı Çalışmaları' },
    shortTitle: { en: 'Rouiba Villas', fr: 'Villas Rouiba', dz: 'فيلات الرويبة', tr: 'Rouiba Villaları' },
    status: { en: 'Completed', fr: 'Livré', dz: 'مكمّل', tr: 'Tamamlandı' },
    scope: { en: 'Promotional villas delivered with road and network packages.', fr: 'Villas promotionnelles avec voirie et réseaux', dz: 'فيلات ترقوية مسلّمة مع حزم الطرقات والشبكات.', tr: 'Yol ve altyapısı tamamlanmış serbest satışlı villalar' },
    summary: { en: 'Construction work in all secondary state bodies, including various roads and network works for 4 promotional villas in Rouiba.', fr: 'Réalisation des travaux de second œuvre, voirie et réseaux pour 4 villas promotionnelles à Rouiba.', dz: 'أشغال الهيئات الثانوية، الطرقات والشبكات لأربع فيلات ترقوية في الرويبة.', tr: "Rouiba'daki 4 serbest satışlı villanın ince işleri, yol ve altyapı şebekelerinin yapımı" },
  },
  'sidi-benour-50-housing': {
    title: { en: '50 Free Promotional Housing Units', fr: '50 logements LPL à Sidi Benour', dz: '50 سكن ترقوي حر', tr: '50 Adet Serbest Satışlı Konut' },
    shortTitle: { en: 'Sidi Benour', fr: 'Sidi Benour', dz: 'سيدي بنور', tr: 'Sidi Benour' },
    status: { en: 'Completed', fr: 'Livré', dz: 'مكمّل', tr: 'Tamamlandı' },
    scope: { en: 'Residential structural works with phased on-site execution.', fr: 'Gros œuvre résidentiel, phasé', dz: 'أشغال هيكلية سكنية بتنفيذ مرحلي في الورشة.', tr: 'Konutların kaba inşaat işlerinin sahada etaplar halinde yapımı' },
    summary: { en: 'Structural works for 50 free promotional housing units in Sidi Benour, Algiers.', fr: 'Travaux de structure pour 50 logements promotionnels libres à Sidi Benour, Alger.', dz: 'أشغال الهيكل لـ50 سكن ترقوي حر في سيدي بنور، الجزائر.', tr: "Cezayir'in Sidi Benour bölgesindeki 50 serbest satışlı konutun kaba inşaat işleri" },
  },
  'dely-brahim-240-housing': {
    title: { en: '240 Free Promotional Housing with Commercial Areas', fr: '240 logements LPL et commerces à Dely Brahim', dz: '240 سكن ترقوي حر مع محلات تجارية', tr: '240 Serbest Satışlı Konut ve Ticari Alanlar' },
    shortTitle: { en: 'Dely Brahim', fr: 'Dely Brahim', dz: 'دالي إبراهيم', tr: 'Dely Brahim' },
    status: { en: 'Current', fr: 'En cours', dz: 'في طور الإنجاز', tr: 'Devam Ediyor' },
    scope: { en: '240 homes, three commercial levels with terrace, three basement levels, three parking entre-sols, roads and networks.', fr: '240 logements, trois niveaux commerciaux avec terrasse, trois sous-sols, trois entre-sols de parking, voiries et réseaux.', dz: '240 وحدة سكنية، ثلاثة طوابق تجارية مع شرفة، ثلاثة طوابق سفلية، وثلاثة طوابق نصفية لمواقف السيارات، مع الطرق والشبكات.', tr: '240 konut; teraslı üç ticari kat, üç bodrum, üç otopark entre-solu, yollar ve altyapı.' },
    summary: { en: 'Construction work in all secondary state bodies with roads and networks for 240 free promotional homes: homes from the 3rd to the 33rd floor, 8 homes per floor, three commercial levels with terrace, three basements and three parking entre-sols.', fr: "Travaux tous corps d'état pour 240 logements promotionnels libres : logements du 3e au 33e étage, 8 logements par étage, trois niveaux commerciaux avec terrasse, trois sous-sols et trois entre-sols de parking.", dz: 'أشغال الهيئات الثانوية مع الطرقات والشبكات لـ240 سكن ترقوي حر: السكنات من الطابق الثالث إلى الطابق 33، بواقع 8 سكنات في كل طابق، وثلاثة طوابق تجارية مع شرفة، وثلاثة طوابق سفلية وثلاثة طوابق نصفية لمواقف السيارات.', tr: '240 serbest satışlı konutun tüm ince işleri: konutlar 3. kattan 33. kata kadar, her katta 8 daire; teraslı üç ticari kat, üç bodrum ve üç otopark entre-solu.' },
  },
  'bas-mazagran-200-38-housing': {
    title: { en: '200 Assisted Housing and 38 Free Promotional Housing Units', fr: '200 logements LPA et 38 logements LPL à Bas Mazagran', dz: '200 سكن مدعم و38 سكن ترقوي حر', tr: '200 Destekli Konut (LPA) ve 38 Serbest Satışlı Konut (LPL)' },
    shortTitle: { en: 'Bas Mazagran', fr: 'Bas Mazagran', dz: 'باس مزغران', tr: 'Bas Mazagran' },
    status: { en: 'Delivery phase', fr: 'En phase de livraison', dz: 'في مرحلة التسليم', tr: 'Teslim aşamasında' },
    scope: { en: 'Delivery-phase seaside housing programme with commercial premises, roads, networks and exterior works.', fr: 'Programme résidentiel balnéaire en phase de livraison, avec locaux commerciaux, voiries, réseaux et aménagements extérieurs.', dz: 'برنامج سكني ساحلي في مرحلة التسليم، مع محلات وطرقات وشبكات وتهيئة خارجية.', tr: 'Ticari alanlar, yollar, altyapı ve çevre düzenlemesi içeren, teslim aşamasındaki sahil konut projesi.' },
    summary: { en: 'Delivery-phase construction of 200 assisted promotional housing units and 38 free promotional housing units with commercial premises, roads, and networks in the seaside Bas Mazagran programme in Mostaganem.', fr: 'Construction en phase de livraison de 200 logements promotionnels aidés et 38 logements promotionnels libres, avec locaux commerciaux, voiries et réseaux, dans le programme balnéaire de Bas Mazagran à Mostaganem.', dz: 'إنجاز 200 سكن ترقوي مدعم و38 سكن ترقوي حر مع محلات وطرقات وشبكات، ضمن البرنامج الساحلي لباس مزغران في مستغانم، وهو في مرحلة التسليم.', tr: "Mostaganem'deki sahil projesi Bas Mazagran'da, 200 destekli (LPA) ve 38 serbest satışlı (LPL) konutun ticari alanlar, yollar ve altyapıyla birlikte teslim süreci yürütülüyor." },
  },
  'reghaia-bouraada-250-housing': {
    title: { en: '250 Housing Units with Commercial Rental and Concierge Services', fr: '250 logements, locaux commerciaux et conciergeries à Bouraada, Reghaïa', dz: '250 سكن مع محلات للكراء وخدمات كونسيرج', tr: 'Kira-Satış Modelli 250 Konut, Ticari Alanlar ve Danışma Hizmetleri' },
    shortTitle: { en: 'Reghaia', fr: 'Reghaia', dz: 'الرغاية', tr: 'Reghaia' },
    status: { en: 'Current', fr: 'En cours', dz: 'في طور الإنجاز', tr: 'Devam Ediyor' },
    scope: { en: 'Housing completion with commercial-use premises and concierge support spaces.', fr: 'Achèvement de logements avec locaux commerciaux et espaces de conciergerie.', dz: 'إكمال السكنات مع محلات تجارية ومساحات كونسيرج.', tr: 'Ticari kullanıma yönelik alanlar ve danışma birimleri ile birlikte konut inşaatının tamamlanması.' },
    summary: { en: 'Construction work for the remaining 250 housing units intended for commercial rental sale, with premises for commercial use and concierge services at the Bouraada site in Reghaia.', fr: 'Travaux pour les 250 logements restants destinés à la location-vente commerciale, incluant locaux commerciaux et conciergeries, sur le site Bouraada à Reghaïa.', dz: 'أشغال 250 سكن الباقية موجهة للبيع بالإيجار التجاري، مع محلات وخدمات كونسيرج في موقع بوراعدة بالرغاية.', tr: "Reghaia'daki Bouraada şantiyesinde, kira-satış amaçlı 250 konutun, ticari alanların ve danışma hizmetlerinin kalan imalatlarının tamamlanması." },
  },
  'boudouaou-70-10-housing': {
    title: { en: '70 Assisted Housing and 10 Free Promotional Housing Units', fr: '70 logements LPA et 10 logements LPL à Boudouaou', dz: '70 سكن مدعم و10 سكنات ترقوية حرة', tr: '70 Destekli Konut (LPA) ve 10 Serbest Satışlı Konut (LPL)' },
    shortTitle: { en: 'Boudouaou', fr: 'Boudouaou', dz: 'بودواو', tr: 'Boudouaou' },
    status: { en: 'Current', fr: 'En cours', dz: 'في طور الإنجاز', tr: 'Devam ediyor' },
    scope: { en: 'Housing, professional premises, commercial spaces, roads, and networks.', fr: 'Logements, locaux professionnels, espaces commerciaux, voiries et réseaux.', dz: 'سكنات، محلات مهنية، فضاءات تجارية، طرقات وشبكات.', tr: 'Konutlar, mesleki kullanım alanları, ticari mekanlar, yollar ve altyapı şebekeleri.' },
    summary: { en: 'Realisation of 70 assisted promotional housing units and 10 free promotional housing units with 10 professional and commercial premises, including roads and networks, in Boudouaou.', fr: 'Réalisation de 70 logements promotionnels aidés et 10 logements promotionnels libres, avec 10 locaux professionnels et commerciaux, voiries et réseaux à Boudouaou.', dz: 'إنجاز 70 سكن ترقوي مدعم و10 سكنات ترقوية حرة مع 10 محلات مهنية وتجارية، طرقات وشبكات في بودواو.', tr: "Boudouaou'da, 10 adet mesleki ve ticari alan ile yol ve altyapı şebekelerini de içeren 70 destekli konut (LPA) ve 10 serbest satışlı konut (LPL) projesinin inşası." },
  },
};

export function localizedProjectTitle(project: ProjectRecord, locale: Locale) {
  const canonical = getProjectPage<Record<string, unknown>>(project.slug, locale).content;
  return typeof canonical.title === 'string'
    ? canonical.title
    : pickLocaleText(locale, projectCopy[project.slug]?.title ?? { en: project.title, fr: project.menuTitle });
}

export function localizedProjectCardTitle(project: ProjectRecord, locale: Locale) {
  const custom = projectCopy[project.slug]?.cardTitle;
  if (custom) return pickLocaleText(locale, custom);

  const title = localizedProjectTitle(project, locale);
  const locality = (project.location || '').split(',')[0]?.trim() || project.location;
  if (!locality) return title;
  const normalizeForMatch = (value: string) => value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase();
  const normalizedTitle = normalizeForMatch(title);
  const localityParts = locality
    .split(/\s+[—-]\s+/)
    .map((part) => normalizeForMatch(part.trim()))
    .filter((part) => part.length > 2);
  if (localityParts.some((part) => normalizedTitle.includes(part))) return title;

  if (locale === 'fr') return `${title} - ${locality}`;
  if (locale === 'tr') return `${locality} / ${title}`;
  if (locale === 'ar-DZ') return `${title} - ${locality}`;
  return `${title} - ${locality}`;
}

export function localizedProjectShortTitle(project: ProjectRecord, locale: Locale) {
  return pickLocaleText(locale, projectCopy[project.slug]?.shortTitle ?? { en: project.menuTitle, fr: project.menuTitle });
}

export function localizedProjectStatus(project: ProjectRecord, locale: Locale) {
  return pickLocaleText(locale, projectCopy[project.slug]?.status ?? { en: project.chapterLabel });
}

export function localizedProjectScope(project: ProjectRecord, locale: Locale) {
  const canonical = getProjectPage<Record<string, unknown>>(project.slug, locale).content;
  if (Array.isArray(canonical.description)) return canonical.description.filter((value): value is string => typeof value === 'string').join(' ');
  return pickLocaleText(locale, projectCopy[project.slug]?.scope ?? { en: project.scope });
}

export function localizedProjectSummary(project: ProjectRecord, locale: Locale) {
  const canonical = getProjectPage<Record<string, unknown>>(project.slug, locale).content;
  if (Array.isArray(canonical.summary)) return canonical.summary.filter((value): value is string => typeof value === 'string').join(' ');
  return pickLocaleText(locale, projectCopy[project.slug]?.summary ?? { en: project.summary });
}

export const heroSlides = [
  {
    image: media('image2.jpeg'),
    caption: 'Said Hamdine',
  },
  {
    image: media('image4.jpeg'),
    caption: 'Said Hamdine',
  },
  {
    image: media('image21.jpeg'),
    caption: 'Rahmania',
  },
  {
    image: media('image22.jpeg'),
    caption: 'Said Hamdine',
  },
  {
    image: media('image27.jpeg'),
    caption: 'Rouiba Villas',
  },
];

export const homeProjectCards = projects;

export const imageSliderImages = [
  '/homepage/company-profile-showcase.png',
  '/projects/dely-brahim-240-housing/04-final-4.webp',
  '/projects/dely-brahim-240-housing/01-final-1.webp',
  '/projects/dely-brahim-240-housing/03-final-3.webp',
  '/projects/dely-brahim-240-housing/02-final-2.webp',
];
