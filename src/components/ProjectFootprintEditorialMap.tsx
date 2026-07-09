import { useEffect, useMemo, useState } from 'react';
import { projectMapPoints, coordinateToMapPosition, type ProjectMapPoint, type ProjectMapBounds } from '../data/projectMap';
import { useLocale } from '../i18n';
import { cn } from '../lib/utils';

type ClusterId = ProjectMapPoint['cluster'];

type Coordinate = [number, number];
type PolygonCoordinates = Coordinate[][];
type MultiPolygonCoordinates = PolygonCoordinates[];

type GeoFeature = {
  type: 'Feature';
  properties: Record<string, string | number | undefined>;
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: PolygonCoordinates | MultiPolygonCoordinates;
  };
};

type GeoCollection = {
  type: 'FeatureCollection';
  features: GeoFeature[];
};

type ProjectFootprintEditorialMapProps = {
  activeSlug: string;
  clusterFilter: ClusterId | 'all';
  onSelect: (slug: string) => void;
  ariaLabel: string;
};

const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 362;
const HIGHLIGHTED_WILAYAS = new Set(['tipaza', 'algiers', 'mostaganem', 'boumerdes']);

// Focused on the northern coastal belt (where every project sits), widened just far enough
// that Morocco's and Tunisia's border ranges genuinely enter the frame for context.
const NORTH_FOCUS_BOUNDS: ProjectMapBounds = {
  minLat: 34.2,
  maxLat: 37.6,
  minLng: -1.6,
  maxLng: 7.8,
};

const COUNTRY_LABEL: Coordinate = [2.0, 35.0];
const SEA_LABEL: Coordinate = [2.0, 37.32];

function normalizeName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\w]+/g, '')
    .toLowerCase();
}

function coordinateToSvg([lng, lat]: Coordinate) {
  const x = ((lng - NORTH_FOCUS_BOUNDS.minLng) / (NORTH_FOCUS_BOUNDS.maxLng - NORTH_FOCUS_BOUNDS.minLng)) * VIEWBOX_WIDTH;
  const y = ((NORTH_FOCUS_BOUNDS.maxLat - lat) / (NORTH_FOCUS_BOUNDS.maxLat - NORTH_FOCUS_BOUNDS.minLat)) * VIEWBOX_HEIGHT;

  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10] as const;
}

function ringToPath(ring: Coordinate[]) {
  return ring
    .map((coordinate, index) => {
      const [x, y] = coordinateToSvg(coordinate);
      return `${index === 0 ? 'M' : 'L'}${x} ${y}`;
    })
    .join(' ');
}

function polygonToPath(polygon: PolygonCoordinates) {
  return polygon.map((ring) => `${ringToPath(ring)} Z`).join(' ');
}

function geometryToPath(feature: GeoFeature) {
  if (feature.geometry.type === 'Polygon') {
    return polygonToPath(feature.geometry.coordinates as PolygonCoordinates);
  }

  return (feature.geometry.coordinates as MultiPolygonCoordinates).map(polygonToPath).join(' ');
}

function centroidOf(feature: GeoFeature): readonly [number, number] {
  const rings: Coordinate[][] =
    feature.geometry.type === 'Polygon'
      ? (feature.geometry.coordinates as PolygonCoordinates)
      : (feature.geometry.coordinates as MultiPolygonCoordinates).flat();

  const largest = rings.reduce((a, b) => (b.length > a.length ? b : a), rings[0] ?? []);
  if (!largest || largest.length === 0) return [0, 0];

  let sx = 0;
  let sy = 0;
  for (const coordinate of largest) {
    const [x, y] = coordinateToSvg(coordinate);
    sx += x;
    sy += y;
  }
  return [sx / largest.length, sy / largest.length] as const;
}

const LABEL_MARGIN = 40;
function isInFrame([x, y]: readonly [number, number]) {
  return x > -LABEL_MARGIN && x < VIEWBOX_WIDTH + LABEL_MARGIN && y > -LABEL_MARGIN && y < VIEWBOX_HEIGHT + LABEL_MARGIN;
}

export default function ProjectFootprintEditorialMap({
  activeSlug,
  clusterFilter,
  onSelect,
  ariaLabel,
}: ProjectFootprintEditorialMapProps) {
  const { locale } = useLocale();
  const [features, setFeatures] = useState<GeoFeature[]>([]);
  const [neighbors, setNeighbors] = useState<GeoFeature[]>([]);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetch('/geo/algeria-wilayas.json').then((r) => r.json() as Promise<GeoCollection>),
      fetch('/geo/neighboring-countries.json').then((r) => r.json() as Promise<GeoCollection>),
    ])
      .then(([wilayas, neighborCountries]) => {
        if (cancelled) return;
        setFeatures(wilayas.features);
        setNeighbors(neighborCountries.features);
      })
      .catch(() => {
        if (!cancelled) {
          setFeatures([]);
          setNeighbors([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const paths = useMemo(() => features.map((feature) => ({
    key: String(feature.properties.iso || feature.properties.name),
    name: String(feature.properties.name ?? ''),
    d: geometryToPath(feature),
    centroid: centroidOf(feature),
    highlighted: HIGHLIGHTED_WILAYAS.has(normalizeName(String(feature.properties.name ?? ''))),
  })), [features]);

  const neighborPaths = useMemo(() => neighbors.map((feature) => ({
    key: String(feature.properties.name),
    d: geometryToPath(feature),
  })), [neighbors]);

  const countryLabelPos = useMemo(() => coordinateToSvg(COUNTRY_LABEL), []);
  const seaLabelPos = useMemo(() => coordinateToSvg(SEA_LABEL), []);

  return (
    <div className="relative mx-auto aspect-[1000/362] w-full max-w-[1040px] overflow-hidden" aria-label={ariaLabel}>
      <div className="absolute inset-0">
      <svg
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        role="img"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <filter id="igloo-map-soft-shadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="18" dy="24" stdDeviation="18" floodColor="#111111" floodOpacity="0.12" />
          </filter>
          <pattern id="igloo-map-contour" width="54" height="54" patternUnits="userSpaceOnUse">
            <path d="M-8 30 C14 22, 28 22, 62 30" fill="none" stroke="#d9d5cb" strokeWidth="1.2" opacity="0.34" />
            <path d="M-8 46 C14 38, 28 38, 62 46" fill="none" stroke="#d9d5cb" strokeWidth="0.9" opacity="0.24" />
          </pattern>
        </defs>

        {/* Neighboring countries — flat, muted, sit behind Algeria for geographic context only */}
        <g>
          {neighborPaths.map((path) => (
            <path
              key={path.key}
              d={path.d}
              fill="#f0eee7"
              stroke="#ddd8cb"
              strokeWidth="1"
            />
          ))}
        </g>

        <g filter="url(#igloo-map-soft-shadow)">
          {paths.map((path) => (
            <path
              key={`${path.key}-depth`}
              d={path.d}
              transform="translate(32 42)"
              fill="#d8d3c7"
              stroke="#c8c2b5"
              strokeWidth="1.2"
              opacity={path.highlighted ? 0.84 : 0.72}
            />
          ))}
          {paths.map((path) => (
            <path
              key={path.key}
              d={path.d}
              fill={path.highlighted ? '#c22026' : '#f4f2eb'}
              stroke={path.highlighted ? '#9f171e' : '#d8d4ca'}
              strokeWidth={path.highlighted ? 1.65 : 1.15}
              opacity={path.highlighted ? 0.9 : 1}
            />
          ))}
          {paths.map((path) => (
            <path
              key={`${path.key}-texture`}
              d={path.d}
              fill="url(#igloo-map-contour)"
              stroke="transparent"
              opacity={path.highlighted ? 0.12 : 0.9}
            />
          ))}
        </g>

        {/* Wilaya name labels */}
        <g>
          {paths.filter((path) => isInFrame(path.centroid)).map((path) => (
            <text
              key={`${path.key}-label`}
              x={path.centroid[0]}
              y={path.centroid[1]}
              textAnchor="middle"
              fontSize="9.5"
              fontWeight={500}
              letterSpacing="0.01em"
              fill={path.highlighted ? 'rgba(255,255,255,0.92)' : '#6b675e'}
              paintOrder="stroke"
              stroke="rgba(255,255,255,0.75)"
              strokeWidth={path.highlighted ? 0 : 2}
              style={{ pointerEvents: 'none', fontFamily: 'var(--font-sans)' }}
            >
              {path.name}
            </text>
          ))}
        </g>

        {/* Sea name */}
        <text
          x={seaLabelPos[0]}
          y={seaLabelPos[1]}
          textAnchor="middle"
          fontSize="13"
          fontStyle="italic"
          letterSpacing="0.06em"
          fill="#9fb4c2"
          paintOrder="stroke"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth={2.5}
          style={{ pointerEvents: 'none', fontFamily: 'var(--font-sans)' }}
        >
          {locale === 'fr' ? 'MER MÉDITERRANÉE' : 'MEDITERRANEAN SEA'}
        </text>

        {/* Country name */}
        <text
          x={countryLabelPos[0]}
          y={countryLabelPos[1]}
          textAnchor="middle"
          fontSize="16"
          fontWeight={700}
          letterSpacing="0.12em"
          fill="#2a2a28"
          paintOrder="stroke"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth={3}
          style={{ pointerEvents: 'none', fontFamily: 'var(--font-sans)' }}
        >
          {locale === 'fr' ? 'ALGÉRIE' : 'ALGERIA'}
        </text>
      </svg>

      {projectMapPoints.map((point, index) => {
        const filtered = clusterFilter !== 'all' && point.cluster !== clusterFilter;
        const selected = activeSlug === point.slug;
        const position = coordinateToMapPosition(point, NORTH_FOCUS_BOUNDS);

        return (
          <button
            key={point.slug}
            type="button"
            className={cn(
              'absolute z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-full items-center justify-center rounded-full border-2 border-white bg-[#c22026] text-[11px] font-bold text-white shadow-[0_14px_28px_rgba(0,0,0,0.24)] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c22026]/35 focus-visible:ring-offset-2',
              selected && 'z-20 h-10 w-10 bg-[#e82a2e] text-[12px] shadow-[0_20px_42px_rgba(194,32,38,0.36)]',
              filtered && !selected && 'opacity-30 grayscale',
            )}
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
            }}
            aria-label={`${point.menuTitle}, ${point.locality}, ${point.wilaya}`}
            aria-pressed={selected}
            onClick={() => onSelect(point.slug)}
            onFocus={() => onSelect(point.slug)}
            onMouseEnter={() => onSelect(point.slug)}
          >
            {index + 1}
            <span className="absolute left-1/2 top-full h-6 w-0.5 -translate-x-1/2 bg-[#c22026]" aria-hidden="true" />
          </button>
        );
      })}

      <div className="pointer-events-none absolute inset-x-[16%] bottom-[9%] h-8 bg-black/10 blur-2xl" />
      </div>
    </div>
  );
}
