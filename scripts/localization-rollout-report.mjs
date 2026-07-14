import fs from 'node:fs/promises';
import path from 'node:path';
import { documentPath, readDocument, ROOT_DIR, TARGET_LOCALES } from './localization-content.mjs';
import { runTargetGates } from './localization-gates.mjs';

const DEFAULT_PAGES = [
  'home',
  'about',
  'contact',
  'projects-index',
  'not-found',
  'projects/boudouaou-70-10-housing',
  'projects/dely-brahim-240-housing',
  'projects/douaouda-300-500-housing',
  'projects/rahmania',
  'projects/reghaia-bouraada-250-housing',
  'projects/rouiba-4-promotional-villas',
  'projects/bas-mazagran-200-38-housing',
  'projects/said-hamdine-mixed-real-estate',
  'projects/sidi-abdallah-200-1200-housing',
  'projects/sidi-benour-50-housing',
  'projects/staoueli-11-41-villas',
];

const args = process.argv.slice(2);
const option = (name, fallback = '') => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
};
const pages = (option('--pages') || DEFAULT_PAGES.join(','))
  .split(',')
  .map((page) => page.trim().replace(/^\/+|\/+$/gu, ''))
  .filter(Boolean);
const outputFile = path.resolve(option('--output', 'artifacts/localization/rollout-readiness.json'));

async function readStatus(pageId, locale) {
  try {
    const document = await readDocument({ pageId, locale });
    return {
      status: document.status,
      sourceRevision: document.sourceRevision,
      revision: document.revision,
      updatedAt: document.updatedAt || null,
      file: path.relative(ROOT_DIR, documentPath({ pageId, locale })).replaceAll(path.sep, '/'),
    };
  } catch (error) {
    return {
      status: 'missing-or-invalid',
      error: String(error?.message || error),
      file: path.relative(ROOT_DIR, documentPath({ pageId, locale })).replaceAll(path.sep, '/'),
    };
  }
}

async function readOptionalJson(file) {
  try { return JSON.parse(await fs.readFile(file, 'utf8')); }
  catch { return null; }
}

async function findPendingSourceCandidates(pageId, source) {
  if (!source || source.status === 'missing-or-invalid') return [];
  const artifactRoot = path.join(ROOT_DIR, 'artifacts', 'localization');
  const pending = [];
  async function scan(dir) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true }).catch(() => [])) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) await scan(file);
      else if (entry.name === '01-source-edit-candidate.json') {
        const candidate = await fs.readFile(file, 'utf8').then(JSON.parse).catch(() => null);
        if (
          candidate?.pageId === pageId
          && [source.revision, source.sourceRevision].includes(candidate.sourceRevision)
          && Date.parse(candidate.generatedAt || 0) > Date.parse(source.updatedAt || 0)
        ) {
          pending.push(path.relative(ROOT_DIR, file).replaceAll(path.sep, '/'));
        }
      }
    }
  }
  await scan(artifactRoot);
  return pending.sort();
}

const fieldContracts = await readOptionalJson(path.join(ROOT_DIR, 'content', 'field-contracts.json'));
const terminology = await readOptionalJson(path.join(ROOT_DIR, 'content', 'terminology', 'protected-terms.json')) || { terms: [] };

const pagesReport = [];
for (const pageId of pages) {
  const source = await readStatus(pageId, 'en');
  const targets = Object.fromEntries(await Promise.all(TARGET_LOCALES.map(async (locale) => [locale, await readStatus(pageId, locale)])));
  const pendingSourceCandidates = await findPendingSourceCandidates(pageId, source);
  const sourceDocument = source.status === 'missing-or-invalid' ? null : await readDocument({ pageId, locale: 'en' });
  const facts = await readOptionalJson(path.join(ROOT_DIR, 'content', 'pages', ...pageId.split('/'), 'facts.json'));
  for (const locale of TARGET_LOCALES) {
    if (targets[locale].status === 'missing-or-invalid' || !sourceDocument) continue;
    const targetDocument = await readDocument({ pageId, locale });
    const gates = runTargetGates({ sourceDoc: sourceDocument, targetDoc: targetDocument, locale, facts, terminology, fieldContracts, pageId });
    targets[locale] = { ...targets[locale], gateStatus: gates.status, gateCounts: gates.counts };
  }
  const targetRevisionMismatches = TARGET_LOCALES.filter((locale) => (
    targets[locale].status !== 'missing-or-invalid'
    && source.status !== 'missing-or-invalid'
    && targets[locale].sourceRevision !== source.sourceRevision
  ));
  pagesReport.push({
    pageId,
    source,
    targets,
    pendingSourceCandidates,
    targetRevisionMismatches,
    sourceApproved: source.status === 'approved' && pendingSourceCandidates.length === 0,
    allTargetsApproved: TARGET_LOCALES.every((locale) => targets[locale].status === 'approved' && targets[locale].gateStatus === 'pass'),
  });
}

const summary = {
  pages: pagesReport.length,
  sourceApproved: pagesReport.filter((page) => page.sourceApproved).length,
  targetApproved: Object.fromEntries(TARGET_LOCALES.map((locale) => [
    locale,
    pagesReport.filter((page) => page.targets[locale].status === 'approved' && page.targets[locale].gateStatus === 'pass').length,
  ])),
  targetRevisionMismatches: pagesReport.flatMap((page) => page.targetRevisionMismatches.map((locale) => `${page.pageId}:${locale}`)),
  pendingSourceCandidates: pagesReport.flatMap((page) => page.pendingSourceCandidates.map((file) => `${page.pageId}:${file}`)),
  sourceReadyForTargetGeneration: pagesReport.every((page) => page.sourceApproved && page.pendingSourceCandidates.length === 0 && page.targetRevisionMismatches.length === 0),
  approvedDocumentsPassGates: pagesReport.reduce((count, page) => count + TARGET_LOCALES.filter((locale) => page.targets[locale].status === 'approved' && page.targets[locale].gateStatus === 'pass').length, 0),
  targetDocumentsWithBlockers: pagesReport.flatMap((page) => TARGET_LOCALES.filter((locale) => page.targets[locale].gateStatus === 'review').map((locale) => `${page.pageId}:${locale}`)),
  fullyApproved: pagesReport.every((page) => page.sourceApproved && page.pendingSourceCandidates.length === 0 && page.allTargetsApproved),
};

const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  scope: { locales: ['en', ...TARGET_LOCALES], pages },
  summary,
  pages: pagesReport,
  decisionLog: {
    requiredForRelease: true,
    path: 'artifacts/localization/approval-decisions.jsonl',
    note: 'This report does not fabricate human approvals. Each approved source or target must be recorded by its approval command/workflow.',
  },
};

await fs.mkdir(path.dirname(outputFile), { recursive: true });
await fs.writeFile(outputFile, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ outputFile: path.relative(ROOT_DIR, outputFile), summary }, null, 2));
