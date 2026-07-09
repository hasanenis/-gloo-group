import { projects, type ProjectRecord } from './projects';

export type ProjectMapAccuracy = 'site-approximate' | 'neighborhood' | 'commune' | 'city';

export type ProjectMapBounds = {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
};

export type ProjectMapCoordinate = {
  lat: number;
  lng: number;
  locality: string;
  wilaya: string;
  accuracy: ProjectMapAccuracy;
  sourceNote: string;
};

export type ProjectMapPoint = ProjectMapCoordinate & {
  slug: ProjectRecord['slug'];
  title: string;
  menuTitle: string;
  location: string;
  status: ProjectRecord['status'];
  scope: string;
  cluster: 'mostaganem' | 'west-algiers' | 'central-algiers' | 'east-algiers' | 'boumerdes';
  position: {
    fullAlgeria: { x: number; y: number };
    northCoastInset: { x: number; y: number };
  };
};

export const PROJECT_MAP_BOUNDS = {
  fullAlgeria: {
    minLat: 18.5,
    maxLat: 37.3,
    minLng: -8.8,
    maxLng: 12.0,
  },
  northCoastInset: {
    minLat: 35.75,
    maxLat: 36.86,
    minLng: -0.1,
    maxLng: 3.55,
  },
} satisfies Record<'fullAlgeria' | 'northCoastInset', ProjectMapBounds>;

export const projectMapCoordinates: Record<string, ProjectMapCoordinate & { cluster: ProjectMapPoint['cluster'] }> = {
  'douaouda-300-500-housing': {
    lat: 36.6737396,
    lng: 2.7900902,
    locality: 'Douaouda',
    wilaya: 'Tipaza',
    accuracy: 'commune',
    cluster: 'west-algiers',
    sourceNote: 'OpenStreetMap/Nominatim administrative result for Douaouda.',
  },
  'sidi-abdallah-200-1200-housing': {
    lat: 36.677591,
    lng: 2.8881867,
    locality: 'Sidi Abdellah / Mahelma',
    wilaya: 'Algiers',
    accuracy: 'commune',
    cluster: 'west-algiers',
    sourceNote: 'Sidi Abdellah published city coordinate; used for the Sidi Abdallah - Mahalma programme.',
  },
  'staoueli-11-41-villas': {
    lat: 36.7532755,
    lng: 2.8881822,
    locality: 'Staoueli',
    wilaya: 'Algiers',
    accuracy: 'commune',
    cluster: 'west-algiers',
    sourceNote: 'OpenStreetMap/Nominatim administrative result for Staoueli.',
  },
  rahmania: {
    lat: 36.6702433,
    lng: 2.9448509,
    locality: 'Douera / Douira',
    wilaya: 'Algiers',
    accuracy: 'commune',
    cluster: 'west-algiers',
    sourceNote: 'Douera commune centre, used for the Rahmania commercial centres in Douira.',
  },
  'said-hamdine-mixed-real-estate': {
    lat: 36.7350939,
    lng: 3.0314241,
    locality: 'Said Hamdine',
    wilaya: 'Algiers',
    accuracy: 'neighborhood',
    cluster: 'central-algiers',
    sourceNote: 'OpenStreetMap/Nominatim suburb result for Said Hamdine.',
  },
  'rouiba-4-promotional-villas': {
    lat: 36.7364237,
    lng: 3.2826417,
    locality: 'Rouiba',
    wilaya: 'Algiers',
    accuracy: 'commune',
    cluster: 'east-algiers',
    sourceNote: 'OpenStreetMap/Nominatim administrative result for Rouiba.',
  },
  'sidi-benour-50-housing': {
    lat: 36.653611,
    lng: 2.875,
    locality: 'Sidi Bennour',
    wilaya: 'Algiers',
    accuracy: 'neighborhood',
    cluster: 'west-algiers',
    sourceNote: 'Sidi Bennour neighborhood reference in Commune de Douera; approximate project marker.',
  },
  'dely-brahim-240-housing': {
    lat: 36.7516098,
    lng: 2.9825732,
    locality: 'Dely Brahim',
    wilaya: 'Algiers',
    accuracy: 'commune',
    cluster: 'central-algiers',
    sourceNote: 'OpenStreetMap/Nominatim administrative result for Dely Brahim.',
  },
  'bas-mazagran-200-38-housing': {
    lat: 35.895621,
    lng: 0.071433,
    locality: 'Bas Mazagran / Mazagran',
    wilaya: 'Mostaganem',
    accuracy: 'city',
    cluster: 'mostaganem',
    sourceNote: 'Mazagran commune coordinate; approximate for Bas Mazagran.',
  },
  'reghaia-bouraada-250-housing': {
    lat: 36.7327214,
    lng: 3.3448132,
    locality: 'Bouraada, Reghaia',
    wilaya: 'Algiers',
    accuracy: 'site-approximate',
    cluster: 'east-algiers',
    sourceNote: 'Bouraada LPP/Reghaia map listing coordinate; approximate project marker.',
  },
  'boudouaou-70-10-housing': {
    lat: 36.7271127,
    lng: 3.4085912,
    locality: 'Boudouaou',
    wilaya: 'Boumerdes',
    accuracy: 'commune',
    cluster: 'boumerdes',
    sourceNote: 'OpenStreetMap/Nominatim administrative result for Boudouaou.',
  },
};

function clamp(value: number) {
  return Math.min(100, Math.max(0, value));
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}

export function coordinateToMapPosition(
  coordinate: Pick<ProjectMapCoordinate, 'lat' | 'lng'>,
  bounds: ProjectMapBounds,
) {
  const x = ((coordinate.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
  const y = ((bounds.maxLat - coordinate.lat) / (bounds.maxLat - bounds.minLat)) * 100;

  return {
    x: round(clamp(x)),
    y: round(clamp(y)),
  };
}

export const projectMapPoints: ProjectMapPoint[] = projects.map((project) => {
  const coordinate = projectMapCoordinates[project.slug];

  return {
    slug: project.slug,
    title: project.title,
    menuTitle: project.menuTitle,
    location: project.location,
    status: project.status,
    scope: project.scope,
    ...coordinate,
    position: {
      fullAlgeria: coordinateToMapPosition(coordinate, PROJECT_MAP_BOUNDS.fullAlgeria),
      northCoastInset: coordinateToMapPosition(coordinate, PROJECT_MAP_BOUNDS.northCoastInset),
    },
  };
});

export const projectMapWilayas = Array.from(new Set(projectMapPoints.map((point) => point.wilaya)));
