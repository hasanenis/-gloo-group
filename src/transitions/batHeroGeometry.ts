export type BatHeroParallaxRange = {
  from: number;
  to: number;
};

export type BatHeroTransitionGeometry = {
  overscan: number;
  overscanPx: number;
  heroHeight: number;
  imageHeight: number;
  imageTranslateY: number;
  parallax: BatHeroParallaxRange;
};

export type BatHeroTransitionLayout = "bat-demo" | "project-detail";

export type BatHeroTransitionGeometryOptions = {
  layout?: BatHeroTransitionLayout;
};

export function getBatHeroParallaxRange(width = window.innerWidth): BatHeroParallaxRange {
  if (width >= 1280) return { from: -12, to: 10 };
  if (width >= 680) return { from: -9, to: 8 };
  return { from: -7, to: 6 };
}

export function getBatHeroOverscan(width = window.innerWidth) {
  return width >= 1280 ? 24 : 20;
}

export function getBatHeroHeight(
  width = window.innerWidth,
  viewportHeight = window.innerHeight,
) {
  if (width >= 1280) {
    return Math.min(1402, Math.max(1080, width * 0.736));
  }

  if (width >= 680) {
    return Math.min(1200, Math.max(980, viewportHeight));
  }

  return viewportHeight;
}

export function getBatHeroTransitionGeometry(
  width = typeof window === "undefined" ? 1280 : window.innerWidth,
  viewportHeight = typeof window === "undefined" ? 900 : window.innerHeight,
  options: BatHeroTransitionGeometryOptions = {},
): BatHeroTransitionGeometry {
  const isProjectDetail = options.layout === "project-detail";
  const overscan = isProjectDetail ? 20 : getBatHeroOverscan(width);
  // Project details override the desktop image overscan to 20%, but keep the
  // same tall editorial hero height. Match both values at handoff.
  const heroHeight = getBatHeroHeight(width, viewportHeight);
  const overscanPx = heroHeight * (overscan / 100);
  const imageHeight = heroHeight + overscanPx * 2;
  const parallax = getBatHeroParallaxRange(width);

  return {
    overscan,
    overscanPx,
    heroHeight,
    imageHeight,
    imageTranslateY: imageHeight * (parallax.from / 100),
    parallax,
  };
}
