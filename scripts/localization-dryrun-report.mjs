import fs from 'node:fs/promises';
import path from 'node:path';
import { ROOT_DIR } from './localization-content.mjs';

const args = process.argv.slice(2);
const option = (name, fallback = '') => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
};
const prefix = option('--prefix', 'full-dryrun');
const outputFile = path.resolve(option('--output', 'artifacts/localization/full-dryrun-manifest.json'));
const root = path.join(ROOT_DIR, 'artifacts', 'localization');
const records = [];

async function walk(directory, jobId) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true }).catch(() => [])) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(file, jobId);
    else if (entry.name === '00-source-review.json' || entry.name === '00-source.json') {
      const data = await fs.readFile(file, 'utf8').then(JSON.parse).catch(() => null);
      if (!data) continue;
      records.push({
        jobId,
        stage: entry.name === '00-source-review.json' ? 'source' : 'target',
        pageId: data.pageId,
        locale: data.locale || data.target || 'en',
        segments: data.fields || data.segments?.length || 0,
        sourceRevision: data.sourceRevision,
        artifact: path.relative(ROOT_DIR, file).replaceAll(path.sep, '/'),
      });
    }
  }
}

for (const entry of await fs.readdir(root, { withFileTypes: true }).catch(() => [])) {
  if (entry.isDirectory() && entry.name.startsWith(prefix)) await walk(path.join(root, entry.name), entry.name);
}
records.sort((a, b) => `${a.stage}/${a.locale}/${a.pageId}`.localeCompare(`${b.stage}/${b.locale}/${b.pageId}`));
const source = records.filter((record) => record.stage === 'source');
const target = records.filter((record) => record.stage === 'target');
const targetByLocale = Object.fromEntries(['fr', 'tr', 'ar-DZ'].map((locale) => [locale, target.filter((record) => record.locale === locale).map((record) => record.pageId)]));
const expectedPages = [
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
const missingTargetPagesByLocale = Object.fromEntries(Object.entries(targetByLocale).map(([locale, pages]) => [
  locale,
  expectedPages.filter((page) => !new Set(pages).has(page)),
]));
const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  prefix,
  expected: { sourcePages: 16, targetPagesPerLocale: 16, targetLocales: ['fr', 'tr', 'ar-DZ'] },
  summary: {
    sourceJobs: source.length,
    sourcePages: new Set(source.map((record) => record.pageId)).size,
    targetJobs: target.length,
    targetPagesByLocale: Object.fromEntries(Object.entries(targetByLocale).map(([locale, pages]) => [locale, new Set(pages).size])),
    missingTargetPagesByLocale,
    sourceInventoryComplete: source.length === 16 && new Set(source.map((record) => record.pageId)).size === 16,
    targetInventoryComplete: Object.values(missingTargetPagesByLocale).every((pages) => pages.length === 0),
    heldPilotPages: ['projects/rahmania', 'projects/dely-brahim-240-housing'],
  },
  records,
  note: 'Dry-run artifacts validate inventory, routing, usage estimation and approval locks. They do not constitute human approval or canonical publication.',
};
await fs.mkdir(path.dirname(outputFile), { recursive: true });
await fs.writeFile(outputFile, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ outputFile: path.relative(ROOT_DIR, outputFile), summary: report.summary }, null, 2));
