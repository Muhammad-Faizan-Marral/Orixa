type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

// Clean old entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(
    () => {
      const now = Date.now();
      for (const [key, entry] of store.entries()) {
        if (entry.resetAt < now) {
          store.delete(key);
        }
      }
    },
    5 * 60 * 1000,
  );
}

type RateLimitOptions = {
  key: string;
  limit?: number;
  windowMs?: number;
};

type RateLimitResult = {
  success: boolean;
  remaining: number;
  retryAfterMs: number;
};

/**
 * Simple in-memory rate limiter
 */
export function rateLimit(options: RateLimitOptions): RateLimitResult;
export function rateLimit(
  key: string,
  limit?: number,
  windowMs?: number,
): RateLimitResult;
export function rateLimit(
  keyOrOptions: string | RateLimitOptions,
  limit = 5,
  windowMs = 60 * 1000,
): RateLimitResult {
  let key: string;
  let finalLimit = limit;
  let finalWindowMs = windowMs;

  if (typeof keyOrOptions === "object") {
    key = keyOrOptions.key;
    finalLimit = keyOrOptions.limit ?? 5;
    finalWindowMs = keyOrOptions.windowMs ?? 60 * 1000;
  } else {
    key = keyOrOptions;
  }

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, {
      count: 1,
      resetAt: now + finalWindowMs,
    });
    return {
      success: true,
      remaining: finalLimit - 1,
      retryAfterMs: 0,
    };
  }

  if (entry.count >= finalLimit) {
    return {
      success: false,
      remaining: 0,
      retryAfterMs: Math.max(0, entry.resetAt - now),
    };
  }

  entry.count += 1;

  return {
    success: true,
    remaining: finalLimit - entry.count,
    retryAfterMs: 0,
  };
}

/**
 * Convert milliseconds to readable seconds (minimum 1)
 */
export function secondsLeft(ms: number): number {
  return Math.max(1, Math.ceil(ms / 1000));
}
