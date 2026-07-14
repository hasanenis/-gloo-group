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
    altFr: "Projet de logements à Douaouda",
    images: {
      hero: {
      src: "/projects/douaouda-300-500-housing/01-douaouda-1.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
      intro: {
      src: "/projects/douaouda-300-500-housing/03-douaouda.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
      square: {
      src: "/projects/douaouda-300-500-housing/02-douaouda-2.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
      wide: {
      src: "/projects/douaouda-300-500-housing/04-whatsapp-image-2025-11-10-a-11-58-44-45910f32.webp",
      fit: "cover",
      positionX: 50,
      positionY: 5,
      scale: 1.05,
    },
      info: {
      src: "/projects/douaouda-300-500-housing/info.webp",
      fit: "cover",
      positionX: 50,
      positionY: 58,
      scale: 0.65,
    },
      panorama: {
      src: "/projects/douaouda-300-500-housing/04-whatsapp-image-2025-11-10-a-11-58-44-45910f32.webp",
      fit: "cover",
      positionX: 50,
      positionY: 3,
      scale: 1.12,
    },
    },
  },
  "rahmania": {
    altEn: "Rahmania commercial centre",
    altFr: "Centre commercial Rahmania",
    images: {
      hero: {
      src: "/projects/rahmania/ChatGPT Image Jul 3, 2026, 09_46_20 PM_upscayl_4x_ultramix-balanced-4x.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
      intro: {
      src: "/projects/rahmania/06-rahmania-1.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
      square: {
      src: "/projects/rahmania/12-whatsapp-image-2025-11-12-at-15-18-39.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
      wide: {
      src: "/projects/rahmania/11-rahmania-3.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
      info: {
      src: "/projects/rahmania/community-graphic.png",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 0.96,
    },
      panorama: {
      src: "/projects/rahmania/ChatGPT Image Jul 3, 2026, 09_46_20 PM_upscayl_4x_ultramix-balanced-4x.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
    },
  },
  "sidi-abdallah-200-1200-housing": {
    altEn: "Sidi Abdallah promotional public housing",
    altFr: "Logements promotionnels publics de Sidi Abdallah",
    images: {
      hero: {
      src: "/projects/sidi-abdallah-200-1200-housing/02-13.webp",
      fit: "cover",
      positionX: 50,
      positionY: 45,
      scale: 1,
    },
      intro: {
      src: "/projects/sidi-abdallah-200-1200-housing/01-1.webp",
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
      positionY: 0,
      scale: 1.01,
    },
    },
  },
  "staoueli-11-41-villas": {
    altEn: "Staoueli villas and network works",
    altFr: "Villas et travaux de réseaux à Staoueli",
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
    altEn: "Said Hamdine mixed-use residential complex",
    altFr: "Complexe immobilier mixte de Said Hamdine",
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
    altEn: "Rouiba promotional villas and network works",
    altFr: "Villas promotionnelles et travaux de réseaux à Rouiba",
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
      scale: 0.71,
    },
      panorama: {
      src: "/projects/rouiba-4-promotional-villas/wide.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
    },
  },
  "sidi-benour-50-housing": {
    altEn: "Sidi Benour promotional housing",
    altFr: "Logements promotionnels de Sidi Benour",
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
    altEn: "Dely Brahim residential and commercial development",
    altFr: "Programme résidentiel et commercial de Dely Brahim",
    images: {
      hero: {
      src: "/projects/dely-brahim-240-housing/asd.png",
      fit: "cover",
      positionX: 50,
      positionY: 70,
      scale: 1.04,
    },
      intro: {
      src: "/projects/dely-brahim-240-housing/02-final-2.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
      square: {
      src: "/projects/dely-brahim-240-housing/03-final-3.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
      wide: {
      src: "/projects/dely-brahim-240-housing/04-final-4.webp",
      fit: "cover",
      positionX: 33,
      positionY: 9,
      scale: 1.04,
    },
      info: {
      src: "/projects/dely-brahim-240-housing/info.webp",
      fit: "cover",
      positionX: 54,
      positionY: 100,
      scale: 1.14,
    },
      panorama: {
      src: "/projects/dely-brahim-240-housing/asd.png",
      fit: "cover",
      positionX: 50,
      positionY: 100,
      scale: 1.12,
    },
    },
  },
  "bas-mazagran-200-38-housing": {
    altEn: "Bas Mazagran housing development",
    altFr: "Programme de logements de Bas Mazagran",
    images: {
      hero: {
      src: "/projects/bas-mazagran-200-38-housing/10-mostaghanem-1.webp",
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
      src: "/projects/bas-mazagran-200-38-housing/square.webp",
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
      src: "/projects/bas-mazagran-200-38-housing/10-mostaghanem-1_upscayl_4x_ultramix-balanced-4x.webp",
      fit: "cover",
      positionX: 50,
      positionY: 50,
      scale: 1,
    },
    },
  },
  "reghaia-bouraada-250-housing": {
    altEn: "Bouraada Site housing development in Reghaia",
    altFr: "Programme de logements du site Bouraada à Reghaia",
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
      scale: 1.07,
    },
      wide: {
      src: "/projects/reghaia-bouraada-250-housing/wide.webp",
      fit: "cover",
      positionX: 50,
      positionY: 6,
      scale: 1.05,
    },
      info: {
      src: "/projects/reghaia-bouraada-250-housing/info.webp",
      fit: "cover",
      positionX: 60,
      positionY: 12,
      scale: 1.05,
    },
      panorama: {
      src: "/projects/reghaia-bouraada-250-housing/wide.webp",
      fit: "cover",
      positionX: 50,
      positionY: 21,
      scale: 0.97,
    },
    },
  },
  "boudouaou-70-10-housing": {
    altEn: "Boudouaou assisted and promotional housing",
    altFr: "Logements aidés et promotionnels de Boudouaou",
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
      positionY: 75,
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
      positionY: 1,
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
