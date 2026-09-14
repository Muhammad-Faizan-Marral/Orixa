"use client";

import { useEffect } from "react";

type Props = {
  portfolioId: string;
};

export function PortfolioViewTracker({ portfolioId }: Props) {
  useEffect(() => {
    if (!portfolioId) return;

    // Client hints help when UA is reduced (Chrome privacy)
    const payload = JSON.stringify({
      portfolioId,
      // Optional hints — server still trusts UA first
      language:
        typeof navigator !== "undefined" ? navigator.language : undefined,
      timezone:
        typeof Intl !== "undefined"
          ? Intl.DateTimeFormat().resolvedOptions().timeZone
          : undefined,
    });

    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/view", blob);
      return;
    }

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