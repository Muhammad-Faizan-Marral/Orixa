"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { ThemeId } from "../types";

/* ═══════════════════════════════════════════════════════════
   Per-theme full-page loaders (assets / fonts ready hone tak)
   ═══════════════════════════════════════════════════════════ */

type LoaderProps = { themeName?: string };

/** minimal-airy — soft light, airy */
export function MinimalAiryLoader({ themeName = "Minimal Airy" }: LoaderProps) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: "#f8fafc", color: "#172033" }}
      aria-busy="true"
      aria-label="Loading portfolio"
    >
      <div className="relative mb-8 h-16 w-16">
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{
            borderTopColor: "#2563eb",
            borderRightColor: "rgba(37,99,235,0.3)",
            animation: "theme-spin 1s linear infinite",
          }}
        />
        <div
          className="absolute inset-2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)",
            animation: "theme-pulse 2s ease-in-out infinite",
          }}
        />
      </div>
      <p
        className="text-sm font-medium tracking-wide"
        style={{ fontFamily: "Inter, sans-serif", color: "#64748b" }}
      >
        {themeName}
      </p>
      <p className="mt-2 text-xs" style={{ color: "#94a3b8" }}>
        Preparing your experience…
      </p>
      <ThemeLoaderStyles />
    </div>
  );
}

/** tech-dense — terminal / cyan scan */
export function TechDenseLoader({ themeName = "Tech Dense" }: LoaderProps) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "#07111c",
        color: "#e6f7ff",
        fontFamily: "JetBrains Mono, monospace",
      }}
      aria-busy="true"
      aria-label="Loading portfolio"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34,211,238,0.06) 2px, rgba(34,211,238,0.06) 4px)",
          animation: "theme-scan 4s linear infinite",
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-8 w-1.5 rounded-sm"
              style={{
                background: "#22d3ee",
                animation: `theme-bar 1.2s ease-in-out ${i * 0.12}s infinite`,
              }}
            />
          ))}
        </div>
        <p className="text-xs tracking-[0.3em] uppercase" style={{ color: "#22d3ee" }}>
          {themeName}
        </p>
        <p className="font-mono text-[10px]" style={{ color: "#7f9bad" }}>
          loading modules…
        </p>
      </div>
      <ThemeLoaderStyles />
    </div>
  );
}

/** neo-glass — glassmorphism */
export function NeoGlassLoader({ themeName = "Neo Glass" }: LoaderProps) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse at 30% 20%, rgba(34,211,238,0.15), transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(108,92,255,0.12), transparent 50%), #0a0e17",
        color: "#e8f4ff",
      }}
      aria-busy="true"
      aria-label="Loading portfolio"
    >
      <div
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/20 backdrop-blur-xl"
        style={{
          background: "rgba(255,255,255,0.06)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
          animation: "theme-float 2.5s ease-in-out infinite",
        }}
      >
        <div
          className="h-8 w-8 rounded-full border-2 border-transparent"
          style={{
            borderTopColor: "#22d3ee",
            borderRightColor: "#6c5cff",
            animation: "theme-spin 0.9s linear infinite",
          }}
        />
      </div>
      <p className="text-sm font-medium tracking-wide opacity-90">{themeName}</p>
      <p className="mt-1 text-xs opacity-50">Loading…</p>
      <ThemeLoaderStyles />
    </div>
  );
}

/** soft-luxury — elegant soft */
export function SoftLuxuryLoader({ themeName = "Soft Luxury" }: LoaderProps) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(160deg, #1a1520 0%, #0f0d12 50%, #1a1520 100%)",
        color: "#f5e6d3",
      }}
      aria-busy="true"
      aria-label="Loading portfolio"
    >
      <div className="relative mb-8">
        <div
          className="h-14 w-14 rounded-full"
          style={{
            border: "1px solid rgba(212,175,140,0.4)",
            animation: "theme-spin 3s linear infinite",
          }}
        />
        <div
          className="absolute inset-2 rounded-full"
          style={{
            border: "1px solid rgba(212,175,140,0.2)",
            animation: "theme-spin 2s linear infinite reverse",
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "#d4af8c", animation: "theme-pulse 1.5s ease-in-out infinite" }}
        />
      </div>
      <p
        className="text-sm tracking-[0.2em] uppercase"
        style={{ fontFamily: "Georgia, serif", color: "#d4af8c" }}
      >
        {themeName}
      </p>
      <p className="mt-2 text-xs opacity-40">Curating experience</p>
      <ThemeLoaderStyles />
    </div>
  );
}

/** editorial — magazine style */
export function EditorialLoader({ themeName = "Editorial" }: LoaderProps) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: "#111113", color: "#f4f0ea" }}
      aria-busy="true"
      aria-label="Loading portfolio"
    >
      <div className="mb-6 flex items-end gap-1.5">
        {[40, 70, 50, 90, 60, 45].map((h, i) => (
          <div
            key={i}
            className="w-2 rounded-sm"
            style={{
              height: h * 0.4,
              background: i % 2 === 0 ? "#f4f0ea" : "rgba(244,240,234,0.35)",
              animation: `theme-bar 1.4s ease-in-out ${i * 0.1}s infinite`,
            }}
          />
        ))}
      </div>
      <p
        className="text-lg font-bold tracking-tight"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        {themeName}
      </p>
      <p className="mt-2 text-[10px] uppercase tracking-[0.25em] opacity-40">
        Setting the page…
      </p>
      <ThemeLoaderStyles />
    </div>
  );
}

/** brutalist — bold harsh */
export function BrutalistLoader({ themeName = "Brutalist" }: LoaderProps) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: "#05081c", color: "#f7f3ea" }}
      aria-busy="true"
      aria-label="Loading portfolio"
    >
      <div
        className="mb-6 flex h-16 w-16 items-center justify-center border-4"
        style={{
          borderColor: "#67e8f9",
          animation: "theme-glitch 1.2s steps(2) infinite",
        }}
      >
        <span
          className="text-2xl font-black"
          style={{ color: "#67e8f9", fontFamily: "Impact, sans-serif" }}
        >
          ▣
        </span>
      </div>
      <p className="text-sm font-black uppercase tracking-[0.15em]">{themeName}</p>
      <p className="mt-2 font-mono text-[10px] opacity-50">SYSTEM BOOT…</p>
      <ThemeLoaderStyles />
    </div>
  );
}

/** cinematic — film / cherry blossom */
export function CinematicLoader({ themeName = "Cinematic" }: LoaderProps) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#07060b", color: "#f3ece4" }}
      aria-busy="true"
      aria-label="Loading portfolio"
    >
      {/* film grain-ish */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          animation: "theme-pulse 3s ease-in-out infinite",
        }}
      />
      {/* letterbox bars */}
      <div className="absolute inset-x-0 top-0 h-10 bg-black/80" />
      <div className="absolute inset-x-0 bottom-0 h-10 bg-black/80" />

      <div className="relative z-10 flex flex-col items-center">
        <div
          className="mb-6 h-1 w-24 rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent, #f2a6c4, transparent)",
            animation: "theme-shimmer 1.8s ease-in-out infinite",
          }}
        />
        <p
          className="text-xl tracking-wide"
          style={{ fontFamily: "Georgia, 'Cormorant Garamond', serif", color: "#f2a6c4" }}
        >
          {themeName}
        </p>
        <p className="mt-3 text-[10px] uppercase tracking-[0.3em] opacity-40">
          Developing frame…
        </p>
      </div>
      <ThemeLoaderStyles />
    </div>
  );
}

function ThemeLoaderStyles() {
  return (
    <style>{`
      @keyframes theme-spin {
        to { transform: rotate(360deg); }
      }
      @keyframes theme-pulse {
        0%, 100% { opacity: 0.5; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.05); }
      }
      @keyframes theme-bar {
        0%, 100% { transform: scaleY(0.4); opacity: 0.4; }
        50% { transform: scaleY(1); opacity: 1; }
      }
      @keyframes theme-scan {
        0% { transform: translateY(0); }
        100% { transform: translateY(8px); }
      }
      @keyframes theme-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
      @keyframes theme-glitch {
        0%, 100% { transform: translate(0); }
        25% { transform: translate(-2px, 1px); }
        50% { transform: translate(2px, -1px); }
        75% { transform: translate(-1px, -1px); }
      }
      @keyframes theme-shimmer {
        0%, 100% { opacity: 0.3; width: 4rem; }
        50% { opacity: 1; width: 8rem; }
      }
    `}</style>
  );
}

/* ── Map themeId → loader ───────────────────────────────── */

const LOADERS: Record<
  ThemeId,
  (props: LoaderProps) => React.ReactElement
> = {
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