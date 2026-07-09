import { lazy, Suspense, useRef, type ComponentType, type MouseEvent, type ReactNode } from 'react';
import {
  ArrowRight,
  Building2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Route,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { companyProfile, projects } from '../data/projects';
import { localize, type HomepageText } from '../data/homepageContent';
import { useHomeTextReveal } from '../hooks/useHomeTextReveal';
import { useSiteNavigate } from '../hooks/useSiteNavigate';
import { useLocale, type Locale } from '../i18n';

const Footer = lazy(() => import('../components/Footer'));

const HERO_IMAGE = '/projects/said-hamdine-mixed-real-estate/hero.webp';
const OFFICE_IMAGE = '/projects/rouiba-4-promotional-villas/wide.webp';
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(companyProfile.address)}`;

type IconComponent = ComponentType<{ className?: string; strokeWidth?: number }>;

type Channel = {
  label: HomepageText;
  value: string;
  href: string;
  detail: HomepageText;
  icon: IconComponent;
  external?: boolean;
};

type BriefPoint = {
  label: HomepageText;
  body: HomepageText;
};

const channels: Channel[] = [
  {
    label: { en: 'Email', fr: 'Email' },
    value: companyProfile.email,
    href: `mailto:${companyProfile.email}`,
    detail: { en: 'Send drawings, photos, or a short brief.', fr: 'Envoyez plans, photos ou brief court.' },
    icon: Mail,
  },
  {
    label: { en: 'Phone', fr: 'Telephone' },
    value: companyProfile.phones[0],
    href: `tel:${companyProfile.phones[0].replace(/\s/g, '')}`,
    detail: { en: 'Best for local project requests.', fr: 'Ideal pour demandes locales.' },
    icon: Phone,
  },
  {
    label: { en: 'Office', fr: 'Bureau' },
    value: 'Ouled Fayet, Algiers',
    href: MAP_LINK,
    detail: { en: 'Open the office location in Maps.', fr: 'Ouvrir la localisation du bureau.' },
    icon: MapPin,
    external: true,
  },
];

const briefPoints: BriefPoint[] = [
  {
    label: { en: 'Location', fr: 'Localisation' },
    body: {
      en: 'City, wilaya, access notes, and site constraints.',
      fr: 'Ville, wilaya, acces et contraintes du site.',
    },
  },
  {
    label: { en: 'Programme', fr: 'Programme' },
    body: {
      en: 'Residential, mixed-use, villas, commercial, roads, or networks.',
      fr: 'Residentiel, mixte, villas, commercial, voiries ou reseaux.',
    },
  },
  {
    label: { en: 'Stage', fr: 'Phase' },
    body: {
      en: 'Concept, planning, tender, execution, or site review.',
      fr: 'Concept, planification, appel d offres, execution ou revue site.',
    },
  },
  {
    label: { en: 'Reply route', fr: 'Retour' },
    body: {
      en: 'Preferred contact person, phone number, and email.',
      fr: 'Personne a contacter, telephone et email.',
    },
  },
];

function getCopy(locale: Locale) {
  return {
    eyebrow: locale === 'fr' ? 'Contact Igloo' : 'Contact Igloo',
    title: locale === 'fr' ? 'Parlons de votre projet.' : 'Tell us about your project.',
    lead:
      locale === 'fr'
        ? 'Partagez la localisation, le programme et le stade du projet. Notre equipe a Ouled Fayet revient vers vous avec la bonne personne et les prochaines etapes.'
        : 'Share the location, programme, and current stage. The Ouled Fayet team will route your request to the right person and come back with the next steps.',
    formTitle: locale === 'fr' ? 'Envoyer une demande' : 'Send a request',
    formLead:
      locale === 'fr'
        ? 'Le formulaire ouvre votre messagerie avec les informations preparees.'
        : 'The form opens your email client with the request details prepared.',
    name: locale === 'fr' ? 'Nom' : 'Name',
    phone: locale === 'fr' ? 'Telephone' : 'Phone',
    email: locale === 'fr' ? 'Email' : 'Email',
    projectType: locale === 'fr' ? 'Type de projet' : 'Project type',
    location: locale === 'fr' ? 'Localisation' : 'Location',
    message: locale === 'fr' ? 'Message' : 'Message',
    selectPlaceholder: locale === 'fr' ? 'Choisir' : 'Select',
    send: locale === 'fr' ? 'Envoyer la demande' : 'Send request',
    emailNow: locale === 'fr' ? 'Envoyer un email' : 'Email now',
    callOffice: locale === 'fr' ? 'Appeler' : 'Call office',
    viewProjects: locale === 'fr' ? 'Voir les projets' : 'View projects',
    officeEyebrow: locale === 'fr' ? 'Bureau & acces' : 'Office & access',
    officeTitle: locale === 'fr' ? 'Base operationnelle a Ouled Fayet' : 'Operational base in Ouled Fayet',
    officeLead:
      locale === 'fr'
        ? 'Adresse, lignes directes et couverture projet restent visibles sans chercher dans la page.'
        : 'Address, direct lines, and project footprint stay visible without making people hunt through the page.',
    openMaps: locale === 'fr' ? 'Ouvrir la carte' : 'Open maps',
    quickBrief: locale === 'fr' ? 'Brief rapide' : 'Quick brief',
    quickBriefTitle: locale === 'fr' ? 'Ce qu il faut envoyer' : 'What to send first',
    coverage: locale === 'fr' ? 'Couverture' : 'Coverage',
    coverageText:
      locale === 'fr'
        ? 'Portefeuille represente a Alger, Tipaza, Mostaganem et Boumerdes.'
        : 'Portfolio represented in Algiers, Tipaza, Mostaganem, and Boumerdes.',
    hours: locale === 'fr' ? 'Reponse' : 'Response',
    hoursText:
      locale === 'fr'
        ? 'Les demandes avec plans ou photos sont plus faciles a qualifier rapidement.'
        : 'Requests with drawings or photos are easier to qualify quickly.',
  };
}

function SectionFallback({ minHeight = '20rem' }: { minHeight?: string }) {
  return <div aria-hidden="true" className="bg-white" style={{ minHeight }} />;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-black/46">
        {label}
      </span>
      {children}
    </label>
  );
}

function fieldClass() {
  return 'min-h-[48px] w-full border-0 border-b border-black/16 bg-transparent px-0 py-3 text-[15px] font-medium text-black outline-none transition-colors placeholder:text-black/34 focus:border-[#c22026]';
}

function ContactForm({ locale }: { locale: Locale }) {
  const copy = getCopy(locale);
  const projectOptions = [
    locale === 'fr' ? 'Residentiel' : 'Residential',
    locale === 'fr' ? 'Usage mixte' : 'Mixed-use',
    locale === 'fr' ? 'Villas' : 'Villas',
    locale === 'fr' ? 'Commercial' : 'Commercial',
    locale === 'fr' ? 'Voiries / reseaux' : 'Roads / networks',
  ];

  return (
    <form
      action={`mailto:${companyProfile.email}`}
      method="post"
      encType="text/plain"
      className="contact-form-panel border border-black/10 bg-white p-5 shadow-[0_24px_70px_rgba(0,0,0,0.12)] max-lg:mt-20 md:p-7 lg:p-8"
    >
      <div className="flex items-start justify-between gap-6 border-b border-black/10 pb-6">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#c22026]">
            {copy.formTitle}
          </p>
          <p className="mt-3 max-w-[34ch] text-[13px] leading-[1.7] text-black/58">
            {copy.formLead}
          </p>
        </div>
        <Send className="mt-1 h-5 w-5 shrink-0 text-[#c22026]" strokeWidth={2} />
      </div>

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <Field label={copy.name}>
          <input className={fieldClass()} name="name" autoComplete="name" placeholder="Adem Talay" />
        </Field>
        <Field label={copy.phone}>
          <input className={fieldClass()} name="phone" autoComplete="tel" placeholder="+213 ..." />
        </Field>
        <Field label={copy.email}>
          <input className={fieldClass()} name="email" autoComplete="email" placeholder="name@email.com" />
        </Field>
        <Field label={copy.projectType}>
          <select className={fieldClass()} name="project_type" defaultValue="">
            <option value="" disabled>
              {copy.selectPlaceholder}
            </option>
            {projectOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
        <Field label={copy.location}>
          <input className={fieldClass()} name="location" placeholder={locale === 'fr' ? 'Ville, wilaya' : 'City, wilaya'} />
        </Field>
        <Field label={copy.message}>
          <textarea
            className={`${fieldClass()} min-h-[96px] resize-y md:min-h-[112px]`}
            name="message"
            placeholder={
              locale === 'fr'
                ? 'Surface, delai, stade du projet, documents disponibles...'
                : 'Surface, timeline, project stage, available drawings...'
            }
          />
        </Field>
      </div>

      <button
        type="submit"
        className="mt-8 inline-flex min-h-[52px] w-full items-center justify-center gap-3 bg-black px-5 text-[11px] font-black uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#c22026] md:w-auto"
      >
        {copy.send}
        <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
      </button>
    </form>
  );
}

function ContactHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { locale } = useLocale();
  const goTo = useSiteNavigate();
  const copy = getCopy(locale);
  const metrics = [
    { value: String(companyProfile.foundedYear), label: { en: 'Founded', fr: 'Creation' } },
    { value: localize(companyProfile.classificationBadge, locale), label: { en: 'Qualification', fr: 'Qualification' } },
    { value: `${projects.length}+`, label: { en: 'Projects', fr: 'Projets' } },
    { value: '4', label: { en: 'Wilayas', fr: 'Wilayas' } },
  ];

  useHomeTextReveal(sectionRef, [locale]);

  const navigateToProjects = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    goTo('/projects');
  };

  return (
    <section
      ref={sectionRef}
      className="relative isolate min-h-[100svh] overflow-hidden bg-[#0c0c0c] px-5 pb-8 pt-[8.5rem] text-white md:px-10 md:pb-10 lg:pt-[9.25rem] xl:px-16"
      aria-label="Contact Igloo Construction"
    >
      <div className="absolute inset-0 -z-10">
        <img src={HERO_IMAGE} alt="" aria-hidden="true" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/62" />
        <div className="absolute inset-x-0 bottom-0 h-[68%] bg-gradient-to-t from-black via-black/64 to-transparent" />
      </div>

      <div className="mx-auto grid max-w-[1600px] gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(430px,0.7fr)] lg:items-center">
        <div className="max-w-[920px]">
          <div
            className="inline-flex items-center gap-3 border border-white/14 bg-white/8 px-3 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-white/72 backdrop-blur-md"
            data-home-text-reveal
            data-home-text-reveal-mode="block"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#e82a2e]" />
            {copy.eyebrow}
          </div>

          <h1
            className="mt-7 max-w-[12ch] font-nav text-[clamp(3.35rem,10.5vw,10.4rem)] font-black uppercase leading-[0.78] tracking-normal text-white"
            data-home-text-reveal
            data-home-text-reveal-mode="line"
            data-home-text-reveal-start="top 92%"
          >
            {copy.title}
          </h1>

          <div className="mt-8 grid gap-8 border-t border-white/16 pt-6 lg:grid-cols-[minmax(0,0.76fr)_minmax(260px,0.34fr)]">
            <p
              className="max-w-[64ch] text-[15px] leading-[1.85] text-white/72 md:text-[17px]"
              data-home-text-reveal
              data-home-text-reveal-start="top 94%"
            >
              {copy.lead}
            </p>

            <div className="grid grid-cols-2 gap-px border border-white/12 bg-white/12">
              {metrics.map((metric) => (
                <div key={metric.label.en} className="bg-black/38 p-4 backdrop-blur-sm">
                  <div className="text-[20px] font-semibold leading-none text-white">{metric.value}</div>
                  <div className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/50">
                    {localize(metric.label, locale)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`mailto:${companyProfile.email}`}
              className="inline-flex min-h-[46px] items-center gap-2 bg-white px-5 text-[10px] font-black uppercase tracking-[0.22em] text-black transition-colors hover:bg-[#c22026] hover:text-white"
              data-home-text-reveal
              data-home-text-reveal-mode="block"
            >
              {copy.emailNow}
              <Mail className="h-4 w-4" strokeWidth={2} />
            </a>
            <a
              href="/projects"
              onClick={navigateToProjects}
              className="inline-flex min-h-[46px] items-center gap-2 border border-white/16 bg-white/8 px-5 text-[10px] font-black uppercase tracking-[0.22em] text-white backdrop-blur-md transition-colors hover:border-[#c22026] hover:bg-[#c22026]"
              data-home-text-reveal
              data-home-text-reveal-mode="block"
            >
              {copy.viewProjects}
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        </div>

        <ContactForm locale={locale} />
      </div>
    </section>
  );
}

function ContactChannels() {
  const sectionRef = useRef<HTMLElement>(null);
  const { locale } = useLocale();
  const copy = getCopy(locale);
  const addressLines = companyProfile.address.split(', ');

  useHomeTextReveal(sectionRef, [locale]);

  return (
    <section ref={sectionRef} className="bg-[#f7f5f0] px-5 py-16 text-black md:px-10 md:py-20 xl:px-16">
      <div className="mx-auto grid max-w-[1600px] gap-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(440px,0.62fr)]">
        <div className="border-y border-black/12 py-8 md:py-10">
          <p
            className="text-[11px] font-black uppercase tracking-[0.24em] text-[#c22026]"
            data-home-text-reveal
            data-home-text-reveal-mode="block"
          >
            {copy.officeEyebrow}
          </p>
          <h2
            className="mt-5 max-w-[15ch] font-nav text-[clamp(2.6rem,6vw,6rem)] font-black uppercase leading-[0.82] tracking-normal text-black"
            data-home-text-reveal
            data-home-text-reveal-mode="line"
            data-home-text-reveal-start="top 92%"
          >
            {copy.officeTitle}
          </h2>
          <p
            className="mt-6 max-w-[58ch] text-[15px] leading-[1.85] text-black/62 md:text-[17px]"
            data-home-text-reveal
            data-home-text-reveal-start="top 94%"
          >
            {copy.officeLead}
          </p>

          <div className="mt-8 grid gap-px border border-black/10 bg-black/10 md:grid-cols-3">
            {channels.map((channel) => {
              const Icon = channel.icon;

              return (
                <a
                  key={channel.label.en}
                  href={channel.href}
                  target={channel.external ? '_blank' : undefined}
                  rel={channel.external ? 'noreferrer' : undefined}
                  className="group bg-[#f7f5f0] p-5 transition-colors hover:bg-white"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c22026]">
                      {localize(channel.label, locale)}
                    </div>
                    <Icon className="h-5 w-5 text-black/28 transition-colors group-hover:text-[#c22026]" strokeWidth={1.8} />
                  </div>
                  <div className="mt-5 break-words text-[16px] font-semibold leading-[1.35] text-black">
                    {channel.value}
                  </div>
                  <div className="mt-3 max-w-[28ch] text-[13px] leading-[1.7] text-black/55">
                    {localize(channel.detail, locale)}
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        <div className="relative min-h-[34rem] overflow-hidden bg-black text-white">
          <img src={OFFICE_IMAGE} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-55 grayscale" />
          <div className="absolute inset-0 bg-black/56" />
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-8">
            <div>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.24em] text-white/60">
                <MapPin className="h-4 w-4 text-[#e82a2e]" strokeWidth={2} />
                {copy.officeEyebrow}
              </div>
              <address className="mt-6 max-w-[32ch] not-italic text-[22px] font-semibold leading-[1.28] text-white md:text-[28px]">
                {addressLines.map((line, index) => (
                  <span key={line} className="block">
                    {line}
                    {index < addressLines.length - 1 ? ',' : ''}
                  </span>
                ))}
              </address>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-px border border-white/12 bg-white/12">
                <div className="bg-black/32 p-4">
                  <Clock3 className="h-4 w-4 text-white/54" strokeWidth={1.8} />
                  <div className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/48">
                    {copy.hours}
                  </div>
                  <p className="mt-2 text-[13px] leading-[1.6] text-white/72">{copy.hoursText}</p>
                </div>
                <div className="bg-black/32 p-4">
                  <Building2 className="h-4 w-4 text-white/54" strokeWidth={1.8} />
                  <div className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/48">
                    {copy.coverage}
                  </div>
                  <p className="mt-2 text-[13px] leading-[1.6] text-white/72">{copy.coverageText}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={MAP_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[46px] items-center gap-2 bg-white px-5 text-[10px] font-black uppercase tracking-[0.22em] text-black transition-colors hover:bg-[#c22026] hover:text-white"
                >
                  {copy.openMaps}
                  <Route className="h-4 w-4" strokeWidth={2} />
                </a>
                <a
                  href={`tel:${companyProfile.phones[0].replace(/\s/g, '')}`}
                  className="inline-flex min-h-[46px] items-center gap-2 border border-white/16 bg-black/36 px-5 text-[10px] font-black uppercase tracking-[0.22em] text-white transition-colors hover:border-[#c22026] hover:bg-[#c22026]"
                >
                  {copy.callOffice}
                  <Phone className="h-4 w-4" strokeWidth={2} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactBrief() {
  const sectionRef = useRef<HTMLElement>(null);
  const { locale } = useLocale();
  const copy = getCopy(locale);

  useHomeTextReveal(sectionRef, [locale]);

  return (
    <section ref={sectionRef} className="bg-white px-5 py-16 text-black md:px-10 md:py-20 xl:px-16">
      <div className="mx-auto max-w-[1600px] border-t border-black/12 pt-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(280px,0.42fr)_1fr]">
          <div>
            <p
              className="text-[11px] font-black uppercase tracking-[0.24em] text-[#c22026]"
              data-home-text-reveal
              data-home-text-reveal-mode="block"
            >
              {copy.quickBrief}
            </p>
            <h2
              className="mt-5 max-w-[12ch] font-nav text-[clamp(2.25rem,5vw,5rem)] font-black uppercase leading-[0.82] tracking-normal"
              data-home-text-reveal
              data-home-text-reveal-mode="line"
              data-home-text-reveal-start="top 92%"
            >
              {copy.quickBriefTitle}
            </h2>
          </div>

          <div className="grid gap-px border border-black/10 bg-black/10 md:grid-cols-2 xl:grid-cols-4">
            {briefPoints.map((point, index) => (
              <article key={point.label.en} className="bg-white p-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[12px] font-semibold text-[#c22026]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <ShieldCheck className="h-4 w-4 text-black/22" strokeWidth={1.8} />
                </div>
                <h3 className="mt-7 text-[14px] font-black uppercase tracking-[0.16em]">
                  {localize(point.label, locale)}
                </h3>
                <p className="mt-4 text-[14px] leading-[1.75] text-black/58">
                  {localize(point.body, locale)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Contact() {
  return (
    <main className="relative isolate overflow-x-hidden bg-white">
      <ContactHero />
      <ContactChannels />
      <ContactBrief />
      <Suspense fallback={<SectionFallback minHeight="24rem" />}>
        <Footer />
      </Suspense>
    </main>
  );
}
