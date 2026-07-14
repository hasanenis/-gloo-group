import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ROOT_DIR,
  TARGET_LOCALES,
  appendApprovalDecision,
  assertLocale,
  clone,
  documentPath,
  documentRevision,
  flattenStrings,
  readDocument,
  validateDocument,
  writeJsonAtomic,
} from './localization-content.mjs';
import { PROJECT_OVERRIDES } from './localization-rules.mjs';
import { runTargetGates } from './localization-gates.mjs';
import { editorialRuleHashes, compareEditorialRuleHashes } from './localization-hashes.mjs';

const args = process.argv.slice(2);
const option = (name, fallback = '') => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
};
const pageId = String(option('--page')).replace(/^\/+|\/+$/g, '');
const locale = assertLocale(option('--locale'));
const jobId = option('--job-id');
const force = args.includes('--force');
const auto = args.includes('--auto');
const forceReason = String(option('--force-reason')).trim();
if (!pageId || !TARGET_LOCALES.includes(locale) || !jobId) {
  throw new Error('Usage: node scripts/localization-target-approve.mjs --page <page-id> --locale fr|tr|ar-DZ --job-id <job-id> [--force --force-reason "<explanation>"]');
}
if (force && forceReason.length < 8) throw new Error('--force requires --force-reason with a meaningful non-empty explanation (at least 8 characters).');
if (auto && process.env.LOCALIZATION_ALLOW_AUTO_APPROVAL !== 'true') throw new Error('Auto-approval is disabled by default; set LOCALIZATION_ALLOW_AUTO_APPROVAL=true only for a future calibrated isolated update.');

const source = await readDocument({ pageId, locale: 'en' });
if (source.status !== 'approved') throw new Error(`English source is not approved: ${source.status}`);
const candidateFile = path.join(ROOT_DIR, 'artifacts', 'localization', jobId, pageId, locale, '05-candidate.json');
const artifactDir = path.dirname(candidateFile);
const terminology = JSON.parse(await fs.readFile(path.join(ROOT_DIR, 'content', 'terminology', 'protected-terms.json'), 'utf8'));
const fieldContracts = await fs.readFile(path.join(ROOT_DIR, 'content', 'field-contracts.json'), 'utf8').then(JSON.parse).catch(() => null);
const facts = pageId.startsWith('projects/')
  ? await fs.readFile(path.join(ROOT_DIR, 'content', 'pages', pageId, 'facts.json'), 'utf8').then(JSON.parse).catch(() => null)
  : null;
const candidate = JSON.parse(await fs.readFile(candidateFile, 'utf8'));
const artifactMetadata = await fs.readFile(path.join(artifactDir, '00-source.json'), 'utf8').then(JSON.parse).catch(() => ({}));
const qaFile = path.join(artifactDir, '07-qa-report.json');
const terminologyFile = path.join(artifactDir, '05-terminology-review.json');
const qa = await fs.readFile(qaFile, 'utf8').then(JSON.parse).catch(() => ({ status: 'review', issues: [] }));
const terminologyReport = await fs.readFile(terminologyFile, 'utf8').then(JSON.parse).catch(() => ({ status: 'review', issues: [] }));

if (candidate.sourceRevision !== source.sourceRevision) {
  throw new Error(`STALE_SOURCE_REVISION: expected ${source.sourceRevision}, received ${candidate.sourceRevision}`);
}

const sourceSegments = [...flattenStrings(source.seo, 'seo'), ...flattenStrings(source.content, 'content')].filter(({ source: text }) => text.trim());
const candidateSegments = [...flattenStrings(candidate.seo, 'seo'), ...flattenStrings(candidate.content, 'content')].filter(({ source: text }) => text.trim());
const liveGates = runTargetGates({
  pageId,
  locale,
  sourceDoc: source,
  targetDoc: candidate,
  sourceSegments,
  candidateSegments,
  facts,
  terminology,
  fieldContracts,
  projectOverrides: PROJECT_OVERRIDES,
});

const storedTerminologyBlockers = (terminologyReport.issues || []).filter((item) => item.severity === 'blocker');
const qaIssues = Array.isArray(qa.issues) ? qa.issues : [];
const qaBlockers = qaIssues.filter((item) => item.severity === 'blocker');
if (qa.status !== 'pass') qaIssues.push({ code: 'QA_NOT_PASS', severity: 'blocker', path: 'page', message: `Blind QA status is ${qa.status || 'missing'}; candidate cannot be normally approved.` });
const allBlockers = [...storedTerminologyBlockers, ...qaIssues.filter((item) => item.severity === 'blocker'), ...liveGates.blockers];
const allWarnings = [...(terminologyReport.issues || []).filter((item) => item.severity === 'warning'), ...qaIssues.filter((item) => item.severity === 'warning'), ...liveGates.warnings];
if (allBlockers.length && !force) throw new Error(`Target candidate has ${allBlockers.length} blocker(s) across terminology, QA and fresh live gates; review artifacts or use --force --force-reason "...".`);

async function fallbackSummary(dir) {
  const records = [];
  async function walk(current) {
    for (const entry of await fs.readdir(current, { withFileTypes: true }).catch(() => [])) {
      const file = path.join(current, entry.name);
      if (entry.isDirectory()) await walk(file);
      else if (entry.name.endsWith('.json')) {
        const data = await fs.readFile(file, 'utf8').then(JSON.parse).catch(() => null);
        if (data?.fallback === true) records.push({ file: path.relative(ROOT_DIR, file), error: data.error || null });
      }
    }
  }
  await walk(dir);
  return records;
}

const targetDocument = clone(candidate);
targetDocument.pageId = pageId;
targetDocument.locale = locale;
targetDocument.sourceLocale = 'en';
targetDocument.sourceRevision = source.sourceRevision;
targetDocument.status = 'approved';
targetDocument.updatedAt = new Date().toISOString();
targetDocument.revision = `v1-${documentRevision(targetDocument)}`;
validateDocument(targetDocument, { expectedPageId: pageId, expectedLocale: locale });

const rules = await editorialRuleHashes(locale);
const candidateRuleHashes = {
  rulesVersion: artifactMetadata.rulesVersion,
  fieldContractsHash: artifactMetadata.fieldContractsHash,
  styleGuideHash: artifactMetadata.styleGuideHash,
  exemplarsHash: artifactMetadata.exemplarsHash,
  terminologyHash: artifactMetadata.terminologyHash,
};
const staleRuleKeys = compareEditorialRuleHashes(rules, candidateRuleHashes);
if (staleRuleKeys.length) throw new Error(`STALE_EDITORIAL_RULES: ${staleRuleKeys.join(', ')}`);
const fallback = await fallbackSummary(artifactDir);
const approval = {
  schemaVersion: 1,
  jobId,
  page: pageId,
  locale,
  sourceRevision: source.sourceRevision,
  targetRevision: targetDocument.revision,
  approvalTime: new Date().toISOString(),
  state: force ? 'forced' : auto ? 'auto' : 'human',
  forceReason: force ? forceReason : null,
  gateCounts: {
    live: liveGates.counts,
    storedTerminologyBlockers: storedTerminologyBlockers.length,
    qa: { status: qa.status || 'missing', blockers: qaBlockers.length, issues: qaIssues.length },
    combined: { blockers: allBlockers.length, warnings: allWarnings.length },
  },
  qaStatus: qa.status || 'missing',
  fallbackSummary: fallback,
  editorialRules: rules,
};
await writeJsonAtomic(path.join(artifactDir, '08-approval.json'), approval);
await writeJsonAtomic(documentPath({ pageId, locale }), targetDocument);
await appendApprovalDecision({
  approvalTime: approval.approvalTime,
  pageId,
  page: pageId,
  locale,
  decision: 'approve',
  sourceRevision: source.sourceRevision,
  targetRevision: targetDocument.revision,
  jobId,
  state: approval.state,
  forceReason: approval.forceReason,
  gateBlockers: allBlockers.length,
  reason: force ? forceReason : auto ? 'Auto approval explicitly enabled for this isolated update.' : 'Human target approval recorded.',
  decidedAt: approval.approvalTime,
  approver: process.env.LOCALIZATION_APPROVER || null,
  qaStatus: approval.qaStatus,
  gateCounts: approval.gateCounts,
  fallbackSummary: approval.fallbackSummary,
});
process.stdout.write(JSON.stringify({ pageId, locale, jobId, qa: qa.status || 'review', status: 'approved', state: approval.state, blockers: allBlockers.length, warnings: allWarnings.length }) + '\n');
