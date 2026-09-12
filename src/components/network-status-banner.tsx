"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

type ConnectionQuality = "online" | "offline" | "slow";

function getInitialStatus(): { status: ConnectionQuality; visible: boolean } {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return { status: "online", visible: false };
  }

  if (!navigator.onLine) {
    return { status: "offline", visible: true };
  }

  const conn = (
    navigator as Navigator & {
      connection?: {
        effectiveType?: string;
        downlink?: number;
      };
    }
  ).connection;

  if (conn) {
    const effective = conn.effectiveType ?? "";
    const downlink = conn.downlink ?? 10;
    const isSlow =
      effective === "slow-2g" ||
      effective === "2g" ||
      (effective === "3g" && downlink < 0.5) ||
      downlink < 0.4;

    if (isSlow) {
      return { status: "slow", visible: true };
    }
  }

  return { status: "online", visible: false };
}

/**
 * Grok-style connection status banner.
 * Shows when offline or when the connection is noticeably slow.
 * Same behaviour: auto-hide when healthy, dismissible, non-blocking.
 */
export function NetworkStatusBanner() {
  const [networkState, setNetworkState] = useState(() => getInitialStatus());
  const [dismissed, setDismissed] = useState(false);

  const { status, visible } = networkState;

  const evaluate = useCallback(() => {
    if (typeof navigator === "undefined") return;

    if (!navigator.onLine) {
      setNetworkState({ status: "offline", visible: true });
      setDismissed(false);
      return;
    }

    // Network Information API (Chrome / Edge / Android)
    const conn = (
      navigator as Navigator & {
        connection?: {
          effectiveType?: string;
          downlink?: number;
        };
      }
    ).connection;

    if (conn) {
      const effective = conn.effectiveType ?? "";
      const downlink = conn.downlink ?? 10;
      const isSlow =
        effective === "slow-2g" ||
        effective === "2g" ||
        (effective === "3g" && downlink < 0.5) ||
        downlink < 0.4;

      if (isSlow) {
        setNetworkState({ status: "slow", visible: true });
        setDismissed(false);
        return;
      }
    }

    setNetworkState({ status: "online", visible: false });
  }, []);

  useEffect(() => {
    const onOnline = () => evaluate();
    const onOffline = () => evaluate();

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    const conn = (
      navigator as Navigator & {
        connection?: {
          addEventListener?: (type: string, listener: () => void) => void;
          removeEventListener?: (type: string, listener: () => void) => void;
        };
      }
    ).connection;

    if (conn?.addEventListener) {
      conn.addEventListener("change", evaluate);
    }

    // Periodic soft check (in case API is missing)
    const interval = window.setInterval(evaluate, 15_000);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      if (conn?.removeEventListener) {
        conn.removeEventListener("change", evaluate);
      }
      window.clearInterval(interval);
    };
  }, [evaluate]);

  if (!visible || dismissed || status === "online") return null;

  const isOffline = status === "offline";

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed inset-x-0 top-0 z-[100] flex items-center justify-center gap-3 px-4 py-2.5 text-sm font-medium shadow-lg transition-transform duration-300",
        isOffline
          ? "bg-amber-500/95 text-amber-950 dark:bg-amber-600/95 dark:text-amber-50"
          : "bg-sky-500/95 text-sky-950 dark:bg-sky-600/95 dark:text-sky-50",
      )}
    >
      <span className="flex items-center gap-2">
        <span
          className={cn(
            "inline-block h-2 w-2 shrink-0 rounded-full",
            isOffline
              ? "bg-amber-950 animate-pulse"
              : "bg-sky-950 animate-pulse",
          )}
        />
        {isOffline
          ? "You are offline. Changes may not save until you reconnect."
          : "Slow connection detected. Some actions may take longer."}
      </span>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="ml-2 rounded px-2 py-0.5 text-xs font-semibold opacity-80 hover:bg-black/10 hover:opacity-100"
        aria-label="Dismiss"
      >
        Dismiss
      </button>
    </div>
  );
}
