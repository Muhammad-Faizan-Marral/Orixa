
"use client";

import { useState } from "react";
import { BILLING } from "@/constants/billing";
import { buildReferralUrl } from "@/lib/referral";

type Props = {
  referralCode: string | null;
  successfulReferrals: number;
  isPremium: boolean;
};

const DISPLAY = "font-[family-name:var(--font-display,var(--font-dm))]";

export function ReferralCard({
  referralCode,
  successfulReferrals,
  isPremium,
}: Props) {
  const [copied, setCopied] = useState(false);

  if (!referralCode) {
    return null;
  }

  const url = buildReferralUrl(referralCode);
  const target = BILLING.REFERRALS_FOR_PREMIUM;
  const remaining = Math.max(0, target - successfulReferrals);

  const progress =
    target > 0
      ? Math.min(100, Math.round((successfulReferrals / target) * 100))
      : 0;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("textarea");
      input.value = url;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();

      const success = document.execCommand("copy");
      document.body.removeChild(input);

      if (success) {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      }
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/[0.06] via-background to-background p-6 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12">
        {/* Referral offer and progress */}
        <div className="space-y-7">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-300">
              Refer & Earn
            </p>

            <h2
              className={`${DISPLAY} text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl`}
            >
              Share Orixa. Unlock Premium.
            </h2>

            <p className="max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
              Invite friends to create and publish their portfolios.
              Reach your referral goal and enjoy Premium for free.
            </p>
          </div>

          <div className="space-y-4 rounded-xl border border-border bg-background/80 p-5 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">
                  Successful referrals
                </p>

                <p
                  className={`${DISPLAY} mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl`}
                >
                  {successfulReferrals}
                  <span className="text-lg font-medium text-muted-foreground">
                    {" "}
                    / {target}
                  </span>
                </p>
              </div>

              {isPremium ? (
                <span className="rounded-full bg-violet-600/10 px-3 py-2 text-sm font-semibold text-violet-700 dark:text-violet-300">
                  Premium active
                </span>
              ) : remaining > 0 ? (
                <span className="rounded-full bg-muted px-3 py-2 text-sm font-medium text-muted-foreground">
                  {remaining} to go
                </span>
              ) : (
                <span className="rounded-full bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  Goal reached
                </span>
              )}
            </div>

            <div
              role="progressbar"
              aria-label="Referral progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              className="h-2.5 overflow-hidden rounded-full bg-foreground/[0.08]"
            >
              <div
                className="h-full rounded-full bg-violet-600 transition-[width] duration-500 dark:bg-violet-400"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-sm leading-6 text-muted-foreground">
              {isPremium
                ? "Your Premium access is active. Keep sharing Orixa with others."
                : remaining > 0
                  ? `${remaining} more successful ${
                      remaining === 1 ? "referral" : "referrals"
                    } to unlock ${BILLING.REFERRAL_PREMIUM_DAYS} days of free Premium.`
                  : `You've reached your referral goal for ${BILLING.REFERRAL_PREMIUM_DAYS} days of free Premium.`}
            </p>
          </div>
        </div>

        {/* Referral link */}
        <div className="flex flex-col gap-5 rounded-xl border border-border bg-background p-5 sm:p-6">
          <div className="space-y-2">
            <h3
              className={`${DISPLAY} text-xl font-semibold tracking-tight text-foreground sm:text-2xl`}
            >
              Your invite link
            </h3>

            <p className="text-base leading-6 text-muted-foreground">
              Share your personal link with friends and help them launch
              their portfolios.
            </p>
          </div>

          <div className="space-y-3">
            <div className="min-w-0 rounded-xl border border-border bg-muted/40 px-4 py-3.5">
              <p className="truncate font-mono text-sm text-foreground sm:text-base">
                {url}
              </p>
            </div>

            <button
              type="button"
              onClick={copyLink}
              aria-live="polite"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {copied ? (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    className="size-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m5 12 4 4L19 6" />
                  </svg>
                  Link copied
                </>
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    className="size-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy referral link
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
            <span className="text-sm text-muted-foreground">
              Your referral code
            </span>

            <button
              type="button"
              onClick={() => {
                void navigator.clipboard
                  .writeText(referralCode)
                  .then(() => {
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 2000);
                  })
                  .catch(() => {
                    void copyLink();
                  });
              }}
              className="rounded-lg bg-muted px-3 py-2 font-mono text-sm font-semibold text-foreground transition-colors hover:bg-foreground/10"
              title="Copy referral code"
            >
              {referralCode}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
