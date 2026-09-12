"use client";

import { useEffect, useRef, useState, useCallback, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

type ConnectionQuality = "online" | "offline" | "slow";

// ─── Tunables ────────────────────────────────────────────────────────────────
const PING_TIMEOUT_MS = 4_000;
const SLOW_RTT_MS     = 1_800;
const CHECK_INTERVAL_MS = 5_000;
// ─────────────────────────────────────────────────────────────────────────────

type NavWithConn = Navigator & {
  connection?: {
    effectiveType?: string;
    downlink?: number;
    addEventListener?: (type: string, fn: () => void) => void;
    removeEventListener?: (type: string, fn: () => void) => void;
  };
};

/** Actual RTT probe against the app's own origin — CORS-safe, no extra infra. */
async function pingCheck(): Promise<ConnectionQuality> {
  if (typeof window === "undefined") return "online";
  if (!navigator.onLine) return "offline";

  try {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), PING_TIMEOUT_MS);
    const t0 = performance.now();

    await fetch(`${window.location.origin}/favicon.ico?_=${Date.now()}`, {
      method: "HEAD",
      cache: "no-store",
      signal: controller.signal,
    });

    window.clearTimeout(timer);
    const rtt = performance.now() - t0;
    return rtt > SLOW_RTT_MS ? "slow" : "online";
  } catch {
    return navigator.onLine ? "slow" : "offline";
  }
}

/** Fast sync read of Network Information API. Returns null when unavailable. */
function readNetworkApi(): ConnectionQuality | null {
  if (typeof navigator === "undefined") return null;
  const conn = (navigator as NavWithConn).connection;
  if (!conn) return null;

  const { effectiveType = "", downlink = 10 } = conn;
  if (
    effectiveType === "slow-2g" ||
    effectiveType === "2g" ||
    (effectiveType === "3g" && downlink < 0.5) ||
    downlink < 0.4
  )
    return "slow";

  return "online";
}

// ─── Theme tokens ─────────────────────────────────────────────────────────────
const TOKEN = {
  offline: {
    accent: "#F59E0B",
    bg: "rgba(245,158,11,0.07)",
    border: "rgba(245,158,11,0.22)",
    shadow: "rgba(245,158,11,0.12)",
    text: "text-amber-900 dark:text-amber-50",
    btn: "hover:bg-amber-400/10 text-amber-700 dark:text-amber-200",
    dot: "bg-amber-400",
    ping: "bg-amber-300",
  },
  slow: {
    accent: "#38BDF8",
    bg: "rgba(56,189,248,0.07)",
    border: "rgba(56,189,248,0.22)",
    shadow: "rgba(56,189,248,0.12)",
    text: "text-sky-900 dark:text-sky-50",
    btn: "hover:bg-sky-400/10 text-sky-700 dark:text-sky-200",
    dot: "bg-sky-400",
    ping: "bg-sky-300",
  },
} as const;

// ─── Icons ────────────────────────────────────────────────────────────────────
function IconOffline({ style }: { style?: CSSProperties }) {
  return (
    <svg style={style} className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072M12 12h.01M3 3l18 18" />
    </svg>
  );
}

function IconSlow({ style }: { style?: CSSProperties }) {
  return (
    <svg style={style} className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconX({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

// ─── Sync initializer (runs before first render) ───────────────────────────────
type BannerState = { status: ConnectionQuality; visible: boolean };

function deriveInitialState(): BannerState {
  if (typeof navigator === "undefined") return { status: "online", visible: false };
  if (!navigator.onLine) return { status: "offline", visible: true };
  const apiQ = readNetworkApi();
  if (apiQ === "slow") return { status: "slow", visible: true };
  return { status: "online", visible: false };
}

// ─── Component ────────────────────────────────────────────────────────────────
export function NetworkStatusBanner() {
  const [{ status, visible }, setBanner] = useState<BannerState>(deriveInitialState);
  const [dismissed, setDismissed] = useState(false);

  // ── Transition-aware dismissal ─────────────────────────────────────────────
  // The bug: old code called setDismissed(false) on every 5-second poll while
  // slow, so users could never permanently dismiss the banner.
  //
  // Fix: track the *previous* status and only reset dismissed on real transitions.
  //
  //   *       → online  : reset dismissed (fresh slate — next event gets a banner)
  //   online  → offline : reset dismissed (critical — user must see this)
  //   offline → offline : keep dismissed  (already saw it, don't nag)
  //   *       → slow    : NEVER reset dismissed (non-critical, user opted out)
  const prevStatusRef = useRef<ConnectionQuality>(deriveInitialState().status);

  const evaluate = useCallback(async () => {
    if (typeof navigator === "undefined") return;

    const prev = prevStatusRef.current;

    // 1. Instant offline (sync, no network call needed)
    if (!navigator.onLine) {
      prevStatusRef.current = "offline";
      setBanner({ status: "offline", visible: true });
      if (prev !== "offline") setDismissed(false); // only on transition
      return;
    }

    // 2. Network Information API (sync fast-path)
    const apiQ = readNetworkApi();
    if (apiQ === "slow") {
      prevStatusRef.current = "slow";
      setBanner({ status: "slow", visible: true });
      // intentionally no setDismissed(false) here
      return;
    }

    // 3. Actual RTT probe (async, most accurate)
    const quality = await pingCheck();
    prevStatusRef.current = quality;

    if (quality === "online") {
      setBanner({ status: "online", visible: false });
      setDismissed(false); // clear so next offline/slow event gets fresh banner
    } else if (quality === "offline") {
      setBanner({ status: "offline", visible: true });
      if (prev !== "offline") setDismissed(false);
    } else {
      // slow detected via RTT — same no-reset rule
      setBanner({ status: "slow", visible: true });
    }
  }, []);

  useEffect(() => {
    // Deferred so effect body itself never calls setState synchronously.
    const initPing = window.setTimeout(evaluate, 0);

    window.addEventListener("online", evaluate);
    window.addEventListener("offline", evaluate);

    const conn = (navigator as NavWithConn).connection;
    conn?.addEventListener?.("change", evaluate);

    const interval = window.setInterval(evaluate, CHECK_INTERVAL_MS);

    return () => {
      window.clearTimeout(initPing);
      window.removeEventListener("online", evaluate);
      window.removeEventListener("offline", evaluate);
      conn?.removeEventListener?.("change", evaluate);
      window.clearInterval(interval);
    };
  }, [evaluate]);

  if (!visible || dismissed || status === "online") return null;

  const t = TOKEN[status];
  const isOffline = status === "offline";

  return (
    <>
      <style>{`
        @keyframes nsb-in {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
        .nsb { animation: nsb-in 0.38s cubic-bezier(0.22, 1, 0.36, 1) both; }
      `}</style>

      <div
        role="status"
        aria-live="polite"
        className={cn(
          "nsb",
          "fixed inset-x-0 top-0 z-[100]",
          "flex items-center justify-between gap-3",
          "px-5 py-3 text-sm font-medium",
          "backdrop-blur-xl",
          t.text,
        )}
        style={{
          background: t.bg,
          borderBottom: `1px solid ${t.border}`,
          boxShadow: `0 4px 32px ${t.shadow}`,
        }}
      >
        {/* Left accent bar */}
        <span
          className="absolute left-0 inset-y-0 w-[3px] rounded-r-full"
          style={{ background: t.accent }}
          aria-hidden
        />

        {/* Message */}
        <span className="flex items-center gap-3 ml-3">
          <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
            <span className={cn("animate-ping absolute inset-0 rounded-full opacity-50", t.ping)} />
            <span className={cn("relative rounded-full h-2 w-2", t.dot)} />
          </span>

          {isOffline
            ? <IconOffline style={{ color: t.accent }} />
            : <IconSlow    style={{ color: t.accent }} />
          }

          <span className="leading-snug">
            {isOffline
              ? "No internet connection — changes won't save until you reconnect"
              : "Slow connection detected — actions may take a moment"}
          </span>
        </span>

        {/* Dismiss */}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className={cn(
            "shrink-0 flex items-center gap-1.5",
            "rounded-lg px-3 py-1.5 text-xs font-semibold",
            "transition-colors duration-150",
            t.btn,
          )}
        >
          Dismiss
          <IconX className="w-3 h-3" />
        </button>
      </div>
    </>
  );
}