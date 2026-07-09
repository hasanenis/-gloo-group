import type { ProjectImage } from './projectContent';

export type ManualProjectImageSlot = 'hero' | 'intro' | 'square' | 'wide' | 'info' | 'panorama';

export type ManualImageSettings = {
  src?: string;
  fit?: 'cover' | 'contain';
  positionX?: number;
  positionY?: number;
  scale?: number;
};

type ManualProjectImageConfig = {
  altEn?: string;
  altFr?: string;
  images?: Partial<Record<ManualProjectImageSlot, ManualImageSettings>>;
  hero?: string;
  heroFit?: 'cover' | 'contain';
  heroPositionX?: number;
  heroPositionY?: number;
  heroScale?: number;
};

export type ResolvedManualImageSettings = {
  fit: 'cover' | 'contain';
  positionX: number;
  positionY: number;
  scale: number;
};

/*
  MANUEL PROJE GORSELLERI

  Kod aramadan degistirmek icin:
  npm run project-image-editor

  Slotlar:
  hero     = en ustteki buyuk hero
  intro    = hero altindaki split gorsel
  square   = ikili fotograf alanindaki kare gorsel
  wide     = ikili fotograf alanindaki genis gorsel
  info     = 300/500 gibi metrik panelinin arkadaki cizimi
  panorama = alttaki yatay panorama
*/
export const manualProjectImages: Record<string, ManualProjectImageConfig> = {
  "douaouda-300-500-housing": {
    altEn: "Douaouda housing project",
    altFr: "Projet de logements a Douaouda",
    images: {
      hero: {
      src: "",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
      intro: {
      src: "",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
      square: {
      src: "",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
      wide: {
      src: "",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
      info: {
      src: "/projects/douaouda-300-500-housing/info.webp",
      fit: "cover",
      positionX: 50,
      positionY: 58,
      scale: 0.65,
    },
      panorama: {
      src: "",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
    },
  },
  "sidi-abdallah-200-1200-housing": {
    altEn: "",
    altFr: "",
    images: {
      hero: {
      src: "/projects/sidi-abdallah-200-1200-housing/02-13.webp",
      fit: "cover",
      positionX: 31,
      positionY: 45,
      scale: 1,
    },
      intro: {
      src: "",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
      square: {
      src: "/projects/sidi-abdallah-200-1200-housing/03-sidi-abdullah-lpp-1.webp",
      fit: "cover",
      positionX: 72,
      positionY: 42,
      scale: 1,
    },
      wide: {
      src: "/projects/sidi-abdallah-200-1200-housing/04-sidi-abdullah-lpp-2.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
      info: {
      src: "/projects/sidi-abdallah-200-1200-housing/info.webp",
      fit: "cover",
      positionX: 39,
      positionY: 58,
      scale: 0.81,
    },
      panorama: {
      src: "/projects/sidi-abdallah-200-1200-housing/01-1.webp",
      fit: "cover",
      positionX: 56,
      positionY: 35,
      scale: 1.01,
    },
    },
  },
  "staoueli-11-41-villas": {
    altEn: "",
    altFr: "",
    images: {
      hero: {
      src: "/projects/staoueli-11-41-villas/hero.webp",
      fit: "cover",
      positionX: 65,
      positionY: 0,
      scale: 1.02,
    },
      intro: {
      src: "/projects/staoueli-11-41-villas/intro.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 0.96,
    },
      square: {
      src: "/projects/staoueli-11-41-villas/square.webp",
      fit: "cover",
      positionX: 60,
      positionY: 48,
      scale: 1.03,
    },
      wide: {
      src: "/projects/staoueli-11-41-villas/wide.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
      info: {
      src: "/projects/staoueli-11-41-villas/info.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 0.81,
    },
      panorama: {
      src: "/projects/staoueli-11-41-villas/panorama.webp",
      fit: "cover",
      positionX: 31,
      positionY: 0,
      scale: 1.16,
    },
    },
  },
  "said-hamdine-mixed-real-estate": {
    altEn: "",
    altFr: "",
    images: {
      hero: {
      src: "/projects/said-hamdine-mixed-real-estate/hero.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
      intro: {
      src: "/projects/said-hamdine-mixed-real-estate/intro.webp",
      fit: "cover",
      positionX: 81,
      positionY: 51,
      scale: 1.16,
    },
      square: {
      src: "/projects/said-hamdine-mixed-real-estate/square.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
      wide: {
      src: "/projects/said-hamdine-mixed-real-estate/wide.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
      info: {
      src: "/projects/said-hamdine-mixed-real-estate/info.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 0.82,
    },
      panorama: {
      src: "/projects/said-hamdine-mixed-real-estate/panorama.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
    },
  },
  "rouiba-4-promotional-villas": {
    altEn: "",
    altFr: "",
    images: {
      hero: {
      src: "/projects/rouiba-4-promotional-villas/hero.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
      intro: {
      src: "/projects/rouiba-4-promotional-villas/intro.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
      square: {
      src: "/projects/rouiba-4-promotional-villas/square.webp",
      fit: "cover",
      positionX: 50,
      positionY: 0,
      scale: 1.06,
    },
      wide: {
      src: "/projects/rouiba-4-promotional-villas/wide.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
      info: {
      src: "/projects/rouiba-4-promotional-villas/info.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 0.85,
    },
      panorama: {
      src: "/projects/rouiba-4-promotional-villas/hero.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
    },
  },
  "sidi-benour-50-housing": {
    altEn: "",
    altFr: "",
    images: {
      hero: {
      src: "/projects/sidi-benour-50-housing/hero.webp",
      fit: "cover",
      positionX: 50,
      positionY: 0,
      scale: 1,
    },
      intro: {
      src: "/projects/sidi-benour-50-housing/intro.webp",
      fit: "cover",
      positionX: 50,
      positionY: 24,
      scale: 1,
    },
      square: {
      src: "/projects/sidi-benour-50-housing/square.webp",
      fit: "cover",
      positionX: 50,
      positionY: 14,
      scale: 1,
    },
      wide: {
      src: "/projects/sidi-benour-50-housing/wide.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
      info: {
      src: "/projects/sidi-benour-50-housing/info.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 0.85,
    },
      panorama: {
      src: "/projects/sidi-benour-50-housing/intro.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
    },
  },
  "dely-brahim-240-housing": {
    altEn: "",
    altFr: "",
    images: {
      hero: {
      src: "",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
      intro: {
      src: "",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
      square: {
      src: "",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
      wide: {
      src: "",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
      info: {
      src: "/projects/dely-brahim-240-housing/info.webp",
      fit: "cover",
      positionX: 50,
      positionY: 2,
      scale: 0.5,
    },
      panorama: {
      src: "",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
    },
  },
  "bas-mazagran-200-38-housing": {
    altEn: "",
    altFr: "",
    images: {
      hero: {
      src: "",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
      intro: {
      src: "/projects/bas-mazagran-200-38-housing/intro.webp",
      fit: "cover",
      positionX: 50,
      positionY: 18,
      scale: 1.03,
    },
      square: {
      src: "/projects/bas-mazagran-200-38-housing/square.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
      wide: {
      src: "/projects/bas-mazagran-200-38-housing/wide.webp",
      fit: "cover",
      positionX: 50,
      positionY: 0,
      scale: 1,
    },
      info: {
      src: "/projects/bas-mazagran-200-38-housing/info.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 0.75,
    },
      panorama: {
      src: "",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
    },
  },
  "reghaia-bouraada-250-housing": {
    altEn: "",
    altFr: "",
    images: {
      hero: {
      src: "/projects/reghaia-bouraada-250-housing/hero.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
      intro: {
      src: "/projects/reghaia-bouraada-250-housing/intro.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
      square: {
      src: "/projects/reghaia-bouraada-250-housing/square.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
      wide: {
      src: "/projects/reghaia-bouraada-250-housing/wide.webp",
      fit: "cover",
      positionX: 50,
      positionY: 12,
      scale: 1,
    },
      info: {
      src: "/projects/reghaia-bouraada-250-housing/info.webp",
      fit: "cover",
      positionX: 60,
      positionY: 12,
      scale: 1.23,
    },
      panorama: {
      src: "/projects/reghaia-bouraada-250-housing/wide.webp",
      fit: "cover",
      positionX: 50,
      positionY: 3,
      scale: 1,
    },
    },
  },
  "boudouaou-70-10-housing": {
    altEn: "",
    altFr: "",
    images: {
      hero: {
      src: "/projects/boudouaou-70-10-housing/hero.webp",
      fit: "cover",
      positionX: 45,
      positionY: 0,
      scale: 1.09,
    },
      intro: {
      src: "/projects/boudouaou-70-10-housing/intro.webp",
      fit: "cover",
      positionX: 50,
      positionY: 79,
      scale: 1.01,
    },
      square: {
      src: "/projects/boudouaou-70-10-housing/square.webp",
      fit: "cover",
      positionX: 50,
      positionY: 15,
      scale: 1,
    },
      wide: {
      src: "/projects/boudouaou-70-10-housing/wide.webp",
      fit: "cover",
      positionX: 50,
      positionY: 82,
      scale: 1.05,
    },
      info: {
      src: "/projects/boudouaou-70-10-housing/info.webp",
      fit: "cover",
      positionX: 30,
      positionY: 12,
      scale: 0.67,
    },
      panorama: {
      src: "/projects/boudouaou-70-10-housing/hero.webp",
      fit: "cover",
      positionX: 50,
      positionY: 15,
      scale: 1.1,
    },
    },
  },
};

function legacyHeroSettings(config?: ManualProjectImageConfig): ManualImageSettings | undefined {
  if (!config?.hero) return undefined;

  return {
    src: config.hero,
    fit: config.heroFit ?? 'cover',
    positionX: config.heroPositionX ?? 50,
    positionY: config.heroPositionY ?? 50,
    scale: config.heroScale ?? 1,
  };
}

function getSlotConfig(slug: string, slot: ManualProjectImageSlot): ManualImageSettings | undefined {
  const config = manualProjectImages[slug];
  if (!config) return undefined;
  return config.images?.[slot] ?? (slot === 'hero' ? legacyHeroSettings(config) : undefined);
}

export function getManualProjectImage(slug: string, slot: ManualProjectImageSlot): ProjectImage | undefined {
  const config = manualProjectImages[slug];
  const slotConfig = getSlotConfig(slug, slot);
  const src = slotConfig?.src?.trim();
  if (!src) return undefined;

  return {
    src,
    alt: {
      en: config?.altEn ?? slug,
      fr: config?.altFr ?? config?.altEn ?? slug,
    },
  };
}

export function getManualProjectImageSettings(
  slug: string,
  slot: ManualProjectImageSlot,
): ResolvedManualImageSettings | undefined {
  const slotConfig = getSlotConfig(slug, slot);
  if (!slotConfig) return undefined;

  return {
    fit: slotConfig.fit ?? 'cover',
    positionX: slotConfig.positionX ?? 50,
    positionY: slotConfig.positionY ?? 50,
    scale: slotConfig.scale ?? 1,
  };
}

export function getManualProjectHeroImage(slug: string): ProjectImage | undefined {
  return getManualProjectImage(slug, 'hero');
}

export function getManualProjectHeroSettings(slug: string): ResolvedManualImageSettings | undefined {
  return getManualProjectImageSettings(slug, 'hero');
}
