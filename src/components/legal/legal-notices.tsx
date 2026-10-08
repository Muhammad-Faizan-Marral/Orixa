"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

let legalAcknowledgedInMemory = false;
let cookieNoticeDismissedInMemory = false;

function subscribeToAcknowledgments(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("orixaai:consent-updated", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("orixaai:consent-updated", onChange);
  };
}

function isLegalNoticeVisible() {
  try {
    if (window.localStorage.getItem("orixaai_legal_ack_v1") === "1") {
      return false;
    }
  } catch {
    // Fall back to the optional cookie if local storage is unavailable.
  }

  return (
    !legalAcknowledgedInMemory &&
    !document.cookie.split("; ").includes("orixaai_legal_ack=1")
  );
}

function isCookieNoticeVisible() {
  if (cookieNoticeDismissedInMemory) return false;

  try {
    return window.localStorage.getItem("orixaai_cookie_ack_v1") !== "1";
  } catch {
    return true;
  }
}

export function DashboardLegalNotice() {
  const visible = useSyncExternalStore(
    subscribeToAcknowledgments,
    isLegalNoticeVisible,
    () => false,
  );

  function acknowledge() {
    legalAcknowledgedInMemory = true;
    try {
      window.localStorage.setItem("orixaai_legal_ack_v1", "1");
    } catch {
      // The optional cookie below still allows the acknowledgment to persist.
    }
    document.cookie = "orixaai_legal_ack=1; path=/; max-age=31536000; SameSite=Lax";
    window.dispatchEvent(new Event("orixaai:consent-updated"));
  }

  if (!visible) return null;

  return (
    <aside
      aria-label="Privacy and terms notice"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-4xl flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-xl sm:inset-x-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
    >
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-foreground">Privacy &amp; terms</h2>
        <p className="text-sm leading-5 text-muted-foreground">
          We use your data to build and host portfolios and show visitor
          analytics. Payments are processed by Polar.{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms
          </Link>
          {" · "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy
          </Link>
        </p>
      </div>
      <button
        type="button"
        onClick={acknowledge}
        className="shrink-0 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        I understand
      </button>
    </aside>
  );
}

export function CookieNotice() {
  const visible = useSyncExternalStore(
    subscribeToAcknowledgments,
    isCookieNoticeVisible,
    () => false,
  );

  function accept() {
    cookieNoticeDismissedInMemory = true;
    try {
      window.localStorage.setItem("orixaai_cookie_ack_v1", "1");
    } catch {
      // Keep the notice dismissed for this page view when storage is blocked.
    }
    window.dispatchEvent(new Event("orixaai:consent-updated"));
  }

  if (!visible) return null;

  return (
    <aside
      aria-label="Cookie and privacy notice"
      className="fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-4xl flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-xl sm:inset-x-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
    >
      <p className="text-sm leading-5 text-muted-foreground">
        OrixaAI uses essential storage for authentication, security and preferences. We don&apos;t use advertising cookies. Learn more in our 
        <Link href="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
      <div className="flex shrink-0 items-center gap-4">
        <button
          type="button"
          onClick={accept}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Accept
        </button>
        <Link href="/privacy" className="text-sm text-primary hover:underline">
          Privacy
        </Link>
      </div>
    </aside>
  );
}
