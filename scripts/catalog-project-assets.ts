import { copyFile, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { generatedProjectContent } from '../src/data/projectContent.generated.ts';
import { projects, type ProjectRecord } from '../src/data/projects.ts';
import type { ProjectImage, ProjectImages } from '../src/data/projectContent.ts';

type SourceProject = {
  slug: string;
  formFile: string;
  photoFolder: string;
};

type ImageAnalysis = {
  fileName: string;
  relativePath: string;
  shortCaption?: string;
  altText?: string;
  constructionStage?: string;
  dominantUseCase?: string;
  bestSiteSections?: string[];
  qualityNotes?: string[];
  doNotUseReasons?: string[];
  scores?: {
    hero?: number;
    gallery?: number;
    composition?: number;
    cleanliness?: number;
    exclusionRisk?: number;
  };
};

type AnalysisFile = {
  analyses?: ImageAnalysis[];
  heroCandidates?: string[];
};

type UsageSlot = {
  section: keyof ProjectImages;
  index: number;
  route: string;
  component: string;
  note: string;
};

type CatalogImage = {
  sourcePath: string;
  sourceRelativePath: string;
  publicPath: string;
  fileName: string;
  existsInPublic: boolean;
  status: 'used' | 'unused' | 'used-missing-public' | 'source-not-exported';
  usage: UsageSlot[];
  analysis: {
    caption: string;
    altText: string;
    constructionStage: string;
    dominantUseCase: string;
    bestSiteSections: string[];
    qualityNotes: string[];
    doNotUseReasons: string[];
    scores: ImageAnalysis['scores'];
  } | null;
};

type PublicOnlyAsset = {
  publicPath: string;
  fileName: string;
  status: 'public-extra-used' | 'public-extra-unused';
  usage: UsageSlot[];
};

type LegacyUpscaledAsset = {
  path: string;
  fileName: string;
  inferredProjectSlug: string | null;
  inferredProjectTitle: string | null;
};

type ProjectCatalog = {
  slug: string;
  title: string;
  menuTitle: string;
  location: string;
  status: string;
  sourcePhotoFolder: string;
  sourceForm: string;
  usedCount: number;
  unusedCount: number;
  missingUsedCount: number;
  sourceOnlyCount: number;
  publicOnlyUnusedCount: number;
  images: CatalogImage[];
  publicOnlyAssets: PublicOnlyAsset[];
  legacyProjectImages: LegacyImageUsage[];
};

type LegacyImageUsage = {
  image: string;
  role: string;
  codeUsage: string[];
};

const ROOT = process.cwd();
const DATA_ROOT = path.join(ROOT, String.fromCodePoint(0x130) + 'gloo project data');
const PHOTOS_ROOT = path.join(DATA_ROOT, 'photos projet');
const ANALYSIS_ROOT = path.join(DATA_ROOT, 'analysis');
const PUBLIC_PROJECTS_ROOT = path.join(ROOT, 'public', 'projects');
const UNUSED_ROOT = path.join(PUBLIC_PROJECTS_ROOT, '_unused-by-project');
const SELECTED_ROOT = path.join(PUBLIC_PROJECTS_ROOT, '_selected-by-project');
const DOCS_ROOT = path.join(ROOT, 'docs');
const INVENTORY_MD = path.join(DOCS_ROOT, 'project-photo-inventory.md');
const INVENTORY_JSON = path.join(DOCS_ROOT, 'project-photo-inventory.json');

const SOURCE_PROJECTS: SourceProject[] = [
  { slug: 'boudouaou-70-10-housing', formFile: 'BOUDOUAOU.docx', photoFolder: 'boudouaou' },
  { slug: 'dely-brahim-240-housing', formFile: 'Dely brahim.docx', photoFolder: 'dely brahim' },
  { slug: 'douaouda-300-500-housing', formFile: 'douaouda.docx', photoFolder: 'douaouda' },
  { slug: 'bas-mazagran-200-38-housing', formFile: 'Mostaganem.docx', photoFolder: 'mostaghanem' },
  { slug: 'douira-commercial-centers-2500-housing', formFile: 'Rahmania.docx', photoFolder: 'douira' },
  { slug: 'reghaia-bouraada-250-housing', formFile: 'reghaia.docx', photoFolder: 'reghaia' },
  { slug: 'rouiba-4-promotional-villas', formFile: 'Rouiba.docx', photoFolder: 'rouiba' },
  { slug: 'said-hamdine-mixed-real-estate', formFile: 'said hamdine.docx', photoFolder: 'sidi yahia' },
  { slug: 'sidi-abdallah-200-1200-housing', formFile: 'sidi abdellah.docx', photoFolder: 'sidi abdellah' },
  { slug: 'sidi-benour-50-housing', formFile: 'Sidi Benour.docx', photoFolder: 'sidi benour' },
  { slug: 'staoueli-11-41-villas', formFile: 'staouali.docx', photoFolder: 'staouali' },
];

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.bmp']);
const LEGACY_IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.bmp']);

const SECTION_USAGE: Record<keyof ProjectImages, Omit<UsageSlot, 'section' | 'index'>> = {
  hero: {
    route: '/projects/:slug, /bat-demo/projects/:slug',
    component: 'src/pages/ProjectDetail.tsx, src/data/batProjectModel.ts',
    note: 'Detay sayfası hero sliderı ve BAT model hero/cover kaynağı.',
  },
  intro: {
    route: '/projects/:slug',
    component: 'src/pages/ProjectDetail.tsx',
    note: 'Detay sayfası giriş bölümü ana görseli.',
  },
  mosaic: {
    route: '/projects/:slug',
    component: 'src/pages/ProjectDetail.tsx',
    note: 'Detay sayfası mozaik galeri bölümü.',
  },
  featureGallery: {
    route: '/projects/:slug, /bat-demo/projects/:slug',
    component: 'src/pages/ProjectDetail.tsx, src/data/batProjectModel.ts',
    note: 'Detay sayfası context/feature galerisi; ilk görsel büyük lead olarak da kullanılır.',
  },
  constructionGallery: {
    route: '/projects/:slug',
    component: 'src/pages/ProjectDetail.tsx',
    note: 'Detay sayfası construction/progress galerisi.',
  },
  featured: {
    route: '/, /projects/:slug',
    component: 'src/components/FeaturedProjects.tsx, src/pages/ProjectDetail.tsx',
    note: 'Ana sayfa Featured Projects kartı ve detay sayfası related project kartları.',
  },
};

function normalizePublicPath(value: string) {
  return value.replaceAll('\\', '/');
}

function safeFileName(fileName: string) {
  return fileName
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .toLowerCase() || 'image';
}

function extension(filePath: string) {
  return path.extname(filePath).toLowerCase();
}

function isImage(filePath: string) {
  return IMAGE_EXTENSIONS.has(extension(filePath));
}

function toRelativeUnix(root: string, filePath: string) {
  return path.relative(root, filePath).replaceAll('\\', '/');
}

function relativeRepoPath(filePath: string) {
  return toRelativeUnix(ROOT, filePath);
}

async function pathExists(filePath: string) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function walkFiles(directory: string, predicate: (filePath: string) => boolean): Promise<string[]> {
  if (!(await pathExists(directory))) {
    return [];
  }

  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return walkFiles(fullPath, predicate);
    }
    return entry.isFile() && predicate(fullPath) ? [fullPath] : [];
  }));

  return nested.flat().sort((a, b) => a.localeCompare(b));
}

async function readAnalysis(photoFolder: string) {
  try {
    const raw = await readFile(path.join(ANALYSIS_ROOT, photoFolder, 'analysis.json'), 'utf8');
    const parsed = JSON.parse(raw) as AnalysisFile;
    return new Map((parsed.analyses || []).map((item) => [item.relativePath, item]));
  } catch {
    return new Map<string, ImageAnalysis>();
  }
}

function addUsage(usages: Map<string, UsageSlot[]>, section: keyof ProjectImages, index: number, image?: ProjectImage) {
  if (!image?.src) {
    return;
  }
  const publicPath = normalizePublicPath(image.src);
  const current = usages.get(publicPath) || [];
  usages.set(publicPath, [
    ...current,
    {
      section,
      index,
      ...SECTION_USAGE[section],
    },
  ]);
}

function collectContentUsage(slug: string) {
  const usages = new Map<string, UsageSlot[]>();
  const content = generatedProjectContent[slug];
  if (!content) {
    return usages;
  }

  content.images.hero.forEach((image, index) => addUsage(usages, 'hero', index, image));
  addUsage(usages, 'intro', 0, content.images.intro);
  content.images.mosaic.forEach((image, index) => addUsage(usages, 'mosaic', index, image));
  content.images.featureGallery.forEach((image, index) => addUsage(usages, 'featureGallery', index, image));
  content.images.constructionGallery.forEach((image, index) => addUsage(usages, 'constructionGallery', index, image));
  content.images.featured.forEach((image, index) => addUsage(usages, 'featured', index, image));
  return usages;
}

function buildLegacyImageUsage(project: ProjectRecord): LegacyImageUsage[] {
  return project.images.map((image, index) => {
    const codeUsage = [
      'src/data/projects.ts',
      'src/pages/Projects.tsx',
      'src/pages/ProjectsDemo.tsx',
      'src/data/projectContent.ts fallback',
    ];

    if (index === 0) {
      codeUsage.push('src/components/HeroBanner.tsx poster via heroSlides');
      codeUsage.push('src/components/ImageSlider.tsx via imageSliderImages');
    }

    return {
      image,
      role: index === 0 ? 'legacy cover / fallback / home slider source' : 'legacy fallback gallery source',
      codeUsage,
    };
  });
}

function toAnalysisSummary(analysis?: ImageAnalysis) {
  if (!analysis) {
    return null;
  }

  return {
    caption: analysis.shortCaption || '',
    altText: analysis.altText || '',
    constructionStage: analysis.constructionStage || '',
    dominantUseCase: analysis.dominantUseCase || '',
    bestSiteSections: analysis.bestSiteSections || [],
    qualityNotes: analysis.qualityNotes || [],
    doNotUseReasons: analysis.doNotUseReasons || [],
    scores: analysis.scores,
  };
}

async function collectProjectCatalog(source: SourceProject): Promise<ProjectCatalog> {
  const project = projects.find((item) => item.slug === source.slug);
  if (!project) {
    throw new Error(`Missing project record for ${source.slug}`);
  }

  const sourceRoot = path.join(PHOTOS_ROOT, source.photoFolder);
  const publicRoot = path.join(PUBLIC_PROJECTS_ROOT, source.slug);
  const analysisByRelativePath = await readAnalysis(source.photoFolder);
  const usageByPublicPath = collectContentUsage(source.slug);
  const sourceImages = await walkFiles(sourceRoot, isImage);
  const publicImages = await walkFiles(publicRoot, (filePath) => LEGACY_IMAGE_EXTENSIONS.has(extension(filePath)));
  const expectedPublicPaths = new Set<string>();

  const images: CatalogImage[] = await Promise.all(sourceImages.map(async (sourcePath, index) => {
    const sourceRelativePath = toRelativeUnix(sourceRoot, sourcePath);
    const fileName = `${String(index + 1).padStart(2, '0')}-${safeFileName(path.parse(sourcePath).name)}.webp`;
    const publicPath = `/projects/${source.slug}/${fileName}`;
    const publicFilePath = path.join(PUBLIC_PROJECTS_ROOT, source.slug, fileName);
    expectedPublicPaths.add(publicPath);
    const usage = usageByPublicPath.get(publicPath) || [];
    const existsInPublic = await pathExists(publicFilePath);
    const status =
      usage.length > 0 && existsInPublic
        ? 'used'
        : usage.length > 0
          ? 'used-missing-public'
          : existsInPublic
            ? 'unused'
            : 'source-not-exported';

    return {
      sourcePath: relativeRepoPath(sourcePath),
      sourceRelativePath,
      publicPath,
      fileName,
      existsInPublic,
      status,
      usage,
      analysis: toAnalysisSummary(analysisByRelativePath.get(sourceRelativePath)),
    };
  }));

  const publicOnlyAssets: PublicOnlyAsset[] = publicImages
    .map((publicFilePath) => {
      const publicPath = `/${normalizePublicPath(path.relative(path.join(ROOT, 'public'), publicFilePath))}`;
      if (expectedPublicPaths.has(publicPath)) {
        return null;
      }
      const usage = usageByPublicPath.get(publicPath) || [];
      return {
        publicPath,
        fileName: path.basename(publicFilePath),
        status: usage.length > 0 ? 'public-extra-used' : 'public-extra-unused',
        usage,
      } satisfies PublicOnlyAsset;
    })
    .filter((item): item is PublicOnlyAsset => Boolean(item));

  return {
    slug: source.slug,
    title: project.title,
    menuTitle: project.menuTitle,
    location: project.location,
    status: project.chapterLabel,
    sourcePhotoFolder: source.photoFolder,
    sourceForm: source.formFile,
    usedCount: images.filter((item) => item.status === 'used').length,
    unusedCount: images.filter((item) => item.status === 'unused').length,
    missingUsedCount: images.filter((item) => item.status === 'used-missing-public').length,
    sourceOnlyCount: images.filter((item) => item.status === 'source-not-exported').length,
    publicOnlyUnusedCount: publicOnlyAssets.filter((item) => item.status === 'public-extra-unused').length,
    images,
    publicOnlyAssets,
    legacyProjectImages: buildLegacyImageUsage(project),
  };
}

function normalizeStem(fileName: string) {
  return path.parse(fileName)
    .name
    .toLowerCase()
    .replace(/_upscayl.*$/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function buildExpectedStemIndex(catalogs: ProjectCatalog[]) {
  const index = new Map<string, ProjectCatalog>();
  for (const catalog of catalogs) {
    for (const image of catalog.images) {
      index.set(normalizeStem(image.fileName), catalog);
    }
    for (const image of catalog.publicOnlyAssets) {
      index.set(normalizeStem(image.fileName), catalog);
    }
  }
  return index;
}

async function collectLegacyUpscaled(catalogs: ProjectCatalog[]): Promise<LegacyUpscaledAsset[]> {
  const upscaledRoot = path.join(ROOT, 'public', 'Upscaled');
  const files = await walkFiles(upscaledRoot, (filePath) => LEGACY_IMAGE_EXTENSIONS.has(extension(filePath)));
  const stemIndex = buildExpectedStemIndex(catalogs);

  return files.map((filePath) => {
    const catalog = stemIndex.get(normalizeStem(path.basename(filePath))) || null;
    return {
      path: relativeRepoPath(filePath),
      fileName: path.basename(filePath),
      inferredProjectSlug: catalog?.slug || null,
      inferredProjectTitle: catalog?.menuTitle || null,
    };
  });
}

function ensureInside(parent: string, target: string) {
  const parentResolved = path.resolve(parent);
  const targetResolved = path.resolve(target);
  if (!targetResolved.startsWith(parentResolved + path.sep) && targetResolved !== parentResolved) {
    throw new Error(`Refusing to write outside ${parentResolved}: ${targetResolved}`);
  }
}

async function copyUnusedAssets(catalogs: ProjectCatalog[]) {
  ensureInside(PUBLIC_PROJECTS_ROOT, UNUSED_ROOT);
  await rm(UNUSED_ROOT, { recursive: true, force: true });
  await mkdir(UNUSED_ROOT, { recursive: true });

  const readmeLines = [
    '# Kullanılmayan proje fotoğrafları',
    '',
    'Generated by `npm run catalog:images`.',
    '',
    'Bu dosyalar, şu anda `src/data/projectContent.generated.ts` içinde kullanılmayan public proje fotoğraflarının kopyalarıdır.',
    'Orijinal dosyalar proje klasörlerinde kalır; böylece mevcut path referansları bozulmaz.',
    '',
    'Kaynak dosya, kullanım yeri ve proje eşleşmeleri için `docs/project-photo-inventory.md` dosyasına bak.',
    '',
  ];

  await Promise.all(catalogs.map(async (catalog) => {
    const unused = [
      ...catalog.images.filter((item) => item.status === 'unused'),
      ...catalog.publicOnlyAssets
        .filter((item) => item.status === 'public-extra-unused')
        .map((item): CatalogImage => ({
          sourcePath: '',
          sourceRelativePath: '',
          publicPath: item.publicPath,
          fileName: item.fileName,
          existsInPublic: true,
          status: 'unused',
          usage: item.usage,
          analysis: null,
        })),
    ];

    if (unused.length === 0) {
      return;
    }

    const targetDir = path.join(UNUSED_ROOT, catalog.slug);
    ensureInside(UNUSED_ROOT, targetDir);
    await mkdir(targetDir, { recursive: true });

    const projectReadme = [
      `# ${catalog.menuTitle}`,
      '',
      `Project slug: \`${catalog.slug}\``,
      `Source photo folder: \`${catalog.sourcePhotoFolder}\``,
      '',
      '| File | Original public path | Source file |',
      '| --- | --- | --- |',
    ];

    await Promise.all(unused.map(async (item) => {
      const publicFilePath = path.join(ROOT, 'public', item.publicPath.replace(/^\//, ''));
      const targetPath = path.join(targetDir, item.fileName);
      ensureInside(UNUSED_ROOT, targetPath);
      if (await pathExists(publicFilePath)) {
        await copyFile(publicFilePath, targetPath);
      }
      projectReadme.push(`| \`${item.fileName}\` | \`${item.publicPath}\` | \`${item.sourceRelativePath || 'public-only'}\` |`);
    }));

    await writeFile(path.join(targetDir, 'README.md'), `${projectReadme.join('\n')}\n`, 'utf8');
  }));

  await writeFile(path.join(UNUSED_ROOT, 'README.md'), `${readmeLines.join('\n')}\n`, 'utf8');
}

async function copySelectedAssets(catalogs: ProjectCatalog[]) {
  ensureInside(PUBLIC_PROJECTS_ROOT, SELECTED_ROOT);
  await rm(SELECTED_ROOT, { recursive: true, force: true });
  await mkdir(SELECTED_ROOT, { recursive: true });

  const readmeLines = [
    '# Seçilen proje fotoğrafları',
    '',
    'Generated by `npm run catalog:images`.',
    '',
    'Bu klasörde sadece sitedeki güncel manifest tarafından kullanılan/seçilen proje fotoğraflarının kopyaları bulunur.',
    'Orijinal dosyalar kendi proje klasörlerinde kalır.',
    '',
    'Her proje klasöründeki `README.md`, fotoğrafın kaynak dosyasını ve hangi sectionlarda kullanıldığını gösterir.',
    '',
  ];

  await Promise.all(catalogs.map(async (catalog) => {
    const selected = [
      ...catalog.images.filter((item) => item.status === 'used'),
      ...catalog.publicOnlyAssets
        .filter((item) => item.status === 'public-extra-used')
        .map((item): CatalogImage => ({
          sourcePath: '',
          sourceRelativePath: '',
          publicPath: item.publicPath,
          fileName: item.fileName,
          existsInPublic: true,
          status: 'used',
          usage: item.usage,
          analysis: null,
        })),
    ];

    if (selected.length === 0) {
      return;
    }

    const targetDir = path.join(SELECTED_ROOT, catalog.slug);
    ensureInside(SELECTED_ROOT, targetDir);
    await mkdir(targetDir, { recursive: true });

    const projectReadme = [
      `# ${catalog.menuTitle}`,
      '',
      `Project slug: \`${catalog.slug}\``,
      `Source photo folder: \`${catalog.sourcePhotoFolder}\``,
      `Selected image count: ${selected.length}`,
      '',
      '| File | Original public path | Source file | Usage |',
      '| --- | --- | --- | --- |',
    ];

    await Promise.all(selected.map(async (item) => {
      const publicFilePath = path.join(ROOT, 'public', item.publicPath.replace(/^\//, ''));
      const targetPath = path.join(targetDir, item.fileName);
      ensureInside(SELECTED_ROOT, targetPath);
      if (await pathExists(publicFilePath)) {
        await copyFile(publicFilePath, targetPath);
      }
      projectReadme.push(`| \`${item.fileName}\` | \`${item.publicPath}\` | \`${item.sourceRelativePath || 'public-only'}\` | ${usageText(item.usage)} |`);
    }));

    await writeFile(path.join(targetDir, 'README.md'), `${projectReadme.join('\n')}\n`, 'utf8');
  }));

  await writeFile(path.join(SELECTED_ROOT, 'README.md'), `${readmeLines.join('\n')}\n`, 'utf8');
}

function sectionLabel(section: keyof ProjectImages) {
  const labels: Record<keyof ProjectImages, string> = {
    hero: 'Hero',
    intro: 'Intro',
    mosaic: 'Mosaic',
    featureGallery: 'Feature gallery',
    constructionGallery: 'Construction gallery',
    featured: 'Featured card',
  };
  return labels[section];
}

function statusLabel(status: CatalogImage['status'] | PublicOnlyAsset['status']) {
  const labels: Record<string, string> = {
    used: 'Kullanılıyor',
    unused: 'Kullanılmıyor',
    'used-missing-public': 'Kullanımda ama public dosyası eksik',
    'source-not-exported': 'Kaynakta var ama public export yok',
    'public-extra-used': 'Public-only ve kullanımda',
    'public-extra-unused': 'Public-only ve kullanılmıyor',
  };
  return labels[status] || status;
}

function usageText(usage: UsageSlot[]) {
  if (usage.length === 0) {
    return '-';
  }
  return usage
    .map((item) => `${sectionLabel(item.section)} #${item.index + 1} (${item.route})`)
    .join('<br>');
}

function captionText(image: CatalogImage) {
  return image.analysis?.caption || image.analysis?.altText || '-';
}

function renderMarkdown(catalogs: ProjectCatalog[], legacyUpscaled: LegacyUpscaledAsset[]) {
  const totalUsed = catalogs.reduce((sum, item) => sum + item.usedCount, 0);
  const totalUnused = catalogs.reduce((sum, item) => sum + item.unusedCount + item.publicOnlyUnusedCount, 0);
  const totalMissing = catalogs.reduce((sum, item) => sum + item.missingUsedCount, 0);
  const totalSourceOnly = catalogs.reduce((sum, item) => sum + item.sourceOnlyCount, 0);
  const lines: string[] = [
    '# Proje Fotoğraf Envanteri',
    '',
    'Bu dosya `npm run catalog:images` ile üretilir.',
    '',
    'Ham kaynak klasörlerindeki her proje fotoğrafını public web dosyası, sitedeki gerçek kullanım yeri ve kullanılmayan fotoğraf klasörüyle eşleştirir.',
    '',
    '## Özet',
    '',
    `- Kullanılan proje fotoğrafı: ${totalUsed}`,
    `- \`public/projects/_unused-by-project/\` altına kopyalanan kullanılmayan public fotoğraf: ${totalUnused}`,
    `- Kullanımda olup public dosyası eksik kalan referans: ${totalMissing}`,
    `- Kaynakta olup public'e aktarılmayan fotoğraf: ${totalSourceOnly}`,
    `- Kataloglanan eski \`public/Upscaled\` dosyası: ${legacyUpscaled.length}`,
    '',
    '## Kullanım Yerleri',
    '',
    '| Slot | Route | Kod | Anlamı |',
    '| --- | --- | --- | --- |',
  ];

  for (const [section, usage] of Object.entries(SECTION_USAGE) as Array<[keyof ProjectImages, Omit<UsageSlot, 'section' | 'index'>]>) {
    lines.push(`| ${sectionLabel(section)} | \`${usage.route}\` | \`${usage.component}\` | ${usage.note} |`);
  }

  lines.push('');
  lines.push('## Projeler');
  lines.push('');

  for (const catalog of catalogs) {
    lines.push(`### ${catalog.menuTitle}`);
    lines.push('');
    lines.push(`- Proje slug: \`${catalog.slug}\``);
    lines.push(`- Başlık: ${catalog.title}`);
    lines.push(`- Lokasyon: ${catalog.location}`);
    lines.push(`- Durum: ${catalog.status}`);
    lines.push(`- Kaynak fotoğraf klasörü: \`${catalog.sourcePhotoFolder}\``);
    lines.push(`- Kaynak form: \`${catalog.sourceForm}\``);
    lines.push(`- Kullanılan: ${catalog.usedCount}`);
    lines.push(`- Kullanılmayan kopya: ${catalog.unusedCount + catalog.publicOnlyUnusedCount}`);
    if (catalog.missingUsedCount > 0) {
      lines.push(`- Eksik public dosyası olan kullanım: ${catalog.missingUsedCount}`);
    }
    if (catalog.sourceOnlyCount > 0) {
      lines.push(`- Sadece kaynakta olan fotoğraf: ${catalog.sourceOnlyCount}`);
    }
    lines.push('');
    lines.push('| Durum | Public dosya | Kaynak dosya | Sitedeki kullanım | Caption / görsel notu |');
    lines.push('| --- | --- | --- | --- | --- |');
    for (const image of catalog.images) {
      lines.push(`| ${statusLabel(image.status)} | \`${image.publicPath}\` | \`${image.sourceRelativePath}\` | ${usageText(image.usage)} | ${captionText(image).replaceAll('|', '/')} |`);
    }
    for (const image of catalog.publicOnlyAssets) {
      lines.push(`| ${statusLabel(image.status)} | \`${image.publicPath}\` | \`public-only\` | ${usageText(image.usage)} | - |`);
    }
    lines.push('');
    lines.push('`src/data/projects.ts` içinde hâlâ duran eski remote/PPTX referansları:');
    lines.push('');
    for (const legacy of catalog.legacyProjectImages) {
      lines.push(`- \`${legacy.image}\` - ${legacy.role}; code: ${legacy.codeUsage.map((item) => `\`${item}\``).join(', ')}`);
    }
    lines.push('');
  }

  lines.push('## Eski Upscaled Havuzu');
  lines.push('');
  lines.push('`public/Upscaled` mevcut uygulama tarafından doğrudan kullanılmıyor. Aşağıdaki tablo, dosya adlarını üretilmiş public proje görselleriyle eşleştirerek hangi projeye ait olduklarını tahmin eder.');
  lines.push('');
  lines.push('| Proje | Dosya | Path |');
  lines.push('| --- | --- | --- |');
  for (const item of legacyUpscaled) {
    lines.push(`| ${item.inferredProjectTitle || 'Unknown'} | \`${item.fileName}\` | \`${item.path}\` |`);
  }
  lines.push('');

  return `${lines.join('\n')}\n`;
}

async function main() {
  const catalogs = await Promise.all(SOURCE_PROJECTS.map(collectProjectCatalog));
  const orderedCatalogs = catalogs.sort((a, b) => a.slug.localeCompare(b.slug));
  const legacyUpscaled = await collectLegacyUpscaled(orderedCatalogs);

  await mkdir(DOCS_ROOT, { recursive: true });
  await copySelectedAssets(orderedCatalogs);
  await copyUnusedAssets(orderedCatalogs);
  await writeFile(INVENTORY_JSON, `${JSON.stringify({ generatedAt: new Date().toISOString(), projects: orderedCatalogs, legacyUpscaled }, null, 2)}\n`, 'utf8');
  await writeFile(INVENTORY_MD, renderMarkdown(orderedCatalogs, legacyUpscaled), 'utf8');

  process.stdout.write(`Wrote ${relativeRepoPath(INVENTORY_MD)}\n`);
  process.stdout.write(`Wrote ${relativeRepoPath(INVENTORY_JSON)}\n`);
  process.stdout.write(`Copied selected assets to ${relativeRepoPath(SELECTED_ROOT)}\n`);
  process.stdout.write(`Copied unused assets to ${relativeRepoPath(UNUSED_ROOT)}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
