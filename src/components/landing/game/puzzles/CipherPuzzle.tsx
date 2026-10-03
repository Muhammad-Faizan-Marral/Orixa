"use client";
import { useState } from "react";
import { useGameStore } from "@/lib/game/store";
import type { PuzzleBodyProps } from "./types";

export default function CipherPuzzle({ attempt, busy }: PuzzleBodyProps) {
  const digits = useGameStore((s) => s.digits);
  const [dial, setDial] = useState(0);
  const btn = "mono h-11 w-16 rounded-lg border border-[var(--line)] bg-[var(--panel-2)] text-lg hover:border-[var(--amber)] disabled:opacity-40";
  return (
    <div className="space-y-5 text-center">
      <div className="mono flex items-center justify-center gap-6 text-sm">
        <div><div className="text-[var(--mute)]">first digit</div><div className="text-3xl font-bold text-[var(--amber)]">{digits[0] ?? "?"}</div></div>
        <div><div className="text-[var(--mute)]">third digit</div><div className="text-3xl font-bold text-[var(--amber)]">{digits[2] ?? "?"}</div></div>
      </div>
      <div className="flex flex-col items-center gap-2" role="group" aria-label="Combination dial">
        <button type="button" className={btn} disabled={busy} aria-label="Dial up" onClick={() => setDial((d) => (d + 1) % 10)}>▲</button>
        <output aria-live="polite" className="mono flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-[var(--amber)] text-5xl font-bold">{dial}</output>
        <button type="button" className={btn} disabled={busy} aria-label="Dial down" onClick={() => setDial((d) => (d + 9) % 10)}>▼</button>
      </div>
      <button type="button" className="btn btn-primary w-full" disabled={busy} onClick={() => attempt(String(dial))}>Turn the key to {dial}</button>
    </div>
  );
}
