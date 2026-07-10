import { lazy, Suspense, type ComponentType, type FormEvent } from 'react';
import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { companyProfile } from '../data/projects';
import { localize, type HomepageText } from '../data/homepageContent';
import { useLocale, type Locale } from '../i18n';

const Footer = lazy(() => import('../components/Footer'));
const OfficeLocationMap = lazy(() => import('../components/OfficeLocationMap'));

const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(companyProfile.address)}`;

type IconComponent = ComponentType<{ className?: string; strokeWidth?: number }>;

type Channel = {
  detail: HomepageText;
  href: string;
  icon: IconComponent;
  label: HomepageText;
  value: string;
};

const channels: Channel[] = [
  {
    label: { en: 'Email', fr: 'Email' },
    value: companyProfile.email,
    href: `mailto:${companyProfile.email}`,
    detail: { en: 'Drawings, photos and project briefs', fr: 'Plans, photos et briefs projet' },
    icon: Mail,
  },
  {
    label: { en: 'Algeria office', fr: 'Bureau Algerie' },
    value: companyProfile.phones[0],
    href: `tel:${companyProfile.phones[0].replace(/\s/g, '')}`,
    detail: { en: 'Primary project line', fr: 'Ligne principale projets' },
    icon: Phone,
  },
  {
    label: { en: 'International line', fr: 'Ligne internationale' },
    value: companyProfile.phones[1],
    href: `tel:${companyProfile.phones[1].replace(/\s/g, '')}`,
    detail: { en: 'Direct international contact', fr: 'Contact international direct' },
    icon: Phone,
  },
];

function getCopy(locale: Locale) {
  return {
    eyebrow: locale === 'fr' ? 'Contact' : 'Contact',
    title: locale === 'fr' ? 'Parlons de votre projet.' : 'Start a project conversation.',
    lead:
      locale === 'fr'
        ? 'Contactez directement l equipe Igloo a Bir Khadem. Envoyez la localisation, le programme et les documents disponibles; nous orienterons la demande vers la bonne personne.'
        : 'Speak directly with the Igloo team in Bir Khadem. Send the location, programme and available documents; we will route the request to the right person.',
    officeLabel: locale === 'fr' ? 'Bureau de Bir Khadem' : 'Bir Khadem office',
    officeTitle: locale === 'fr' ? 'Notre adresse a Alger.' : 'Our address in Algiers.',
    openMaps: locale === 'fr' ? 'Ouvrir dans Maps' : 'Open in Maps',
    callOffice: locale === 'fr' ? 'Appeler le bureau' : 'Call the office',
    mapLabel: locale === 'fr' ? 'Carte du bureau Igloo a Bir Khadem' : 'Map of the Igloo office in Bir Khadem',
    briefLabel: locale === 'fr' ? 'Demande projet' : 'Project enquiry',
    briefTitle: locale === 'fr' ? 'Preparez un email clair.' : 'Prepare a clear project email.',
    briefLead:
      locale === 'fr'
        ? 'Trois champs suffisent. Le bouton ouvre votre application email avec un message deja structure; rien n est envoye automatiquement.'
        : 'Three fields are enough. The button opens your email app with a structured draft; nothing is sent automatically.',
    includeLabel: locale === 'fr' ? 'Informations utiles' : 'Useful information',
    includeItems:
      locale === 'fr'
        ? ['Localisation du projet', 'Type de programme', 'Phase actuelle', 'Plans ou photos disponibles']
        : ['Project location', 'Programme type', 'Current stage', 'Available drawings or photos'],
    name: locale === 'fr' ? 'Nom' : 'Name',
    replyTo: locale === 'fr' ? 'Telephone ou email' : 'Phone or email',
    message: locale === 'fr' ? 'Resume du projet' : 'Project summary',
    namePlaceholder: locale === 'fr' ? 'Votre nom' : 'Your name',
    replyPlaceholder: '+213 ... / name@email.com',
    messagePlaceholder:
      locale === 'fr'
        ? 'Localisation, programme, surface, phase et documents disponibles...'
        : 'Location, programme, area, current stage and available documents...',
    prepareEmail: locale === 'fr' ? 'Preparer l email' : 'Prepare email',
    emailSubject: locale === 'fr' ? 'Nouvelle demande projet Igloo' : 'New Igloo project enquiry',
  };
}

function SectionFallback({ minHeight = '20rem', tone = 'light' }: { minHeight?: string; tone?: 'light' | 'dark' }) {
  return <div aria-hidden="true" className={tone === 'dark' ? 'bg-[#111]' : 'bg-white'} style={{ minHeight }} />;
}

function ContactIntro() {
  const { locale } = useLocale();
  const copy = getCopy(locale);

  return (
    <section className="bg-white px-5 pb-16 pt-36 text-[#111] md:px-10 md:pb-24 md:pt-44 xl:px-16">
      <div className="mx-auto max-w-[1500px]">
        <p className="text-[14px] font-semibold text-[#c22026]">{copy.eyebrow}</p>

        <div className="mt-7 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.65fr)] lg:items-end">
          <h1 className="max-w-[900px] font-nav text-[48px] font-semibold leading-[0.98] tracking-normal sm:text-[58px] md:text-[68px] lg:text-[76px] xl:text-[88px]">
            {copy.title}
          </h1>
          <p className="max-w-[45ch] pb-1 text-[17px] leading-[1.72] text-black/64 md:text-[19px]">
            {copy.lead}
          </p>
        </div>

        <div className="mt-14 border-b border-black/14">
          {channels.map((channel) => {
            const Icon = channel.icon;

            return (
              <a
                key={channel.label.en}
                href={channel.href}
                className="group grid gap-3 border-t border-black/14 py-6 transition-colors hover:text-[#c22026] md:grid-cols-[180px_minmax(0,1fr)_280px_24px] md:items-center"
              >
                <span className="flex items-center gap-3 text-[14px] font-semibold">
                  <Icon className="h-4 w-4 text-[#c22026]" strokeWidth={1.9} />
                  {localize(channel.label, locale)}
                </span>
                <span className="break-words text-[24px] font-medium leading-[1.2] md:text-[30px]">{channel.value}</span>
                <span className="text-[14px] text-black/48 group-hover:text-[#c22026]/72">{localize(channel.detail, locale)}</span>
                <ArrowUpRight className="hidden h-4 w-4 md:block" strokeWidth={2} />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function OfficeSection() {
  const { locale } = useLocale();
  const copy = getCopy(locale);

  return (
    <section className="grid bg-[#111] text-white lg:grid-cols-[minmax(360px,0.72fr)_minmax(0,1.28fr)]">
      <div className="flex min-h-[520px] flex-col justify-between px-5 py-16 md:px-10 md:py-20 xl:px-16">
        <div>
          <p className="flex items-center gap-3 text-[14px] font-semibold text-[#e82a2e]">
            <MapPin className="h-4 w-4" strokeWidth={2} />
            {copy.officeLabel}
          </p>
          <h2 className="mt-6 max-w-[12ch] font-nav text-[38px] font-medium leading-[1.05] tracking-normal md:text-[52px]">
            {copy.officeTitle}
          </h2>
          <address className="mt-10 max-w-[28ch] not-italic text-[20px] leading-[1.55] text-white/76 md:text-[24px]">
            {companyProfile.address}
          </address>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <a
            href={MAP_LINK}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 items-center gap-2 bg-white px-5 text-[14px] font-semibold text-black transition-colors hover:bg-[#e82a2e] hover:text-white"
          >
            {copy.openMaps}
            <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
          </a>
          <a
            href={`tel:${companyProfile.phones[0].replace(/\s/g, '')}`}
            className="inline-flex min-h-12 items-center gap-2 border border-white/24 px-5 text-[14px] font-semibold text-white transition-colors hover:border-[#e82a2e] hover:bg-[#e82a2e]"
          >
            {copy.callOffice}
            <Phone className="h-4 w-4" strokeWidth={2} />
          </a>
        </div>
      </div>

      <Suspense fallback={<SectionFallback minHeight="34rem" tone="dark" />}>
        <OfficeLocationMap ariaLabel={copy.mapLabel} />
      </Suspense>
    </section>
  );
}

function ProjectBrief() {
  const { locale } = useLocale();
  const copy = getCopy(locale);

  const prepareEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') ?? '').trim();
    const replyTo = String(form.get('reply_to') ?? '').trim();
    const message = String(form.get('message') ?? '').trim();
    const body = [
      `${copy.name}: ${name}`,
      `${copy.replyTo}: ${replyTo}`,
      '',
      message,
    ].join('\n');

    window.location.href = `mailto:${companyProfile.email}?subject=${encodeURIComponent(copy.emailSubject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section className="bg-white px-5 py-20 text-black md:px-10 md:py-28 xl:px-16">
      <div className="mx-auto grid max-w-[1500px] gap-14 lg:grid-cols-[minmax(300px,0.72fr)_minmax(0,1.28fr)] lg:gap-24">
        <div>
          <p className="text-[14px] font-semibold text-[#c22026]">{copy.briefLabel}</p>
          <h2 className="mt-6 max-w-[13ch] font-nav text-[38px] font-medium leading-[1.05] tracking-normal md:text-[52px]">
            {copy.briefTitle}
          </h2>
          <p className="mt-6 max-w-[42ch] text-[16px] leading-[1.75] text-black/58">{copy.briefLead}</p>

          <div className="mt-10">
            <p className="text-[14px] font-semibold">{copy.includeLabel}</p>
            <ul className="mt-4 border-b border-black/14">
              {copy.includeItems.map((item, index) => (
                <li key={item} className="flex items-center gap-4 border-t border-black/14 py-3 text-[14px] text-black/60">
                  <span className="text-[#c22026]">{String(index + 1).padStart(2, '0')}</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <form onSubmit={prepareEmail} className="border-t border-black/16" aria-label={copy.briefLabel}>
          <label className="grid gap-3 border-b border-black/16 py-6 md:grid-cols-[180px_1fr] md:items-center">
            <span className="text-[14px] font-semibold">{copy.name}</span>
            <input
              required
              name="name"
              autoComplete="name"
              placeholder={copy.namePlaceholder}
              className="min-h-12 w-full border-0 bg-transparent px-0 text-[18px] text-black outline-none placeholder:text-black/28 focus-visible:ring-0"
            />
          </label>
          <label className="grid gap-3 border-b border-black/16 py-6 md:grid-cols-[180px_1fr] md:items-center">
            <span className="text-[14px] font-semibold">{copy.replyTo}</span>
            <input
              required
              name="reply_to"
              autoComplete="email"
              placeholder={copy.replyPlaceholder}
              className="min-h-12 w-full border-0 bg-transparent px-0 text-[18px] text-black outline-none placeholder:text-black/28 focus-visible:ring-0"
            />
          </label>
          <label className="grid gap-3 border-b border-black/16 py-6 md:grid-cols-[180px_1fr] md:items-start">
            <span className="pt-3 text-[14px] font-semibold">{copy.message}</span>
            <textarea
              required
              name="message"
              rows={6}
              placeholder={copy.messagePlaceholder}
              className="w-full resize-y border-0 bg-transparent px-0 py-3 text-[18px] leading-[1.65] text-black outline-none placeholder:text-black/28 focus-visible:ring-0"
            />
          </label>

          <button
            type="submit"
            className="mt-8 inline-flex min-h-12 items-center gap-3 bg-black px-6 text-[14px] font-semibold text-white transition-colors hover:bg-[#c22026]"
          >
            {copy.prepareEmail}
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </form>
      </div>
    </section>
  );
}

export default function Contact() {
  return (
    <main className="relative isolate overflow-x-hidden bg-white">
      <ContactIntro />
      <OfficeSection />
      <ProjectBrief />
      <Suspense fallback={<SectionFallback minHeight="24rem" tone="dark" />}>
        <Footer />
      </Suspense>
    </main>
  );
}
