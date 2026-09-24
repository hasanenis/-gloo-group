import { useEffect, useMemo, useRef, useState } from 'react';
import { Snap, EaseOutExpo } from 'vevet';
import { usePrefersReducedMotion } from '../lib/motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { homeProjectCards, localizedProjectCardTitle, localizedProjectScope, localizedProjectShortTitle, type ProjectRecord } from '../data/projects';
import { homepageContent, homepageProjectProofs, localize as localizeHome } from '../data/homepageContent';
import { getProjectHeroImage } from '../data/projectHeroImage';
import { localized } from '../data/projectContent';
import { localizedPath, pickLocaleText, useLocale, type Locale } from '../i18n';
import { useSiteNavigate } from '../hooks/useSiteNavigate';
import { preloadRoute } from '../lib/preloadRoute';
import './FeaturedProjectsShowcase.css';

type ProjectFilter = 'all' | 'residential' | 'commercial' | 'villas' | 'vrd';

function splitProjectsHeading(title: string, locale: Locale): [string, string] | null {
  const pattern = locale === 'ar-DZ'
    ? /^(.*?)(و)(.+)$/u
    : locale === 'fr'
      ? /^(.*?)(\s+et\s+)(.+)$/iu
      : locale === 'tr'
        ? /^(.*?)(\s+ve\s+)(.+)$/iu
        : /^(.*?)(\s+and\s+)(.+)$/iu;
  const match = title.match(pattern);
  if (!match) return null;
  return [match[1].trim(), locale === 'ar-DZ' ? `${match[2]}${match[3].trim()}` : `${match[2].trim()} ${match[3].trim()}`];
}

const projectFilters: Array<{ id: ProjectFilter; label: Parameters<typeof pickLocaleText>[1] }> = [
  { id: 'all', label: { en: 'All', fr: 'Tous', dz: 'الكل', tr: 'Tümü' } },
  { id: 'residential', label: { en: 'Residential', fr: 'Résidentiel', dz: 'سكني', tr: 'Konut' } },
  { id: 'commercial', label: { en: 'Commercial', fr: 'Commercial', dz: 'تجاري', tr: 'Ticari' } },
  { id: 'villas', label: { en: 'Villas', fr: 'Villas', dz: 'فيلات', tr: 'Villalar' } },
  { id: 'vrd', label: { en: 'Infrastructure', fr: 'VRD', dz: 'التهيئة والشبكات', tr: 'Altyapı' } },
];

const projectCategories: Record<string, ProjectFilter[]> = {
  'douaouda-300-500-housing': ['residential', 'vrd'],
  'sidi-abdallah-200-1200-housing': ['residential'],
  'staoueli-11-41-villas': ['residential', 'villas', 'vrd'],
  rahmania: ['commercial'],
  'said-hamdine-mixed-real-estate': ['residential', 'commercial'],
  'rouiba-4-promotional-villas': ['residential', 'villas', 'vrd'],
  'sidi-benour-50-housing': ['residential'],
  'dely-brahim-240-housing': ['residential', 'commercial', 'vrd'],
  'bas-mazagran-200-38-housing': ['residential', 'commercial', 'vrd'],
  'reghaia-bouraada-250-housing': ['residential', 'commercial'],
  'boudouaou-70-10-housing': ['residential', 'commercial', 'vrd'],
};

function ProjectCarousel({ projects, initialProjectSlug, locale }: {
  projects: ProjectRecord[];
  initialProjectSlug?: string;
  locale: Locale;
}) {
  const initialIndex = Math.max(0, projects.findIndex((project) => project.slug === initialProjectSlug));
  const containerRef = useRef<HTMLDivElement>(null);
  const snapRef = useRef<Snap | null>(null);
  const gestureRef = useRef({ x: 0, y: 0, moved: false });
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const reducedMotion = usePrefersReducedMotion();
  const goTo = useSiteNavigate();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Reference: https://codepen.io/anton-bobrov/pen/MYyLroo
    const carousel = new Snap({
      container,
      activeIndex: initialIndex,
      origin: 'center',
      loop: true,
      grabCursor: true,
      gap: '1vw',
      lerp: reducedMotion ? 1 : 0.2,
      easing: EaseOutExpo,
      duration: reducedMotion ? 0 : 1500,
    });
    snapRef.current = carousel;

    const renderSlides = () => {
      carousel.slides.forEach(({ element, coord, isVisible }) => {
        element.style.transform = 'translate(' + coord + 'px, 0)';
        element.style.visibility = isVisible ? 'visible' : 'hidden';
      });
      container.classList.add('ready');
    };
    carousel.on('update', renderSlides);
    carousel.on('activeSlide', () => setActiveIndex(carousel.activeIndex));

    return () => {
      snapRef.current = null;
      carousel.destroy();
      container.classList.remove('ready');
    };
  }, [initialIndex, reducedMotion]);

  return (
    <div className="projects-section-demo__stage">
      <div
        ref={containerRef}
        className="projects-section-demo__viewport"
        dir="ltr"
        role="region"
        aria-roledescription="carousel"
        aria-label={pickLocaleText(locale, { en: 'Projects', fr: 'Projets', dz: 'المشاريع', tr: 'Projeler' })}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
            if (event.key === 'ArrowRight') snapRef.current?.next();
            else snapRef.current?.prev();
          }
        }}
        onPointerDown={(event) => {
          gestureRef.current = { x: event.clientX, y: event.clientY, moved: false };
        }}
        onPointerMove={(event) => {
          const gesture = gestureRef.current;
          if (Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) > 6) gesture.moved = true;
        }}
      >
        {projects.map((project, index) => {
          const image = getProjectHeroImage(project);
          const proof = homepageProjectProofs[project.slug];
          const cardTitle = localizedProjectCardTitle(project, locale);
          const isActive = index === activeIndex;
          const categories = projectCategories[project.slug] ?? ['residential'];
          const categoryLabel = categories.includes('residential') && categories.includes('commercial')
            ? pickLocaleText(locale, { en: 'Residential & commercial', fr: 'Résidentiel & commercial', dz: 'سكني وتجاري', tr: 'Konut ve ticari' })
            : pickLocaleText(locale, projectFilters.find((filter) => filter.id === categories[0])!.label);
          const statusLabel = project.status === 'current'
            ? pickLocaleText(locale, { en: 'Current', fr: 'En cours', dz: 'في طور الإنجاز', tr: 'Devam ediyor' })
            : pickLocaleText(locale, { en: 'Completed', fr: 'Livré', dz: 'مكمّل', tr: 'Tamamlandı' });

          return (
            <article
              key={project.slug}
              className={'projects-section-demo__slide' + (isActive ? ' is-active' : '')}
              aria-current={isActive ? 'true' : undefined}
            >
              <Link
                className="projects-section-demo__card"
                dir={locale === 'ar-DZ' ? 'rtl' : 'ltr'}
                to={localizedPath(locale, '/projects/' + project.slug)}
                tabIndex={isActive ? 0 : -1}
                aria-hidden={!isActive}
                aria-label={cardTitle}
                data-snap-parallax-scale={reducedMotion ? '0' : '-0.1'}
                data-snap-parallax-scale-abs=""
                data-snap-parallax-x={reducedMotion ? '0%' : '20%'}
                data-snap-parallax-x-scope="-2,2"
                data-snap-parallax-y={reducedMotion ? '0px' : '-28px'}
                data-snap-parallax-y-abs=""
                data-snap-parallax-rotate-y={reducedMotion ? '0deg' : '35deg'}
                onFocus={() => preloadRoute('/projects/' + project.slug)}
                onMouseEnter={() => isActive && preloadRoute('/projects/' + project.slug)}
                onClick={(event) => {
                  if (event.detail !== 0 && gestureRef.current.moved) {
                    event.preventDefault();
                    return;
                  }
                  if (!isActive) {
                    event.preventDefault();
                    snapRef.current?.toSlide(index);
                    return;
                  }
                  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                  event.preventDefault();
                  goTo('/projects/' + project.slug, image.src);
                }}
              >
                <img
                  className="projects-section-demo__image"
                  src={image.src}
                  alt={localized(image.alt, locale)}
                  width={1600}
                  height={1000}
                  draggable={false}
                  loading={Math.abs(index - initialIndex) <= 1 ? 'eager' : 'lazy'}
                  decoding="async"
                  data-snap-parallax-x={reducedMotion ? '0%' : '20%'}
                  data-snap-parallax-opacity="-0.2"
                />
                <span className="projects-section-demo__shade" aria-hidden="true" />
                <span
                  className="projects-section-demo__card-content"
                  data-snap-parallax-x={reducedMotion ? '0vw' : '20vw'}
                  data-snap-parallax-opacity="-2"
                  data-snap-parallax-opacity-scope="-0.5,0.5"
                >
                  <span className="projects-section-demo__category">{categoryLabel}</span>
                  <span className="projects-section-demo__project-meta">
                    <span>{statusLabel}</span><span aria-hidden="true">·</span><span>{project.location}</span>
                  </span>
                  <span className={'projects-section-demo__card-title' + (cardTitle.length > 86 ? ' is-extra-long' : cardTitle.length > 54 ? ' is-long' : '')}>{cardTitle}</span>
                  <span className="projects-section-demo__summary">
                    {proof ? localizeHome(proof, locale) : localizedProjectScope(project, locale)}
                  </span>
                  <span className="projects-section-demo__view-link">
                    {pickLocaleText(locale, { en: 'View project', fr: 'Voir le projet', dz: 'اكتشف المشروع', tr: 'Projeyi incele' })}
                    <ArrowRight size={22} strokeWidth={1.5} aria-hidden="true" />
                  </span>
                </span>
              </Link>
            </article>
          );
        })}
      </div>
      <button
        type="button"
        className="projects-section-demo__arrow projects-section-demo__arrow--previous"
        aria-label={pickLocaleText(locale, { en: 'Previous project', fr: 'Projet précédent', dz: 'المشروع السابق', tr: 'Önceki proje' })}
        onClick={() => snapRef.current?.prev()}
      ><ArrowLeft size={26} aria-hidden="true" /></button>
      <button
        type="button"
        className="projects-section-demo__arrow projects-section-demo__arrow--next"
        aria-label={pickLocaleText(locale, { en: 'Next project', fr: 'Projet suivant', dz: 'المشروع التالي', tr: 'Sonraki proje' })}
        onClick={() => snapRef.current?.next()}
      ><ArrowRight size={26} aria-hidden="true" /></button>
      <div className="projects-section-demo__pagination" role="group" aria-label={pickLocaleText(locale, { en: 'Choose a project', fr: 'Choisir un projet', dz: 'اختيار مشروع', tr: 'Proje seç' })}>
        {projects.map((project, index) => (
          <button
            key={project.slug}
            type="button"
            aria-label={localizedProjectShortTitle(project, locale)}
            aria-current={index === activeIndex ? 'true' : undefined}
            onClick={() => snapRef.current?.toSlide(index)}
          ><span /></button>
        ))}
      </div>
      <span className="sr-only" aria-live="polite">{localizedProjectShortTitle(projects[activeIndex], locale)}</span>
    </div>
  );
}

export default function FeaturedProjectsShowcase({ standalone = false }: { standalone?: boolean }) {
  const { locale } = useLocale();
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('all');
  const content = homepageContent.featuredProjects;
  const visibleProjects = useMemo(() => activeFilter === 'all'
    ? homeProjectCards
    : homeProjectCards.filter((project) => projectCategories[project.slug]?.includes(activeFilter)), [activeFilter]);
  const initialProjectSlug = activeFilter === 'all'
    ? 'said-hamdine-mixed-real-estate'
    : visibleProjects[Math.floor(visibleProjects.length / 2)]?.slug;
  const sectionTitle = localizeHome(content.title, locale);
  const titleParts = splitProjectsHeading(sectionTitle, locale);
  const Root = standalone ? 'main' : 'div';
  const Heading = standalone ? 'h1' : 'h2';

  return (
    <Root className={'projects-section-demo' + (standalone ? '' : ' projects-section-demo--embedded')} dir={locale === 'ar-DZ' ? 'rtl' : 'ltr'}>
      <section id={standalone ? undefined : 'proof'} className="projects-section-demo__section" aria-labelledby="projects-section-showcase-title">
        <div className="projects-section-demo__header">
          <div className="projects-section-demo__intro">
            <p className="projects-section-demo__eyebrow">
              <span aria-hidden="true" />
              <span>{localizeHome(content.eyebrow, locale)}</span>
            </p>
            <Heading className="projects-section-demo__heading" id="projects-section-showcase-title">
              {titleParts ? <><span>{titleParts[0]}</span><span className="projects-section-demo__heading-accent">{titleParts[1]}</span></> : sectionTitle}
            </Heading>
            <p className="projects-section-demo__lead">{localizeHome(content.lead, locale)}</p>
          </div>
          <div className="projects-section-demo__navigation">
            <div className="projects-section-demo__filters" role="group" aria-label={pickLocaleText(locale, { en: 'Filter projects', fr: 'Filtrer les projets', dz: 'تصفية المشاريع', tr: 'Projeleri filtrele' })}>
              {projectFilters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  className={`projects-section-demo__filter${activeFilter === filter.id ? ' is-active' : ''}`}
                  aria-pressed={activeFilter === filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                >{pickLocaleText(locale, filter.label)}</button>
              ))}
            </div>
            <Link className="projects-section-demo__all-link" to={localizedPath(locale, '/projects')}>
              <span>{pickLocaleText(locale, { en: 'See all projects', fr: 'Voir tous les projets', dz: 'كل المشاريع', tr: 'Tüm projeleri gör' })}</span>
              <ArrowRight size={20} strokeWidth={1.7} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <ProjectCarousel key={`${activeFilter}-${locale}`} projects={visibleProjects} initialProjectSlug={initialProjectSlug} locale={locale} />
      </section>
    </Root>
  );
}
