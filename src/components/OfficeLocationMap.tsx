import { useEffect, useRef } from 'react';
import maplibregl, { type Map as MapLibreMap, type StyleSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const OFFICE_COORDINATES: [number, number] = [3.04924, 36.71519];

const officeMapStyle: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
    },
  ],
};

export default function OfficeLocationMap({ ariaLabel }: { ariaLabel: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: officeMapStyle,
      center: OFFICE_COORDINATES,
      zoom: 15.4,
      bearing: 0,
      pitch: 0,
      attributionControl: false,
      cooperativeGestures: true,
      dragRotate: false,
      pitchWithRotate: false,
      scrollZoom: false,
    });

    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');

    const marker = new maplibregl.Marker({ color: '#c22026' })
      .setLngLat(OFFICE_COORDINATES)
      .addTo(map);

    const resize = () => map.resize();
    map.once('load', resize);
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      marker.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={ariaLabel}
      className="min-h-[480px] w-full bg-[#d9d9d6] lg:min-h-[620px]"
    />
  );
}
