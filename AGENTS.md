# AGENTS.md

## Project Overview

This is a Vite + React + TypeScript frontend for an Igloo Construction (SARL Igloo Yapi Construction) marketing site. The UI is animation-heavy and uses GSAP, ScrollTrigger, Motion/Framer Motion, Lenis smooth scroll, Tailwind CSS v4, React Router, and lucide-react icons. Content is bilingual (`en` / `fr`) via a custom i18n layer.

Routes are registered in `src/App.tsx`:

- `/` renders the home page from `src/pages/Home.tsx`.
- `/projects` renders `src/pages/ProjectsDemo.tsx` (the current project index). The animated GSAP showcase `src/pages/Projects.tsx` is legacy and lives at `/projects1`.
- `/projects/:slug` renders `src/pages/ProjectDetail.tsx` (the editorial project detail page).
- `/statom` renders `src/pages/StatomClone.tsx` (a reference rebuild of statom.co.uk; no header/global cursor — see `docs/research/statom.co.uk`).
- `/bat-demo/projects` and `/bat-demo/projects/:slug` render the `BatProjectsIndex` / `BatProjectDemo` variants. Turkish planning notes live in `docs/bat-demo-projects-plan/`.

`App.tsx` also mounts global providers (`LocaleProvider`, `SmoothScrollProvider`, `DesignEditorProvider`), a `GlobalCursor`, a `Header`, and a one-time `SiteIntro` veil animation on `/` (gated by `sessionStorage['igloo:intro-seen']`).

## Tech Stack

- React 19 with functional components.
- TypeScript with `jsx: react-jsx`. Path alias `@/*` → repo root (see `tsconfig.json` `paths`).
- Vite 6.
- Tailwind CSS v4 through `@tailwindcss/vite`.
- GSAP and `@gsap/react` for timeline and scroll-triggered animation. `ScrollTrigger` is registered in `src/components/SmoothScrollProvider.tsx`; register additional GSAP plugins once per module when needed.
- `lenis` for smooth scroll, wrapped by `SmoothScrollProvider` and driven by the GSAP ticker. Consume via `useLenis()`. Disabled under reduced-motion; opt a scroll container out with `data-lenis-prevent`.
- `motion/react` and `framer-motion` are both present; follow the import style already used in the file being edited. `src/lib/motion.ts` exposes a `usePrefersReducedMotion` hook.
- `react-router-dom` for routing.
- `lucide-react` for icons. `swiper` is available for carousels/sliders.
- `maplibre-gl` powers the interactive project map (`src/components/ProjectFootprintMap.tsx`). It renders wilaya polygons from `public/geo/algeria-wilayas.json` (geoBoundaries ADM1, CC BY, simplified to 2.3 MB / 422 KB gzip) as a basemap-free fill-extrusion layer (pitch 55, bearing -18, 22 km height) — the editorial "izometric Algeria" look. Coordinates for the 11 project pins come from `src/data/projectMap.ts`. MapLibre is split into `vendor-maps` chunk (285 KB gzip, lazy) so it never enters the home shell.
- `@google/genai` is a dependency, but the visible frontend does not currently call Gemini APIs.

## Commands

Use these from the repository root (Git Bash on Windows; `npm run clean` is Unix-style):

```bash
npm install
npm run dev            # Vite on port 3000, host 0.0.0.0
npm run build
npm run lint           # tsc --noEmit (no ESLint)
npm run preview
```

Design editor / studio (optional local tooling):

- `npm run dev:studio` / `npm run design-studio:server` start the local design-studio server (proxied at `/api/design-studio`, default port 3010).

Project-content pipeline (builds localized project data; see "Project content system" below):

- `npm run build:project-content` — regenerates `src/data/projectContent.generated.ts` (add `--skip-maps` to skip image maps).
- `npm run analyze:images` / `npm run analyze:images:all` — analyze project images.
- `npm run catalog:images`, `npm run select:images` — catalog/select project assets.
- `npm run organize:images` — chained: `build:project-content -- --skip-maps && select:images && catalog:images`.

Notes:

- `npm run lint` currently runs `tsc --noEmit`; there is no ESLint setup.
- `npm run clean` uses `rm -rf dist`, which is Unix-style and may not work in Windows PowerShell without a compatible shell.
- Vite HMR is toggled by the `DISABLE_HMR` env var (set during automated agent edits to avoid flicker).

## Repository Structure

- `src/App.tsx`: route registration and global provider/layout composition.
- `src/main.tsx`: React entrypoint.
- `src/index.css`: Tailwind import, theme fonts, and global light-mode overrides.
- `src/i18n.tsx`: `LocaleProvider`, `useLocale()`, `t()`; locales `en`/`fr`, persisted to `localStorage['igloo:locale']`.
- `src/components/SmoothScrollProvider.tsx`: Lenis instance + GSAP ticker integration; exposes `useLenis()`.
- `src/components/SiteIntro.tsx`, `GlobalCursor.tsx`, `Header.tsx`, `Footer.tsx`: app-level chrome.
- `src/components/*`: home page sections, sliders, statistics, testimonials, comparison, and video blocks.
- `src/pages/Home.tsx`: home page section composition.
- `src/pages/Projects.tsx`: large GSAP-driven project page and scroll choreography (legacy, served at `/projects1`).
- `src/pages/ProjectsDemo.tsx`, `ProjectDetail.tsx`, `BatProjectsIndex.tsx`, `BatProjectDemo.tsx`, `StatomClone.tsx`: the active route pages.
- `src/data/projects.ts`: core `ProjectRecord[]` + `companyProfile`.
- `src/data/projectContent.ts` + `projectContent.generated.ts`: localized (`en`/`fr`) detail-page content. The `.generated.ts` file is build output — do not hand-edit.
- `src/data/batProjectModel.ts`, `src/data/statom.ts`: data models for the bat-demo and statom variants.
- `src/design-editor/*`: the `?edit=1` Framer-like editor (see "Design editor").
- `src/styles/*`, `src/transitions/*`: scoped CSS and transition helpers (e.g. bat-demo transitions, project-detail editorial styles).
- `scripts/*`: tsx/mjs tooling for the project-content and image pipelines, plus the design-studio server.
- `vite.config.ts`: Vite, React, Tailwind, design-studio proxy, and HMR setup.

## Coding Guidelines

- Keep components functional and colocate simple section data arrays at the top of the component file, matching the current style.
- Prefer Tailwind utility classes for layout and visual styling. Use inline styles only for dynamic values, clip paths, background images, object positions, or animation-specific values already represented that way.
- Use the `@/*` path alias for cross-folder imports where the existing code does; otherwise match the file's current import style.
- Use `lucide-react` icons for common UI symbols.
- Register GSAP plugins once per module when needed, for example `gsap.registerPlugin(ScrollTrigger)`.
- Scope GSAP selectors with `useGSAP(..., { scope: ref })` when editing or adding animations.
- Clean up browser event listeners in `useEffect` return callbacks.
- Keep animation class names stable when changing markup, because GSAP timelines target many elements by class selector.
- Be careful when editing `src/pages/Projects.tsx`: scroll progress, timeline labels, canvas positions, and menu project names are tightly coupled.
- Avoid broad rewrites of large animated sections unless the task specifically requires it.
- For user-visible strings on shared/detail components, prefer the `useLocale()`/`t()` flow and the localized `ProjectContent` types (`{ en, fr }`) over hard-coded English.
- `.bak` copies exist for several components (e.g. `Header.tsx.bak`, `Projects.tsx.bak`). These are not imported; do not edit them as if they were live.

## UI System Rules

Detailed tooling documentation and the binding global rules for cva/cn styling, Storybook, Playwright, bundle analysis, and route code splitting live in `docs/tooling-standards.md`. The bullets below are the summary; when in doubt, that document wins.

- Prefer the shared primitives in `src/components/ui/*` before building new controls from scratch. Use `Button`, `Badge`, `Card`, `IconButton`, `SectionHeader`, `Input`, `Select`, `Tabs`, `Tooltip`, `Dialog`, `Popover`, `DropdownMenu`, and `NavigationMenu` for new shared surfaces.
- Use Radix primitives for interaction-heavy UI such as menus, dialogs, popovers, tooltips, tabs, selects, and navigation menus.
- Use `cva` plus `cn` for variant-based styling. Avoid long ad hoc `className` concatenations when a size, tone, or state can be expressed as a variant.
- Keep buttons, chips, cards, and form fields on the shared scale system. If a new size or radius is needed, add it to the primitive instead of one-off tweaking a page.
- When a component is meant to be reused or visually reviewed, add or update Storybook stories for the normal, hover, active, disabled, empty, and mobile states as relevant.

## Performance Rules

- Run Playwright snapshots only when the change materially affects route-level layout, responsive behavior, or shared navigation. Test only affected routes/viewports; do not run the full route matrix by default.
- For bundle-sensitive changes, run `npm run analyze:bundle` and use the report to decide whether a dependency or route should be lazy-loaded or split into its own chunk.
- Keep the home shell light. Push heavy editorial, demo, or animation-only surfaces behind route splits or lazy imports when they do not need to be on the first screen.

## Design editor

Activated by appending `?edit=1` to any route (see `src/design-editor/DesignEditorProvider.tsx`, which reads `new URLSearchParams(...).get('edit')`). When enabled it:

- Adds `design-editor-active` to `<html>`, hides `GlobalCursor`/`Header`/`SiteIntro`, and wraps the app in an editor shell that renders the site as a scaled artboard.
- Persists revisions/presets to `design-documents/` (via `src/design-editor/persistence/*`) and talks to the local server at `/api/design-studio`.
- Treats elements as "layers" with selection/hover outlines, a layer tree, and an inspector.

Active rebuild plan and reference notes: `docs/design-editor-framer-rebuild-plan.md`, `docs/design-references/`. When editing editor behavior, coordinate with the rebuild plan rather than rebuilding the chrome from scratch.

## Project content system

- `src/data/projects.ts` is the source of project slugs, statuses, and base media URLs. Project images are served from a GitHub raw media base (see `GITHUB_MEDIA_BASE`) and from `public/projects/<slug>/`.
- `src/data/projectContent.ts` defines the localized content types (`ProjectContent`, `LocalizedText`, `ProjectImages`, `ProjectFaq`, ...); `projectContent.generated.ts` is generated from source material by `scripts/build-project-content.ts`. Edit source data/scripts, not the generated file.
- Source artifacts: `İgloo project data/` (original `.pptx`, extracted data, photos) and `src/assets/pptx-media/` (slide images). These are inputs to the pipeline, not runtime assets.
- Image curation reports/inventories live under `docs/` (e.g. `docs/project-photo-inventory.*`, `docs/project-photo-selection.*`).

## UI and Content Notes

- The visual identity is mostly white/black with red accents (`#c22026` and `#e82a2e`) and large editorial construction imagery.
- Home page sections are stacked in `Home.tsx`; prefer adding/removing sections there rather than embedding unrelated content into existing sections.
- Many images and logos are loaded from remote URLs. If replacing them, verify dimensions and object-fit behavior on desktop and mobile.
- Some text currently contains mojibake/encoding artifacts such as `Ã©`, `â€“`, and `â€™`. Preserve existing text unless the task is to fix copy or encoding.
- Several navigation links are placeholders (`href="#"`) and `/contact` is referenced but no contact route exists. Account for this before adding navigation behavior.

## Environment

- `.env.example` documents `GEMINI_API_KEY`, optional `GOOGLE_MAPS_API_KEY` (build-time, restricted to Geocoding/Places APIs, used for project-page nearby-places; do not expose via Vite client vars), and `APP_URL`.
- Vite reads `DISABLE_HMR` and `DESIGN_STUDIO_API_PORT` at dev time. Do not commit real secrets; `.env*` (except `.env.example`) is gitignored.

## Verification

Verification must be proportional to risk. Do not run tests, TypeScript checks, builds, browser checks, or dev servers for documentation, copy-only, configuration, metadata, or clearly isolated low-risk edits unless the user requests them or evidence suggests a problem.

Run each selected verification command once after the edit set stabilizes. Repeat it only if a subsequent edit can affect its result or the first run was inconclusive. Batch targeted file searches/reads and bound their output; avoid repeatedly reading unchanged whole files.

- Small isolated code change: run the narrowest relevant check when one exists.
- Shared TypeScript/API change: run `npm run lint`.
- Build/config/dependency/route-boundary change: run `npm run build`; add `npm run lint` only when useful.
- Visual or animation change: inspect only the affected route and viewport; do not automatically test unrelated routes.
- Full `lint + build + Playwright` is reserved for broad, release-level, or high-risk changes.

When browser verification is actually warranted, check only relevant items from this list:

- `/` loads without console errors and the one-time intro veil plays once per session.
- `/projects` and `/projects/:slug` render the current demo/detail pages; `/projects1` still plays the legacy GSAP scroll choreography through all sections.
- Header, sliders, menu interactions, language switch (en/fr), and smooth scroll still work.
- `?edit=1` toggles the design editor shell without breaking the underlying page.
- Mobile widths do not introduce obvious text overlap or broken fixed-position controls.
