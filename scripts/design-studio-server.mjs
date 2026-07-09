import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const storageDir = path.join(rootDir, 'design-documents');
const presetsDir = path.join(storageDir, 'presets');
const revisionsDir = path.join(storageDir, 'revisions');
const manifestPath = path.join(storageDir, 'manifest.json');
const currentPath = path.join(storageDir, 'current.json');
const port = Number(process.env.DESIGN_STUDIO_API_PORT || 3010);

function createDefaultTokens() {
  return {
    colors: {
      iglooRed: '#e1251b',
      iglooRedDark: '#c22026',
      iglooBlack: '#111111',
      iglooMuted: 'rgba(17, 17, 17, 0.62)',
      surface: '#ffffff',
      surfaceAlt: '#f5f3ef',
      textStrong: '#111111',
    },
    radius: {
      base: '8px',
      card: '8px',
    },
    spacing: {
      section: '72px',
      content: '24px',
    },
    typography: {
      sans: 'var(--font-sans)',
      serif: 'var(--font-serif)',
      nav: 'var(--font-nav)',
    },
    effects: {
      shadowSoft: '0 18px 40px rgba(0,0,0,0.12)',
    },
  };
}

function createManifest() {
  return {
    version: 2,
    activeRevisionId: null,
    activePresetId: null,
    presetIds: [],
    revisionIds: [],
    updatedAt: new Date().toISOString(),
    draftUpdatedAt: null,
  };
}

function createCurrentDocument() {
  return {
    version: 2,
    draft: null,
    fallbackTokens: createDefaultTokens(),
  };
}

async function ensureStorage() {
  await fs.mkdir(presetsDir, { recursive: true });
  await fs.mkdir(revisionsDir, { recursive: true });

  await ensureJsonFile(manifestPath, createManifest());
  await ensureJsonFile(currentPath, createCurrentDocument());
}

async function ensureJsonFile(filePath, content) {
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify(content, null, 2));
  }
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

async function writeJson(filePath, value) {
  await fs.writeFile(filePath, JSON.stringify(value, null, 2));
}

async function loadDocument() {
  await ensureStorage();
  const manifest = await readJson(manifestPath);
  const current = await readJson(currentPath);

  const presets = await Promise.all(
    (manifest.presetIds || []).map((id) => readJson(path.join(presetsDir, `${id}.json`)).catch(() => null))
  );
  const revisions = await Promise.all(
    (manifest.revisionIds || []).map((id) => readJson(path.join(revisionsDir, `${id}.json`)).catch(() => null))
  );

  const cleanPresets = presets.filter(Boolean);
  const cleanRevisions = revisions.filter(Boolean);
  const activeRevision = cleanRevisions.find((revision) => revision.id === manifest.activeRevisionId) || null;

  return {
    version: 2,
    manifest,
    draft: current.draft || null,
    presets: cleanPresets,
    revisions: cleanRevisions,
    activeRevision,
    fallbackTokens: current.fallbackTokens || createDefaultTokens(),
  };
}

function stampPreset(preset) {
  const now = new Date().toISOString();
  return {
    ...preset,
    id: preset.id || `preset-${now.replace(/[:.]/g, '-')}`,
    createdAt: preset.createdAt || now,
    updatedAt: now,
  };
}

async function persistPreset(preset) {
  const stamped = stampPreset(preset);
  await writeJson(path.join(presetsDir, `${stamped.id}.json`), stamped);
  return stamped;
}

async function persistRevision(revision) {
  await writeJson(path.join(revisionsDir, `${revision.id}.json`), revision);
}

const app = express();
app.use(express.json({ limit: '4mb' }));

app.get('/api/design-studio/document', async (_request, response) => {
  try {
    response.json(await loadDocument());
  } catch (error) {
    response.status(500).send(error instanceof Error ? error.message : 'Failed to load design document');
  }
});

app.post('/api/design-studio/draft', async (request, response) => {
  try {
    await ensureStorage();
    const current = await readJson(currentPath);
    const manifest = await readJson(manifestPath);
    current.draft = request.body?.draft || null;
    current.version = 2;
    manifest.draftUpdatedAt = new Date().toISOString();
    manifest.updatedAt = manifest.draftUpdatedAt;
    await writeJson(currentPath, current);
    await writeJson(manifestPath, manifest);
    response.json(await loadDocument());
  } catch (error) {
    response.status(500).send(error instanceof Error ? error.message : 'Failed to persist draft');
  }
});

app.post('/api/design-studio/presets', async (request, response) => {
  try {
    const manifest = await readJson(manifestPath);
    const preset = await persistPreset(request.body?.preset || {});
    if (!manifest.presetIds.includes(preset.id)) {
      manifest.presetIds.push(preset.id);
    }
    manifest.activePresetId = preset.id;
    manifest.updatedAt = new Date().toISOString();
    await writeJson(manifestPath, manifest);
    response.json(await loadDocument());
  } catch (error) {
    response.status(500).send(error instanceof Error ? error.message : 'Failed to save preset');
  }
});

app.put('/api/design-studio/presets/:id', async (request, response) => {
  try {
    const manifest = await readJson(manifestPath);
    const preset = await persistPreset({ ...(request.body?.preset || {}), id: request.params.id });
    if (!manifest.presetIds.includes(preset.id)) {
      manifest.presetIds.push(preset.id);
    }
    manifest.activePresetId = preset.id;
    manifest.updatedAt = new Date().toISOString();
    await writeJson(manifestPath, manifest);
    response.json(await loadDocument());
  } catch (error) {
    response.status(500).send(error instanceof Error ? error.message : 'Failed to update preset');
  }
});

app.post('/api/design-studio/publish', async (request, response) => {
  try {
    const manifest = await readJson(manifestPath);
    const current = await readJson(currentPath);
    const now = new Date().toISOString();
    const revision = {
      id: `revision-${now.replace(/[:.]/g, '-')}`,
      label: request.body?.label || `Revision ${now}`,
      createdAt: now,
      author: request.body?.author || 'Unknown',
      basePresetId: request.body?.basePresetId || null,
      notes: request.body?.notes || undefined,
      preset: stampPreset(request.body?.preset || {}),
    };

    await persistRevision(revision);
    if (!manifest.revisionIds.includes(revision.id)) {
      manifest.revisionIds.push(revision.id);
    }
    manifest.activeRevisionId = revision.id;
    manifest.updatedAt = now;
    current.draft = null;
    await writeJson(manifestPath, manifest);
    await writeJson(currentPath, current);
    response.json(await loadDocument());
  } catch (error) {
    response.status(500).send(error instanceof Error ? error.message : 'Failed to publish revision');
  }
});

app.get('/api/design-studio/revisions', async (_request, response) => {
  try {
    const document = await loadDocument();
    response.json(document.revisions);
  } catch (error) {
    response.status(500).send(error instanceof Error ? error.message : 'Failed to load revisions');
  }
});

app.post('/api/design-studio/import', async (request, response) => {
  try {
    const imported = request.body?.document;
    if (!imported?.manifest) {
      response.status(400).send('Invalid document payload');
      return;
    }

    await ensureStorage();
    await writeJson(manifestPath, imported.manifest);
    await writeJson(currentPath, {
      version: imported.version || 2,
      draft: imported.draft || null,
      fallbackTokens: imported.fallbackTokens || createDefaultTokens(),
    });

    await fs.rm(presetsDir, { recursive: true, force: true });
    await fs.rm(revisionsDir, { recursive: true, force: true });
    await fs.mkdir(presetsDir, { recursive: true });
    await fs.mkdir(revisionsDir, { recursive: true });

    for (const preset of imported.presets || []) {
      await writeJson(path.join(presetsDir, `${preset.id}.json`), preset);
    }

    for (const revision of imported.revisions || []) {
      await writeJson(path.join(revisionsDir, `${revision.id}.json`), revision);
    }

    response.json(await loadDocument());
  } catch (error) {
    response.status(500).send(error instanceof Error ? error.message : 'Failed to import design document');
  }
});

app.listen(port, () => {
  console.log(`Design Studio API listening on http://127.0.0.1:${port}`);
});
