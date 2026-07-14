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
import { buildEditorialBrief, PROJECT_OVERRIDES, RULES_VERSION } from './localization-rules.mjs';
import { runTargetGates } from './localization-gates.mjs';
import { estimateUsage } from './localization-usage.mjs';
import { serializeStageError, stageWithFallback, withTimeout } from './localization-stage.mjs';
import { editorialRuleHashes } from './localization-hashes.mjs';
import { resolveLocalizationModels } from './localization-models.mjs';

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
if (!pageId || !TARGET_LOCALES.includes(target)) throw new Error('Usage: node scripts/localization-pipeline.mjs --page <page-id> --target fr|tr|ar-DZ [--offline]');

const source = await readDocument({ pageId: shared ? 'shared' : pageId, locale: 'en', shared });
const manifest = shared ? null : await fs.readFile(path.join(ROOT_DIR, 'content', 'pages', pageId, 'page.json'), 'utf8').then(JSON.parse).catch(() => null);
const facts = shared || !pageId.startsWith('projects/')
  ? null
  : await fs.readFile(path.join(ROOT_DIR, 'content', 'pages', pageId, 'facts.json'), 'utf8').then(JSON.parse).catch(() => null);
const protectedTerms = JSON.parse(await fs.readFile(path.join(ROOT_DIR, 'content', 'terminology', 'protected-terms.json'), 'utf8'));
const fieldContracts = await fs.readFile(path.join(ROOT_DIR, 'content', 'field-contracts.json'), 'utf8').then(JSON.parse).catch(() => null);
const segments = [...flattenStrings(source.seo, 'seo'), ...flattenStrings(source.content, 'content')].filter(({ source: text }) => text.trim());
const artifactRoot = path.join(ROOT_DIR, 'artifacts', 'localization', jobId, shared ? 'shared' : pageId, target);
await fs.mkdir(artifactRoot, { recursive: true });
const writeArtifact = async (name, value) => {
  const file = path.join(artifactRoot, name);
  await writeJsonAtomic(file, value);
  return file;
};

const { fallbackModel, draftModel, editorialModel, adjudicationModel, qaModel, proofreadModel, claimAuditModel } = resolveLocalizationModels();
const metadata = {
  schemaVersion: 1,
  jobId,
  pageId: shared ? 'shared' : pageId,
  target,
  shared,
  sourceRevision: source.sourceRevision,
  generatedAt: new Date().toISOString(),
  rulesVersion: RULES_VERSION,
  ...(await editorialRuleHashes(target)),
};
const editorialBrief = buildEditorialBrief({ pageId, target, manifest, facts, terminology: protectedTerms });
await writeArtifact('00-source.json', { ...metadata, segments });
const usage = estimateUsage({
  segments,
  cloudRequests: Math.max(1, Math.ceil(segments.reduce((total, item) => total + [...item.source].length, 0) / 18_000)),
  geminiRequests: 5,
  stages: ['cloud-semantic-draft', 'semantic-draft', 'conditional-adjudication', 'native-editorial-rewrite', 'mechanical-proofread', 'blind-qa'],
  models: [draftModel, adjudicationModel, editorialModel, claimAuditModel, proofreadModel, qaModel],
});
usage.maySkipAdjudication = true;
await writeArtifact('00-usage-estimate.json', { ...metadata, ...usage });
process.stdout.write(`[localization] informational usage estimate: ${usage.sourceCharacters} chars, ~${usage.estimatedPromptTokens} prompt tokens, ~${usage.estimatedOutputTokens} output tokens; no execution limit applies.\n`);
await writeArtifact('00-editorial-brief.json', { ...metadata, brief: editorialBrief });
if (offline) {
  await writeArtifact('07-qa-report.json', { ...metadata, status: 'dry-run', fallback: false, error: null, issues: [], note: 'Remote AI stages skipped by --offline/--dry-run.' });
  process.stdout.write(JSON.stringify({ ...metadata, status: 'dry-run', segments: segments.length }) + '\n');
  process.exit(0);
}

const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(ROOT_DIR, '.secrets', 'gcp', 'translation-service-account.json');
let credential;
try {
  credential = JSON.parse(await fs.readFile(credentialsPath, 'utf8'));
  if (!credential.project_id) throw new Error('Google service account is missing project_id.');
  process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
} catch (error) {
  await writeArtifact('00-configuration-error.json', { ...metadata, fallback: true, error: serializeStageError(error), credentialsConfigured: Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS) });
  throw error;
}

function cloudLanguage(locale) { return locale === 'ar-DZ' ? 'ar' : locale; }
async function cloudDraft() {
  const client = new TranslationServiceClient({ keyFilename: credentialsPath });
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
        const [result] = await withTimeout(
          () => client.translateText({
            parent: `projects/${credential.project_id}/locations/${location}`,
            contents: current.map((item) => item.source),
            mimeType: 'text/plain',
            sourceLanguageCode: 'en',
            targetLanguageCode: cloudLanguage(target),
            model: `projects/${credential.project_id}/locations/${location}/models/general/${model}`,
            labels: { system: 'igloo-localization', phase: 'semantic-draft', locale: cloudLanguage(target) },
          }),
          { stageName: `cloud-translation-${model}` },
        );
        response = result;
        break;
      } catch (error) {
        const status = error?.code || error?.status;
        if (attempt === 5 || ![429, 500, 502, 503].includes(Number(status))) throw error;
        const delay = Math.min(60_000, (attempt + 1) * 5_000) + Math.floor(Math.random() * 1_500);
        await new Promise((resolve) => setTimeout(resolve, delay));
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
const aiLocation = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
const ai = new GoogleGenAI({ vertexai: true, project: credential.project_id, location: aiLocation, apiVersion: 'v1' });
const languageName = { fr: 'French', tr: 'Turkish', 'ar-DZ': 'Modern Standard Arabic for Algeria' }[target];
const requiredStageFallbacks = [];

function parseJsonText(text) {
  const clean = String(text || '').replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const start = Math.min(...['[', '{'].map((mark) => { const index = clean.indexOf(mark); return index < 0 ? Number.POSITIVE_INFINITY : index; }));
  if (!Number.isFinite(start)) throw new Error('Gemini response did not contain JSON.');
  return JSON.parse(clean.slice(start));
}
async function generate(prompt, model, temperature = 0.25) {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    try {
      const response = await withTimeout(() => ai.models.generateContent({ model, contents: prompt, config: { temperature, responseMimeType: 'application/json' } }), { stageName: `gemini-${model}` });
      return parseJsonText(response.text);
    } catch (error) {
      if (error?.code === 'REMOTE_TIMEOUT') throw error;
      const status = Number(error?.status || error?.code);
      const malformedJson = error instanceof SyntaxError || /JSON|array|object/i.test(String(error?.message || ''));
      if (attempt === 5 || (!malformedJson && ![429, 500, 502, 503].includes(status))) throw error;
      const delay = Math.min(60_000, (attempt + 1) * 5_000) + Math.floor(Math.random() * 1_500);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error('Vertex retry loop exited unexpectedly.');
}
function assertResults(results, expected, field = 'text') {
  if (!Array.isArray(results)) throw new Error('AI output must be a JSON array.');
  const ids = new Set(expected.map((item) => item.path));
  const seen = new Set();
  const normalized = results.map((item) => {
    if (!item || !ids.has(item.id) || seen.has(item.id) || typeof item[field] !== 'string' || !item[field].trim()) throw new Error(`Invalid AI result for ${item?.id || 'unknown field'}.`);
    seen.add(item.id);
    return { id: item.id, [field]: item[field].trim() };
  });
  if (seen.size !== ids.size) throw new Error('AI omitted one or more source fields.');
  return normalized;
}
async function generateStructured(prompt, expected, model, temperature = 0.25) {
  let lastError;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try { return assertResults(await generate(prompt, model, temperature), expected); }
    catch (error) {
      lastError = error;
      if (error?.code === 'REMOTE_TIMEOUT') throw error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, Math.min(30_000, (attempt + 1) * 3_000)));
    }
  }
  throw lastError;
}

async function generateStructuredChunks(promptForChunk, expected, model, temperature = 0.25) {
  const chunkSize = Math.max(8, Number(process.env.LOCALIZATION_REMOTE_FIELD_CHUNK_SIZE || 24));
  const chunks = [];
  for (let start = 0; start < expected.length; start += chunkSize) chunks.push({ start, fields: expected.slice(start, start + chunkSize) });
  const results = Array(chunks.length);
  const concurrency = Math.max(1, Math.min(2, Number(process.env.LOCALIZATION_REMOTE_CHUNK_CONCURRENCY || 2)));
  let cursor = 0;
  async function worker() {
    while (cursor < chunks.length) {
      const index = cursor++;
      const chunk = chunks[index];
      results[index] = await generateStructured(promptForChunk(chunk.fields, chunk.start), chunk.fields, model, temperature);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, chunks.length) }, () => worker()));
  return results.flat();
}

async function writeRequiredStage(name, execute, model, prompt, fallbackValue = []) {
  try {
    const stage = await stageWithFallback(name, execute, fallbackValue, { policy: 'warning' });
    await writeArtifact(`${name}.json`, { ...metadata, model, fallback: stage.fallback, error: stage.error, segments: stage.value });
    if (stage.fallback) requiredStageFallbacks.push({ stage: name, error: stage.error });
    return stage.value;
  } catch (error) {
    await writeArtifact(`${name}.json`, { ...metadata, model, fallback: true, error: error.stageRecord?.error || serializeStageError(error), segments: [] });
    throw error;
  }
}

const cloudStage = await stageWithFallback('01-semantic-a', cloudDraft, [], { policy: 'warning' });
const cloud = cloudStage.value;
if (cloudStage.fallback) requiredStageFallbacks.push({ stage: '01-semantic-a', error: cloudStage.error });
await writeArtifact('01-semantic-a.json', { ...metadata, provider: 'google-cloud-translation', fallback: cloudStage.fallback, error: cloudStage.error, segments: cloud });

const sourceForAIById = new Map(sourceForAI.map((item) => [item.id, item]));
const semanticBPrompt = (chunk) => `Write a meaning-preserving semantic draft in ${languageName}. Treat this as a scaffold for a native editor, not as final prose. Do not preserve English sentence order if it is unnatural. Preserve every fact, number, acronym, proper name and placeholder. Return exactly [{"id":"...","text":"..."}] for this field chunk.\n${editorialBrief}\n${JSON.stringify(chunk.map((item) => sourceForAIById.get(item.path)))}`;
const semanticBFallback = cloud.length === segments.length
  ? cloud.map((item) => ({ id: item.path, text: item.draft }))
  : segments.map((item) => ({ id: item.path, text: item.source }));
let semanticB;
try {
  const stage = await stageWithFallback('02-semantic-b', () => generateStructuredChunks(semanticBPrompt, segments, draftModel, 0.2), semanticBFallback, { policy: 'warning' });
  semanticB = stage.value;
  if (stage.fallback) requiredStageFallbacks.push({ stage: '02-semantic-b', error: stage.error });
  await writeArtifact('02-semantic-b.json', { ...metadata, model: draftModel, fallback: stage.fallback, error: stage.error, segments: semanticB });
} catch (error) {
  await writeArtifact('02-semantic-b.json', { ...metadata, model: draftModel, fallback: true, error: error.stageRecord?.error || serializeStageError(error), segments: [] });
  throw error;
}

function similarity(left, right) {
  const a = new Set(String(left || '').toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) || []);
  const b = new Set(String(right || '').toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) || []);
  if (!a.size && !b.size) return 1;
  let intersection = 0;
  for (const value of a) if (b.has(value)) intersection += 1;
  return intersection / new Set([...a, ...b]).size;
}
const adjudicationThreshold = Math.min(1, Math.max(0, Number(process.env.LOCALIZATION_ADJUDICATION_THRESHOLD || '0.75')));
const scores = cloud.length === segments.length ? segments.map((_, index) => similarity(cloud[index].draft, semanticB[index].text)) : [];
const averageSimilarity = scores.length ? scores.reduce((sum, value) => sum + value, 0) / scores.length : null;
let adjudicated;
if (!cloud.length || (averageSimilarity !== null && averageSimilarity >= adjudicationThreshold)) {
  adjudicated = semanticB;
  await writeArtifact('03-adjudicated.json', { ...metadata, model: adjudicationModel, fallback: false, error: null, skipped: true, threshold: adjudicationThreshold, averageSimilarity, segments: adjudicated });
} else {
  const cloudById = new Map(cloud.map((item) => [item.path, item.draft]));
  const semanticById = new Map(semanticB.map((item) => [item.id, item.text]));
  const adjudicationPrompt = (chunk) => `You are a senior adjudicator for ${languageName}. Compare draft A and draft B only to resolve substantive meaning differences. Do not average them into compromise prose and do not stylistically polish. Return exactly [{"id":"...","text":"..."}] for this field chunk.\n${editorialBrief}\n${JSON.stringify(chunk.map((item) => ({ id: item.path, source: item.source, a: cloudById.get(item.path), b: semanticById.get(item.path) })))}`;
  adjudicated = await writeRequiredStage('03-adjudicated', () => generateStructuredChunks(adjudicationPrompt, segments, adjudicationModel, 0.15), adjudicationModel, 'chunked adjudication', semanticB);
}

const adjudicatedById = new Map(adjudicated.map((item) => [item.id, item.text]));
const editorialPrompt = (chunk) => `You are the native editorial director for an Algerian construction company. Rewrite the semantic scaffold into natural, idiomatic ${languageName}. Write from the approved English meaning; do not translate word by word or preserve English sentence order. Use the draft only as a factual scaffold. Do not invent facts. Match the supplied field contracts and exemplar voice without copying content. Preserve the JSON field schema. Return exactly [{"id":"...","text":"..."}] for this field chunk.\n${editorialBrief}\nFACTS:\n${JSON.stringify(facts)}\nFIELD CONTRACTS:\n${JSON.stringify(fieldContracts)}\n${JSON.stringify(chunk.map((item) => ({ id: item.path, source: item.source, scaffold: adjudicatedById.get(item.path) })))}`;
let editorialSegments = await writeRequiredStage('04-editorial', () => generateStructuredChunks(editorialPrompt, segments, editorialModel, 0.6), editorialModel, 'chunked native editorial rewrite', adjudicated);

function candidateFromSegments(values) {
  const candidate = clone(source);
  candidate.locale = target;
  candidate.status = 'review';
  candidate.sourceRevision = source.sourceRevision;
  for (const item of values) setAtPath(candidate, item.id || item.path, item.text);
  candidate.revision = `v1-${documentRevision(candidate)}`;
  return candidate;
}
function gatesFor(values) {
  const candidate = candidateFromSegments(values);
  return runTargetGates({
    pageId,
    locale: target,
    sourceDoc: source,
    targetDoc: candidate,
    sourceSegments: segments,
    candidateSegments: values.map((item) => ({ path: item.id || item.path, text: item.text })),
    facts,
    terminology: protectedTerms,
    fieldContracts,
    projectOverrides: PROJECT_OVERRIDES,
  });
}

function attachRequiredStageFallbacks(report) {
  for (const fallback of requiredStageFallbacks) {
    report.issues.push({
      code: 'LOCALIZATION_STAGE_FALLBACK',
      severity: 'blocker',
      path: 'page',
      id: 'page',
      type: 'fallback',
      sourceText: '',
      targetText: '',
      message: `${fallback.stage} retained a fallback scaffold; human review is required.`,
      stage: fallback.stage,
      error: fallback.error,
    });
  }
  report.blockers = report.issues.filter((item) => item.severity === 'blocker');
  report.warnings = report.issues.filter((item) => item.severity === 'warning');
  report.status = report.blockers.length ? 'review' : 'pass';
  report.counts = { blockers: report.blockers.length, warnings: report.warnings.length };
  return report;
}

function refreshGateReport(report) {
  report.blockers = report.issues.filter((item) => item.severity === 'blocker');
  report.warnings = report.issues.filter((item) => item.severity === 'warning');
  report.status = report.blockers.length ? 'review' : 'pass';
  report.counts = { blockers: report.blockers.length, warnings: report.warnings.length };
  return report;
}

let editorialGates = attachRequiredStageFallbacks(gatesFor(editorialSegments));
let revisionPasses = 0;
let revisionRecord = null;
if (editorialGates.blockers.length) {
  const affected = editorialGates.blockers.map((item) => item.path).filter(Boolean);
  const revisionPrompt = `Perform exactly one targeted revision pass in ${languageName}. Change only the listed paths and preserve every unrelated segment byte-for-byte. Resolve the deterministic gate issues without adding facts. Return all fields with their existing ids.\nISSUES:\n${JSON.stringify(editorialGates.blockers)}\nAFFECTED PATHS:\n${JSON.stringify(affected)}\nCURRENT CANDIDATE:\n${JSON.stringify(editorialSegments)}`;
  const revisionStage = await stageWithFallback('04-editorial-revision', () => generateStructured(revisionPrompt, segments, editorialModel, 0.35), editorialSegments, { policy: 'warning' });
  revisionRecord = { fallback: revisionStage.fallback, error: revisionStage.error };
  editorialSegments = revisionStage.value;
  revisionPasses = 1;
  editorialGates = attachRequiredStageFallbacks(gatesFor(editorialSegments));
  if (revisionStage.fallback) {
    editorialGates.issues.push({ code: 'EDITORIAL_REVISION_FALLBACK', severity: 'blocker', path: 'page', id: 'page', type: 'fallback', sourceText: '', targetText: '', message: 'Targeted editorial revision failed and the prior candidate was retained.' });
    refreshGateReport(editorialGates);
  }
  await writeArtifact('04-editorial-revision.json', { ...metadata, model: editorialModel, ...revisionRecord, revisionPasses, issues: editorialGates.issues, segments: editorialSegments });
}
await writeArtifact('05-terminology-review.json', { ...metadata, fallback: false, error: null, status: editorialGates.blockers.length ? 'review' : 'pass', issues: editorialGates.issues, blockers: editorialGates.blockers, warnings: editorialGates.warnings, revisionPasses });

async function proofread(values) {
  const valuesById = new Map(values.map((item) => [item.id || item.path, item.text]));
  const prompt = (chunk) => `You are a meticulous ${languageName} mechanical proofreader. Change only spelling, punctuation, accents, apostrophes, capitalization, whitespace and locale typography. Do not reorder information, change facts, rewrite voice, add or remove content, or change JSON shape. Return exactly [{"id":"...","text":"..."}] for this field chunk.\n${editorialBrief}\n${JSON.stringify(chunk.map((item) => ({ id: item.path, text: valuesById.get(item.path) })))}`;
  return stageWithFallback('06-proofread', () => generateStructuredChunks(prompt, segments, proofreadModel, 0.05), values, { policy: 'warning' });
}

let proofreadStage = await proofread(editorialSegments);
let finalSegments = proofreadStage.value;
let finalGates = attachRequiredStageFallbacks(gatesFor(finalSegments));
await writeArtifact('06-proofread.json', { ...metadata, model: proofreadModel, fallback: proofreadStage.fallback, error: proofreadStage.error, status: finalGates.status, gateReport: finalGates, segments: finalSegments });

function normalizeQa(value) {
  if (!value || typeof value !== 'object' || !['pass', 'review'].includes(value.status) || !Array.isArray(value.issues)) throw new Error('QA response must contain status and issues.');
  return { status: value.status, issues: value.issues };
}
async function blindQa(values) {
  const prompt = `Evaluate this ${languageName} localization as a blind QA reviewer. Do not rewrite it. You receive only the approved English source, the target candidate, facts, field contracts and the locale rubric. Evaluate translationese, copied English syntax, generic AI marketing language, terminology, changed facts and numbers, field-purpose violations, FAQ usefulness, naturalness, punctuation and typography. Return exactly {"status":"pass"|"review","issues":[{"id":"...","severity":"blocker"|"warning","message":"..."}]}.\nAPPROVED ENGLISH SOURCE:\n${JSON.stringify(source)}\nTARGET CANDIDATE:\n${JSON.stringify(candidateFromSegments(values))}\nFACTS:\n${JSON.stringify(facts)}\nFIELD CONTRACTS:\n${JSON.stringify(fieldContracts)}\nLOCALE RUBRIC:\n${editorialBrief}`;
  return stageWithFallback('07-qa', async () => normalizeQa(await generate(prompt, qaModel, 0.1)), { status: 'review', issues: [{ id: 'page', severity: 'blocker', code: 'QA_STAGE_FAILED', message: 'Blind QA stage failed; human review is required.' }] }, { policy: 'warning' });
}

let qaStage = await blindQa(finalSegments);
let qa = qaStage.value;
let qaRevision = false;
if (qa.issues.some((item) => item.severity === 'blocker') && revisionPasses < 1) {
  const issuesForRevision = qa.issues.filter((item) => item.severity === 'blocker');
  const revisionPrompt = `Perform the one allowed targeted revision pass in ${languageName}. Change only segments implicated by these QA issues; preserve unrelated segments byte-for-byte. Do not invent facts or rewrite the whole page. Return exactly [{"id":"...","text":"..."}].\nQA ISSUES:\n${JSON.stringify(issuesForRevision)}\nCURRENT CANDIDATE:\n${JSON.stringify(finalSegments)}`;
  const revisionStage = await stageWithFallback('04-editorial-revision', () => generateStructured(revisionPrompt, segments, editorialModel, 0.35), finalSegments, { policy: 'warning' });
  qaRevision = true;
  revisionPasses = 1;
  finalSegments = revisionStage.value;
  finalGates = attachRequiredStageFallbacks(gatesFor(finalSegments));
  proofreadStage = await proofread(finalSegments);
  finalSegments = proofreadStage.value;
  finalGates = attachRequiredStageFallbacks(gatesFor(finalSegments));
  qaStage = await blindQa(finalSegments);
  qa = qaStage.value;
  await writeArtifact('04-editorial-revision.json', { ...metadata, model: editorialModel, fallback: revisionStage.fallback, error: revisionStage.error, revisionPasses, qaRevision, issues: [...issuesForRevision, ...finalGates.issues], segments: finalSegments });
  await writeArtifact('06-proofread.json', { ...metadata, model: proofreadModel, fallback: proofreadStage.fallback, error: proofreadStage.error, status: finalGates.status, gateReport: finalGates, segments: finalSegments });
}
if (qaStage.fallback) {
  finalGates.issues.push({ code: 'QA_STAGE_FALLBACK', severity: 'blocker', path: 'page', id: 'page', type: 'fallback', sourceText: '', targetText: '', message: 'Blind QA failed and the candidate cannot be normally approved.' });
  refreshGateReport(finalGates);
}
await writeArtifact('07-qa-report.json', { ...metadata, model: qaModel, fallback: qaStage.fallback, error: qaStage.error, status: qa.status, issues: qa.issues, revisionPasses, qaRevision, gateReport: finalGates });

const targetDocument = candidateFromSegments(finalSegments);
targetDocument.status = 'review';
await writeArtifact('05-candidate.json', targetDocument);
process.stdout.write(JSON.stringify({ ...metadata, status: 'review', qa: qa.status, gateStatus: finalGates.status, gateBlockers: finalGates.blockers.length, artifactRoot: path.relative(ROOT_DIR, artifactRoot), fields: segments.length, revisionPasses }) + '\n');
