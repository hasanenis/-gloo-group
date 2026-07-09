import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { projects } from '../src/data/projects.ts';
import {
  curateProjectImages,
  type AnalysisFileForCuration,
  type CuratedImage,
  type CurationEntry,
} from './project-image-curation.ts';

type SourceProject = {
  slug: string;
  formFile: string;
  photoFolder: string;
};

const ROOT = process.cwd();
const DATA_ROOT = path.join(ROOT, String.fromCodePoint(0x130) + 'gloo project data');
const PHOTOS_ROOT = path.join(DATA_ROOT, 'photos projet');
const ANALYSIS_ROOT = path.join(DATA_ROOT, 'analysis');
const DOCS_ROOT = path.join(ROOT, 'docs');
const OUTPUT_MD = path.join(DOCS_ROOT, 'project-photo-selection.md');
const OUTPUT_JSON = path.join(DOCS_ROOT, 'project-photo-selection.json');

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

function isImage(filePath: string) {
  return IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

function safeFileName(fileName: string) {
  return fileName
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .toLowerCase() || 'image';
}

function cleanForTable(value: string) {
  return value.replaceAll('|', '/').replace(/\s+/g, ' ').trim();
}

function formatScore(value: number | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? value.toFixed(1) : '-';
}

function formatList(values: string[] | undefined) {
  return values?.length ? values.join(', ') : '-';
}

function slotLabel(slot: string) {
  const labels: Record<string, string> = {
    hero: 'Hero',
    intro: 'Intro',
    mosaic: 'Mosaic',
    featureGallery: 'Feature gallery',
    constructionGallery: 'Construction gallery',
    featured: 'Featured card',
  };
  return labels[slot] || slot;
}

function relativePath(root: string, filePath: string) {
  return path.relative(root, filePath).replaceAll('\\', '/');
}

async function walkImages(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walkImages(fullPath);
    return entry.isFile() && isImage(fullPath) ? [fullPath] : [];
  }));
  return nested.flat().sort((a, b) => a.localeCompare(b));
}

async function readAnalysis(photoFolder: string): Promise<AnalysisFileForCuration | null> {
  try {
    return JSON.parse(await readFile(path.join(ANALYSIS_ROOT, photoFolder, 'analysis.json'), 'utf8')) as AnalysisFileForCuration;
  } catch {
    return null;
  }
}

async function buildEntries(source: SourceProject): Promise<CurationEntry[]> {
  const sourceRoot = path.join(PHOTOS_ROOT, source.photoFolder);
  const files = await walkImages(sourceRoot);
  return files.map((file, index) => {
    const sourceRelativePath = relativePath(sourceRoot, file);
    const publicName = `${String(index + 1).padStart(2, '0')}-${safeFileName(path.parse(file).name)}.webp`;
    return {
      relativePath: sourceRelativePath,
      src: `/projects/${source.slug}/${publicName}`,
    };
  });
}

function attachAnalysis(entries: CurationEntry[], analysis: AnalysisFileForCuration | null) {
  return entries.map((entry) => ({
    ...entry,
    analysis: analysis?.analyses?.find((item) => item.relativePath === entry.relativePath),
  }));
}

function selectedSlotsText(image: CuratedImage) {
  return image.selectedSlots.length ? image.selectedSlots.map(slotLabel).join(', ') : '-';
}

function renderImageCard(image: CuratedImage) {
  const analysis = image.analysis;
  const scores = analysis?.scores || {};
  const lines = [
    `#### ${image.relativePath}`,
    '',
    `- Karar: ${image.selected ? 'Seçildi' : 'Elenmedi, kullanılmayacak'}`,
    `- Toplam puan: ${image.editorialScore.toFixed(1)}`,
    `- Kullanılacağı slotlar: ${selectedSlotsText(image)}`,
    `- Public dosya: \`${image.src}\``,
    `- Kısa açıklama: ${analysis?.shortCaption || '-'}`,
    `- İçerik özeti: ${analysis?.summary || '-'}`,
    `- Aşama: ${analysis?.constructionStage || '-'}`,
    `- En uygun site bölümleri: ${formatList(analysis?.bestSiteSections)}`,
    `- Görsel kalite notları: ${formatList(analysis?.qualityNotes)}`,
    `- Kırpma notları: ${formatList(analysis?.cropNotes)}`,
    `- Kullanım riski: ${formatList(analysis?.doNotUseReasons)}`,
    `- Puanlar: hero ${formatScore(scores.hero)}, banner ${formatScore(scores.banner)}, support ${formatScore(scores.support)}, gallery ${formatScore(scores.gallery)}, uniqueness ${formatScore(scores.uniqueness)}, composition ${formatScore(scores.composition)}, cleanliness ${formatScore(scores.cleanliness)}, risk ${formatScore(scores.exclusionRisk)}`,
    `- Karar gerekçesi: ${image.reason}`,
    '',
  ];
  return lines.join('\n');
}

function renderProjectSection(source: SourceProject, images: CuratedImage[]) {
  const project = projects.find((item) => item.slug === source.slug);
  const selected = images.filter((image) => image.selected);
  const rejected = images.filter((image) => !image.selected);
  const lines = [
    `### ${project?.menuTitle || source.slug}`,
    '',
    `- Proje slug: \`${source.slug}\``,
    `- Kaynak fotoğraf klasörü: \`${source.photoFolder}\``,
    `- İncelenen fotoğraf: ${images.length}`,
    `- Seçilen fotoğraf: ${selected.length}`,
    `- Kullanılmayacak fotoğraf: ${rejected.length}`,
    '',
    '#### Seçilen set',
    '',
    '| Slotlar | Puan | Public dosya | Kaynak dosya | Not |',
    '| --- | --- | --- | --- | --- |',
  ];

  for (const image of selected) {
    lines.push(`| ${selectedSlotsText(image)} | ${image.editorialScore.toFixed(1)} | \`${image.src}\` | \`${image.relativePath}\` | ${cleanForTable(image.analysis?.shortCaption || image.reason)} |`);
  }

  lines.push('');
  lines.push('#### Tüm fotoğraf analizi');
  lines.push('');
  for (const image of images) {
    lines.push(renderImageCard(image));
  }
  lines.push('');
  return lines.join('\n');
}

async function main() {
  const projectOutputs = [];
  const markdownSections: string[] = [
    '# Proje Fotoğraf Seçimi',
    '',
    'Bu rapor `npm run select:images` ile üretilir.',
    '',
    'Kural: her proje için en fazla 10 benzersiz fotoğraf seçilir; her görsel section en fazla 4 fotoğraf kullanır. Puanlama mevcut görsel analiz dosyalarındaki hero, gallery, composition, cleanliness, uniqueness ve exclusion risk skorlarını birleştirir.',
    '',
  ];

  for (const source of SOURCE_PROJECTS) {
    const [entries, analysis] = await Promise.all([buildEntries(source), readAnalysis(source.photoFolder)]);
    const entriesWithAnalysis = attachAnalysis(entries, analysis);
    const curation = curateProjectImages(entriesWithAnalysis, analysis);
    projectOutputs.push({
      slug: source.slug,
      photoFolder: source.photoFolder,
      selected: curation.selected.map((image) => image.relativePath),
      images: curation.images,
    });
    markdownSections.push(renderProjectSection(source, curation.images));
  }

  await mkdir(DOCS_ROOT, { recursive: true });
  await writeFile(OUTPUT_MD, `${markdownSections.join('\n')}\n`, 'utf8');
  await writeFile(OUTPUT_JSON, `${JSON.stringify({ generatedAt: new Date().toISOString(), projects: projectOutputs }, null, 2)}\n`, 'utf8');

  process.stdout.write(`Wrote ${relativePath(ROOT, OUTPUT_MD)}\n`);
  process.stdout.write(`Wrote ${relativePath(ROOT, OUTPUT_JSON)}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
