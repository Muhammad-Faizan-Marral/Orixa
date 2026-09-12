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

/** Display / copy / share: developer/developer/orixaai.me */
export function publicPathDisplay(
  username: string,
  portfolioSlug?: string | null,
): string {
  if (portfolioSlug && portfolioSlug.trim()) {
    return `${username}/${portfolioSlug.trim()}/${BRAND_DOMAIN}`;
  }
  return `${username}/${BRAND_DOMAIN}`;
}

export function publicSharePath(
  username: string,
  portfolioSlug?: string | null,
): string {
  return publicPathDisplay(username, portfolioSlug);
}

/** Real browser URL: https://orixaai.me/developer/developer */
export function publicAbsoluteUrl(
  username: string,
  portfolioSlug?: string | null,
): string {
  return `${getSiteOrigin()}${publicInternalPath(username, portfolioSlug)}`;
}

export function publicInternalPath(
  username: string,
  portfolioSlug?: string | null,
): string {
  if (portfolioSlug && portfolioSlug.trim()) {
    return `/${username}/${portfolioSlug.trim()}`;
  }
  return `/${username}`;
}