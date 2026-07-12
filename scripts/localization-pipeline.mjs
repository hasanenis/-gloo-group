import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { TranslationServiceClient } from '@google-cloud/translate';
import { GoogleGenAI } from '@google/genai';
import {
  ROOT_DIR,
  TARGET_LOCALES,
  assertLocale,
  clone,
  documentRevision,
  flattenStrings,
  readDocument,
  setAtPath,
  writeJsonAtomic,
} from './localization-content.mjs';
import { buildEditorialBrief, PROJECT_OVERRIDES, sourceQualityIssues } from './localization-rules.mjs';

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const at = args.indexOf(name);
  return at >= 0 ? args[at + 1] : fallback;
};
const has = (name) => args.includes(name);
const pageId = String(option('--page', '')).replace(/^\/+|\/+$/g, '');
const target = assertLocale(option('--target', ''));
const shared = has('--shared');
const jobId = option('--job-id', `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`);
const offline = has('--offline') || has('--dry-run');
if (!pageId || !TARGET_LOCALES.includes(target)) throw new Error('Usage: node scripts/localization-pipeline.mjs --page <page-id> --target fr|tr|ar-DZ [--shared]');

const source = await readDocument({ pageId: shared ? 'shared' : pageId, locale: 'en', shared });
const manifest = shared ? null : await fs.readFile(path.join(ROOT_DIR, 'content', 'pages', pageId, 'page.json'), 'utf8').then(JSON.parse).catch(() => null);
const facts = shared || !pageId.startsWith('projects/')
  ? null
  : await fs.readFile(path.join(ROOT_DIR, 'content', 'pages', pageId, 'facts.json'), 'utf8').then(JSON.parse).catch(() => null);
const protectedTerms = JSON.parse(await fs.readFile(path.join(ROOT_DIR, 'content', 'terminology', 'protected-terms.json'), 'utf8'));
const segments = [
  ...flattenStrings(source.seo, 'seo'),
  ...flattenStrings(source.content, 'content'),
].filter(({ source: text }) => text.trim());
const artifactRoot = path.join(ROOT_DIR, 'artifacts', 'localization', jobId, shared ? 'shared' : pageId, target);
await fs.mkdir(artifactRoot, { recursive: true });
const writeArtifact = async (name, value) => {
  const file = path.join(artifactRoot, name);
  await writeJsonAtomic(file, value);
  return file;
};

const metadata = {
  jobId,
  pageId: shared ? 'shared' : pageId,
  target,
  shared,
  sourceRevision: source.revision,
  generatedAt: new Date().toISOString(),
};
const editorialBrief = buildEditorialBrief({ pageId, target, manifest, facts, terminology: protectedTerms });
await writeArtifact('00-source.json', { ...metadata, segments });
await writeArtifact('00-source-review.json', { ...metadata, status: 'review', issues: sourceQualityIssues(segments), note: 'English source remains authoritative; repair suggestions are reviewed before changing source JSON.' });
await writeArtifact('00-editorial-brief.json', { ...metadata, brief: editorialBrief });
if (offline) {
  await writeArtifact('07-qa-report.json', { ...metadata, status: 'dry-run', issues: [], note: 'Remote AI stages skipped by --offline/--dry-run.' });
  process.stdout.write(JSON.stringify({ ...metadata, status: 'dry-run', segments: segments.length }) + '\n');
  process.exit(0);
}

const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(ROOT_DIR, '.secrets', 'gcp', 'translation-service-account.json');
const credential = JSON.parse(await fs.readFile(credentials, 'utf8'));
if (!credential.project_id) throw new Error(`Google service account is missing project_id: ${credentials}`);
process.env.GOOGLE_APPLICATION_CREDENTIALS = credentials;

function cloudLanguage(locale) { return locale === 'ar-DZ' ? 'ar' : locale; }
async function cloudDraft() {
  const client = new TranslationServiceClient({ keyFilename: credentials });
  const location = process.env.GOOGLE_TRANSLATE_LOCATION || 'us-central1';
  const model = process.env.GOOGLE_TRANSLATE_MODEL || 'translation-llm';
  const batches = [];
  let batch = [];
  let chars = 0;
  for (const segment of segments) {
    const count = [...segment.source].length;
    if (batch.length && (batch.length >= 40 || chars + count > 18_000)) { batches.push(batch); batch = []; chars = 0; }
    batch.push(segment); chars += count;
  }
  if (batch.length) batches.push(batch);
  const translated = [];
  for (const current of batches) {
    let response;
    for (let attempt = 0; attempt < 6; attempt += 1) {
      try {
        const [result] = await client.translateText({
          parent: `projects/${credential.project_id}/locations/${location}`,
          contents: current.map((item) => item.source),
          mimeType: 'text/plain',
          sourceLanguageCode: 'en',
          targetLanguageCode: cloudLanguage(target),
          model: `projects/${credential.project_id}/locations/${location}/models/general/${model}`,
          labels: { system: 'igloo-localization', phase: 'semantic-draft', locale: cloudLanguage(target) },
        });
        response = result;
        break;
      } catch (error) {
        const status = error?.code || error?.status;
        if (attempt === 5 || ![429, 500, 502, 503].includes(Number(status))) throw error;
        const baseDelay = Math.min(60_000, (attempt + 1) * 5_000);
        const jitter = Math.floor(Math.random() * 1_500);
        await new Promise((resolve) => setTimeout(resolve, baseDelay + jitter));
      }
    }
    translated.push(...(response?.translations || []).map((item) => item.translatedText || ''));
  }
  if (translated.length !== segments.length) throw new Error(`Cloud Translation returned ${translated.length}/${segments.length} segments.`);
  return segments.map((segment, index) => ({ ...segment, draft: translated[index], provider: `cloud-translation-${model}` }));
}

const sourceForAI = segments.map((segment) => ({
  id: segment.path,
  source: segment.source,
  context: `${pageId}; ${segment.path}; full-page editorial localization`,
  fieldContext: manifest?.fields?.find((field) => field.key === segment.path) || null,
}));
const draftModel = process.env.GEMINI_LOCALIZATION_DRAFT_MODEL || process.env.GEMINI_LOCALIZATION_MODEL || 'gemini-3.5-flash';
const reviewModel = process.env.GEMINI_LOCALIZATION_REVIEW_MODEL || process.env.GEMINI_LOCALIZATION_MODEL || 'gemini-3.5-flash';
const aiLocation = process.env.GOOGLE_CLOUD_LOCATION || 'global';
const ai = new GoogleGenAI({ vertexai: true, project: credential.project_id, location: aiLocation, apiVersion: 'v1' });
const languageName = { fr: 'French', tr: 'Turkish', 'ar-DZ': 'Modern Standard Arabic for Algeria' }[target];

function parseJsonText(text) {
  const clean = String(text || '').replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const start = Math.min(...['[', '{'].map((mark) => { const index = clean.indexOf(mark); return index < 0 ? Number.POSITIVE_INFINITY : index; }));
  if (!Number.isFinite(start)) throw new Error('Gemini response did not contain JSON.');
  return JSON.parse(clean.slice(start));
}
async function generate(prompt, model = reviewModel) {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    try {
      const response = await ai.models.generateContent({ model, contents: prompt, config: { temperature: 0.25, responseMimeType: 'application/json' } });
      return parseJsonText(response.text);
    } catch (error) {
      const status = Number(error?.status || error?.code);
      const malformedJson = error instanceof SyntaxError || /JSON|array|object/i.test(String(error?.message || ''));
      if (attempt === 5 || (!malformedJson && ![429, 500, 502, 503].includes(status))) throw error;
      const baseDelay = Math.min(60_000, (attempt + 1) * 5_000);
      const jitter = Math.floor(Math.random() * 1_500);
      await new Promise((resolve) => setTimeout(resolve, baseDelay + jitter));
    }
  }
  throw new Error('Vertex retry loop exited unexpectedly.');
}

function assertResults(results, expected, field = 'text') {
  if (!Array.isArray(results)) throw new Error('AI output must be a JSON array.');
  const ids = new Set(expected.map((item) => item.path));
  const seen = new Set();
  return results.map((item) => {
    if (!item || !ids.has(item.id) || seen.has(item.id) || typeof item[field] !== 'string' || !item[field].trim()) throw new Error(`Invalid AI result for ${item?.id || 'unknown field'}.`);
    seen.add(item.id);
    return { id: item.id, [field]: item[field].trim() };
  }).concat(expected.filter((item) => !seen.has(item.path)).map((item) => { throw new Error(`AI omitted ${item.path}.`); }));
}

async function generateStructured(prompt, expected, model = reviewModel, field = 'text') {
  let lastError;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      return assertResults(await generate(prompt, model), expected, field);
    } catch (error) {
      lastError = error;
      if (attempt === 3) break;
      const delay = Math.min(30_000, (attempt + 1) * 3_000) + Math.floor(Math.random() * 1_000);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}

const cloud = await cloudDraft();
await writeArtifact('01-semantic-a.json', { ...metadata, provider: 'google-cloud-translation', segments: cloud });

const semanticB = await generateStructured(`You are a semantic translation specialist. Translate the following complete page fields into ${languageName}. Preserve every fact, number, acronym, proper name and placeholder. Do not write marketing filler or invent information. Return exactly [{"id":"...","text":"..."}].\n${editorialBrief}\n${JSON.stringify(sourceForAI)}`, segments, draftModel)
  .catch(() => segments.map((item, index) => ({ id: item.path, text: cloud[index].draft })));
await writeArtifact('02-semantic-b.json', { ...metadata, model: draftModel, segments: semanticB });

const adjudicated = await generateStructured(`You are a senior adjudicator for an Algerian construction-company website. Compare two translations for each field. Select or correct the version that preserves the English meaning and every fact. Do not stylistically polish yet. Return exactly [{"id":"...","text":"..."}]. Target language: ${languageName}.\n${editorialBrief}\nSOURCE AND DRAFTS:\n${JSON.stringify(segments.map((item, index) => ({ id: item.path, source: item.source, a: cloud[index].draft, b: semanticB[index].text })))}`, segments)
  .catch(() => semanticB);
await writeArtifact('03-adjudicated.json', { ...metadata, model: reviewModel, segments: adjudicated });

const editorial = await generateStructured(`You are the senior editorial director of a premium Algerian construction company. Rewrite these approved semantic translations into natural, idiomatic ${languageName}. Never translate word-for-word. Keep all facts, measurements, project names, acronyms and meaning. Avoid generic AI marketing language, startup language, repetition and invented claims. Respect each field's UI role and remain concise. Return exactly [{"id":"...","text":"..."}].\n${editorialBrief}\n${JSON.stringify(segments.map((item, index) => ({ id: item.path, source: item.source, translation: adjudicated[index].text })))}`, segments)
  .catch(() => adjudicated);
await writeArtifact('04-editorial.json', { ...metadata, model: reviewModel, segments: editorial });

// Deterministic terminology/fact gate. This runs before proofreading so a polished
// sentence cannot hide a changed acronym, number, measurement, or project fact.
const terminologyIssues = [];
const projectSlug = pageId.startsWith('projects/') ? pageId.slice('projects/'.length) : null;
const requiredProjectFact = projectSlug ? PROJECT_OVERRIDES[projectSlug]?.requiredFacts?.[target] : null;
if (requiredProjectFact && !editorial.some((item) => item.text.includes(requiredProjectFact))) {
  terminologyIssues.push({ id: 'content', severity: 'blocker', type: 'project-override', message: `Required project fact is missing: ${requiredProjectFact}` });
}
const sourceNumbers = (text) => String(text).match(/\b\d+(?:[.,]\d+)?(?:\s*[/+x-]\s*\d+(?:[.,]\d+)?)?\b/gu) || [];
for (const [index, item] of segments.entries()) {
  const candidate = editorial[index]?.text || '';
  const terms = (protectedTerms.terms || []).filter((term) => item.source.includes(term.source));
  for (const term of terms) {
    const expected = term[target] || term.source;
    if (expected && !candidate.includes(expected)) terminologyIssues.push({ id: item.path, severity: 'blocker', type: 'protected-term', message: `Missing protected term: ${expected}` });
  }
  for (const number of sourceNumbers(item.source)) {
    if (!candidate.includes(number.replace(/\s+/gu, ''))) {
      const compactCandidate = candidate.replace(/\s+/gu, '');
      if (!compactCandidate.includes(number.replace(/\s+/gu, ''))) terminologyIssues.push({ id: item.path, severity: 'blocker', type: 'fact', message: `Source number not preserved: ${number}` });
    }
  }
}
await writeArtifact('05-terminology-review.json', { ...metadata, status: terminologyIssues.length ? 'review' : 'pass', issues: terminologyIssues });

const proofread = await generateStructured(`You are a meticulous ${languageName} proofreader. Correct only spelling, punctuation, typography, accents, apostrophes, capitalization and locale conventions. Do not change meaning or style. Return exactly [{"id":"...","text":"..."}].\n${editorialBrief}\n${JSON.stringify(editorial)}`, segments)
  .catch(() => editorial);
await writeArtifact('06-proofread.json', { ...metadata, model: reviewModel, segments: proofread });

let qa;
try {
  qa = await generate(`You are a translation QA reviewer. Review these fields as a native ${languageName} reader and construction professional. Do not rewrite. Report translationese, awkward phrasing, terminology inconsistencies, changed facts/numbers, punctuation problems and AI-sounding language. Return {"status":"pass"|"review","issues":[{"id":"...","severity":"blocker"|"warning","message":"..."}]}.\n${editorialBrief}\n${JSON.stringify(proofread)}`);
} catch (error) {
  qa = { status: 'review', issues: [{ id: 'page', severity: 'warning', message: `QA model did not return a valid report: ${String(error?.message || error)}` }] };
}
await writeArtifact('07-qa-report.json', { ...metadata, model: reviewModel, ...qa });

const targetDocument = clone(source);
targetDocument.locale = target;
targetDocument.status = qa.status === 'pass' ? 'review' : 'review';
targetDocument.sourceRevision = source.sourceRevision;
for (const item of proofread) setAtPath(targetDocument, item.id, item.text);
targetDocument.revision = `v1-${documentRevision(targetDocument)}`;
await writeArtifact('05-candidate.json', targetDocument);
process.stdout.write(JSON.stringify({ ...metadata, status: 'review', qa: qa.status, artifactRoot: path.relative(ROOT_DIR, artifactRoot), fields: segments.length }) + '\n');
