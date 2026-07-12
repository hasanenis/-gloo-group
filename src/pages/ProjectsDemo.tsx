import { useEffect, useLayoutEffect, useRef, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { localizedProjectCardTitle, projects } from '../data/projects';
import { getProjectHeroImage } from '../data/projectHeroImage';
import { localized } from '../data/projectContent';
import { useSiteNavigate } from '../hooks/useSiteNavigate';
import { usePrefersReducedMotion } from '../lib/motion';
import { pickLocaleText, useLocale } from '../i18n';
import Footer from '../components/Footer';
import '../styles/projects-bat-grid.css';

gsap.registerPlugin(ScrollTrigger);

/* Card span sequence measured on new.bat.archi/projects (16-col grid):
   rows of [4,6,6] → [10,6] → [6,6,4] → [6,10], repeating every 10 cards */
const GRID_SPANS = [4, 6, 6, 10, 6, 6, 6, 4, 6, 10] as const;

export default function ProjectsDemo() {
  const goTo = useSiteNavigate();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { locale } = useLocale();

  const rootRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);

  cardRefs.current = [];

  /* Scroll parallax inside the image boxes — the oversized layer drifts
     with scroll, same as the reference's 1.5x-scaled pictures */
  useLayoutEffect(() => {
    if (prefersReducedMotion || !gridRef.current) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-pjx-parallax]').forEach((layer) => {
        gsap.fromTo(
          layer,
          { yPercent: -9 },
          {
            yPercent: 9,
            ease: 'none',
            scrollTrigger: {
              trigger: layer.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    }, gridRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  /* Card reveal on scroll */
  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
    if (!cards.length) return;

    if (prefersReducedMotion) {
      cards.forEach((card) => card.classList.add('is-revealed'));
      return;
    }

    cards.forEach((card) => card.classList.remove('is-revealed'));

    if (!('IntersectionObserver' in window)) {
      cards.forEach((card) => card.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.01,
      },
    );

    cards.forEach((card) => observer.observe(card));

    const fallback = window.setTimeout(() => {
      cards.forEach((card) => card.classList.add('is-revealed'));
      observer.disconnect();
    }, 2500);

    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, [prefersReducedMotion]);

  return (
    <main ref={rootRef} className="pjx-page">
      <h1 className="sr-only">{pickLocaleText(locale, { en: 'Igloo Construction projects', fr: 'Projets Igloo Construction', dz: 'مشاريع Igloo Construction', tr: 'Igloo Construction projeleri' })}</h1>

      {/* 16-col BAT grid — projects only, no filter bar */}
      <div ref={gridRef} className="pjx-grid">
        {projects.map((project, index) => {
          const heroImage = getProjectHeroImage(project);
          const targetPath = `/projects/${project.slug}`;
          const span = GRID_SPANS[index % GRID_SPANS.length];

          return (
            <article
              key={project.slug}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              data-span={span}
              className="pjx-card project-reveal"
              style={{ '--pjx-reveal-delay': `${(index % 3) * 90}ms` } as CSSProperties}
            >
              <Link
                to={targetPath}
                className="pjx-card__link"
                onPointerEnter={() => {
                  const image = new Image();
                  image.decoding = 'async';
                  image.src = heroImage.src;
                  void image.decode?.().catch(() => undefined);
                }}
                onClick={(event) => {
                  event.preventDefault();
                  goTo(targetPath, heroImage.src);
                }}
              >
                <div
                  className="pjx-card__image"
                  data-cursor-card
                  data-cursor-label="VIEW"
                >
                  <div className="pjx-card__parallax" data-pjx-parallax>
                    <img
                      src={heroImage.src}
                      alt={localized(heroImage.alt, locale)}
                      loading={index < 3 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                  </div>
                </div>

                <h2 className="pjx-card__label">{localizedProjectCardTitle(project, locale)}</h2>
              </Link>
            </article>
          );
        })}
      </div>

      <Footer />
    </main>
  );
}
