
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

const DISPLAY = "font-[family-name:var(--font-display,var(--font-dm))]";

const PERKS = [
  "Unlimited portfolios, completely watermark-free",
  "Access every Premium template, including upcoming designs",
  "Connect your own custom domain",
];

function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5 shrink-0 text-violet-600 dark:text-violet-300"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export function UpgradeCard({ profile }: Props) {
  const active = isPremiumActive(profile);

  if (active) {
    return (
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-violet-500/30 bg-violet-500/[0.05] p-5 sm:p-6">
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white">
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
            </svg>
          </span>

          <div className="min-w-0">
            <p
              className={`${DISPLAY} text-xl font-semibold tracking-tight text-foreground`}
            >
              Premium is active
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {profile.premiumUntil
                ? `Valid until ${new Date(
                    profile.premiumUntil
                  ).toLocaleDateString()}`
                : "Lifetime access"}
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-full bg-violet-600/10 px-3 py-1.5 text-sm font-semibold text-violet-700 dark:text-violet-300">
          Premium
        </span>
      </div>
    );
  }

  const referrals = profile.successfulReferrals ?? 0;
  const remaining = Math.max(
    0,
    BILLING.REFERRALS_FOR_PREMIUM - referrals
  );

  return (
    <div className="rounded-2xl border border-border bg-background p-5 sm:p-7">
      <div className="flex flex-col gap-7 sm:gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1 space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-300">
              Orixa AI Premium
            </p>

            <h2
              className={`${DISPLAY} text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl`}
            >
              Your portfolio. Your brand. Your domain.
            </h2>

            <p className="max-w-xl text-base leading-7 text-muted-foreground">
              Everything you need to create and showcase your work,
              without limits holding you back.
            </p>
          </div>

          <ul className="space-y-4">
            {PERKS.map((perk) => (
              <li
                key={perk}
                className="flex items-start gap-3 text-base leading-6 text-foreground"
              >
                <Check />
                <span>{perk}</span>
              </li>
            ))}
          </ul>

          {referrals > 0 && (
            <div className="max-w-md space-y-2 border-t border-border pt-4">
              <p className="text-sm font-medium text-foreground">
                Free Premium referral progress
              </p>

              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-violet-600 transition-all"
                  style={{
                    width: `${
                      BILLING.REFERRALS_FOR_PREMIUM > 0
                        ? (Math.min(
                            referrals,
                            BILLING.REFERRALS_FOR_PREMIUM
                          ) /
                            BILLING.REFERRALS_FOR_PREMIUM) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>

              <p className="text-sm text-muted-foreground">
                {remaining > 0
                  ? `${referrals}/${BILLING.REFERRALS_FOR_PREMIUM} successful referrals · ${remaining} more to unlock free Premium`
                  : "You've reached your referral target for free Premium!"}
              </p>
            </div>
          )}
        </div>

        <div className="flex w-full shrink-0 flex-col gap-4 rounded-xl border border-border bg-muted/20 p-5 sm:p-6 lg:w-[250px]">
          <div className="space-y-1">
            <p className="text-base font-medium text-muted-foreground">
              Yearly Premium
            </p>

            <p
              className={`${DISPLAY} text-4xl font-bold tracking-tight text-foreground`}
            >
              ${BILLING.PRICE_YEARLY}
              <span className="text-base font-normal text-muted-foreground">
                {" "}/ year
              </span>
            </p>

            <p className="text-sm text-muted-foreground">
              Just ${(BILLING.PRICE_YEARLY / 12).toFixed(2)} per month
              equivalent
            </p>
          </div>

          <UpgradeButton
            productKey="yearly"
            className="min-h-12 w-full whitespace-nowrap text-base"
          >
            Get Premium
          </UpgradeButton>

          <Link
            href="/pricing"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border px-4 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-foreground/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Compare plans
          </Link>

          <p className="text-center text-sm text-muted-foreground">
            Or earn Premium through referrals.
          </p>
        </div>
      </div>
    </div>
  );
}
