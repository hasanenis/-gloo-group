import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Map as MapIcon, MapPin, Route } from 'lucide-react';
import { pickLocaleText, useLocale, type LocalizedString } from '../i18n';
import { usePrefersReducedMotion } from '../lib/motion';
import { homepageContent, homepageProjectProofs, localize } from '../data/homepageContent';
import { projectMapPoints, type ProjectMapPoint } from '../data/projectMap';
import { projects } from '../data/projects';
import { getProjectHeroImage } from '../data/projectHeroImage';
import { cn } from '../lib/utils';
import { useHomeTextReveal } from '../hooks/useHomeTextReveal';
import ProjectFootprintMap from './ProjectFootprintMap';

type ClusterId = ProjectMapPoint['cluster'];

const CLUSTERS: { id: ClusterId | 'all'; en: string; fr: string }[] = [
  { id: 'all', en: 'All locations', fr: 'Tous les sites' },
  { id: 'west-algiers', en: 'West Algiers / Tipaza', fr: 'Alger Ouest / Tipaza' },
  { id: 'central-algiers', en: 'Central Algiers', fr: 'Alger Centre' },
  { id: 'east-algiers', en: 'East Algiers / Boumerdes', fr: 'Alger Est / Boumerdès' },
  { id: 'mostaganem', en: 'Mostaganem', fr: 'Mostaganem' },
  { id: 'boumerdes', en: 'Boumerdes', fr: 'Boumerdès' },
];

const CLUSTER_LABELS: Record<ClusterId, { en: string; fr: string }> = {
  'west-algiers': { en: 'West Algiers / Tipaza', fr: 'Alger Ouest / Tipaza' },
  'central-algiers': { en: 'Central Algiers', fr: 'Alger Centre' },
  'east-algiers': { en: 'East Algiers / Boumerdes', fr: 'Alger Est / Boumerdès' },
  mostaganem: { en: 'Mostaganem', fr: 'Mostaganem' },
  boumerdes: { en: 'Boumerdes', fr: 'Boumerdès' },
};

const STAT_ICONS = [MapPin, MapIcon, Route];

export default function ProjectFootprintSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { locale } = useLocale();
  const prefersReducedMotion = usePrefersReducedMotion();
  const copy = homepageContent.footprint;

  const [clusterFilter, setClusterFilter] = useState<ClusterId | 'all'>('all');
  const [activeSlug, setActiveSlug] = useState(projectMapPoints[0]?.slug ?? '');

  useHomeTextReveal(sectionRef, [locale]);

  useEffect(() => {
    const visiblePoints = clusterFilter === 'all'
      ? projectMapPoints
      : projectMapPoints.filter((point) => point.cluster === clusterFilter);

    if (!visiblePoints.some((point) => point.slug === activeSlug)) {
      setActiveSlug(visiblePoints[0]?.slug ?? projectMapPoints[0]?.slug ?? '');
    }
  }, [activeSlug, clusterFilter]);

  const activePoint = projectMapPoints.find((point) => point.slug === activeSlug) ?? projectMapPoints[0];
  const activeProof = activePoint ? homepageProjectProofs[activePoint.slug] : null;

  const activeImage = useMemo(() => {
    if (!activePoint) return null;
    const record = projects.find((project) => project.slug === activePoint.slug);
    return record ? getProjectHeroImage(record) : null;
  }, [activePoint]);

  const clusterCount = (id: ClusterId | 'all') =>
    id === 'all' ? projectMapPoints.length : projectMapPoints.filter((point) => point.cluster === id).length;

  return (
    <section ref={sectionRef} className="w-full bg-white px-6 pb-32 pt-20 font-sans md:px-14 md:py-24">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-8 border-y border-black/10 py-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(360px,0.35fr)] lg:items-end">
          <div>
            <p
              className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#c22026]"
              data-home-text-reveal
              data-home-text-reveal-mode="block"
            >
              {localize(copy.eyebrow, locale)}
            </p>
            <h2
              className="text-[2.35rem] font-semibold leading-none tracking-normal text-black md:text-[4rem]"
              data-home-text-reveal
              data-home-text-reveal-start="top 84%"
            >
              {localize(copy.title, locale)}
            </h2>
          </div>
          <p
            className="max-w-[42rem] text-[15px] leading-[1.75] text-black/58 md:text-[16px]"
            data-home-text-reveal
            data-home-text-reveal-start="top 88%"
          >
            {localize(copy.lead, locale)}
          </p>
        </div>

        <div className="mt-7 flex flex-wrap items-end gap-x-6 gap-y-1 border-b border-black/10">
          {CLUSTERS.filter((cluster) => clusterCount(cluster.id) > 0).map((cluster) => (
            <button
              key={cluster.id}
              type="button"
              onClick={() => setClusterFilter(cluster.id)}
              className={cn(
                'relative pb-3 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c22026]/35',
                clusterFilter === cluster.id ? 'text-[#c22026]' : 'text-black/50 hover:text-black/75',
              )}
              aria-pressed={clusterFilter === cluster.id}
            >
              {locale === 'fr' ? cluster.fr : cluster.en}
              <span className="ml-1.5 text-[11px] font-normal opacity-55">{clusterCount(cluster.id)}</span>
              {clusterFilter === cluster.id && (
                <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#c22026]" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-9 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
          <div className="min-w-0">
            <div className="igloo-footprint-map relative h-[420px] overflow-hidden bg-white md:h-[560px]">
              <ProjectFootprintMap
                activeSlug={activeSlug}
                clusterFilter={clusterFilter}
                onSelect={setActiveSlug}
                prefersReducedMotion={prefersReducedMotion}
                ariaLabel="Interactive map of Igloo Construction project locations across Algeria"
              />
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {copy.stats.map((stat, index) => {
                const Icon = STAT_ICONS[index] ?? MapPin;

                return (
                  <div key={stat.label.en} className="flex items-center gap-3 border border-black/10 bg-white px-4 py-3">
                    <Icon className="h-4 w-4 text-[#c22026]" strokeWidth={1.9} />
                    <div className="min-w-0">
                      <div
                        className="text-[20px] font-semibold leading-none text-black"
                        data-home-text-reveal
                        data-home-text-reveal-mode="block"
                      >
                        {stat.value}
                      </div>
                      <div
                        className="text-[13px] leading-snug text-black/56"
                        data-home-text-reveal
                        data-home-text-reveal-mode="line"
                      >
                        {localize(stat.label, locale)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {activePoint && (
            <aside className="border border-black/10 bg-white p-6 shadow-sm">
              <p
                className="mb-4 text-[11px] font-bold uppercase tracking-[0.20em] text-[#c22026]"
                data-home-text-reveal
                data-home-text-reveal-mode="block"
              >
                {localize(copy.selectedLabel, locale)}
              </p>
              <h3
                className="mb-1.5 text-[24px] font-semibold leading-tight tracking-normal text-black"
                data-home-text-reveal
                data-home-text-reveal-start="top 88%"
              >
                {activePoint.menuTitle}
              </h3>
              <p
                className="mb-4 text-[14px] text-black/45"
                data-home-text-reveal
                data-home-text-reveal-mode="block"
              >
                {activePoint.locality} · {activePoint.wilaya}
              </p>
              <p
                className="mb-5 text-[14px] leading-relaxed text-black/68"
                data-home-text-reveal
                data-home-text-reveal-start="top 88%"
              >
                {activeProof ? localize(activeProof, locale) : activePoint.scope}
              </p>
              <div className="mb-5 flex flex-wrap items-center gap-2 text-[13px]">
                <MapPin size={14} strokeWidth={2} className="text-black/45" />
                <span
                  className="text-black/60"
                  data-home-text-reveal
                  data-home-text-reveal-mode="block"
                >
                  {localize(CLUSTER_LABELS[activePoint.cluster], locale)}
                </span>
                <span className="text-black/20">|</span>
                <span
                  className={cn(
                    'font-medium',
                    activePoint.status === 'completed' ? 'text-emerald-600' : 'text-amber-600',
                  )}
                  data-home-text-reveal
                  data-home-text-reveal-mode="block"
                >
                  {activePoint.status === 'completed' ? localize(copy.statusCompleted, locale) : localize(copy.statusInProgress, locale)}
                </span>
              </div>

              {activeImage && (
                <div className="mb-5 overflow-hidden rounded-md">
                  <img
                    src={activeImage.src}
                    alt={activeImage.alt[locale]}
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              <Link
                to={`/projects/${activePoint.slug}`}
                className="mt-auto flex items-center justify-center gap-2 rounded-md bg-[#c22026] px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#a81b21]"
              >
                <span
                  data-home-text-reveal
                  data-home-text-reveal-mode="block"
                >
                  {localize(copy.openProject, locale)}
                </span>
                <ArrowRight size={16} strokeWidth={2.2} />
              </Link>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
