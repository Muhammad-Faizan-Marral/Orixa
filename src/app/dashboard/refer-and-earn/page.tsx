import { requireProfile } from "@/lib/auth/require-profile";
import { profileRepository } from "@/repositories/profile.repository";
import { billingService } from "@/services/billing/billing.service";
import { BILLING } from "@/constants/billing";
import { ReferAndEarnClient } from "@/features/referral/refer-and-earn-client";

export const metadata = {
  title: "Refer & Earn",
  robots: { index: false, follow: false },
};

/**
 * Infer monthly vs yearly from premiumUntil.
 * - ~30 days  → monthly ($9)
 * - ~365 days → yearly ($69)
 * Discounted $60 skipped for now (treated as yearly $69 if long period).
 */
function inferPlanAndAmount(premiumUntil: string | null): {
  plan: "monthly" | "yearly";
  paidAmountUsd: number;
} {
  if (!premiumUntil) {
    return {
      plan: "monthly",
      paidAmountUsd: BILLING.PRICE_MONTHLY,
    };
  }

  const untilMs = new Date(premiumUntil).getTime();
  if (Number.isNaN(untilMs)) {
    return {
      plan: "monthly",
      paidAmountUsd: BILLING.PRICE_MONTHLY,
    };
  }

  const daysLeft = (untilMs - Date.now()) / (1000 * 60 * 60 * 24);

  // > 90 days ⇒ treat as yearly ($69). Else monthly ($9).
  if (daysLeft > 90) {
    return {
      plan: "yearly",
      paidAmountUsd: BILLING.PRICE_YEARLY, // 69
    };
  }

  return {
    plan: "monthly",
    paidAmountUsd: BILLING.PRICE_MONTHLY, // 9
  };
}

export default async function ReferAndEarnPage() {
  const profile = await requireProfile();

  const referralCode =
    profile.referralCode ??
    (await billingService.ensureReferralCode(
      profile.userId,
      profile.username,
    ));

  const referredUsers = await profileRepository.findReferredBy(profile.id);
  const totalSignups = referredUsers.length;

  // Only Polar-paid Premium (not free referral unlock)
  const paidPremiumUsers = referredUsers.filter(
    (u) =>
      u.isPremium &&
      (Boolean(u.polarSubscriptionId) || Boolean(u.polarCustomerId)),
  );

  const premiumBuyers = paidPremiumUsers.map((u) => {
    const { plan, paidAmountUsd } = inferPlanAndAmount(u.premiumUntil ?? null);

    return {
      paymentId: u.polarSubscriptionId ?? u.polarCustomerId ?? u.id,
      username: u.username,
      plan,
      paymentStatus: "paid" as const,
      paidAmountUsd,
      isFirstPremiumPayment: true,
    };
  });

  return (
    <ReferAndEarnClient
      referralCode={referralCode ?? ""}
      totalSignups={totalSignups}
      premiumCount={premiumBuyers.length}
      premiumBuyers={premiumBuyers}
      priceMonthly={BILLING.PRICE_MONTHLY}
      priceYearly={BILLING.PRICE_YEARLY}
      commissionRate={0.2}
      minWithdraw={20}
    />
  );
}