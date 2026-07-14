import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ROOT_DIR,
  appendApprovalDecision,
  clone,
  documentPath,
  flattenStrings,
  readDocument,
  writeJsonAtomic,
} from './localization-content.mjs';
import { editorialRuleHashes, compareEditorialRuleHashes } from './localization-hashes.mjs';

const args = process.argv.slice(2);
const option = (name, fallback = '') => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
};
const pageId = String(option('--page')).replace(/^\/+|\/+$/g, '');
const shared = args.includes('--shared');
const dryRun = args.includes('--dry-run');
const force = args.includes('--force');
const forceReason = String(option('--force-reason')).trim();
const jobId = option('--job-id');
if (!pageId || !jobId) throw new Error('Usage: node scripts/localization-source-approve.mjs --page <page-id> --job-id <source-review-job-id> [--shared] [--force --force-reason "<explanation>"]');
if (force && forceReason.length < 8) throw new Error('--force requires --force-reason with a meaningful non-empty explanation (at least 8 characters).');

const source = await readDocument({ pageId: shared ? 'shared' : pageId, locale: 'en', shared });
const artifact = path.join(ROOT_DIR, 'artifacts', 'localization', jobId, shared ? 'shared' : pageId, 'en-source', '01-source-edit-candidate.json');
const candidate = JSON.parse(await fs.readFile(artifact, 'utf8'));
const currentRuleHashes = await editorialRuleHashes('en');
const candidateRuleHashes = {
  rulesVersion: candidate.rulesVersion,
  fieldContractsHash: candidate.fieldContractsHash,
  styleGuideHash: candidate.styleGuideHash,
  exemplarsHash: candidate.exemplarsHash,
  terminologyHash: candidate.terminologyHash,
};
const staleRuleKeys = compareEditorialRuleHashes(currentRuleHashes, candidateRuleHashes);
if (staleRuleKeys.length) throw new Error(`STALE_EDITORIAL_RULES: ${staleRuleKeys.join(', ')}`);
const qualityArtifact = path.join(path.dirname(artifact), '02-source-quality.json');
const quality = await fs.readFile(qualityArtifact, 'utf8').then(JSON.parse).catch(() => ({ issues: [] }));
const blockers = Array.isArray(quality.issues) ? quality.issues.filter((issue) => issue.severity === 'blocker') : [];
if (blockers.length && !force) throw new Error(`Source candidate has ${blockers.length} factual-enrichment blocker(s). Review 02-source-quality.json or pass --force after human review.`);
const sourceFields = [...flattenStrings(source.seo, 'seo'), ...flattenStrings(source.content, 'content')].filter(({ source: text }) => text.trim());
const candidateFields = [...flattenStrings(candidate.seo, 'seo'), ...flattenStrings(candidate.content, 'content')].filter(({ source: text }) => text.trim());
const sourceMap = new Map(sourceFields.map((field) => [field.path, field.source]));
const candidateMap = new Map(candidateFields.map((field) => [field.path, field.source]));
if (sourceMap.size !== candidateMap.size || [...sourceMap.keys()].some((key) => !candidateMap.has(key))) throw new Error('Candidate field tree does not match the live English source.');

const numberTokens = (text) => String(text).match(/\b\d+(?:[+\-/]\d+)*\b/g) || [];
const immutableSuffixes = ['.src'];
const issues = [];
for (const [key, value] of sourceMap) {
  const next = candidateMap.get(key);
  for (const token of numberTokens(value)) if (!next.includes(token)) issues.push(`${key}: missing source number ${token}`);
  if (immutableSuffixes.some((suffix) => key.endsWith(suffix)) && next !== value) issues.push(`${key}: image/source path changed`);
}
if (issues.length) throw new Error(`Source candidate failed factual validation:\n${issues.slice(0, 20).join('\n')}`);

// Keep the legacy FNV revision scheme used by content-migrate.ts so every
// target locale can be compared against the same canonical English hash.
const revision = (value) => {
  const json = JSON.stringify(value);
  let hash = 2166136261;
  for (let index = 0; index < json.length; index += 1) {
    hash ^= json.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `v1-${(hash >>> 0).toString(16).padStart(8, '0')}`;
};
const nextSourceRevision = revision(candidate.content);
const next = clone(candidate);
delete next.jobId;
delete next.generatedAt;
delete next.artifactRoot;
delete next.model;
for (const key of ['rulesVersion', 'fieldContractsHash', 'styleGuideHash', 'exemplarsHash', 'terminologyHash', 'blind', 'inputs', 'origin', 'fallback', 'error']) delete next[key];
next.schemaVersion = 1;
next.pageId = shared ? undefined : pageId;
next.locale = 'en';
next.sourceLocale = 'en';
next.sourceRevision = nextSourceRevision;
next.status = 'approved';
next.updatedAt = new Date().toISOString();
next.revision = revision({ pageId: next.pageId, locale: next.locale, content: next.content, seo: next.seo });
if (shared) delete next.pageId;

if (dryRun) {
  process.stdout.write(JSON.stringify({ pageId: shared ? 'shared' : pageId, sourceRevision: nextSourceRevision, status: 'validated', wouldInvalidateTargets: shared ? [] : ['fr', 'tr', 'ar-DZ'] }) + '\n');
  process.exit(0);
}

await writeJsonAtomic(documentPath({ pageId: shared ? 'shared' : pageId, locale: 'en', shared }), next);
await writeJsonAtomic(path.join(path.dirname(artifact), '08-source-approval.json'), {
  schemaVersion: 1,
  jobId,
  page: shared ? 'shared' : pageId,
  locale: 'en',
  sourceRevision: nextSourceRevision,
  state: force ? 'forced' : 'human',
  forceReason: force ? forceReason : null,
  approvedAt: new Date().toISOString(),
  editorialRules: currentRuleHashes,
});
await appendApprovalDecision({
  approvalTime: new Date().toISOString(),
  pageId: shared ? 'shared' : pageId,
  page: shared ? 'shared' : pageId,
  locale: 'en',
  decision: 'approve',
  sourceRevision: nextSourceRevision,
  targetRevision: null,
  jobId,
  state: force ? 'forced' : 'human',
  forceReason: force ? forceReason : null,
  qaStatus: blockers.length ? 'review-with-force' : 'pass',
  gateBlockers: blockers.length,
  reason: force ? forceReason : 'Human source approval recorded.',
  decidedAt: new Date().toISOString(),
  approver: process.env.LOCALIZATION_APPROVER || null,
  gateCounts: { sourceQualityBlockers: blockers.length },
});

// Existing translations are now explicitly review-only. Their old source
// revision remains visible so the editor can see why they must be regenerated.
if (!shared) {
  for (const locale of ['fr', 'tr', 'ar-DZ']) {
    const file = documentPath({ pageId, locale });
    const target = JSON.parse(await fs.readFile(file, 'utf8'));
    target.status = 'review';
    target.updatedAt = new Date().toISOString();
    await writeJsonAtomic(file, target);
  }
}
process.stdout.write(JSON.stringify({ pageId: shared ? 'shared' : pageId, sourceRevision: nextSourceRevision, status: 'approved', invalidatedTargets: shared ? [] : ['fr', 'tr', 'ar-DZ'] }) + '\n');
