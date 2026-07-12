import 'dotenv/config';
import { TranslationServiceClient } from '@google-cloud/translate';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

type TargetLocale = 'fr' | 'tr' | 'ar-DZ';
type TranslationSegment = {
  id: string;
  source: string;
  context: string;
};

const ROOT = process.cwd();
const DEFAULT_CREDENTIAL_PATH = path.join(ROOT, '.secrets', 'gcp', 'translation-service-account.json');
const COST_PER_MILLION_NMT_USD = 20;
const COST_PER_MILLION_TLLM_USD = 10;

function option(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function requireOption(name: string) {
  const value = option(name);
  if (!value) throw new Error(`Missing required option: ${name}`);
  return value;
}

function cloudLocale(locale: TargetLocale) {
  return locale === 'ar-DZ' ? 'ar' : locale;
}

async function credentialProjectId(credentialPath: string) {
  const credential = JSON.parse(await readFile(credentialPath, 'utf8')) as { project_id?: string; type?: string };
  if (credential.type !== 'service_account' || !credential.project_id) {
    throw new Error('Credential must be a Google Cloud service-account JSON file with project_id.');
  }
  return credential.project_id;
}

function clientFor(credentialPath: string) {
  return new TranslationServiceClient({ keyFilename: credentialPath });
}

function estimate(segments: TranslationSegment[], model: 'nmt' | 'translation-llm') {
  const characters = segments.reduce((total, segment) => total + [...segment.source].length, 0);
  const rate = model === 'translation-llm' ? COST_PER_MILLION_TLLM_USD : COST_PER_MILLION_NMT_USD;
  return { characters, usd: (characters / 1_000_000) * rate, model };
}

async function readSegments(file: string) {
  const parsed = JSON.parse(await readFile(path.resolve(ROOT, file), 'utf8')) as unknown;
  if (!Array.isArray(parsed)) throw new Error('Draft input must be a JSON array of translation segments.');

  const segments = parsed.map((value, index) => {
    if (!value || typeof value !== 'object') throw new Error(`Segment ${index} is invalid.`);
    const { id, source, context = '' } = value as Partial<TranslationSegment>;
    if (!id || !source || typeof id !== 'string' || typeof source !== 'string' || typeof context !== 'string') {
      throw new Error(`Segment ${index} must include string id, source, and optional context.`);
    }
    return { id, source, context };
  });

  if (!segments.length) throw new Error('Draft input contains no segments.');
  return segments;
}

async function preflight() {
  const credentialPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || DEFAULT_CREDENTIAL_PATH;
  const projectId = await credentialProjectId(credentialPath);
  const client = clientFor(credentialPath);
  const [response] = await client.getSupportedLanguages({
    parent: `projects/${projectId}/locations/global`,
    displayLanguageCode: 'en',
  });
  const supported = new Set((response.languages ?? []).map((language) => language.languageCode));
  for (const locale of ['fr', 'tr', 'ar'] as const) {
    if (!supported.has(locale)) throw new Error(`Cloud Translation does not report support for ${locale}.`);
  }
  process.stdout.write('Cloud Translation preflight passed. Credential, API access, and required target languages are available.\n');
}

async function draft() {
  const input = requireOption('--input');
  const target = requireOption('--target') as TargetLocale;
  const model = (option('--model') || 'translation-llm') as 'nmt' | 'translation-llm';
  const location = option('--location') || (model === 'translation-llm' ? 'us-central1' : 'global');
  const maxUsd = Number(requireOption('--max-usd'));
  if (!['fr', 'tr', 'ar-DZ'].includes(target)) throw new Error('--target must be fr, tr, or ar-DZ.');
  if (!['nmt', 'translation-llm'].includes(model)) throw new Error('--model must be nmt or translation-llm.');
  if (!Number.isFinite(maxUsd) || maxUsd <= 0) throw new Error('--max-usd must be a positive number.');

  const segments = await readSegments(input);
  const forecast = estimate(segments, model);
  if (forecast.usd > maxUsd) {
    throw new Error(`Estimated NMT cost $${forecast.usd.toFixed(4)} exceeds --max-usd=$${maxUsd.toFixed(2)}.`);
  }

  const credentialPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || DEFAULT_CREDENTIAL_PATH;
  const projectId = await credentialProjectId(credentialPath);
  const client = clientFor(credentialPath);
  const batches: TranslationSegment[][] = [];
  let batch: TranslationSegment[] = [];
  let batchCharacters = 0;
  for (const segment of segments) {
    const characters = [...segment.source].length;
    if (batch.length && (batch.length >= 40 || batchCharacters + characters > 18_000)) {
      batches.push(batch);
      batch = [];
      batchCharacters = 0;
    }
    batch.push(segment);
    batchCharacters += characters;
  }
  if (batch.length) batches.push(batch);

  const translations: Array<{ translatedText?: string | null }> = [];
  for (const [batchIndex, currentBatch] of batches.entries()) {
    const [response] = await client.translateText({
      parent: `projects/${projectId}/locations/${location}`,
      contents: currentBatch.map((segment) => segment.source),
      mimeType: 'text/plain',
      sourceLanguageCode: 'en',
      targetLanguageCode: cloudLocale(target),
      model: `projects/${projectId}/locations/${location}/models/general/${model}`,
      labels: { system: 'localization', phase: 'draft', locale: cloudLocale(target) },
    });
    translations.push(...(response.translations ?? []));
    process.stdout.write(`Translated batch ${batchIndex + 1}/${batches.length}.\n`);
  }
  if (translations.length !== segments.length) throw new Error('Cloud Translation returned an unexpected number of segments.');

  const output = {
    generatedAt: new Date().toISOString(),
    provider: `cloud-translation-${model}`,
    target,
    estimate: forecast,
    segments: segments.map((segment, index) => ({
      ...segment,
      draft: translations[index]?.translatedText ?? '',
      status: 'needs-human-review' as const,
    })),
  };
  const out = option('--out') || path.join('artifacts', 'translation-drafts', `${target}-${Date.now()}.json`);
  const outPath = path.resolve(ROOT, out);
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  process.stdout.write(`Wrote ${segments.length} review-only translation drafts to ${path.relative(ROOT, outPath)}.\n`);
}

const command = process.argv[2];
const action = command === 'preflight' ? preflight : command === 'draft' ? draft : undefined;
if (!action) {
  throw new Error('Usage: tsx scripts/translation-cloud.ts <preflight|draft> [options]');
}

action().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
