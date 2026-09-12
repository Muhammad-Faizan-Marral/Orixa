import { unstable_cache } from "next/cache";
import { revalidatePath, revalidateTag } from "next/cache";

import { portfolioService } from "@/services/portfolio/portfolio.service";

export const PORTFOLIO_REVALIDATE_SECONDS = 60;
export const PORTFOLIO_SWR_SECONDS = 300;

export function portfolioCacheTag(username: string, slug: string) {
  return `portfolio:${username}:${slug}`;
}

export function userCacheTag(username: string) {
  return `user:${username}`;
}

/**
 * Cache ONLY successful published payloads.
 * Null/not-found is not stored as a sticky cache entry.
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
    ["published-portfolio-v3", username, portfolioSlug],
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
    return portfolioService.getPublishedPublic(username, portfolioSlug);
  }
}

export function publicPageCacheHeaders(): Record<string, string> {
  const value = `public, s-maxage=${PORTFOLIO_REVALIDATE_SECONDS}, stale-while-revalidate=${PORTFOLIO_SWR_SECONDS}, stale-if-error=30`;
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

export function revalidatePublicPortfolio(username: string, slug: string) {
  revalidateTag(portfolioCacheTag(username, slug), "max");
  revalidateTag(userCacheTag(username), "max");
  revalidatePath(`/${username}/${slug}`);
  revalidatePath(`/${username}`);
  revalidatePath(`/${username}/${slug}/orixaAi`);
}

export function revalidatePublicUser(username: string) {
  revalidateTag(userCacheTag(username), "max");
  revalidatePath(`/${username}`);
}