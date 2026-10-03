"use client";
import { useState } from "react";
import { allDigitsFound, useGameStore, useHydrated } from "@/lib/game/store";
import DigitRail from "./DigitRail";
import LifeMeter from "./LifeMeter";

/** Floating progress panel. Appears only after the first discovery; collapsible so it never covers a CTA. */
export default function GameHud() {
  const hydrated = useHydrated();
  const { started, lives, digits, status } = useGameStore();
  const [collapsed, setCollapsed] = useState(false);
  if (!hydrated || !started) return null;
  const done = allDigitsFound(digits);
  const found = digits.filter(Boolean).length;

  return (
    <aside aria-label="Secret code progress"
      className="fixed bottom-3 left-3 z-40 flex max-w-[calc(100vw-1.5rem)] flex-col gap-2 rounded-xl border border-border-strong bg-background/90 p-2.5 shadow-xl backdrop-blur sm:bottom-4 sm:left-4 sm:p-3">
      <div className="flex items-center justify-between gap-4">
        <LifeMeter lives={lives} />
        {collapsed && <span className="font-mono text-xs text-accent">{found}/5</span>}
        {status === "over" && <span className="font-mono text-xs text-error">game over</span>}
        <button type="button" onClick={() => setCollapsed(!collapsed)} aria-expanded={!collapsed}
          aria-label={collapsed ? "Show code progress" : "Hide code progress"}
          className="font-mono -mr-1 flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground">
          <span aria-hidden="true">{collapsed ? "▴" : "▾"}</span>
        </button>
      </div>
      {!collapsed && <DigitRail digits={digits} size="sm" />}
      {!collapsed && done && (
        <a href="#pricing" className="font-mono text-xs text-accent underline underline-offset-4">Code complete. Enter it in Pricing</a>
      )}
    </aside>
  );
}
