/** Shared stage execution and error recording for localization jobs. */

export function serializeStageError(error) {
  return {
    message: String(error?.message || error),
    code: error?.code ?? error?.status ?? null,
  };
}

export async function withTimeout(execute, { stageName = 'remote-stage', timeoutMs = Number(process.env.LOCALIZATION_REMOTE_TIMEOUT_MS || 180000) } = {}) {
  const limit = Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 180000;
  let timer;
  try {
    return await Promise.race([
      Promise.resolve().then(execute),
      new Promise((_, reject) => {
        timer = setTimeout(() => {
          const error = new Error(`${stageName} exceeded the ${limit}ms remote-call timeout.`);
          error.code = 'REMOTE_TIMEOUT';
          reject(error);
        }, limit);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Execute one remote/editorial stage and make fallback state explicit. A
 * caller chooses whether a failed stage is allowed to continue by inspecting
 * `fallback`; this helper never hides the error or silently converts a failed
 * required stage into a success.
 */
export async function stageWithFallback(stageName, execute, fallbackValue, { policy = 'warning' } = {}) {
  try {
    const value = await execute();
    return {
      stage: stageName,
      value,
      fallback: false,
      error: null,
      policy,
    };
  } catch (error) {
    const serialized = serializeStageError(error);
    const value = typeof fallbackValue === 'function' ? await fallbackValue(error) : fallbackValue;
    const result = {
      stage: stageName,
      value,
      fallback: true,
      error: serialized,
      policy,
    };
    const log = `[localization:${stageName}] fallback used (policy=${policy}, code=${serialized.code || 'unknown'}): ${serialized.message}`;
    if (policy === 'blocker') console.error(log);
    else console.warn(log);
    if (policy === 'blocker') {
      const failure = new Error(`${stageName} failed: ${serialized.message}`);
      failure.code = serialized.code || 'LOCALIZATION_STAGE_FAILED';
      failure.stageName = stageName;
      failure.stageRecord = result;
      throw failure;
    }
    return result;
  }
}
