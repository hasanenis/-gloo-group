import { useRef } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import { motionDuration, motionEase, usePrefersReducedMotion } from '../lib/motion';
import { homeProjectCards, localizedProjectCardTitle, localizedProjectScope } from '../data/projects';
import { localized } from '../data/projectContent';
import { homepageContent, homepageProjectProofs, localize as localizeHome } from '../data/homepageContent';
import { getProjectHeroImage } from '../data/projectHeroImage';
import { pickLocaleText, useLocale } from '../i18n';
import { useSiteNavigate } from '../hooks/useSiteNavigate';
import { useHomeTextReveal } from '../hooks/useHomeTextReveal';
import { Button } from './ui/button';
import { IconButton } from './ui/icon-button';
import { SectionHeader } from './ui/section-header';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import CardCarousel, { CarouselProgressBar } from './CardCarousel';

const PROJECTS = homeProjectCards;

function ProjectCard({ project }: { project: (typeof PROJECTS)[number] }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { locale, t } = useLocale();
  const goTo = useSiteNavigate();
  const image = getProjectHeroImage(project);
  const proof = homepageProjectProofs[project.slug];
  const cardTitle = localizedProjectCardTitle(project, locale);

  const handleMouseEnter = () => {
    if (!cardRef.current || prefersReducedMotion) return;
    const q = gsap.utils.selector(cardRef.current);
    gsap.to(q('.project-img'), { scale: 1.03, duration: motionDuration.hover, ease: motionEase.soft });
    gsap.to(q('.overlay'), {
      y: '58%',
      backgroundColor: 'rgba(0,0,0,0.88)',
      duration: motionDuration.hover,
      ease: motionEase.soft,
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || prefersReducedMotion) return;
    const q = gsap.utils.selector(cardRef.current);
    gsap.to(q('.project-img'), { scale: 1, duration: motionDuration.hover, ease: motionEase.soft });
    gsap.to(q('.overlay'), {
      y: '0%',
      backgroundColor: 'rgba(0,0,0,0.4)',
      duration: motionDuration.hover,
      ease: motionEase.soft,
    });
  };

  return (
    <Link
      ref={cardRef}
      to={`/projects/${project.slug}`}
      className="group relative block h-[58vh] min-h-[340px] max-h-[580px] w-full cursor-pointer overflow-hidden bg-black"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(event) => {
        event.preventDefault();
        goTo(`/projects/${project.slug}`, image?.src);
      }}
    >
      {image && (
        <img
          src={image.src}
          alt={localized(image.alt, locale)}
          className="project-img absolute inset-0 h-full w-full origin-center object-cover will-change-transform"
        />
      )}
      <div className="overlay pointer-events-none absolute inset-0 bg-black/40" />
      <div data-cursor-card data-cursor-label="VIEW" className="absolute inset-0" />

      <div className="pointer-events-none absolute bottom-0 left-0 z-10 flex h-[70%] w-full flex-col justify-end p-6 md:p-8">
        <div className="mb-3 flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/72">
          <span
            data-home-text-reveal
            data-home-text-reveal-mode="block"
          >
            {project.status === 'current'
              ? pickLocaleText(locale, { en: 'Current', fr: 'En cours', dz: 'في طور الإنجاز', tr: 'Devam ediyor' })
              : pickLocaleText(locale, { en: 'Completed', fr: 'Livré', dz: 'مكمّل', tr: 'Tamamlandı' })}
          </span>
          <span className="h-1 w-1 rotate-45 bg-[#e82a2e]" />
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3 w-3" />
            <span
              data-home-text-reveal
              data-home-text-reveal-mode="block"
            >
              {project.location}
            </span>
          </span>
        </div>
        <h3
          className="mb-3 max-w-[92%] font-sans text-[21px] font-semibold leading-[1.2] tracking-normal text-white drop-shadow-sm md:text-[24px]"
          data-home-text-reveal
          data-home-text-reveal-start="top 88%"
        >
          {cardTitle}
        </h3>
        <p
          className="text-[13px] font-light leading-relaxed text-white/85 md:text-[14px]"
          data-home-text-reveal
          data-home-text-reveal-start="top 88%"
        >
          {proof ? localizeHome(proof, locale) : localizedProjectScope(project, locale)}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/85">
          <span
            data-home-text-reveal
            data-home-text-reveal-mode="block"
          >
            {t('openProject')}
          </span>
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

export default function FeaturedProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const { locale, t } = useLocale();
  const goTo = useSiteNavigate();
  const content = homepageContent.featuredProjects;

  useHomeTextReveal(sectionRef, [locale]);

  return (
    <section id="proof" ref={sectionRef} className="w-full bg-white py-20 font-sans md:py-28">
      <div className="w-full px-8 pb-8 md:px-14 md:pb-12">
        <SectionHeader
          className="featured-projects-header mx-auto w-full max-w-[1526px]"
          eyebrowLabel={localizeHome(content.eyebrow, locale)}
          title={localizeHome(content.title, locale)}
          description={localizeHome(content.lead, locale)}
          reveal
          action={(
            <Button
              asChild
              variant="outline"
              size="sm"
              className="whitespace-nowrap"
            >
              <a
                href="/projects"
                onClick={(event) => {
                  event.preventDefault();
                  goTo('/projects');
                }}
              >
                {t('seeAllProjects')}
              </a>
            </Button>
          )}
        />
      </div>

      <div className="w-full">
        <CardCarousel
          items={PROJECTS}
          getKey={(project) => String(project.id)}
          ariaLabel={pickLocaleText(locale, { en: 'Featured projects', fr: 'Projets à la une', dz: 'مشاريع مختارة', tr: 'Öne çıkan projeler' })}
          spaceBetween={28}
          trackClassName="!px-8 md:!px-14 !pb-2"
          slideClassName="!w-[82vw] sm:!w-[410px] lg:!w-[500px]"
          renderItem={(project) => <ProjectCard project={project} />}
          controls={({ prev, next, canPrev, canNext, activeIndex, count, progress }) => (
            <TooltipProvider delayDuration={120}>
              <div className="mx-auto mt-8 flex w-full max-w-[1526px] items-center gap-5 px-8 md:mt-10 md:gap-7 md:px-14">
                <div className="flex shrink-0 items-center gap-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <IconButton
                        type="button"
                        variant="outline"
                        size="sm"
                        aria-label={t('previous')}
                        onClick={prev}
                        disabled={!canPrev}
                      >
                        <ArrowLeft className="h-4 w-4" strokeWidth={2} />
                      </IconButton>
                    </TooltipTrigger>
                    <TooltipContent>{t('previous')}</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <IconButton
                        type="button"
                        variant="outline"
                        size="sm"
                        aria-label={t('next')}
                        onClick={next}
                        disabled={!canNext}
                      >
                        <ArrowRight className="h-4 w-4" strokeWidth={2} />
                      </IconButton>
                    </TooltipTrigger>
                    <TooltipContent>{t('next')}</TooltipContent>
                  </Tooltip>
                </div>
                <CarouselProgressBar progress={progress} className="max-w-[260px] flex-1 bg-black/10" />
                <span className="shrink-0 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.18em] text-black/45">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                </span>
              </div>
            </TooltipProvider>
          )}
        />
      </div>
    </section>
  );
}
