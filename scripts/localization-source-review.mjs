import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { GoogleGenAI } from '@google/genai';
import {
  ROOT_DIR,
  clone,
  flattenStrings,
  readDocument,
  setAtPath,
  documentRevision,
  writeJsonAtomic,
} from './localization-content.mjs';
import { buildEditorialBrief, EN_SOURCE_EDITOR_MANDATE, sourceCandidateQualityIssues, sourceQualityIssues } from './localization-rules.mjs';
import { editorialRuleHashes } from './localization-hashes.mjs';
import { auditClaimSupport } from './localization-claim-audit.mjs';
import { withTimeout } from './localization-stage.mjs';
import { resolveLocalizationModels } from './localization-models.mjs';

const args = process.argv.slice(2);
const option = (name, fallback = '') => { const index = args.indexOf(name); return index >= 0 ? args[index + 1] : fallback; };
const pageId = String(option('--page')).replace(/^\/+|\/+$/g, '');
const shared = args.includes('--shared');
const dryRun = args.includes('--dry-run') || args.includes('--offline');
if (!pageId) throw new Error('Usage: node scripts/localization-source-review.mjs --page <page-id> [--shared] [--dry-run]');

const source = await readDocument({ pageId: shared ? 'shared' : pageId, locale: 'en', shared });
const segments = [...flattenStrings(source.seo, 'seo'), ...flattenStrings(source.content, 'content')].filter(({ source: text }) => text.trim());
const manifest = shared ? null : await fs.readFile(path.join(ROOT_DIR, 'content', 'pages', pageId, 'page.json'), 'utf8').then(JSON.parse).catch(() => null);
const facts = shared || !pageId.startsWith('projects/') ? null : await fs.readFile(path.join(ROOT_DIR, 'content', 'pages', pageId, 'facts.json'), 'utf8').then(JSON.parse).catch(() => null);
const terminology = JSON.parse(await fs.readFile(path.join(ROOT_DIR, 'content', 'terminology', 'protected-terms.json'), 'utf8'));
const jobId = option('--job-id', `${Date.now().toString(36)}-source`);
const artifactRoot = path.join(ROOT_DIR, 'artifacts', 'localization', jobId, shared ? 'shared' : pageId, 'en-source');
await fs.mkdir(artifactRoot, { recursive: true });
const metadata = { jobId, pageId: shared ? 'shared' : pageId, locale: 'en', sourceRevision: source.sourceRevision, generatedAt: new Date().toISOString(), ...(await editorialRuleHashes('en')) };
const brief = buildEditorialBrief({ pageId, target: 'en', manifest, facts, terminology });
await writeJsonAtomic(path.join(artifactRoot, '00-source-review.json'), { ...metadata, status: 'review', issues: sourceQualityIssues(segments), brief });
if (dryRun) {
  process.stdout.write(JSON.stringify({ ...metadata, status: 'dry-run', fields: segments.length }) + '\n');
  process.exit(0);
}

const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(ROOT_DIR, '.secrets', 'gcp', 'translation-service-account.json');
const credential = JSON.parse(await fs.readFile(credentialsPath, 'utf8'));
process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
const ai = new GoogleGenAI({ vertexai: true, project: credential.project_id, location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1', apiVersion: 'v1' });
const { sourceModel: model } = resolveLocalizationModels();
async function generateSource(prompt, config) {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    try {
      return await withTimeout(() => ai.models.generateContent({ model, contents: prompt, config }), { stageName: `source-editor-${model}` });
    } catch (error) {
      if (attempt === 5 || ![429, 500, 502, 503].includes(error?.status)) throw error;
      const baseDelay = Math.min(60_000, (attempt + 1) * 5_000);
      const jitter = Math.floor(Math.random() * 1_500);
      await new Promise((resolve) => setTimeout(resolve, baseDelay + jitter));
    }
  }
  throw new Error('Source editor retry loop exited unexpectedly.');
}
const ids = new Set(segments.map((item) => item.path));
const normalizePath = (value) => String(value || '').replace(/\[(\d+)\]/g, '.$1');
const sourceFields = JSON.stringify(segments.map((item) => ({ id: item.path, source: item.source })));
let result;
let lastResponse = '';
let validationHint = '';
for (let attempt = 1; attempt <= 2; attempt += 1) {
  const response = await generateSource(`${EN_SOURCE_EDITOR_MANDATE}\n\nThere are exactly ${segments.length} fields. Return ONLY a JSON array with exactly ${segments.length} objects, each shaped {"id":"existing.field.path","text":"revised English"}; do not wrap it in another object and do not omit any id. The top-level SEO ids (seo.title, seo.description, seo.socialTitle, seo.socialDescription) are mandatory even when content.seo also exists; preserve every id exactly once.\n\n${validationHint}\n\n${brief}\n\n${sourceFields}`, { temperature: attempt === 1 ? 0.15 : 0, responseMimeType: 'application/json', maxOutputTokens: 32768 });
  lastResponse = String(response.text || '');
  const clean = lastResponse.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const start = Math.min(...['[', '{'].map((mark) => { const index = clean.indexOf(mark); return index < 0 ? Number.POSITIVE_INFINITY : index; }));
  try {
    const parsed = JSON.parse(clean.slice(start));
    const candidateResult = Array.isArray(parsed) ? parsed : parsed?.fields;
    const normalizedResult = Array.isArray(candidateResult) ? candidateResult.map((item) => ({ ...item, id: normalizePath(item?.id) })) : candidateResult;
    const returnedIds = new Set(Array.isArray(normalizedResult) ? normalizedResult.map((item) => item?.id) : []);
    const missingIds = segments.map((item) => item.path).filter((id) => !returnedIds.has(id));
    const extraIds = Array.isArray(normalizedResult) ? normalizedResult.map((item) => item?.id).filter((id) => !ids.has(id)) : [];
    const invalidItems = Array.isArray(normalizedResult) ? normalizedResult.filter((item) => !ids.has(item?.id) || typeof item?.text !== 'string' || !item.text.trim()).length : 0;
    if (Array.isArray(normalizedResult) && normalizedResult.length === segments.length && missingIds.length === 0 && extraIds.length === 0 && invalidItems === 0) {
      result = normalizedResult;
      break;
    }
    validationHint = `The previous response was invalid. Missing ids: ${missingIds.join(', ') || '(none)'}. Extra/invalid ids: ${extraIds.concat([invalidItems ? `${invalidItems} invalid item(s)` : '']).filter(Boolean).join(', ') || '(none)'}. Return the complete field set again.`;
  } catch (error) {
    validationHint = `The previous response was not valid JSON (${String(error?.message || error)}). Return the complete field set as JSON only.`;
  }
}
if (!result) {
  await writeJsonAtomic(path.join(artifactRoot, '01-source-edit-raw-response.json'), { ...metadata, model, response: lastResponse });
  throw new Error('Source editor returned an invalid field set after two attempts. Raw response was saved as an artifact.');
}
const candidate = clone(source);
for (const item of result) setAtPath(candidate, item.id, item.text.trim());
candidate.status = 'review';
candidate.revision = documentRevision(candidate);
const candidateSegments = [...flattenStrings(candidate.seo, 'seo'), ...flattenStrings(candidate.content, 'content')].filter(({ source: text }) => text.trim());
const claimAudit = auditClaimSupport({ candidate, facts, fieldContracts: await fs.readFile(path.join(ROOT_DIR, 'content', 'field-contracts.json'), 'utf8').then(JSON.parse).catch(() => null) });
const candidateIssues = [...sourceCandidateQualityIssues(segments, candidateSegments), ...claimAudit.issues];
await writeJsonAtomic(path.join(artifactRoot, '03-claim-support-audit.json'), { ...metadata, blind: true, inputs: ['candidate', 'facts', 'fieldContracts'], status: claimAudit.status, records: claimAudit.records, issues: claimAudit.issues });
await writeJsonAtomic(path.join(artifactRoot, '02-source-quality.json'), { ...metadata, status: candidateIssues.length ? 'review' : 'pass', issues: candidateIssues, claimAuditStatus: claimAudit.status, note: 'Human review is required for any semantic enrichment flagged here.' });
await writeJsonAtomic(path.join(artifactRoot, '01-source-edit-candidate.json'), { ...metadata, ...candidate, sourceRevision: source.revision, model });
process.stdout.write(JSON.stringify({ ...metadata, status: 'review', artifactRoot: path.relative(ROOT_DIR, artifactRoot), fields: result.length, qualityIssues: candidateIssues.length }) + '\n');
