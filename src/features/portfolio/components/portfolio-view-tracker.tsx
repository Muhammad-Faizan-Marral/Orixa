"use client";

import { useEffect } from "react";

type Props = {
  portfolioId: string;
};

function parseClientUa(ua: string) {
  const browser = /edg\//i.test(ua)
    ? "Edge"
    : /opr\/|opera/i.test(ua)
      ? "Opera"
      : /firefox|fxios/i.test(ua)
        ? "Firefox"
        : /crios|chrome\//i.test(ua) && !/chromium/i.test(ua)
          ? "Chrome"
          : /safari/i.test(ua) && !/chrome|crios|chromium/i.test(ua)
            ? "Safari"
            : "Other";

  const device = /ipad|tablet/i.test(ua) || (/android/i.test(ua) && !/mobile/i.test(ua))
    ? "Tablet"
    : /iphone|ipod|android.*mobile|mobile|windows phone/i.test(ua)
      ? "Mobile"
      : "Desktop";

  const os = /windows/i.test(ua)
    ? "Windows"
    : /android/i.test(ua)
      ? "Android"
      : /iphone|ipad|ipod/i.test(ua)
        ? "iOS"
        : /mac os x|macintosh/i.test(ua)
          ? "macOS"
          : /linux/i.test(ua)
            ? "Linux"
            : "Other";

  return { browser, device, os };
}

export function PortfolioViewTracker({ portfolioId }: Props) {
  useEffect(() => {
    if (!portfolioId || typeof window === "undefined") return;

    const ua = navigator.userAgent || "";
    const parsed = parseClientUa(ua);

    const payload = JSON.stringify({
      portfolioId,
      userAgent: ua,
      browser: parsed.browser,
      device: parsed.device,
      os: parsed.os,
    });

    const url = "/api/analytics/view";

    const send = () =>
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});

    // Slight delay so first paint isn't blocked
    const t = window.setTimeout(send, 50);

    return () => window.clearTimeout(t);
  }, [portfolioId]);

  return null;
}