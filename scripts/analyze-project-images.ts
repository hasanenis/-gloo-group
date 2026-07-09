import 'dotenv/config';
import { GoogleGenAI, Type } from '@google/genai';
import { projects, type ProjectRecord } from '../src/data/projects.ts';
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

type SitePlacement =
  | 'hero'
  | 'section-banner'
  | 'side-support'
  | 'gallery'
  | 'detail-only'
  | 'exclude';

type SiteSection =
  | 'project-hero'
  | 'project-intro'
  | 'visual-mosaic'
  | 'feature-gallery'
  | 'construction-gallery'
  | 'featured-card';

type PlacementScores = {
  hero: number;
  banner: number;
  support: number;
  gallery: number;
  exclusionRisk: number;
  uniqueness: number;
  composition: number;
  cleanliness: number;
};

type ImageAnalysis = {
  fileName: string;
  relativePath: string;
  mimeType: string;
  width: number | null;
  height: number | null;
  aspectRatio: number | null;
  summary: string;
  shortCaption: string;
  altText: string;
  detailedDescription: string;
  projectType: string;
  visibleElements: string[];
  constructionStage: string;
  dominantUseCase: SitePlacement;
  recommendedPlacements: SitePlacement[];
  bestSiteSections: SiteSection[];
  supportingTopics: string[];
  marketingTags: string[];
  qualityNotes: string[];
  doNotUseReasons: string[];
  cropNotes: string[];
  textFoundInImage: string[];
  rationale: string;
  confidence: number;
  scores: PlacementScores;
};

type EditorialSection = {
  section: SiteSection;
  files: string[];
  reason: string;
};

type LowPriorityItem = {
  fileName: string;
  reason: string;
};

type EditorialPlan = {
  editorialSummary: string;
  heroShortlist: string[];
  sectionRecommendations: EditorialSection[];
  lowPriority: LowPriorityItem[];
  contentGaps: string[];
  siteRules: string[];
  notes: string[];
};

type ProjectContext = {
  folderName: string;
  projectName: string;
  displayName: string;
  summary: string;
  scope: string;
  status: string;
  location: string;
  clientProfile: string;
  sourceRecord?: ProjectRecord;
};

type ProjectOutput = {
  context: ProjectContext;
  generatedAt: string;
  imageCount: number;
  editorialPlan: EditorialPlan;
  heroCandidates: string[];
  analyses: ImageAnalysis[];
};

type CacheEntry = {
  cacheKey: string;
  analysis: ImageAnalysis;
};

type AnalyzeArgs = {
  project?: string;
  all: boolean;
  inputRoot: string;
  outputRoot: string;
  model: string;
};

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.bmp']);

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.bmp': 'image/bmp',
};

const SITE_SECTION_ORDER: SiteSection[] = [
  'project-hero',
  'project-intro',
  'visual-mosaic',
  'feature-gallery',
  'construction-gallery',
  'featured-card',
];

const DEFAULT_MODEL = process.env.IGLOO_GEMINI_MODEL || 'gemini-2.5-flash';
const DATA_DIRECTORY = `${String.fromCodePoint(0x130)}gloo project data`;
const ANALYSIS_CONCURRENCY = Math.max(1, Number(process.env.IGLOO_IMAGE_ANALYSIS_CONCURRENCY || '3'));
const DEFAULT_ROOT = path.resolve(
  process.cwd(),
  DATA_DIRECTORY,
  'photos projet',
);
const DEFAULT_OUTPUT_ROOT = path.resolve(
  process.cwd(),
  DATA_DIRECTORY,
  'analysis',
);

const IMAGE_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    shortCaption: { type: Type.STRING },
    altText: { type: Type.STRING },
    detailedDescription: { type: Type.STRING },
    projectType: { type: Type.STRING },
    visibleElements: { type: Type.ARRAY, items: { type: Type.STRING } },
    constructionStage: { type: Type.STRING },
    dominantUseCase: { type: Type.STRING },
    recommendedPlacements: { type: Type.ARRAY, items: { type: Type.STRING } },
    bestSiteSections: { type: Type.ARRAY, items: { type: Type.STRING } },
    supportingTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
    marketingTags: { type: Type.ARRAY, items: { type: Type.STRING } },
    qualityNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
    doNotUseReasons: { type: Type.ARRAY, items: { type: Type.STRING } },
    cropNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
    textFoundInImage: { type: Type.ARRAY, items: { type: Type.STRING } },
    rationale: { type: Type.STRING },
    confidence: { type: Type.NUMBER },
    scores: {
      type: Type.OBJECT,
      properties: {
        hero: { type: Type.NUMBER },
        banner: { type: Type.NUMBER },
        support: { type: Type.NUMBER },
        gallery: { type: Type.NUMBER },
        exclusionRisk: { type: Type.NUMBER },
        uniqueness: { type: Type.NUMBER },
        composition: { type: Type.NUMBER },
        cleanliness: { type: Type.NUMBER },
      },
      required: [
        'hero',
        'banner',
        'support',
        'gallery',
        'exclusionRisk',
        'uniqueness',
        'composition',
        'cleanliness',
      ],
    },
  },
  required: [
    'summary',
    'shortCaption',
    'altText',
    'detailedDescription',
    'projectType',
    'visibleElements',
    'constructionStage',
    'dominantUseCase',
    'recommendedPlacements',
    'bestSiteSections',
    'supportingTopics',
    'marketingTags',
    'qualityNotes',
    'doNotUseReasons',
    'cropNotes',
    'textFoundInImage',
    'rationale',
    'confidence',
    'scores',
  ],
};

const EDITORIAL_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    editorialSummary: { type: Type.STRING },
    heroShortlist: { type: Type.ARRAY, items: { type: Type.STRING } },
    sectionRecommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          section: { type: Type.STRING },
          files: { type: Type.ARRAY, items: { type: Type.STRING } },
          reason: { type: Type.STRING },
        },
        required: ['section', 'files', 'reason'],
      },
    },
    lowPriority: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          fileName: { type: Type.STRING },
          reason: { type: Type.STRING },
        },
        required: ['fileName', 'reason'],
      },
    },
    contentGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
    siteRules: { type: Type.ARRAY, items: { type: Type.STRING } },
    notes: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: [
    'editorialSummary',
    'heroShortlist',
    'sectionRecommendations',
    'lowPriority',
    'contentGaps',
    'siteRules',
    'notes',
  ],
};

const PROJECT_ALIASES: Record<string, string[]> = {
  'douaouda': ['douaouda'],
  'sidi abdellah': ['sidi abdellah', 'sidi abdallah', 'mahalma'],
  'staouali': ['staouali', 'staoueli'],
  'douira': ['douira'],
  'said hamdine': ['said hamdine'],
  'rouiba': ['rouiba'],
  'sidi benour': ['sidi benour'],
  'dely brahim': ['dely brahim'],
  'bas mazagran': ['mostaghanem', 'bas mazagran', 'mazagran'],
  'reghaia': ['reghaia', 'bouraada'],
  'boudouaou': ['boudouaou'],
};

function normalizeText(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function parseArgs(argv: string[]): AnalyzeArgs {
  const args: Record<string, string | true> = {};
  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i];
    if (!value.startsWith('--')) {
      continue;
    }
    const key = value.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    i += 1;
  }

  return {
    project: typeof args.project === 'string' ? args.project : undefined,
    all: args.all === true || args.all === 'true',
    inputRoot: typeof args['input-root'] === 'string' ? args['input-root'] : DEFAULT_ROOT,
    outputRoot: typeof args['output-root'] === 'string' ? args['output-root'] : DEFAULT_OUTPUT_ROOT,
    model: typeof args.model === 'string' ? args.model : DEFAULT_MODEL,
  };
}

function createClient() {
  const useEnterprise = process.env.GOOGLE_GENAI_USE_ENTERPRISE === 'true';
  if (useEnterprise) {
    const project = process.env.GOOGLE_CLOUD_PROJECT;
    const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
    if (!project) {
      throw new Error(
        'GOOGLE_CLOUD_PROJECT is required when GOOGLE_GENAI_USE_ENTERPRISE=true.',
      );
    }
    return new GoogleGenAI({
      enterprise: true,
      project,
      location,
    });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error(
      'Set GEMINI_API_KEY for API-key mode, or GOOGLE_GENAI_USE_ENTERPRISE=true with ADC for Google Cloud mode.',
    );
  }
  return new GoogleGenAI({ apiKey });
}

function getProjectRecord(folderName: string) {
  const normalizedFolder = normalizeText(folderName);
  for (const project of projects) {
    const candidates = [
      project.slug,
      project.title,
      project.menuTitle,
      project.location,
      project.summary,
      project.scope,
    ].map(normalizeText);
    if (candidates.some((candidate) => candidate.includes(normalizedFolder) || normalizedFolder.includes(candidate))) {
      return project;
    }
  }

  for (const [key, aliases] of Object.entries(PROJECT_ALIASES)) {
    if (aliases.some((alias) => normalizeText(alias) === normalizedFolder)) {
      const project = projects.find((item) => {
        const recordCandidates = [
          item.slug,
          item.title,
          item.menuTitle,
          item.location,
        ].map(normalizeText);
        return recordCandidates.some(
          (candidate) => candidate === normalizeText(key) || aliases.some((alias) => candidate.includes(normalizeText(alias))),
        );
      });
      if (project) {
        return project;
      }
    }
  }

  return undefined;
}

function buildProjectContext(folderName: string): ProjectContext {
  const record = getProjectRecord(folderName);
  if (!record) {
    return {
      folderName,
      projectName: folderName,
      displayName: folderName,
      summary: '',
      scope: '',
      status: 'unknown',
      location: folderName,
      clientProfile: '',
    };
  }

  return {
    folderName,
    projectName: record.menuTitle,
    displayName: record.title,
    summary: record.summary,
    scope: record.scope,
    status: record.chapterLabel,
    location: record.location,
    clientProfile: [
      `Project title: ${record.title}`,
      `Location: ${record.location}`,
      `Status: ${record.chapterLabel}`,
      `Summary: ${record.summary}`,
      `Scope: ${record.scope}`,
    ].join('\n'),
    sourceRecord: record,
  };
}

async function walkImages(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return walkImages(fullPath);
      }
      if (!entry.isFile()) {
        return [];
      }
      const ext = path.extname(entry.name).toLowerCase();
      return IMAGE_EXTENSIONS.has(ext) ? [fullPath] : [];
    }),
  );
  return files.flat().sort((a, b) => a.localeCompare(b));
}

async function listProjectFolders(root: string) {
  const entries = await readdir(root, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(root, entry.name))
    .sort((a, b) => a.localeCompare(b));
}

async function mapWithConcurrency<T, R>(items: T[], concurrency: number, worker: (item: T) => Promise<R>) {
  const results = new Array<R>(items.length);
  let nextIndex = 0;
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await worker(items[currentIndex]);
    }
  });
  await Promise.all(workers);
  return results;
}

async function getImageMetadata(filePath: string) {
  const metadata = await sharp(filePath).metadata();
  const width = metadata.width ?? null;
  const height = metadata.height ?? null;
  const aspectRatio = width && height ? width / height : null;
  return { width, height, aspectRatio };
}

function buildCacheKey(bytes: Buffer, model: string, context: ProjectContext, relativePath: string) {
  const hash = createHash('sha1').update(bytes).digest('hex');
  return `${model}:${context.displayName}:${relativePath}:${hash}`;
}

function placementScore(dominantUseCase: SitePlacement, scores: PlacementScores) {
  const base =
    dominantUseCase === 'hero'
      ? scores.hero
      : dominantUseCase === 'section-banner'
        ? scores.banner
        : dominantUseCase === 'side-support'
          ? scores.support
          : dominantUseCase === 'gallery'
            ? scores.gallery
            : 0;
  return (
    base * 2 +
    scores.composition * 1.2 +
    scores.cleanliness +
    scores.uniqueness * 0.8 -
    scores.exclusionRisk * 1.8
  );
}

function sanitizeUseCase(value: string): SitePlacement {
  const normalized = normalizeText(value);
  if (normalized.includes('hero')) return 'hero';
  if (normalized.includes('banner') || normalized.includes('section')) return 'section-banner';
  if (normalized.includes('side') || normalized.includes('support')) return 'side-support';
  if (normalized.includes('detail')) return 'detail-only';
  if (normalized.includes('exclude') || normalized.includes('reject')) return 'exclude';
  return 'gallery';
}

function sanitizeSection(value: string): SiteSection | null {
  const normalized = normalizeText(value);
  if (normalized === 'project hero') return 'project-hero';
  if (normalized === 'project intro') return 'project-intro';
  if (normalized === 'visual mosaic') return 'visual-mosaic';
  if (normalized === 'feature gallery') return 'feature-gallery';
  if (normalized === 'construction gallery') return 'construction-gallery';
  if (normalized === 'featured card') return 'featured-card';
  return null;
}

function applyTechnicalAdjustments(analysis: ImageAnalysis) {
  const adjusted = {
    ...analysis,
    qualityNotes: [...analysis.qualityNotes],
    doNotUseReasons: [...analysis.doNotUseReasons],
    scores: { ...analysis.scores },
  };

  if (adjusted.width && adjusted.height) {
    if (adjusted.width < 1200 || adjusted.height < 800) {
      adjusted.scores.hero = Math.max(0, adjusted.scores.hero - 1.5);
      adjusted.qualityNotes.push('Resolution is modest for full-width hero usage.');
    }

    if (adjusted.aspectRatio && adjusted.aspectRatio < 1.15) {
      adjusted.scores.hero = Math.max(0, adjusted.scores.hero - 0.75);
      adjusted.cropNotes.push('Portrait-leaning ratio may need aggressive cropping for hero placements.');
    }

    if (adjusted.aspectRatio && adjusted.aspectRatio > 1.9) {
      adjusted.scores.banner = Math.min(10, adjusted.scores.banner + 0.5);
    }
  }

  if (adjusted.doNotUseReasons.length > 0) {
    adjusted.scores.exclusionRisk = Math.min(10, adjusted.scores.exclusionRisk + 1);
  }

  return adjusted;
}

async function analyzeImage(
  ai: GoogleGenAI,
  model: string,
  context: ProjectContext,
  filePath: string,
  projectRoot: string,
  cache: Map<string, ImageAnalysis>,
): Promise<ImageAnalysis> {
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = MIME_TYPES[ext];
  if (!mimeType) {
    throw new Error(`Unsupported file type for ${filePath}`);
  }

  const bytes = await readFile(filePath);
  const relativePath = path.relative(projectRoot, filePath).replaceAll('\\', '/');
  const { width, height, aspectRatio } = await getImageMetadata(filePath);
  const cacheKey = buildCacheKey(bytes, model, context, relativePath);
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const prompt = `
You are analyzing construction and real-estate project images for website placement.

Project context:
${context.clientProfile || `Folder: ${context.folderName}`}

Image metadata:
- File name: ${path.basename(filePath)}
- Relative path: ${relativePath}
- Width: ${width ?? 'unknown'}
- Height: ${height ?? 'unknown'}
- Aspect ratio: ${aspectRatio ? aspectRatio.toFixed(2) : 'unknown'}

Your job:
- Understand the image contents.
- Decide where this image is most useful on a marketing website.
- Prefer practical placement decisions, not generic captions.
- Optimize for a construction or real-estate site with hero images, supporting images, and detail galleries.

Allowed dominantUseCase values:
- hero
- section-banner
- side-support
- gallery
- detail-only
- exclude

Allowed site section values:
- project-hero
- project-intro
- visual-mosaic
- feature-gallery
- construction-gallery
- featured-card

Scoring guidance from 0 to 10:
- hero: strongest visual impact and strongest composition
- banner: good top-of-section intro image
- support: best for text-adjacent or explanatory sections
- gallery: useful but not primary
- exclusionRisk: high when the image is redundant, obstructed, blurry, cropped badly, or low-value
- uniqueness: high when the image shows something distinct from the rest
- composition: framing, symmetry, readability, and visual balance
- cleanliness: clarity and presentation quality

Return objective answers. If text is visible in the image, capture it exactly when possible.
`.trim();

  const response = await ai.models.generateContent({
    model,
    contents: [
      { text: prompt },
      {
        inlineData: {
          mimeType,
          data: bytes.toString('base64'),
        },
      },
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: IMAGE_ANALYSIS_SCHEMA,
      temperature: 0.2,
    },
  });

  const raw = response.text?.trim();
  if (!raw) {
    throw new Error(`Empty model response for ${filePath}`);
  }

  const parsed = JSON.parse(raw) as Omit<ImageAnalysis, 'fileName' | 'relativePath' | 'mimeType' | 'width' | 'height' | 'aspectRatio'>;

  const analysis = {
    fileName: path.basename(filePath),
    relativePath,
    mimeType,
    width,
    height,
    aspectRatio,
    summary: parsed.summary,
    shortCaption: parsed.shortCaption,
    altText: parsed.altText,
    detailedDescription: parsed.detailedDescription,
    projectType: parsed.projectType,
    visibleElements: parsed.visibleElements || [],
    constructionStage: parsed.constructionStage,
    dominantUseCase: sanitizeUseCase(parsed.dominantUseCase),
    recommendedPlacements: (parsed.recommendedPlacements || []).map((value) => sanitizeUseCase(value)).filter((value): value is SitePlacement => Boolean(value)),
    bestSiteSections: (parsed.bestSiteSections || []).map((value) => sanitizeSection(value)).filter((value): value is SiteSection => Boolean(value)),
    supportingTopics: parsed.supportingTopics || [],
    marketingTags: parsed.marketingTags || [],
    qualityNotes: parsed.qualityNotes || [],
    doNotUseReasons: parsed.doNotUseReasons || [],
    cropNotes: parsed.cropNotes || [],
    textFoundInImage: parsed.textFoundInImage || [],
    rationale: parsed.rationale,
    confidence: parsed.confidence,
    scores: parsed.scores,
  };

  const adjusted = applyTechnicalAdjustments(analysis);
  cache.set(cacheKey, adjusted);
  return adjusted;
}

function summarizeAnalyses(analyses: ImageAnalysis[]) {
  return analyses.map((analysis) => ({
    fileName: analysis.fileName,
    summary: analysis.summary,
    shortCaption: analysis.shortCaption,
    altText: analysis.altText,
    dominantUseCase: analysis.dominantUseCase,
    recommendedPlacements: analysis.recommendedPlacements,
    bestSiteSections: analysis.bestSiteSections,
    constructionStage: analysis.constructionStage,
    supportingTopics: analysis.supportingTopics,
    marketingTags: analysis.marketingTags.slice(0, 8),
    qualityNotes: analysis.qualityNotes,
    doNotUseReasons: analysis.doNotUseReasons,
    cropNotes: analysis.cropNotes,
    confidence: analysis.confidence,
    scores: analysis.scores,
  }));
}

async function generateEditorialPlan(
  ai: GoogleGenAI,
  model: string,
  context: ProjectContext,
  analyses: ImageAnalysis[],
) {
  const compactAnalyses = summarizeAnalyses(analyses);
  const prompt = `
You are creating the editorial image plan for a marketing website.

Project context:
${context.clientProfile || `Folder: ${context.folderName}`}

Rules:
- Choose the best hero candidates from the full set.
- Separate section recommendations by site section.
- Flag low-priority images when they are repetitive, weak, blocked, or not web-friendly.
- Prefer concrete editorial decisions over generic commentary.
- Keep the output aligned to a construction and real-estate website.

Here are the analyzed images as JSON:
${JSON.stringify(compactAnalyses, null, 2)}
`.trim();

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: EDITORIAL_SCHEMA,
      temperature: 0.2,
    },
  });

  const raw = response.text?.trim();
  if (!raw) {
    throw new Error('Empty editorial planning response.');
  }

  const parsed = JSON.parse(raw) as EditorialPlan;
  return {
    editorialSummary: parsed.editorialSummary,
    heroShortlist: parsed.heroShortlist || [],
    sectionRecommendations: (parsed.sectionRecommendations || [])
      .map((section): EditorialSection => ({
        section: sanitizeSection(section.section) || 'project-intro',
        files: section.files || [],
        reason: section.reason,
      }))
      .sort((a, b) => SITE_SECTION_ORDER.indexOf(a.section) - SITE_SECTION_ORDER.indexOf(b.section)),
    lowPriority: parsed.lowPriority || [],
    contentGaps: parsed.contentGaps || [],
    siteRules: parsed.siteRules || [],
    notes: parsed.notes || [],
  };
}

function localFallbackEditorialPlan(analyses: ImageAnalysis[]): EditorialPlan {
  const ranked = [...analyses].sort((a, b) => placementScore(b.dominantUseCase, b.scores) - placementScore(a.dominantUseCase, a.scores));
  const heroShortlist = ranked
    .filter((item) => item.dominantUseCase === 'hero' || item.scores.hero >= 7.5)
    .slice(0, 3)
    .map((item) => item.fileName);

  const sectionMap = new Map<SiteSection, { files: string[]; reason: string }>();
  for (const analysis of analyses) {
    for (const section of analysis.bestSiteSections) {
      const current = sectionMap.get(section) || { files: [], reason: '' };
      if (current.files.length < 4) {
        current.files.push(analysis.fileName);
      }
      current.reason = current.reason || `${analysis.summary}`;
      sectionMap.set(section, current);
    }
  }

  const sectionRecommendations = [...sectionMap.entries()].map(([section, value]) => ({
    section,
    files: value.files,
    reason: value.reason,
  }));

  const lowPriority = analyses
    .filter((analysis) => analysis.dominantUseCase === 'exclude' || analysis.scores.exclusionRisk >= 7)
    .map((analysis) => ({
      fileName: analysis.fileName,
      reason: analysis.doNotUseReasons[0] || 'Low editorial value.',
    }));

  return {
    editorialSummary: 'Local fallback plan generated because the second-pass editorial model was unavailable.',
    heroShortlist,
    sectionRecommendations,
    lowPriority,
    contentGaps: [],
    siteRules: [
      'Use the cleanest wide exterior shots for hero placements.',
      'Use interior photos only when the section is explicitly about finishes or interiors.',
      'Avoid foreground obstructions, repeated angles, and low-contrast images for primary placements.',
    ],
    notes: ['This plan was generated without the second-pass model.'],
  };
}

function formatSectionLabel(section: SiteSection) {
  return section
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function renderMarkdown(output: ProjectOutput) {
  const lines: string[] = [];
  lines.push(`# ${output.context.displayName}`);
  lines.push('');
  lines.push(`Folder: \`${output.context.folderName}\``);
  lines.push(`Status: ${output.context.status || 'unknown'}`);
  lines.push(`Location: ${output.context.location || 'unknown'}`);
  lines.push(`Generated at: ${output.generatedAt}`);
  lines.push(`Image count: ${output.imageCount}`);
  lines.push('');
  lines.push('## Editorial Summary');
  lines.push('');
  lines.push(output.editorialPlan.editorialSummary || 'No editorial summary available.');
  lines.push('');
  lines.push('## Hero Shortlist');
  lines.push('');
  if (output.editorialPlan.heroShortlist.length === 0) {
    lines.push('- No hero candidate found.');
  } else {
    for (const fileName of output.editorialPlan.heroShortlist) {
      const image = output.analyses.find((item) => item.fileName === fileName);
      if (!image) {
        lines.push(`- ${fileName}`);
        continue;
      }
      lines.push(`- **${fileName}** - ${image.shortCaption}`);
      lines.push(`  - Reason: ${image.rationale}`);
      lines.push(`  - Scores: hero ${image.scores.hero.toFixed(1)}, banner ${image.scores.banner.toFixed(1)}, support ${image.scores.support.toFixed(1)}, gallery ${image.scores.gallery.toFixed(1)}`);
    }
  }
  lines.push('');
  lines.push('## Section Map');
  lines.push('');
  if (output.editorialPlan.sectionRecommendations.length === 0) {
    lines.push('- No section recommendations available.');
  } else {
    for (const section of output.editorialPlan.sectionRecommendations) {
      lines.push(`### ${formatSectionLabel(section.section)}`);
      lines.push('');
      lines.push(section.reason);
      lines.push('');
      for (const fileName of section.files) {
        lines.push(`- ${fileName}`);
      }
      lines.push('');
    }
  }
  lines.push('## Low Priority');
  lines.push('');
  if (output.editorialPlan.lowPriority.length === 0) {
    lines.push('- No low-priority images flagged.');
  } else {
    for (const item of output.editorialPlan.lowPriority) {
      lines.push(`- **${item.fileName}** - ${item.reason}`);
    }
  }
  lines.push('');
  lines.push('## Usage Rules');
  lines.push('');
  for (const rule of output.editorialPlan.siteRules) {
    lines.push(`- ${rule}`);
  }
  lines.push('');
  if (output.editorialPlan.contentGaps.length > 0) {
    lines.push('## Content Gaps');
    lines.push('');
    for (const gap of output.editorialPlan.contentGaps) {
      lines.push(`- ${gap}`);
    }
    lines.push('');
  }
  lines.push('## Image Cards');
  lines.push('');
  for (const analysis of output.analyses) {
    lines.push(`### ${analysis.fileName}`);
    lines.push('');
    lines.push(`- Placement: \`${analysis.dominantUseCase}\``);
    lines.push(`- Best sections: ${analysis.bestSiteSections.map(formatSectionLabel).join(', ') || 'none'}`);
    lines.push(`- Caption: ${analysis.shortCaption}`);
    lines.push(`- Alt text: ${analysis.altText}`);
    lines.push(`- Summary: ${analysis.summary}`);
    lines.push(`- Description: ${analysis.detailedDescription}`);
    lines.push(`- Stage: ${analysis.constructionStage}`);
    lines.push(`- Confidence: ${analysis.confidence.toFixed(2)}`);
    lines.push(`- Scores: hero ${analysis.scores.hero.toFixed(1)}, banner ${analysis.scores.banner.toFixed(1)}, support ${analysis.scores.support.toFixed(1)}, gallery ${analysis.scores.gallery.toFixed(1)}, uniqueness ${analysis.scores.uniqueness.toFixed(1)}, composition ${analysis.scores.composition.toFixed(1)}, cleanliness ${analysis.scores.cleanliness.toFixed(1)}`);
    lines.push(`- Visible elements: ${analysis.visibleElements.join(', ') || 'none'}`);
    lines.push(`- Supporting topics: ${analysis.supportingTopics.join(', ') || 'none'}`);
    lines.push(`- Marketing tags: ${analysis.marketingTags.join(', ') || 'none'}`);
    lines.push(`- Quality notes: ${analysis.qualityNotes.join(', ') || 'none'}`);
    lines.push(`- Crop notes: ${analysis.cropNotes.join(', ') || 'none'}`);
    lines.push(`- Do not use reasons: ${analysis.doNotUseReasons.join(', ') || 'none'}`);
    lines.push(`- Text found: ${analysis.textFoundInImage.join(', ') || 'none'}`);
    lines.push(`- Rationale: ${analysis.rationale}`);
    lines.push('');
  }
  return lines.join('\n');
}

function buildSectionCandidates(analyses: ImageAnalysis[]) {
  const sections = new Map<string, string[]>();
  for (const analysis of analyses) {
    for (const section of analysis.bestSiteSections) {
      const current = sections.get(section) || [];
      if (!current.includes(analysis.fileName)) {
        current.push(analysis.fileName);
      }
      sections.set(section, current);
    }
  }
  return Object.fromEntries(
    [...sections.entries()].map(([section, files]) => [
      section,
      files.slice(0, 4),
    ]),
  );
}

async function analyzeProject(projectDir: string, outputRoot: string, model: string) {
  const dirStat = await stat(projectDir);
  if (!dirStat.isDirectory()) {
    throw new Error(`${projectDir} is not a directory.`);
  }

  const images = await walkImages(projectDir);
  if (images.length === 0) {
    throw new Error(`No images found in ${projectDir}`);
  }

  const ai = createClient();
  const folderName = path.basename(projectDir);
  const context = buildProjectContext(folderName);
  const projectOutputDir = path.join(outputRoot, folderName);
  const cacheFilePath = path.join(projectOutputDir, '.analysis-cache.json');
  const cache = new Map<string, ImageAnalysis>();

  try {
    const rawCache = await readFile(cacheFilePath, 'utf8');
    const parsed = JSON.parse(rawCache) as CacheEntry[];
    for (const entry of parsed) {
      cache.set(entry.cacheKey, entry.analysis);
    }
  } catch {
    // No cache yet.
  }

  const analyses = await mapWithConcurrency(images, ANALYSIS_CONCURRENCY, async (filePath) => {
    process.stdout.write(`Analyzing ${path.basename(filePath)}...\n`);
    return analyzeImage(
      ai,
      model,
      context,
      filePath,
      projectDir,
      cache,
    );
  });

  let editorialPlan: EditorialPlan;
  try {
    editorialPlan = await generateEditorialPlan(ai, model, context, analyses);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Editorial pass failed, using fallback: ${message}\n`);
    editorialPlan = localFallbackEditorialPlan(analyses);
  }

  const ranked = [...analyses].sort((a, b) => placementScore(b.dominantUseCase, b.scores) - placementScore(a.dominantUseCase, a.scores));
  const heroCandidates = editorialPlan.heroShortlist.length > 0
    ? editorialPlan.heroShortlist
    : ranked.slice(0, 3).map((item) => item.fileName);

  const output: ProjectOutput = {
    context,
    generatedAt: new Date().toISOString(),
    imageCount: analyses.length,
    editorialPlan,
    heroCandidates,
    analyses: ranked,
  };

  await mkdir(projectOutputDir, { recursive: true });

  await writeFile(
    path.join(projectOutputDir, 'analysis.json'),
    `${JSON.stringify(
      {
        ...output,
        sectionCandidates: buildSectionCandidates(ranked),
      },
      null,
      2,
    )}\n`,
    'utf8',
  );
  await writeFile(
    path.join(projectOutputDir, 'analysis.md'),
    `${renderMarkdown(output)}\n`,
    'utf8',
  );
  await writeFile(
    cacheFilePath,
    `${JSON.stringify(
      [...cache.entries()].map(([cacheKey, analysis]) => ({ cacheKey, analysis })),
      null,
      2,
    )}\n`,
    'utf8',
  );

  process.stdout.write(`Saved output to ${projectOutputDir}\n`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputRoot = path.resolve(args.inputRoot);
  const outputRoot = path.resolve(args.outputRoot);

  if (args.all && args.project) {
    throw new Error('Use either --all or --project, not both.');
  }

  if (!args.all && !args.project) {
    throw new Error('Pass --project "<folder name>" or --all.');
  }

  if (args.all) {
    const folders = await listProjectFolders(inputRoot);
    for (const projectDir of folders) {
      await analyzeProject(projectDir, outputRoot, args.model);
    }
    return;
  }

  const projectDir = path.resolve(inputRoot, args.project as string);
  await analyzeProject(projectDir, outputRoot, args.model);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
