export const BILLING = {
  FREE_PORTFOLIO_LIMIT: 1,
  PREMIUM_PORTFOLIO_LIMIT: 20,
  REFERRALS_FOR_PREMIUM: 20,
  REFERRAL_PREMIUM_DAYS: 365,
  WATERMARK_TEXT: "Built with OrixaAi",

  /** Pricing (USD) */
  PRICE_MONTHLY: 6,
  PRICE_YEARLY: 50,

  /**
   * Free Design DNAs — sab preview + apply kar sakte hain
   */
  FREE_THEMES: ["minimal-airy", "tech-dense", "editorial"] as const,

  /**
   * Premium Design DNAs — free users preview kar sakte hain, apply/save nahi
   */
  PREMIUM_THEMES: [
    "soft-luxury",
    "neo-glass",
    "brutalist",
    "cinematic",
  ] as const,
} as const;

export const FREE_THEMES = BILLING.FREE_THEMES;
export const PREMIUM_THEMES = BILLING.PREMIUM_THEMES;
export const PRICE_MONTHLY = BILLING.PRICE_MONTHLY;
export const PRICE_YEARLY = BILLING.PRICE_YEARLY;

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

export function isPremiumDna(dna: string): boolean {
  return (BILLING.PREMIUM_THEMES as readonly string[]).includes(dna);
}

export const isPremiumTheme = isPremiumDna;
