# AGENTS.md

## Project Overview

This is a Vite + React + TypeScript frontend for an Igloo Construction marketing site. The UI is animation-heavy and uses GSAP, ScrollTrigger, Motion/Framer Motion, Tailwind CSS v4, React Router, and lucide-react icons.

Primary routes:

- `/` renders the home page from `src/pages/Home.tsx`.
- `/projects` renders the animated project showcase from `src/pages/Projects.tsx`.

## Tech Stack

- React 19 with functional components.
- TypeScript with `jsx: react-jsx`.
- Vite 6.
- Tailwind CSS v4 through `@tailwindcss/vite`.
- GSAP and `@gsap/react` for timeline and scroll-triggered animation.
- `motion/react` and `framer-motion` are both present; follow the import style already used in the file being edited.
- `react-router-dom` for routing.
- `lucide-react` for icons.

## Commands

Use these from the repository root:

```powershell
npm install
npm run dev
npm run build
npm run lint
```

Notes:

- `npm run dev` starts Vite on port `3000` and host `0.0.0.0`.
- `npm run lint` currently runs `tsc --noEmit`; there is no ESLint setup.
- `npm run clean` uses `rm -rf dist`, which is Unix-style and may not work in Windows PowerShell without a compatible shell.

## Repository Structure

- `src/App.tsx`: route registration.
- `src/main.tsx`: React entrypoint.
- `src/index.css`: Tailwind import, theme fonts, and global light-mode overrides.
- `src/pages/Home.tsx`: home page section composition.
- `src/pages/Projects.tsx`: large GSAP-driven project page and scroll choreography.
- `src/components/*`: reusable home page sections, sliders, footer, header, statistics, testimonials, and video blocks.
- `vite.config.ts`: Vite, React, Tailwind, alias, and Gemini env define setup.

## Coding Guidelines

- Keep components functional and colocate simple section data arrays at the top of the component file, matching the current style.
- Prefer Tailwind utility classes for layout and visual styling. Use inline styles only for dynamic values, clip paths, background images, object positions, or animation-specific values already represented that way.
- Use `lucide-react` icons for common UI symbols.
- Register GSAP plugins once per module when needed, for example `gsap.registerPlugin(ScrollTrigger)`.
- Scope GSAP selectors with `useGSAP(..., { scope: ref })` when editing or adding animations.
- Clean up browser event listeners in `useEffect` return callbacks.
- Keep animation class names stable when changing markup, because GSAP timelines target many elements by class selector.
- Be careful when editing `src/pages/Projects.tsx`: scroll progress, timeline labels, canvas positions, and menu project names are tightly coupled.
- Avoid broad rewrites of large animated sections unless the task specifically requires it.

## UI and Content Notes

- The visual identity is mostly white/black with red accents (`#c22026` and `#e82a2e`) and large editorial construction imagery.
- Home page sections are stacked in `Home.tsx`; prefer adding/removing sections there rather than embedding unrelated content into existing sections.
- Many images and logos are loaded from remote URLs. If replacing them, verify dimensions and object-fit behavior on desktop and mobile.
- Some text currently contains mojibake/encoding artifacts such as `Ã©`, `â€“`, and `â€™`. Preserve existing text unless the task is to fix copy or encoding.
- Several navigation links are placeholders (`href="#"`) and `/contact` is linked in `Projects.tsx` but no contact route exists. Account for this before adding navigation behavior.

## Environment

- `.env.example` documents `GEMINI_API_KEY` and `APP_URL`.
- `vite.config.ts` exposes `process.env.GEMINI_API_KEY` at build time. Do not commit real secrets.
- The current app appears to be an AI Studio export, but the visible frontend does not currently call Gemini APIs.

## Verification

For most changes:

```powershell
npm run lint
npm run build
```

For visual or animation changes:

```powershell
npm run dev
```

Then manually verify:

- `/` loads without console errors.
- `/projects` scroll animation progresses through all project sections.
- Header, sliders, and menu interactions still work.
- Mobile widths do not introduce obvious text overlap or broken fixed-position controls.
