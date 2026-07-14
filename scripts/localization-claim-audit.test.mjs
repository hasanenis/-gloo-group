import { test } from 'node:test';
import assert from 'node:assert/strict';
import { auditClaimSupport } from './localization-claim-audit.mjs';

test('auditClaimSupport accepts a number preserved from the same approved source field', () => {
  const source = { content: { summary: ['Seven R+9 blocks contain 250 housing units.'] } };
  const candidate = { content: { summary: ['Yedi adet R+9 blokta 250 konut yer almaktadır.'] } };
  const report = auditClaimSupport({ candidate, source, facts: { totalUnits: 250 } });
  assert.equal(report.issues.length, 0);
});

test('auditClaimSupport still blocks a number absent from facts and the same source field', () => {
  const source = { content: { summary: ['Seven R+9 blocks contain 250 housing units.'] } };
  const candidate = { content: { summary: ['Yedi adet R+9 blokta 250 konut ve 12 ticari alan yer almaktadır.'] } };
  const report = auditClaimSupport({ candidate, source, facts: { totalUnits: 250 } });
  assert.equal(report.issues.length, 1);
  assert.equal(report.issues[0].code, 'UNSUPPORTED_CLAIM');
});
