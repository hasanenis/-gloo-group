// Model routing is environment-configurable. The defaults keep cheap semantic
// scaffolding on Flash while reserving editorial judgement for Pro.
export const DEFAULT_GEMINI_MODEL = process.env.GEMINI_LOCALIZATION_DEFAULT_MODEL || 'gemini-2.5-flash-lite';
export const DEFAULT_GEMINI_DRAFT_MODEL = process.env.GEMINI_LOCALIZATION_DEFAULT_DRAFT_MODEL || 'gemini-2.5-flash';
export const DEFAULT_GEMINI_EDITORIAL_MODEL = process.env.GEMINI_LOCALIZATION_DEFAULT_EDITORIAL_MODEL || 'gemini-2.5-pro';

export function resolveLocalizationModels(env = process.env) {
  const fallbackModel = env.GEMINI_LOCALIZATION_MODEL || DEFAULT_GEMINI_MODEL;
  return {
    fallbackModel,
    sourceModel: env.GEMINI_LOCALIZATION_SOURCE_MODEL || env.GEMINI_SOURCE_EDITORIAL_MODEL || env.GEMINI_SOURCE_REVIEW_MODEL || env.GEMINI_LOCALIZATION_REVIEW_MODEL || DEFAULT_GEMINI_EDITORIAL_MODEL,
    draftModel: env.GEMINI_LOCALIZATION_DRAFT_MODEL || DEFAULT_GEMINI_DRAFT_MODEL,
    editorialModel: env.GEMINI_LOCALIZATION_EDITORIAL_MODEL || env.GEMINI_LOCALIZATION_REVIEW_MODEL || DEFAULT_GEMINI_EDITORIAL_MODEL,
    adjudicationModel: env.GEMINI_LOCALIZATION_ADJUDICATION_MODEL || env.GEMINI_LOCALIZATION_ADJUDICATE_MODEL || env.GEMINI_LOCALIZATION_REVIEW_MODEL || DEFAULT_GEMINI_EDITORIAL_MODEL,
    qaModel: env.GEMINI_LOCALIZATION_QA_MODEL || env.GEMINI_LOCALIZATION_REVIEW_MODEL || DEFAULT_GEMINI_EDITORIAL_MODEL,
    proofreadModel: env.GEMINI_LOCALIZATION_PROOFREAD_MODEL || env.GEMINI_LOCALIZATION_REVIEW_MODEL || DEFAULT_GEMINI_EDITORIAL_MODEL,
    claimAuditModel: env.GEMINI_LOCALIZATION_CLAIM_AUDIT_MODEL || env.GEMINI_CLAIM_AUDIT_MODEL || DEFAULT_GEMINI_EDITORIAL_MODEL,
  };
}

export function localizationModelStages(env = process.env) {
  const models = resolveLocalizationModels(env);
  return [
    { stage: 'draft', model: models.draftModel },
    { stage: 'source-editorial', model: models.sourceModel },
    { stage: 'adjudication', model: models.adjudicationModel },
    { stage: 'target-editorial', model: models.editorialModel },
    { stage: 'claim-audit', model: models.claimAuditModel },
    { stage: 'proofread', model: models.proofreadModel },
    { stage: 'qa', model: models.qaModel },
    { stage: 'fallback', model: models.fallbackModel },
  ].filter((entry) => entry.model);
}

export function effectiveLocalizationModels(env = process.env) {
  return [...new Set(localizationModelStages(env).map((entry) => entry.model))];
}
