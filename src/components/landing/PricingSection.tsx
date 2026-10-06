"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PRICING, type DiscountState } from "@/lib/game/config";
import { allDigitsFound, useGameStore } from "@/lib/game/store";
import DigitRail from "./game/DigitRail";

type Status = "idle" | "checking" | "valid" | "invalid" | "error";
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
  "Basic analytics (views)",
  "Public portfolio URL",
];
const PRO = [
  "Everything in Free",
  "Remove watermark",
  "All Premium designs",
  "Advanced Design Lab access",
  "Priority support",
];

function Checks({ items }: { items: string[] }) {
  return (
    <ul className="relative flex-1 space-y-3 text-muted-foreground">
      {items.map((t) => (
        <li key={t} className="flex items-start gap-3">
          <span className="font-mono text-success" aria-hidden="true">
            ✓
          </span>
          {t}
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

  // The cookie is signed and httpOnly: refresh keeps the discount, DevTools can't fake it.
  useEffect(() => {
    let live = true;
    fetch("/api/discount/validate")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: DiscountState | null) => {
        if (live && d?.applied) {
          setDiscount(d);
          setStatus("valid");
        }
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  async function apply() {
    if (status === "checking" || discount.applied) return;
    const trimmed = code.trim();
    if (!trimmed) return;
    setStatus("checking");
    try {
      const res = await fetch("/api/discount/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmed }),
      });
      if (!res.ok) {
        setStatus("error");
        return;
      }
      const d = (await res.json()) as DiscountState & { valid: boolean };
      if (d.valid) {
        setDiscount(d);
        setStatus("valid");
        setCelebrate(true);
      } else {
        setStatus("invalid");
        setShake(true);
      }
    } catch {
      setStatus("error");
    }
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
      <div className="bg-grain absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-5">
        <div className="max-w-2xl">
          <p className="text-caption mb-3">Pricing</p>
          <h2 className="text-h1">
            Simple,{" "}
            <span className="text-gradient-ion">transparent pricing.</span>
          </h2>
          <p className="text-body-lg mt-4">
            Start free. Upgrade when you&apos;re ready.
          </p>
        </div>

        <div className="mt-12 grid items-stretch gap-6 md:grid-cols-[.85fr_1.15fr]">
          <div className="surface-card shadow-elevated flex flex-col p-8">
            <h3 className="text-h3">Free</h3>
            <p className="text-small mt-1">Perfect to get started</p>
            <p className="mb-8 mt-6">
              <span className="font-display text-5xl font-semibold">$0</span>{" "}
              <span className="text-muted-foreground">forever</span>
            </p>
            <Checks items={FREE} />
            <Link href="/auth/signup" className="btn btn-ghost mt-8 w-full">
              Start free
            </Link>
          </div>

          <div className="border-gradient-ion shadow-glow-primary relative flex flex-col overflow-hidden rounded-2xl p-8">
            <div
              className="bg-aurora pointer-events-none absolute inset-0 opacity-80"
              aria-hidden="true"
            />
            <h3 className="text-h3 relative">Pro</h3>
            <div
              role="group"
              aria-label="Billing period"
              className="relative mt-4 grid grid-cols-2 gap-1 rounded-xl bg-background/60 p-1"
            >
              {(["monthly", "yearly"] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  aria-pressed={billing === b}
                  onClick={() => setBilling(b)}
                  className={`min-h-11 rounded-lg text-sm font-medium capitalize transition ${billing === b ? "bg-surface-3 text-foreground shadow" : "text-muted-foreground"}`}
                >
                  {b}
                </button>
              ))}
            </div>

            <div className="relative mt-6" aria-live="polite">
              {yearly && discount.applied && (
                <p className="font-mono text-sm text-muted-foreground line-through">
                  ${PRICING.yearly}
                </p>
              )}
              <p className={celebrate ? "anim-pop" : ""}>
                <span className="text-gradient-ion font-display text-6xl font-semibold">
                  ${price}
                </span>{" "}
                <span className="text-muted-foreground">
                  / {yearly ? "year" : "month"}
                </span>
              </p>
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
                <p className="mt-1 text-sm text-success">
                  Already {vsMonthly}% off vs monthly
                </p>
              )}
              {yearly && discount.applied && (
                <p className="mt-1 text-sm text-success">
                  ${discount.amountOff} off applied · first year only
                </p>
              )}
            </div>

            {yearly && (
              <div className="relative mt-6 rounded-xl border border-dashed border-border-strong bg-background/40 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-medium">
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
                        className="font-mono min-h-12 min-w-0 flex-1 rounded-lg border border-border-strong bg-surface px-4 text-center text-lg tracking-[0.5em] placeholder:tracking-[0.5em]"
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
                        className="font-mono mt-2 text-xs text-accent underline underline-offset-4"
                      >
                        Insert my collected digits
                      </button>
                    )}
                  </>
                ) : (
                  <p className="font-mono mt-3 text-sm text-success">
                    ✓ ${discount.amountOff} off your first year is applied.
                  </p>
                )}

                <p id="code-msg" role="status" className="mt-2 min-h-5 text-sm">
                  {status === "invalid" && (
                    <span className="text-error">
                      That code doesn&apos;t match. The digits are earned inside
                      the page. Keep exploring.
                    </span>
                  )}
                  {status === "error" && (
                    <span className="text-warning">
                      Couldn&apos;t check the code right now. Try again in a
                      moment.
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

            <div className="relative mt-6">
              <Checks items={PRO} />
            </div>
            <Link
              href="/auth/signup"
              className="btn btn-ion relative mt-8 w-full"
            >
              Get Pro · ${price}/{yearly ? "year" : "month"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
