"use client";

import { useEffect } from "react";

type Props = {
  portfolioId: string;
};

export function PortfolioViewTracker({ portfolioId }: Props) {
  useEffect(() => {
    if (!portfolioId) return;

    const payload = JSON.stringify({ portfolioId });

    // Best: sendBeacon (non-blocking, works even on page unload)
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/view", blob);
      return;
    }

    // Fallback
    fetch("/api/analytics/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {
      // silent
    });
  }, [portfolioId]);

  return null;
}
