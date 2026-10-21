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

const DISPLAY = "font-[family-name:var(--font-display,var(--font-dm))]";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

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

  const card = "rounded-2xl border border-border bg-background";

  return (
    <motion.main
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8 sm:px-6 sm:py-12"
    >
      {/* Header */}
      <motion.header variants={item} className="space-y-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          <Shield />
          Every payout is verified
        </div>

        <h1
          className={`${DISPLAY} max-w-2xl text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-6xl`}
        >
          Share Orixa, earn {percentage}%
        </h1>

        <p className="max-w-[54ch] text-base leading-7 text-muted-foreground">
          When someone you refer makes their first paid Premium purchase, you
          earn {percentage}% of that payment. Simple, transparent, and tracked
          in real time.
        </p>
      </motion.header>

      {/* Referral link: the hero */}
      <motion.section
        variants={item}
        aria-labelledby="referral-link-title"
        className="space-y-5 rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/[0.1] via-violet-500/[0.04] to-transparent p-5 sm:p-7"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2
            id="referral-link-title"
            className={`${DISPLAY} text-xl font-semibold tracking-tight text-foreground`}
          >
            Your referral link
          </h2>
          <span className="rounded-full bg-background px-3 py-1 text-xs text-muted-foreground ring-1 ring-border">
            Code{" "}
            <span className="font-mono font-medium text-foreground">
              {referralCode}
            </span>
          </span>
        </div>

        <div className="flex flex-col gap-2.5 sm:flex-row">
          <div className="min-w-0 flex-1 rounded-xl border border-border bg-background px-4 py-3.5">
            <p
              className="truncate font-mono text-sm text-foreground"
              title={referralUrl}
            >
              {referralUrl}
            </p>
          </div>

          <div className="flex gap-2.5">
            <motion.button
              type="button"
              onClick={copyLink}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              className={`flex min-w-[8.5rem] flex-1 items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-3.5 text-sm font-medium text-background transition-opacity hover:opacity-90 sm:flex-none ${FOCUS}`}
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
              className={`rounded-xl border border-violet-500/35 bg-background px-5 py-3.5 text-sm font-medium text-violet-700 transition-colors hover:bg-violet-500/10 dark:text-violet-300 ${FOCUS}`}
            >
              Share
            </button>
          </div>
        </div>

        <p
          role="status"
          aria-live="polite"
          className="min-h-[1rem] text-xs text-muted-foreground"
        >
          {copied && "Link copied. Ready to share."}
          {copyError && "Copy failed. Select the link and copy it manually."}
        </p>
      </motion.section>

      {/* How it works + earnings */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <motion.section
          variants={item}
          className={`${card} space-y-7 p-5 sm:p-7`}
        >
          <h2
            className={`${DISPLAY} text-xl font-semibold tracking-tight text-foreground`}
          >
            How it works
          </h2>

          <ol>
            {steps.map((step, index) => (
              <li
                key={step.title}
                className={`relative flex gap-4 ${
                  index < steps.length - 1 ? "pb-6" : ""
                }`}
              >
                {index < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-[17px] top-10 w-px bg-border"
                  />
                )}
                <span
                  aria-hidden="true"
                  className={`${DISPLAY} relative flex size-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-sm font-semibold tabular-nums text-violet-700 dark:bg-violet-400/15 dark:text-violet-300`}
                >
                  {index + 1}
                </span>
                <div className="pt-1">
                  <h3 className="text-[15px] font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-0.5 text-sm leading-6 text-muted-foreground">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] p-4">
              <p className="text-sm font-semibold text-foreground">
                What earns commission
              </p>
              <ul className="mt-3 space-y-2">
                {counts.map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-2 text-sm text-foreground/75"
                  >
                    <Check className="mt-0.5 text-emerald-600 dark:text-emerald-400" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-foreground/[0.025] p-4">
              <p className="text-sm font-semibold text-foreground">
                What does not
              </p>
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

        <motion.section
          variants={item}
          aria-label="Your earnings"
          className="flex flex-col overflow-hidden rounded-2xl border border-border"
        >
          <div className="bg-violet-500/[0.08] p-6 dark:bg-violet-400/[0.1]">
            <p className="text-small text-foreground/70">
              Estimated commission
            </p>
            <p
              className={`${DISPLAY} mt-1 text-5xl font-semibold leading-none tracking-[-0.04em] tabular-nums text-violet-700 dark:text-violet-300 sm:text-6xl`}
            >
              {money(estimatedCommission)}
            </p>
            <p className="text-small mt-3 text-muted-foreground">
              Pending verification
            </p>
          </div>

          <dl className="grid grid-cols-2 divide-x divide-border border-y border-border">
            <div className="px-5 py-4">
              <dd
                className={`${DISPLAY} text-2xl font-semibold tabular-nums tracking-tight text-foreground`}
              >
                {totalSignups}
              </dd>
              <dt className="text-small mt-0.5 text-muted-foreground">
                Referred signups
              </dt>
            </div>
            <div className="px-5 py-4">
              <dd
                className={`${DISPLAY} text-2xl font-semibold tabular-nums tracking-tight text-foreground`}
              >
                {paidCount}
              </dd>
              <dt className="text-small mt-0.5 text-muted-foreground">
                Paid purchases
              </dt>
            </div>
          </dl>

          <div className="flex flex-1 flex-col justify-between gap-4 p-5">
            <div className="space-y-3">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-sm font-semibold text-foreground">
                  Payout progress
                </h2>
                <p className="text-xs tabular-nums text-muted-foreground">
                  {money(estimatedCommission)} / {money(minWithdraw)}
                </p>
              </div>

              <div
                className="h-2 overflow-hidden rounded-full bg-foreground/[0.08]"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress * 100)}
                aria-label="Progress toward minimum payout"
              >
                <motion.div
                  className="h-full rounded-full bg-violet-600 dark:bg-violet-400"
                  initial={{ width: reduce ? `${progress * 100}%` : 0 }}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{
                    duration: 0.9,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.3,
                  }}
                />
              </div>

              <p className="text-sm text-muted-foreground">
                {remaining > 0
                  ? `${money(remaining)} more to reach the ${money(minWithdraw)} minimum.`
                  : "You have reached the minimum. You can request a payout."}
              </p>
            </div>

            <p className="text-xs leading-5 text-muted-foreground">
              Estimated rewards are not an approved balance. Final amounts
              depend on the verified payment and program rules.
            </p>
          </div>
        </motion.section>
      </div>

      {/* Ledger */}
      <motion.section variants={item} className={`${card} p-5 sm:p-7`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2
              className={`${DISPLAY} text-xl font-semibold tracking-tight text-foreground`}
            >
              Paid Premium buyers
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Only eligible, successful purchases appear here.
            </p>
          </div>
          <span className="rounded-full bg-foreground/[0.06] px-3 py-1 text-xs font-medium text-foreground/80">
            {paidCount} eligible
          </span>
        </div>

        {eligiblePurchases.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-foreground/25 px-4 py-10 text-center">
            <p className="text-sm font-medium text-foreground">
              No qualifying purchases yet
            </p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
              Share your link to get started. Free referral unlocks do not earn
              commission.
            </p>
          </div>
        ) : (
          <ul className="mt-5 divide-y divide-border">
            {eligiblePurchases.map((buyer) => (
              <li
                key={buyer.paymentId}
                className="flex flex-wrap items-center justify-between gap-3 py-3.5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex size-10 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xs font-semibold uppercase text-violet-700 dark:bg-violet-400/15 dark:text-violet-300"
                  >
                    {buyer.username.slice(0, 2)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      @{buyer.username}
                    </p>
                    <p className="mt-0.5 text-xs capitalize text-muted-foreground">
                      {buyer.plan === "premium" ? "Premium" : buyer.plan}, paid{" "}
                      {money(buyer.paidAmountUsd)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold tabular-nums text-foreground">
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

      {/* Payout rules */}
      <motion.section variants={item} className={card}>
        <button
          type="button"
          onClick={() => setRulesOpen((open) => !open)}
          aria-expanded={rulesOpen}
          className={`flex w-full items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left text-sm font-medium text-foreground transition-colors hover:bg-foreground/[0.03] sm:px-7 ${FOCUS}`}
        >
          Payout rules and how to request payment
          <motion.svg
            viewBox="0 0 24 24"
            className="size-4 shrink-0 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ rotate: rulesOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </motion.svg>
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
                    className="text-foreground underline decoration-foreground/25 underline-offset-4 hover:decoration-foreground"
                  >
                    contact@orixaai.me
                  </a>{" "}
                  from your Orixa account email and include your referral code.
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    Verification:
                  </span>{" "}
                  Purchases are verified before payout. Failed or refunded
                  transactions are not eligible. Contact support if a qualifying
                  purchase seems to be missing.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </motion.main>
  );
}
