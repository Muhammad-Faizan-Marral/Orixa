"use client";

import { useEffect } from "react";

/**
 * Captures ?ref= from any page into localStorage.
 * Survives OAuth redirects better than cookie alone.
 */
export function ReferralCapture() {
  useEffect(() => {
    try {
      const ref = new URLSearchParams(window.location.search).get("ref");
      if (ref && ref.trim().length >= 3 && ref.trim().length <= 64) {
        window.localStorage.setItem("orixa_ref", ref.toLowerCase().trim());
      }
    } catch {
      // ignore
    }
  }, []);

  return null;
}