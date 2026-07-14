import fs from 'node:fs/promises';
import path from 'node:path';
import { tokenizeNumbers } from './localization-gates.mjs';

const UNSUPPORTED_PATTERNS = [
  /\bresolv(?:es|e|ed|ing) site constraints\b/iu,
  /\boptim(?:is|iz)(?:es|e|ed|ing) urban density\b/iu,
  /\bcreates? an active frontage\b/iu,
  /\brequir(?:ed|es|ing) complex vertical coordination\b/iu,
  /\blandmark development\b/iu,
  /\barchitectural significance\b/iu,
  /\bimproves? the surrounding urban fabric\b/iu,
  /\bpushes the portfolio upward\b/iu,
  /\bhigh-performance building envelope\b/iu,
  /\bdelivered on schedule\b/iu,
  /\bfree promotional housing\b/iu,
];
const INTERPRETIVE_PATTERNS = [
  /\barchitectural excellence\b/iu,
  /\bcoherent residential enclave\b/iu,
  /\bactive street-level commercial frontage\b/iu,
  /\boptim(?:is|iz)(?:es|e|ed|ing)\b/iu,
  /\b(?:premium|prestigious|exceptional|iconic|remarkable)\b/iu,
];

function flatten(value, prefix = '', out = []) {
  if (typeof value === 'string') out.push({ path: prefix, text: value });
  else if (Array.isArray(value)) value.forEach((item, index) => flatten(item, `${prefix}[${index}]`, out));
  else if (value && typeof value === 'object') Object.entries(value).forEach(([key, child]) => flatten(child, prefix ? `${prefix}.${key}` : key, out));
  return out;
}

function factLeaves(value, prefix = '', out = []) {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') out.push({ path: prefix, value: String(value) });
  else if (Array.isArray(value)) value.forEach((item, index) => factLeaves(item, `${prefix}[${index}]`, out));
  else if (value && typeof value === 'object') Object.entries(value).forEach(([key, child]) => factLeaves(child, prefix ? `${prefix}.${key}` : key, out));
  return out;
}

function fieldContract(pathName, contracts) {
  const normalized = String(pathName).replace(/\[\d+\]/gu, '.*');
  return Object.entries(contracts?.contracts || contracts || {}).find(([key]) => key === normalized || key === pathName)?.[1] || {};
}

export function auditClaimSupport({ candidate, source, facts, fieldContracts } = {}) {
  const factValues = factLeaves(facts);
  const factNumbers = new Set(factValues.flatMap((item) => tokenizeNumbers(item.value, 'en').map((token) => token.normalized)));
  const sourceFields = flatten(source?.seo, 'seo').concat(flatten(source?.content, 'content'));
  const sourceByPath = new Map(sourceFields.map((item) => [item.path, item.text]));
  const records = [];
  const issues = [];
  const candidates = flatten(candidate?.seo, 'seo').concat(flatten(candidate?.content, 'content'));
  for (const item of candidates) {
    const text = item.text.trim();
    if (!text || /(?:\.src|\.slug|^content\.images.*\.src$)/u.test(item.path) || /^https?:\/\//u.test(text)) continue;
    const sameFieldSource = sourceByPath.get(item.path) || '';
    const sameFieldSourceNumbers = new Set(tokenizeNumbers(sameFieldSource, 'en').map((token) => token.normalized));
    const factSupport = factValues.filter((fact) => fact.value.length >= 3 && text.toLocaleLowerCase().includes(fact.value.toLocaleLowerCase())).map((fact) => fact.path);
    const support = [...factSupport];
    if (sameFieldSource) support.push(`source:${item.path}`);
    const candidateNumbers = tokenizeNumbers(text, 'en').filter((token) => token.type !== 'version-like');
    const unsupportedNumber = factValues.length ? candidateNumbers.find((token) => !factNumbers.has(token.normalized) && !sameFieldSourceNumbers.has(token.normalized)) : null;
    const unsupportedPattern = UNSUPPORTED_PATTERNS.find((pattern) => pattern.test(text));
    const interpretivePattern = INTERPRETIVE_PATTERNS.find((pattern) => pattern.test(text));
    const unsupportedMatch = unsupportedPattern ? text.match(unsupportedPattern)?.[0] : null;
    const interpretiveMatch = interpretivePattern ? text.match(interpretivePattern)?.[0] : null;
    let status = 'supported';
    let reason = factSupport.length
      ? 'The claim contains a matching authoritative fact value.'
      : sameFieldSource
        ? 'The claim is checked against its same-field approved source.'
        : 'No prohibited unsupported-claim pattern was detected.';
    if (unsupportedMatch || unsupportedNumber) {
      status = 'unsupported';
      reason = unsupportedMatch ? `Matched unsupported-claim rule: ${unsupportedMatch}` : `Number ${unsupportedNumber.raw} is not present in the authoritative facts.`;
    } else if (interpretiveMatch) {
      status = 'interpretive';
      reason = `Matched interpretive-claim rule: ${interpretiveMatch}`;
    }
    const record = { path: item.path, claim: text, support, status, reason };
    records.push(record);
    const contract = fieldContract(item.path, fieldContracts);
    if (status === 'unsupported' || (status === 'interpretive' && contract.allowInterpretation !== true)) {
      issues.push({ code: status === 'unsupported' ? 'UNSUPPORTED_CLAIM' : 'UNPERMITTED_INTERPRETATION', severity: 'blocker', path: item.path, sourceText: '', targetText: text, type: 'claim-support', message: reason });
    }
  }
  return { status: issues.length ? 'review' : 'pass', records, issues };
}

export async function auditClaimFiles({ candidateFile, factsFile, fieldContractsFile, outputFile } = {}) {
  const candidate = JSON.parse(await fs.readFile(path.resolve(candidateFile), 'utf8'));
  const facts = factsFile ? JSON.parse(await fs.readFile(path.resolve(factsFile), 'utf8')) : null;
  const fieldContracts = fieldContractsFile ? JSON.parse(await fs.readFile(path.resolve(fieldContractsFile), 'utf8')) : null;
  const report = auditClaimSupport({ candidate, facts, fieldContracts });
  if (outputFile) await fs.writeFile(path.resolve(outputFile), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  return report;
}
