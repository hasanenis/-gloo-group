import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ROOT_DIR } from './localization-content.mjs';
import { RULES_VERSION } from './localization-rules.mjs';

async function hashFile(file) {
  try { return crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex'); }
  catch { return null; }
}

export async function editorialRuleHashes(locale) {
  return {
    rulesVersion: RULES_VERSION,
    fieldContractsHash: await hashFile(path.join(ROOT_DIR, 'content', 'field-contracts.json')),
    styleGuideHash: await hashFile(path.join(ROOT_DIR, 'content', 'style-guides', `${locale}.md`)),
    exemplarsHash: await hashFile(path.join(ROOT_DIR, 'content', 'style-guides', 'exemplars', `${locale}.json`)),
    terminologyHash: await hashFile(path.join(ROOT_DIR, 'content', 'terminology', 'protected-terms.json')),
  };
}

export function compareEditorialRuleHashes(expected, actual) {
  const keys = ['rulesVersion', 'fieldContractsHash', 'styleGuideHash', 'exemplarsHash', 'terminologyHash'];
  return keys.filter((key) => expected?.[key] !== actual?.[key]);
}
