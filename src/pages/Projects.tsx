import React, {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Home, Mail, MapPin, Search } from 'lucide-react';
import { motionDuration, motionEase, motionStagger, usePrefersReducedMotion } from '../lib/motion';
import { projects, type ProjectRecord } from '../data/projects';
import { useLenis } from '../components/SmoothScrollProvider';
import { useLocale, type Locale } from '../i18n';

gsap.registerPlugin(ScrollTrigger);

const inferCategory = (project: ProjectRecord, locale: Locale) => {
  const text = `${project.title} ${project.scope} ${project.menuTitle}`.toLowerCase();
  if (text.includes('villa')) return locale === 'fr' ? 'Villas' : 'Villas';
  if (text.includes('commercial') || text.includes('mixed')) return locale === 'fr' ? 'Usage mixte' : 'Mixed Use';
  if (text.includes('network') || text.includes('road')) return locale === 'fr' ? 'Infrastructure' : 'Infrastructure';
  return locale === 'fr' ? 'Logement' : 'Housing';
};

const projectStatuses = [
  { key: 'all', label: { en: 'All', fr: 'Tous' } },
  { key: 'completed', label: { en: 'Completed', fr: 'Achevés' } },
  { key: 'current', label: { en: 'Current', fr: 'En cours' } },
] as const;

type ProjectFilterKey = (typeof projectStatuses)[number]['key'];

/* ─── Card: Infinity-style — image above, title + hr + tags below ─── */
function ProjectCard({ project, index, locale }: { project: ProjectRecord; index: number; locale: Locale }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleMouseEnter = () => {
    if (!imgRef.current || prefersReducedMotion) return;
    gsap.to(imgRef.current, { scale: 1.055, duration: 0.55, ease: 'power2.out' });
  };

  const handleMouseLeave = () => {
    if (!imgRef.current || prefersReducedMotion) return;
    gsap.to(imgRef.current, { scale: 1, duration: 0.55, ease: 'power2.out' });
  };

  return (
    <a
      href={`#${project.slug}`}
      data-project-card
      className="project-card group flex flex-col items-start w-full"
    >
      {/* Image — cursor expands here */}
      <div
        className="overflow-hidden w-full aspect-[4/3] bg-[#e8e4dc] relative"
        data-cursor-card
        data-cursor-label="VIEW"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          ref={imgRef}
          src={project.images[0]}
          alt={project.title}
          className="h-full w-full object-cover will-change-transform"
        />
      </div>

      {/* Info block */}
      <div className="w-full pt-4 pb-8">
        <h3 className="text-2xl leading-[1.2] text-[#c22026] transition-colors group-hover:text-[#9a1a1e] md:text-3xl">
          {project.title}
        </h3>
        <hr className="mt-2 mb-3 border-black/12" />
        <div className="flex items-center justify-between gap-4">
          <span className="text-[11px] text-black/55">
            {inferCategory(project, locale)}, {project.location}
          </span>
          <span className="text-[11px] font-medium text-black underline-offset-2 transition-colors group-hover:text-[#c22026]">
            {locale === 'fr' ? 'Lire la suite' : 'Read More'}
          </span>
        </div>
      </div>
    </a>
  );
}

/* ─── Chapter: full-screen detail row — unchanged ─── */
function ProjectChapter({
  project,
  index,
  isActive,
  locale,
}: {
  project: ProjectRecord;
  index: number;
  isActive: boolean;
  locale: Locale;
}) {
  const reverse = index % 2 === 1;

  return (
    <article
      id={project.slug}
      data-project-row
      className="project-row relative grid min-h-[100dvh] items-center gap-10 border-t border-black/10 px-6 py-16 md:grid-cols-12 md:px-12 lg:px-20"
    >
      <div className={`project-copy relative z-10 md:col-span-4 ${reverse ? 'md:col-start-8' : ''}`}>
        <div className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#c22026]">
          <span>{String(index + 1).padStart(2, '0')}</span>
          <span className="h-px w-10 bg-[#c22026]/50" />
          <span>{project.chapterLabel}</span>
        </div>

        <h2 className="font-serif text-[2.7rem] uppercase leading-[0.92] tracking-[-0.06em] text-[#111] md:text-[4.4rem]">
          {project.coverLines[0]}
          <br />
          {project.coverLines[1]}
        </h2>

        <p className="mt-6 max-w-md text-sm leading-7 text-black/62 md:text-base">
          {project.summary}
        </p>

        <div className="mt-8 grid gap-3 border-y border-black/10 py-5 text-[11px] uppercase tracking-[0.18em] text-black/52">
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#c22026]" strokeWidth={2} />
            {project.location}
          </span>
          <span>{project.scope}</span>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <a
            href={`#${project.slug}`}
            className="inline-flex items-center gap-2 border border-black/15 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#111] transition-colors duration-300 hover:border-[#c22026] hover:text-[#c22026]"
          >
            {locale === 'fr' ? 'Voir le chapitre' : 'View Chapter'}
            <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
          </a>
          <span className="text-[11px] uppercase tracking-[0.2em] text-black/35">
            {project.status === 'current'
              ? locale === 'fr' ? 'Livraison en cours' : 'Live Delivery'
              : locale === 'fr' ? 'Livraison achevée' : 'Completed Delivery'}
          </span>
        </div>
      </div>

      <div className={`project-media relative md:col-span-7 ${reverse ? 'md:col-start-1 md:row-start-1' : 'md:col-start-6'}`}>
        <div className="relative overflow-hidden rounded-[2rem] bg-[#f5f3ef] shadow-[0_30px_80px_rgba(0,0,0,0.12)]">
          <div
            className="parallax-media aspect-[4/5] overflow-hidden md:aspect-[5/4]"
            data-cursor-card
            data-cursor-label="CHAPTER"
          >
            <img src={project.images[0]} alt={project.title} className="h-full w-full object-cover" />
          </div>

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 bg-gradient-to-t from-black/65 via-black/15 to-transparent px-6 py-6 md:px-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/62">
                {project.menuTitle}
              </p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-white/88">
                {project.details}
              </p>
            </div>
            <div
              className={`hidden h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm md:flex ${
                isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-60'
              } transition-all duration-500`}
            >
              <ArrowUpRight className="h-5 w-5" strokeWidth={2} />
            </div>
          </div>
        </div>

        <div className={`project-detail-card absolute -bottom-10 ${reverse ? 'left-6 md:left-auto md:right-10' : 'right-6 md:right-auto md:left-10'} w-[18rem] max-w-[calc(100%-3rem)] border border-black/10 bg-white/92 p-5 backdrop-blur-md shadow-[0_18px_48px_rgba(0,0,0,0.1)]`}>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#c22026]">{locale === 'fr' ? 'Périmètre du projet' : 'Project Scope'}</p>
          <p className="mt-3 text-sm leading-6 text-black/70">{project.scope}</p>
        </div>
      </div>
    </article>
  );
}

/* ─── Page ─── */
export default function Projects() {
  const location = useLocation();
  const lenis = useLenis();
  const { locale } = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const [activeFilter, setActiveFilter] = useState<ProjectFilterKey>('all');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePreviewSlug, setActivePreviewSlug] = useState(projects[0]?.slug ?? '');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const projectCategories = useMemo(
    () => ['All', ...Array.from(new Set(projects.map((p) => inferCategory(p, locale))))],
    [locale],
  );

  const visibleProjects = useMemo(() => {
    const normalized = deferredSearchQuery.trim().toLowerCase();
    return projects.filter((project) => {
      const filterMatch = activeFilter === 'all' || project.status === activeFilter;
      const categoryMatch = activeCategory === 'All' || inferCategory(project, locale) === activeCategory;
      const textMatch =
        normalized.length === 0 ||
        [project.title, project.menuTitle, project.location, project.summary, project.scope]
          .join(' ')
          .toLowerCase()
          .includes(normalized);
      return filterMatch && categoryMatch && textMatch;
    });
  }, [activeCategory, activeFilter, deferredSearchQuery, locale]);

  // Reset category selection when the locale changes so the localized labels stay in sync.
  useEffect(() => {
    setActiveCategory('All');
  }, [locale]);

  const activePreviewProject =
    visibleProjects.find((p) => p.slug === activePreviewSlug) ?? visibleProjects[0] ?? projects[0];

  useEffect(() => {
    if (!visibleProjects.some((p) => p.slug === activePreviewSlug)) {
      setActivePreviewSlug(visibleProjects[0]?.slug ?? projects[0]?.slug ?? '');
    }
  }, [activePreviewSlug, visibleProjects]);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    const slug = location.hash.replace('#', '');
    if (!slug) {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true });
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
      return;
    }
    const target = document.getElementById(slug);
    if (!target) return;
    requestAnimationFrame(() => {
      if (lenis && !prefersReducedMotion) {
        lenis.scrollTo(target, { offset: -90 });
      } else {
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  }, [lenis, location.hash, location.key, prefersReducedMotion, visibleProjects.length]);

  /* Re-animate grid on filter change */
  useEffect(() => {
    if (prefersReducedMotion) return;
    const cards = gridRef.current?.querySelectorAll<HTMLElement>('[data-project-card]');
    if (!cards?.length) return;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 32, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: motionDuration.section,
        ease: motionEase.soft,
        stagger: 0.055,
        overwrite: 'auto',
      },
    );
  }, [activeCategory, activeFilter, deferredSearchQuery, prefersReducedMotion, visibleProjects]);

  useGSAP(() => {
    ScrollTrigger.getAll().forEach((t) => t.kill());

    if (prefersReducedMotion) {
      gsap.set(
        '[data-hero-line], .project-row, .project-copy, .project-media, .project-detail-card, .project-dock',
        { clearProps: 'all', opacity: 1, y: 0, x: 0 },
      );
      return;
    }

    /* Hero reveal */
    gsap
      .timeline()
      .fromTo(
        '[data-hero-line]',
        { yPercent: 115, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: motionDuration.hero,
          stagger: motionStagger.tight,
          ease: motionEase.expo,
        },
        0,
      )
      .fromTo(
        '.hero-sub, .hero-search, .hero-categories, .hero-count',
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: motionDuration.section,
          stagger: 0.07,
          ease: motionEase.soft,
        },
        0.4,
      );

    /* Grid cards scroll reveal */
    gsap.utils.toArray<HTMLElement>('[data-project-card]').forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: motionDuration.section,
          ease: motionEase.soft,
          delay: i * 0.04,
          scrollTrigger: { trigger: card, start: 'top 86%' },
        },
      );
    });

    /* Chapter rows */
    gsap.utils.toArray<HTMLElement>('.project-row').forEach((row) => {
      const copy = row.querySelector('.project-copy');
      const media = row.querySelector('.project-media');
      const detail = row.querySelector('.project-detail-card');
      const mediaInner = row.querySelector('.parallax-media img');
      const slug = row.id;

      gsap.fromTo(
        [copy, media],
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: motionDuration.hero,
          stagger: 0.12,
          ease: motionEase.soft,
          scrollTrigger: { trigger: row, start: 'top 75%' },
        },
      );

      if (detail) {
        gsap.fromTo(
          detail,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: motionDuration.section,
            ease: motionEase.soft,
            scrollTrigger: { trigger: row, start: 'top 68%' },
          },
        );
      }

      if (mediaInner) {
        gsap.fromTo(
          mediaInner,
          { yPercent: -6, scale: 1.08 },
          {
            yPercent: 6,
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      }

      ScrollTrigger.create({
        trigger: row,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActivePreviewSlug(slug),
        onEnterBack: () => setActivePreviewSlug(slug),
      });
    });

    /* Dock progress */
    gsap.to('.project-dock-progress', {
      scaleX: 1,
      ease: 'none',
      transformOrigin: 'left center',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    });
  }, { scope: containerRef, dependencies: [prefersReducedMotion, visibleProjects] });

  return (
    <main ref={containerRef} className="min-h-screen overflow-x-hidden bg-white text-[#111]">

      {/* ── Fixed nav ── */}
      {/* ── Hero — 2-col split ── */}
      <section className="relative overflow-hidden border-b border-black/8 bg-white px-6 pt-36 pb-16 md:px-12 md:pt-44 md:pb-24 lg:px-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-end">

          {/* Left: giant red title */}
          <div>
            <div className="overflow-hidden">
              <p
                data-hero-line
                className="font-serif text-[18vw] uppercase leading-[0.85] tracking-[-0.06em] text-[#c22026] md:text-[7.5rem] lg:text-[10rem]"
              >
                {locale === 'fr' ? 'Nos' : 'Our'}
              </p>
            </div>
            <div className="overflow-hidden">
              <p
                data-hero-line
                className="font-serif text-[18vw] uppercase leading-[0.85] tracking-[-0.06em] text-[#c22026] md:text-[7.5rem] lg:text-[10rem]"
              >
                {locale === 'fr' ? 'Projets' : 'Projects'}
              </p>
            </div>
          </div>

          {/* Right: description */}
          <div className="hero-sub lg:pb-4">
            <p className="text-base leading-8 text-black/62 md:text-lg md:leading-9">
              {locale === 'fr' ? (
                <>
                  Nous réalisons des programmes résidentiels et à usage mixte dans toute l'Algérie.
                  Nos secteurs couvrent le{' '}
                  <strong className="font-semibold text-black/82">logement</strong>, les{' '}
                  <strong className="font-semibold text-black/82">villas</strong>, l'{' '}
                  <strong className="font-semibold text-black/82">usage mixte</strong> et les{' '}
                  <strong className="font-semibold text-black/82">infrastructures</strong> — chaque projet
                  conçu pour durer et pensé pour inspirer.
                </>
              ) : (
                <>
                  We deliver residential and mixed-use programmes across Algeria.
                  Our sectors include{' '}
                  <strong className="font-semibold text-black/82">Housing</strong>,{' '}
                  <strong className="font-semibold text-black/82">Villas</strong>,{' '}
                  <strong className="font-semibold text-black/82">Mixed Use</strong>, and{' '}
                  <strong className="font-semibold text-black/82">Infrastructure</strong> — each project
                  built to endure and designed to inspire.
                </>
              )}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#projects-grid"
                className="inline-flex items-center gap-2 bg-[#111] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#c22026]"
              >
                {locale === 'fr' ? 'Parcourir les projets' : 'Browse Projects'}
                <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 border border-black/15 px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.24em] text-[#111] transition-colors hover:border-[#c22026] hover:text-[#c22026]"
              >
                {locale === 'fr' ? 'Contact' : 'Contact'}
                <Mail className="h-4 w-4" strokeWidth={2} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sticky filter bar ── */}
      <section
        id="projects-grid"
        className="sticky top-[84px] z-40 border-b border-black/8 bg-white/95 px-6 py-4 backdrop-blur-md md:top-[92px] md:px-12 lg:px-20"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          {/* Search */}
          <label className="hero-search group flex max-w-xs items-center gap-2 border-b border-black/15 pb-1 transition-colors focus-within:border-[#c22026]">
            <Search className="h-3.5 w-3.5 shrink-0 text-black/35 transition-colors group-focus-within:text-[#c22026]" strokeWidth={2} />
            <input
              value={searchQuery}
              onChange={(e) => startTransition(() => setSearchQuery(e.target.value))}
              placeholder={locale === 'fr' ? 'Rechercher des projets…' : 'Search projects...'}
              className="w-full bg-transparent text-sm text-[#111] outline-none placeholder:text-black/30"
            />
          </label>

          {/* Category + status pills */}
          <div className="hero-categories flex flex-wrap items-center gap-2">
            {projectCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => startTransition(() => setActiveCategory(cat))}
                className={`border px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                  cat === activeCategory
                    ? 'border-[#c22026] bg-[#c22026] text-white'
                    : 'border-black/12 text-black/62 hover:border-[#c22026] hover:text-[#c22026]'
                }`}
              >
                {cat}
              </button>
            ))}
            <span className="hidden h-4 w-px bg-black/12 md:block" />
            {projectStatuses.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => startTransition(() => setActiveFilter(s.key))}
                className={`border px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                  s.key === activeFilter
                    ? 'border-[#111] bg-[#111] text-white'
                    : 'border-black/12 text-black/62 hover:border-[#c22026] hover:text-[#c22026]'
                }`}
              >
                {s.label[locale]}
              </button>
            ))}
          </div>

          <span className="hero-count text-[10px] font-bold uppercase tracking-[0.24em] text-black/38 md:ml-auto md:shrink-0">
            {visibleProjects.length} {visibleProjects.length === 1 ? (locale === 'fr' ? 'Projet' : 'Project') : (locale === 'fr' ? 'Projets' : 'Projects')}
          </span>
        </div>
      </section>

      {/* ── 3-column project grid ── */}
      <section className="px-6 py-16 md:px-12 md:py-24 lg:px-20">
        {visibleProjects.length > 0 ? (
          <div ref={gridRef} className="grid gap-x-8 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProjects.map((project, index) => (
              <React.Fragment key={project.slug}>
                <ProjectCard project={project} index={index} locale={locale} />
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#c22026]">{locale === 'fr' ? 'Aucun résultat' : 'No Match'}</p>
            <h2 className="mt-5 font-serif text-4xl uppercase tracking-[-0.05em] text-[#111]">
              {locale === 'fr' ? 'Aucun projet trouvé' : 'No projects found'}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-black/62">
              {locale === 'fr' ? 'Essayez un autre mot-clé ou ajustez le filtre ci-dessus.' : 'Try a different keyword or adjust the filter above.'}
            </p>
          </div>
        )}
      </section>

      {/* ── Section divider ── */}
      <div className="border-t border-black/8 px-6 py-6 md:px-12 lg:px-20">
        <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-[0.26em] text-black/30">
          <span>{locale === 'fr' ? 'Igloo Construction · Bibliothèque de chapitres' : 'Igloo Construction · Chapter Library'}</span>
          <span>{locale === 'fr' ? `${visibleProjects.length} chapitres détaillés ci-dessous` : `${visibleProjects.length} detailed chapters below`}</span>
        </div>
      </div>

      {/* ── Full-screen chapter detail rows ── */}
      <section id="projects-library" className="relative bg-[#f3f0ea]">
        {visibleProjects.map((project, index) => (
          <React.Fragment key={project.slug}>
            <ProjectChapter
              project={project}
              index={index}
              isActive={activePreviewProject.slug === project.slug}
              locale={locale}
            />
          </React.Fragment>
        ))}
      </section>

      {/* ── Fixed bottom dock ── */}
      <div className="project-dock pointer-events-none fixed inset-x-0 bottom-4 z-[70] px-4 md:px-8">
        <div className="pointer-events-auto mx-auto flex max-w-6xl flex-col gap-4 border border-black/10 bg-white/90 px-5 py-4 shadow-[0_18px_45px_rgba(0,0,0,0.08)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex h-11 w-11 items-center justify-center border border-black/10 text-[#111] transition-colors hover:border-[#c22026] hover:text-[#c22026]"
            >
              <Home className="h-4 w-4" strokeWidth={2} />
            </Link>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-black/42">{locale === 'fr' ? 'Chapitre actuel' : 'Current Chapter'}</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#111]">
                {activePreviewProject.menuTitle}
              </p>
            </div>
          </div>

          <div className="min-w-0 flex-1 px-0 md:px-10">
            <div className="h-px overflow-hidden bg-black/10">
              <div className="project-dock-progress h-full w-full origin-left scale-x-0 bg-[#c22026]" />
            </div>
          </div>

          <a
            href="/contact"
            data-cursor-card
            data-cursor-label="CONTACT"
            className="inline-flex items-center justify-center gap-2 border border-black/10 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.24em] text-[#111] transition-colors hover:border-[#c22026] hover:text-[#c22026]"
          >
            <Mail className="h-4 w-4" strokeWidth={2} />
            Contact
          </a>
        </div>
      </div>
    </main>
  );
}
