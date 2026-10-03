import type { NextRequest } from "next/server";

/**
 * Best-effort in-memory limiter. On serverless each instance has its own memory,
 * so use Upstash/Redis (or Vercel's WAF rate limiting) if you need a hard guarantee.
 */
const hits = new Map<string, { n: number; reset: number }>();

export function rateLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
  const e = hits.get(key);
  if (!e || e.reset < now) {
    hits.set(key, { n: 1, reset: now + windowMs });
    return true;
  }
  e.n += 1;
  return e.n <= max;
}

export const clientKey = (req: NextRequest) =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
