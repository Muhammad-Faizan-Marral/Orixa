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

  // Ensure referral code exists
  const referralCode =
    profile.referralCode ??
    (await billingService.ensureReferralCode(profile.userId, profile.username));

  // All users who signed up with this user's referral
  const referredUsers = await profileRepository.findReferredBy(profile.id);

  const totalSignups = referredUsers.length;

  const premiumUsers = referredUsers.filter((u) => u.isPremium);
  const premiumCount = premiumUsers.length;

  // Frontend will calculate commission. We pass prices so UI can do 20%.
  const premiumBuyers = premiumUsers.map((u) => ({
    username: u.username,
    // We don't store monthly/yearly yet — show as "Premium"
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
