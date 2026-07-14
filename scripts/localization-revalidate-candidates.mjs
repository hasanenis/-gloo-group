import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { GoogleGenAI } from '@google/genai';
import {
  ROOT_DIR,
  clone,
  documentRevision,
  flattenStrings,
  readDocument,
  setAtPath,
  validateDocument,
  writeJsonAtomic,
} from './localization-content.mjs';
import { buildEditorialBrief, PROJECT_OVERRIDES } from './localization-rules.mjs';
import { auditClaimSupport } from './localization-claim-audit.mjs';
import { runTargetGates } from './localization-gates.mjs';
import { editorialRuleHashes, compareEditorialRuleHashes } from './localization-hashes.mjs';
import { resolveLocalizationModels } from './localization-models.mjs';
import { withTimeout } from './localization-stage.mjs';

const args = process.argv.slice(2);
const has = (name) => args.includes(name);
const option = (name, fallback = '') => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
};
const pageFilter = String(option('--page')).replace(/^\/+|\/+$/gu, '');
const localeFilter = String(option('--locale')).trim();
const remoteQa = has('--remote-qa');
const targetedRevision = has('--targeted-revision');
const outputFile = path.resolve(option('--output', path.join(ROOT_DIR, 'artifacts', 'localization', 'candidate-revalidation-report.json')));

async function readJson(file, fallback = null) {
  try { return JSON.parse(await fs.readFile(file, 'utf8')); } catch { return fallback; }
}

async function findCandidates(directory, result = []) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true }).catch(() => [])) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await findCandidates(file, result);
    else if (entry.isFile() && entry.name === '05-candidate.json') result.push(file);
  }
  return result;
}

function sourceSegments(document) {
  return [...flattenStrings(document.seo, 'seo'), ...flattenStrings(document.content, 'content')]
    .filter(({ source }) => String(source || '').trim());
}

function candidateSegments(document) {
  return sourceSegments(document).map(({ path: fieldPath, source: text }) => ({ path: fieldPath, text }));
}

function isEditorialPath(fieldPath) {
  return /^(?:seo\.|content\.(?:summary|description|authority|faq\.|images\..*\.(?:caption|alt)))/u.test(String(fieldPath));
}

function normalizeFieldPath(fieldPath) {
  return String(fieldPath || '').replace(/\[(\d+)\]/gu, '.$1');
}

function uniquePaths(issues) {
  return [...new Set(issues.map((item) => normalizeFieldPath(item?.path || item?.id)).filter((value) => value && value !== 'page'))];
}

function issueMessage(issue) {
  return issue?.message || issue?.reason || issue?.code || 'Unspecified issue';
}

function errorMessage(error) {
  return String(error?.message || error || 'Unknown error').replace(/\s+/gu, ' ').slice(0, 240);
}

function parseQa(text) {
  const clean = String(text || '').replace(/^```(?:json)?\s*/iu, '').replace(/\s*```$/u, '').trim();
  const start = clean.indexOf('{');
  const parsed = JSON.parse(start >= 0 ? clean.slice(start) : clean);
  if (!parsed || !['pass', 'review'].includes(parsed.status) || !Array.isArray(parsed.issues)) throw new Error('QA response must contain status and issues.');
  return parsed;
}

async function remoteBlindQa({ source, candidate, facts, fieldContracts, brief, model, pageId, locale }) {
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(ROOT_DIR, '.secrets', 'gcp', 'translation-service-account.json');
  const credential = await readJson(credentialsPath);
  if (!credential?.project_id) throw new Error('Google service-account project_id is missing.');
  process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
  const ai = new GoogleGenAI({ vertexai: true, project: credential.project_id, location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1', apiVersion: 'v1' });
  const response = await withTimeout(() => ai.models.generateContent({
    model,
    contents: `Blindly QA this ${locale} localization for ${pageId}. Do not rewrite it. Flag translationese, contractor-register violations, unsupported claims, changed facts, field-purpose violations, captions that describe intent rather than visible work, and FAQ answers that do not answer their matching question directly. Return exactly {"status":"pass"|"review","issues":[{"id":"...","severity":"blocker"|"warning","message":"..."}]}.
APPROVED ENGLISH SOURCE:
${JSON.stringify(source)}
TARGET CANDIDATE:
${JSON.stringify(candidate)}
FACTS:
${JSON.stringify(facts)}
FIELD CONTRACTS:
${JSON.stringify(fieldContracts)}
EDITORIAL RUBRIC:
${brief}`,
    config: { temperature: 0.1, responseMimeType: 'application/json' },
  }), { stageName: `candidate-revalidation-qa-${model}` });
  return parseQa(response.text);
}

async function remoteTargetedRevision({ record, model }) {
  const { source, candidate, facts, fieldContracts, brief } = record.runtime;
  const availablePaths = new Set(candidateSegments(candidate).map((item) => item.path));
  const paths = [...new Set(record.flaggedPaths.map(normalizeFieldPath))]
    .filter((fieldPath) => fieldPath !== 'page' && availablePaths.has(fieldPath));
  if (!paths.length || record.affectedEditorialRatio > 0.6) return { status: 'skipped', reason: 'no targeted paths or issue ratio exceeds 60%' };
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(ROOT_DIR, '.secrets', 'gcp', 'translation-service-account.json');
  const credential = await readJson(credentialsPath);
  if (!credential?.project_id) throw new Error('Google service-account project_id is missing.');
  process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
  const ai = new GoogleGenAI({ vertexai: true, project: credential.project_id, location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1', apiVersion: 'v1' });
  const sourceFields = sourceSegments(source).filter((item) => paths.includes(item.path));
  const targetFields = candidateSegments(candidate).filter((item) => paths.includes(item.path));
  const response = await withTimeout(() => ai.models.generateContent({
    model,
    contents: `Revise only the flagged ${record.locale} JSON fields for a construction contractor. Return exactly one object per requested id as [{"id":"...","text":"..."}]. Preserve every fact, number, acronym and proper name. Do not rewrite clean fields. Summary must identify the project directly; authority must be concise and factual; captions must describe visible work only; each FAQ answer must answer its matching question in the first clause. Do not use architecture-critic, urban-design or property-developer language.
EDITORIAL RUBRIC:
${brief}
FLAGGED ISSUES:
${JSON.stringify(record.issues.filter((item) => paths.includes(normalizeFieldPath(item.path || item.id))))}
APPROVED SOURCE FIELDS:
${JSON.stringify(sourceFields)}
CURRENT TARGET FIELDS:
${JSON.stringify(targetFields)}`,
    config: { temperature: 0.35, responseMimeType: 'application/json' },
  }), { stageName: `candidate-targeted-revision-${model}` });
  const clean = String(response.text || '').replace(/^```(?:json)?\s*/iu, '').replace(/\s*```$/u, '').trim();
  const start = clean.indexOf('[');
  const end = clean.lastIndexOf(']');
  const parsed = JSON.parse(start >= 0 && end >= start ? clean.slice(start, end + 1) : clean);
  const parsedIds = Array.isArray(parsed) ? parsed.map((item) => normalizeFieldPath(item?.id)) : [];
  if (!Array.isArray(parsed) || parsed.length !== paths.length || new Set(parsedIds).size !== paths.length || parsedIds.some((fieldPath) => !paths.includes(fieldPath)) || parsed.some((item) => typeof item?.text !== 'string' || !item.text.trim())) throw new Error('Targeted revision returned an invalid field set.');
  const revised = clone(candidate);
  for (const [index, item] of parsed.entries()) setAtPath(revised, parsedIds[index], item.text.trim());
  revised.status = 'review';
  revised.revision = `v1-${documentRevision(revised)}`;
  const revisedFields = candidateSegments(revised);
  const liveGates = runTargetGates({
    pageId: record.pageId,
    locale: record.locale,
    sourceDoc: source,
    targetDoc: revised,
    sourceSegments: sourceSegments(source),
    candidateSegments: revisedFields,
    facts,
    terminology: await readJson(path.join(ROOT_DIR, 'content', 'terminology', 'protected-terms.json'), { terms: [] }),
    fieldContracts,
    projectOverrides: PROJECT_OVERRIDES,
  });
  const claimAudit = auditClaimSupport({ candidate: revised, source, facts, fieldContracts });
  const revisionRoot = path.join(ROOT_DIR, 'artifacts', 'localization', 'candidate-revalidation', `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`, record.pageId, record.locale);
  await fs.mkdir(revisionRoot, { recursive: true });
  await writeJsonAtomic(path.join(revisionRoot, '05-candidate.json'), revised);
  await writeJsonAtomic(path.join(revisionRoot, '06-gate-report.json'), { sourceRevision: revised.sourceRevision, model, revisedPaths: paths, gateReport: liveGates, claimAudit });
  return { status: 'written', file: path.relative(ROOT_DIR, path.join(revisionRoot, '05-candidate.json')), revisedPaths: paths, blockers: liveGates.blockers.length + claimAudit.issues.filter((item) => item.severity === 'blocker').length };
}

async function inspectCandidate(file, currentHashes, qaModel) {
  const artifactDir = path.dirname(file);
  const candidate = await readJson(file);
  const metadata = {
    ...(await readJson(path.join(artifactDir, '00-source.json'), {})),
    ...(await readJson(path.join(artifactDir, '00-editorial-brief.json'), {})),
  };
  const pageId = candidate?.pageId || metadata.pageId;
  const locale = candidate?.locale || metadata.target;
  const base = { file: path.relative(ROOT_DIR, file), pageId, locale, artifactDir: path.relative(ROOT_DIR, artifactDir) };
  if (pageFilter && pageId !== pageFilter) return null;
  if (localeFilter && locale !== localeFilter) return null;

  let source;
  let sourceFresh = false;
  let rulesFresh = false;
  let staleRuleKeys = [];
  let structuralError = null;
  let liveGates = { blockers: [], warnings: [], issues: [], counts: { blockers: 0, warnings: 0 } };
  let claimAudit = { issues: [] };
  let sourceSegmentsList = [];
  let editorialBrief = '';
  let facts = null;
  let fieldContracts = null;
  let qa = await readJson(path.join(artifactDir, '07-qa-report.json'), null);

  try {
    const shared = pageId === 'shared';
    source = await readDocument({ pageId: shared ? 'shared' : pageId, locale: 'en', shared });
    sourceFresh = Boolean(candidate?.sourceRevision && candidate.sourceRevision === source.sourceRevision);
    sourceSegmentsList = sourceSegments(source);
    editorialBrief = buildEditorialBrief({ pageId, target: locale, manifest: null, facts: null, terminology: null });
    if (!shared && pageId?.startsWith('projects/')) {
      facts = await readJson(path.join(ROOT_DIR, 'content', 'pages', pageId, 'facts.json'));
    }
    fieldContracts = await readJson(path.join(ROOT_DIR, 'content', 'field-contracts.json'));
    const storedHashes = {
      rulesVersion: metadata.rulesVersion,
      fieldContractsHash: metadata.fieldContractsHash,
      styleGuideHash: metadata.styleGuideHash,
      exemplarsHash: metadata.exemplarsHash,
      terminologyHash: metadata.terminologyHash,
    };
    staleRuleKeys = compareEditorialRuleHashes(currentHashes[locale] || {}, storedHashes);
    rulesFresh = staleRuleKeys.length === 0;
    validateDocument(candidate, { expectedPageId: shared ? 'shared' : pageId, expectedLocale: locale, shared });
    const candidateFields = candidateSegments(candidate);
    liveGates = runTargetGates({
      pageId,
      locale,
      sourceDoc: source,
      targetDoc: candidate,
      sourceSegments: sourceSegmentsList,
      candidateSegments: candidateFields,
      facts,
      terminology: await readJson(path.join(ROOT_DIR, 'content', 'terminology', 'protected-terms.json'), { terms: [] }),
      fieldContracts,
      projectOverrides: PROJECT_OVERRIDES,
    });
    claimAudit = auditClaimSupport({ candidate, source, facts, fieldContracts });
    const briefArtifact = await readJson(path.join(artifactDir, '00-editorial-brief.json'), null);
    editorialBrief = briefArtifact?.brief || editorialBrief;
  } catch (error) {
    structuralError = errorMessage(error);
  }

  let qaStatus = qa?.status || 'missing';
  let qaIssues = Array.isArray(qa?.issues) ? [...qa.issues] : [];
  if (remoteQa && !structuralError && source) {
    try {
      qa = await remoteBlindQa({ source, candidate, facts, fieldContracts, brief: editorialBrief, model: qaModel, pageId, locale });
      qaStatus = `remote-${qa.status}`;
      qaIssues = qa.issues;
    } catch (error) {
      qaStatus = 'remote-error';
      qaIssues = [{ code: 'REMOTE_QA_FAILED', severity: 'blocker', path: 'page', message: errorMessage(error) }];
    }
  }

  const gateIssues = [...(liveGates.issues || []), ...(claimAudit.issues || [])];
  const qaProblems = qaStatus === 'pass' || qaStatus === 'remote-pass' ? qaIssues : [...qaIssues, { code: 'QA_NOT_PASS', severity: 'blocker', path: 'page', message: `QA status is ${qaStatus}.` }];
  const allIssues = [...gateIssues, ...qaProblems];
  const blockers = allIssues.filter((item) => item.severity === 'blocker');
  const flaggedPaths = uniquePaths(allIssues);
  const editorialFlaggedPaths = flaggedPaths.filter((fieldPath) => fieldPath === 'page' || isEditorialPath(fieldPath));
  const editorialFieldCount = sourceSegmentsList.filter(({ path: fieldPath }) => isEditorialPath(fieldPath)).length;
  const affectedRatio = editorialFieldCount ? (editorialFlaggedPaths.includes('page') ? 1 : editorialFlaggedPaths.length / editorialFieldCount) : (blockers.length ? 1 : 0);

  let classification = 'reusable-clean';
  if (structuralError) classification = 'structurally-invalid';
  else if (!sourceFresh) classification = 'stale-source';
  else if (affectedRatio > 0.6) classification = 'regenerate-required';
  else if (!rulesFresh) classification = 'stale-rules';
  else if (blockers.length) classification = 'reusable-with-targeted-revision';

  let recommendedAction = 'reuse candidate after human review';
  if (classification === 'structurally-invalid') recommendedAction = 'regenerate from approved English source';
  else if (classification === 'stale-source') recommendedAction = 'regenerate from current approved English source';
  else if (classification === 'regenerate-required') recommendedAction = 'regenerate editorial fields from approved English source';
  else if (classification === 'stale-rules') recommendedAction = blockers.length ? 'targeted revision with current rules' : 're-run current gates and QA';
  else if (classification === 'reusable-with-targeted-revision') recommendedAction = 'send flagged JSON paths to Pro editorial model';

  return {
    ...base,
    sourceRevision: candidate?.sourceRevision || null,
    currentSourceRevision: source?.sourceRevision || null,
    sourceFresh,
    rulesFresh,
    staleRuleKeys,
    gateBlockers: blockers.length,
    liveGateBlockers: (liveGates.blockers || []).length,
    claimAuditBlockers: (claimAudit.issues || []).filter((item) => item.severity === 'blocker').length,
    qaStatus,
    qaIssueCount: qaIssues.length,
    flaggedPaths,
    affectedEditorialFields: editorialFlaggedPaths.length,
    editorialFieldCount,
    affectedEditorialRatio: Number(affectedRatio.toFixed(3)),
    classification,
    recommendedAction,
    issues: allIssues.map((item) => ({ code: item.code || null, severity: item.severity || 'warning', path: item.path || item.id || null, message: issueMessage(item) })),
    runtime: { source, candidate, facts, fieldContracts, brief: editorialBrief },
  };
}

const currentHashes = {};
for (const locale of ['fr', 'tr', 'ar-DZ']) currentHashes[locale] = await editorialRuleHashes(locale);
const { qaModel } = resolveLocalizationModels();
const files = (await findCandidates(path.join(ROOT_DIR, 'artifacts', 'localization'))).sort();
const candidates = [];
for (const file of files) {
  const result = await inspectCandidate(file, currentHashes, qaModel);
  if (result) candidates.push(result);
}

if (targetedRevision) {
  const { editorialModel } = resolveLocalizationModels();
  for (const candidate of candidates) {
    if (!candidate.sourceFresh || !['stale-rules', 'reusable-with-targeted-revision'].includes(candidate.classification)) continue;
    try {
      candidate.targetedRevision = await remoteTargetedRevision({ record: candidate, model: editorialModel });
    } catch (error) {
      candidate.targetedRevision = { status: 'error', error: errorMessage(error) };
    }
  }
}

const reportCandidates = candidates.map(({ runtime, ...candidate }) => candidate);

const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  mode: remoteQa ? 'remote-qa' : 'dry-run-stored-qa',
  remoteQaModel: remoteQa ? qaModel : null,
  currentRuleHashes: currentHashes,
  candidates: reportCandidates,
  counts: reportCandidates.reduce((out, item) => { out[item.classification] = (out[item.classification] || 0) + 1; return out; }, {}),
};
await writeJsonAtomic(outputFile, report);

console.log('PAGE | LOCALE | SOURCE FRESH | RULES FRESH | GATE BLOCKERS | QA STATUS | RECOMMENDED ACTION');
console.log('-----|--------|--------------|-------------|---------------|-----------|-------------------');
for (const item of reportCandidates) console.log(`${item.pageId} | ${item.locale} | ${item.sourceFresh ? 'yes' : 'no'} | ${item.rulesFresh ? 'yes' : 'no'} | ${item.gateBlockers} | ${item.qaStatus} | ${item.recommendedAction}`);
console.log(`\nRevalidation report: ${path.relative(ROOT_DIR, outputFile)}`);
console.log(`Candidates: ${reportCandidates.length}; classifications: ${JSON.stringify(report.counts)}`);
