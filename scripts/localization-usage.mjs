/** Informational usage estimation. It intentionally has no execution limits. */

export function estimateUsage({ segments = [], cloudRequests = 0, geminiRequests = 0, stages = [], models = [] } = {}) {
  const sourceCharacters = segments.reduce((total, segment) => total + [...String(segment.source ?? segment.text ?? '')].length, 0);
  return {
    informationalOnly: true,
    sourceCharacters,
    sourceSegments: segments.length,
    estimatedPromptTokens: Math.ceil(sourceCharacters / 4) + (geminiRequests * 180),
    estimatedOutputTokens: Math.ceil(sourceCharacters / 3) + (geminiRequests * 120),
    cloudTranslationRequests: cloudRequests,
    geminiRequests,
    stages,
    models: [...new Set(models.filter(Boolean))],
    maySkipAdjudication: false,
    mayTriggerRevisionPass: true,
    note: 'Token volumes are estimates for visibility only; they are not provider billing and never block execution.',
  };
}
