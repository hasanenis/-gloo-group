import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { GoogleGenAI, Type } from '@google/genai';
import {
  ROOT_DIR,
  clone,
  documentRevision,
  flattenStrings,
  readDocument,
  setAtPath,
  validateDocument,
  writeJsonAtomic,
} from './localization-content.mjs';
import { buildEditorialBrief, PROJECT_OVERRIDES } from './localization-rules.mjs';
import { auditClaimSupport } from './localization-claim-audit.mjs';
import { runTargetGates } from './localization-gates.mjs';

const args = process.argv.slice(2);
const has = (name) => args.includes(name);
const option = (name, fallback = '') => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
};
const smoke = has('--smoke');
const all = has('--all');
const pageFilter = String(option('--page')).replace(/^\/+|\/+$/gu, '');
const localeFilter = String(option('--locale')).trim();
const limit = Number(option('--limit', smoke ? '1' : '0')) || 0;
const concurrency = Math.max(1, Math.min(Number(option('--concurrency', smoke ? '1' : '2')) || 1, 3));
const outputFile = path.resolve(option('--output', path.join(ROOT_DIR, 'artifacts', 'localization', 'gemini-revision-report.json')));
const model = option('--model', process.env.GEMINI_CANDIDATE_EDITORIAL_MODEL || process.env.GEMINI_LOCALIZATION_EDITORIAL_MODEL || 'gemini-3.5-flash');

if (!smoke && !all) throw new Error('Usage: npm run content:gemini-revise -- --smoke --page <page-id> --locale tr | --all');
if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is missing.');

async function readJson(file, fallback = null) {
  try { return JSON.parse(await fs.readFile(file, 'utf8')); } catch { return fallback; }
}

async function generateGeminiContent({ system, prompt, stageName }) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: system,
      temperature: 0.1,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            text: { type: Type.STRING },
          },
          required: ['id', 'text'],
        },
      },
    },
  });
  const text = String(response.text || '').trim();
  if (!text) throw new Error(`${stageName} returned no text content.`);
  return { text };
}

async function findCandidates(directory, result = []) {
  const ignoredDirectories = new Set(['candidate-revalidation', 'claude-revision', 'gemini-revision']);
  for (const entry of await fs.readdir(directory, { withFileTypes: true }).catch(() => [])) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory() && !ignoredDirectories.has(entry.name)) await findCandidates(file, result);
    else if (entry.isFile() && entry.name === '05-candidate.json') result.push(file);
  }
  return result;
}

function sourceSegments(document) {
  return [...flattenStrings(document.seo, 'seo'), ...flattenStrings(document.content, 'content')]
    .filter(({ source }) => String(source || '').trim());
}

function candidateSegments(document) {
  return sourceSegments(document).map(({ path: fieldPath, source: text }) => ({ path: fieldPath, text }));
}

function isEditorialPath(fieldPath) {
  const value = String(fieldPath);
  if (/^seo\./u.test(value)) return true;
  return /^content\./u.test(value) && value !== 'content.slug' && !value.endsWith('.src');
}

function editorialSegments(document) {
  return sourceSegments(document).filter(({ path: fieldPath }) => isEditorialPath(fieldPath));
}

function errorMessage(error) {
  return String(error?.message || error || 'Unknown error').replace(/\s+/gu, ' ').slice(0, 500);
}

function parseFieldArray(text) {
  const clean = String(text || '').replace(/^```(?:json)?\s*/iu, '').replace(/\s*```$/u, '').trim();
  const start = clean.indexOf('[');
  const end = clean.lastIndexOf(']');
  if (start < 0 || end < start) throw new Error('Gemini did not return a JSON array.');
  const parsed = JSON.parse(clean.slice(start, end + 1));
  if (!Array.isArray(parsed)) throw new Error('Gemini field response is not an array.');
  return parsed;
}

function fieldSetError(parsed, expectedPaths) {
  const expected = [...expectedPaths].sort();
  const actual = parsed.map((item) => String(item?.id || '')).sort();
  if (parsed.length !== expected.length || new Set(actual).size !== expected.length || actual.some((fieldPath, index) => fieldPath !== expected[index])) {
    return `Gemini returned ${actual.length} fields; expected exactly ${expected.length} fields.`;
  }
  if (parsed.some((item) => typeof item?.text !== 'string' || !item.text.trim())) return 'Gemini returned an empty field.';
  return null;
}

function systemPrompt(locale) {
  const language = locale === 'tr' ? 'Turkish' : locale === 'fr' ? 'French' : 'Algerian Arabic';
  return `You are the senior in-house copywriter for Igloo, an Algerian construction contractor. Write publication-ready ${language} for a contractor's corporate project page.

You are not a literal translator, architecture-magazine editor, urban-design critic, property developer, sales brochure writer or luxury-brand copywriter. Your priorities, in order, are factual support, idiomatic language, field purpose and concise contractor voice.

Translate meaning, not source-language wording. Preserve verified numbers, names, acronyms, floor notation, scope and status, but rebuild the sentence as a native professional writer would. When the source wraps a concrete fact in architectural interpretation or marketing language, retain the concrete fact and remove the interpretation. Never invent contractor role, delivery method, completion, purpose, benefit, quality, lifestyle or design intent.`;
}

function turkishNaturalizationRules() {
  return `Turkish naturalisation rules:
- Do not transliterate an English or French property-service term merely because Turkish has a borrowed-looking word. State its verified function in ordinary Turkish.
- Use "site hizmetleri için ayrılmış alanlar" or "site hizmetleri için ayrılmış bölümler" for concierge facilities/spaces. Never use "konsiyerj", "konsiyerj alanı" or "konsiyerj olanağı".
- Use "kira ödeyerek satın alınabilen konutlar" for rent-to-own housing. Never use "kirala-satın al", "kira ödemeli mülkiyet", "kira ödemeli konut" or "kira öder gibi ev sahibi".
- Use "ticari alanlar" for commercial premises; use "zemin kattaki ticari alanlar" when the source specifies the ground floor. Do not force "entegre" into the sentence.
- Use "TCE kapsamındaki tüm yapım işleri" for an all-trades package and "yol ve altyapı işleri (VRD)" for roads and utility networks when an expansion is needed. Keep TCE and VRD when they are official scope labels.
- Keep R+N notation byte-identical. Never convert R+N to Z+N. If it must be explained, write "zemin kat ve N üst kat" without replacing the official code or reinterpreting it as a different storey count.
- Translate programme as "proje", "kapsam" or the verified housing category according to context; do not use "program" as empty corporate jargon.
- For active frontage, urban integration, balance, master-plan intent and similar source rhetoric, keep only the supported physical fact: blocks, floors, commercial areas, roads, utilities or other documented work.
- Forbidden contractor-copy wording includes: aktif cephe, cephe kurgusu, cephe eklemlenmesi, kentsel bütünleşme, kentsel entegrasyon, düşey entegrasyon, tasarım niyeti, tasarım dili, mekânsal anlatı, yerel sokak dokusu, master plan, yüksek yoğunluklu konut ihtiyacı, dengelemek amacıyla, sakinlerin günlük ihtiyaçlarını karşılayan, yaşamı kolaylaştıran and "... ile sunulan".
- Do not manufacture compressed compounds such as "site hizmetleri bölümlü" or stack several -lı/-li phrases in a title. Use a short core project title; move secondary facts to the summary or express them with a normal relative clause.
- In a compact title, do not force concierge/service-space information into an artificial noun phrase. Prefer the project's location, quantity and project type; explain site-service spaces naturally in the summary.
- Prefer "bulunmaktadır" or "yer almaktadır" for simple existence. Do not use "barındırmaktadır", "desteklenmektedir" or "yapılandırılmıştır" when the sentence only means that an area or unit exists.
- Never write "site hizmetleri bölümleri", "site hizmetleri alanları", "bulunacak şekilde inşa edilmiştir" or "karma kullanımlı konut projesi". Use "site hizmetleri için ayrılmış alanlar/bölümler", a direct existence sentence, or name the housing and commercial components separately.
- Never write "anahtar teslim" unless that exact delivery method is explicitly stated in the same English field. TCE means an all-trades scope; it does not by itself prove turnkey delivery.
- In captions, list visible elements directly. Do not write that a render shows an "ilişki", "bütünleşme", "kurgu" or "planlanan yerleşim"; name the blocks, roads, commercial areas, facade work or landscaping that is actually visible.
- Prefer a direct Turkish predicate: "... bölgesindeki proje ... konuttan oluşmaktadır", "Zemin katta ... yer almaktadır", or, only when supported, "Proje kapsamında ... yapım işleri gerçekleştirilmiştir."

The examples above are terminology decisions, not sentences to copy into unrelated fields.`;
}

function revisionPrompt({ pageId, locale, sourceFields, targetFields, facts, fieldContracts, brief }) {
  const localeRules = locale === 'tr' ? turkishNaturalizationRules() : '';
  return `Revise every requested field for ${pageId} (${locale}). Return exactly one object per field in this JSON form: [{"id":"content.summary.0","text":"..."}]. Return every supplied id exactly once and in the supplied order. Output JSON only, with no Markdown, explanation or extra keys.

Evidence boundary:
- The English text with the same field id defines what that field may say. Authoritative facts may confirm terminology or accuracy, but they are not permission to insert unrelated page facts into another field.
- Do not borrow a number, scope item, status or claim from a sibling field merely because it appears elsewhere on the page.
- Treat the current localized candidate as a draft to replace, not wording to preserve.
- If the same-id source contains rhetorical framing, translate its concrete proposition and omit unsupported interpretation.
- FAQ repair is the one exception to the same-id rule: the matching question defines the topic. If its English answer is incoherent, answer that exact question from authoritative facts and only the source fields directly relevant to that topic. Do not add any other project fact.

Field contracts:
- Title, eyebrow, labels and compact values: short, direct corporate Turkish. Preserve official codes and numbers; remove sales language and literal foreign terminology.
- Summary: identify what the project is and where it is, in one or two short factual sentences. Begin with the project, not a participial translation such as "... ile sunulan".
- Description: state only documented scope, distribution, quantities, floors, materials and works. No purpose, benefit or design commentary.
- Authority: use one short sentence containing only the recorded contractor scope or delivery status. When TCE and VRD are both verified, "Proje kapsamında TCE ve VRD dahil tüm yapım işleri gerçekleştirilmiştir." is the preferred level of brevity; do not use it when those facts are absent.
- FAQ answer: the matching question outranks the old English answer. Discard every sentence or clause in the old answer that does not answer that question. A ground-floor-use question must list every verified ground-floor use and contain no block count, upper-floor information, design purpose or general project recap. A scope question must begin with the documented scope. Do not recap a different FAQ or the summary.
- For a block/structural/features FAQ, answer with only verified block count, R+N notation, floor distribution, apartment types, units per floor, structure or materials. The final answer must contain none of these off-topic concepts: rent-to-own/financing, commercial areas, concierge/site-service spaces or general benefits, unless the question explicitly asks for them.
- For a construction-works FAQ, list only the verified work packages. Translate TCE as the scope of all construction trades; never infer "anahtar teslim", main-contractor status or a delivery promise from TCE.
- Image alt: describe visible objects, materials, work stage and whether the image is a render or site photograph. Do not infer unseen systems or intent.
- Image caption: use one short site/company sentence about the visible subject or documented work. No architecture-jury vocabulary.
- SEO: concise factual project identification; no keyword pile-up or unsupported superlatives.

${localeRules}

Silent final check for every field:
1. Fact check: every claim is supported by the same-id source or authoritative facts and no field-specific fact was imported from elsewhere.
2. Naturalness check: a Turkish construction company could publish the exact sentence without it sounding translated or AI-written.
3. Role check: the sentence sounds like a contractor, not an architect, critic, developer or salesperson.
4. Coherence check: each FAQ answers its own question immediately and contains no fact outside that question's topic; summary, description and authority do different jobs.
5. Compression check: remove any adjective or clause that does not add a verified fact.

REQUESTED ENGLISH FIELDS (authoritative per-field meaning):
${JSON.stringify(sourceFields)}

CURRENT ${locale.toUpperCase()} DRAFT FIELDS (rewrite these):
${JSON.stringify(targetFields)}

AUTHORITATIVE PROJECT FACTS (verification only; do not distribute them across unrelated fields):
${JSON.stringify(facts || {})}

FIELD CONTRACT DATA:
${JSON.stringify(fieldContracts || {})}

SHARED EDITORIAL RULES:
${brief}`;
}

async function readCandidateRecord(file) {
  const candidate = await readJson(file);
  const pageId = candidate?.pageId;
  const locale = candidate?.locale;
  if (!pageId || !locale) return { file, skip: 'missing pageId or locale' };
  if (pageFilter && pageId !== pageFilter) return { file, skip: 'page filter' };
  if (localeFilter && locale !== localeFilter) return { file, skip: 'locale filter' };
  const shared = pageId === 'shared';
  const source = await readDocument({ pageId: shared ? 'shared' : pageId, locale: 'en', shared });
  if (candidate.sourceRevision !== source.sourceRevision) return { file, pageId, locale, skip: 'stale source revision', sourceRevision: candidate.sourceRevision, currentSourceRevision: source.sourceRevision };
  const facts = !shared && pageId.startsWith('projects/')
    ? await readJson(path.join(ROOT_DIR, 'content', 'pages', pageId, 'facts.json'))
    : null;
  const fieldContracts = await readJson(path.join(ROOT_DIR, 'content', 'field-contracts.json'), {});
  const terminology = await readJson(path.join(ROOT_DIR, 'content', 'terminology', 'protected-terms.json'), { terms: [] });
  const manifest = shared ? null : await readJson(path.join(ROOT_DIR, 'content', 'pages', pageId, 'page.json'));
  const brief = buildEditorialBrief({ pageId, target: locale, manifest, facts, terminology });
  const sourceFields = editorialSegments(source);
  const targetFields = editorialSegments(candidate);
  return { file, pageId, locale, candidate, source, facts, fieldContracts, terminology, brief, sourceFields, targetFields };
}

function evaluate({ pageId, locale, source, candidate, facts, fieldContracts, terminology }) {
  const gates = runTargetGates({
    pageId,
    locale,
    sourceDoc: source,
    targetDoc: candidate,
    sourceSegments: sourceSegments(source),
    candidateSegments: candidateSegments(candidate),
    facts,
    terminology,
    fieldContracts,
    projectOverrides: PROJECT_OVERRIDES,
  });
  const claimAudit = auditClaimSupport({ candidate, source, facts, fieldContracts });
  const blockers = [...(gates.issues || []), ...(claimAudit.issues || [])].filter((item) => item.severity === 'blocker');
  return { gates, claimAudit, blockers: blockers.length };
}

async function reviseRecord(record, model) {
  const { pageId, locale, candidate, source, facts, fieldContracts, brief, sourceFields, targetFields } = record;
  const expectedPaths = targetFields.map((field) => field.path);
  const prompt = revisionPrompt({ pageId, locale, sourceFields, targetFields, facts, fieldContracts, brief });
  let parsed;
  let lastError;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const response = await generateGeminiContent({
        system: systemPrompt(locale),
        prompt: attempt === 1 ? prompt : `${prompt}\n\nPrevious response validation failed: ${lastError.message}. Return the complete exact field set again.`,
        stageName: `gemini-${pageId}-${locale}`,
      });
      parsed = parseFieldArray(response.text);
      const validationError = fieldSetError(parsed, expectedPaths);
      if (validationError) throw new Error(validationError);
      break;
    } catch (error) {
      lastError = error;
      if (attempt === 2) throw error;
    }
  }
  const revised = clone(candidate);
  for (const item of parsed) setAtPath(revised, item.id, item.text.trim());
  revised.status = 'review';
  revised.revision = `v1-${documentRevision(revised)}`;
  validateDocument(revised, { expectedPageId: pageId, expectedLocale: locale, shared: pageId === 'shared' });
  const before = evaluate({ pageId, locale, source, candidate, facts, fieldContracts, terminology: record.terminology });
  const after = evaluate({ pageId, locale, source, candidate: revised, facts, fieldContracts, terminology: record.terminology });
  return { revised, before, after, revisedPaths: expectedPaths };
}

const files = (await findCandidates(path.join(ROOT_DIR, 'artifacts', 'localization'))).sort();
const records = [];
let staleSkipped = 0;
for (const file of files) {
  const record = await readCandidateRecord(file).catch((error) => ({ file, error: errorMessage(error) }));
  if (record.skip === 'stale source revision') staleSkipped += 1;
  if (!record.skip && !record.error) records.push(record);
}
const selected = limit > 0 ? records.slice(0, limit) : records;
if (!selected.length) throw new Error('No current-source candidates matched the requested filters.');

const runId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
const results = [];
let nextIndex = 0;
async function processNext() {
  while (nextIndex < selected.length) {
    const record = selected[nextIndex];
    nextIndex += 1;
    const startedAt = Date.now();
    try {
      const result = await reviseRecord(record, model);
      const root = path.join(ROOT_DIR, 'artifacts', 'localization', 'gemini-revision', runId, record.pageId, record.locale);
      await fs.mkdir(root, { recursive: true });
      await writeJsonAtomic(path.join(root, '00-source.json'), {
        schemaVersion: 1,
        provider: 'google-ai-api-key',
        model,
        location: 'generativelanguage-api',
        pageId: record.pageId,
        target: record.locale,
        sourceRevision: record.source.sourceRevision,
        source: record.source,
      });
      await writeJsonAtomic(path.join(root, '05-candidate.json'), result.revised);
      await writeJsonAtomic(path.join(root, '06-gate-report.json'), {
        schemaVersion: 1,
        provider: 'google-ai-api-key',
        model,
        location: 'generativelanguage-api',
        sourceRevision: record.source.sourceRevision,
        revisedPaths: result.revisedPaths,
        before: result.before,
        after: result.after,
      });
      results.push({
        pageId: record.pageId,
        locale: record.locale,
        input: path.relative(ROOT_DIR, record.file),
        output: path.relative(ROOT_DIR, path.join(root, '05-candidate.json')),
        fields: result.revisedPaths.length,
        beforeBlockers: result.before.blockers,
        afterBlockers: result.after.blockers,
        elapsedSeconds: Number(((Date.now() - startedAt) / 1000).toFixed(1)),
        status: result.after.blockers === 0 ? 'pass' : 'review',
      });
      console.log(`${record.pageId} | ${record.locale} | ${result.revisedPaths.length} fields | blockers ${result.before.blockers} -> ${result.after.blockers} | ${result.after.blockers === 0 ? 'PASS' : 'REVIEW'}`);
    } catch (error) {
      results.push({ pageId: record.pageId, locale: record.locale, input: path.relative(ROOT_DIR, record.file), status: 'error', error: errorMessage(error), elapsedSeconds: Number(((Date.now() - startedAt) / 1000).toFixed(1)) });
      console.error(`${record.pageId} | ${record.locale} | ERROR | ${errorMessage(error)}`);
    }
  }
}
await Promise.all(Array.from({ length: Math.min(concurrency, selected.length) }, () => processNext()));

const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  mode: smoke ? 'smoke' : 'all-current-source-candidates',
  provider: 'google-ai-api-key',
  model,
  location: 'generativelanguage-api',
  selected: selected.length,
  concurrency,
  currentSourceCandidates: records.length,
  staleSourceSkipped: staleSkipped,
  results,
  counts: results.reduce((out, item) => { out[item.status] = (out[item.status] || 0) + 1; return out; }, {}),
};
await writeJsonAtomic(outputFile, report);
console.log(`\nGemini revision report: ${path.relative(ROOT_DIR, outputFile)}`);
console.log(`Mode: ${report.mode}; selected: ${selected.length}; stale source skipped: ${staleSkipped}; results: ${JSON.stringify(report.counts)}`);
