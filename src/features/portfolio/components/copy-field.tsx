"use client";

import { useEffect, useRef, useState } from "react";

type CopyFieldProps = {
  label: string;
  value: string;
  className?: string;
};

export function CopyField({ label, value, className = "" }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className={`space-y-1.5 ${className}`}>
      <p className="text-small text-muted-foreground">{label}</p>

      <div className="flex items-center gap-2 rounded-xl border border-border bg-foreground/[0.03] py-1.5 pl-4 pr-1.5">
        <code
          className="min-w-0 flex-1 truncate font-mono text-sm text-foreground"
          title={value}
        >
          {value}
        </code>

        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy ${label}`}
          className="shrink-0 rounded-lg bg-foreground px-3 py-1.5 text-small font-medium text-background transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
    </div>
  );
}
