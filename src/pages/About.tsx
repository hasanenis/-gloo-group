import { lazy, Suspense, useRef, type ComponentType } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ClipboardCheck,
  Handshake,
  Leaf,
  MapPin,
  Plus,
  Route,
  ShieldCheck,
  UsersRound,
} from 'lucide-react';
import { companyProfile, projects, type ProjectRecord } from '../data/projects';
import { homepageContent, localize, type HomepageText } from '../data/homepageContent';
import { useLocale, type Locale } from '../i18n';
import { useHomeTextReveal } from '../hooks/useHomeTextReveal';

const Footer = lazy(() => import('../components/Footer'));

const HERO_IMAGE = '/projects/bas-mazagran-200-38-housing/wide.webp';
const STORY_IMAGE = '/projects/said-hamdine-mixed-real-estate/hero.webp';
const TIMELINE_IMAGE = '/projects/douaouda-300-500-housing/03-douaouda.webp';

type IconComponent = ComponentType<{ className?: string; strokeWidth?: number }>;

type Fact = {
  value: string;
  label: HomepageText;
  detail: HomepageText;
};

type StoryScope = {
  label: HomepageText;
};

type TimelinePoint = {
  marker: string;
  title: HomepageText;
  body: HomepageText;
};

type ValueItem = {
  title: HomepageText;
  body: HomepageText;
  image: string;
  imageAlt: HomepageText;
  icon: IconComponent;
  imageFirst?: boolean;
};

const facts: Fact[] = [
  {
    value: '2018',
    label: { en: 'Founded', fr: 'Creation' },
    detail: { en: 'Ouled Fayet, Algiers', fr: 'Ouled Fayet, Alger' },
  },
  {
    value: '6',
    label: { en: 'Category classification', fr: 'Classification categorie' },
    detail: { en: 'Professional qualification', fr: 'Qualification professionnelle' },
  },
  {
    value: '11',
    label: { en: 'Referenced projects', fr: 'References projets' },
    detail: { en: 'Completed and current work', fr: 'Travaux livres et en cours' },
  },
  {
    value: '4',
    label: { en: 'Wilayas represented', fr: 'Wilayas representees' },
    detail: { en: 'Algiers, Tipaza, Mostaganem, Boumerdes', fr: 'Alger, Tipaza, Mostaganem, Boumerdes' },
  },
];

const storyScopes: StoryScope[] = [
  { label: { en: 'Residential construction', fr: 'Construction residentielle' } },
  { label: { en: 'Mixed-use developments', fr: 'Programmes mixtes' } },
  { label: { en: 'Commercial premises', fr: 'Locaux commerciaux' } },
  { label: { en: 'Roads and utility networks', fr: 'Voiries et reseaux' } },
  { label: { en: 'Coordinated site delivery', fr: 'Livraison chantier coordonnee' } },
];

const timelinePoints: TimelinePoint[] = [
  {
    marker: '2018',
    title: { en: 'Founded in Ouled Fayet', fr: 'Creation a Ouled Fayet' },
    body: {
      en: 'SARL Igloo Yapi Construction starts from Algiers with a technical construction structure led by civil engineering experience.',
      fr: 'SARL Igloo Yapi Construction demarre depuis Alger avec une structure technique portee par une experience en genie civil.',
    },
  },
  {
    marker: 'Cat. 6',
    title: { en: 'Professional classification', fr: 'Classification professionnelle' },
    body: {
      en: 'The company holds a Professional Qualification and Classification Certificate for building works.',
      fr: 'L entreprise detient un certificat de qualification et de classification professionnelles pour les travaux de batiment.',
    },
  },
  {
    marker: 'Today',
    title: { en: 'Portfolio across Algeria', fr: 'Portefeuille en Algerie' },
    body: {
      en: 'Current and completed programmes connect housing, commercial premises, roads, networks and site infrastructure.',
      fr: 'Les programmes livres et en cours relient logements, locaux commerciaux, voiries, reseaux et infrastructure de site.',
    },
  },
];

const values: ValueItem[] = [
  {
    title: { en: 'Safety', fr: 'Securite' },
    body: {
      en: 'Safety is treated as part of daily coordination: access, sequencing, material movement and site readiness are reviewed before work accelerates.',
      fr: 'La securite fait partie de la coordination quotidienne: acces, enchainement, mouvement des materiaux et preparation du site sont suivis avant acceleration.',
    },
    image: '/projects/bas-mazagran-200-38-housing/03-mostaganem-1.webp',
    imageAlt: { en: 'Construction site earthworks in Mostaganem', fr: 'Travaux de terrassement a Mostaganem' },
    icon: ShieldCheck,
    imageFirst: true,
  },
  {
    title: { en: 'Accountability', fr: 'Responsabilite' },
    body: {
      en: 'A coordinated team keeps responsibility visible between client expectations, drawings, quantities, purchasing and site execution.',
      fr: 'Une equipe coordonnee garde les responsabilites visibles entre attentes client, plans, quantites, achats et execution chantier.',
    },
    image: '/projects/said-hamdine-mixed-real-estate/wide.webp',
    imageAlt: { en: 'Completed mixed-use residential complex', fr: 'Complexe residentiel mixte livre' },
    icon: ClipboardCheck,
  },
  {
    title: { en: 'Sustainability', fr: 'Durabilite' },
    body: {
      en: 'Durability comes through practical decisions: robust structures, useful commercial ground floors, networks that serve the site and places made for long-term use.',
      fr: 'La durabilite passe par des choix pratiques: structures robustes, rez-de-chaussee utiles, reseaux de service et lieux faits pour durer.',
    },
    image: '/homepage/company-profile-showcase.png',
    imageAlt: { en: 'Residential tower concept at dusk', fr: 'Tour residentielle au crepuscule' },
    icon: Leaf,
    imageFirst: true,
  },
  {
    title: { en: 'Trustworthiness', fr: 'Confiance' },
    body: {
      en: 'Trust is built through clear scope, stable communication and the discipline to connect engineering decisions with what happens on site.',
      fr: 'La confiance se construit par une portee claire, une communication stable et la discipline de relier decisions techniques et chantier.',
    },
    image: '/projects/rouiba-4-promotional-villas/wide.webp',
    imageAlt: { en: 'Residential villa work in Rouiba', fr: 'Travaux residentiels a Rouiba' },
    icon: Handshake,
  },
];

const referenceProjects = projects.slice(0, 8);

function SectionFallback({ minHeight = '20rem' }: { minHeight?: string }) {
  return <div aria-hidden="true" className="bg-white" style={{ minHeight }} />;
}

function localizedAboutCopy(locale: Locale) {
  const about = homepageContent.about;

  return {
    heroEyebrow: localize(about.eyebrow, locale),
    heroTitle:
      locale === 'fr'
        ? 'Une histoire de precision pour batir le residentiel en Algerie.'
        : "A history of precision for Algeria's residential future.",
    heroLead:
      locale === 'fr'
        ? 'Depuis Alger, SARL Igloo Yapi Construction realise des programmes residentiels, mixtes, voiries et reseaux avec une equipe technique coordonnee.'
        : 'From Algiers, SARL Igloo Yapi Construction delivers residential, mixed-use, road and network works through one coordinated technical team.',
    storyLabel: locale === 'fr' ? 'Notre histoire' : 'Our story',
    storyHeading:
      locale === 'fr'
        ? 'SARL Igloo Yapi Construction intervient depuis 2018 sur des programmes ou la coordination technique compte autant que la construction elle-meme.'
        : 'SARL Igloo Yapi Construction has operated since 2018 on programmes where technical coordination matters as much as construction itself.',
    storyParagraphs: about.paragraphs.map((paragraph) => localize(paragraph, locale)),
    storyIntro:
      locale === 'fr'
        ? 'Notre structure relie le bureau, les ingenieurs, les architectes, les conducteurs de travaux, les achats et les equipes chantier autour d une meme priorite: livrer des lieux solides, utilisables et bien coordonnes.'
        : 'Our structure connects the office, engineers, architects, construction managers, purchasing and site teams around one priority: delivering places that are solid, usable and well coordinated.',
    discoverLabel: locale === 'fr' ? 'Domaines coordonnes:' : 'Coordinated capabilities:',
    historyLabel: locale === 'fr' ? 'Notre histoire' : 'Our history',
    referencesLabel: locale === 'fr' ? 'References projets' : 'Project references',
    valuesLabel: locale === 'fr' ? 'Les valeurs Igloo Construction' : 'The Igloo Construction values',
    openProject: locale === 'fr' ? 'Voir le projet' : 'Open project',
    completed: locale === 'fr' ? 'Livre' : 'Completed',
    current: locale === 'fr' ? 'En cours' : 'In progress',
    addressLabel: locale === 'fr' ? 'Base operationnelle' : 'Operational base',
  };
}

function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { locale } = useLocale();
  const copy = localizedAboutCopy(locale);

  useHomeTextReveal(sectionRef, [locale]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[72svh] w-full items-end overflow-hidden bg-zinc-950 md:min-h-[76svh]"
      aria-label="About Igloo Construction"
    >
      <img
        src={HERO_IMAGE}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/42" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-[78%] bg-gradient-to-t from-black/88 via-black/36 to-transparent" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 pb-12 pt-32 font-sans md:px-10 md:pb-16 xl:px-16">
        <div
          className="text-[11px] font-bold uppercase tracking-[0.28em] text-white/76 md:text-[12px]"
          data-home-text-reveal
          data-home-text-reveal-mode="block"
        >
          {copy.heroEyebrow}
        </div>
        <h1
          className="mt-5 max-w-[24ch] text-[clamp(2.45rem,5.9vw,6.2rem)] font-semibold leading-[0.96] tracking-normal text-white"
          data-home-text-reveal
          data-home-text-reveal-mode="line"
          data-home-text-reveal-start="top 92%"
        >
          {copy.heroTitle}
        </h1>
        <p
          className="mt-6 max-w-[54ch] text-[15px] leading-[1.75] text-white/76 md:text-[17px]"
          data-home-text-reveal
          data-home-text-reveal-start="top 94%"
        >
          {copy.heroLead}
        </p>

        <div className="mt-8 grid max-w-[920px] grid-cols-2 gap-px border border-white/16 bg-white/16 md:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.value} className="bg-black/22 px-4 py-4 backdrop-blur-sm md:px-5">
              <div
                className="text-[24px] font-semibold leading-none text-white md:text-[32px]"
                data-home-text-reveal
                data-home-text-reveal-mode="block"
              >
                {fact.value}
              </div>
              <div
                className="mt-2 text-[10px] font-bold uppercase leading-snug tracking-[0.18em] text-white/60"
                data-home-text-reveal
                data-home-text-reveal-mode="block"
              >
                {localize(fact.label, locale)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { locale } = useLocale();
  const copy = localizedAboutCopy(locale);

  useHomeTextReveal(sectionRef, [locale]);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white px-5 py-16 font-sans text-black md:px-10 md:py-24 xl:px-16"
      aria-label={copy.storyLabel}
    >
      <div className="mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-[0.28fr_0.72fr] lg:gap-16">
        <aside className="border-t border-[#c22026] pt-5">
          <p
            className="text-[12px] font-bold uppercase tracking-[0.26em] text-[#c22026]"
            data-home-text-reveal
            data-home-text-reveal-mode="block"
          >
            {copy.storyLabel}
          </p>
        </aside>

        <div className="max-w-[880px]">
          <h2
            className="max-w-[34ch] text-[clamp(1.8rem,3.1vw,3.25rem)] font-semibold leading-[1.08] tracking-normal text-black"
            data-home-text-reveal
            data-home-text-reveal-start="top 84%"
          >
            {copy.storyHeading}
          </h2>
          <div className="mt-8 grid gap-7 text-[15px] leading-[1.85] text-black/64 md:text-[16px] lg:grid-cols-2">
            {[...copy.storyParagraphs, copy.storyIntro].map((paragraph) => (
              <p
                key={paragraph}
                data-home-text-reveal
                data-home-text-reveal-start="top 88%"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-8 border-l-2 border-[#c22026] pl-5">
            <p
              className="text-[12px] font-semibold text-black/56"
              data-home-text-reveal
              data-home-text-reveal-mode="block"
            >
              {copy.discoverLabel}
            </p>
            <ul className="mt-3 grid gap-1.5 text-[13px] font-semibold text-[#c22026] sm:grid-cols-2">
              {storyScopes.map((scope) => (
                <li
                  key={scope.label.en}
                  data-home-text-reveal
                  data-home-text-reveal-mode="block"
                >
                  {localize(scope.label, locale)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function StoryImageBreak() {
  const sectionRef = useRef<HTMLElement>(null);
  const { locale } = useLocale();
  const copy = localizedAboutCopy(locale);

  useHomeTextReveal(sectionRef, [locale]);

  return (
    <section ref={sectionRef} className="w-full bg-white px-5 pb-16 md:px-10 md:pb-24 xl:px-16">
      <figure className="mx-auto max-w-[1600px]">
        <div className="aspect-[16/8.2] min-h-[300px] overflow-hidden bg-[#ece9e3]">
          <img
            src={STORY_IMAGE}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
        <figcaption
          className="mt-4 flex flex-col gap-1 border-b border-black/10 pb-5 text-[12px] text-black/45 md:flex-row md:items-center md:justify-between"
          data-home-text-reveal
          data-home-text-reveal-mode="block"
        >
          <span>SARL Igloo Yapi Construction</span>
          <span>{copy.addressLabel}: {companyProfile.address}</span>
        </figcaption>
      </figure>
    </section>
  );
}

function HistorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { locale } = useLocale();
  const copy = localizedAboutCopy(locale);

  useHomeTextReveal(sectionRef, [locale]);

  return (
    <section
      ref={sectionRef}
      className="w-full overflow-hidden bg-black px-5 py-16 font-sans text-white md:px-10 md:py-24 xl:px-16"
      aria-label={copy.historyLabel}
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-14 flex items-center justify-between">
          <p
            className="text-[12px] font-bold uppercase tracking-[0.26em] text-[#e82a2e]"
            data-home-text-reveal
            data-home-text-reveal-mode="block"
          >
            {copy.historyLabel}
          </p>
          <div className="hidden items-center gap-3 text-white/46 md:flex" aria-hidden="true">
            <ArrowRight className="h-4 w-4 rotate-180" />
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>

        <div className="relative grid min-h-[460px] gap-10 lg:grid-cols-[0.42fr_0.58fr]">
          <div className="absolute inset-x-0 top-10 hidden h-px bg-white/10 lg:block" aria-hidden="true" />
          <div className="absolute bottom-0 left-[31%] top-0 hidden w-px bg-[#e82a2e] lg:block" aria-hidden="true" />

          <div className="relative z-10 flex flex-col justify-end">
            <div className="flex gap-10 text-[12px] text-white/34">
              {timelinePoints.map((point) => (
                <span key={point.marker}>{point.marker}</span>
              ))}
            </div>
            <div
              className="mt-16 text-[clamp(6rem,15vw,13rem)] font-light leading-[0.75] tracking-normal text-white"
              data-home-text-reveal
              data-home-text-reveal-mode="block"
            >
              2018
            </div>
          </div>

          <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(300px,0.78fr)] lg:items-center">
            <div className="space-y-7">
              {timelinePoints.map((point, index) => (
                <article key={point.marker} className="border-l border-white/12 pl-5">
                  <span
                    className={index === 0 ? 'text-[11px] font-bold uppercase tracking-[0.24em] text-[#e82a2e]' : 'text-[11px] font-bold uppercase tracking-[0.24em] text-white/36'}
                    data-home-text-reveal
                    data-home-text-reveal-mode="block"
                  >
                    {point.marker}
                  </span>
                  <h3
                    className="mt-2 text-[22px] font-semibold leading-tight text-white"
                    data-home-text-reveal
                    data-home-text-reveal-start="top 88%"
                  >
                    {localize(point.title, locale)}
                  </h3>
                  <p
                    className="mt-3 max-w-[42ch] text-[14px] leading-[1.75] text-white/56"
                    data-home-text-reveal
                    data-home-text-reveal-start="top 90%"
                  >
                    {localize(point.body, locale)}
                  </p>
                </article>
              ))}
            </div>

            <figure>
              <img
                src={TIMELINE_IMAGE}
                alt=""
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <figcaption
                className="mt-4 text-[12px] text-white/42"
                data-home-text-reveal
                data-home-text-reveal-mode="block"
              >
                Douaouda - 300/500 Assisted Promotional Housing
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectReferenceRow({ project }: { project: ProjectRecord }) {
  const { locale } = useLocale();
  const copy = localizedAboutCopy(locale);
  const status = project.status === 'completed' ? copy.completed : copy.current;

  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group grid gap-3 border-b border-black/[0.08] py-4 text-black transition-colors hover:text-[#c22026] md:grid-cols-[minmax(0,1fr)_180px_120px_24px] md:items-center"
    >
      <span className="text-[14px] font-medium leading-snug md:text-[15px]">{project.title}</span>
      <span className="flex items-center gap-2 text-[13px] text-black/48 group-hover:text-[#c22026]/80">
        <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
        {project.location}
      </span>
      <span className={project.status === 'completed' ? 'text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-700' : 'text-[12px] font-semibold uppercase tracking-[0.16em] text-amber-700'}>
        {status}
      </span>
      <Plus className="hidden h-4 w-4 justify-self-end text-black/36 transition-transform group-hover:rotate-90 group-hover:text-[#c22026] md:block" strokeWidth={2.3} />
    </Link>
  );
}

function ReferencesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { locale } = useLocale();
  const copy = localizedAboutCopy(locale);

  useHomeTextReveal(sectionRef, [locale]);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white px-5 py-14 font-sans text-black md:px-10 md:py-20 xl:px-16"
      aria-label={copy.referencesLabel}
    >
      <div className="mx-auto grid max-w-[1600px] gap-8 lg:grid-cols-[0.28fr_0.72fr] lg:gap-16">
        <div>
          <h2
            className="text-[20px] font-normal leading-tight text-[#c22026] md:text-[24px]"
            data-home-text-reveal
            data-home-text-reveal-mode="block"
          >
            {copy.referencesLabel}
          </h2>
        </div>

        <div>
          <div
            className="grid border-t border-black/[0.12] text-[11px] font-bold uppercase tracking-[0.2em] text-black/38 md:grid-cols-[minmax(0,1fr)_180px_120px_24px]"
            data-home-text-reveal
            data-home-text-reveal-mode="block"
          >
            <span className="py-3">{locale === 'fr' ? 'Projet' : 'Project'}</span>
            <span className="hidden py-3 md:block">{locale === 'fr' ? 'Localisation' : 'Location'}</span>
            <span className="hidden py-3 md:block">{locale === 'fr' ? 'Statut' : 'Status'}</span>
            <span className="hidden py-3 md:block" />
          </div>
          <div data-home-text-reveal data-home-text-reveal-mode="block">
            {referenceProjects.map((project) => (
              <ProjectReferenceRow key={project.slug} project={project} />
            ))}
          </div>

          <Link
            to="/projects"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#c22026] px-5 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#a81b21]"
          >
            <span>{copy.openProject}</span>
            <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ValuesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { locale } = useLocale();
  const copy = localizedAboutCopy(locale);

  useHomeTextReveal(sectionRef, [locale]);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white px-5 pb-20 pt-8 font-sans text-black md:px-10 md:pb-28 md:pt-12 xl:px-16"
      aria-label={copy.valuesLabel}
    >
      <div className="mx-auto max-w-[1600px]">
        <h2
          className="mb-12 text-[22px] font-normal text-[#c22026] md:text-[28px]"
          data-home-text-reveal
          data-home-text-reveal-mode="block"
        >
          {copy.valuesLabel}
        </h2>

        <div className="grid gap-x-16 gap-y-14 lg:grid-cols-2">
          {values.map((value) => {
            const Icon = value.icon;
            const image = (
              <div className="aspect-[16/10] overflow-hidden bg-[#ece9e3]">
                <img
                  src={value.image}
                  alt={localize(value.imageAlt, locale)}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            );
            const text = (
              <div className="border-b border-[#e82a2e]/45 pb-10 pt-2">
                <Icon className="h-8 w-8 text-black/16" strokeWidth={1.5} />
                <p
                  className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#c22026]"
                  data-home-text-reveal
                  data-home-text-reveal-mode="block"
                >
                  {localize(value.title, locale)}
                </p>
                <p
                  className="mt-3 max-w-[38ch] text-[20px] font-medium leading-[1.25] text-black md:text-[24px]"
                  data-home-text-reveal
                  data-home-text-reveal-start="top 88%"
                >
                  {localize(value.body, locale)}
                </p>
              </div>
            );

            return (
              <article key={value.title.en} className="grid gap-7">
                {value.imageFirst ? (
                  <>
                    {image}
                    {text}
                  </>
                ) : (
                  <>
                    {text}
                    {image}
                  </>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CapabilitiesRibbon() {
  const sectionRef = useRef<HTMLElement>(null);
  const { locale } = useLocale();
  const proofItems = homepageContent.about.proofs;

  useHomeTextReveal(sectionRef, [locale]);

  const icons = [BadgeCheck, UsersRound, Building2, Route];

  return (
    <section
      ref={sectionRef}
      className="border-y border-black/[0.08] bg-[#f7f6f1] px-5 py-10 font-sans text-black md:px-10 md:py-12 xl:px-16"
      aria-label="Company capabilities"
    >
      <div className="mx-auto grid max-w-[1600px] gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[...proofItems, {
          title: { en: 'Algeria delivery belt', fr: 'Axe de livraison Algerie' },
          body: { en: 'Work concentrated across Algiers, Tipaza, Boumerdes and Mostaganem.', fr: 'Travaux concentres entre Alger, Tipaza, Boumerdes et Mostaganem.' },
        }].map((item, index) => {
          const Icon = icons[index] ?? BadgeCheck;

          return (
            <article key={item.title.en} className="border border-black/10 bg-white px-5 py-5">
              <Icon className="h-5 w-5 text-[#c22026]" strokeWidth={1.9} />
              <h3
                className="mt-5 text-[15px] font-semibold leading-snug text-black"
                data-home-text-reveal
                data-home-text-reveal-start="top 88%"
              >
                {localize(item.title, locale)}
              </h3>
              <p
                className="mt-3 text-[13px] leading-[1.65] text-black/56"
                data-home-text-reveal
                data-home-text-reveal-start="top 90%"
              >
                {localize(item.body, locale)}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default function About() {
  return (
    <main className="relative isolate overflow-x-hidden bg-white">
      <AboutHero />
      <StorySection />
      <StoryImageBreak />
      <HistorySection />
      <ReferencesSection />
      <ValuesSection />
      <CapabilitiesRibbon />
      <Suspense fallback={<SectionFallback minHeight="24rem" />}>
        <Footer />
      </Suspense>
    </main>
  );
}
