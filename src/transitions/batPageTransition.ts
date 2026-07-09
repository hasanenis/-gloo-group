import type { BatHeroTransitionLayout } from "./batHeroGeometry";
import { getBatHeroTransitionGeometry } from "./batHeroGeometry";

type BatPageTransitionOptions = {
  targetPath: string;
  /**
   * "hero" plays the cinematic image rise (project detail pages);
   * "plain" is a quiet white wipe used for every other route.
   */
  variant?: "hero" | "plain";
  imageSrc?: string;
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
  afterNavigate?: () => void;
  onComplete?: () => void;
};

const TRANSITION_CLASS = "bat-demo-route-transitioning";
const ENTRY_CLASS = "bat-demo-transition-entering";
const ENTRY_KEY = "igloo:bat-demo-page-transition-entry";
const COMPLETE_EVENT = "bat-demo-page-transition-complete";
const CURSOR_RESET_EVENT = "bat-demo-cursor-reset";
const CURSOR_RELEASE_EVENT = "bat-demo-cursor-release";

function preloadImage(src?: string) {
  if (!src) return Promise.resolve();

  return new Promise<void>((resolve) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;

    if (image.complete) {
      void image.decode?.().then(resolve).catch(resolve);
    }
  });
}

function getTransitionPathname(targetPath: string) {
  try {
    return new URL(targetPath, window.location.origin).pathname;
  } catch {
    return targetPath.split(/[?#]/)[0] || targetPath;
  }
}

function getTransitionLayout(targetPath: string): BatHeroTransitionLayout {
  const pathname = getTransitionPathname(targetPath);
  return /^\/projects\/[^/]+\/?$/.test(pathname) ? "project-detail" : "bat-demo";
}

function createTransitionLayer(imageSrc: string | undefined, targetPath: string) {
  const geometry = getBatHeroTransitionGeometry(
    window.innerWidth,
    window.innerHeight,
    { layout: getTransitionLayout(targetPath) },
  );
  const layer = document.createElement("div");
  layer.className = "bat-page-transition";
  layer.setAttribute("aria-hidden", "true");
  layer.style.setProperty("--bat-transition-overscan", `${geometry.overscan}%`);
  layer.style.setProperty("--bat-transition-hero-height", `${geometry.heroHeight}px`);
  layer.style.setProperty("--bat-transition-overscan-px", `${geometry.overscanPx}px`);
  layer.style.setProperty("--bat-transition-image-height", `${geometry.imageHeight}px`);
  layer.style.setProperty("--bat-transition-y", `${geometry.imageTranslateY}px`);

  const image = document.createElement("img");
  image.className = "bat-page-transition__image";
  image.decoding = "async";
  image.alt = "";
  if (imageSrc) image.src = imageSrc;

  const veil = document.createElement("div");
  veil.className = "bat-page-transition__veil";

  layer.appendChild(image);
  layer.appendChild(veil);
  document.body.appendChild(layer);

  return { layer, geometry };
}

function createPlainTransitionLayer() {
  const layer = document.createElement("div");
  layer.className = "bat-page-transition bat-page-transition--plain";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);
  return layer;
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function forceScrollTop(
  lenis?: BatPageTransitionOptions["lenis"],
  attempts = 4,
) {
  const apply = () => {
    lenis?.scrollTo?.(0, { immediate: true, force: true });
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    document.scrollingElement?.scrollTo?.(0, 0);
  };

  apply();

  for (let index = 1; index <= attempts; index += 1) {
    window.setTimeout(apply, index * 40);
  }
}

export function markBatPageTransitionComplete() {
  document.documentElement.classList.remove(ENTRY_CLASS);
  window.sessionStorage.removeItem(ENTRY_KEY);
  window.dispatchEvent(new CustomEvent(COMPLETE_EVENT));
  window.dispatchEvent(new CustomEvent(CURSOR_RELEASE_EVENT));
}

export function consumeBatPageTransitionEntry(pathname = window.location.pathname) {
  const raw = window.sessionStorage.getItem(ENTRY_KEY);
  if (!raw) return false;

  try {
    const entry = JSON.parse(raw) as { targetPath?: string; startedAt?: number };
    const isFresh = Date.now() - Number(entry.startedAt ?? 0) < 8000;
    return isFresh && entry.targetPath === pathname;
  } catch {
    window.sessionStorage.removeItem(ENTRY_KEY);
    return false;
  }
}

export function onBatPageTransitionComplete(callback: () => void) {
  window.addEventListener(COMPLETE_EVENT, callback, { once: true });
  return () => window.removeEventListener(COMPLETE_EVENT, callback);
}

export async function runBatPageTransition({
  targetPath,
  variant = "hero",
  imageSrc,
  reducedMotion,
  lenis,
  navigate,
  afterNavigate,
  onComplete,
}: BatPageTransitionOptions) {
  if (typeof window === "undefined" || reducedMotion) {
    navigate(targetPath);
    forceScrollTop(lenis);
    afterNavigate?.();
    onComplete?.();
    return;
  }

  const root = document.documentElement;
  window.dispatchEvent(new CustomEvent(CURSOR_RESET_EVENT));
  root.classList.add(TRANSITION_CLASS, ENTRY_CLASS);
  const safetyTimer = window.setTimeout(() => {
    document.querySelectorAll(".bat-page-transition").forEach((element) => {
      element.remove();
    });
    root.classList.remove(TRANSITION_CLASS);
    markBatPageTransitionComplete();
    lenis?.start?.();
  }, 6200);
  window.sessionStorage.setItem(
    ENTRY_KEY,
    JSON.stringify({ targetPath, startedAt: Date.now() }),
  );

  lenis?.stop?.();

  if (variant === "plain") {
    const layer = createPlainTransitionLayer();
    const easing = "cubic-bezier(0.65, 0, 0.35, 1)";

    // Timer-driven (not `animation.finished`) so navigation still happens
    // even if the tab is hidden and the compositor never ticks the animation.
    layer.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 620, easing, fill: "forwards" },
    );

    await wait(620);
    navigate(targetPath);
    forceScrollTop(lenis);
    afterNavigate?.();
    await wait(240);

    layer.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 620, easing, fill: "forwards" },
    );

    await wait(620);
    window.clearTimeout(safetyTimer);
    layer.remove();
    root.classList.remove(TRANSITION_CLASS);
    markBatPageTransitionComplete();
    lenis?.start?.();
    onComplete?.();
    return;
  }

  await preloadImage(imageSrc);

  const { layer, geometry } = createTransitionLayer(imageSrc, targetPath);

  const rise = layer.animate(
    [
      {
        clipPath: "inset(78% 0 0 0)",
        transform: "translate3d(0, 8vh, 0)",
        opacity: 1,
      },
      {
        clipPath: "inset(18% 0 0 0)",
        transform: "translate3d(0, 0, 0)",
        opacity: 1,
        offset: 0.58,
      },
      {
        clipPath: "inset(0 0 0 0)",
        transform: "translate3d(0, 0, 0)",
        opacity: 1,
      },
    ],
    {
      duration: 1680,
      easing: "cubic-bezier(0.76, 0, 0.24, 1)",
      fill: "forwards",
    },
  );

  const image = layer.querySelector<HTMLImageElement>(".bat-page-transition__image");
  const finalImageY = geometry.imageTranslateY;
  const startImageY = finalImageY + geometry.imageHeight * 0.08;
  const imageDrift = image?.animate(
    [
      { transform: `translate3d(0, ${startImageY}px, 0) scale(1.08)` },
      { transform: `translate3d(0, ${finalImageY}px, 0) scale(1)` },
    ],
    {
      duration: 1900,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "forwards",
    },
  );

  await wait(1120);
  navigate(targetPath);
  forceScrollTop(lenis);
  afterNavigate?.();

  await rise.finished.catch(() => undefined);
  await imageDrift?.finished.catch(() => undefined);
  await wait(220);

  const fade = layer.animate(
    [
      { opacity: 1 },
      { opacity: 0 },
    ],
    {
      duration: 420,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "forwards",
    },
  );

  await fade.finished.catch(() => undefined);
  window.clearTimeout(safetyTimer);
  layer.remove();
  root.classList.remove(TRANSITION_CLASS);
  markBatPageTransitionComplete();
  lenis?.start?.();
  onComplete?.();
}
