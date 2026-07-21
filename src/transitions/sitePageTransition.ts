import gsap from 'gsap';
import { getSiteTransitionMeta } from './routeTransitionPolicy';

type SitePageTransitionOptions = {
  targetPath: string;
  reducedMotion?: boolean;
  lenis?: {
    stop?: () => void;
    start?: () => void;
    scrollTo?: (
      target: number | HTMLElement | string,
      options?: { immediate?: boolean; force?: boolean },
    ) => void;
  } | null;
  navigate: (path: string) => void;
};

const ROOT_CLASS = 'site-route-transitioning';
const COMPLETE_EVENT = 'igloo:site-transition-complete';
const MAX_DESTINATION_WAIT_MS = 2800;
const SAFETY_TIMEOUT_MS = 5200;

let activeTransition: Promise<void> | null = null;

function pathnameOf(path: string) {
  try {
    return new URL(path, window.location.origin).pathname;
  } catch {
    return path.split(/[?#]/u)[0] || '/';
  }
}

function forceScrollTop(lenis?: SitePageTransitionOptions['lenis']) {
  const apply = () => {
    lenis?.scrollTo?.(0, { immediate: true, force: true });
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  apply();
  window.setTimeout(apply, 40);
  window.setTimeout(apply, 100);
}

function nextFrame() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

async function waitForDestination(targetPathname: string) {
  const startedAt = performance.now();

  while (performance.now() - startedAt < MAX_DESTINATION_WAIT_MS) {
    const routeReady = window.location.pathname === targetPathname;
    const pageReady = document.querySelector('main');

    if (routeReady && pageReady) {
      await nextFrame();
      await nextFrame();
      return;
    }

    await nextFrame();
  }
}

function createLayer(targetPath: string) {
  const meta = getSiteTransitionMeta(pathnameOf(targetPath));
  const layer = document.createElement('div');
  layer.className = 'site-page-transition';
  layer.setAttribute('aria-hidden', 'true');

  const grid = document.createElement('div');
  grid.className = 'site-page-transition__grid';

  for (let index = 0; index < 4; index += 1) {
    const panel = document.createElement('div');
    panel.className = 'site-page-transition__panel';
    panel.dataset.panel = String(index + 1);
    grid.appendChild(panel);
  }

  const signal = document.createElement('div');
  signal.className = 'site-page-transition__signal';

  const metaBlock = document.createElement('div');
  metaBlock.className = 'site-page-transition__meta';

  const metaIndex = document.createElement('span');
  metaIndex.className = 'site-page-transition__index';
  metaIndex.textContent = meta.index;

  const metaLabel = document.createElement('span');
  metaLabel.className = 'site-page-transition__label';
  metaLabel.textContent = meta.label;

  metaBlock.append(metaIndex, metaLabel);

  const brand = document.createElement('div');
  brand.className = 'site-page-transition__brand';
  brand.textContent = 'IGLOO / CONSTRUCTION';

  layer.append(grid, signal, metaBlock, brand);
  document.body.appendChild(layer);

  return layer;
}

async function performTransition({
  targetPath,
  reducedMotion,
  lenis,
  navigate,
}: SitePageTransitionOptions) {
  if (typeof window === 'undefined' || reducedMotion) {
    navigate(targetPath);
    forceScrollTop(lenis);
    return;
  }

  const root = document.documentElement;
  const targetPathname = pathnameOf(targetPath);
  const layer = createLayer(targetPath);
  const panels = Array.from(layer.querySelectorAll<HTMLElement>('.site-page-transition__panel'));
  const meta = layer.querySelector<HTMLElement>('.site-page-transition__meta');
  const brand = layer.querySelector<HTMLElement>('.site-page-transition__brand');
  const signal = layer.querySelector<HTMLElement>('.site-page-transition__signal');
  let cleaned = false;
  let aborted = false;
  let currentTimeline: gsap.core.Timeline | null = null;

  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    const tweenTargets = [layer, ...panels, meta, brand, signal].filter(
      (target): target is HTMLElement => Boolean(target),
    );
    gsap.killTweensOf(tweenTargets);
    layer.remove();
    root.classList.remove(ROOT_CLASS);
    lenis?.start?.();
    window.dispatchEvent(new CustomEvent(COMPLETE_EVENT));
  };

  const safetyTimer = window.setTimeout(() => {
    aborted = true;
    currentTimeline?.progress(1);
    cleanup();
  }, SAFETY_TIMEOUT_MS);

  root.classList.add(ROOT_CLASS);
  lenis?.stop?.();

  try {
    gsap.set(layer, { autoAlpha: 1 });
    gsap.set(panels, {
      yPercent: (index: number) => (index % 2 === 0 ? 104 : -104),
      force3D: true,
    });
    gsap.set([meta, brand], { autoAlpha: 0, y: 10 });
    gsap.set(signal, { scaleX: 0, transformOrigin: 'left center' });

    const cover = gsap.timeline({ defaults: { overwrite: 'auto' } });
    currentTimeline = cover;
    cover
      .to(panels, {
        yPercent: 0,
        duration: 0.64,
        stagger: 0.055,
        ease: 'power4.inOut',
      })
      .to(signal, { scaleX: 1, duration: 0.46, ease: 'power3.out' }, 0.2)
      .to([meta, brand], {
        autoAlpha: 1,
        y: 0,
        duration: 0.34,
        stagger: 0.045,
        ease: 'power3.out',
      }, 0.34);

    await cover.then();
    if (aborted) return;

    navigate(targetPath);
    forceScrollTop(lenis);
    await waitForDestination(targetPathname);
    if (aborted) return;

    const reveal = gsap.timeline({ defaults: { overwrite: 'auto' } });
    currentTimeline = reveal;
    reveal
      .to([meta, brand], {
        autoAlpha: 0,
        y: -8,
        duration: 0.2,
        ease: 'power2.in',
      })
      .to(signal, {
        scaleX: 0,
        transformOrigin: 'right center',
        duration: 0.34,
        ease: 'power3.inOut',
      }, 0.06)
      .to(panels, {
        yPercent: (index: number) => (index % 2 === 0 ? -104 : 104),
        duration: 0.68,
        stagger: { each: 0.05, from: 'end' },
        ease: 'power4.inOut',
      }, 0.12);

    await reveal.then();
  } finally {
    window.clearTimeout(safetyTimer);
    cleanup();
  }
}

export function runSitePageTransition(options: SitePageTransitionOptions) {
  if (activeTransition) return activeTransition;

  activeTransition = performTransition(options).finally(() => {
    activeTransition = null;
  });

  return activeTransition;
}
