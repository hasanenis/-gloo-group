import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { TranslationServiceClient } from '@google-cloud/translate';
import { GoogleGenAI } from '@google/genai';
import { ROOT_DIR } from './localization-content.mjs';
import { withTimeout } from './localization-stage.mjs';
import { effectiveLocalizationModels, localizationModelStages } from './localization-models.mjs';

const credentialPath = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(ROOT_DIR, '.secrets', 'gcp', 'translation-service-account.json'));
const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
const models = effectiveLocalizationModels();
const stageEntries = localizationModelStages();
const modelStages = [...stageEntries.reduce((groups, entry) => {
  const stages = groups.get(entry.model) || [];
  stages.push(entry.stage);
  groups.set(entry.model, stages);
  return groups;
}, new Map())].map(([model, stages]) => ({ model, stages }));

const checks = [];
const modelChecks = [];
function record(name, status, detail = '') {
  checks.push({ name, status, detail });
}
function errorDetail(error, fallback) {
  return String(error?.message || error || fallback).replace(/\s+/gu, ' ').slice(0, 240);
}

let credential = null;
try {
  await fs.access(credentialPath);
  credential = JSON.parse(await fs.readFile(credentialPath, 'utf8'));
  if (credential?.type !== 'service_account') throw new Error('configured credential is not a service account');
  // GoogleGenAI uses ADC rather than the Translation client's keyFilename.
  // Point ADC at the same validated credential so the probe tests the exact
  // credential that the localization stages will use.
  process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialPath;
  record('credentials file', 'PASS');
} catch (error) {
  record('credentials file', 'FAIL', 'credential file is unavailable or invalid');
}

const projectId = credential?.project_id || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || '';
record('GCP project ID', projectId ? 'PASS' : 'FAIL', projectId ? 'resolved' : 'not resolved');
record('Vertex location', location ? 'PASS' : 'FAIL', location || 'empty');
record('configured Vertex models', models.length ? 'PASS' : 'FAIL', models.length ? `${models.length} effective model(s)` : 'set GEMINI_LOCALIZATION_MODEL or stage-specific model variables');

if (projectId && credential) {
  try {
    const client = new TranslationServiceClient({ keyFilename: credentialPath });
    await client.translateText({
      parent: `projects/${projectId}/locations/global`,
      contents: ['Igloo'],
      mimeType: 'text/plain',
      sourceLanguageCode: 'en',
      targetLanguageCode: 'fr',
    });
    record('Cloud Translation minimal request', 'PASS');
  } catch {
    record('Cloud Translation minimal request', 'FAIL', 'provider request failed');
  }

  try {
    const ai = new GoogleGenAI({ vertexai: true, project: projectId, location, apiVersion: 'v1' });
    await withTimeout(() => ai.models.generateContent({ model: models[0], contents: 'Reply with OK.', config: { maxOutputTokens: 8 } }), { stageName: `preflight-${models[0]}` });
    record('Vertex endpoint probe', 'PASS');
  } catch {
    record('Vertex endpoint probe', 'FAIL', 'provider request failed');
  }

  for (const { model, stages } of modelStages) {
    try {
      const ai = new GoogleGenAI({ vertexai: true, project: projectId, location, apiVersion: 'v1' });
      await withTimeout(() => ai.models.generateContent({ model, contents: 'Reply with OK.', config: { maxOutputTokens: 8 } }), { stageName: `preflight-${model}` });
      modelChecks.push({ model, stages: stages.join(', '), location, status: 'PASS', error: '' });
    } catch (error) {
      modelChecks.push({ model, stages: stages.join(', '), location, status: 'FAIL', error: errorDetail(error, 'model probe failed') });
    }
  }
} else {
  record('Cloud Translation minimal request', 'FAIL', 'skipped because credentials/project are unresolved');
  record('Vertex endpoint probe', 'FAIL', 'skipped because credentials/project are unresolved');
  for (const { model, stages } of modelStages) modelChecks.push({ model, stages: stages.join(', '), location, status: 'FAIL', error: 'credentials/project unresolved' });
}

const nameWidth = Math.max(...checks.map((check) => check.name.length), 16);
console.log(`Check${' '.repeat(Math.max(1, nameWidth - 5))}  Status  Detail`);
console.log(`${'-'.repeat(nameWidth)}  ------  ------`);
for (const check of checks) console.log(`${check.name.padEnd(nameWidth)}  ${check.status.padEnd(6)}  ${check.detail}`);
console.log('\nMODEL                 STAGE(S)                                  LOCATION     STATUS  ERROR');
console.log('--------------------  ---------------------------------------  -----------  ------  -----');
for (const check of modelChecks) console.log(`${check.model.padEnd(20)}  ${check.stages.padEnd(39)}  ${check.location.padEnd(11)}  ${check.status.padEnd(6)}  ${check.error}`);

const failed = checks.filter((check) => check.status === 'FAIL').concat(modelChecks.filter((check) => check.status === 'FAIL'));
if (failed.length) {
  console.error(`Preflight failed: ${failed.length} required check(s). No secret values were printed.`);
  process.exitCode = 1;
} else {
  console.log(`Preflight passed: ${checks.length} checks plus ${modelChecks.length} model probes.`);
}
