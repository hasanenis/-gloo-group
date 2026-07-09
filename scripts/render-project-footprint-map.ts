import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { projectMapPoints } from '../src/data/projectMap';

type GeoJsonPosition = [number, number];
type GeoJsonPolygon = GeoJsonPosition[][];
type GeoJsonMultiPolygon = GeoJsonPolygon[];

type BoundaryFeature = {
  type: 'Feature';
  properties: {
    shapeName: string;
    shapeISO?: string;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: GeoJsonPolygon | GeoJsonMultiPolygon;
  };
};

type BoundaryCollection = {
  type: 'FeatureCollection';
  features: BoundaryFeature[];
};

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, 'outputs', 'homepage-redesign');
const GEODATA_DIR = path.join(ROOT, 'tmp', 'geodata');
const GEODATA_FILE = path.join(GEODATA_DIR, 'geoBoundaries-DZA-ADM1_simplified.geojson');
const GEOBOUNDARIES_URL =
  'https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/DZA/ADM1/geoBoundaries-DZA-ADM1_simplified.geojson';

const WIDTH = 1600;
const HEIGHT = 1180;
const TARGET_BOX = {
  x: 135,
  y: 250,
  width: 1040,
  height: 820,
};

const HIGHLIGHT_WILAYAS = new Set(['algiers', 'tipaza', 'mostaganem', 'boumerdes']);

const PROJECT_OFFSET_BY_CLUSTER: Record<string, Array<[number, number]>> = {
  mostaganem: [[0, 0]],
  'west-algiers': [
    [-34, -10],
    [-17, 12],
    [1, -18],
    [19, 7],
    [38, -5],
  ],
  'central-algiers': [
    [-12, -10],
    [13, 10],
  ],
  'east-algiers': [
    [-17, -6],
    [18, 8],
  ],
  boumerdes: [[28, 0]],
};

function normalizeName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function fmt(value: number) {
  return Number(value.toFixed(2));
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function isMultiPolygon(coordinates: GeoJsonPolygon | GeoJsonMultiPolygon): coordinates is GeoJsonMultiPolygon {
  return Array.isArray(coordinates[0]?.[0]?.[0]);
}

function polygonsForFeature(feature: BoundaryFeature): GeoJsonMultiPolygon {
  return isMultiPolygon(feature.geometry.coordinates)
    ? feature.geometry.coordinates
    : [feature.geometry.coordinates as GeoJsonPolygon];
}

async function loadBoundaryData() {
  await fs.mkdir(GEODATA_DIR, { recursive: true });

  try {
    await fs.access(GEODATA_FILE);
  } catch {
    const response = await fetch(GEOBOUNDARIES_URL);
    if (!response.ok) {
      throw new Error(`Could not download geoBoundaries data: ${response.status} ${response.statusText}`);
    }

    await fs.writeFile(GEODATA_FILE, await response.text(), 'utf8');
  }

  return JSON.parse(await fs.readFile(GEODATA_FILE, 'utf8')) as BoundaryCollection;
}

function createProjector(features: BoundaryFeature[]) {
  const rawPoints: Array<{ x: number; y: number }> = [];

  function mercator([lng, lat]: GeoJsonPosition) {
    const x = (lng * Math.PI) / 180;
    const latRad = (lat * Math.PI) / 180;
    const y = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    return { x, y };
  }

  for (const feature of features) {
    for (const polygon of polygonsForFeature(feature)) {
      for (const ring of polygon) {
        for (const position of ring) {
          rawPoints.push(mercator(position));
        }
      }
    }
  }

  const minRawX = Math.min(...rawPoints.map((point) => point.x));
  const maxRawX = Math.max(...rawPoints.map((point) => point.x));
  const minRawY = Math.min(...rawPoints.map((point) => point.y));
  const maxRawY = Math.max(...rawPoints.map((point) => point.y));
  const rawWidth = maxRawX - minRawX;
  const rawHeight = maxRawY - minRawY;

  const flatScale = Math.min(1000 / rawWidth, 1000 / rawHeight);
  const flatWidth = rawWidth * flatScale;
  const flatHeight = rawHeight * flatScale;
  const flatCenter = {
    x: flatWidth / 2,
    y: flatHeight / 2,
  };

  function flat(position: GeoJsonPosition) {
    const raw = mercator(position);
    return {
      x: (raw.x - minRawX) * flatScale,
      y: (maxRawY - raw.y) * flatScale,
    };
  }

  function angled(position: GeoJsonPosition) {
    const point = flat(position);
    const dx = point.x - flatCenter.x;
    const dy = point.y - flatCenter.y;

    return {
      x: flatCenter.x + dx + dy * 0.17,
      y: flatCenter.y + dx * -0.055 + dy * 0.88,
    };
  }

  const angledPoints: Array<{ x: number; y: number }> = [];
  for (const feature of features) {
    for (const polygon of polygonsForFeature(feature)) {
      for (const ring of polygon) {
        for (const position of ring) {
          angledPoints.push(angled(position));
        }
      }
    }
  }

  const minAngledX = Math.min(...angledPoints.map((point) => point.x));
  const maxAngledX = Math.max(...angledPoints.map((point) => point.x));
  const minAngledY = Math.min(...angledPoints.map((point) => point.y));
  const maxAngledY = Math.max(...angledPoints.map((point) => point.y));
  const angledWidth = maxAngledX - minAngledX;
  const angledHeight = maxAngledY - minAngledY;
  const finalScale = Math.min(TARGET_BOX.width / angledWidth, TARGET_BOX.height / angledHeight);
  const translateX = TARGET_BOX.x + (TARGET_BOX.width - angledWidth * finalScale) / 2 - minAngledX * finalScale;
  const translateY = TARGET_BOX.y + (TARGET_BOX.height - angledHeight * finalScale) / 2 - minAngledY * finalScale;

  return function project(position: GeoJsonPosition, offsetX = 0, offsetY = 0) {
    const point = angled(position);
    return {
      x: fmt(point.x * finalScale + translateX + offsetX),
      y: fmt(point.y * finalScale + translateY + offsetY),
    };
  };
}

function ringToPath(ring: GeoJsonPosition[], project: ReturnType<typeof createProjector>, offsetX = 0, offsetY = 0) {
  return ring
    .map((position, index) => {
      const point = project(position, offsetX, offsetY);
      return `${index === 0 ? 'M' : 'L'}${point.x} ${point.y}`;
    })
    .join(' ')
    .concat(' Z');
}

function featureToPath(feature: BoundaryFeature, project: ReturnType<typeof createProjector>, offsetX = 0, offsetY = 0) {
  return polygonsForFeature(feature)
    .flatMap((polygon) => polygon.map((ring) => ringToPath(ring, project, offsetX, offsetY)))
    .join(' ');
}

function pinSvg(x: number, y: number, index: number, label: string) {
  const title = escapeHtml(label);

  return `
    <g class="project-pin" transform="translate(${fmt(x)} ${fmt(y)})">
      <title>${title}</title>
      <path d="M0 -19 C10 -19 18 -11 18 -1 C18 11 5 21 0 29 C-5 21 -18 11 -18 -1 C-18 -11 -10 -19 0 -19 Z" />
      <circle cx="0" cy="-2" r="7" />
      <text x="0" y="1">${index}</text>
    </g>`;
}

function makeContours() {
  const paths: string[] = [];
  for (let index = 0; index < 16; index += 1) {
    const y = 170 + index * 48;
    const x1 = 130 - index * 12;
    const x2 = 1160 + index * 16;
    const mid = (x1 + x2) / 2;
    paths.push(
      `<path d="M ${fmt(x1)} ${fmt(y)} C ${fmt(mid - 200)} ${fmt(y - 52)}, ${fmt(mid + 190)} ${fmt(
        y + 54,
      )}, ${fmt(x2)} ${fmt(y - 8)}" />`,
    );
  }
  return paths.join('\n');
}

async function main() {
  const boundaryData = await loadBoundaryData();
  const project = createProjector(boundaryData.features);
  const countryPath = boundaryData.features.map((feature) => featureToPath(feature, project)).join(' ');

  const provinceLayers = boundaryData.features
    .map((feature) => {
      const normalizedName = normalizeName(feature.properties.shapeName);
      const isHighlighted = HIGHLIGHT_WILAYAS.has(normalizedName);
      const pathData = featureToPath(feature, project);

      return `<path class="${isHighlighted ? 'wilaya wilaya-highlight' : 'wilaya'}" d="${pathData}" />`;
    })
    .join('\n');

  const depthLayer = boundaryData.features
    .map((feature) => `<path class="wilaya-depth" d="${featureToPath(feature, project, 34, 34)}" />`)
    .join('\n');

  const shadowLayer = boundaryData.features
    .map((feature) => `<path class="wilaya-shadow" d="${featureToPath(feature, project, 50, 52)}" />`)
    .join('\n');

  const clusterSeen = new Map<string, number>();
  const pins = projectMapPoints
    .map((point, index) => {
      const offsetList = PROJECT_OFFSET_BY_CLUSTER[point.cluster] ?? [[0, 0]];
      const offsetIndex = clusterSeen.get(point.cluster) ?? 0;
      clusterSeen.set(point.cluster, offsetIndex + 1);
      const [offsetX, offsetY] = offsetList[offsetIndex % offsetList.length];
      const projected = project([point.lng, point.lat], offsetX, offsetY);
      return pinSvg(projected.x, projected.y, index + 1, `${point.menuTitle} - ${point.locality}`);
    })
    .join('\n');

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="algeria-clip">
      <path d="${countryPath}" />
    </clipPath>
    <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="26" dy="34" stdDeviation="24" flood-color="#111111" flood-opacity="0.12"/>
    </filter>
  </defs>
  <style>
    .eyebrow { fill: #c22026; font: 800 20px Arial, sans-serif; letter-spacing: 0; }
    .title { fill: #151515; font: 800 68px Arial, sans-serif; letter-spacing: 0; }
    .subtitle { fill: #5c5b58; font: 500 22px Arial, sans-serif; letter-spacing: 0; }
    .wilaya-shadow { fill: #c7c1b8; opacity: 0.34; }
    .wilaya-depth { fill: #ded9d0; opacity: 0.92; stroke: #cfc8bd; stroke-width: 1.2; }
    .wilaya { fill: #f0eee8; stroke: #d8d3ca; stroke-width: 1.35; fill-rule: evenodd; }
    .wilaya-highlight { fill: #d42b2f; stroke: #b21c21; stroke-width: 1.8; }
    .contours path { stroke: #d9d3ca; stroke-width: 2; opacity: 0.68; }
    .project-pin path { fill: #c22026; stroke: #ffffff; stroke-width: 4; }
    .project-pin circle { fill: #ffffff; }
    .project-pin text { fill: #c22026; font: 800 11px Arial, sans-serif; text-anchor: middle; dominant-baseline: middle; }
    .legend-text { fill: #4f4e4b; font: 600 18px Arial, sans-serif; letter-spacing: 0; }
    .legend-number { fill: #c22026; font: 900 24px Arial, sans-serif; letter-spacing: 0; }
  </style>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#fbfaf7"/>
  <text class="eyebrow" x="130" y="104">PROJECT FOOTPRINT</text>
  <text class="title" x="130" y="178">Algeria &amp; Beyond</text>
  <text class="subtitle" x="132" y="220">11 project locations across 4 highlighted wilayas</text>

  <g filter="url(#soft-shadow)">
    ${shadowLayer}
  </g>
  <g>
    ${depthLayer}
  </g>
  <g clip-path="url(#algeria-clip)" class="contours">
    ${makeContours()}
  </g>
  <g>
    ${provinceLayers}
  </g>
  <g>
    ${pins}
  </g>
  <g transform="translate(1230 825)">
    <text class="legend-number" x="0" y="0">11</text>
    <text class="legend-text" x="44" y="-3">project pins</text>
    <text class="legend-number" x="0" y="44">4</text>
    <text class="legend-text" x="44" y="41">wilayas highlighted</text>
    <text class="legend-number" x="0" y="88">1</text>
    <text class="legend-text" x="44" y="85">north-coast delivery belt</text>
  </g>
</svg>`;

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const svgOutput = path.join(OUTPUT_DIR, 'project-footprint-algeria.svg');
  const pngOutput = path.join(OUTPUT_DIR, 'project-footprint-algeria.png');

  await fs.writeFile(svgOutput, svg, 'utf8');
  await sharp(Buffer.from(svg)).png().toFile(pngOutput);

  console.log(`Wrote ${path.relative(ROOT, svgOutput)}`);
  console.log(`Wrote ${path.relative(ROOT, pngOutput)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
