import Link from "next/link";
import { UpgradeButton } from "@/components/billing/upgrade-button";
import { isPremiumActive, BILLING } from "@/constants/billing";

type Props = {
  profile: {
    isPremium: boolean;
    premiumUntil: string | null;
    successfulReferrals?: number | null;
  };
};

export function UpgradeCard({ profile }: Props) {
  const active = isPremiumActive(profile);

  if (active) {
    return (
      <div className="rounded-xl border border-accent/30 bg-accent/5 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-accent">Premium active</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {profile.premiumUntil
                ? `Valid until ${new Date(profile.premiumUntil).toLocaleDateString()}`
                : "Lifetime access"}
            </p>
          </div>
          <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent">
            Premium
          </span>
        </div>
      </div>
    );
  }

  const referrals = profile.successfulReferrals ?? 0;
  const remaining = Math.max(0, BILLING.REFERRALS_FOR_PREMIUM - referrals);

  return (
    <div className="rounded-xl border border-border bg-surface-1 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">Upgrade to Premium</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Unlock 20 portfolios, remove watermark, and use all premium designs.
          </p>
          {referrals > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              Referral progress: {referrals}/{BILLING.REFERRALS_FOR_PREMIUM}
              {remaining > 0
                ? ` · ${remaining} more to unlock free`
                : " · almost there!"}
            </p>
          )}
        </div>

        <div className="flex flex-shrink-0 flex-col gap-2 sm:flex-row">
                    <UpgradeButton productKey="yearly" className="whitespace-nowrap">
            ${BILLING.PRICE_YEARLY} / year
          </UpgradeButton>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-md border border-border px-3 py-2 text-xs font-medium transition hover:bg-surface-2"
          >
            See plans
          </Link>
        </div>
      </div>
    </div>
  );
}
