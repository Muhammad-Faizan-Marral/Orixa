import { unstable_cache } from "next/cache";
import { revalidatePath, revalidateTag } from "next/cache";

import { portfolioService } from "@/services/portfolio/portfolio.service";

/** ISR / CDN window — 1 hour fresh, then SWR */
export const PORTFOLIO_REVALIDATE_SECONDS = 3600;
export const PORTFOLIO_SWR_SECONDS = 86_400; // 24h stale-while-revalidate

export function portfolioCacheTag(username: string, slug: string) {
  return `portfolio:${username}:${slug}`;
}

export function userCacheTag(username: string) {
  return `user:${username}`;
}

/**
 * Cached published portfolio fetch.
 * First visitor hits DB; later visitors get cached data.
 */
export function getCachedPublishedPortfolio(
  username: string,
  portfolioSlug: string,
) {
  return unstable_cache(
    async () => {
      return portfolioService.getPublishedPublic(username, portfolioSlug);
    },
    ["published-portfolio", username, portfolioSlug],
    {
      tags: [
        portfolioCacheTag(username, portfolioSlug),
        userCacheTag(username),
      ],
      revalidate: PORTFOLIO_REVALIDATE_SECONDS,
    },
  )();
}

/** CDN + browser headers (Vercel / Cloudflare / most CDNs) */
export function publicPageCacheHeaders(): Record<string, string> {
  const value = `public, s-maxage=${PORTFOLIO_REVALIDATE_SECONDS}, stale-while-revalidate=${PORTFOLIO_SWR_SECONDS}, stale-if-error=86400`;
  return {
    "Cache-Control": value,
    "CDN-Cache-Control": value,
    "Vercel-CDN-Cache-Control": value,
    Vary: "Accept-Encoding",
  };
}

/** Publish / unpublish ke baad saari layers bust */
/** Publish / unpublish ke baad saari layers bust */
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