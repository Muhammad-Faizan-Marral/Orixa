"use client";

import { useState } from "react";

export function CopyUrlButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard API unavailable — silently ignore
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="surface-panel flex w-full items-center justify-between gap-2 px-3 py-2 text-left"
    >
      <span className="text-small truncate text-foreground">{url}</span>
      <span className="text-caption shrink-0 text-primary">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
