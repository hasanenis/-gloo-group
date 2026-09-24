import { useMemo, useState } from 'react';
import { ComposableMap, Geography, Geographies, Marker } from 'react-simple-maps/core';
import { ZoomableGroup } from 'react-simple-maps/zoom';
import { Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, RotateCcw } from 'lucide-react';
import type { Feature, Geometry } from 'geojson';
import { projectMapPoints, type ProjectMapPoint } from '../data/projectMap';
import { getProjectHeroImage } from '../data/projectHeroImage';
import { projects } from '../data/projects';
import { useLocale } from '../i18n';

const GEO_URL = '/geo/algeria-wilayas.json';
const HIGHLIGHTED_WILAYAS = new Set(['Tipaza', 'Algiers', 'Mostaganem', 'Boumerdes']);
const CLUSTERS: Array<{ id: ProjectMapPoint['cluster'] | 'all'; label: string }> = [
  { id: 'all', label: 'All projects' },
  { id: 'west-algiers', label: 'West / Tipaza' },
  { id: 'central-algiers', label: 'Central Algiers' },
  { id: 'east-algiers', label: 'East / Boumerdes' },
  { id: 'mostaganem', label: 'Mostaganem' },
  { id: 'boumerdes', label: 'Boumerdes' },
];

type GeographyFeature = {
  rsmKey: string;
  properties?: { name?: string };
};

// The existing boundary file is planar GeoJSON with counter-clockwise exterior
// rings. d3-geo interprets polygon winding on a sphere, so reverse the rings
// before handing the same file to React Simple Maps; otherwise it fills the
// complement of Algeria and the SVG appears as one giant rectangle.
function rewindGeographies(features: Feature<Geometry>[]) {
  return features.map((feature) => {
    if (feature.geometry.type === 'Polygon') {
      return {
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates: feature.geometry.coordinates.map((ring) => [...ring].reverse()),
        },
      };
    }

    if (feature.geometry.type === 'MultiPolygon') {
      return {
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates: feature.geometry.coordinates.map((polygon) =>
            polygon.map((ring) => [...ring].reverse()),
          ),
        },
      };
    }

    return feature;
  });
}

function projectName(slug: string) {
  return projects.find((project) => project.slug === slug)?.menuTitle ?? slug;
}

export default function MapSimpleDemo() {
  const { locale } = useLocale();
  const [activeSlug, setActiveSlug] = useState(projectMapPoints[0]?.slug ?? '');
  const [clusterFilter, setClusterFilter] = useState<ProjectMapPoint['cluster'] | 'all'>('all');
  const [hoveredWilaya, setHoveredWilaya] = useState('');
  const [position, setPosition] = useState({ coordinates: [2.6, 35.5] as [number, number], zoom: 1 });

  const visiblePoints = useMemo(
    () => clusterFilter === 'all'
      ? projectMapPoints
      : projectMapPoints.filter((point) => point.cluster === clusterFilter),
    [clusterFilter],
  );
  const activePoint = projectMapPoints.find((point) => point.slug === activeSlug) ?? projectMapPoints[0];
  const activeImage = activePoint
    ? getProjectHeroImage(projects.find((project) => project.slug === activePoint.slug) ?? projects[0])
    : null;

  const selectCluster = (cluster: ProjectMapPoint['cluster'] | 'all') => {
    setClusterFilter(cluster);
    const next = cluster === 'all'
      ? projectMapPoints[0]
      : projectMapPoints.find((point) => point.cluster === cluster);
    if (next) setActiveSlug(next.slug);
  };

  return (
    <main className="min-h-screen bg-[#f5f4ef] px-5 pb-20 pt-28 text-[#171716] md:px-10 md:pt-36">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <Link to={`/${locale}/`} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-black/55 transition-colors hover:text-[#c22026]">
            <ArrowLeft size={15} /> Back to site
          </Link>
          <span className="rounded-full border border-black/12 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
            Local experiment · SVG / no WebGL
          </span>
        </div>

        <div className="grid gap-8 border-y border-black/12 py-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(300px,0.5fr)] lg:items-end">
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#c22026]">React Simple Maps</p>
            <h1 className="max-w-4xl text-[clamp(2.6rem,7vw,6.8rem)] font-semibold leading-[0.9] tracking-[-0.055em]">
              A lighter footprint map.
            </h1>
          </div>
          <p className="max-w-[38rem] text-[15px] leading-[1.75] text-black/60">
            Aynı wilaya GeoJSON ve mevcut proje koordinatlarıyla çalışan, MapLibre alternatifi bir SVG denemesi. Pan/zoom, hover, filtre ve proje marker etkileşimi burada izole olarak test ediliyor.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Project cluster filter">
          {CLUSTERS.map((cluster) => (
            <button
              key={cluster.id}
              type="button"
              onClick={() => selectCluster(cluster.id)}
              className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors ${
                clusterFilter === cluster.id
                  ? 'border-[#c22026] bg-[#c22026] text-white'
                  : 'border-black/12 bg-white text-black/55 hover:border-black/30 hover:text-black'
              }`}
              aria-pressed={clusterFilter === cluster.id}
            >
              {cluster.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_350px] xl:items-start">
          <section className="relative overflow-hidden border border-black/10 bg-white shadow-[0_24px_70px_rgba(35,31,24,0.08)]" aria-label="React Simple Maps Algeria project map">
            <div className="pointer-events-none absolute inset-x-10 top-7 z-10 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-black/35">
              <span>Algeria · project footprint</span>
              <span>{hoveredWilaya || 'Hover a wilaya'}</span>
            </div>
            <div className="aspect-[1.42] w-full min-h-[420px] bg-[#fbfaf7] md:min-h-[560px]">
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{ center: [2.6, 35.2], scale: 3600 }}
                width={1000}
                height={700}
                className="h-full w-full"
                role="img"
                aria-label="Map of Algeria and Igloo Construction projects"
              >
                <ZoomableGroup
                  center={position.coordinates}
                  zoom={position.zoom}
                  minZoom={0.8}
                  maxZoom={4}
                  onMoveEnd={({ coordinates, zoom }) => setPosition({ coordinates, zoom })}
                >
                  <Geographies geography={GEO_URL} parseGeographies={rewindGeographies}>
                    {({ geographies }) => geographies.map((geo) => {
                      const feature = geo as GeographyFeature;
                      const name = feature.properties?.name ?? '';
                      const highlighted = HIGHLIGHTED_WILAYAS.has(name);

                      return (
                        <Geography
                          key={feature.rsmKey}
                          geography={geo}
                          fill={hoveredWilaya === name ? '#c22026' : highlighted ? '#e7c3c2' : '#ebe9e1'}
                          stroke="#ffffff"
                          strokeWidth={hoveredWilaya === name ? 1 : 0.65}
                          onMouseEnter={() => setHoveredWilaya(name)}
                          onMouseLeave={() => setHoveredWilaya('')}
                          style={{ outline: 'none' }}
                        />
                      );
                    })}
                  </Geographies>

                  {visiblePoints.map((point, index) => {
                    const selected = point.slug === activeSlug;

                    return (
                      <Marker
                        key={point.slug}
                        coordinates={[point.lng, point.lat]}
                        onClick={() => setActiveSlug(point.slug)}
                        onMouseEnter={() => setActiveSlug(point.slug)}
                      >
                        <g className="cursor-pointer" aria-label={`${point.menuTitle}, ${point.locality}`}>
                          <circle r={selected ? 18 : 13} fill="white" opacity="0.92" />
                          <circle r={selected ? 13 : 10} fill={selected ? '#e82a2e' : '#c22026'} stroke="white" strokeWidth="2" />
                          <text textAnchor="middle" y="4" fill="white" fontSize={selected ? 10 : 8} fontWeight="700">
                            {index + 1}
                          </text>
                        </g>
                      </Marker>
                    );
                  })}
                </ZoomableGroup>
              </ComposableMap>
            </div>

            <div className="absolute bottom-5 left-5 z-10 flex gap-2">
              <button type="button" onClick={() => setPosition((current) => ({ ...current, zoom: Math.min(4, current.zoom + 0.35) }))} className="rounded-full border border-black/10 bg-white p-2.5 shadow-sm hover:bg-black hover:text-white" aria-label="Zoom in"><Plus size={16} /></button>
              <button type="button" onClick={() => setPosition((current) => ({ ...current, zoom: Math.max(0.8, current.zoom - 0.35) }))} className="rounded-full border border-black/10 bg-white p-2.5 shadow-sm hover:bg-black hover:text-white" aria-label="Zoom out"><Minus size={16} /></button>
              <button type="button" onClick={() => setPosition({ coordinates: [2.6, 35.5], zoom: 1 })} className="rounded-full border border-black/10 bg-white p-2.5 shadow-sm hover:bg-black hover:text-white" aria-label="Reset map"><RotateCcw size={16} /></button>
            </div>
          </section>

          {activePoint && (
            <aside className="border border-black/10 bg-white p-6 shadow-[0_24px_70px_rgba(35,31,24,0.06)]">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#c22026]">Selected project</p>
              <h2 className="text-2xl font-semibold leading-tight">{projectName(activePoint.slug)}</h2>
              <p className="mt-2 text-sm text-black/45">{activePoint.locality} · {activePoint.wilaya}</p>
              <p className="mt-5 text-sm leading-[1.75] text-black/65">{activePoint.scope}</p>
              {activeImage && (
                <img src={activeImage.src} alt={activeImage.alt[locale] ?? activeImage.alt.en} className="mt-6 aspect-[4/3] w-full rounded object-cover" loading="lazy" />
              )}
              <Link to={`/${locale}/projects/${activePoint.slug}`} className="mt-6 flex items-center justify-center gap-2 rounded bg-[#c22026] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#a81b21]">
                Open project <ArrowLeft className="rotate-180" size={16} />
              </Link>
              <dl className="mt-7 grid grid-cols-2 gap-3 border-t border-black/10 pt-5 text-xs">
                <div><dt className="text-black/40">Accuracy</dt><dd className="mt-1 font-semibold">{activePoint.accuracy}</dd></div>
                <div><dt className="text-black/40">Map engine</dt><dd className="mt-1 font-semibold">SVG / d3-geo</dd></div>
              </dl>
            </aside>
          )}
        </div>

        <p className="mt-8 text-xs leading-relaxed text-black/45">
          Demo not production-mounted: the existing MapLibre map remains unchanged. This route is only for comparing bundle weight, visual control, hover behavior and mobile interaction.
        </p>
      </div>
    </main>
  );
}
