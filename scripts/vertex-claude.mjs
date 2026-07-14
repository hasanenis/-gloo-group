import fs from 'node:fs/promises';
import path from 'node:path';
import { GoogleAuth } from 'google-auth-library';
import { ROOT_DIR } from './localization-content.mjs';

export const DEFAULT_CLAUDE_VERTEX_MODEL = 'claude-sonnet-4-5@20250929';
export const DEFAULT_CLAUDE_VERTEX_LOCATION = 'global';
const CLOUD_PLATFORM_SCOPE = 'https://www.googleapis.com/auth/cloud-platform';

function credentialPath() {
  return process.env.GOOGLE_APPLICATION_CREDENTIALS
    || path.join(ROOT_DIR, '.secrets', 'gcp', 'translation-service-account.json');
}

async function projectIdFromCredential() {
  const configured = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT;
  if (configured) return configured;
  try {
    const credential = JSON.parse(await fs.readFile(credentialPath(), 'utf8'));
    return credential?.project_id || '';
  } catch {
    return '';
  }
}

async function accessToken() {
  const credentials = credentialPath();
  try {
    await fs.access(credentials);
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credentials;
  } catch {
    // GoogleAuth can still use ADC from gcloud or the runtime environment.
  }
  const auth = new GoogleAuth({ scopes: [CLOUD_PLATFORM_SCOPE] });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  const value = typeof token === 'string' ? token : token?.token;
  if (!value) throw new Error('Google ADC did not return a Vertex access token.');
  return value;
}

function extractText(payload) {
  if (typeof payload?.text === 'string') return payload.text;
  if (Array.isArray(payload?.content)) {
    return payload.content
      .filter((item) => item?.type === 'text' && typeof item.text === 'string')
      .map((item) => item.text)
      .join('');
  }
  if (Array.isArray(payload?.candidates)) {
    return payload.candidates
      .flatMap((candidate) => candidate?.content?.parts || [])
      .map((part) => part?.text || '')
      .join('');
  }
  return '';
}

function endpoint({ projectId, location, model }) {
  const host = location === 'global' ? 'aiplatform.googleapis.com' : `${location}-aiplatform.googleapis.com`;
  return `https://${host}/v1/projects/${encodeURIComponent(projectId)}/locations/${encodeURIComponent(location)}/publishers/anthropic/models/${encodeURIComponent(model)}:rawPredict`;
}

function compactError(value) {
  return String(value || '').replace(/\s+/gu, ' ').slice(0, 800);
}

export function resolveClaudeVertexConfig() {
  return {
    projectId: process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || null,
    location: process.env.CLAUDE_VERTEX_LOCATION || DEFAULT_CLAUDE_VERTEX_LOCATION,
    model: process.env.CLAUDE_VERTEX_MODEL || DEFAULT_CLAUDE_VERTEX_MODEL,
  };
}

export async function generateClaudeContent({
  system,
  prompt,
  model,
  maxTokens = 12000,
  temperature = 0.35,
  stageName = 'vertex-claude',
  timeoutMs = 180000,
}) {
  const config = { ...resolveClaudeVertexConfig(), ...(model ? { model } : {}) };
  const projectId = config.projectId || await projectIdFromCredential();
  if (!projectId) throw new Error('Google Cloud project ID is missing for Vertex Claude.');
  const body = {
    anthropic_version: 'vertex-2023-10-16',
    max_tokens: maxTokens,
    temperature,
    stream: false,
    messages: [{ role: 'user', content: String(prompt) }],
  };
  if (system) body.system = String(system);

  const token = await accessToken();
  const url = endpoint({ ...config, projectId });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error) {
    if (error?.name === 'AbortError') throw new Error(`${stageName} timed out after ${timeoutMs}ms.`);
    throw error;
  } finally {
    clearTimeout(timeout);
  }

  const raw = await response.text();
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error(`${stageName} hit the Vertex Claude ${config.location} online-prediction quota. Enable/request quota for global_online_prediction_requests_per_base_model and retry. Details: ${compactError(raw)}`);
    }
    throw new Error(`${stageName} failed (${response.status}) at ${config.location}/${config.model}: ${compactError(raw)}`);
  }
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    throw new Error(`${stageName} returned non-JSON output: ${compactError(raw)}`);
  }
  const text = extractText(payload);
  if (!text.trim()) throw new Error(`${stageName} returned no text content.`);
  return { text, payload, ...config, projectId, endpoint: url };
}
