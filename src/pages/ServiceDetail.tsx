import { useRef } from 'react';
import { ArrowLeft, ArrowRight, Check, MapPin } from 'lucide-react';
import { Navigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import SiteLink from '../components/SiteLink';
import { usePageContent } from '../content';
import { projects, localizedProjectCardTitle } from '../data/projects';
import { isServiceSlug } from '../data/siteSeo';
import { localizedPath, useLocale } from '../i18n';
import { useEditorialReveal } from '../hooks/useEditorialReveal';

type ServiceDetailContent = {
  eyebrow: string;
  heading: string;
  lead: string;
  paragraphs: string[];
  scope: string[];
  proofSlugs: string[];
  cta: string;
};

export default function ServiceDetail() {
  const contentRef = useRef<HTMLDivElement>(null);
  const { locale } = useLocale();
  const { slug } = useParams<{ slug: string }>();
  const safeSlug = isServiceSlug(slug) ? slug : 'general-contracting';
  const page = usePageContent<ServiceDetailContent>(`services/${safeSlug}`, locale);

  useEditorialReveal(contentRef, [locale, safeSlug]);

  if (!isServiceSlug(slug)) return <Navigate replace to={localizedPath(locale, '/404')} />;

  const proofProjects = page.content.proofSlugs
    .map((projectSlug) => projects.find((project) => project.slug === projectSlug))
    .filter((project): project is (typeof projects)[number] => Boolean(project));

  return (
    <main className="bg-white text-[#111]">
      <div ref={contentRef}>
      <section className="px-5 pb-16 pt-36 md:px-10 md:pb-24 md:pt-44 xl:px-16">
        <div className="mx-auto max-w-[1500px]">
          <SiteLink to="/services" className="inline-flex items-center gap-2 text-[13px] font-semibold text-black/55 transition-colors hover:text-[#c22026]" data-editorial-reveal="action"><ArrowLeft className="h-4 w-4" />Services</SiteLink>
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)] lg:items-end">
            <div>
              <p className="text-[14px] font-semibold text-[#c22026]" data-editorial-reveal="label">{page.content.eyebrow}</p>
              <h1 className="mt-6 max-w-[980px] font-nav text-[48px] font-semibold leading-[0.98] text-balance sm:text-[60px] md:text-[76px]" data-editorial-reveal="display">{page.content.heading}</h1>
            </div>
            <p className="max-w-[44ch] text-pretty text-[17px] leading-[1.75] text-black/64 md:text-[19px]" data-editorial-reveal="copy">{page.content.lead}</p>
          </div>
        </div>
      </section>

      <section className="bg-[#111] px-5 py-16 text-white md:px-10 md:py-24 xl:px-16">
        <div className="mx-auto grid max-w-[1500px] gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] lg:gap-24">
          <div className="grid gap-7 text-[17px] leading-[1.8] text-white/70 md:text-[19px]" data-editorial-reveal-group="copy">
            {page.content.paragraphs.map((paragraph) => <p key={paragraph} className="text-pretty" data-editorial-reveal-item>{paragraph}</p>)}
          </div>
          <div data-editorial-reveal="panel">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#e82a2e]">Scope</p>
            <ul className="mt-5 border-t border-white/18">
              {page.content.scope.map((item) => <li key={item} className="flex gap-3 border-b border-white/18 py-4 text-[15px] text-white/75"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#e82a2e]" />{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-[#f1f1ef] px-5 py-16 md:px-10 md:py-24 xl:px-16">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col gap-5 border-b border-black/14 pb-8 md:flex-row md:items-end md:justify-between">
            <div><p className="text-[14px] font-semibold text-[#c22026]" data-editorial-reveal="label">Proof projects</p><h2 className="mt-4 text-[34px] font-semibold leading-[1.05] text-balance md:text-[48px]" data-editorial-reveal="heading">Delivered work behind the service.</h2></div>
            <SiteLink to="/projects" className="inline-flex items-center gap-2 text-[14px] font-semibold hover:text-[#c22026]" data-editorial-reveal="action">All projects<ArrowRight className="h-4 w-4" /></SiteLink>
          </div>
          <div className="grid gap-px border-b border-black/14 bg-black/14 md:grid-cols-2" data-editorial-reveal-group="cards">
            {proofProjects.map((project) => <SiteLink key={project.slug} to={`/projects/${project.slug}`} className="group bg-[#f1f1ef] p-7 transition-colors hover:bg-white md:p-9" data-editorial-reveal-item><div className="flex items-center justify-between gap-5"><span className="text-[24px] font-semibold">{localizedProjectCardTitle(project, locale)}</span><ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" /></div><p className="mt-5 flex items-center gap-2 text-[14px] text-black/54"><MapPin className="h-4 w-4 text-[#c22026]" />{project.location}</p><p className="mt-5 max-w-[55ch] text-pretty text-[15px] leading-[1.7] text-black/60">{project.summary}</p></SiteLink>)}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-10 md:py-24 xl:px-16"><div className="mx-auto flex max-w-[1500px] flex-col gap-7 border-t border-black/14 pt-10 md:flex-row md:items-center md:justify-between"><h2 className="max-w-[18ch] text-[34px] font-semibold leading-[1.05] text-balance md:text-[48px]" data-editorial-reveal="heading">{page.content.cta}</h2><SiteLink to="/contact" className="inline-flex min-h-12 items-center gap-3 bg-black px-6 text-[14px] font-semibold text-white transition-colors hover:bg-[#c22026]" data-editorial-reveal="action">Contact Igloo Construction<ArrowRight className="h-4 w-4" /></SiteLink></div></section>
      </div>
      <Footer />
    </main>
  );
}
