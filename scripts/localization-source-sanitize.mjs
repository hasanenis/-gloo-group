import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ROOT_DIR, flattenStrings, readDocument, setAtPath, writeJsonAtomic } from './localization-content.mjs';

const pages = [
  'home', 'about', 'contact', 'projects-index', 'not-found',
  'projects/boudouaou-70-10-housing', 'projects/dely-brahim-240-housing',
  'projects/douaouda-300-500-housing', 'projects/rahmania',
  'projects/reghaia-bouraada-250-housing', 'projects/rouiba-4-promotional-villas',
  'projects/bas-mazagran-200-38-housing', 'projects/said-hamdine-mixed-real-estate',
  'projects/sidi-abdallah-200-1200-housing', 'projects/sidi-benour-50-housing',
  'projects/staoueli-11-41-villas',
];

const root = path.join(ROOT_DIR, 'artifacts', 'localization');
const numberTokens = (text) => String(text).match(/\b\d+(?:[+\-/]\d+)*\b/g) || [];
const latestCandidate = async (pageId) => {
  let best = null;
  for (const job of await fs.readdir(root, { withFileTypes: true }).catch(() => [])) {
    if (!job.isDirectory()) continue;
    const file = path.join(root, job.name, pageId, 'en-source', '01-source-edit-candidate.json');
    try {
      const data = JSON.parse(await fs.readFile(file, 'utf8'));
      if (data.model !== 'gemini-3.5-flash') continue;
      if (!best || Date.parse(data.generatedAt || 0) > Date.parse(best.data.generatedAt || 0)) best = { data, file, job: job.name };
    } catch {}
  }
  return best;
};

for (const pageId of pages) {
  const source = await readDocument({ pageId, locale: 'en' });
  const candidate = await latestCandidate(pageId);
  if (!candidate) throw new Error(`No Gemini 3.5 Flash source candidate found for ${pageId}`);
  const sourceFields = [...flattenStrings(source.seo, 'seo'), ...flattenStrings(source.content, 'content')];
  const candidateFields = new Map([...flattenStrings(candidate.data.seo, 'seo'), ...flattenStrings(candidate.data.content, 'content')].map((item) => [item.path, item.source]));
  const fallbacks = [];
  for (const field of sourceFields) {
    const value = candidateFields.get(field.path) || '';
    const missingNumber = numberTokens(field.source).some((token) => !value.includes(token));
    const immutablePath = field.path.endsWith('.src') && value !== field.source;
    if (missingNumber || immutablePath) {
      setAtPath(candidate.data, field.path, field.source);
      fallbacks.push({ path: field.path, reason: missingNumber ? 'source-number-preservation' : 'immutable-image-path' });
    }
  }
  if (fallbacks.length) {
    await writeJsonAtomic(candidate.file, candidate.data);
    const qualityFile = path.join(path.dirname(candidate.file), '02-source-quality.json');
    const quality = await fs.readFile(qualityFile, 'utf8').then(JSON.parse).catch(() => ({}));
    quality.status = 'review';
    quality.sanitizedFallbacks = fallbacks;
    await writeJsonAtomic(qualityFile, quality);
  }
  console.log(JSON.stringify({ pageId, jobId: candidate.job, fallbacks: fallbacks.length }));
}
