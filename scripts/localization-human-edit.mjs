import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
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
  validateDocument,
  writeJsonAtomic,
} from './localization-content.mjs';
import { runTargetGates } from './localization-gates.mjs';
import { PROJECT_OVERRIDES, RULES_VERSION, buildEditorialBrief } from './localization-rules.mjs';
import { editorialRuleHashes } from './localization-hashes.mjs';
import { estimateUsage } from './localization-usage.mjs';
import { serializeStageError, stageWithFallback } from './localization-stage.mjs';
import { withTimeout } from './localization-stage.mjs';
import { resolveLocalizationModels } from './localization-models.mjs';

const args = process.argv.slice(2);
const option = (name, fallback = '') => { const index = args.indexOf(name); return index >= 0 ? args[index + 1] : fallback; };
const pageId = String(option('--page')).replace(/^\/+|\/+$/g, '');
const locale = assertLocale(option('--locale'));
const inputFile = option('--file');
const offline = args.includes('--offline');
const proofreadRequested = args.includes('--proofread');
if (!pageId || !TARGET_LOCALES.includes(locale) || !inputFile) throw new Error('Usage: npm run content:human-edit -- --page <page-id> --locale fr|tr|ar-DZ --file <edited-json> [--proofread] [--offline]');

const source = await readDocument({ pageId, locale: 'en' });
if (source.status !== 'approved') throw new Error(`English source is not approved: ${source.status}`);
const edited = JSON.parse(await fs.readFile(path.resolve(inputFile), 'utf8'));
if (edited.sourceRevision && edited.sourceRevision !== source.sourceRevision) throw new Error(`STALE_SOURCE_REVISION: expected ${source.sourceRevision}, received ${edited.sourceRevision}`);

function sameShape(sourceValue, targetValue, currentPath = '') {
  if (sourceValue === null || targetValue === null) return [];
  if (typeof sourceValue === 'string') return typeof targetValue === 'string' ? [] : [currentPath];
  if (Array.isArray(sourceValue)) {
    if (!Array.isArray(targetValue) || sourceValue.length !== targetValue.length) return [currentPath];
    return sourceValue.flatMap((value, index) => sameShape(value, targetValue[index], `${currentPath}[${index}]`));
  }
  if (!sourceValue || typeof sourceValue !== 'object' || !targetValue || typeof targetValue !== 'object' || Array.isArray(targetValue)) return [currentPath];
  return [...Object.keys(sourceValue).filter((key) => !(key in targetValue)).map((key) => `${currentPath}.${key}`), ...Object.keys(sourceValue).flatMap((key) => sameShape(sourceValue[key], targetValue[key], `${currentPath}.${key}`)), ...Object.keys(targetValue).filter((key) => !(key in sourceValue)).map((key) => `${currentPath}.${key} (extra)`)];
}

const shapeIssues = sameShape(source.content, edited.content, 'content');
if (shapeIssues.length) throw new Error(`Human edit failed schema/shape parity: ${shapeIssues.slice(0, 12).join(', ')}`);
const terminology = JSON.parse(await fs.readFile(path.join(ROOT_DIR, 'content', 'terminology', 'protected-terms.json'), 'utf8'));
const fieldContracts = await fs.readFile(path.join(ROOT_DIR, 'content', 'field-contracts.json'), 'utf8').then(JSON.parse).catch(() => null);
const facts = pageId.startsWith('projects/') ? await fs.readFile(path.join(ROOT_DIR, 'content', 'pages', pageId, 'facts.json'), 'utf8').then(JSON.parse).catch(() => null) : null;
const sourceSegments = [...flattenStrings(source.seo, 'seo'), ...flattenStrings(source.content, 'content')].filter(({ source: text }) => text.trim());
const jobId = `human-${Date.now().toString(36)}-${locale}`;
const artifactRoot = path.join(ROOT_DIR, 'artifacts', 'localization', jobId, pageId, locale);
await fs.mkdir(artifactRoot, { recursive: true });
const metadata = { schemaVersion: 1, jobId, pageId, locale, origin: 'human-edit', sourceRevision: source.sourceRevision, generatedAt: new Date().toISOString(), rulesVersion: RULES_VERSION, ...(await editorialRuleHashes(locale)) };
const writeArtifact = (name, value) => writeJsonAtomic(path.join(artifactRoot, name), value);
await writeArtifact('00-source.json', { ...metadata, sourceSegments });
await writeArtifact('00-usage-estimate.json', { ...metadata, ...estimateUsage({ segments: sourceSegments, stages: ['human-edit', 'deterministic-gates', 'blind-qa'], geminiRequests: proofreadRequested || !offline ? 2 : 0, models: [process.env.GEMINI_LOCALIZATION_QA_MODEL, process.env.GEMINI_LOCALIZATION_PROOFREAD_MODEL] }) });

const candidate = clone(edited);
candidate.schemaVersion = 1;
candidate.pageId = pageId;
candidate.locale = locale;
candidate.sourceLocale = 'en';
candidate.sourceRevision = source.sourceRevision;
candidate.status = 'review';
for (const key of ['origin', 'jobId', 'generatedAt', 'rulesVersion', 'fieldContractsHash', 'styleGuideHash', 'exemplarsHash', 'terminologyHash']) delete candidate[key];
candidate.revision = `v1-${documentRevision(candidate)}`;
validateDocument(candidate, { expectedPageId: pageId, expectedLocale: locale });

function gatesFor(value) {
  const candidateSegments = [...flattenStrings(value.seo, 'seo'), ...flattenStrings(value.content, 'content')].filter(({ source: text }) => text.trim()).map((item) => ({ path: item.path, text: item.source }));
  return runTargetGates({ pageId, locale, sourceDoc: source, targetDoc: value, sourceSegments, candidateSegments, facts, terminology, fieldContracts, projectOverrides: PROJECT_OVERRIDES });
}

let finalCandidate = candidate;
let gateReport = gatesFor(finalCandidate);
await writeArtifact('05-terminology-review.json', { ...metadata, status: gateReport.status, fallback: false, error: null, issues: gateReport.issues, blockers: gateReport.blockers, warnings: gateReport.warnings });

let proofreadStage = { value: finalCandidate, fallback: false, error: null };
if (proofreadRequested) {
  if (offline) {
    proofreadStage = { value: finalCandidate, fallback: true, error: { message: 'Proofreading was requested in offline mode.', code: 'OFFLINE' } };
  } else {
    const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(ROOT_DIR, '.secrets', 'gcp', 'translation-service-account.json');
    const credential = JSON.parse(await fs.readFile(credentials, 'utf8'));
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credentials;
      const ai = new GoogleGenAI({ vertexai: true, project: credential.project_id, location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1', apiVersion: 'v1' });
    const { proofreadModel: model } = resolveLocalizationModels();
    const segments = [...flattenStrings(finalCandidate.seo, 'seo'), ...flattenStrings(finalCandidate.content, 'content')].filter(({ source: text }) => text.trim());
    const stage = await stageWithFallback('06-proofread', async () => {
      const response = await withTimeout(() => ai.models.generateContent({ model, contents: `Proofread only spelling, punctuation, accents, apostrophes, capitalization and whitespace in this ${locale} JSON field list. Return exactly [{"id":"...","text":"..."}]. Do not change meaning, facts, order or schema.\n${JSON.stringify(segments.map((item) => ({ id: item.path, text: item.source })))}`, config: { temperature: 0, responseMimeType: 'application/json' } }), { stageName: `human-edit-proofread-${model}` });
      const parsed = JSON.parse(String(response.text).replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim());
      if (!Array.isArray(parsed) || parsed.length !== segments.length) throw new Error('Proofreader returned an invalid field set.');
      const next = clone(finalCandidate);
      for (const item of parsed) { if (!segments.some((segment) => segment.path === item.id) || typeof item.text !== 'string') throw new Error(`Invalid proofread field: ${item?.id}`); setAtPath(next, item.id, item.text); }
      next.revision = `v1-${documentRevision(next)}`;
      return next;
    }, finalCandidate, { policy: 'warning' });
    proofreadStage = stage;
  }
  finalCandidate = proofreadStage.value;
  gateReport = gatesFor(finalCandidate);
}
await writeArtifact('06-proofread.json', { ...metadata, fallback: proofreadStage.fallback, error: proofreadStage.error, status: gateReport.status, gateReport });

let qaStage;
if (offline) {
  qaStage = { value: { status: 'offline-review-required', issues: [{ code: 'QA_OFFLINE', severity: 'blocker', id: 'page', message: 'Blind QA was intentionally skipped in offline human-edit mode.' }] }, fallback: false, error: null };
} else {
  const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(ROOT_DIR, '.secrets', 'gcp', 'translation-service-account.json');
  try {
    const credential = JSON.parse(await fs.readFile(credentials, 'utf8'));
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credentials;
      const ai = new GoogleGenAI({ vertexai: true, project: credential.project_id, location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1', apiVersion: 'v1' });
    const { qaModel: model } = resolveLocalizationModels();
    qaStage = await stageWithFallback('07-qa', async () => {
      const response = await withTimeout(() => ai.models.generateContent({ model, contents: `Blindly evaluate this ${locale} localization. Do not rewrite. You receive only the approved English source, target candidate, facts and field contracts. Return {"status":"pass"|"review","issues":[{"id":"...","severity":"blocker"|"warning","message":"..."}]}.\nSOURCE:\n${JSON.stringify(source)}\nTARGET:\n${JSON.stringify(finalCandidate)}\nFACTS:\n${JSON.stringify(facts)}\nCONTRACTS:\n${JSON.stringify(fieldContracts)}\nRUBRIC:\n${buildEditorialBrief({ pageId, target: locale, manifest: null, facts, terminology })}`, config: { temperature: 0.1, responseMimeType: 'application/json' } }), { stageName: `human-edit-qa-${model}` });
      const result = JSON.parse(String(response.text).replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim());
      if (!result || !['pass', 'review'].includes(result.status) || !Array.isArray(result.issues)) throw new Error('QA response was invalid.');
      return result;
    }, { status: 'review', issues: [{ code: 'QA_STAGE_FAILED', severity: 'blocker', id: 'page', message: 'Blind QA failed; candidate needs human review.' }] }, { policy: 'warning' });
  } catch (error) {
    qaStage = { value: { status: 'review', issues: [{ code: 'QA_STAGE_CONFIG_FAILED', severity: 'blocker', id: 'page', message: 'QA credentials or configuration failed.' }] }, fallback: true, error: serializeStageError(error) };
  }
}
await writeArtifact('07-qa-report.json', { ...metadata, fallback: qaStage.fallback, error: qaStage.error, status: qaStage.value.status, issues: qaStage.value.issues, gateReport });
await writeArtifact('05-candidate.json', finalCandidate);
process.stdout.write(JSON.stringify({ pageId, locale, jobId, origin: 'human-edit', status: 'review', gateStatus: gateReport.status, qaStatus: qaStage.value.status, artifactRoot: path.relative(ROOT_DIR, artifactRoot) }) + '\n');
