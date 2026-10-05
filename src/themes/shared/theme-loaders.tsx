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
   - No text, sirf animation
   - Har theme ka apna visual language
   - themeName prop backward-compat ke liye rakha hai (use nahi hota)
   ═══════════════════════════════════════════════════════════ */

type LoaderProps = { themeName?: string };

const ROOT = "tl-root fixed inset-0 z-[9999] overflow-hidden";

/* ───────────────────────────────────────────────────────────
   1. minimal-airy — soft light, breathing orb + drifting light
   ─────────────────────────────────────────────────────────── */
export function MinimalAiryLoader(_props: LoaderProps) {
  return (
    <div
      className={`${ROOT} flex items-center justify-center`}
      style={{
        background:
          "radial-gradient(ellipse at 50% 38%, #ffffff 0%, #f4f7fb 55%, #e9eff8 100%)",
      }}
      role="status"
      aria-busy="true"
      aria-label="Loading portfolio"
    >
      {/* drifting light fields */}
      <div
        className="absolute rounded-full"
        style={{
          width: 460,
          height: 460,
          left: "50%",
          top: "50%",
          marginLeft: -360,
          marginTop: -300,
          background:
            "radial-gradient(circle, rgba(37,99,235,0.16), transparent 66%)",
          filter: "blur(36px)",
          animation: "tl-drift-a 9s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          left: "50%",
          top: "50%",
          marginLeft: -40,
          marginTop: -80,
          background:
            "radial-gradient(circle, rgba(14,165,233,0.14), transparent 66%)",
          filter: "blur(40px)",
          animation: "tl-drift-b 11s ease-in-out infinite",
        }}
      />

      <div className="relative h-32 w-32">
        {/* outer arc */}
        <svg
          viewBox="0 0 120 120"
          className="absolute inset-0 h-full w-full"
          style={{ animation: "tl-spin 5s linear infinite" }}
        >
          <defs>
            <linearGradient id="tl-ma-g1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="rgba(37,99,235,0.10)"
            strokeWidth="1"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="url(#tl-ma-g1)"
            strokeWidth="1.8"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray="34 66"
          />
        </svg>

        {/* inner arc, reverse */}
        <svg
          viewBox="0 0 120 120"
          className="absolute inset-0 h-full w-full"
          style={{ animation: "tl-spin-rev 7s linear infinite" }}
        >
          <circle
            cx="60"
            cy="60"
            r="40"
            fill="none"
            stroke="rgba(56,189,248,0.55)"
            strokeWidth="1.2"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray="18 82"
          />
        </svg>

        {/* orbiting dot */}
        <div
          className="absolute inset-0"
          style={{
            animation: "tl-spin 3.2s cubic-bezier(.45,.05,.55,.95) infinite",
          }}
        >
          <div
            className="absolute left-1/2 rounded-full"
            style={{
              top: -3,
              width: 7,
              height: 7,
              marginLeft: -3.5,
              background: "#2563eb",
              boxShadow: "0 0 14px 3px rgba(37,99,235,0.45)",
            }}
          />
        </div>

        {/* breathing core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="rounded-full"
            style={{
              width: 34,
              height: 34,
              background:
                "radial-gradient(circle at 35% 30%, #ffffff 0%, #bfdbfe 45%, #60a5fa 100%)",
              boxShadow:
                "0 10px 30px rgba(37,99,235,0.28), inset 0 -4px 10px rgba(37,99,235,0.2)",
              animation: "tl-breathe 2.6s ease-in-out infinite",
            }}
          />
        </div>
      </div>
      <ThemeLoaderStyles />
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   2. tech-dense — radar sweep, grid, scan line, HUD corners
   ─────────────────────────────────────────────────────────── */
const BLIPS = [
  { x: 64, y: 28, d: 0 },
  { x: 26, y: 56, d: 0.7 },
  { x: 72, y: 70, d: 1.4 },
  { x: 42, y: 20, d: 2.1 },
];

export function TechDenseLoader(_props: LoaderProps) {
  const corner = (pos: CSSProperties, b: CSSProperties) => (
    <div
      className="absolute"
      style={{
        width: 22,
        height: 22,
        borderColor: "rgba(34,211,238,0.55)",
        animation: "tl-blink 2.4s ease-in-out infinite",
        ...pos,
        ...b,
      }}
    />
  );

  return (
    <div
      className={`${ROOT} flex flex-col items-center justify-center`}
      style={{ background: "#07111c" }}
      role="status"
      aria-busy="true"
      aria-label="Loading portfolio"
    >
      {/* grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.07) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          WebkitMaskImage:
            "radial-gradient(circle at center, #000 0%, transparent 70%)",
          maskImage:
            "radial-gradient(circle at center, #000 0%, transparent 70%)",
          animation: "tl-grid 3s linear infinite",
        }}
      />
      {/* scan line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{
          height: 2,
          background:
            "linear-gradient(90deg, transparent, rgba(34,211,238,0.8), transparent)",
          boxShadow: "0 0 24px 4px rgba(34,211,238,0.35)",
          animation: "tl-scan-y 3.6s linear infinite",
        }}
      />
      {/* HUD corners */}
      {corner(
        { top: 24, left: 24 },
        { borderTopWidth: 2, borderLeftWidth: 2, borderStyle: "solid" },
      )}
      {corner(
        { top: 24, right: 24 },
        { borderTopWidth: 2, borderRightWidth: 2, borderStyle: "solid" },
      )}
      {corner(
        { bottom: 24, left: 24 },
        { borderBottomWidth: 2, borderLeftWidth: 2, borderStyle: "solid" },
      )}
      {corner(
        { bottom: 24, right: 24 },
        { borderBottomWidth: 2, borderRightWidth: 2, borderStyle: "solid" },
      )}

      {/* radar */}
      <div className="relative" style={{ width: 168, height: 168 }}>
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: "1px solid rgba(34,211,238,0.45)",
            boxShadow:
              "0 0 40px rgba(34,211,238,0.12), inset 0 0 40px rgba(34,211,238,0.06)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{ inset: 28, border: "1px solid rgba(34,211,238,0.28)" }}
        />
        <div
          className="absolute rounded-full"
          style={{ inset: 56, border: "1px solid rgba(34,211,238,0.2)" }}
        />
        <div
          className="absolute left-1/2 top-0 h-full"
          style={{ width: 1, background: "rgba(34,211,238,0.18)" }}
        />
        <div
          className="absolute left-0 top-1/2 w-full"
          style={{ height: 1, background: "rgba(34,211,238,0.18)" }}
        />
        {/* sweep */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(34,211,238,0) 0deg, rgba(34,211,238,0) 250deg, rgba(34,211,238,0.55) 360deg)",
            animation: "tl-spin 2.4s linear infinite",
          }}
        />
        {/* blips */}
        {BLIPS.map((b, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: 6,
              height: 6,
              background: "#a5f3fc",
              boxShadow: "0 0 10px 2px rgba(34,211,238,0.8)",
              animation: `tl-blip 2.8s ease-out ${b.d}s infinite`,
            }}
          />
        ))}
        <div
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: 6,
            height: 6,
            marginLeft: -3,
            marginTop: -3,
            background: "#22d3ee",
            boxShadow: "0 0 12px 3px rgba(34,211,238,0.7)",
          }}
        />
      </div>

      {/* segment progress (no text) */}
      <div className="mt-10 flex gap-1.5">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            style={{
              width: 10,
              height: 4,
              borderRadius: 1,
              background: "#22d3ee",
              animation: `tl-cell 2s ease-in-out ${i * 0.09}s infinite`,
            }}
          />
        ))}
      </div>
      <ThemeLoaderStyles />
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   3. neo-glass — floating glass card, living aurora behind
   ─────────────────────────────────────────────────────────── */
export function NeoGlassLoader(_props: LoaderProps) {
  const ringMask =
    "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))";

  return (
    <div
      className={`${ROOT} flex items-center justify-center`}
      style={{ background: "#080c15" }}
      role="status"
      aria-busy="true"
      aria-label="Loading portfolio"
    >
      {/* aurora blobs */}
      <div
        className="absolute rounded-full"
        style={{
          width: 520,
          height: 520,
          left: "50%",
          top: "50%",
          marginLeft: -420,
          marginTop: -340,
          background:
            "radial-gradient(circle, rgba(34,211,238,0.34), transparent 65%)",
          filter: "blur(50px)",
          animation: "tl-drift-a 9s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 560,
          height: 560,
          left: "50%",
          top: "50%",
          marginLeft: -120,
          marginTop: -180,
          background:
            "radial-gradient(circle, rgba(108,92,255,0.34), transparent 65%)",
          filter: "blur(56px)",
          animation: "tl-drift-b 12s ease-in-out infinite",
        }}
      />

      <div className="relative flex flex-col items-center">
        {/* glass card */}
        <div
          className="relative flex items-center justify-center overflow-hidden"
          style={{
            width: 128,
            height: 128,
            borderRadius: 36,
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.14), rgba(255,255,255,0.03))",
            border: "1px solid rgba(255,255,255,0.22)",
            backdropFilter: "blur(22px)",
            WebkitBackdropFilter: "blur(22px)",
            boxShadow:
              "0 24px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.28)",
            animation: "tl-float 3.2s ease-in-out infinite",
          }}
        >
          {/* spinning conic ring */}
          <div
            className="absolute rounded-full"
            style={{
              width: 76,
              height: 76,
              background:
                "conic-gradient(from 0deg, rgba(34,211,238,0), #22d3ee, #6c5cff, rgba(108,92,255,0))",
              WebkitMask: ringMask,
              mask: ringMask,
              animation: "tl-spin 1.6s linear infinite",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 52,
              height: 52,
              background:
                "conic-gradient(from 180deg, rgba(108,92,255,0), rgba(232,244,255,0.9), rgba(34,211,238,0))",
              WebkitMask: ringMask,
              mask: ringMask,
              animation: "tl-spin-rev 2.4s linear infinite",
            }}
          />
          {/* core */}
          <div
            className="rounded-full"
            style={{
              width: 18,
              height: 18,
              background:
                "radial-gradient(circle at 35% 30%, #fff, #67e8f9 55%, #6c5cff)",
              boxShadow: "0 0 24px 6px rgba(103,232,249,0.45)",
              animation: "tl-breathe 2s ease-in-out infinite",
            }}
          />
          {/* shine sweep */}
          <div
            className="absolute inset-y-0"
            style={{
              left: 0,
              width: "45%",
              background:
                "linear-gradient(105deg, transparent, rgba(255,255,255,0.28), transparent)",
              animation: "tl-shine 2.8s ease-in-out infinite",
            }}
          />
        </div>

        {/* floor shadow reacts to float */}
        <div
          className="mt-8 rounded-full"
          style={{
            width: 96,
            height: 12,
            background:
              "radial-gradient(ellipse, rgba(0,0,0,0.55), transparent 70%)",
            filter: "blur(4px)",
            animation: "tl-shadow 3.2s ease-in-out infinite",
          }}
        />
      </div>
      <ThemeLoaderStyles />
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   4. soft-luxury — gold ornament ring, rising dust, jewel core
   ─────────────────────────────────────────────────────────── */
const DUST = [
  { l: 22, s: 3, d: 7, t: -1 },
  { l: 34, s: 2, d: 9, t: -4 },
  { l: 46, s: 3, d: 8, t: -6 },
  { l: 58, s: 2, d: 10, t: -2 },
  { l: 68, s: 3, d: 7.5, t: -5 },
  { l: 78, s: 2, d: 9.5, t: -3 },
  { l: 40, s: 2, d: 11, t: -8 },
  { l: 62, s: 2, d: 8.5, t: -7 },
];

export function SoftLuxuryLoader(_props: LoaderProps) {
  return (
    <div
      className={`${ROOT} flex items-center justify-center`}
      style={{
        background:
          "radial-gradient(ellipse at 50% 45%, #2a2030 0%, #15111a 55%, #0c0a0f 100%)",
      }}
      role="status"
      aria-busy="true"
      aria-label="Loading portfolio"
    >
      {/* rising gold dust */}
      {DUST.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.l}%`,
            bottom: 0,
            width: p.s,
            height: p.s,
            background: "#e8c9a6",
            boxShadow: "0 0 8px 1px rgba(212,175,140,0.7)",
            animation: `tl-dust ${p.d}s linear ${p.t}s infinite`,
          }}
        />
      ))}

      <div className="relative" style={{ width: 176, height: 176 }}>
        {/* glow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(212,175,140,0.22), transparent 62%)",
            animation: "tl-breathe 3.4s ease-in-out infinite",
          }}
        />
        {/* tick ring */}
        <svg
          viewBox="0 0 160 160"
          className="absolute inset-0 h-full w-full"
          style={{ animation: "tl-spin 28s linear infinite" }}
        >
          <circle
            cx="80"
            cy="80"
            r="74"
            fill="none"
            stroke="rgba(212,175,140,0.55)"
            strokeWidth="5"
            pathLength={120}
            strokeDasharray="0.5 2.5"
          />
          <circle
            cx="80"
            cy="80"
            r="68"
            fill="none"
            stroke="rgba(212,175,140,0.35)"
            strokeWidth="0.8"
          />
        </svg>
        {/* drawing arc */}
        <svg
          viewBox="0 0 160 160"
          className="absolute inset-0 h-full w-full"
          style={{
            animation: "tl-spin-rev 5s cubic-bezier(.5,0,.5,1) infinite",
          }}
        >
          <defs>
            <linearGradient id="tl-sl-g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f5e6d3" />
              <stop offset="100%" stopColor="#b88a5e" stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle
            cx="80"
            cy="80"
            r="56"
            fill="none"
            stroke="url(#tl-sl-g)"
            strokeWidth="1.4"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray="42 58"
          />
        </svg>
        <div
          className="absolute rounded-full"
          style={{
            inset: 46,
            border: "1px solid rgba(212,175,140,0.3)",
            animation: "tl-spin 12s linear infinite",
          }}
        />

        {/* jewel */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div style={{ animation: "tl-breathe 2.8s ease-in-out infinite" }}>
            <div
              className="relative overflow-hidden"
              style={{
                width: 26,
                height: 26,
                transform: "rotate(45deg)",
                background:
                  "linear-gradient(135deg, #f8ead8 0%, #d4af8c 50%, #8a6340 100%)",
                boxShadow: "0 0 28px rgba(212,175,140,0.55)",
              }}
            >
              <div
                className="absolute inset-y-0"
                style={{
                  width: "40%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent)",
                  animation: "tl-shine 2.6s ease-in-out infinite",
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <ThemeLoaderStyles />
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   5. editorial — column rules wipe in/out like a page layout
   ─────────────────────────────────────────────────────────── */
const COLS = [
  { h: 44, o: 0.35 },
  { h: 76, o: 0.9 },
  { h: 56, o: 0.5 },
  { h: 96, o: 1, accent: true },
  { h: 64, o: 0.7 },
  { h: 84, o: 0.45 },
  { h: 52, o: 0.9 },
];

export function EditorialLoader(_props: LoaderProps) {
  return (
    <div
      className={`${ROOT} flex flex-col items-center justify-center`}
      style={{ background: "#111113" }}
      role="status"
      aria-busy="true"
      aria-label="Loading portfolio"
    >
      <div className="flex flex-col items-center" style={{ gap: 18 }}>
        {/* top rule draws */}
        <div
          style={{
            width: 188,
            height: 1,
            background: "rgba(244,240,234,0.7)",
            transformOrigin: "left center",
            animation: "tl-rule 2.4s cubic-bezier(.65,0,.35,1) infinite",
          }}
        />

        {/* column bars wipe */}
        <div className="flex items-end" style={{ gap: 12, height: 100 }}>
          {COLS.map((c, i) => (
            <div
              key={i}
              style={{
                width: 4,
                height: c.h,
                borderRadius: 1,
                background: c.accent ? "#d9b26f" : "#f4f0ea",
                opacity: c.o,
                animation: `tl-wipe 2.4s cubic-bezier(.65,0,.35,1) ${i * 0.1}s infinite`,
              }}
            />
          ))}
        </div>

        {/* bottom rule draws opposite */}
        <div
          style={{
            width: 188,
            height: 1,
            background: "rgba(244,240,234,0.35)",
            transformOrigin: "right center",
            animation: "tl-rule 2.4s cubic-bezier(.65,0,.35,1) 0.25s infinite",
          }}
        />
      </div>
      <ThemeLoaderStyles />
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   6. brutalist — hard steps, offset shadow, hazard tape
   ─────────────────────────────────────────────────────────── */
const BRUTAL_ORDER = [0, 1, 2, 5, 4, 3, 6, 7, 8];

export function BrutalistLoader(_props: LoaderProps) {
  const tape: CSSProperties = {
    height: 14,
    backgroundImage:
      "repeating-linear-gradient(-45deg, #67e8f9 0 10px, #05081c 10px 20px)",
    backgroundSize: "28.28px 100%",
    animation: "tl-hazard 0.9s linear infinite",
  };

  return (
    <div
      className={`${ROOT} flex flex-col items-center justify-center`}
      style={{ background: "#05081c" }}
      role="status"
      aria-busy="true"
      aria-label="Loading portfolio"
    >
      <div className="absolute inset-x-0 top-0" style={tape} />
      <div className="absolute inset-x-0 bottom-0" style={tape} />

      <div
        className="relative flex items-center justify-center"
        style={{
          width: 124,
          height: 124,
          border: "4px solid #67e8f9",
          animation: "tl-hardshadow 1.2s steps(2, end) infinite",
        }}
      >
        <div
          className="grid"
          style={{ gridTemplateColumns: "repeat(3, 20px)", gap: 6 }}
        >
          {BRUTAL_ORDER.map((step, i) => (
            <span
              key={i}
              style={{
                width: 20,
                height: 20,
                border: "2px solid #f7f3ea",
                animation: `tl-flash 1.8s steps(1, end) ${step * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
        {/* glitch slice */}
        <div
          className="absolute inset-x-0"
          style={{
            top: "42%",
            height: 10,
            background: "#67e8f9",
            mixBlendMode: "difference",
            animation: "tl-glitch 1.5s steps(1, end) infinite",
          }}
        />
      </div>

      {/* chunky progress */}
      <div
        className="mt-12"
        style={{
          width: 176,
          height: 14,
          border: "3px solid #f7f3ea",
          padding: 2,
        }}
      >
        <div
          style={{
            height: "100%",
            background: "#67e8f9",
            animation: "tl-fill 1.6s steps(8, end) infinite",
          }}
        />
      </div>
      <ThemeLoaderStyles />
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   7. cinematic — letterbox, grain, anamorphic flare, petals
   ─────────────────────────────────────────────────────────── */
const PETALS = [
  { l: 8, s: 10, d: 9, t: -1, w: 40 },
  { l: 18, s: 14, d: 11, t: -4, w: -30 },
  { l: 29, s: 9, d: 8, t: -7, w: 55 },
  { l: 38, s: 12, d: 12, t: -2, w: -45 },
  { l: 47, s: 16, d: 10, t: -9, w: 30 },
  { l: 56, s: 10, d: 9.5, t: -5, w: -55 },
  { l: 64, s: 13, d: 13, t: -3, w: 35 },
  { l: 73, s: 9, d: 8.5, t: -8, w: -25 },
  { l: 81, s: 15, d: 11.5, t: -6, w: 50 },
  { l: 90, s: 11, d: 10.5, t: -10, w: -40 },
  { l: 24, s: 8, d: 12.5, t: -11, w: 25 },
  { l: 69, s: 12, d: 9, t: -0.5, w: -35 },
];

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function CinematicLoader(_props: LoaderProps) {
  return (
    <div
      className={`${ROOT} flex items-center justify-center`}
      style={{ background: "#07060b" }}
      role="status"
      aria-busy="true"
      aria-label="Loading portfolio"
    >
      {/* warm light leak */}
      <div
        className="absolute rounded-full"
        style={{
          width: 560,
          height: 560,
          left: "50%",
          top: "50%",
          marginLeft: -280,
          marginTop: -280,
          background:
            "radial-gradient(circle, rgba(242,166,196,0.22), transparent 62%)",
          filter: "blur(30px)",
          animation: "tl-breathe 4s ease-in-out infinite",
        }}
      />

      {/* falling cherry blossom */}
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="absolute top-0"
          style={
            {
              left: `${p.l}%`,
              width: p.s,
              height: p.s * 0.8,
              borderRadius: "100% 0 100% 0",
              background: "linear-gradient(135deg, #ffd6e6, #f2a6c4)",
              boxShadow: "0 0 10px rgba(242,166,196,0.35)",
              ["--sway" as string]: `${p.w}px`,
              animation: `tl-petal ${p.d}s linear ${p.t}s infinite`,
            } as CSSProperties
          }
        />
      ))}

      {/* anamorphic flare */}
      <div className="relative flex items-center justify-center">
        <div
          style={{
            width: "min(78vw, 560px)",
            height: 16,
            background:
              "linear-gradient(90deg, transparent, rgba(242,166,196,0.55), rgba(255,236,244,0.95), rgba(242,166,196,0.55), transparent)",
            filter: "blur(10px)",
            animation: "tl-flare 3.4s ease-in-out infinite",
          }}
        />
        <div
          className="absolute"
          style={{
            width: "min(78vw, 560px)",
            height: 2,
            background:
              "linear-gradient(90deg, transparent, #f2a6c4, #ffffff, #f2a6c4, transparent)",
            animation: "tl-flare 3.4s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 10,
            height: 10,
            background: "#fff",
            boxShadow: "0 0 30px 10px rgba(255,214,230,0.8)",
            animation: "tl-breathe 3.4s ease-in-out infinite",
          }}
        />
      </div>

      {/* vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.75) 100%)",
        }}
      />
      {/* film grain */}
      <div
        className="pointer-events-none absolute opacity-[0.08]"
        style={{
          inset: "-50%",
          backgroundImage: GRAIN,
          animation: "tl-grain 0.8s steps(6) infinite",
        }}
      />
      {/* letterbox */}
      <div
        className="absolute inset-x-0 top-0 bg-black"
        style={{
          height: "9vh",
          transformOrigin: "top",
          animation: "tl-letterbox 1.2s cubic-bezier(.2,.8,.2,1) both",
        }}
      />
      <div
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
   ─────────────────────────────────────────────────────────── */
function ThemeLoaderStyles() {
  return (
    <style>{`
      @keyframes tl-spin { to { transform: rotate(360deg); } }
      @keyframes tl-spin-rev { to { transform: rotate(-360deg); } }

      @keyframes tl-breathe {
        0%, 100% { transform: scale(0.88); opacity: 0.75; }
        50% { transform: scale(1.08); opacity: 1; }
      }
      @keyframes tl-float {
        0%, 100% { transform: translateY(0) rotate(-1deg); }
        50% { transform: translateY(-14px) rotate(1deg); }
      }
      @keyframes tl-shadow {
        0%, 100% { transform: scale(1); opacity: 0.9; }
        50% { transform: scale(0.72); opacity: 0.5; }
      }
      @keyframes tl-drift-a {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(90px, 50px) scale(1.15); }
      }
      @keyframes tl-drift-b {
        0%, 100% { transform: translate(0, 0) scale(1.1); }
        50% { transform: translate(-80px, -40px) scale(0.92); }
      }
      @keyframes tl-shine {
        0% { transform: translateX(-160%); }
        60%, 100% { transform: translateX(380%); }
      }

      /* tech */
      @keyframes tl-scan-y {
        0% { transform: translateY(0); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(100vh); opacity: 0; }
      }
      @keyframes tl-grid {
        to { background-position: 0 44px, 0 0; }
      }
      @keyframes tl-blink {
        0%, 100% { opacity: 0.35; }
        50% { opacity: 1; }
      }
      @keyframes tl-blip {
        0% { transform: scale(0.4); opacity: 0; }
        8% { transform: scale(1.4); opacity: 1; }
        45% { transform: scale(1); opacity: 0.7; }
        100% { transform: scale(0.8); opacity: 0; }
      }
      @keyframes tl-cell {
        0%, 100% { opacity: 0.15; transform: scaleY(0.8); }
        35% { opacity: 1; transform: scaleY(1.6); }
      }

      /* editorial */
      @keyframes tl-wipe {
        0%   { clip-path: inset(100% 0 0 0); }
        40%, 60% { clip-path: inset(0 0 0 0); }
        100% { clip-path: inset(0 0 100% 0); }
      }
      @keyframes tl-rule {
        0%   { transform: scaleX(0); }
        40%, 60% { transform: scaleX(1); }
        100% { transform: scaleX(0); }
      }

      /* brutalist */
      @keyframes tl-hazard {
        to { background-position: 28.28px 0; }
      }
      @keyframes tl-hardshadow {
        0%   { box-shadow: 10px 10px 0 #f7f3ea; transform: translate(0, 0); }
        50%  { box-shadow: 0 0 0 #f7f3ea; transform: translate(5px, 5px); }
        100% { box-shadow: 10px 10px 0 #f7f3ea; transform: translate(0, 0); }
      }
      @keyframes tl-flash {
        0%   { background: #67e8f9; }
        22%, 100% { background: transparent; }
      }
      @keyframes tl-glitch {
        0%, 100% { transform: translateX(0); opacity: 0; }
        20% { transform: translateX(-14px); opacity: 1; }
        40% { transform: translateX(10px); opacity: 1; }
        60% { transform: translateX(0); opacity: 0; }
        80% { transform: translateX(-6px); opacity: 1; }
      }
      @keyframes tl-fill {
        0% { width: 0%; }
        100% { width: 100%; }
      }

      /* luxury */
      @keyframes tl-dust {
        0%   { transform: translateY(0); opacity: 0; }
        15%  { opacity: 0.9; }
        85%  { opacity: 0.6; }
        100% { transform: translateY(-100vh); opacity: 0; }
      }

      /* cinematic */
      @keyframes tl-flare {
        0%, 100% { transform: scaleX(0.35); opacity: 0.45; }
        50% { transform: scaleX(1); opacity: 1; }
      }
      @keyframes tl-petal {
        0%   { transform: translate3d(0, -12vh, 0) rotate(0deg); opacity: 0; }
        10%  { opacity: 0.95; }
        50%  { transform: translate3d(var(--sway), 50vh, 0) rotate(200deg); }
        90%  { opacity: 0.8; }
        100% { transform: translate3d(calc(var(--sway) * -0.5), 112vh, 0) rotate(380deg); opacity: 0; }
      }
      @keyframes tl-grain {
        0%   { transform: translate(0, 0); }
        20%  { transform: translate(-6%, 4%); }
        40%  { transform: translate(5%, -7%); }
        60%  { transform: translate(-4%, -3%); }
        80%  { transform: translate(7%, 6%); }
        100% { transform: translate(0, 0); }
      }
      @keyframes tl-letterbox {
        from { transform: scaleY(0); }
        to   { transform: scaleY(1); }
      }

      @media (prefers-reduced-motion: reduce) {
        .tl-root *, .tl-root *::before, .tl-root *::after {
          animation-duration: 8s !important;
        }
      }
    `}</style>
  );
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

const MIN_MS = 600; // minimum time so loader is visible
const MAX_MS = 4000; // hard timeout so it never hangs

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
    const start = Date.now();

    async function waitReady() {
      // 1) fonts
      try {
        if (typeof document !== "undefined" && document.fonts?.ready) {
          await Promise.race([
            document.fonts.ready,
            new Promise((r) => setTimeout(r, 2500)),
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
      const elapsed = Date.now() - start;
      if (elapsed < MIN_MS) {
        await new Promise((r) => setTimeout(r, MIN_MS - elapsed));
      }

      if (cancelled) return;
      setFadeOut(true);
      // allow fade animation then unmount loader
      setTimeout(() => {
        if (!cancelled) setReady(true);
      }, 350);
    }

    const hard = setTimeout(() => {
      if (!cancelled) {
        setFadeOut(true);
        setTimeout(() => setReady(true), 350);
      }
    }, MAX_MS);

    waitReady();
    return () => {
      cancelled = true;
      clearTimeout(hard);
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
            transition: "opacity 0.35s ease",
            pointerEvents: fadeOut ? "none" : "auto",
          }}
        >
          <ThemeLoader themeId={themeId} />
        </div>
      )}
    </>
  );
}
