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

  // ONLY users who actually PAID for Premium (Polar), not referral-unlocked free Premium
  const paidPremiumUsers = referredUsers.filter(
    (u) =>
      u.isPremium &&
      (("polarSubscriptionId" in u && Boolean(u.polarSubscriptionId)) ||
        ("polarCustomerId" in u && Boolean(u.polarCustomerId))),
  );

  const premiumCount = paidPremiumUsers.length;

  const premiumBuyers = paidPremiumUsers.map((u) => ({
    username: u.username,
    plan: "premium" as const,
  }));

  return (
    <ReferAndEarnClient
      referralCode={referralCode ?? ""}
      totalSignups={totalSignups}
      premiumCount={premiumCount}
      premiumBuyers={premiumBuyers}
      priceMonthly={BILLING.PRICE_MONTHLY}
      priceYearly={BILLING.PRICE_YEARLY}
      commissionRate={0.2}
      minWithdraw={20}
    />
  );
}