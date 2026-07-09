// Processes raw geoBoundaries Algeria ADM1 GeoJSON:
// 1. Adds highlighted=true to 4 project wilayas
// 2. Rounds coordinates to 4 decimal places (halves file size with minimal visual loss)
// 3. Removes unneeded geoBoundaries properties, keeps shapeName + shapeISO + highlighted

import { readFileSync, writeFileSync } from 'node:fs';

const HIGHLIGHTED = new Set(['Algiers', 'Tipaza', 'Mostaganem', 'Boumerdès', 'Boumerdes', 'Boumerdès']);

// 3 decimal places ≈ ~100m accuracy — fine for wilaya-level display
const PREC = 1000;

function roundCoords(coords) {
  if (typeof coords[0] === 'number') {
    return [Math.round(coords[0] * PREC) / PREC, Math.round(coords[1] * PREC) / PREC];
  }
  return coords.map(c => roundCoords(c));
}

// Remove consecutive duplicate points that rounding creates
function dedup(ring) {
  return ring.filter((pt, i) => {
    if (i === 0) return true;
    return pt[0] !== ring[i - 1][0] || pt[1] !== ring[i - 1][1];
  });
}

function cleanCoords(coords, isRing = false) {
  if (typeof coords[0][0] === 'number') {
    const r = dedup(coords);
    return r;
  }
  return coords.map((c, i) => cleanCoords(c, true));
}

const raw = JSON.parse(readFileSync('public/geo/algeria-wilayas-raw.geojson', 'utf8'));

const processed = {
  type: 'FeatureCollection',
  features: raw.features.map(f => ({
    type: 'Feature',
    properties: {
      name: f.properties.shapeName,
      iso: f.properties.shapeISO,
      highlighted: HIGHLIGHTED.has(f.properties.shapeName) ? 1 : 0,
    },
    geometry: {
      type: f.geometry.type,
      coordinates: cleanCoords(roundCoords(f.geometry.coordinates)),
    },
  })),
};

// Print all wilaya names so we can verify matching
const names = processed.features.map(f => `${f.properties.highlighted ? '★' : ' '} ${f.properties.name}`).sort();
console.log('Wilayas (' + processed.features.length + ' total):');
names.forEach(n => console.log(' ', n));

writeFileSync('public/geo/algeria-wilayas.json', JSON.stringify(processed));

const rawSize = readFileSync('public/geo/algeria-wilayas-raw.geojson').length;
const outSize = readFileSync('public/geo/algeria-wilayas.json').length;
console.log(`\nRaw: ${(rawSize/1024).toFixed(0)} KB  →  Output: ${(outSize/1024).toFixed(0)} KB`);
