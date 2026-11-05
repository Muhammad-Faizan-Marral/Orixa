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

function Checks({ items, color = "#10B981" }: { items: string[]; color?: string }) {
  return (
    <ul className="lp-list">
      {items.map((t) => (
        <li key={t}>
          <svg width="16" height="16" fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 13l4 4L19 7" />
          </svg>
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
    <section id="pricing" className="lp">
      <div className="lp-container">
        <div className="lp-head">
          <h2 className="lp-title">Simple, transparent pricing.</h2>
          <p className="lp-lead">Start free. Upgrade when you’re ready.</p>
        </div>

        {/* Billing toggle */}
        <div className="lp-toggle">
          <span style={{ opacity: yearly ? 0.55 : 1 }}>Monthly</span>
          <button
            type="button"
            role="switch"
            aria-checked={yearly}
            aria-label="Bill yearly"
            className="lp-switch"
            onClick={() => setBilling(yearly ? "monthly" : "yearly")}
          >
            <span className="lp-switch-dot" />
          </button>
          <span style={{ opacity: yearly ? 1 : 0.55 }}>Yearly</span>
          <span className="lp-save">Save {vsMonthly}%</span>
        </div>

        <div className="lp-prices">
          {/* Free Plan */}
          <div className="lp-price">
            <h3>Free</h3>
            <p className="lp-price-sub">Perfect to get started</p>

            <p className="lp-price-val">
              $0 <span>forever</span>
            </p>

            <Checks items={FREE} />

            <Link href="/auth/signup" className="lp-btn lp-btn-glass lp-btn-block">
              Start free
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="lp-price lp-price-pro">
            {yearly && <span className="lp-badge">MOST CHOSEN</span>}
            <h3>Pro</h3>
            <p className="lp-price-sub">For people who want a custom domain and every design</p>

            <div style={{ position: "relative" }} aria-live="polite">
              {yearly && discount.applied && <p className="lp-old">${PRICING.yearly}</p>}

              <p className={`lp-price-val ${celebrate ? "anim-pop" : ""}`}>
                ${price} <span>/ {yearly ? "year" : "month"}</span>
              </p>

              {celebrate &&
                SPARKS.map((sp, i) => (
                  <span
                    key={i}
                    className="lp-spark"
                    aria-hidden="true"
                    style={{
                      ["--dx" as string]: `${sp.dx}px`,
                      ["--dy" as string]: `${sp.dy}px`,
                    }}
                  />
                ))}

              {yearly && !discount.applied && (
                <p className="lp-note-ok">Already {vsMonthly}% off vs monthly</p>
              )}
              {yearly && discount.applied && (
                <p className="lp-note-ok">${discount.amountOff} off applied · first year only</p>
              )}
            </div>

            <Checks items={PRO} color="#1E6BFF" />

            <Link href="/auth/signup" className="lp-btn lp-btn-primary lp-btn-block">
              Get Pro · ${price}/{yearly ? "year" : "month"}
            </Link>

            {/* Secret Code */}
            {yearly && (
              <div className="lp-promo">
                <div className="lp-promo-top">
                  <span>
                    {discount.applied ? "Secret code unlocked" : "A secret is hidden on this page"}
                  </span>
                  <DigitRail digits={digits} size="sm" />
                </div>

                {!discount.applied ? (
                  <>
                    <div
                      className={`lp-promo-row ${shake ? "anim-shake" : ""}`}
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
                      />
                      <button
                        type="button"
                        onClick={apply}
                        disabled={status === "checking" || code.length === 0}
                        className="lp-btn lp-btn-glass lp-btn-sm"
                      >
                        {status === "checking" ? "Checking" : "Apply"}
                      </button>
                    </div>

                    {complete && (
                      <button
                        type="button"
                        onClick={() => setCode(digits.join(""))}
                        className="lp-promo-link"
                      >
                        Insert my collected digits
                      </button>
                    )}
                  </>
                ) : (
                  <p className="lp-promo-msg" style={{ color: "#10B981" }}>
                    ✓ ${discount.amountOff} off your first year is applied.
                  </p>
                )}

                <p id="code-msg" role="status" className="lp-promo-msg">
                  {status === "invalid" && (
                    <span style={{ color: "#EF4444" }}>
                      That code doesn’t match. The digits are earned inside the page. Keep exploring.
                    </span>
                  )}
                  {status === "valid" && celebrate && (
                    <span style={{ color: "#10B981" }}>Code accepted. Nicely played.</span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
