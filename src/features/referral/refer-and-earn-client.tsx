
"use client";

import { useEffect, useMemo, useState } from "react";
import { buildReferralUrl } from "@/lib/referral";

type PremiumBuyer = {
  paymentId: string;
  username: string;
  plan: "monthly" | "yearly" | "premium";
  paymentStatus: "paid" | "pending" | "refunded" | "free";
  paidAmountUsd: number;
  isFirstPremiumPayment: boolean;
};

type Props = {
  referralCode: string;
  totalSignups: number;
  premiumCount: number; // Legacy prop; the eligible records below drive the UI.
  premiumBuyers: PremiumBuyer[];
  priceMonthly: number;
  priceYearly: number;
  commissionRate: number;
  minWithdraw: number;
};

const money = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);

const steps = [
  {
    number: "01",
    eyebrow: "SHARE",
    title: "Send your personal link.",
    description:
      "Share Orixa with a friend, colleague, or your community. Your link tracks their referral.",
  },
  {
    number: "02",
    eyebrow: "EARN",
    title: "They pay for Premium.",
    description:
      "Only a successful first paid Premium purchase qualifies. Free referral unlocks and renewals do not count.",
  },
  {
    number: "03",
    eyebrow: "GET PAID",
    title: "Your reward is calculated.",
    description:
      "Your commission is based on the eligible payment. Request a payout after reaching the minimum threshold.",
  },
];

export function ReferAndEarnClient({
  referralCode,
  totalSignups,
  premiumBuyers,
  commissionRate,
  minWithdraw,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [paused, setPaused] = useState(false);

  const referralUrl = buildReferralUrl(referralCode);
  const rate = Math.min(1, Math.max(0, commissionRate));
  const percentage = Math.round(rate * 100);

  // Defense-in-depth for display only. The server must also enforce
  // eligibility before passing records to this component.
  const eligiblePurchases = useMemo(
    () =>
      premiumBuyers.filter(
        (buyer) =>
          buyer.paymentStatus === "paid" &&
          buyer.isFirstPremiumPayment === true &&
          Number.isFinite(buyer.paidAmountUsd) &&
          buyer.paidAmountUsd > 0,
      ),
    [premiumBuyers],
  );

  const paidCount = eligiblePurchases.length;

  const estimatedCommission = useMemo(
    () =>
      eligiblePurchases.reduce(
        (total, buyer) => total + buyer.paidAmountUsd * rate,
        0,
      ),
    [eligiblePurchases, rate],
  );

  // Gentle auto-advance, paused while the user is interacting.
  useEffect(() => {
    if (paused) return;

    const timer = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % steps.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [paused]);

  async function copyLink() {
    setCopyError(false);

    try {
      try {
        await navigator.clipboard.writeText(referralUrl);
      } catch {
        const input = document.createElement("textarea");
        input.value = referralUrl;
        input.style.position = "fixed";
        input.style.left = "-9999px";
        document.body.appendChild(input);
        input.select();

        const success = document.execCommand("copy");
        input.remove();

        if (!success) throw new Error("Copy failed");
      }

      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopyError(true);
    }
  }

  function moveStep(direction: -1 | 1) {
    setActiveStep(
      (current) => (current + direction + steps.length) % steps.length,
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-7 px-4 py-8 sm:px-6 sm:py-10">
      <style jsx>{`
        @keyframes referralSlide {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .referral-slide {
          animation: referralSlide 420ms ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .referral-slide {
            animation: none;
          }
        }
      `}</style>

      {/* Compact introduction */}
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          ORIXA AI / REFERRALS
        </p>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Share Orixa. Earn rewards.
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Earn {percentage}% of an eligible first paid Premium payment
              from someone you refer.
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            Minimum payout{" "}
            <span className="font-semibold text-foreground">
              {money(minWithdraw)}
            </span>
          </p>
        </div>
      </header>

      {/* Main referral link */}
      <section className="rounded-2xl border border-border bg-surface-1 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">Your referral link</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              One link. Easy to share.
            </p>
          </div>

          <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            Code: {referralCode}
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-surface-2 px-3 py-3">
            <p className="truncate text-sm" title={referralUrl}>
              {referralUrl}
            </p>
          </div>

          <button
            type="button"
            onClick={copyLink}
            className="rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {copied ? "Copied ✓" : "Copy link"}
          </button>
        </div>

        {copied && (
          <p role="status" className="mt-2 text-xs text-muted-foreground">
            Link copied. Ready to share.
          </p>
        )}

        {copyError && (
          <p role="status" className="mt-2 text-xs text-muted-foreground">
            Copy failed. Please select the link and copy it manually.
          </p>
        )}
      </section>

      {/* Three-step animated walkthrough */}
      <section
        className="overflow-hidden rounded-2xl border border-border bg-surface-1"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setPaused(false);
          }
        }}
        aria-label="How referral rewards work"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
          <p className="text-sm font-medium">How it works</p>
          <p className="text-xs tabular-nums text-muted-foreground">
            {String(activeStep + 1).padStart(2, "0")} / 03
          </p>
        </div>

        <div
          key={activeStep}
          className="referral-slide grid min-h-[210px] items-center gap-6 p-5 sm:grid-cols-[100px_1fr] sm:p-7"
        >
          <div className="flex size-[76px] items-center justify-center rounded-2xl border border-border bg-surface-2">
            <span className="text-2xl font-light tabular-nums">
              {steps[activeStep].number}
            </span>
          </div>

          <div>
            <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground">
              {steps[activeStep].eyebrow}
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
              {steps[activeStep].title}
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              {steps[activeStep].description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border px-5 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <button
                key={step.number}
                type="button"
                onClick={() => setActiveStep(index)}
                aria-label={`Show step ${index + 1}: ${step.eyebrow}`}
                aria-current={activeStep === index ? "step" : undefined}
                className={`h-1.5 rounded-full transition-all ${
                  activeStep === index
                    ? "w-8 bg-foreground"
                    : "w-3 bg-border hover:bg-muted-foreground"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => moveStep(-1)}
              aria-label="Previous step"
              className="flex size-9 items-center justify-center rounded-full border border-border text-sm transition-colors hover:bg-surface-2"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => moveStep(1)}
              aria-label="Next step"
              className="flex size-9 items-center justify-center rounded-full border border-border text-sm transition-colors hover:bg-surface-2"
            >
              →
            </button>
          </div>
        </div>
      </section>

      {/* Three compact metrics */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border p-4 sm:p-5">
          <p className="text-sm text-muted-foreground">Referred signups</p>
          <p className="mt-3 text-3xl font-semibold tabular-nums">
            {totalSignups}
          </p>
        </div>

        <div className="rounded-xl border border-border p-4 sm:p-5">
          <p className="text-sm text-muted-foreground">
            Paid Premium purchases
          </p>
          <p className="mt-3 text-3xl font-semibold tabular-nums">
            {paidCount}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Free referral unlocks excluded
          </p>
        </div>

        <div className="rounded-xl border border-border p-4 sm:p-5">
          <p className="text-sm text-muted-foreground">
            Estimated commission
          </p>
          <p className="mt-3 text-3xl font-semibold tabular-nums">
            {money(estimatedCommission)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Pending payment verification
          </p>
        </div>
      </section>

      {/* Transparent paid-purchase ledger */}
      <section className="rounded-2xl border border-border bg-surface-1 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold">
              Paid Premium buyers via your link
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Only eligible, successful paid purchases appear here.
            </p>
          </div>

          <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            {paidCount} eligible
          </span>
        </div>

        {eligiblePurchases.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-border px-4 py-8 text-center">
            <p className="text-sm font-medium">
              No qualifying paid purchases yet
            </p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
              Share your link. Free referral unlocks do not earn commission.
            </p>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-border">
            {eligiblePurchases.map((buyer) => (
              <div
                key={buyer.paymentId}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    @{buyer.username}
                  </p>
                  <p className="mt-1 text-xs capitalize text-muted-foreground">
                    {buyer.plan === "premium" ? "Premium" : buyer.plan} ·{" "}
                    {money(buyer.paidAmountUsd)} paid
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold tabular-nums">
                    {money(buyer.paidAmountUsd * rate)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Est. commission
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          Estimated rewards are not an approved payout balance. Final
          amounts depend on the verified eligible payment and the program
          rules.
        </p>
      </section>

      {/* Less visible detail; users can open when needed */}
      <details className="group rounded-xl border border-border px-5">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-4 text-sm font-medium">
          Payout rules and eligibility
          <span className="text-muted-foreground transition-transform group-open:rotate-180">
            ↓
          </span>
        </summary>

        <div className="space-y-3 border-t border-border pb-5 pt-4 text-sm leading-6 text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">
              Commission:
            </span>{" "}
            {percentage}% of the first qualifying paid Premium payment only.
            Renewals and free referral unlocks do not qualify.
          </p>

          <p>
            <span className="font-medium text-foreground">
              Minimum payout:
            </span>{" "}
            {money(minWithdraw)} in approved rewards.
          </p>

          <p>
            <span className="font-medium text-foreground">
              Request payment:
            </span>{" "}
            Email{" "}
            <a
              href="mailto:contact@orixaai.me"
              className="text-foreground underline underline-offset-4"
            >
              contact@orixaai.me
            </a>{" "}
            from your Orixa account email and include your referral code.
          </p>

          <p>
            Purchases are verified before payout. Failed or refunded
            transactions are not eligible. Contact support if a qualifying
            purchase appears to be missing.
          </p>
        </div>
      </details>
    </main>
  );
}
