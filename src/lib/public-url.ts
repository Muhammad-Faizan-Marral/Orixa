/**
 * Public portfolio URLs for Orixa.
 *
 * Canonical (browser):
 *   https://orixaai.me/{username}/{portfolioSlug}
 *
 * Share / copy:
 *   orixaai.me/{username}/{portfolioSlug}
 *
 * Production env:
 *   NEXT_PUBLIC_SITE_URL=https://orixaai.me
 *   (or https://www.orixaai.me if you prefer www)
 */

export const BRAND_DOMAIN = "orixaai.me";
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

/** Path only: /username/slug */
export function publicInternalPath(
  username: string,
  portfolioSlug?: string | null,
): string {
  const u = username.trim().toLowerCase();
  if (portfolioSlug && portfolioSlug.trim()) {
    return `/${u}/${portfolioSlug.trim().toLowerCase()}`;
  }
  return `/${u}`;
}

/** Display: orixaai.me/username/slug */
export function publicPathDisplay(
  username: string,
  portfolioSlug?: string | null,
): string {
  return `${BRAND_DOMAIN}${publicInternalPath(username, portfolioSlug)}`;
}

export function publicSharePath(
  username: string,
  portfolioSlug?: string | null,
): string {
  return publicPathDisplay(username, portfolioSlug);
}

/** Full URL for copy / share / OG */
export function publicAbsoluteUrl(
  username: string,
  portfolioSlug?: string | null,
): string {
  return `${getSiteOrigin()}${publicInternalPath(username, portfolioSlug)}`;
}

export function publicProfileDisplay(username: string): string {
  return publicPathDisplay(username, null);
}

export function publicProfileAbsoluteUrl(username: string): string {
  return publicAbsoluteUrl(username, null);
}
