import { useEffect, useRef } from 'react';
import maplibregl, { type Map as MapLibreMap, type MapMouseEvent } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { projectMapPoints, type ProjectMapPoint } from '../data/projectMap';
import { useLocale } from '../i18n';

type ClusterId = ProjectMapPoint['cluster'];

type Props = {
  activeSlug: string;
  clusterFilter: ClusterId | 'all';
  onSelect: (slug: string) => void;
  prefersReducedMotion: boolean;
  ariaLabel: string;
};

// Light editorial palette — white 3D landmass on white page, gray-shaded walls
const WILAYA_DEFAULT   = '#f8f8f6';   // near-white top faces
const WILAYA_HIGHLIGHT = '#ececea';   // slightly deeper — project wilayas (color only)
const WILAYA_HOVER     = '#e8292e';   // red hover — vivid against light surface
const WILAYA_BORDER    = 'rgba(0,0,0,0.14)';
const SEA_BG           = '#ffffff';   // white — matches page section background

// Neighboring countries — warm sand tone vs. Algeria's cool near-white, with a soft drop
// shadow (see 'neighbors-shadow' layer) so they read as raised terrain, not flat cutouts.
const NEIGHBOR_FILL = '#e7e2d3';
const NEIGHBOR_LINE = 'rgba(107, 92, 63, 0.4)';

type MapLabel = { en: string; fr: string; 'ar-DZ': string; tr: string; coord: [number, number] };

// Hand-placed so labels sit on real landmass near Algeria's border rather than at a raw polygon centroid
// (several of these countries extend far beyond the frame, e.g. deep into the Sahara or northern Europe).
const NEIGHBOR_LABELS: MapLabel[] = [
  { en: 'MOROCCO', 'ar-DZ': 'المغرب', fr: 'MAROC', tr: 'FAS', coord: [-2.7, 34.9] },
  { en: 'TUNISIA', 'ar-DZ': 'تونس', fr: 'TUNISIE', tr: 'TUNUS', coord: [8.9, 36.2] },
  { en: 'SPAIN', 'ar-DZ': 'إسبانيا', fr: 'ESPAGNE', tr: 'İSPANYA', coord: [-2.6, 37.05] },
  { en: 'SARDINIA', 'ar-DZ': 'سردينيا', fr: 'SARDAIGNE', tr: 'SARDİNYA', coord: [9.05, 40.05] },
  { en: 'SICILY', 'ar-DZ': 'صقلية', fr: 'SICILE', tr: 'SİCİLYA', coord: [14.0, 37.55] },
];

// Uniform height — very low, just enough for a subtle 3D edge at the coast
const HEIGHT_BASE  = 3500;
const HEIGHT_HOVER = HEIGHT_BASE + 1;

const GEOJSON_URL   = '/geo/algeria-wilayas.json';
const NEIGHBORS_URL = '/geo/neighboring-countries.json';
const GLYPHS_URL    = 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf';

const COUNTRY_LABEL_POINT: [number, number] = [2.0, 35.05];
const SEA_LABEL_POINT: [number, number] = [2.0, 37.15];

const PIN_HTML = (num: number) => `
  <div class="igloo-map-pin" style="position:relative;width:34px;height:44px;filter:drop-shadow(0 5px 12px rgba(17,17,17,.40));transform-origin:50% 100%;cursor:pointer;transition:transform 220ms ease,opacity 220ms ease">
    <svg viewBox="0 0 34 44" width="34" height="44" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 2C9.8 2 4 7.8 4 15c0 10 13 27 13 27S30 25 30 15C30 7.8 24.2 2 17 2Z"
        fill="#c22026" stroke="#fff" stroke-width="2"/>
      <circle cx="17" cy="15" r="4.5" fill="rgba(255,255,255,0.28)"/>
    </svg>
    <span style="position:absolute;top:8px;left:0;width:100%;text-align:center;font-size:11px;font-weight:700;color:#fff;line-height:1;pointer-events:none">${num}</span>
  </div>`;

// Tight on the project belt — the coastal wilayas fill most of the frame, Spain is just a
// hint at the very top edge. Tunisia/Sardinia/Sicily/the wider coast still exist on the
// map's data layer and reveal themselves as the user pans or zooms out.
const INITIAL_BOUNDS: [[number, number], [number, number]] = [[-1.0, 35.2], [5.8, 37.7]];
const INITIAL_PITCH   = 52;
const INITIAL_BEARING = -18;

const CLUSTER_BOUNDS: Record<ClusterId, [[number, number], [number, number]]> = {
  'west-algiers':    [[2.45, 36.48], [3.12, 36.88]],
  'central-algiers': [[2.82, 36.65], [3.20, 36.84]],
  'east-algiers':    [[3.15, 36.63], [3.58, 36.86]],
  mostaganem:        [[-0.5,  35.65], [0.45, 36.15]],
  boumerdes:         [[3.28, 36.64], [3.62, 36.87]],
};

function buildStyle() {
  return {
    version: 8 as const,
    glyphs: GLYPHS_URL,
    // Neutral white light — bright top faces, soft gray shading on extrusion walls
    light: {
      anchor: 'map' as const,
      color: '#ffffff',
      intensity: 0.32,
      position: [1.5, 210, 40] as [number, number, number],
    },
    sources: {} as Record<string, never>,
    layers: [
      { id: 'bg', type: 'background' as const, paint: { 'background-color': SEA_BG } },
    ],
  };
}

export default function ProjectFootprintMap({
  activeSlug,
  clusterFilter,
  onSelect,
  prefersReducedMotion,
  ariaLabel,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<MapLibreMap | null>(null);
  const markersRef   = useRef<maplibregl.Marker[]>([]);
  const hoveredIdRef = useRef<string | number | null>(null);
  const { locale }   = useLocale();

  function buildMarkers(map: MapLibreMap) {
    markersRef.current.forEach(m => m.remove());
    markersRef.current = projectMapPoints.map((point, i) => {
      const wrap = document.createElement('div');
      wrap.innerHTML = PIN_HTML(i + 1);
      wrap.style.cssText = 'width:34px;height:44px;cursor:pointer';
      wrap.dataset.slug = point.slug;

      // Staggered drop-in animation
      const pin = wrap.querySelector('.igloo-map-pin') as HTMLElement | null;
      if (pin && !prefersReducedMotion) {
        pin.style.animationDelay = `${320 + i * 75}ms`;
        pin.classList.add('igloo-pin-drop');
      }

      const marker = new maplibregl.Marker({ element: wrap, anchor: 'bottom' })
        .setLngLat([point.lng, point.lat])
        .addTo(map);

      const popup = new maplibregl.Popup({
        offset: [0, -46],
        closeButton: false,
        closeOnClick: false,
        className: 'igloo-footprint-popup',
      }).setHTML(
        `<span class="igloo-map-tooltip-title">${point.menuTitle}</span>` +
        `<span class="igloo-map-tooltip-meta">${point.locality} — ${point.wilaya}</span>`,
      );

      wrap.addEventListener('mouseenter', () => {
        onSelect(point.slug);
        marker.setPopup(popup);
        popup.addTo(map);
      });
      wrap.addEventListener('mouseleave', () => popup.remove());
      wrap.addEventListener('click', () => {
        onSelect(point.slug);
        map.flyTo({
          center: [point.lng, point.lat],
          zoom: 11,
          pitch: INITIAL_PITCH,
          bearing: INITIAL_BEARING,
          duration: prefersReducedMotion ? 0 : 900,
          essential: true,
        });
      });

      return marker;
    });
  }

  function updateMarkers(slug: string, filter: ClusterId | 'all') {
    markersRef.current.forEach((marker, i) => {
      const point    = projectMapPoints[i];
      const isActive  = point.slug === slug;
      const isVisible = filter === 'all' || point.cluster === filter;
      const pin = marker.getElement().firstElementChild as HTMLElement | null;
      if (!pin) return;
      const path = pin.querySelector('path') as SVGPathElement | null;
      if (path) path.setAttribute('fill', isActive ? '#e82a2e' : '#c22026');
      pin.style.transform  = isActive ? 'scale(1.22)' : 'scale(1)';
      pin.style.opacity    = !isVisible && !isActive ? '0.28' : '1';
      pin.style.zIndex     = isActive ? '20' : isVisible ? '10' : '0';
      marker.getElement().style.zIndex = pin.style.zIndex;
    });
  }

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: buildStyle(),
      center: [1.5, 36.0] as [number, number],
      zoom: 5,
      pitch: INITIAL_PITCH,
      bearing: INITIAL_BEARING,
      cooperativeGestures: true,
      dragRotate: true,
      touchZoomRotate: true,
      attributionControl: false,
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left');
    mapRef.current = map;

    map.on('load', () => {
      map.fitBounds(INITIAL_BOUNDS, {
        padding: { top: 40, bottom: 10, left: 40, right: 40 },
        pitch: INITIAL_PITCH,
        bearing: INITIAL_BEARING,
        duration: 0,
      });

      // Neighboring countries and islands — flat (fill-extrusion on these huge polygons breaks
      // fitBounds' zoom calculation), but a translated dark copy underneath fakes a soft drop
      // shadow so they read as raised terrain instead of a flat cutout pasted on the sea.
      map.addSource('neighbors', {
        type: 'geojson',
        data: NEIGHBORS_URL,
      });
      map.addLayer({
        id: 'neighbors-shadow',
        type: 'fill',
        source: 'neighbors',
        paint: {
          'fill-color': 'rgba(60, 50, 30, 0.16)',
          'fill-translate': [7, 9],
          'fill-translate-anchor': 'viewport',
        },
      });
      map.addLayer({
        id: 'neighbors-fill',
        type: 'fill',
        source: 'neighbors',
        paint: { 'fill-color': NEIGHBOR_FILL, 'fill-opacity': 1 },
      });
      map.addLayer({
        id: 'neighbors-line',
        type: 'line',
        source: 'neighbors',
        paint: { 'line-color': NEIGHBOR_LINE, 'line-width': 1.1 },
      });

      // Neighbor/island name labels — muted, smaller than Algeria's own label
      map.addSource('neighbor-label', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: NEIGHBOR_LABELS.map((label) => ({
            type: 'Feature' as const,
            properties: { en: label.en, fr: label.fr, 'ar-DZ': label['ar-DZ'], tr: label.tr },
            geometry: { type: 'Point' as const, coordinates: label.coord },
          })),
        },
      });
      map.addLayer({
        id: 'neighbor-label',
        type: 'symbol',
        source: 'neighbor-label',
        layout: {
          'text-field': ['get', locale],
          'text-font': ['Noto Sans Regular'],
          'text-size': 11,
          'text-letter-spacing': 0.1,
        },
        paint: {
          'text-color': '#7a6f57',
          'text-halo-color': 'rgba(255,255,255,0.85)',
          'text-halo-width': 1.2,
        },
      });

      map.addSource('wilayas', {
        type: 'geojson',
        data: GEOJSON_URL,
        promoteId: 'iso',
      });

      // Base wilayas — project wilayas tower above base wilayas
      map.addLayer({
        id: 'wilaya-fill',
        type: 'fill-extrusion',
        source: 'wilayas',
        paint: {
          'fill-extrusion-color': [
            'case',
            ['==', ['get', 'highlighted'], 1], WILAYA_HIGHLIGHT,
            WILAYA_DEFAULT,
          ],
          'fill-extrusion-height': HEIGHT_BASE,
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 1,
          'fill-extrusion-vertical-gradient': true,
        },
      });

      // Hover layer — setFilter instead of feature-state avoids Z-fighting artifacts
      map.addLayer({
        id: 'wilaya-hover',
        type: 'fill-extrusion',
        source: 'wilayas',
        filter: ['boolean', false],
        paint: {
          'fill-extrusion-color': WILAYA_HOVER,
          'fill-extrusion-height': HEIGHT_HOVER,   // 25k vs 22k — subtle pop, not a skyscraper
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 1,
          'fill-extrusion-vertical-gradient': true,
        },
      });

      // Wilaya border lines
      map.addLayer({
        id: 'wilaya-line',
        type: 'line',
        source: 'wilayas',
        paint: {
          'line-color': WILAYA_BORDER,
          'line-width': 0.8,
          'line-opacity': 0.75,
        },
      });

      // Wilaya name labels — one per polygon, small and understated
      map.addLayer({
        id: 'wilaya-label',
        type: 'symbol',
        source: 'wilayas',
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Noto Sans Regular'],
          'text-size': 10.5,
          'text-letter-spacing': 0.02,
          'text-max-width': 7,
        },
        paint: {
          'text-color': '#5a5a58',
          'text-halo-color': 'rgba(255,255,255,0.85)',
          'text-halo-width': 1.1,
        },
      });

      // Country label — single anchor over northern Algeria
      map.addSource('country-label', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: { en: 'ALGERIA', fr: 'ALGÉRIE', 'ar-DZ': 'الجزائر', tr: 'CEZAYİR' },
            geometry: { type: 'Point', coordinates: COUNTRY_LABEL_POINT },
          }],
        },
      });
      map.addLayer({
        id: 'country-label',
        type: 'symbol',
        source: 'country-label',
        layout: {
          'text-field': ['get', locale],
          'text-font': ['Noto Sans Bold'],
          'text-size': 15,
          'text-letter-spacing': 0.14,
        },
        paint: {
          'text-color': '#2a2a28',
          'text-halo-color': 'rgba(255,255,255,0.9)',
          'text-halo-width': 1.4,
        },
      });

      // Sea label — italic, muted blue-gray, classic cartographic style
      map.addSource('sea-label', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: { en: 'MEDITERRANEAN SEA', fr: 'MER MÉDITERRANÉE', 'ar-DZ': 'البحر الأبيض المتوسط', tr: 'AKDENİZ' },
            geometry: { type: 'Point', coordinates: SEA_LABEL_POINT },
          }],
        },
      });
      map.addLayer({
        id: 'sea-label',
        type: 'symbol',
        source: 'sea-label',
        layout: {
          'text-field': ['get', locale],
          'text-font': ['Noto Sans Italic'],
          'text-size': 12,
          'text-letter-spacing': 0.16,
        },
        paint: {
          'text-color': '#9fb4c2',
          'text-halo-color': 'rgba(255,255,255,0.9)',
          'text-halo-width': 1.2,
        },
      });

      buildMarkers(map);
      updateMarkers(activeSlug, clusterFilter);

      const onWilayaHover = (e: MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => {
        if (!e.features?.length) return;
        const id = e.features[0].id;
        if (id == null || id === hoveredIdRef.current) return;
        hoveredIdRef.current = id;
        map.setFilter('wilaya-hover', ['==', ['id'], id]);
        map.getCanvas().style.cursor = 'pointer';
      };

      const onWilayaLeave = () => {
        if (hoveredIdRef.current === null) return;
        hoveredIdRef.current = null;
        map.setFilter('wilaya-hover', ['boolean', false]);
        map.getCanvas().style.cursor = '';
      };

      map.on('mousemove', 'wilaya-fill', onWilayaHover);
      map.on('mousemove', 'wilaya-hover', onWilayaHover);
      map.on('mouseleave', 'wilaya-fill', onWilayaLeave);
      map.on('mouseleave', 'wilaya-hover', onWilayaLeave);
    });

    return () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateMarkers(activeSlug, clusterFilter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSlug, clusterFilter]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const applyLocale = () => {
      if (map.getLayer('country-label')) {
        map.setLayoutProperty('country-label', 'text-field', ['get', locale]);
      }
      if (map.getLayer('sea-label')) {
        map.setLayoutProperty('sea-label', 'text-field', ['get', locale]);
      }
      if (map.getLayer('neighbor-label')) {
        map.setLayoutProperty('neighbor-label', 'text-field', ['get', locale]);
      }
    };
    if (map.isStyleLoaded()) applyLocale();
    else map.once('load', applyLocale);
  }, [locale]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const dur = prefersReducedMotion ? 0 : 900;

    if (clusterFilter === 'all') {
      map.fitBounds(INITIAL_BOUNDS, {
        padding: { top: 40, bottom: 10, left: 40, right: 40 },
        pitch: INITIAL_PITCH,
        bearing: INITIAL_BEARING,
        duration: dur,
      });
    } else {
      const bounds = CLUSTER_BOUNDS[clusterFilter];
      if (bounds) {
        map.fitBounds(bounds, {
          padding: { top: 60, bottom: 60, left: 60, right: 60 },
          pitch: 56,
          bearing: -18,
          maxZoom: 12,
          duration: dur,
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clusterFilter, prefersReducedMotion]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const pt = projectMapPoints.find(p => p.slug === activeSlug);
    if (!pt) return;
    const ll = new maplibregl.LngLat(pt.lng, pt.lat);
    if (!map.getBounds().contains(ll)) {
      map[prefersReducedMotion ? 'jumpTo' : 'panTo'](ll, { duration: 600 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSlug, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      role="region"
      aria-label={ariaLabel}
    />
  );
}
