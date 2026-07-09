import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const configPath = path.join(rootDir, 'src', 'data', 'manualProjectImages.ts');
const projectsPath = path.join(rootDir, 'src', 'data', 'projects.ts');
const publicProjectsDir = path.join(rootDir, 'public', 'projects');
const port = Number(process.env.PROJECT_IMAGE_EDITOR_PORT || 3020);

const slots = [
  { key: 'hero', label: 'Hero', ratio: '16 / 9', hint: 'En ustteki buyuk gorsel' },
  { key: 'intro', label: 'Intro', ratio: '4 / 3', hint: 'Hero altindaki split gorsel' },
  { key: 'square', label: 'Kare', ratio: '1 / 1', hint: 'Ikili fotograf alanindaki kare gorsel' },
  { key: 'wide', label: 'Genis', ratio: '2 / 1', hint: 'Ikili fotograf alanindaki genis gorsel' },
  { key: 'info', label: 'Info Cizim', ratio: '2 / 1', hint: 'Metrik panelinin arkasi' },
  { key: 'panorama', label: 'Panorama', ratio: '3 / 1', hint: 'Alttaki yatay gorsel' },
];
const slotKeys = new Set(slots.map((slot) => slot.key));
const imageExtensions = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.webp']);

function jsString(value) {
  return JSON.stringify(value ?? '');
}

function normalizeSlot(rawSlot) {
  return {
    src: typeof rawSlot?.src === 'string' ? rawSlot.src : '',
    fit: rawSlot?.fit === 'contain' ? 'contain' : 'cover',
    positionX: Number.isFinite(Number(rawSlot?.positionX)) ? Number(rawSlot.positionX) : 50,
    positionY: Number.isFinite(Number(rawSlot?.positionY)) ? Number(rawSlot.positionY) : 50,
    scale: Number.isFinite(Number(rawSlot?.scale)) ? Number(rawSlot.scale) : 1,
  };
}

function normalizeConfig(rawConfig) {
  const images = {};
  for (const slot of slots) {
    const legacyHero = slot.key === 'hero' && rawConfig?.hero
      ? {
        src: rawConfig.hero,
        fit: rawConfig.heroFit,
        positionX: rawConfig.heroPositionX,
        positionY: rawConfig.heroPositionY,
        scale: rawConfig.heroScale,
      }
      : undefined;
    images[slot.key] = normalizeSlot(rawConfig?.images?.[slot.key] ?? legacyHero);
  }

  return {
    altEn: typeof rawConfig?.altEn === 'string' ? rawConfig.altEn : '',
    altFr: typeof rawConfig?.altFr === 'string' ? rawConfig.altFr : '',
    images,
  };
}

async function readProjects() {
  const source = await fs.readFile(projectsPath, 'utf8');
  const blocks = source.match(/\{\s*id:\s*\d+,[\s\S]*?sourceSlides:\s*\[[^\]]*\],\s*\}/g) ?? [];

  return blocks.map((block) => {
    const slug = block.match(/slug:\s*'([^']+)'/)?.[1] ?? '';
    const title = block.match(/title:\s*'([^']+)'/)?.[1] ?? slug;
    const menuTitle = block.match(/menuTitle:\s*'([^']+)'/)?.[1] ?? title;
    const location = block.match(/location:\s*'([^']+)'/)?.[1] ?? '';
    return { slug, title, menuTitle, location };
  }).filter((project) => project.slug);
}

async function readConfig() {
  const source = await fs.readFile(configPath, 'utf8');
  const match = source.match(/export const manualProjectImages:\s*Record<string,\s*ManualProjectImageConfig>\s*=\s*({[\s\S]*?});\s*\n\nfunction/);
  if (!match) {
    throw new Error('Could not find manualProjectImages object in src/data/manualProjectImages.ts');
  }

  return Function(`"use strict"; return (${match[1]});`)();
}

function renderSlot(slot) {
  return `{
      src: ${jsString(slot.src)},
      fit: ${jsString(slot.fit)},
      positionX: ${slot.positionX},
      positionY: ${slot.positionY},
      scale: ${slot.scale},
    }`;
}

function renderConfigFile(config) {
  const lines = Object.entries(config).map(([slug, rawConfig]) => {
    const item = normalizeConfig(rawConfig);
    const slotLines = slots.map((slot) => `      ${slot.key}: ${renderSlot(item.images[slot.key])},`);
    return `  ${jsString(slug)}: {
    altEn: ${jsString(item.altEn)},
    altFr: ${jsString(item.altFr)},
    images: {
${slotLines.join('\n')}
    },
  },`;
  });

  return `import type { ProjectImage } from './projectContent';

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
${lines.join('\n')}
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
`;
}

async function writeConfig(nextConfig) {
  await fs.writeFile(configPath, renderConfigFile(nextConfig), 'utf8');
}

async function listProjectImages(slug) {
  const dir = path.join(publicProjectsDir, slug);
  const resolved = path.resolve(dir);
  if (!resolved.startsWith(path.resolve(publicProjectsDir))) return [];

  try {
    const entries = await fs.readdir(resolved, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase()))
      .map((entry) => `/projects/${slug}/${entry.name}`)
      .sort((a, b) => a.localeCompare(b));
  } catch {
    return [];
  }
}

function pageHtml() {
  return `<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Project Image Editor</title>
  <style>
    * { box-sizing: border-box; }
    html, body { width: 100%; min-width: 0; overflow-x: hidden; }
    body { margin: 0; font-family: Arial, sans-serif; background: #f4f4f1; color: #111; }
    button, input, select { font: inherit; }
    .app { display: grid; grid-template-columns: 310px minmax(0, 1fr); min-height: 100vh; overflow-x: hidden; }
    aside { max-height: 100vh; border-right: 1px solid #ddd; background: #fff; padding: 18px; overflow: auto; }
    main { min-width: 0; padding: 18px; overflow: auto; }
    h1 { margin: 0 0 12px; font-size: 20px; }
    .project { width: 100%; border: 1px solid #ddd; background: #fff; padding: 10px; margin-bottom: 8px; text-align: left; cursor: pointer; }
    .project.active { border-color: #c22026; background: #fff4f4; }
    .project strong { display: block; font-size: 13px; }
    .project span { display: block; color: #666; font-size: 12px; margin-top: 4px; }
    .topbar { position: sticky; top: 0; z-index: 10; margin: -18px -18px 16px; padding: 14px 18px 12px; border-bottom: 1px solid #ddd; background: #f4f4f1; }
    .tabs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
    .tab { border: 1px solid #cfcfcf; background: #fff; color: #111; padding: 8px 10px; }
    .tab.active { border-color: #111; background: #111; color: #fff; }
    .toolbar { display: grid; grid-template-columns: minmax(180px, 1fr) auto auto; gap: 10px; align-items: end; margin-bottom: 8px; }
    label { display: grid; gap: 6px; color: #555; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
    input, select { width: 100%; border: 1px solid #ccc; border-radius: 0; background: #fff; padding: 9px 10px; }
    input[type="range"] { padding: 0; }
    button { border: 1px solid #111; background: #111; color: #fff; padding: 10px 14px; cursor: pointer; }
    button.secondary { background: #fff; color: #111; }
    .grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(260px, 320px); gap: 18px; align-items: start; width: 100%; min-width: 0; }
    .preview-stack { display: grid; gap: 14px; min-width: 0; }
    .preview-title { margin: 0 0 8px; color: #555; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
    .crop-preview, .site-preview { min-width: 0; background: #111; overflow: hidden; display: grid; place-items: center; padding: 10px; }
    .crop-preview-frame { width: 100%; max-width: 100%; max-height: 42vh; aspect-ratio: var(--ratio); background: #171717; overflow: hidden; }
    .crop-preview img { width: 100%; height: 100%; display: block; }
    .site-preview { min-height: 440px; background: #fff; color: #050505; border: 1px solid #ddd; padding: 18px; }
    .container-preview { display: grid; min-height: 404px; place-items: center; background: linear-gradient(135deg, #f5f5f5 25%, #ededed 25%, #ededed 50%, #f5f5f5 50%, #f5f5f5 75%, #ededed 75%); background-size: 22px 22px; }
    .container-preview__frame { position: relative; width: min(100%, var(--container-width)); aspect-ratio: var(--container-ratio); overflow: hidden; background: #171717; box-shadow: 0 0 0 1px #111; }
    .container-preview__frame img { width: 100%; height: 100%; display: block; }
    .container-preview__meta { position: absolute; left: 8px; top: 8px; z-index: 2; padding: 5px 7px; background: rgba(255,255,255,.9); color: #111; font-size: 11px; font-weight: 700; letter-spacing: .04em; }
    .controls { display: grid; min-width: 0; gap: 14px; padding: 16px; background: #fff; border: 1px solid #ddd; }
    .row { display: grid; grid-template-columns: 1fr 74px; gap: 8px; align-items: center; }
    .images { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; margin-top: 18px; }
    .image-card { border: 2px solid transparent; background: #fff; padding: 6px; cursor: pointer; }
    .image-card.active { border-color: #c22026; }
    .image-card img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; display: block; background: #eee; }
    .image-card span { display: block; margin-top: 6px; color: #555; font-size: 11px; word-break: break-all; }
    .status { min-height: 20px; color: #0b6b2b; font-size: 13px; }
    .hint { color: #666; font-size: 13px; line-height: 1.4; margin-bottom: 14px; }
    .slot-hint { color: #666; font-size: 13px; min-height: 20px; }
    @media (max-width: 980px) {
      .app { grid-template-columns: 1fr; }
      aside { position: static; max-height: 260px; border-right: 0; border-bottom: 1px solid #ddd; }
      .grid, .toolbar { grid-template-columns: 1fr; }
      .topbar { margin: -18px -18px 14px; }
      .crop-preview-frame { max-height: none; }
    }
  </style>
</head>
<body>
  <div class="app">
    <aside>
      <h1>Project Image Editor</h1>
      <div class="hint">Proje detay sayfasindaki gorsel slotlarini yerelde kaydeder.</div>
      <div id="projects"></div>
    </aside>
    <main>
      <div class="topbar">
        <div class="tabs" id="tabs"></div>
        <div class="slot-hint" id="slotHint"></div>
        <div class="toolbar">
          <label>Gorsel yolu <input id="src" placeholder="/projects/slug/image.webp" /></label>
          <button id="save">Kaydet</button>
          <a id="openSite" target="_blank"><button class="secondary" type="button">Sitede ac</button></a>
        </div>
        <div class="status" id="status"></div>
      </div>
      <div class="grid">
        <section class="preview-stack">
          <div>
            <p class="preview-title">Kesim onizlemesi</p>
            <div class="crop-preview"><div class="crop-preview-frame" id="previewFrame"><img id="preview" alt="" /></div></div>
          </div>
          <div>
            <p class="preview-title">Gercek container onizlemesi</p>
            <div class="site-preview" id="sitePreview"></div>
          </div>
          <div class="images" id="images"></div>
        </section>
        <section class="controls">
          <label>Fit
            <select id="fit">
              <option value="cover">cover</option>
              <option value="contain">contain</option>
            </select>
          </label>
          <label>Pozisyon X <div class="row"><input id="x" type="range" min="0" max="100" step="1" /><input id="xText" type="number" min="0" max="100" /></div></label>
          <label>Pozisyon Y <div class="row"><input id="y" type="range" min="0" max="100" step="1" /><input id="yText" type="number" min="0" max="100" /></div></label>
          <label>Zoom <div class="row"><input id="scale" type="range" min="0.5" max="2" step="0.01" /><input id="scaleText" type="number" min="0.5" max="2" step="0.01" /></div></label>
          <label>Alt EN <input id="altEn" /></label>
          <label>Alt FR <input id="altFr" /></label>
          <button id="reset" class="secondary">Bu slotu otomatik yap</button>
        </section>
      </div>
    </main>
  </div>
  <script>
    const slots = ${JSON.stringify(slots)};
    let projects = [];
    let config = {};
    let currentSlug = '';
    let currentSlot = 'hero';

    const $ = (id) => document.getElementById(id);
    const currentProjectConfig = () => config[currentSlug] || { images: {} };
    const currentSlotConfig = () => currentProjectConfig().images?.[currentSlot] || {};
    const activeSlotMeta = () => slots.find((slot) => slot.key === currentSlot) || slots[0];

    function setStatus(text) {
      $('status').textContent = text;
      if (text) setTimeout(() => { if ($('status').textContent === text) $('status').textContent = ''; }, 2200);
    }

    function applyPreview() {
      const src = $('src').value.trim();
      const slot = activeSlotMeta();
      $('preview').src = src || '';
      $('previewFrame').style.setProperty('--ratio', slot.ratio);
      $('slotHint').textContent = slot.hint;
      $('preview').style.objectFit = $('fit').value;
      $('preview').style.objectPosition = $('x').value + '% ' + $('y').value + '%';
      $('preview').style.transform = 'scale(' + $('scale').value + ')';
      $('preview').style.transformOrigin = '50% 50%';
      renderSitePreview(src, slot);
    }

    function renderSitePreview(src, slot) {
      const sizeMap = {
        hero: { ratio: '16 / 9', width: '100%', label: 'Hero container - ekran genisligi' },
        intro: { ratio: '4 / 3', width: '72%', label: 'Intro image container - 4:3' },
        square: { ratio: '1 / 1', width: '48%', label: 'Kare duo container - 1:1' },
        wide: { ratio: '2 / 1', width: '82%', label: 'Genis duo container - 2:1' },
        info: { ratio: '2.08 / 1', width: '86%', label: 'Info panel arka gorsel container' },
        panorama: { ratio: '3 / 1', width: '100%', label: 'Panorama container - 3:1' },
      };
      const size = sizeMap[slot.key] || sizeMap.hero;
      const fallback = '<div class="container-preview"><div style="padding:32px;color:#777">Gorsel secince burada container icindeki konumu gorunur.</div></div>';

      if (!src) {
        $('sitePreview').innerHTML = fallback;
        return;
      }

      $('sitePreview').innerHTML =
        '<div class="container-preview">' +
          '<div class="container-preview__frame" style="--container-ratio:' + size.ratio + ';--container-width:' + size.width + ';">' +
            '<div class="container-preview__meta">' + size.label + '</div>' +
            '<img src="' + src + '" alt="" style="object-fit:' + $('fit').value + ';object-position:' + $('x').value + '% ' + $('y').value + '%;transform:scale(' + $('scale').value + ');transform-origin:50% 50%;">' +
          '</div>' +
        '</div>';
    }

    function syncNumber(rangeId, numberId) {
      $(numberId).value = $(rangeId).value;
      applyPreview();
    }

    function syncRange(numberId, rangeId) {
      $(rangeId).value = $(numberId).value;
      applyPreview();
    }

    function renderProjects() {
      $('projects').innerHTML = projects.map((project) => '<button class="project ' + (project.slug === currentSlug ? 'active' : '') + '" data-slug="' + project.slug + '"><strong>' + project.menuTitle + '</strong><span>' + project.slug + '</span></button>').join('');
      document.querySelectorAll('.project').forEach((button) => {
        button.addEventListener('click', () => selectProject(button.dataset.slug));
      });
    }

    function renderTabs() {
      $('tabs').innerHTML = slots.map((slot) => '<button class="tab ' + (slot.key === currentSlot ? 'active' : '') + '" data-slot="' + slot.key + '">' + slot.label + '</button>').join('');
      document.querySelectorAll('.tab').forEach((button) => {
        button.addEventListener('click', () => selectSlot(button.dataset.slot));
      });
    }

    async function renderImages() {
      const response = await fetch('/api/images/' + currentSlug);
      const images = await response.json();
      $('images').innerHTML = images.map((src) => '<button class="image-card ' + (src === $('src').value ? 'active' : '') + '" data-src="' + src + '"><img src="' + src + '" alt=""><span>' + src.split('/').pop() + '</span></button>').join('');
      document.querySelectorAll('.image-card').forEach((button) => {
        button.addEventListener('click', () => {
          $('src').value = button.dataset.src;
          applyPreview();
          renderImages();
        });
      });
    }

    async function selectProject(slug) {
      currentSlug = slug;
      $('openSite').href = 'http://localhost:3000/projects/' + slug;
      renderProjects();
      await loadFields();
    }

    async function selectSlot(slot) {
      currentSlot = slot;
      renderTabs();
      await loadFields();
    }

    async function loadFields() {
      const projectConfig = currentProjectConfig();
      const item = currentSlotConfig();
      $('src').value = item.src || '';
      $('fit').value = item.fit || 'cover';
      $('x').value = item.positionX ?? 50;
      $('xText').value = $('x').value;
      $('y').value = item.positionY ?? 50;
      $('yText').value = $('y').value;
      $('scale').value = item.scale ?? 1;
      $('scaleText').value = $('scale').value;
      $('altEn').value = projectConfig.altEn || '';
      $('altFr').value = projectConfig.altFr || '';
      applyPreview();
      await renderImages();
    }

    async function load() {
      const response = await fetch('/api/state');
      const state = await response.json();
      projects = state.projects;
      config = state.config;
      renderTabs();
      await selectProject(projects[0]?.slug || '');
    }

    async function save() {
      const projectConfig = currentProjectConfig();
      const images = { ...(projectConfig.images || {}) };
      images[currentSlot] = {
        src: $('src').value.trim(),
        fit: $('fit').value,
        positionX: Number($('x').value),
        positionY: Number($('y').value),
        scale: Number($('scale').value),
      };
      config[currentSlug] = {
        ...projectConfig,
        images,
        altEn: $('altEn').value,
        altFr: $('altFr').value,
      };
      const response = await fetch('/api/config/' + currentSlug, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(config[currentSlug]),
      });
      if (!response.ok) {
        setStatus('Kaydedilemedi');
        return;
      }
      config = await response.json();
      setStatus('Kaydedildi: src/data/manualProjectImages.ts');
      await renderImages();
    }

    $('save').addEventListener('click', save);
    $('reset').addEventListener('click', () => { $('src').value = ''; applyPreview(); });
    ['src', 'fit', 'altEn', 'altFr'].forEach((id) => $(id).addEventListener('input', applyPreview));
    $('x').addEventListener('input', () => syncNumber('x', 'xText'));
    $('xText').addEventListener('input', () => syncRange('xText', 'x'));
    $('y').addEventListener('input', () => syncNumber('y', 'yText'));
    $('yText').addEventListener('input', () => syncRange('yText', 'y'));
    $('scale').addEventListener('input', () => syncNumber('scale', 'scaleText'));
    $('scaleText').addEventListener('input', () => syncRange('scaleText', 'scale'));
    load().catch((error) => setStatus(error.message));
  </script>
</body>
</html>`;
}

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use('/projects', express.static(publicProjectsDir));

app.get('/', (_request, response) => {
  response.type('html').send(pageHtml());
});

app.get('/api/state', async (_request, response, next) => {
  try {
    const projects = await readProjects();
    const config = await readConfig();
    for (const project of projects) {
      config[project.slug] = normalizeConfig(config[project.slug]);
    }
    response.json({ projects, config, slots });
  } catch (error) {
    next(error);
  }
});

app.get('/api/images/:slug', async (request, response, next) => {
  try {
    response.json(await listProjectImages(request.params.slug));
  } catch (error) {
    next(error);
  }
});

app.post('/api/config/:slug', async (request, response, next) => {
  try {
    const projects = await readProjects();
    if (!projects.some((project) => project.slug === request.params.slug)) {
      response.status(404).json({ error: 'Unknown project slug' });
      return;
    }

    const config = await readConfig();
    config[request.params.slug] = normalizeConfig({
      ...(config[request.params.slug] ?? {}),
      ...request.body,
    });
    await writeConfig(config);
    response.json(config);
  } catch (error) {
    next(error);
  }
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ error: error.message });
});

app.listen(port, '127.0.0.1', () => {
  console.log(`Project Image Editor: http://127.0.0.1:${port}`);
});
