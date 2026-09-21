export const REFERRAL_COOKIE = "orixa_ref";
export const REFERRAL_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function buildReferralUrl(code: string, baseUrl?: string): string {
  const base =
    baseUrl ||
    (typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL) ||
    "https://orixaai.me";
  return `${base.replace(/\/$/, "")}/auth/signup?ref=${encodeURIComponent(code)}`;
}