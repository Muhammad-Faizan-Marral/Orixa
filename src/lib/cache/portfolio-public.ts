import { unstable_cache } from "next/cache";
import { revalidatePath, revalidateTag } from "next/cache";

import { portfolioService } from "@/services/portfolio/portfolio.service";

/**
 * On-demand revalidation is the source of truth.
 * Keep TTL short so even if a tag is missed, content is never stale for long.
 * CDN still gets SWR for performance between publishes.
 */
export const PORTFOLIO_REVALIDATE_SECONDS = 60; // was 3600
export const PORTFOLIO_SWR_SECONDS = 300; // was 86400 — 5 min background refresh max

export function portfolioCacheTag(username: string, slug: string) {
  return `portfolio:${username}:${slug}`;
}

export function userCacheTag(username: string) {
  return `user:${username}`;
}

/**
 * Cache ONLY successful published payloads.
 * Null / not-found is never stored as a sticky cache entry.
 */
export async function getCachedPublishedPortfolio(
  username: string,
  portfolioSlug: string,
) {
  const loadCachedHit = unstable_cache(
    async () => {
      const result = await portfolioService.getPublishedPublic(
        username,
        portfolioSlug,
      );
      if (!result) {
        throw new Error("PORTFOLIO_NOT_PUBLISHED");
      }
      return result;
    },
    // version bump forces old long-TTL entries to die
    ["published-portfolio-v5", username, portfolioSlug],
    {
      tags: [
        portfolioCacheTag(username, portfolioSlug),
        userCacheTag(username),
      ],
      revalidate: PORTFOLIO_REVALIDATE_SECONDS,
    },
  );

  try {
    return await loadCachedHit();
  } catch {
    return null;
  }
}

/** CDN-friendly headers for public portfolio pages */
export function publicPageCacheHeaders(): Record<string, string> {
  const value = `public, s-maxage=${PORTFOLIO_REVALIDATE_SECONDS}, stale-while-revalidate=${PORTFOLIO_SWR_SECONDS}, stale-if-error=86400`;
  return {
    "Cache-Control": value,
    "CDN-Cache-Control": value,
    "Vercel-CDN-Cache-Control": value,
    Vary: "Accept-Encoding",
  };
}

export function publicErrorCacheHeaders(): Record<string, string> {
  return {
    "Cache-Control": "private, no-store, max-age=0, must-revalidate",
    "CDN-Cache-Control": "no-store",
    "Vercel-CDN-Cache-Control": "no-store",
  };
}

/**
 * Instant purge after publish / unpublish / archive / restore.
 * Call this from EVERY action that changes public visibility or content.
 */
export function revalidatePublicPortfolio(username: string, slug: string) {
  // Data Cache (unstable_cache tags)
  revalidateTag(portfolioCacheTag(username, slug), "max");
  revalidateTag(userCacheTag(username), "max");

  // Full Route Cache + CDN path purge (Vercel respects these)
  revalidatePath(`/${username}/${slug}`);
  revalidatePath(`/${username}`);
  revalidatePath(`/${username}/${slug}/orixaAi`);
}

export function revalidatePublicUser(username: string) {
  revalidateTag(userCacheTag(username), "max");
  revalidatePath(`/${username}`);
}
