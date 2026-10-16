"use client";

import { useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
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

/* All three steps are visible at once: nothing hidden, nothing auto-moving. */
const steps = [
  {
    title: "Share your link",
    text: "Send it to a friend, colleague or community.",
  },
  {
    title: "They buy Premium",
    text: "Their first paid Premium payment qualifies.",
  },
  {
    title: "You get paid",
    text: "Request a payout once you reach the minimum.",
  },
];

const counts = [
  "First successful paid Premium payment",
  "Payment verified by Orixa",
];

const doesNotCount = [
  "Renewals",
  "Free referral unlocks",
  "Failed or refunded payments",
];

/* Icons are inline so no extra dependency is needed. */
function Check({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`size-4 shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m4 10.5 4 4 8-9" />
    </svg>
  );
}

function Cross({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`size-4 shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="m5 5 10 10M15 5 5 15" />
    </svg>
  );
}

function Shield({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`size-4 shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 2.5 4 5v5c0 3.6 2.4 6.2 6 7.5 3.6-1.3 6-3.9 6-7.5V5l-6-2.5Z" />
      <path d="m7.5 10 1.8 1.8 3.2-3.6" />
    </svg>
  );
}

export function ReferAndEarnClient({
  referralCode,
  totalSignups,
  premiumBuyers,
  commissionRate,
  minWithdraw,
}: Props) {
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);

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

  const progress =
    minWithdraw > 0 ? Math.min(1, estimatedCommission / minWithdraw) : 1;
  const remaining = Math.max(0, minWithdraw - estimatedCommission);

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

  async function shareLink() {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({
          title: "Join me on Orixa",
          text: "Try Orixa AI with my link.",
          url: referralUrl,
        });
        return;
      } catch {
        /* user cancelled: fall through to copy */
      }
    }
    copyLink();
  }

  /* One orchestrated entrance, nothing else moves on its own. */
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.07 } },
  };
  const item: Variants = {
    hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const card =
    "rounded-2xl border border-border bg-surface-1 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]";

  return (
    <motion.main
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6 sm:py-12"
    >
      {/* Header */}
      <motion.header variants={item} className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <Shield />
          Every payout is verified
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Share Orixa, earn {percentage}%
        </h1>
        <p className="max-w-xl text-[15px] leading-7 text-muted-foreground">
          When someone you refer makes their first paid Premium purchase, you
          earn {percentage}% of that payment. Simple, transparent, and
          tracked in real time.
        </p>
      </motion.header>

      {/* Referral link: the one hero element */}
      <motion.section
        variants={item}
        className={`${card} relative overflow-hidden p-5 sm:p-7`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-semibold">Your referral link</h2>
            <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              Code <span className="font-medium text-foreground">{referralCode}</span>
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <div className="min-w-0 flex-1 rounded-xl border border-border bg-surface-2 px-4 py-3.5">
              <p className="truncate text-sm" title={referralUrl}>
                {referralUrl}
              </p>
            </div>

            <div className="flex gap-2">
              <motion.button
                type="button"
                onClick={copyLink}
                whileTap={reduce ? undefined : { scale: 0.97 }}
                className="relative flex min-w-[8.5rem] flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-none"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? "done" : "idle"}
                    initial={{ opacity: 0, y: reduce ? 0 : 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reduce ? 0 : -6 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-2"
                  >
                    {copied && <Check />}
                    {copied ? "Copied" : "Copy link"}
                  </motion.span>
                </AnimatePresence>
              </motion.button>

              <button
                type="button"
                onClick={shareLink}
                className="rounded-xl border border-border px-4 py-3.5 text-sm font-medium transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Share
              </button>
            </div>
          </div>

          <p
            role="status"
            aria-live="polite"
            className="mt-2 min-h-[1rem] text-xs text-muted-foreground"
          >
            {copied && "Link copied. Ready to share."}
            {copyError &&
              "Copy failed. Select the link and copy it manually."}
          </p>
        </div>
      </motion.section>

      {/* How it works: all visible, no carousel */}
      <motion.section variants={item} className={`${card} p-5 sm:p-7`}>
        <h2 className="text-base font-semibold">How it works</h2>

        <ol className="mt-5 grid gap-5 sm:grid-cols-3 sm:gap-6">
          {steps.map((step, index) => (
            <li key={step.title} className="relative flex gap-4 sm:block">
              {/* connector line (desktop) */}
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-[2.6rem] right-[-1.5rem] top-[1.1rem] hidden h-px bg-border sm:block"
                />
              )}
              <span className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface-2 text-sm font-medium tabular-nums">
                {index + 1}
              </span>
              <div className="sm:mt-4">
                <h3 className="text-[15px] font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* Eligibility: clear at a glance, so no rule is missed */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4">
            <p className="text-sm font-medium">What earns commission</p>
            <ul className="mt-3 space-y-2">
              {counts.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <Check className="mt-0.5 text-emerald-500" />
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-surface-2/60 p-4">
            <p className="text-sm font-medium">What does not</p>
            <ul className="mt-3 space-y-2">
              {doesNotCount.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <Cross className="mt-0.5 text-muted-foreground/70" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Metrics */}
      <motion.section
        variants={item}
        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
      >
        <div className={`${card} p-5`}>
          <p className="text-sm text-muted-foreground">Referred signups</p>
          <p className="mt-3 text-3xl font-semibold tabular-nums">
            {totalSignups}
          </p>
        </div>

        <div className={`${card} p-5`}>
          <p className="text-sm text-muted-foreground">Paid purchases</p>
          <p className="mt-3 text-3xl font-semibold tabular-nums">
            {paidCount}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Free unlocks excluded
          </p>
        </div>

        <div className={`${card} p-5`}>
          <p className="text-sm text-muted-foreground">Estimated commission</p>
          <p className="mt-3 text-3xl font-semibold tabular-nums">
            {money(estimatedCommission)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Pending verification
          </p>
        </div>
      </motion.section>

      {/* Payout progress */}
      <motion.section variants={item} className={`${card} p-5 sm:p-7`}>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold">Payout progress</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {remaining > 0
                ? `${money(remaining)} more to reach the ${money(minWithdraw)} minimum.`
                : "You have reached the minimum. You can request a payout."}
            </p>
          </div>
          <p className="text-sm tabular-nums text-muted-foreground">
            {money(estimatedCommission)} / {money(minWithdraw)}
          </p>
        </div>

        <div
          className="mt-4 h-2 overflow-hidden rounded-full bg-surface-2"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          aria-label="Progress toward minimum payout"
        >
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: reduce ? `${progress * 100}%` : 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          />
        </div>

        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          Estimated rewards are not an approved balance. Final amounts depend
          on the verified payment and program rules.
        </p>
      </motion.section>

      {/* Ledger */}
      <motion.section variants={item} className={`${card} p-5 sm:p-7`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">Paid Premium buyers</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Only eligible, successful purchases appear here.
            </p>
          </div>
          <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            {paidCount} eligible
          </span>
        </div>

        {eligiblePurchases.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-border px-4 py-10 text-center">
            <p className="text-sm font-medium">No qualifying purchases yet</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
              Share your link to get started. Free referral unlocks do not
              earn commission.
            </p>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {eligiblePurchases.map((buyer) => (
              <li
                key={buyer.paymentId}
                className="flex flex-wrap items-center justify-between gap-3 py-3.5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface-2 text-xs font-medium uppercase">
                    {buyer.username.slice(0, 2)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      @{buyer.username}
                    </p>
                    <p className="mt-0.5 text-xs capitalize text-muted-foreground">
                      {buyer.plan === "premium" ? "Premium" : buyer.plan}, paid{" "}
                      {money(buyer.paidAmountUsd)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold tabular-nums">
                    {money(buyer.paidAmountUsd * rate)}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Est. commission
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </motion.section>

      {/* Payout rules: expands with smooth height animation */}
      <motion.section variants={item} className={card}>
        <button
          type="button"
          onClick={() => setRulesOpen((open) => !open)}
          aria-expanded={rulesOpen}
          className="flex w-full items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-7"
        >
          Payout rules and how to request payment
          <motion.span
            animate={{ rotate: rulesOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-muted-foreground"
            aria-hidden="true"
          >
            ↓
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {rulesOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.28, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="space-y-3 border-t border-border px-5 pb-6 pt-4 text-sm leading-6 text-muted-foreground sm:px-7">
                <p>
                  <span className="font-medium text-foreground">
                    Commission:
                  </span>{" "}
                  {percentage}% of the first qualifying paid Premium payment
                  only. Renewals and free referral unlocks do not qualify.
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
                  from your Orixa account email and include your referral
                  code.
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    Verification:
                  </span>{" "}
                  Purchases are verified before payout. Failed or refunded
                  transactions are not eligible. Contact support if a
                  qualifying purchase seems to be missing.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </motion.main>
  );
}