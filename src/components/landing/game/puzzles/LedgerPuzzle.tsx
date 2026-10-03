"use client";
import { useState } from "react";
import type { PuzzleBodyProps } from "./types";

const STEPS = [
  { t: "Add your work", done: true },
  { t: "Choose design", done: false },
  { t: "Publish & share", done: false },
];

export default function LedgerPuzzle({ attempt, busy }: PuzzleBodyProps) {
  const [wrong, setWrong] = useState<string[]>([]);
  return (
    <div className="space-y-5">
      <div className="mono rounded-xl border border-[var(--line)] bg-[#0b0d1d] p-4 text-sm leading-7">
        <p className="text-[var(--mute)]">portfolio build status</p>
        {STEPS.map((s) => (
          <p key={s.t}><span className={s.done ? "text-[var(--ok)]" : "text-[var(--mute)]"}>{s.done ? "[x]" : "[ ]"}</span> {s.t}{s.done ? " (done)" : ""}</p>
        ))}
      </div>
      <p className="text-sm">The workflow above has every step it needs. How many steps are still left before this portfolio is live?</p>
      <div className="grid grid-cols-4 gap-2">
        {["0", "1", "2", "3"].map((n) => (
          <button key={n} type="button" disabled={busy || wrong.includes(n)}
            onClick={async () => { if ((await attempt(n)) === "wrong") setWrong((w) => [...w, n]); }}
            className={`mono h-14 rounded-xl border text-xl font-bold transition ${
              wrong.includes(n) ? "border-[var(--line)] line-through opacity-40" : "border-[var(--line)] bg-[var(--panel-2)] hover:border-[var(--amber)]"}`}>{n}</button>
        ))}
      </div>
    </div>
  );
}
