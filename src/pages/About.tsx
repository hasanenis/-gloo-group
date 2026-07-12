import { lazy, Suspense } from 'react';
import { ArrowRight, BadgeCheck, Building2, MapPin, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { companyProfile, projects, type ProjectRecord } from '../data/projects';
import { localize, type HomepageText } from '../data/homepageContent';
import { pickLocaleText, useLocale, type Locale, type LocalizedString } from '../i18n';
import { usePageContent } from '../content';

const Footer = lazy(() => import('../components/Footer'));

const LEAD_IMAGE = '/projects/said-hamdine-mixed-real-estate/hero.webp';

type Capability = {
  title: HomepageText;
  body: HomepageText;
  projectSlug: string;
};

type ShowcaseItem = {
  image: string;
  project: ProjectRecord;
};

const facts = [
  {
    value: { en: '2018', fr: '2018', dz: '2018', tr: '2018' },
    label: { en: 'Established in Algiers', fr: 'Fondée à Alger', dz: 'تأسست في الجزائر', tr: "Cezayir'de kuruldu" },
  },
  {
    value: { en: 'Category 6', fr: 'Catégorie 6', dz: 'الفئة 6', tr: 'Kategori 6' },
    label: { en: 'Professional classification', fr: 'Classification professionnelle', dz: 'التصنيف المهني', tr: 'Mesleki sınıflandırma' },
  },
  {
    value: { en: String(projects.length), fr: String(projects.length), dz: String(projects.length), tr: String(projects.length) },
    label: { en: 'Projects in the portfolio', fr: 'Projets au portefeuille', dz: 'المشاريع في سجل الأعمال', tr: 'Portföydeki proje' },
  },
  {
    value: { en: '4', fr: '4', dz: '4', tr: '4' },
    label: { en: 'Wilayas represented', fr: 'Wilayas représentées', dz: 'الولايات المشمولة', tr: 'Çalışılan vilayet' },
  },
] satisfies Array<{ value: HomepageText; label: HomepageText }>;

const capabilities: Capability[] = [
  {
    title: { en: 'Residential construction', fr: 'Construction résidentielle', dz: 'البناء السكني', tr: 'Konut yapımı' },
    body: {
      en: 'Housing programmes, apartment buildings and villas delivered from structure through finishing works.',
      fr: 'Programmes de logements, immeubles et villas réalisés de la structure jusqu’aux finitions.',
      dz: 'مشاريع سكنية وعمارات وفيلات من الهيكل إلى التشطيبات.',
      tr: 'Apartman ve villa projelerinde taşıyıcı sistemden ince işlere kadar tüm yapım süreci.',
    },
    projectSlug: 'rouiba-4-promotional-villas',
  },
  {
    title: { en: 'Mixed-use programmes', fr: 'Programmes mixtes', dz: 'المشاريع متعددة الاستخدامات', tr: 'Karma kullanım projeleri' },
    body: {
      en: 'Residential blocks coordinated with commercial floors, parking and the services that support daily use.',
      fr: 'Blocs résidentiels coordonnés avec commerces, stationnement et services nécessaires à l’usage quotidien.',
      dz: 'مبانٍ سكنية مع طوابق تجارية ومواقف وخدمات يومية.',
      tr: 'Konut bloklarıyla birlikte planlanan ticari katlar, otoparklar ve günlük hizmet alanları.',
    },
    projectSlug: 'said-hamdine-mixed-real-estate',
  },
  {
    title: { en: 'Roads and utility networks', fr: 'Voiries et réseaux', dz: 'الطرقات والشبكات', tr: 'Yol ve altyapı şebekeleri' },
    body: {
      en: 'Site access, external works and network packages planned as part of the complete construction scope.',
      fr: 'Accès, aménagements extérieurs et lots réseaux planifiés dans le périmètre global des travaux.',
      dz: 'مداخل الموقع والأشغال الخارجية وشبكات البنية التحتية ضمن نطاق البناء.',
      tr: 'Saha ulaşımı, çevre düzenlemesi ve altyapı şebekelerinin yapım işiyle birlikte planlanması.',
    },
    projectSlug: 'staoueli-11-41-villas',
  },
  {
    title: { en: 'Coordinated site delivery', fr: 'Exécution de chantier coordonnée', dz: 'تنسيق أعمال الورشة', tr: 'Koordineli şantiye yönetimi' },
    body: {
      en: 'Engineering, quantities, procurement and field teams connected through one accountable delivery structure.',
      fr: 'Ingénierie, quantités, achats et équipes terrain réunis dans une structure de livraison responsable.',
      dz: 'تنسيق الهندسة والكميات والمشتريات وفرق الميدان ضمن إدارة واحدة.',
      tr: 'Mühendislik, metraj, satın alma ve saha ekiplerinin tek yönetim altında koordinasyonu.',
    },
    projectSlug: 'bas-mazagran-200-38-housing',
  },
];

const showcaseDefinitions = [
  {
    slug: 'said-hamdine-mixed-real-estate',
    image: '/projects/said-hamdine-mixed-real-estate/hero.webp',
  },
  {
    slug: 'rouiba-4-promotional-villas',
    image: '/projects/rouiba-4-promotional-villas/wide.webp',
  },
  {
    slug: 'bas-mazagran-200-38-housing',
    image: '/projects/bas-mazagran-200-38-housing/wide.webp',
  },
];

const showcaseProjects = showcaseDefinitions.flatMap<ShowcaseItem>((item) => {
  const project = projects.find((candidate) => candidate.slug === item.slug);
  return project ? [{ project, image: item.image }] : [];
});

const copyFor = (locale: Locale, value: LocalizedString) => pickLocaleText(locale, value);

function getCopy(locale: Locale) {
  return {
    eyebrow: copyFor(locale, { en: 'Company', fr: 'Entreprise', dz: 'الشركة', tr: 'Kurumsal' }),
    heroLead: copyFor(locale, {
      en: 'An Algiers-based construction company delivering residential, mixed-use, road and network works across Algeria.',
      fr: 'Entreprise de construction basée à Bir Khadem, spécialisée dans les programmes résidentiels, mixtes, les voiries et les réseaux en Algérie.',
      dz: 'شركة بناء مقرها في بئر خادم، تنجز برامج سكنية ومختلطة، طرقات وشبكات عبر الجزائر.',
      tr: 'Cezayir genelinde konut, karma kullanım, yol ve altyapı projeleri yürüten bir inşaat şirketi.',
    }),
    contact: copyFor(locale, { en: 'Contact the team', fr: 'Contacter l’équipe', dz: 'تواصل مع الفريق', tr: 'Ekiple iletişime geç' }),
    imageCaption: copyFor(locale, {
      en: 'Mixed real estate complex, Said Hamdine, Algiers',
      fr: 'Complexe immobilier mixte, Saïd Hamdine, Alger',
      dz: 'مجمع عقاري مختلط، سعيد حمدين، الجزائر',
      tr: 'Karma gayrimenkul kompleksi, Said Hamdine, Cezayir',
    }),
    profileLabel: copyFor(locale, { en: 'Company profile', fr: 'Profil entreprise', dz: 'تعريف بالشركة', tr: 'Şirket profili' }),
    profileTitle: copyFor(locale, {
      en: 'A technical team organised around the work on site.',
      fr: 'Une structure technique organisée autour du chantier.',
      dz: 'فريق تقني منظم حول خدمة الورشة.',
      tr: 'Şantiye işleyişi etrafında organize olmuş teknik ekip.',
    }),
    profileParagraphs: [
      copyFor(locale, {
        en: 'Founded in 2018 and managed by civil engineer Adem Talay, SARL Igloo Yapi Construction delivers building projects within a clear technical and regulatory framework.',
        fr: 'Fondée en 2018 et dirigée par l’ingénieur civil Adem Talay, SARL Igloo Yapi Construction réalise des projets de bâtiment dans un cadre technique et réglementaire clair.',
        dz: 'تأسست في 2018 وتسيرها المهندس المدني آدم تالاي، SARL Igloo Yapi Construction تنجز مشاريع بناء بإطار تقني وتنظيمي واضح.',
        tr: '2018’de kurulan SARL Igloo Yapi Construction, inşaat mühendisi Adem Talay yönetiminde teknik ve yasal gerekliliklere uygun yapı projeleri yürütür.',
      }),
      copyFor(locale, {
        en: 'Engineers, architects, construction managers, procurement and site teams work as one structure, from preparation through handover.',
        fr: 'Ingénieurs, architectes, conducteurs de travaux, achats et équipes de chantier travaillent comme une seule structure, de la préparation jusqu’à la livraison.',
        dz: 'المهندسين، المعماريين، مسؤولي الأشغال، الشراء وفرق الورشة يخدمو كهيكل واحد من التحضير حتى التسليم.',
        tr: 'Mühendisler, mimarlar, saha şefleri, satın alma ve şantiye ekipleri hazırlıktan teslime kadar tek yapı gibi çalışır.',
      }),
    ],
    qualificationLabel: copyFor(locale, { en: 'Qualification', fr: 'Qualification', dz: 'التأهيل', tr: 'Yeterlilik' }),
    teamLabel: copyFor(locale, { en: 'Team structure', fr: 'Structure de l’équipe', dz: 'هيكلة الفريق', tr: 'Ekip yapısı' }),
    capabilitiesLabel: copyFor(locale, { en: 'What we deliver', fr: 'Domaines d’intervention', dz: 'وش نقدمو', tr: 'Teslim ettiğimiz işler' }),
    capabilitiesTitle: copyFor(locale, {
      en: 'The scope is defined by the project, not a generic list of services.',
      fr: 'Le périmètre est défini par le projet, pas par une liste générique de services.',
      dz: 'نطاق الخدمة يتحدد حسب المشروع، ماشي بقائمة خدمات عامة.',
      tr: 'Kapsamı genel bir hizmet listesi değil, projenin kendisi belirler.',
    }),
    exampleProject: copyFor(locale, { en: 'Reference project', fr: 'Projet de référence', dz: 'مشروع مرجعي', tr: 'Referans proje' }),
    workLabel: copyFor(locale, { en: 'Selected work', fr: 'Travaux sélectionnés', dz: 'أعمال مختارة', tr: 'Seçili işler' }),
    workTitle: copyFor(locale, {
      en: 'Completed projects and work currently on site.',
      fr: 'Des projets livrés et des chantiers en cours.',
      dz: 'مشاريع تسلمت وورشات مازالت خدامة.',
      tr: 'Tamamlanan projeler ve sahada devam eden işler.',
    }),
    completed: copyFor(locale, { en: 'Completed', fr: 'Livré', dz: 'مكمّل', tr: 'Tamamlandı' }),
    current: copyFor(locale, { en: 'In progress', fr: 'En cours', dz: 'في طور الإنجاز', tr: 'Devam ediyor' }),
    allProjects: copyFor(locale, { en: 'View all projects', fr: 'Voir tous les projets', dz: 'شوف كل المشاريع', tr: 'Tüm projeleri görüntüle' }),
  };
}

function SectionFallback({ minHeight = '20rem' }: { minHeight?: string }) {
  return <div aria-hidden="true" className="bg-white" style={{ minHeight }} />;
}

function AboutIntro() {
  const { locale } = useLocale();
  const copy = getCopy(locale);

  return (
    <>
      <section className="bg-white px-5 pb-12 pt-36 text-[#111] md:px-10 md:pb-16 md:pt-44 xl:px-16">
        <div className="mx-auto max-w-[1500px]">
          <p className="text-[14px] font-semibold text-[#c22026]">{copy.eyebrow}</p>

          <div className="mt-7 grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)] lg:items-end">
            <h1 className="max-w-[980px] font-nav text-[48px] font-semibold leading-[0.98] tracking-normal sm:text-[58px] md:text-[68px] lg:text-[76px] xl:text-[88px]">
              {companyProfile.name}
            </h1>

            <div className="pb-1">
              <p className="max-w-[42ch] text-[17px] leading-[1.7] text-black/66 md:text-[19px]">
                {copy.heroLead}
              </p>
              <Link
                to="/contact"
                className="mt-7 inline-flex min-h-11 items-center gap-2 border-b border-black pb-1 text-[14px] font-semibold text-black transition-colors hover:border-[#c22026] hover:text-[#c22026]"
              >
                {copy.contact}
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
            </div>
          </div>

          <dl className="mt-14 grid border-y border-black/14 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label.en} className="border-b border-black/10 py-5 sm:px-5 sm:first:pl-0 lg:border-b-0 lg:border-r lg:last:border-r-0">
                <dt className="text-[13px] leading-[1.45] text-black/50">{localize(fact.label, locale)}</dt>
                <dd className="mt-2 text-[25px] font-semibold leading-none text-black">{localize(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-white px-5 pb-16 md:px-10 md:pb-24 xl:px-16">
        <figure className="mx-auto max-w-[1500px]">
          <div className="aspect-[16/7] min-h-[330px] overflow-hidden bg-[#e9e9e7]">
            <img
              src={LEAD_IMAGE}
              alt={copy.imageCaption}
              className="h-full w-full object-cover object-center"
              loading="eager"
              decoding="async"
            />
          </div>
          <figcaption className="flex flex-col gap-1 border-b border-black/14 py-4 text-[13px] text-black/52 sm:flex-row sm:items-center sm:justify-between">
            <span>{copy.imageCaption}</span>
            <span>{copy.completed}</span>
          </figcaption>
        </figure>
      </section>
    </>
  );
}

function CompanyProfile() {
  const { locale } = useLocale();
  const copy = getCopy(locale);
  const pageContent = usePageContent<{ eyebrow: string; heading: string; body: string }>('about', locale);
  const profileParagraphs = [pageContent.content.body, copy.profileParagraphs[1]];

  return (
    <section className="bg-[#111] px-5 py-20 text-white md:px-10 md:py-28 xl:px-16">
      <div className="mx-auto grid max-w-[1500px] gap-14 lg:grid-cols-[minmax(300px,0.7fr)_minmax(0,1.3fr)] lg:gap-24">
        <div>
          <p className="text-[14px] font-semibold text-[#e82a2e]">{copy.profileLabel}</p>
          <h2 className="mt-6 max-w-[13ch] font-nav text-[38px] font-medium leading-[1.05] tracking-normal md:text-[50px] lg:text-[58px]">
            {copy.profileTitle}
          </h2>
        </div>

        <div>
          <div className="grid gap-7 text-[17px] leading-[1.8] text-white/68 md:grid-cols-2 md:text-[18px]">
            {profileParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <dl className="mt-12 border-t border-white/18">
            <div className="grid gap-4 border-b border-white/18 py-6 md:grid-cols-[200px_1fr]">
              <dt className="flex items-center gap-3 text-[14px] font-semibold text-white">
                <BadgeCheck className="h-5 w-5 text-[#e82a2e]" strokeWidth={1.8} />
                {copy.qualificationLabel}
              </dt>
              <dd className="text-[15px] leading-[1.7] text-white/62">
                {localize(companyProfile.qualificationStatement, locale)} · {localize(companyProfile.classificationBadge, locale)}
              </dd>
            </div>
            <div className="grid gap-4 border-b border-white/18 py-6 md:grid-cols-[200px_1fr]">
              <dt className="flex items-center gap-3 text-[14px] font-semibold text-white">
                <UsersRound className="h-5 w-5 text-[#e82a2e]" strokeWidth={1.8} />
                {copy.teamLabel}
              </dt>
              <dd className="text-[15px] leading-[1.7] text-white/62">
                {localize(companyProfile.teamStructure, locale)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

function Capabilities() {
  const { locale } = useLocale();
  const copy = getCopy(locale);

  return (
    <section className="bg-white px-5 py-20 text-black md:px-10 md:py-28 xl:px-16">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-8 pb-12 lg:grid-cols-[0.55fr_1fr]">
          <p className="text-[14px] font-semibold text-[#c22026]">{copy.capabilitiesLabel}</p>
          <h2 className="max-w-[25ch] font-nav text-[34px] font-medium leading-[1.08] tracking-normal md:text-[46px]">
            {copy.capabilitiesTitle}
          </h2>
        </div>

        <div className="border-b border-black/14">
          {capabilities.map((capability, index) => {
            const project = projects.find((candidate) => candidate.slug === capability.projectSlug);

            return (
              <Link
                key={capability.title.en}
                to={`/projects/${capability.projectSlug}`}
                className="group grid gap-4 border-t border-black/14 py-7 transition-colors hover:text-[#c22026] md:grid-cols-[52px_minmax(220px,0.7fr)_minmax(0,1fr)_220px_24px] md:items-start"
              >
                <span className="text-[13px] text-black/38 group-hover:text-[#c22026]/70">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-[21px] font-semibold leading-[1.25]">{localize(capability.title, locale)}</h3>
                <p className="max-w-[55ch] text-[15px] leading-[1.7] text-black/58 group-hover:text-[#c22026]/75">
                  {localize(capability.body, locale)}
                </p>
                <span className="flex items-center gap-2 text-[13px] text-black/48 group-hover:text-[#c22026]">
                  <Building2 className="h-4 w-4" strokeWidth={1.8} />
                  {project?.location ?? copy.exampleProject}
                </span>
                <ArrowRight className="hidden h-4 w-4 md:block" strokeWidth={2} />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SelectedWork() {
  const { locale } = useLocale();
  const copy = getCopy(locale);

  return (
    <section className="bg-[#f1f1ef] px-5 py-20 text-black md:px-10 md:py-28 xl:px-16">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col gap-8 border-b border-black/14 pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[14px] font-semibold text-[#c22026]">{copy.workLabel}</p>
            <h2 className="mt-5 max-w-[18ch] font-nav text-[36px] font-medium leading-[1.06] tracking-normal md:text-[50px]">
              {copy.workTitle}
            </h2>
          </div>
          <Link
            to="/projects"
            className="inline-flex min-h-11 items-center gap-2 self-start border-b border-black pb-1 text-[14px] font-semibold transition-colors hover:border-[#c22026] hover:text-[#c22026] md:self-auto"
          >
            {copy.allProjects}
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-5">
          {showcaseProjects.map(({ project, image }) => (
            <Link key={project.slug} to={`/projects/${project.slug}`} className="group block">
              <figure>
                <div className="aspect-[4/5] overflow-hidden bg-[#dededb]">
                  <img
                    src={image}
                    alt={`${project.title}, ${project.location}`}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <figcaption className="border-b border-black/14 py-4">
                  <h3 className="text-[17px] font-semibold leading-[1.35] transition-colors group-hover:text-[#c22026]">
                    {project.title}
                  </h3>
                  <div className="mt-3 flex items-center justify-between gap-4 text-[13px] text-black/48">
                    <span className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                      {project.location}
                    </span>
                    <span>{project.status === 'completed' ? copy.completed : copy.current}</span>
                  </div>
                </figcaption>
              </figure>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function About() {
  return (
    <main className="relative isolate overflow-x-hidden bg-white">
      <AboutIntro />
      <CompanyProfile />
      <Capabilities />
      <SelectedWork />
      <Suspense fallback={<SectionFallback minHeight="24rem" />}>
        <Footer />
      </Suspense>
    </main>
  );
}
