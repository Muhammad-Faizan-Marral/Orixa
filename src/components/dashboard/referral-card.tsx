"use client";

import { useState } from "react";
import { BILLING } from "@/constants/billing";
import { buildReferralUrl } from "@/lib/referral";

type Props = {
  referralCode: string | null;
  successfulReferrals: number;
  isPremium: boolean;
};

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
  const remaining = Math.max(
    0,
    BILLING.REFERRALS_FOR_PREMIUM - successfulReferrals,
  );
  const progress = Math.min(
    100,
    Math.round((successfulReferrals / BILLING.REFERRALS_FOR_PREMIUM) * 100),
  );

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-surface-1 p-5">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-semibold">
            Invite friends · Get Premium free
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Share your link. When {BILLING.REFERRALS_FOR_PREMIUM} people sign up
            and publish a portfolio, you unlock Premium for{" "}
            {BILLING.REFERRAL_PREMIUM_DAYS} days — free.
          </p>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {successfulReferrals} / {BILLING.REFERRALS_FOR_PREMIUM} referrals
            </span>
            {isPremium ? (
              <span className="font-medium text-accent">Premium unlocked</span>
            ) : remaining > 0 ? (
              <span className="text-muted-foreground">
                {remaining} more needed
              </span>
            ) : (
              <span className="font-medium text-accent">Ready!</span>
            )}
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex-1 truncate rounded-md border border-border bg-surface-2 px-3 py-2 text-xs text-muted-foreground">
            {url}
          </div>
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition hover:opacity-90"
          >
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>

        <p className="text-[11px] text-muted-foreground/70">
          Code: <span className="font-mono">{referralCode}</span>
        </p>
      </div>
    </div>
  );
}
