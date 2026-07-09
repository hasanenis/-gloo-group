export type ImageScoreSet = {
  hero?: number;
  banner?: number;
  support?: number;
  gallery?: number;
  exclusionRisk?: number;
  uniqueness?: number;
  composition?: number;
  cleanliness?: number;
};

export type ImageAnalysisForCuration = {
  fileName: string;
  relativePath: string;
  summary?: string;
  shortCaption?: string;
  altText?: string;
  detailedDescription?: string;
  constructionStage?: string;
  dominantUseCase?: string;
  recommendedPlacements?: string[];
  bestSiteSections?: string[];
  supportingTopics?: string[];
  marketingTags?: string[];
  qualityNotes?: string[];
  doNotUseReasons?: string[];
  cropNotes?: string[];
  rationale?: string;
  confidence?: number;
  scores?: ImageScoreSet;
};

export type AnalysisFileForCuration = {
  heroCandidates?: string[];
  analyses?: ImageAnalysisForCuration[];
};

export type CurationEntry = {
  relativePath: string;
  src: string;
  analysis?: ImageAnalysisForCuration;
};

export type CuratedImage = CurationEntry & {
  editorialScore: number;
  sectionScores: Record<CurationSlot, number>;
  selected: boolean;
  selectedSlots: CurationSlot[];
  decision: 'selected' | 'not-selected';
  reason: string;
};

export type CurationSlot = 'hero' | 'intro' | 'mosaic' | 'featureGallery' | 'constructionGallery' | 'featured';

export type CuratedManifest = {
  hero: CuratedImage[];
  intro?: CuratedImage;
  mosaic: CuratedImage[];
  featureGallery: CuratedImage[];
  constructionGallery: CuratedImage[];
  featured: CuratedImage[];
};

export type ProjectImageCuration = {
  images: CuratedImage[];
  selected: CuratedImage[];
  manifest: CuratedManifest;
};

const MAX_UNIQUE_IMAGES_PER_PROJECT = 10;
const MAX_SECTION_IMAGES = 4;
const MAX_HERO_IMAGES = 2;

function scoreValue(value: number | undefined, fallback = 5) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function hasAny(values: string[] | undefined, patterns: RegExp[]) {
  const text = (values || []).join(' ');
  return patterns.some((pattern) => pattern.test(text));
}

function sectionBonus(analysis: ImageAnalysisForCuration | undefined, values: string[]) {
  if (!analysis) return 0;
  const sections = analysis.bestSiteSections || [];
  return sections.some((section) => values.includes(section)) ? 2 : 0;
}

function placementBonus(analysis: ImageAnalysisForCuration | undefined, values: string[]) {
  if (!analysis) return 0;
  const placements = [...(analysis.recommendedPlacements || []), analysis.dominantUseCase || ''];
  return placements.some((placement) => values.includes(placement)) ? 1.25 : 0;
}

function constructionBonus(analysis: ImageAnalysisForCuration | undefined) {
  if (!analysis) return 0;
  const text = normalize([
    analysis.constructionStage || '',
    analysis.summary || '',
    analysis.shortCaption || '',
    ...(analysis.bestSiteSections || []),
    ...(analysis.supportingTopics || []),
    ...(analysis.marketingTags || []),
  ].join(' '));
  return /construction|under construction|work in progress|progress|structural|earthwork|excavation|crane|formwork|chantier/.test(text) ? 2.5 : 0;
}

function heroCandidateBonus(analysis: ImageAnalysisForCuration | undefined, heroCandidates: Set<string>) {
  return analysis && heroCandidates.has(analysis.fileName) ? 2.5 : 0;
}

function scoreEntry(entry: CurationEntry, heroCandidates: Set<string>) {
  const scores = entry.analysis?.scores || {};
  const risk = scoreValue(scores.exclusionRisk, 2);
  const hero = scoreValue(scores.hero);
  const banner = scoreValue(scores.banner);
  const support = scoreValue(scores.support);
  const gallery = scoreValue(scores.gallery);
  const uniqueness = scoreValue(scores.uniqueness);
  const composition = scoreValue(scores.composition);
  const cleanliness = scoreValue(scores.cleanliness);
  const qualityPenalty = (entry.analysis?.doNotUseReasons?.length || 0) * 3;

  const sectionScores: Record<CurationSlot, number> = {
    hero:
      hero * 2.4 +
      banner * 1.1 +
      composition * 1.3 +
      cleanliness +
      uniqueness * 0.6 +
      heroCandidateBonus(entry.analysis, heroCandidates) -
      risk * 2.4 -
      qualityPenalty,
    intro:
      support * 1.4 +
      banner +
      composition +
      cleanliness +
      uniqueness * 0.6 +
      sectionBonus(entry.analysis, ['project-intro']) +
      placementBonus(entry.analysis, ['side-support', 'section-banner']) -
      risk * 1.7 -
      qualityPenalty,
    mosaic:
      gallery * 1.7 +
      composition +
      cleanliness +
      uniqueness * 1.1 +
      sectionBonus(entry.analysis, ['visual-mosaic']) -
      risk * 1.4 -
      qualityPenalty,
    featureGallery:
      support +
      gallery * 1.4 +
      composition +
      uniqueness * 1.2 +
      cleanliness * 0.8 +
      sectionBonus(entry.analysis, ['feature-gallery']) -
      risk * 1.4 -
      qualityPenalty,
    constructionGallery:
      gallery * 1.3 +
      support +
      composition * 0.9 +
      cleanliness * 0.8 +
      uniqueness +
      sectionBonus(entry.analysis, ['construction-gallery']) +
      constructionBonus(entry.analysis) -
      risk * 1.3 -
      qualityPenalty,
    featured:
      hero * 1.6 +
      banner +
      composition * 1.2 +
      cleanliness +
      uniqueness -
      risk * 2 -
      qualityPenalty,
  };

  const editorialScore =
    hero * 1.25 +
    banner +
    support +
    gallery * 1.15 +
    uniqueness * 1.25 +
    composition * 1.35 +
    cleanliness -
    risk * 2.2 -
    qualityPenalty +
    heroCandidateBonus(entry.analysis, heroCandidates) +
    constructionBonus(entry.analysis) * 0.45;

  return { editorialScore, sectionScores };
}

function byScore(slot: CurationSlot) {
  return (a: CuratedImage, b: CuratedImage) => b.sectionScores[slot] - a.sectionScores[slot] || b.editorialScore - a.editorialScore;
}

function byEditorialScore(a: CuratedImage, b: CuratedImage) {
  return b.editorialScore - a.editorialScore;
}

function chooseUnique(
  selected: Map<string, CuratedImage>,
  candidates: CuratedImage[],
  count: number,
  slot: CurationSlot,
  reason: string,
) {
  for (const candidate of candidates) {
    if (selected.size >= MAX_UNIQUE_IMAGES_PER_PROJECT || count <= 0) return;
    if (selected.has(candidate.relativePath)) continue;
    candidate.reason = reason;
    candidate.selectedSlots.push(slot);
    selected.set(candidate.relativePath, candidate);
    count -= 1;
  }
}

function addSlotImage(
  slots: Record<CurationSlot, CuratedImage[]>,
  covered: Set<string>,
  slot: CurationSlot,
  image: CuratedImage | undefined,
) {
  if (!image) return false;
  if (slots[slot].some((item) => item.relativePath === image.relativePath)) return false;
  if (slots[slot].length >= (slot === 'hero' ? MAX_HERO_IMAGES : slot === 'intro' || slot === 'featured' ? 1 : MAX_SECTION_IMAGES)) return false;
  slots[slot].push(image);
  covered.add(image.relativePath);
  return true;
}

function distributeManifestSlots(active: CuratedImage[]): CuratedManifest {
  const slots: Record<CurationSlot, CuratedImage[]> = {
    hero: [],
    intro: [],
    mosaic: [],
    featureGallery: [],
    constructionGallery: [],
    featured: [],
  };
  const covered = new Set<string>();

  for (const image of [...active].sort(byScore('hero')).slice(0, Math.min(MAX_HERO_IMAGES, active.length))) {
    addSlotImage(slots, covered, 'hero', image);
  }
  addSlotImage(slots, covered, 'featured', [...active].sort(byScore('featured'))[0]);
  addSlotImage(slots, covered, 'intro', [...active].sort((a, b) => {
    const aCovered = covered.has(a.relativePath) ? 1 : 0;
    const bCovered = covered.has(b.relativePath) ? 1 : 0;
    return aCovered - bCovered || byScore('intro')(a, b);
  })[0]);

  const gallerySlots: CurationSlot[] = ['mosaic', 'featureGallery', 'constructionGallery'];
  while (active.some((image) => !covered.has(image.relativePath)) && gallerySlots.some((slot) => slots[slot].length < MAX_SECTION_IMAGES)) {
    let addedThisRound = false;
    for (const slot of gallerySlots) {
      const candidate = [...active]
        .filter((image) => !covered.has(image.relativePath))
        .sort(byScore(slot))[0];
      if (addSlotImage(slots, covered, slot, candidate)) {
        addedThisRound = true;
      }
    }
    if (!addedThisRound) break;
  }

  for (const slot of gallerySlots) {
    for (const image of [...active].sort(byScore(slot))) {
      addSlotImage(slots, covered, slot, image);
      if (slots[slot].length >= Math.min(MAX_SECTION_IMAGES, active.length)) break;
    }
  }

  for (const image of active) {
    image.selectedSlots = [];
  }
  for (const [slot, slotImages] of Object.entries(slots) as Array<[CurationSlot, CuratedImage[]]>) {
    for (const image of slotImages) {
      if (!image.selectedSlots.includes(slot)) {
        image.selectedSlots.push(slot);
      }
    }
  }

  return {
    hero: slots.hero,
    intro: slots.intro[0] || slots.hero[0] || active[0],
    mosaic: slots.mosaic,
    featureGallery: slots.featureGallery,
    constructionGallery: slots.constructionGallery,
    featured: slots.featured.length ? slots.featured : slots.hero.slice(0, 1),
  };
}

function selectedReason(image: CuratedImage) {
  const slots = image.selectedSlots.join(', ');
  if (image.reason) return image.reason;
  return `Selected for ${slots || 'overall editorial strength'} with score ${image.editorialScore.toFixed(1)}.`;
}

function rejectedReason(image: CuratedImage, selectedCutoff: number) {
  const risk = scoreValue(image.analysis?.scores?.exclusionRisk, 2);
  if ((image.analysis?.doNotUseReasons || []).length > 0) {
    return `Not selected because it has quality/use risks: ${image.analysis?.doNotUseReasons?.join('; ')}.`;
  }
  if (risk >= 7) {
    return `Not selected because exclusion risk is high (${risk.toFixed(1)}).`;
  }
  if (image.editorialScore < selectedCutoff - 4) {
    return `Not selected because stronger images cover this project and visual angle.`;
  }
  return `Not selected to keep the project within the ${MAX_UNIQUE_IMAGES_PER_PROJECT}-image editorial limit.`;
}

export function curateProjectImages(entries: CurationEntry[], analysis: AnalysisFileForCuration | null): ProjectImageCuration {
  const heroCandidates = new Set(analysis?.heroCandidates || []);
  const images = entries.map((entry): CuratedImage => {
    const scored = scoreEntry(entry, heroCandidates);
    return {
      ...entry,
      editorialScore: scored.editorialScore,
      sectionScores: scored.sectionScores,
      selected: false,
      selectedSlots: [],
      decision: 'not-selected',
      reason: '',
    };
  });

  if (images.length === 0) {
    return {
      images: [],
      selected: [],
      manifest: { hero: [], mosaic: [], featureGallery: [], constructionGallery: [], featured: [] },
    };
  }

  const selected = new Map<string, CuratedImage>();
  const heroPool = images.filter((image) => heroCandidates.has(image.analysis?.fileName || '') || image.sectionScores.hero >= 24).sort(byScore('hero'));
  chooseUnique(selected, heroPool.length ? heroPool : [...images].sort(byScore('hero')), Math.min(MAX_HERO_IMAGES, images.length), 'hero', 'Hero veya kapak için en güçlü kompozisyon.');
  chooseUnique(selected, [...images].sort(byScore('intro')), 1, 'intro', 'Giriş bölümünde projeyi net anlatan destek görseli.');

  const constructionPool = images
    .filter((image) => constructionBonus(image.analysis) > 0 || image.sectionScores.constructionGallery >= 23)
    .sort(byScore('constructionGallery'));
  chooseUnique(selected, constructionPool, 1, 'constructionGallery', 'İnşaat süreci veya ilerleme anlatımı için seçildi.');
  chooseUnique(selected, [...images].sort(byScore('featureGallery')), 1, 'featureGallery', 'Detay/feature anlatımını güçlendiren farklı açı.');
  chooseUnique(selected, [...images].sort(byEditorialScore), MAX_UNIQUE_IMAGES_PER_PROJECT, 'mosaic', 'Genel editoryal puanı ve çeşitlilik için seçildi.');

  const selectedImages = [...selected.values()].sort(byEditorialScore);
  const selectedCutoff = selectedImages.at(-1)?.editorialScore ?? 0;
  const manifest = distributeManifestSlots(selectedImages);
  for (const image of images) {
    image.selected = selected.has(image.relativePath);
    image.decision = image.selected ? 'selected' : 'not-selected';
    image.reason = image.selected ? selectedReason(image) : rejectedReason(image, selectedCutoff);
  }

  return {
    images: images.sort(byEditorialScore),
    selected: selectedImages,
    manifest,
  };
}
