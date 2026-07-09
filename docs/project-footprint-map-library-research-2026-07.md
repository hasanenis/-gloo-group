# Project Footprint Map - Library Research

**Date:** 5 July 2026  
**Goal:** Build an Igloo Construction footprint visual like the reference: light Algeria silhouette, red highlighted operating areas, red pins, editorial white/black/red styling, with a subtle angled/parallel 3D feel.

---

## Target Visual

The desired result is not a conventional interactive map. It should feel like an editorial brand asset:

- Algeria silhouette in pale concrete/off-white.
- Subtle topographic or contour-line texture.
- Red highlighted wilayas/project clusters.
- Project pins based on real `src/data/projects.ts` locations.
- Slight isometric/parallel angle, as if the map is laid on a tilted architectural model board.
- Compact labels/popovers rather than always-visible dense labels.

This is closer to a **custom SVG data visualization** than Mapbox/Google Maps.

---

## Recommended Stack

### Best Fit: SVG + D3 Geo + TopoJSON, with CSS/GSAP 3D Illusion

Use:

- `d3-geo` for projection/path generation.
- `topojson-client` if using TopoJSON boundary files.
- `mapshaper` as a dev/build-time tool to simplify Algeria boundary data.
- React + Tailwind for layout and styling.
- GSAP/ScrollTrigger for reveal/hover/pin animation.
- Existing `src/data/projectMap.ts` for project pins.

Why:

- Very lightweight compared with full map engines.
- Gives exact brand control.
- Works with static/offline GeoJSON/TopoJSON.
- Easy to apply CSS transforms: `rotateX`, `rotateZ`, `skew`, layered shadows.
- Fits the current repo rules: React functional components, Tailwind, GSAP, no unnecessary dependency bloat.

Suggested implementation shape:

```tsx
<section className="footprint-section">
  <div className="footprint-map [transform:perspective(1200px)_rotateX(58deg)_rotateZ(-8deg)]">
    <svg viewBox="0 0 900 760">
      <path className="country-base" />
      <path className="wilaya-highlight" />
      <g className="project-pin" />
    </svg>
  </div>
  <aside>Project count / wilayas / current work</aside>
</section>
```

Important detail: text labels should usually sit outside the transformed SVG or be counter-transformed. Otherwise a 3D tilt makes text harder to read.

---

## Library Comparison

| Option | What it gives | Pros | Cons | Verdict |
|---|---|---|---|---|
| Pure SVG + generated path | No runtime mapping library | Smallest bundle, total art direction control | Need build-time path prep | Best if map does not need live projection changes |
| `d3-geo` + `topojson-client` | Projection, `geoPath`, TopoJSON conversion | Precise, flexible, still light | More custom code than wrapper | **Recommended** |
| `react-simple-maps` | Declarative React wrapper over d3-geo/topojson | Fast to implement, idiomatic React components | Less low-level control; still adds dependency | Good if speed matters |
| Three.js / `@react-three/fiber` | Real 3D extrusion and camera | True 3D, premium if done well | New heavier deps, canvas QA, mobile/perf work | Phase 2 only if fake 3D is not enough |
| ECharts + ECharts GL | Geo/chart + 3D globe/map style | Fast chart setup, has GL extension | Chart-library look, harder custom editorial polish | Not ideal |
| deck.gl `GeoJsonLayer` | GPU GeoJSON, extrusions | Strong for heavy geospatial analytics | Overkill for 11 pins and brand map | Avoid |
| MapLibre GL JS | Vector tiles, pitch, 3D terrain | Real map engine, performant | Too “map app”; needs tiles/styles/attribution | Avoid for this homepage visual |
| Leaflet | 2D slippy map | Easy maps | Not 3D/editorial; tile dependency | Avoid |

---

## Data Source Decision

### Use geoBoundaries for Algeria boundaries

geoBoundaries provides Algeria ADM0/ADM1/ADM2/ADM3 data. The `gbOpen/DZA/ADM1` endpoint used for the corrected footprint asset reports Open Data Commons Open Database License 1.0 (ODbL 1.0), with OpenStreetMap/Wambacher as the boundary source. It is the best source if we want:

- Algeria country outline.
- Wilaya-level highlighting.
- A maintained administrative boundary dataset with clear attribution/licensing requirements.

Source:

https://www.geoboundaries.org/  
https://www.geoboundaries.org/api/current/gbOpen/DZA/ADM1/  
https://data.humdata.org/dataset/geoboundaries-admin-boundaries-for-algeria

### Use Natural Earth only for simple country context

Natural Earth is public domain and good for a simple country silhouette, but it does not solve wilaya-level highlighting.

Source:

https://www.naturalearthdata.com/

### Avoid GADM for commercial use

GADM is useful, but its license says commercial use and redistribution are not allowed without prior permission. For a client-facing construction marketing site, avoid it unless permission is obtained.

Source:

https://gadm.org/data.html

### Use Mapshaper as a build-time simplifier

Mapshaper supports Shapefile, GeoJSON and TopoJSON, and can simplify/convert data before it enters the React app.

Source:

https://mapshaper.org/  
https://mapshaper.org/docs/essentials/command-line.html

---

## Project Pin Data

I added a reusable source file:

`src/data/projectMap.ts`

It maps the 11 project records from `src/data/projects.ts` to approximate coordinates, wilaya names, cluster names and normalized map positions.

Current coverage:

| Slug | Locality | Wilaya | Accuracy |
|---|---|---|---|
| `douaouda-300-500-housing` | Douaouda | Tipaza | commune |
| `sidi-abdallah-200-1200-housing` | Sidi Abdellah / Mahelma | Algiers | commune |
| `staoueli-11-41-villas` | Staoueli | Algiers | commune |
| `rahmania` | Douera / Douira | Algiers | commune |
| `said-hamdine-mixed-real-estate` | Said Hamdine | Algiers | neighborhood |
| `rouiba-4-promotional-villas` | Rouiba | Algiers | commune |
| `sidi-benour-50-housing` | Sidi Bennour | Algiers | neighborhood |
| `dely-brahim-240-housing` | Dely Brahim | Algiers | commune |
| `bas-mazagran-200-38-housing` | Bas Mazagran / Mazagran | Mostaganem | city |
| `reghaia-bouraada-250-housing` | Bouraada, Reghaia | Algiers | site-approximate |
| `boudouaou-70-10-housing` | Boudouaou | Boumerdes | commune |

Important: these are presentation-level coordinates, not surveyed site coordinates. Exact pins should be verified with the project owner or a restricted build-time geocoding process.

---

## 3D / Angled Design Approach

### Phase 1: Fake 3D with SVG layers

Recommended for homepage:

- Base Algeria path: pale fill, subtle stroke.
- Duplicate shape underneath: offset + darker translucent fill for thickness/shadow.
- Apply parent transform: `perspective(1200px) rotateX(58deg) rotateZ(-8deg)`.
- Add contour lines clipped to Algeria shape.
- Highlight wilayas in red on top of the base.
- Pins either:
  - stay inside the tilted map for model-board feel, or
  - render in an overlay layer for better readability.

This gives the "parallel angled" effect without WebGL.

### Phase 2: Real 3D if needed

Only choose this if the user explicitly wants a rotating/extruded 3D map:

- `three` + `@react-three/fiber`
- Convert SVG/GeoJSON paths to Three shapes.
- Extrude the Algeria shape with `ExtrudeGeometry`.
- Use orthographic camera for architectural isometric look.

Notes:

- React Three Fiber v9 pairs with React 19.
- Three.js `ExtrudeGeometry` can create depth from shapes.
- If used, follow repo frontend rules: full-bleed/unframed 3D scene, Playwright screenshots, canvas pixel checks, desktop/mobile validation.

Official sources:

https://threejs.org/docs/pages/ExtrudeGeometry.html  
https://threejs.org/docs/pages/SVGLoader.html  
https://r3f.docs.pmnd.rs/getting-started/introduction

---

## Implementation Plan

1. Add Algeria boundary asset under `public/maps/` or `src/data/maps/`.
2. Use geoBoundaries ADM0 + ADM1 simplified data.
3. Convert/simplify with Mapshaper:

```bash
mapshaper geoBoundaries-DZA-ADM1_simplified.geojson \
  -simplify 8% keep-shapes \
  -o format=topojson public/maps/algeria-adm1.topojson
```

4. Build `ProjectFootprintMap.tsx`.
5. Use `projectMapPoints` for pins.
6. Highlight active wilayas: Tipaza, Algiers, Mostaganem, Boumerdes.
7. Add cluster labels:
   - Mostaganem
   - West Algiers / Tipaza
   - Central Algiers
   - East Algiers / Boumerdes
8. Add mobile fallback:
   - Static tilted map on top.
   - Project list below.
   - Tap opens project card.
9. Add Storybook story if the map becomes a reusable component.
10. Verify:
   - `npm run lint`
   - `npm run build`
   - Playwright screenshots for `/` desktop/mobile and `?edit=1`.

---

## Final Recommendation

Use **D3 Geo + TopoJSON + SVG/CSS 3D illusion** first.

Do not use MapLibre, Leaflet, deck.gl or ECharts GL for this homepage visual. They are strong libraries, but they solve a different problem. The reference is a brand illustration with real data, not a geospatial product.

If the final art direction still feels too flat after Phase 1, then move to **Three.js + React Three Fiber** for an extruded Algeria model.
