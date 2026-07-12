import 'dotenv/config';
import fs from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { readDocument, TARGET_LOCALES, ROOT_DIR } from './localization-content.mjs';

const args = process.argv.slice(2);
const option = (name, fallback = '') => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
};
const has = (name) => args.includes(name);
const stage = option('--stage', 'source');
const target = option('--locale', '');
const dryRun = has('--dry-run') || has('--offline');
const concurrency = Math.max(1, Math.min(4, Number(option('--concurrency', '1')) || 1));
const defaultPages = [
  'home', 'about', 'contact', 'projects-index', 'not-found',
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
const pagesOption = option('--pages', '');
const pages = pagesOption ? pagesOption.split(',').map((page) => page.trim().replace(/^\/+|\/+$/g, '')).filter(Boolean) : defaultPages;

if (!['source', 'target'].includes(stage)) throw new Error('--stage must be source or target.');
if (stage === 'target' && !TARGET_LOCALES.includes(target)) throw new Error(`--locale must be one of: ${TARGET_LOCALES.join(', ')}`);

if (stage === 'target') {
  const stale = [];
  for (const pageId of pages) {
    const source = await readDocument({ pageId, locale: 'en' });
    if (source.status !== 'approved') stale.push(`${pageId} (${source.status})`);
    const artifactRoot = path.join(ROOT_DIR, 'artifacts', 'localization');
    const pending = [];
    async function scan(dir) {
      for (const entry of await fs.readdir(dir, { withFileTypes: true }).catch(() => [])) {
        const file = path.join(dir, entry.name);
        if (entry.isDirectory()) await scan(file);
        else if (entry.name === '01-source-edit-candidate.json') {
          const candidate = await fs.readFile(file, 'utf8').then(JSON.parse).catch(() => null);
          if (candidate?.pageId === pageId && [source.revision, source.sourceRevision].includes(candidate.sourceRevision) && Date.parse(candidate.generatedAt || 0) > Date.parse(source.updatedAt || 0)) pending.push(file);
        }
      }
    }
    await scan(artifactRoot);
    if (pending.length) stale.push(`${pageId} (English source candidate requires approval)`);
  }
  if (stale.length) throw new Error(`Target localization is locked until every English source is approved: ${stale.join(', ')}`);
}

function runNode(script, scriptArgs) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(ROOT_DIR, 'scripts', script), ...scriptArgs], {
      cwd: ROOT_DIR,
      env: process.env,
      stdio: 'inherit',
      windowsHide: true,
    });
    child.once('error', reject);
    child.once('exit', (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`${script} failed for ${scriptArgs.join(' ')} (code=${code}, signal=${signal || 'none'})`));
    });
  });
}

let cursor = 0;
const failures = [];
async function worker() {
  while (cursor < pages.length) {
    const pageId = pages[cursor++];
    const slug = pageId.replaceAll('/', '-');
    const jobId = `batch-${Date.now().toString(36)}-${stage}-${target || 'en'}-${slug}`;
    const scriptArgs = ['--page', pageId, '--job-id', jobId];
    if (stage === 'target') scriptArgs.push('--target', target);
    if (dryRun) scriptArgs.push(stage === 'source' ? '--dry-run' : '--offline');
    try {
      console.log(`[localization-batch] ${stage} ${target || 'en'} ${pageId}`);
      await runNode(stage === 'source' ? 'localization-source-review.mjs' : 'localization-pipeline.mjs', scriptArgs);
    } catch (error) {
      failures.push({ pageId, error: String(error?.message || error) });
    }
  }
}

await Promise.all(Array.from({ length: Math.min(concurrency, pages.length) }, () => worker()));
if (failures.length) {
  console.error(JSON.stringify({ stage, target: target || 'en', failures }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ stage, target: target || 'en', pages: pages.length, concurrency, dryRun }, null, 2));
}
