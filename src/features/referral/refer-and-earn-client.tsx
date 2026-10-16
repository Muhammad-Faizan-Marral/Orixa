
"use client";

import { useState } from "react";
import { buildReferralUrl } from "@/lib/referral";

type PremiumBuyer = {
  username: string;
  plan: "premium" | "monthly" | "yearly";
};

type Props = {
  referralCode: string;
  totalSignups: number;
  premiumCount: number;
  premiumBuyers: PremiumBuyer[];
  priceMonthly: number;
  priceYearly: number;
  commissionRate: number;
  minWithdraw: number;
};

function formatUSD(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function ReferAndEarnClient({
  referralCode,
  totalSignups,
  premiumCount,
  premiumBuyers,
  priceMonthly,
  priceYearly,
  commissionRate,
  minWithdraw,
}: Props) {
  const [copyState, setCopyState] = useState<
    "idle" | "copied" | "error"
  >("idle");

  const url = buildReferralUrl(referralCode);

  const commissionPercent = Math.round(commissionRate * 100);
  const isFullCommission = Math.abs(commissionRate - 1) < 0.000001;

  // An estimate only: the exact plan and eligible payment
  // must be verified by the server before payout.
  const estimateMin =
    premiumCount * Math.min(priceMonthly, priceYearly) * commissionRate;

  const estimateMax =
    premiumCount * Math.max(priceMonthly, priceYearly) * commissionRate;

  const estimatedRewards =
    premiumCount === 0
      ? formatUSD(0)
      : `${formatUSD(estimateMin)} – ${formatUSD(estimateMax)}`;

  async function copyLink() {
    try {
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        const input = document.createElement("textarea");
        input.value = url;
        input.readOnly = true;
        input.style.position = "fixed";
        input.style.left = "-9999px";

        document.body.appendChild(input);
        input.select();

        const success = document.execCommand("copy");
        input.remove();

        if (!success) {
          throw new Error("Copy failed");
        }
      }

      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 2200);
    } catch {
      setCopyState("error");
    }
  }

  function getBuyerReward(plan: PremiumBuyer["plan"]) {
    if (plan === "monthly") {
      return formatUSD(priceMonthly * commissionRate);
    }

    if (plan === "yearly") {
      return formatUSD(priceYearly * commissionRate);
    }

    return null;
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-7 px-4 py-8 sm:px-6 lg:py-12">
      {/* Page introduction */}
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          ORIXA AI / REFERRAL PROGRAM
        </p>

        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Share Orixa. Earn from your referrals.
        </h1>

        <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Recommend Orixa AI to your network. When someone you refer
          completes their first eligible Premium payment, you earn{" "}
          {commissionPercent}% of that payment.
        </p>
      </header>

      {/* Commission details */}
      <section className="rounded-2xl border border-border bg-surface-1 p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-muted-foreground">
              Your referral reward
            </p>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-5xl font-semibold tracking-tight tabular-nums">
                {commissionPercent}%
              </span>
              <span className="text-sm text-muted-foreground">
                {isFullCommission
                  ? "of the first Premium payment"
                  : "commission on the first Premium payment"}
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Rewards are tied to eligible paid subscriptions, not simply
              to clicks or new account registrations.
            </p>
          </div>

          <div className="w-full shrink-0 rounded-xl border border-border bg-surface-2 p-4 sm:max-w-xs">
            <p className="text-xs font-medium text-muted-foreground">
              Current plan examples
            </p>

            <div className="mt-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Monthly</p>
                <p className="text-xs text-muted-foreground">
                  {formatUSD(priceMonthly)} payment
                </p>
              </div>

              <p className="text-lg font-semibold tabular-nums">
                {formatUSD(priceMonthly * commissionRate)}
              </p>
            </div>

            <div className="my-3 border-t border-border" />

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Yearly</p>
                <p className="text-xs text-muted-foreground">
                  {formatUSD(priceYearly)} payment
                </p>
              </div>

              <p className="text-lg font-semibold tabular-nums">
                {formatUSD(priceYearly * commissionRate)}
              </p>
            </div>

            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              Example rewards based on your configured commission rate.
              Actual rewards depend on the eligible payment received.
            </p>
          </div>
        </div>
      </section>

      {/* Personal referral link */}
      <section className="rounded-2xl border border-border bg-surface-1 p-5 sm:p-6">
        <div>
          <h2 className="text-base font-semibold">Your referral link</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Share this link with friends, colleagues, and your community.
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <div
            title={url}
            className="flex min-w-0 flex-1 items-center rounded-lg border border-border bg-surface-2 px-3 py-3"
          >
            <span className="truncate text-sm">{url}</span>
          </div>

          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {copyState === "copied" ? "Copied" : "Copy referral link"}
          </button>
        </div>

        {copyState === "copied" && (
          <p role="status" className="mt-2 text-sm text-muted-foreground">
            Referral link copied successfully.
          </p>
        )}

        {copyState === "error" && (
          <p role="status" className="mt-2 text-sm text-muted-foreground">
            Could not copy automatically. Please select and copy the link.
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <span className="text-xs text-muted-foreground">
            Your referral code
          </span>
          <code className="rounded-md border border-border bg-surface-2 px-2 py-1 text-xs font-medium">
            {referralCode}
          </code>
        </div>
      </section>

      {/* Referral dashboard */}
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Your referral activity</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Track signups, Premium purchases, and your estimated rewards.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-border bg-surface-1 p-5">
            <p className="text-sm text-muted-foreground">
              Referred signups
            </p>
            <p className="mt-3 text-3xl font-semibold tabular-nums">
              {totalSignups}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Accounts attributed to your referral
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface-1 p-5">
            <p className="text-sm text-muted-foreground">
              Premium purchases
            </p>
            <p className="mt-3 text-3xl font-semibold tabular-nums">
              {premiumCount}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Recorded purchases linked to your code
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface-1 p-5">
            <p className="text-sm text-muted-foreground">
              Estimated referral rewards
            </p>
            <p className="mt-3 break-words text-2xl font-semibold tabular-nums">
              {estimatedRewards}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              An estimate, not an approved payout balance. Your final
              reward depends on each plan and verified eligible payment.
            </p>
          </div>
        </div>
      </section>

      {/* Premium purchase transparency */}
      <section className="rounded-2xl border border-border bg-surface-1 p-5 sm:p-6">
        <div>
          <h2 className="text-base font-semibold">
            Premium purchases through your link
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Review the accounts attributed to your referral code.
            Final rewards are confirmed against eligible payments.
          </p>
        </div>

        {premiumBuyers.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-border p-6 text-center">
            <p className="text-sm font-medium">
              No Premium purchases recorded yet
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Your referral activity will appear here when Premium
              purchases are attributed to your code.
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[360px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="py-3 pr-4 font-medium">Account</th>
                  <th className="py-3 pr-4 font-medium">Plan</th>
                  <th className="py-3 text-right font-medium">
                    Est. reward
                  </th>
                </tr>
              </thead>

              <tbody>
                {premiumBuyers.map((buyer) => (
                  <tr
                    key={`${buyer.username}-${buyer.plan}`}
                    className="border-b border-border last:border-0"
                  >
                    <td className="py-3 pr-4 font-medium">
                      @{buyer.username}
                    </td>

                    <td className="py-3 pr-4 capitalize text-muted-foreground">
                      {buyer.plan === "premium" ? "Premium" : buyer.plan}
                    </td>

                    <td className="py-3 text-right font-medium tabular-nums">
                      {getBuyerReward(buyer.plan) ?? "To be verified"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          Listed amounts are estimates. They do not confirm payment
          settlement or payout approval.
        </p>
      </section>

      {/* Payout instructions */}
      <section className="rounded-2xl border border-border bg-surface-1 p-5 sm:p-6">
        <h2 className="text-base font-semibold">How payouts work</h2>

        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          We manually review payout requests against qualifying Premium
          payments to help ensure rewards are calculated correctly.
        </p>

        <ol className="mt-5 space-y-4">
          <li className="flex gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border text-xs font-semibold">
              1
            </span>
            <div>
              <p className="text-sm font-medium">Reach the minimum payout</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Your requested payout must meet the minimum of{" "}
                <strong className="font-semibold text-foreground">
                  {formatUSD(minWithdraw)}
                </strong>{" "}
                in approved rewards.
              </p>
            </div>
          </li>

          <li className="flex gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border text-xs font-semibold">
              2
            </span>
            <div>
              <p className="text-sm font-medium">Request your payout</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Email{" "}
                <a
                  href="mailto:contact@orixaai.me"
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  contact@orixaai.me
                </a>{" "}
                from the email address registered to your Orixa account.
              </p>
            </div>
          </li>

          <li className="flex gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border text-xs font-semibold">
              3
            </span>
            <div>
              <p className="text-sm font-medium">Include your referral code</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Include{" "}
                <code className="rounded border border-border px-1.5 py-0.5">
                  {referralCode}
                </code>{" "}
                and the amount you are requesting.
              </p>
            </div>
          </li>

          <li className="flex gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border text-xs font-semibold">
              4
            </span>
            <div>
              <p className="text-sm font-medium">Verification and payment</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                We verify eligible transactions and confirm the payout
                details with you before payment is sent.
              </p>
            </div>
          </li>
        </ol>
      </section>

      {/* Clear terms */}
      <section className="rounded-xl border border-border p-5">
        <h2 className="text-sm font-semibold">Important reward terms</h2>

        <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
          <li>
            • Commission applies to the first successful Premium payment
            only. Future subscription renewals are not included.
          </li>
          <li>
            • Creating an account or clicking a referral link alone does
            not earn a commission.
          </li>
          <li>
            • Failed, refunded, or reversed payments do not qualify as
            completed eligible purchases.
          </li>
          <li>
            • Estimated rewards can differ from the final approved amount
            until the underlying payment has been verified.
          </li>
        </ul>

        <p className="mt-4 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
          Questions about a referral or payout? Contact{" "}
          <a
            href="mailto:contact@orixaai.me"
            className="underline underline-offset-4"
          >
            contact@orixaai.me
          </a>
          .
        </p>
      </section>
    </main>
  );
}
