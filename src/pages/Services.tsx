import { useRef } from 'react';
import { ArrowRight, Building2, MapPin } from 'lucide-react';
import Footer from '../components/Footer';
import SiteLink from '../components/SiteLink';
import { usePageContent } from '../content';
import { brandEntity } from '../data/siteSeo';
import { useLocale } from '../i18n';
import { useEditorialReveal } from '../hooks/useEditorialReveal';

type ServiceCard = { slug: string; title: string; summary: string };
type ServicesContent = {
  eyebrow: string;
  heading: string;
  lead: string;
  cards: ServiceCard[];
  cta: string;
};

export default function Services() {
  const contentRef = useRef<HTMLDivElement>(null);
  const { locale } = useLocale();
  const page = usePageContent<ServicesContent>('services', locale);

  useEditorialReveal(contentRef, [locale]);

  return (
    <main className="bg-white text-[#111]">
      <div ref={contentRef}>
      <section className="px-5 pb-16 pt-36 md:px-10 md:pb-24 md:pt-44 xl:px-16">
        <div className="mx-auto max-w-[1500px]">
          <p className="text-[14px] font-semibold text-[#c22026]" data-editorial-reveal="label">{page.content.eyebrow}</p>
          <div className="mt-7 grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] lg:items-end">
            <h1 className="max-w-[980px] font-nav text-[48px] font-semibold leading-[0.98] text-balance sm:text-[60px] md:text-[74px]" data-editorial-reveal="display">{page.content.heading}</h1>
            <p className="max-w-[44ch] text-pretty text-[17px] leading-[1.75] text-black/64 md:text-[19px]" data-editorial-reveal="copy">{page.content.lead}</p>
          </div>
          <div className="mt-14 grid gap-px border-y border-black/14 bg-black/14 md:grid-cols-2" data-editorial-reveal-group="cards">
            {page.content.cards.map((card, index) => (
              <SiteLink
                key={card.slug}
                to={`/services/${card.slug}`}
                className="group bg-white p-7 transition-colors hover:bg-[#111] hover:text-white md:p-9"
                data-editorial-reveal-item
              >
                <div className="flex items-start justify-between gap-5">
                  <span className="text-[13px] text-[#c22026]">{String(index + 1).padStart(2, '0')}</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" strokeWidth={1.8} />
                </div>
                <Building2 className="mt-12 h-6 w-6 text-[#c22026]" strokeWidth={1.6} />
                <h2 className="mt-6 max-w-[18ch] text-[28px] font-semibold leading-[1.05]">{card.title}</h2>
                <p className="mt-5 max-w-[42ch] text-[15px] leading-[1.75] text-black/58 group-hover:text-white/66">{card.summary}</p>
              </SiteLink>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f1f1ef] px-5 py-16 md:px-10 md:py-24 xl:px-16">
        <div className="mx-auto grid max-w-[1500px] gap-8 md:grid-cols-[0.7fr_1.3fr] md:items-end">
          <div className="flex items-center gap-3 text-[14px] font-semibold text-[#c22026]" data-editorial-reveal="label"><MapPin className="h-4 w-4" />{brandEntity.address.addressLocality}, {brandEntity.address.addressRegion}</div>
          <div>
            <p className="max-w-[48ch] text-pretty text-[21px] leading-[1.45]" data-editorial-reveal="copy">{brandEntity.legalName} works from Bir Khadem, Algiers, with a portfolio of residential, commercial and infrastructure projects across Algeria.</p>
            <SiteLink to="/contact" className="mt-7 inline-flex items-center gap-2 border-b border-black pb-1 text-[14px] font-semibold transition-colors hover:border-[#c22026] hover:text-[#c22026]" data-editorial-reveal="action">
              {page.content.cta}<ArrowRight className="h-4 w-4" strokeWidth={2} />
            </SiteLink>
          </div>
        </div>
      </section>
      </div>
      <Footer />
    </main>
  );
}
