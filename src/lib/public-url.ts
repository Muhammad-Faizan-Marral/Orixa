/**
 * Canonical public URL helpers for Orixa.
 *
 * Display + Copy + Share (pretty path, brand/domain last):
 *   developer/developer/orixaai.me
 *
 * Real browser URL after deploy:
 *   https://orixaai.me/developer/developer
 *
 * Local dev:
 *   http://localhost:3000/developer/developer
 *
 * Set in production .env:
 *   NEXT_PUBLIC_SITE_URL=https://orixaai.me
 */

export const BRAND_DOMAIN = "orixaai.me";
/** @deprecated path brand segment no longer required in canonical URL */
export const BRAND_SEGMENT = "orixaAi";

const FALLBACK_ORIGIN = `https://${BRAND_DOMAIN}`;

export function getSiteOrigin(): string {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return FALLBACK_ORIGIN;
}

/**
 * Pretty path for UI display, clipboard, and share text.
 * Example: developer/developer/orixaai.me
 */
export function publicPathDisplay(
  username: string,
  portfolioSlug?: string | null,
): string {
  if (portfolioSlug && portfolioSlug.trim()) {
    return `${username}/${portfolioSlug.trim()}/${BRAND_DOMAIN}`;
  }
  return `${username}/${BRAND_DOMAIN}`;
}

/**
 * Same as publicPathDisplay — share/copy must match display.
 * Example: developer/developer/orixaai.me
 */
export function publicSharePath(
  username: string,
  portfolioSlug?: string | null,
): string {
  return publicPathDisplay(username, portfolioSlug);
}

/**
 * Real absolute URL that opens the portfolio in a browser.
 * Production: https://orixaai.me/developer/developer
 * Local:      http://localhost:3000/developer/developer
 */
export function publicAbsoluteUrl(
  username: string,
  portfolioSlug?: string | null,
): string {
  return `${getSiteOrigin()}${publicInternalPath(username, portfolioSlug)}`;
}

/**
 * Internal Next.js route path (no brand domain in path).
 * Example: /developer/developer
 */
export function publicInternalPath(
  username: string,
  portfolioSlug?: string | null,
): string {
  if (portfolioSlug && portfolioSlug.trim()) {
    return `/${username}/${portfolioSlug.trim()}`;
  }
  return `/${username}`;
}