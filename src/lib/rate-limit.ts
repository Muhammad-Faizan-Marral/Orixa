type MemoryEntry = {
  count: number;
  resetAt: number;
};

const memoryStore = new Map<string, MemoryEntry>();

/**
 * In-memory limiter (best-effort).
 * Can reset on HMR / serverless — use DB check as source of truth.
 */
export function rateLimit(options: {
  key: string;
  limit: number;
  windowMs: number;
}): { success: boolean; retryAfterMs: number } {
  const now = Date.now();
  const existing = memoryStore.get(options.key);

  if (!existing || existing.resetAt <= now) {
    memoryStore.set(options.key, {
      count: 1,
      resetAt: now + options.windowMs,
    });
    return { success: true, retryAfterMs: 0 };
  }

  if (existing.count >= options.limit) {
    return {
      success: false,
      retryAfterMs: Math.max(0, existing.resetAt - now),
    };
  }

  existing.count += 1;
  memoryStore.set(options.key, existing);
  return { success: true, retryAfterMs: 0 };
}

export function secondsLeft(retryAfterMs: number) {
  return Math.max(1, Math.ceil(retryAfterMs / 1000));
}
