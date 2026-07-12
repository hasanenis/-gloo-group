import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ROOT_DIR,
  TARGET_LOCALES,
  assertLocale,
  documentPath,
  documentRevision,
  readDocument,
  validateDocument,
  writeJsonAtomic,
} from './localization-content.mjs';

const args = process.argv.slice(2);
const option = (name, fallback = '') => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
};
const pageId = String(option('--page')).replace(/^\/+|\/+$/g, '');
const locale = assertLocale(option('--locale'));
const jobId = option('--job-id');
const force = args.includes('--force');
if (!pageId || !TARGET_LOCALES.includes(locale) || !jobId) {
  throw new Error('Usage: node scripts/localization-target-approve.mjs --page <page-id> --locale fr|tr|ar-DZ --job-id <job-id> [--force]');
}

const source = await readDocument({ pageId, locale: 'en' });
const candidateFile = path.join(ROOT_DIR, 'artifacts', 'localization', jobId, pageId, locale, '05-candidate.json');
const qaFile = path.join(path.dirname(candidateFile), '07-qa-report.json');
const candidate = JSON.parse(await fs.readFile(candidateFile, 'utf8'));
const qa = await fs.readFile(qaFile, 'utf8').then(JSON.parse).catch(() => ({ status: 'review', issues: [] }));
const blockers = Array.isArray(qa.issues) ? qa.issues.filter((issue) => issue.severity === 'blocker') : [];
if (![source.revision, source.sourceRevision].includes(candidate.sourceRevision)) throw new Error(`Stale ${locale} candidate: expected ${source.sourceRevision}, received ${candidate.sourceRevision}`);
if (blockers.length && !force) throw new Error(`Target candidate has ${blockers.length} blocker(s); review QA or pass --force.`);

candidate.pageId = pageId;
candidate.locale = locale;
candidate.sourceLocale = 'en';
candidate.sourceRevision = source.sourceRevision;
candidate.status = 'approved';
candidate.updatedAt = new Date().toISOString();
candidate.revision = `v1-${documentRevision(candidate)}`;
validateDocument(candidate, { expectedPageId: pageId, expectedLocale: locale });
await writeJsonAtomic(documentPath({ pageId, locale }), candidate);
process.stdout.write(JSON.stringify({ pageId, locale, jobId, qa: qa.status || 'review', status: 'approved', blockers: blockers.length }) + '\n');
