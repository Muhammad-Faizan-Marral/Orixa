"use client";

import Link from "next/link";
import { useState } from "react";
import { PRICING, type DiscountState } from "@/lib/game/config";
import { allDigitsFound, useGameStore } from "@/lib/game/store";
import DigitRail from "./game/DigitRail";

type Status = "idle" | "checking" | "valid" | "invalid";

const SPARKS = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2;
  return {
    dx: Math.round(Math.cos(a) * 110),
    dy: Math.round(Math.sin(a) * 60),
  };
});

const FREE = [
  "Create & publish portfolios",
  "Free design themes",
  "Resume upload & parsing",
  "Full analytics",
  "Public portfolio URL",
];

const PRO = [
  "Unlimited portfolios",
  "Custom domain",
  "Remove watermark",
  "All premium designs",
  "Resume upload & parsing",
  "Full analytics",
  "Public portfolio URL",
];

function Checks({ items }: { items: string[] }) {
  return (
    <ul className="relative flex-1 space-y-3">
      {items.map((t) => (
        <li key={t} className="flex items-start gap-3 text-[15px] text-muted-foreground">
          <span className="mt-0.5 font-mono text-success" aria-hidden="true">
            ✓
          </span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PricingSection() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [discount, setDiscount] = useState<DiscountState>({
    applied: false,
    amountOff: 0,
    yearlyPrice: PRICING.yearly,
  });
  const [celebrate, setCelebrate] = useState(false);
  const [shake, setShake] = useState(false);
  const digits = useGameStore((s) => s.digits);
  const complete = allDigitsFound(digits);

  const SECRET_CODE = "63125";

  function apply() {
    if (status === "checking" || discount.applied) return;
    const trimmed = code.trim();
    if (!trimmed) return;
    setStatus("checking");

    window.setTimeout(() => {
      if (trimmed === SECRET_CODE) {
        setDiscount({
          applied: true,
          amountOff: PRICING.secretOff,
          yearlyPrice: PRICING.yearly - PRICING.secretOff,
        });
        setStatus("valid");
        setCelebrate(true);
      } else {
        setStatus("invalid");
        setShake(true);
      }
    }, 280);
  }

  const yearly = billing === "yearly";
  const price = yearly ? discount.yearlyPrice : PRICING.monthly;
  const vsMonthly = Math.round(
    ((12 * PRICING.monthly - PRICING.yearly) / (12 * PRICING.monthly)) * 100,
  );

  return (
    <section
      id="pricing"
      className="relative bg-surface py-24 [clip-path:polygon(0_0,100%_2.5rem,100%_100%,0_100%)] md:py-36"
    >
      <div className="bg-grain absolute inset-0 opacity-40" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-5">
        {/* Header */}
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-medium tracking-wide text-muted-foreground">
            Pricing
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[2.75rem] md:leading-[1.15]">
            Simple,{" "}
            <span className="bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground bg-clip-text text-transparent">
              transparent pricing.
            </span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Start free. Upgrade when you’re ready.
          </p>
        </div>

        {/* Plans */}
        <div className="mt-14 grid items-stretch gap-6 md:grid-cols-[0.9fr_1.1fr]">
          {/* Free Plan */}
          <div className="flex flex-col rounded-2xl border border-border/60 bg-background/40 p-8 shadow-sm">
            <h3 className="text-xl font-semibold tracking-tight text-foreground">
              Free
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Perfect to get started
            </p>

            <p className="mb-8 mt-7">
              <span className="font-display text-5xl font-semibold tracking-tight">
                $0
              </span>{" "}
              <span className="text-muted-foreground">forever</span>
            </p>

            <Checks items={FREE} />

            <Link
              href="/auth/signup"
              className="btn btn-ghost mt-10 w-full"
            >
              Start free
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="relative flex flex-col overflow-hidden rounded-2xl border border-primary/30 bg-background/50 p-8 shadow-[0_0_40px_-12px_rgba(108,92,255,0.25)]">
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-80"
              aria-hidden="true"
            />

            <div className="relative">
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                Pro
              </h3>

              {/* Billing Switcher */}
              <div
                role="group"
                aria-label="Billing period"
                className="mt-5 grid grid-cols-2 gap-1 rounded-xl bg-background/70 p-1"
              >
                {(["monthly", "yearly"] as const).map((b) => (
                  <button
                    key={b}
                    type="button"
                    aria-pressed={billing === b}
                    onClick={() => setBilling(b)}
                    className={`min-h-11 rounded-lg text-sm font-medium capitalize transition-all ${
                      billing === b
                        ? "bg-surface text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>

              {/* Price */}
              <div className="relative mt-7" aria-live="polite">
                {yearly && discount.applied && (
                  <p className="font-mono text-sm text-muted-foreground line-through">
                    ${PRICING.yearly}
                  </p>
                )}

                <p className={celebrate ? "anim-pop" : ""}>
                  <span className="bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text font-display text-6xl font-semibold tracking-tight text-transparent">
                    ${price}
                  </span>{" "}
                  <span className="text-muted-foreground">
                    / {yearly ? "year" : "month"}
                  </span>
                </p>

                {yearly && (
                  <span className="absolute -right-1 -top-3 z-10 rotate-[6deg] rounded-md bg-gradient-to-r from-accent via-indigo-500 to-accent px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white shadow-md ring-1 ring-white/20">
                    Most Chosen
                  </span>
                )}

                {celebrate &&
                  SPARKS.map((s, i) => (
                    <span
                      key={i}
                      className="spark left-24 top-16"
                      aria-hidden="true"
                      style={{
                        ["--dx" as string]: `${s.dx}px`,
                        ["--dy" as string]: `${s.dy}px`,
                      }}
                    />
                  ))}

                {yearly && !discount.applied && (
                  <p className="mt-1.5 text-sm text-success">
                    Already {vsMonthly}% off vs monthly
                  </p>
                )}
                {yearly && discount.applied && (
                  <p className="mt-1.5 text-sm text-success">
                    ${discount.amountOff} off applied · first year only
                  </p>
                )}
              </div>

              {/* Secret Code */}
              {yearly && (
                <div className="relative mt-7 rounded-xl border border-dashed border-border-strong/70 bg-background/50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">
                      {discount.applied
                        ? "Secret code unlocked"
                        : "A secret is hidden on this page"}
                    </p>
                    <DigitRail digits={digits} size="sm" />
                  </div>

                  {!discount.applied ? (
                    <>
                      <div
                        className={`mt-3 flex gap-2 ${shake ? "anim-shake" : ""}`}
                        onAnimationEnd={() => setShake(false)}
                      >
                        <label className="sr-only" htmlFor="secret-code">
                          Secret code
                        </label>
                        <input
                          id="secret-code"
                          value={code}
                          onChange={(e) => {
                            setCode(e.target.value.replace(/\D/g, ""));
                            if (status !== "checking") setStatus("idle");
                          }}
                          onKeyDown={(e) => e.key === "Enter" && apply()}
                          inputMode="numeric"
                          autoComplete="off"
                          maxLength={5}
                          placeholder="· · · · ·"
                          aria-describedby="code-msg"
                          className="min-h-12 min-w-0 flex-1 rounded-lg border border-border-strong bg-surface px-4 text-center font-mono text-lg tracking-[0.5em] placeholder:tracking-[0.5em]"
                        />
                        <button
                          type="button"
                          onClick={apply}
                          disabled={status === "checking" || code.length === 0}
                          className="btn btn-ion !px-5"
                        >
                          {status === "checking" ? "Checking" : "Apply"}
                        </button>
                      </div>

                      {complete && (
                        <button
                          type="button"
                          onClick={() => setCode(digits.join(""))}
                          className="mt-2 font-mono text-xs text-accent underline underline-offset-4"
                        >
                          Insert my collected digits
                        </button>
                      )}
                    </>
                  ) : (
                    <p className="mt-3 font-mono text-sm text-success">
                      ✓ ${discount.amountOff} off your first year is applied.
                    </p>
                  )}

                  <p id="code-msg" role="status" className="mt-2 min-h-5 text-sm">
                    {status === "invalid" && (
                      <span className="text-error">
                        That code doesn’t match. The digits are earned inside
                        the page. Keep exploring.
                      </span>
                    )}
                    {status === "valid" && celebrate && (
                      <span className="text-success">
                        Code accepted. Nicely played.
                      </span>
                    )}
                  </p>
                </div>
              )}

              <div className="relative mt-7">
                <Checks items={PRO} />
              </div>

              <Link
                href="/auth/signup"
                className="btn btn-ion relative mt-10 w-full"
              >
                Get Pro · ${price}/{yearly ? "year" : "month"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}