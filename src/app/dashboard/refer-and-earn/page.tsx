import { requireProfile } from "@/lib/auth/require-profile";
import { profileRepository } from "@/repositories/profile.repository";
import { billingService } from "@/services/billing/billing.service";
import { BILLING } from "@/constants/billing";
import { ReferAndEarnClient } from "@/features/referral/refer-and-earn-client";

export const metadata = {
  title: "Refer & Earn",
  robots: { index: false, follow: false },
};

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

  // Only users who actually PAID via Polar (not free referral unlock)
  const paidPremiumUsers = referredUsers.filter(
    (u) =>
      u.isPremium &&
      (Boolean(u.polarSubscriptionId) || Boolean(u.polarCustomerId)),
  );

  // Map to the shape expected by ReferAndEarnClient
  // We don't have a payments ledger yet, so:
  // - paymentId: stable synthetic id from profile
  // - plan: "premium" until we store monthly/yearly
  // - paidAmountUsd: use yearly as upper estimate is wrong for commission;
  //   use monthly as conservative default, or yearly if you prefer.
  //   Admin still verifies final amount on payout.
  const premiumBuyers = paidPremiumUsers.map((u) => ({
    paymentId: u.polarSubscriptionId ?? u.polarCustomerId ?? u.id,
    username: u.username,
    plan: "premium" as const,
    paymentStatus: "paid" as const,
    // Conservative estimate until real order amount is stored
    paidAmountUsd: BILLING.PRICE_MONTHLY,
    isFirstPremiumPayment: true,
  }));

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