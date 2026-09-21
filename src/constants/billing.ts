export const BILLING = {
  FREE_PORTFOLIO_LIMIT: 1,
  PREMIUM_PORTFOLIO_LIMIT: 20,
  REFERRALS_FOR_PREMIUM: 20,
  REFERRAL_PREMIUM_DAYS: 365,
  WATERMARK_TEXT: "Built with OrixaAi",
} as const;

export type Plan = "free" | "premium";

export function getPortfolioLimit(isPremium: boolean): number {
  return isPremium
    ? BILLING.PREMIUM_PORTFOLIO_LIMIT
    : BILLING.FREE_PORTFOLIO_LIMIT;
}

export function isPremiumActive(profile: {
  isPremium: boolean;
  premiumUntil: string | null;
}): boolean {
  if (!profile.isPremium) return false;
  if (!profile.premiumUntil) return true;
  return new Date(profile.premiumUntil) > new Date();
}
