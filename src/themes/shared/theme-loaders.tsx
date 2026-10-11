"use client";

import {
  useEffect,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import type { ThemeId } from "../types";

/* ═══════════════════════════════════════════════════════════
   Per-theme full-page loaders (assets / fonts ready hone tak)

   PERFORMANCE RULES (is file mein follow kiye gaye):
   1. Sirf `transform` aur `opacity` animate hote hain (GPU/compositor,
      main thread block nahi hota). background-position, mask-position,
      top/left animations hata di gayi hain.
   2. Koi `filter: blur()` / `backdrop-filter` / `mix-blend-mode`
      full-screen layers par nahi. Blur ki jagah radial-gradient.
   3. Grain tiles fixed 256px size par raster hoti hain (pehle poori
      screen ke size par feTurbulence raster hota tha — sab se bara lag).
   4. SVG ke andar ke elements ko animate karne ke bajaye poora HTML
      wrapper animate hota hai (SVG children compositor par nahi chalte).
   ═══════════════════════════════════════════════════════════ */

type LoaderProps = { themeName?: string };

const ROOT = "tl-root fixed inset-0 z-[9999] overflow-hidden";

const A11Y = {
  role: "status",
  "aria-busy": true,
  "aria-label": "Loading portfolio",
} as const;

/* film-grain tiles — hamesha backgroundSize 256px ke saath use karo */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' width='256' height='256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const PAPER_GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .35  0 0 0 0 .25  0 0 0 0 .15  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/* ───────────────────────────────────────────────────────────
   1. minimal-airy
   ─────────────────────────────────────────────────────────── */
const MA_INK = "#120d0b";
const MA_BARS = [0.74, 0.58, 0.8, 0.52, 0.7, 0.62]; // giant "letters" (em)

export function MinimalAiryLoader(_props: LoaderProps) {
  // backdrop-filter hata diya (bohat mehnga) — translucent fill kaafi hai
  const glass: CSSProperties = {
    border: "1px solid rgba(255,255,255,0.28)",
    background: "rgba(255,255,255,0.14)",
  };

  return (
    <div
      className={`${ROOT} flex items-center justify-center`}
      style={{ background: "var(--pr-accent, #f97316)" }}
      {...A11Y}
    >
      {/* atmospheric depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, transparent 30%, rgba(0,0,0,0.18) 100%)",
        }}
      />

      {/* giant name — letters rise one after another */}
      <div
        aria-hidden="true"
        className="relative z-[2] flex items-end"
        style={{
          fontSize: "clamp(64px, 17vw, 168px)",
          gap: "0.1em",
          height: "1em",
        }}
      >
        {MA_BARS.map((w, i) => (
          <span
            key={i}
            className="tl-gpu"
            style={{
              display: "block",
              width: `${w}em`,
              height: "1em",
              borderRadius: "0.18em",
              background: "rgba(255,255,255,0.94)",
              transformOrigin: "50% 100%",
              animation: `tl-ma-letter 3.6s cubic-bezier(.2,.7,.2,1) ${i * 0.09}s infinite both`,
            }}
          />
        ))}
      </div>

      {/* model silhouette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] flex justify-center"
      >
        <div
          className="tl-gpu"
          style={{
            width: "clamp(170px, 40vw, 300px)",
            animation: "tl-ma-rise 3.6s cubic-bezier(.2,.7,.2,1) infinite both",
          }}
        >
          <div style={{ animation: "tl-float 3.2s ease-in-out infinite" }}>
            <svg viewBox="0 0 200 250" className="block w-full" fill={MA_INK}>
              <circle cx="100" cy="66" r="42" />
              <rect x="84" y="100" width="32" height="44" />
              <path d="M6 250 C6 184 46 142 100 142 C154 142 194 184 194 250 Z" />
            </svg>
          </div>
        </div>
      </div>

      {/* foreground UI skeleton */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[10] flex flex-col justify-between"
        style={{
          padding: "clamp(1.25rem, 2.8vw, 2rem) clamp(1.25rem, 3.5vw, 2.5rem)",
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span
              className="inline-block"
              style={{ width: 22, height: 1, background: "rgba(255,255,255,0.32)" }}
            />
            <span
              className="inline-block rounded-full"
              style={{
                width: 56,
                height: 4,
                background: "rgba(255,255,255,0.45)",
                animation: "tl-blink 2.2s ease-in-out infinite",
              }}
            />
          </div>
          <span
            className="inline-block rounded-full"
            style={{ ...glass, width: 86, height: 30 }}
          />
        </div>

        <div className="flex items-end justify-between gap-6">
          <div style={{ width: "clamp(150px, 36vw, 360px)" }}>
            <div
              className="rounded-full"
              style={{
                height: "clamp(10px, 1.6vw, 18px)",
                width: "100%",
                background: "rgba(255,255,255,0.92)",
              }}
            />
            <div
              className="mt-2 rounded-full"
              style={{
                height: "clamp(10px, 1.6vw, 18px)",
                width: "62%",
                background: "rgba(255,255,255,0.92)",
              }}
            />
            <div
              className="mt-3 rounded-full"
              style={{ width: 30, height: 2, background: "rgba(255,255,255,0.4)" }}
            />
          </div>

          <div className="flex items-end" style={{ gap: "clamp(1.25rem, 4vw, 3rem)" }}>
            {[0, 1].map((i) => (
              <div key={i}>
                <div
                  className="rounded-md"
                  style={{ width: 44, height: 22, background: "#fff" }}
                />
                <div
                  className="mt-2 rounded-full"
                  style={{ width: 52, height: 5, background: "rgba(255,255,255,0.48)" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* "Let's Talk" badge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[clamp(1.25rem,3.5vw,2.75rem)] top-1/2 z-[15] hidden h-[68px] w-[68px] -translate-y-1/2 items-center justify-center rounded-full sm:flex"
        style={glass}
      >
        <span
          className="absolute inset-0 rounded-full"
          style={{
            border: "1px solid rgba(255,255,255,0.45)",
            animation: "tl-ma-ring 2.4s ease-out infinite",
          }}
        />
        <svg
          viewBox="0 0 16 16"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 12 12 4M5 4h7v7" />
        </svg>
      </div>

      {/* film grain — static, fixed tile, no blend mode */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[20]"
        style={{ backgroundImage: GRAIN, backgroundSize: "256px 256px", opacity: 0.03 }}
      />
      <ThemeLoaderStyles />
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   2. tech-dense
   ─────────────────────────────────────────────────────────── */
const CUT_TD = "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)";

/* Wavelength = 400 units. SVG viewBox 1600 wide ⇒ 400 units = 25% of width,
   so translateX(-25%) loops seamlessly. */
const TD_LINES = Array.from({ length: 16 }, (_, i) => {
  const p = i / 15;
  const depth = Math.pow(p, 1.7);
  const base = 40 + 330 * depth;
  const amp = 3 + 34 * depth;
  let d = "";
  for (let x = -400; x <= 1200; x += 20) {
    const y =
      base +
      Math.sin(x * 0.015708 + i * 0.5) * amp +
      Math.sin(x * 0.031416 - i * 0.9) * amp * 0.38;
    d += `${d ? "L" : "M"}${x} ${y.toFixed(1)} `;
  }
  return { d, o: 0.06 + 0.5 * depth, w: 0.6 + depth * 0.9 };
});

export function TechDenseLoader(_props: LoaderProps) {
  return (
    <div
      className={`${ROOT} flex flex-col items-center justify-center`}
      style={{ background: "#04060B" }}
      {...A11Y}
    >
      {/* ambient light — gradient only, blur filter hata diya */}
      <div
        aria-hidden="true"
        className="tl-gpu pointer-events-none absolute left-1/2 rounded-full"
        style={{
          top: "-30rem",
          width: "60rem",
          height: "60rem",
          marginLeft: "-30rem",
          background:
            "radial-gradient(circle, rgba(37,99,235,0.2), rgba(30,64,175,0.06) 40%, transparent 68%)",
          animation: "tl-breathe 6s ease-in-out infinite",
        }}
      />

      {/* contour field — poora wrapper translate hota hai (GPU), paths static */}
      <div
        aria-hidden="true"
        className="tl-gpu pointer-events-none absolute bottom-0 left-0"
        style={{
          width: "max(256svh, 140vw)",
          aspectRatio: "4 / 1",
          animation: "tl-td-pan 7s linear infinite",
        }}
      >
        <svg viewBox="-400 0 1600 400" className="block h-full w-full">
          {TD_LINES.map((l, i) => (
            <path
              key={i}
              d={l.d}
              fill="none"
              stroke="rgb(96,165,250)"
              strokeOpacity={l.o}
              strokeWidth={l.w}
            />
          ))}
        </svg>
      </div>

      {/* grain + vignette (static) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: GRAIN, backgroundSize: "256px 256px", opacity: 0.05 }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(2,3,6,0.85) 100%)",
        }}
      />

      {/* identity plate */}
      <div className="relative z-10 flex flex-col items-center">
        <div style={{ animation: "tl-td-bob 3.4s ease-in-out infinite" }}>
          <div
            style={{
              width: "clamp(150px, 40vw, 210px)",
              aspectRatio: "4 / 5",
              clipPath: CUT_TD,
              padding: 1,
              background:
                "linear-gradient(to bottom, rgba(147,197,253,0.45), rgba(255,255,255,0.08), rgba(59,130,246,0.32))",
            }}
          >
            <div
              className="relative h-full w-full overflow-hidden"
              style={{ clipPath: CUT_TD, background: "#070A10" }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 50% 38%, rgba(59,130,246,0.28), transparent 46%), linear-gradient(160deg,#0C1220,#06080D)",
                  animation: "tl-blink 3s ease-in-out infinite",
                }}
              />

              {/* portrait placeholder ring */}
              <div
                className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2"
                style={{ width: "40%", aspectRatio: "1 / 1" }}
              >
                <div
                  className="h-full w-full rounded-full"
                  style={{
                    border: "1px dashed rgba(147,197,253,0.5)",
                    animation: "tl-spin 9s linear infinite",
                  }}
                />
                <span
                  className="absolute left-1/2 top-1/2 rounded-full"
                  style={{
                    width: 6,
                    height: 6,
                    marginLeft: -3,
                    marginTop: -3,
                    background: "#60a5fa",
                    boxShadow: "0 0 14px 3px rgba(59,130,246,0.7)",
                  }}
                />
              </div>

              {/* scan line — top ki jagah transform (GPU) */}
              <div
                className="tl-gpu pointer-events-none absolute inset-0"
                style={{ animation: "tl-td-scan 2.6s linear infinite" }}
              >
                <div
                  style={{
                    height: 2,
                    background:
                      "linear-gradient(90deg, transparent, rgba(96,165,250,0.95), transparent)",
                    boxShadow: "0 0 18px 3px rgba(59,130,246,0.4)",
                  }}
                />
              </div>

              {/* name / handle skeleton + status dot */}
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div
                    className="rounded-full"
                    style={{ width: "62%", height: 7, background: "rgba(255,255,255,0.85)" }}
                  />
                  <div
                    className="mt-2 rounded-full"
                    style={{ width: "36%", height: 5, background: "rgba(255,255,255,0.35)" }}
                  />
                </div>
                <span
                  className="shrink-0 rounded-full"
                  style={{
                    width: 6,
                    height: 6,
                    background: "#60a5fa",
                    boxShadow: "0 0 14px 3px rgba(59,130,246,0.75)",
                    animation: "tl-blink 1.4s ease-in-out infinite",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <div
          className="relative mt-9 overflow-hidden"
          style={{ width: 120, height: 1, background: "rgba(255,255,255,0.12)" }}
        >
          <span
            className="tl-gpu absolute inset-y-0 left-0"
            style={{
              width: "40%",
              background: "#60a5fa",
              boxShadow: "0 0 10px 1px rgba(96,165,250,0.8)",
              animation: "tl-td-slide 1.8s ease-in-out infinite",
            }}
          />
        </div>
      </div>
      <ThemeLoaderStyles />
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   3. editorial
   ─────────────────────────────────────────────────────────── */
const ED_CREAM = "#F6F2E7";
const ED_GOLD = "#F4E9A9";

const ED_ROW_1 = [
  { w: 0.7, r: true },
  { w: 0.56 },
  { w: 0.7 },
  { w: 0.5 },
  { w: 0.7, r: true },
];
const ED_ROW_2 = [
  { w: 0.6 },
  { w: 0.7, r: true },
  { w: 0.5 },
  { w: 0.68 },
  { w: 0.6 },
];

function EditorialLetters({ filled }: { filled: boolean }) {
  const row = (items: { w: number; r?: boolean }[], indent: boolean) => (
    <div className="flex" style={{ gap: "0.12em", marginLeft: indent ? "0.9em" : 0 }}>
      {items.map((l, i) => (
        <span
          key={i}
          style={{
            display: "block",
            width: `${l.w}em`,
            height: "1em",
            borderRadius: l.r ? "50%" : "0.14em",
            background: filled ? ED_GOLD : "transparent",
            border: filled ? "none" : "1.5px solid rgba(246,242,231,0.62)",
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-start" style={{ gap: "0.14em" }}>
      {row(ED_ROW_1, false)}
      {row(ED_ROW_2, true)}
    </div>
  );
}

export function EditorialLoader(_props: LoaderProps) {
  return (
    <div
      className={`${ROOT} flex items-center justify-center`}
      style={{ background: "#161F9C", color: ED_CREAM }}
      {...A11Y}
    >
      {/* atmosphere — blur(100px) ki jagah radial-gradient (bohat sasta) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute rounded-full"
        style={{
          right: "-28vw",
          top: "-28vw",
          width: "78vw",
          height: "78vw",
          background: "radial-gradient(circle, rgba(34,48,210,0.65), transparent 68%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute rounded-full"
        style={{
          left: "-30vw",
          bottom: "-30vw",
          width: "75vw",
          height: "75vw",
          background: "radial-gradient(circle, rgba(34,48,210,0.55), transparent 68%)",
        }}
      />
      <div
        aria-hidden="true"
        className="tl-gpu pointer-events-none absolute rounded-full"
        style={{
          left: "30%",
          top: "11%",
          width: "40vw",
          height: "40vw",
          background: "radial-gradient(circle, rgba(244,233,169,0.14), transparent 68%)",
          animation: "tl-breathe 5s ease-in-out infinite",
        }}
      />

      {/* blueprint grid + technical lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.06,
          backgroundImage:
            "linear-gradient(rgba(246,242,231,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(246,242,231,0.8) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[23%]"
        style={{ height: 1, background: "rgba(246,242,231,0.07)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[72%]"
        style={{ height: 1, background: "rgba(246,242,231,0.07)" }}
      />

      {/* frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 rounded-[20px] sm:inset-5 sm:rounded-[24px]"
        style={{ border: "1px solid rgba(246,242,231,0.2)" }}
      />

      {/* top bar skeleton */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between px-8 pt-9 sm:px-14 sm:pt-14"
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span
              className="absolute inset-0 rounded-full"
              style={{
                background: "rgba(244,233,169,0.6)",
                animation: "tl-ping 1.8s cubic-bezier(0,0,.2,1) infinite",
              }}
            />
            <span className="relative h-2 w-2 rounded-full" style={{ background: ED_GOLD }} />
          </span>
          <span
            className="inline-block rounded-full"
            style={{ width: 84, height: 4, background: "rgba(246,242,231,0.4)" }}
          />
        </div>
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ border: "1px solid rgba(246,242,231,0.15)" }}
        >
          <span
            className="rounded-full"
            style={{
              width: 14,
              height: 3,
              background: "rgba(246,242,231,0.45)",
              animation: "tl-blink 2s ease-in-out infinite",
            }}
          />
        </span>
      </div>

      {/* orbit + outlined name with sweeping gold lens */}
      <div className="relative flex items-center justify-center">
        <div
          aria-hidden="true"
          className="relative"
          style={{ width: "min(78vw, 440px)", aspectRatio: "1 / 1" }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "1px solid rgba(246,242,231,0.12)",
              animation: "tl-spin 22s linear infinite",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              inset: "9%",
              border: "1px dashed rgba(244,233,169,0.3)",
              animation: "tl-spin-rev 16s linear infinite",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              inset: "23%",
              border: "1px solid rgba(246,242,231,0.12)",
              animation: "tl-spin 12s linear infinite",
            }}
          />
          <span className="absolute inset-0" style={{ animation: "tl-spin 6s linear infinite" }}>
            <span
              className="absolute left-1/2 rounded-full"
              style={{
                top: -2,
                width: 10,
                height: 10,
                marginLeft: -5,
                background: ED_GOLD,
                boxShadow: "0 0 30px rgba(244,233,169,0.65)",
              }}
            />
          </span>
        </div>

        <div
          aria-hidden="true"
          className="absolute"
          style={{ fontSize: "clamp(34px, 9vw, 76px)" }}
        >
          <div className="relative">
            <EditorialLetters filled={false} />
            {/* lens: wrapper aur andar ka content ulta translate hota hai
                (mask-position animate karne se bohat sasta, sab GPU) */}
            <div className="tl-ed-lens-wrap tl-gpu absolute left-0 top-0 h-full">
              <div className="tl-ed-lens-inner">
                <EditorialLetters filled />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ThemeLoaderStyles />
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   4. soft-luxury
   ─────────────────────────────────────────────────────────── */
const SL_PAPER = "#efe2c8";
const SL_INK = "#1b130c";
const SL_BLOOD = "#a3271d";

/* Geometric stroke glyphs — drawn as paths, no text is rendered. */
function slGlyph(ch: string, x0: number): string {
  const L = x0 + 6;
  const R = x0 + 32;
  const C = x0 + 19;
  const T = 14;
  const B = 76;
  const M = 45;
  switch (ch) {
    case "G":
      return `M${R} ${T} H${L} V${B} H${R} V${M} H${C}`;
    case "E":
      return `M${R} ${T} H${L} V${B} H${R} M${L} ${M} H${R - 4}`;
    case "N":
      return `M${L} ${B} V${T} L${R} ${B} V${T}`;
    case "R":
      return `M${L} ${B} V${T} H${R} V${M} H${L} M${C} ${M} L${R} ${B}`;
    case "I":
      return `M${C} ${T} V${B}`;
    case "C":
      return `M${R} ${T} H${L} V${B} H${R}`;
    default:
      return "";
  }
}

const SL_PATHS = Array.from("GENERIC").map((ch, i) => slGlyph(ch, i * 52));

const SL_DROPS = [
  { x: 298, y: 40, d: 0 },
  { x: 304, y: 58, d: 0.12 },
  { x: 296, y: 72, d: 0.24 },
];

export function SoftLuxuryLoader(_props: LoaderProps) {
  return (
    <div
      className={`${ROOT} flex items-center justify-center`}
      style={{ background: SL_PAPER, color: SL_INK }}
      {...A11Y}
    >
      {/* paper atmosphere (static) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 55% at 50% 46%, rgba(255,246,224,.75), transparent 70%),
            radial-gradient(ellipse 120% 90% at 50% 50%, transparent 55%, rgba(120,84,48,.22) 100%)
          `,
        }}
      />
      {/* grain: blend mode hata diya, opacity se hi kaam chal jata hai */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: PAPER_GRAIN,
          backgroundSize: "160px 160px",
          opacity: 0.22,
        }}
      />

      <div className="relative z-10 flex flex-col items-center px-4">
        {/* headline skeleton */}
        <div className="flex flex-col items-center" style={{ gap: 10 }}>
          <div
            className="rounded-full"
            style={{
              height: "clamp(9px, 1.8vw, 15px)",
              width: "min(62vw, 320px)",
              background: SL_INK,
              animation: "tl-sl-line 4.4s cubic-bezier(.65,0,.35,1) infinite both",
            }}
          />
          <div
            className="rounded-full"
            style={{
              height: "clamp(9px, 1.8vw, 15px)",
              width: "min(38vw, 190px)",
              background: SL_INK,
              animation:
                "tl-sl-line 4.4s cubic-bezier(.65,0,.35,1) 0.15s infinite both",
            }}
          />
        </div>

        {/* the big word getting bitten */}
        <svg
          aria-hidden="true"
          viewBox="0 0 364 90"
          className="mt-5 block"
          style={{ width: "min(88vw, 440px)", overflow: "visible" }}
        >
          <defs>
            <mask
              id="tl-sl-bite"
              maskUnits="userSpaceOnUse"
              x="-20"
              y="-20"
              width="420"
              height="130"
            >
              <rect x="-20" y="-20" width="420" height="130" fill="#fff" />
              <g
                fill="#000"
                style={{
                  animation: "tl-sl-chomp 4.4s cubic-bezier(.5,0,.2,1) infinite",
                }}
              >
                <circle cx="318" cy="24" r="20" />
                <circle cx="330" cy="46" r="22" />
                <circle cx="318" cy="68" r="20" />
                <circle cx="345" cy="32" r="22" />
                <circle cx="345" cy="60" r="22" />
                <circle cx="358" cy="46" r="22" />
              </g>
            </mask>
          </defs>

          <g mask="url(#tl-sl-bite)">
            <g
              fill="none"
              stroke={SL_INK}
              strokeWidth="12"
              strokeLinejoin="miter"
              strokeLinecap="butt"
            >
              {SL_PATHS.map((d, i) => (
                <path key={i} d={d} />
              ))}
            </g>
          </g>

          {/* blood drops falling from the bite */}
          {SL_DROPS.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="3.4"
              fill={SL_BLOOD}
              style={{
                opacity: 0,
                animation: `tl-sl-drop 4.4s ease-in ${p.d}s infinite`,
              }}
            />
          ))}
        </svg>

        {/* scroll-progress line */}
        <div
          className="mt-8 overflow-hidden"
          style={{
            width: "min(60vw, 260px)",
            height: 2,
            background: "rgba(109,77,49,.28)",
          }}
        >
          <div
            className="h-full"
            style={{
              background: SL_BLOOD,
              transformOrigin: "left center",
              animation: "tl-sl-prog 4.4s cubic-bezier(.65,0,.35,1) infinite",
            }}
          />
        </div>
      </div>
      <ThemeLoaderStyles />
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   5. neo-glass
   ─────────────────────────────────────────────────────────── */
const NG_ORANGE = "#FF4A17";
const NG_INK = "#1c1c1c";
const NG_SPARKS = ["M6 22 12 12", "M15 24l4-9", "M20 14l5-5"];

export function NeoGlassLoader(_props: LoaderProps) {
  return (
    <div
      className={`${ROOT} flex items-center justify-center`}
      style={{ background: "#ffffff", color: NG_INK }}
      {...A11Y}
    >
      <div
        className="relative flex w-full max-w-[420px] flex-col items-center px-5"
        style={{ gap: "clamp(10px, 2.2svh, 20px)" }}
      >
        {/* "Hello!" pill + sparks */}
        <div className="relative">
          <span
            className="block rounded-full"
            style={{ width: 84, height: 34, border: `2px solid ${NG_INK}` }}
          >
            <span
              className="mx-auto block rounded-full"
              style={{
                width: 44,
                height: 8,
                marginTop: 11,
                background: NG_INK,
                animation: "tl-blink 2s ease-in-out infinite",
              }}
            />
          </span>
          <svg
            viewBox="0 0 28 28"
            className="absolute -right-6 -top-4 h-7 w-7"
            fill="none"
            stroke={NG_ORANGE}
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {NG_SPARKS.map((d, i) => (
              <path
                key={d}
                d={d}
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "center",
                  animation: `tl-ng-spark 1.8s ease-in-out ${i * 0.18}s infinite`,
                }}
              />
            ))}
          </svg>
        </div>

        {/* heading lines */}
        <div className="flex flex-col items-center" style={{ gap: 10 }}>
          <div className="flex items-center" style={{ gap: 8 }}>
            <span
              className="block rounded-full"
              style={{
                width: 64,
                height: 20,
                background: NG_INK,
                transformOrigin: "left center",
                animation: "tl-ng-bar 3.4s cubic-bezier(.22,1,.36,1) infinite both",
              }}
            />
            <span
              className="block rounded-full"
              style={{
                width: 96,
                height: 20,
                background: NG_ORANGE,
                transformOrigin: "left center",
                animation:
                  "tl-ng-bar 3.4s cubic-bezier(.22,1,.36,1) 0.12s infinite both",
              }}
            />
          </div>
          <span
            className="block rounded-full"
            style={{
              width: "min(62vw, 220px)",
              height: 20,
              background: NG_INK,
              transformOrigin: "left center",
              animation:
                "tl-ng-bar 3.4s cubic-bezier(.22,1,.36,1) 0.24s infinite both",
            }}
          />
        </div>

        {/* portrait over the orange circle */}
        <div
          className="relative w-full overflow-hidden"
          style={{ maxWidth: 340, height: "clamp(150px, 27svh, 230px)" }}
        >
          <span
            aria-hidden="true"
            className="tl-gpu absolute rounded-full"
            style={{
              left: "11%",
              bottom: "-45%",
              width: "78%",
              aspectRatio: "1 / 1",
              background: NG_ORANGE,
              transformOrigin: "50% 100%",
              animation: "tl-ng-grow 3.4s cubic-bezier(.22,1,.36,1) infinite both",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 flex justify-center"
          >
            <div
              className="tl-gpu"
              style={{
                width: "44%",
                animation: "tl-ng-rise 3.4s cubic-bezier(.22,1,.36,1) infinite both",
              }}
            >
              <svg viewBox="0 0 200 250" className="block w-full" fill={NG_INK}>
                <circle cx="100" cy="70" r="40" />
                <rect x="86" y="102" width="28" height="40" />
                <path d="M8 250 C8 186 46 146 100 146 C154 146 192 186 192 250 Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* stars */}
        <div className="flex" style={{ gap: 4 }} aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              viewBox="0 0 20 20"
              className="h-4 w-4"
              fill={NG_ORANGE}
              style={{ animation: `tl-ng-star 1.8s ease-in-out ${i * 0.14}s infinite` }}
            >
              <path d="m10 1.5 2.5 5.6 6 .6-4.5 4 1.3 6-5.3-3.1-5.3 3.1 1.3-6-4.5-4 6-.6L10 1.5Z" />
            </svg>
          ))}
        </div>

        {/* CTA pill + curved arrow */}
        <div className="flex items-end gap-2" aria-hidden="true">
          <svg
            viewBox="0 0 70 70"
            className="mb-3 hidden h-14 w-14 sm:block"
            fill="none"
            stroke={NG_INK}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M8 4c-2 22 6 42 40 50"
              pathLength={100}
              strokeDasharray="100"
              style={{ animation: "tl-ng-draw 3.4s ease-in-out infinite" }}
            />
            <path
              d="m38 44 12 10-15 5"
              pathLength={100}
              strokeDasharray="100"
              style={{ animation: "tl-ng-draw 3.4s ease-in-out 0.2s infinite" }}
            />
          </svg>

          <div
            className="flex items-center gap-1 rounded-full bg-white p-1.5"
            style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
          >
            <span
              className="relative flex items-center justify-center overflow-hidden rounded-full"
              style={{ width: 118, height: 46, background: NG_ORANGE }}
            >
              <span
                className="tl-gpu absolute inset-y-0"
                style={{
                  left: 0,
                  width: "40%",
                  background:
                    "linear-gradient(105deg, transparent, rgba(255,255,255,0.4), transparent)",
                  animation: "tl-shine 2.2s ease-in-out infinite",
                }}
              />
              <svg
                viewBox="0 0 20 20"
                className="relative h-4 w-4"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 14 14 6M7 6h7v7" />
              </svg>
            </span>
            <span
              className="flex items-center justify-center rounded-full"
              style={{ width: 92, height: 46, border: `2px solid ${NG_INK}` }}
            >
              <span
                className="block rounded-full"
                style={{
                  width: 40,
                  height: 7,
                  background: NG_INK,
                  animation: "tl-blink 2s ease-in-out infinite",
                }}
              />
            </span>
          </div>
        </div>
      </div>
      <ThemeLoaderStyles />
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   6. brutalist  →  "Takeoff / runway" hero
   ─────────────────────────────────────────────────────────── */
const AV_CORAL = "#f25346";

/* [x %, y %, size px, delay s] */
const AV_STARS: [number, number, number, number][] = [
  [6, 8, 2, 0],
  [14, 22, 1.5, 0.6],
  [22, 10, 2, 1.2],
  [31, 30, 1.5, 0.3],
  [39, 14, 2.5, 0.9],
  [47, 6, 1.5, 1.5],
  [55, 26, 2, 0.2],
  [63, 12, 1.5, 1.1],
  [71, 32, 2, 0.7],
  [79, 9, 2.5, 1.4],
  [87, 24, 1.5, 0.4],
  [94, 14, 2, 1],
  [10, 40, 1.5, 1.3],
  [28, 44, 2, 0.5],
  [52, 42, 1.5, 0.8],
  [76, 46, 2, 1.6],
  [91, 40, 1.5, 0.1],
  [18, 3, 1.5, 0.9],
];

const AV_WINDOWS = [66, 74, 82, 90, 98];

export function BrutalistLoader(_props: LoaderProps) {
  const rootStyle = {
    background:
      "linear-gradient(to bottom, #02040f 0%, #070c2b 55%, #101a4d 80%, #1b2766 100%)",
    "--rw": "clamp(120px, 24svh, 220px)",
  } as CSSProperties;

  return (
    <div className={ROOT} style={rootStyle} {...A11Y}>
      {/* stars */}
      {AV_STARS.map(([x, y, s, d], i) => (
        <span
          key={i}
          aria-hidden="true"
          className="absolute rounded-full bg-white"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: s,
            height: s,
            animation: `tl-twinkle 2.6s ease-in-out ${d}s infinite`,
          }}
        />
      ))}

      {/* horizon glow */}
      <div
        aria-hidden="true"
        className="tl-gpu pointer-events-none absolute inset-x-0"
        style={{
          bottom: "var(--rw)",
          height: "36%",
          background:
            "radial-gradient(ellipse 60% 70% at 50% 100%, rgba(242,83,70,0.3), transparent 72%)",
          animation: "tl-breathe 4s ease-in-out infinite",
        }}
      />

      {/* chip: ready for takeoff */}
      <div
        aria-hidden="true"
        className="absolute left-5 top-6 flex items-center gap-2.5 rounded-full px-3.5 py-2 sm:left-10 sm:top-9"
        style={{
          background: "rgba(5,8,28,0.55)",
          border: "1px solid rgba(255,255,255,0.14)",
        }}
      >
        <span className="relative flex h-2 w-2">
          <span
            className="absolute inset-0 rounded-full"
            style={{
              background: "rgba(242,83,70,0.7)",
              animation: "tl-ping 1.6s cubic-bezier(0,0,.2,1) infinite",
            }}
          />
          <span className="relative h-2 w-2 rounded-full" style={{ background: AV_CORAL }} />
        </span>
        <span
          className="block rounded-full"
          style={{ width: 62, height: 4, background: "rgba(255,255,255,0.5)" }}
        />
      </div>

      {/* runway */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 overflow-hidden"
        style={{
          height: "var(--rw)",
          background: "linear-gradient(to bottom, #0c1335, #050824)",
          borderTop: "1px solid rgba(242,83,70,0.4)",
        }}
      >
        {/* edge lights — element ek period zyada chauda, translateX(-period) loop */}
        <div
          className="tl-gpu absolute left-0"
          style={{
            top: "14%",
            height: 10,
            width: "calc(100% + 48px)",
            backgroundImage:
              "radial-gradient(circle, rgba(242,83,70,1) 0 2.5px, rgba(242,83,70,0.25) 3px, transparent 5px)",
            backgroundSize: "48px 10px",
            animation: "tl-av-lights 0.5s linear infinite",
          }}
        />
        {/* centre line */}
        <div
          className="tl-gpu absolute left-0"
          style={{
            top: "58%",
            height: 5,
            width: "calc(100% + 84px)",
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.9) 0 36px, transparent 36px 84px)",
            animation: "tl-av-dash 0.45s linear infinite",
          }}
        />
        {/* lower edge */}
        <div
          className="absolute inset-x-0"
          style={{ bottom: "12%", height: 1, background: "rgba(255,255,255,0.18)" }}
        />
      </div>

      {/* plane */}
      <div
        aria-hidden="true"
        className="tl-gpu absolute"
        style={{
          left: "4%",
          bottom: "calc(var(--rw) - 6px)",
          animation: "tl-av-fly 4.4s linear infinite",
        }}
      >
        {/* contrail */}
        <span
          className="absolute right-full top-1/2 block"
          style={{
            width: "clamp(90px, 30vw, 360px)",
            height: 2,
            background:
              "linear-gradient(to left, rgba(255,255,255,0.75), transparent)",
            transformOrigin: "right center",
            animation: "tl-av-trail 4.4s linear infinite",
          }}
        />
        <svg
          viewBox="0 0 120 44"
          className="relative block"
          style={{ width: "clamp(88px, 17vw, 150px)" }}
        >
          {/* fuselage */}
          <path
            d="M6 22 C6 16 20 13 44 13 L96 13 C110 13 118 18 118 22 C118 26 110 29 96 29 L44 29 C20 29 6 28 6 22 Z"
            fill="rgba(255,255,255,0.96)"
          />
          {/* tail fin */}
          <path d="M12 16 L4 3 L18 3 L32 15 Z" fill="rgba(255,255,255,0.96)" />
          {/* wing */}
          <path d="M52 25 L76 25 L60 35 L46 35 Z" fill="rgba(226,232,255,0.95)" />
          {/* stripe + windows */}
          <path d="M28 22 H112" stroke={AV_CORAL} strokeWidth="2" />
          {AV_WINDOWS.map((cx) => (
            <circle key={cx} cx={cx} cy="18.5" r="1.7" fill="#0b1130" />
          ))}
          {/* landing gear */}
          <path d="M36 29 V35 M88 29 V35" stroke="#cfd6ff" strokeWidth="2" />
          <circle cx="36" cy="38" r="3.6" fill="#cfd6ff" />
          <circle cx="88" cy="38" r="3.6" fill="#cfd6ff" />
          {/* beacon */}
          <circle
            cx="6"
            cy="3"
            r="2.6"
            fill={AV_CORAL}
            style={{ animation: "tl-blink 0.9s ease-in-out infinite" }}
          />
        </svg>
      </div>
      <ThemeLoaderStyles />
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   7. cinematic
   ─────────────────────────────────────────────────────────── */
const CN_CREAM = "#f3ede2";

/* Abstract title glyphs (no readable text) */
const CN_GLYPHS = [
  "M2 30 a18 18 0 1 0 36 0 a18 18 0 1 0 -36 0",
  "M20 6 V54",
  "M4 54 L20 6 L36 54 Z",
  "M8 6 V54 H34",
  "M6 54 L34 6",
  "M6 54 V24 A14 14 0 0 1 34 24 V54",
  "M6 6 H34 V54 H6 Z",
  "M6 30 H34 M20 6 V54",
];

const CN_SCRATCHES = [
  { l: "22%", d: 0 },
  { l: "71%", d: 1.4 },
];

export function CinematicLoader(_props: LoaderProps) {
  return (
    <div
      className={`${ROOT} flex flex-col items-center justify-center`}
      style={{ background: "#07060a", color: CN_CREAM }}
      {...A11Y}
    >
      {/* warm light leak — gradient only, blur filter hata diya */}
      <div
        aria-hidden="true"
        className="tl-gpu pointer-events-none absolute rounded-full"
        style={{
          left: "50%",
          top: "50%",
          width: 620,
          height: 620,
          marginLeft: -310,
          marginTop: -310,
          background:
            "radial-gradient(circle, rgba(255,186,120,0.2), rgba(255,140,110,0.06) 45%, transparent 66%)",
          animation: "tl-breathe 4s ease-in-out infinite",
        }}
      />

      {/* projector beam */}
      <div
        aria-hidden="true"
        className="tl-gpu pointer-events-none absolute inset-x-0 top-0"
        style={{
          height: "78%",
          clipPath: "polygon(46% 0, 54% 0, 100% 100%, 0 100%)",
          background:
            "linear-gradient(to bottom, rgba(255,240,220,0.14), rgba(255,240,220,0.02) 80%, transparent)",
          animation: "tl-cn-beam 3.2s steps(1, end) infinite",
        }}
      />

      {/* film scratches */}
      {CN_SCRATCHES.map((s) => (
        <span
          key={s.l}
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0"
          style={{
            left: s.l,
            width: 1,
            background: "rgba(255,255,255,0.18)",
            opacity: 0,
            animation: `tl-cn-scratch 2.8s steps(1, end) ${s.d}s infinite`,
          }}
        />
      ))}

      {/* title block */}
      <div className="relative z-10 flex flex-col items-center px-6" aria-hidden="true">
        <div
          className="flex items-center gap-3"
          style={{ animation: "tl-cn-fade 4.8s ease-in-out infinite both" }}
        >
          <span style={{ width: 28, height: 1, background: "rgba(243,237,226,0.5)" }} />
          <span
            className="block rounded-full"
            style={{ width: 64, height: 5, background: "rgba(243,237,226,0.4)" }}
          />
        </div>

        {/* letters developing one by one — blur filter ki jagah opacity+scale */}
        <div
          className="flex items-center"
          style={{
            fontSize: "clamp(32px, 8vw, 72px)",
            gap: "0.35em",
            marginTop: "0.5em",
          }}
        >
          {CN_GLYPHS.map((d, i) => (
            <svg
              key={i}
              viewBox="0 0 40 60"
              className="tl-gpu"
              style={{
                width: "0.62em",
                height: "0.93em",
                overflow: "visible",
                animation: `tl-cn-develop 4.8s cubic-bezier(.2,.7,.2,1) ${i * 0.2}s infinite both`,
              }}
              fill="none"
              stroke={CN_CREAM}
              strokeWidth="5"
              strokeLinejoin="miter"
            >
              <path d={d} />
            </svg>
          ))}
        </div>

        {/* headline + meta skeleton */}
        <span
          className="mt-6 block rounded-full"
          style={{
            width: "min(60vw, 300px)",
            height: 7,
            background: "rgba(243,237,226,0.5)",
            animation: "tl-cn-fade 4.8s ease-in-out 0.5s infinite both",
          }}
        />
        <span
          className="mt-3 block rounded-full"
          style={{
            width: 120,
            height: 4,
            background: "rgba(243,237,226,0.28)",
            animation: "tl-cn-fade 4.8s ease-in-out 0.7s infinite both",
          }}
        />
      </div>

      {/* scroll hint */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: "calc(9vh + 22px)" }}
      >
        <span
          className="block"
          style={{
            width: 1,
            height: 40,
            background: `linear-gradient(to bottom, ${CN_CREAM}, transparent)`,
            animation: "tl-blink 2s ease-in-out infinite",
          }}
        />
      </div>

      {/* vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.78) 100%)",
        }}
      />
      {/* film grain — pehle inset:-50% (4x screen) tha, ab -10% + 256px tile */}
      <div
        aria-hidden="true"
        className="tl-gpu pointer-events-none absolute"
        style={{
          inset: "-10%",
          opacity: 0.07,
          backgroundImage: GRAIN,
          backgroundSize: "256px 256px",
          animation: "tl-grain 0.8s steps(6) infinite",
        }}
      />
      {/* letterbox */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 bg-black"
        style={{
          height: "9vh",
          transformOrigin: "top",
          animation: "tl-letterbox 1.2s cubic-bezier(.2,.8,.2,1) both",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 bg-black"
        style={{
          height: "9vh",
          transformOrigin: "bottom",
          animation: "tl-letterbox 1.2s cubic-bezier(.2,.8,.2,1) both",
        }}
      />
      <ThemeLoaderStyles />
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   Shared keyframes (sab "tl-" prefixed, collision safe)
   Constant string: har render par dobara build nahi hota.
   ─────────────────────────────────────────────────────────── */
const LOADER_CSS = `
  .tl-root {
    contain: layout paint style;
    -webkit-tap-highlight-color: transparent;
  }
  .tl-gpu { will-change: transform, opacity; }

  /* shared */
  @keyframes tl-spin { to { transform: rotate(360deg); } }
  @keyframes tl-spin-rev { to { transform: rotate(-360deg); } }
  @keyframes tl-breathe {
    0%, 100% { transform: scale(0.88); opacity: 0.75; }
    50% { transform: scale(1.08); opacity: 1; }
  }
  @keyframes tl-float {
    0%, 100% { transform: translateY(0) rotate(-1deg); }
    50% { transform: translateY(-10px) rotate(1deg); }
  }
  @keyframes tl-blink {
    0%, 100% { opacity: 0.35; }
    50% { opacity: 1; }
  }
  @keyframes tl-ping {
    0% { transform: scale(1); opacity: 0.7; }
    75%, 100% { transform: scale(2.6); opacity: 0; }
  }
  @keyframes tl-shine {
    0% { transform: translateX(-160%); }
    60%, 100% { transform: translateX(380%); }
  }
  @keyframes tl-twinkle {
    0%, 100% { opacity: 0.12; }
    50% { opacity: 0.95; }
  }
  @keyframes tl-grain {
    0%   { transform: translate3d(0, 0, 0); }
    20%  { transform: translate3d(-5%, 3%, 0); }
    40%  { transform: translate3d(4%, -6%, 0); }
    60%  { transform: translate3d(-3%, -2%, 0); }
    80%  { transform: translate3d(6%, 5%, 0); }
    100% { transform: translate3d(0, 0, 0); }
  }
  @keyframes tl-letterbox {
    from { transform: scaleY(0); }
    to   { transform: scaleY(1); }
  }

  /* 1 · minimal-airy */
  @keyframes tl-ma-letter {
    0%   { transform: scaleY(0.08); opacity: 0; }
    28%  { transform: scaleY(1); opacity: 1; }
    78%  { transform: scaleY(1); opacity: 1; }
    100% { transform: scaleY(1); opacity: 0; }
  }
  @keyframes tl-ma-rise {
    0%   { transform: translateY(34%); opacity: 0; }
    30%  { transform: translateY(0); opacity: 1; }
    80%  { transform: translateY(0); opacity: 1; }
    100% { transform: translateY(0); opacity: 0; }
  }
  @keyframes tl-ma-ring {
    0%   { transform: scale(1); opacity: 0.55; }
    100% { transform: scale(1.6); opacity: 0; }
  }

  /* 2 · tech-dense */
  @keyframes tl-td-pan { to { transform: translateX(-25%); } }
  @keyframes tl-td-scan {
    0%   { transform: translateY(0); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { transform: translateY(100%); opacity: 0; }
  }
  @keyframes tl-td-slide {
    0%   { transform: translateX(-110%); }
    100% { transform: translateX(280%); }
  }
  @keyframes tl-td-bob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  /* 3 · editorial — gold lens: wrapper aur inner ulte translate (GPU only) */
  .tl-ed-lens-wrap {
    width: 3.6em;
    overflow: hidden;
    -webkit-mask-image: radial-gradient(circle 1.8em at center, #000 50%, transparent 100%);
    mask-image: radial-gradient(circle 1.8em at center, #000 50%, transparent 100%);
    animation: tl-ed-a 3.4s cubic-bezier(.6,0,.4,1) infinite;
  }
  .tl-ed-lens-inner {
    width: 4.6em;
    animation: tl-ed-b 3.4s cubic-bezier(.6,0,.4,1) infinite;
  }
  @keyframes tl-ed-a {
    from { transform: translateX(-4em); }
    to   { transform: translateX(5.2em); }
  }
  @keyframes tl-ed-b {
    from { transform: translateX(4em); }
    to   { transform: translateX(-5.2em); }
  }

  /* 4 · soft-luxury */
  @keyframes tl-sl-line {
    0%   { transform: scaleX(0); }
    30%, 100% { transform: scaleX(1); }
  }
  @keyframes tl-sl-chomp {
    0%, 8%   { transform: translateX(150px); }
    24%      { transform: translateX(0); }
    30%      { transform: translateX(14px); }
    36%      { transform: translateX(0); }
    58%      { transform: translateX(0); }
    74%, 100% { transform: translateX(150px); }
  }
  @keyframes tl-sl-drop {
    0%, 24% { transform: translateY(0); opacity: 0; }
    28%     { opacity: 1; }
    62%     { transform: translateY(26px); opacity: 0; }
    100%    { transform: translateY(26px); opacity: 0; }
  }
  @keyframes tl-sl-prog {
    0%   { transform: scaleX(0); }
    88%, 100% { transform: scaleX(1); }
  }

  /* 5 · neo-glass */
  @keyframes tl-ng-grow {
    0%   { transform: scale(0.6); opacity: 0; }
    30%  { transform: scale(1); opacity: 1; }
    85%  { transform: scale(1.03); opacity: 1; }
    100% { transform: scale(1.03); opacity: 0; }
  }
  @keyframes tl-ng-rise {
    0%, 10% { transform: translateY(40%); opacity: 0; }
    38%     { transform: translateY(0); opacity: 1; }
    85%     { transform: translateY(0); opacity: 1; }
    100%    { transform: translateY(0); opacity: 0; }
  }
  @keyframes tl-ng-bar {
    0%   { transform: scaleX(0); opacity: 1; }
    28%, 82% { transform: scaleX(1); opacity: 1; }
    100% { transform: scaleX(1); opacity: 0; }
  }
  @keyframes tl-ng-star {
    0%, 100% { transform: scale(1); opacity: 0.45; }
    30% { transform: scale(1.4); opacity: 1; }
  }
  @keyframes tl-ng-spark {
    0%, 100% { opacity: 0.2; transform: scale(0.8); }
    40% { opacity: 1; transform: scale(1.1); }
  }
  @keyframes tl-ng-draw {
    0%   { stroke-dashoffset: 100; opacity: 1; }
    35%, 85% { stroke-dashoffset: 0; opacity: 1; }
    100% { stroke-dashoffset: 0; opacity: 0; }
  }

  /* 6 · takeoff / runway */
  @keyframes tl-av-fly {
    0%   { transform: translate3d(-14vw, 0, 0) rotate(0deg); opacity: 0; animation-timing-function: ease-out; }
    6%   { opacity: 1; }
    42%  { transform: translate3d(34vw, 0, 0) rotate(0deg); animation-timing-function: ease-in; }
    88%  { opacity: 1; }
    100% { transform: translate3d(92vw, -44svh, 0) rotate(-15deg); opacity: 0; }
  }
  @keyframes tl-av-trail {
    0%, 40% { transform: scaleX(0); opacity: 0; }
    58%     { transform: scaleX(1); opacity: 0.9; }
    92%     { transform: scaleX(1); opacity: 0.6; }
    100%    { transform: scaleX(1); opacity: 0; }
  }
  /* background-position ki jagah translateX (period = tile width) */
  @keyframes tl-av-dash { to { transform: translateX(-84px); } }
  @keyframes tl-av-lights { to { transform: translateX(-48px); } }

  /* 7 · cinematic — filter:blur hata diya, sirf opacity/scale */
  @keyframes tl-cn-develop {
    0%   { opacity: 0; transform: scale(1.12); }
    18%  { opacity: 1; transform: scale(1); }
    78%  { opacity: 1; transform: scale(1); }
    92%, 100% { opacity: 0; transform: scale(1); }
  }
  @keyframes tl-cn-fade {
    0%, 15% { opacity: 0; transform: translateY(8px); }
    40%, 80% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(0); }
  }
  @keyframes tl-cn-scratch {
    0%   { opacity: 0; transform: translateX(0); }
    8%   { opacity: 0.5; }
    12%  { opacity: 0; }
    30%  { opacity: 0; transform: translateX(18px); }
    34%  { opacity: 0.4; }
    37%  { opacity: 0; }
    100% { opacity: 0; }
  }
  @keyframes tl-cn-beam {
    0%, 100% { opacity: 0.55; }
    7%  { opacity: 0.85; }
    12% { opacity: 0.5; }
    50% { opacity: 0.72; }
    63% { opacity: 0.45; }
  }

  @media (prefers-reduced-motion: reduce) {
    .tl-root *, .tl-root *::before, .tl-root *::after {
      animation-duration: 8s !important;
    }
  }
`;

function ThemeLoaderStyles() {
  return <style>{LOADER_CSS}</style>;
}

/* ── Map themeId → loader ───────────────────────────────── */

const LOADERS: Record<ThemeId, (props: LoaderProps) => ReactElement> = {
  "minimal-airy": MinimalAiryLoader,
  "tech-dense": TechDenseLoader,
  "neo-glass": NeoGlassLoader,
  "soft-luxury": SoftLuxuryLoader,
  editorial: EditorialLoader,
  brutalist: BrutalistLoader,
  cinematic: CinematicLoader,
};

const THEME_NAMES: Record<ThemeId, string> = {
  "minimal-airy": "Minimal Airy",
  "tech-dense": "Tech Dense",
  "neo-glass": "Neo Glass",
  "soft-luxury": "Soft Luxury",
  editorial: "Editorial",
  brutalist: "Brutalist",
  cinematic: "Cinematic",
};

export function ThemeLoader({ themeId }: { themeId: ThemeId }) {
  const Loader = LOADERS[themeId] ?? TechDenseLoader;
  return <Loader themeName={THEME_NAMES[themeId] ?? themeId} />;
}

/* ── Boot gate: fonts + paint ready, then fade in portfolio ─ */

const MIN_MS = 400; // minimum time so loader is visible (pehle 600)
const MAX_MS = 3000; // hard timeout so it never hangs (pehle 4000)
const FONT_WAIT_MS = 1500; // fonts ka max intezar (pehle 2500)
const FADE_MS = 350;

export function ThemeBootGate({
  themeId,
  children,
}: {
  themeId: ThemeId;
  children: ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let finished = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const later = (fn: () => void, ms: number) => {
      timers.push(setTimeout(fn, ms));
    };

    // idempotent: normal path aur hard timeout dono safe
    const finish = () => {
      if (cancelled || finished) return;
      finished = true;
      setFadeOut(true);
      later(() => {
        if (!cancelled) setReady(true);
      }, FADE_MS);
    };

    const start = performance.now();

    async function waitReady() {
      // 1) fonts
      try {
        if (typeof document !== "undefined" && document.fonts?.ready) {
          await Promise.race([
            document.fonts.ready,
            new Promise((r) => later(() => r(null), FONT_WAIT_MS)),
          ]);
        }
      } catch {
        // ignore
      }

      // 2) next paint
      await new Promise<void>((r) =>
        requestAnimationFrame(() => requestAnimationFrame(() => r())),
      );

      // 3) min display time
      const elapsed = performance.now() - start;
      if (elapsed < MIN_MS) {
        await new Promise((r) => later(() => r(null), MIN_MS - elapsed));
      }

      finish();
    }

    later(finish, MAX_MS);
    waitReady();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [themeId]);

  return (
    <>
      {/* Portfolio always in DOM so fonts/layout start loading */}
      <div
        style={{
          opacity: ready ? 1 : 0,
          transition: "opacity 0.4s ease",
          visibility: ready ? "visible" : "hidden",
        }}
      >
        {children}
      </div>

      {!ready && (
        <div
          style={{
            opacity: fadeOut ? 0 : 1,
            transition: `opacity ${FADE_MS}ms ease`,
            pointerEvents: fadeOut ? "none" : "auto",
          }}
        >
          <ThemeLoader themeId={themeId} />
        </div>
      )}
    </>
  );
}