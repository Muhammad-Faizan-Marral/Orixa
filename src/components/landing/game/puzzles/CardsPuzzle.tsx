"use client";
import { useState } from "react";
import type { PuzzleBodyProps } from "./types";

// Exactly one claim is true only when the token is under B.
const CARDS = [
  { id: "a", text: "The token is under card A." },
  { id: "b", text: "The token is not under card B." },
  { id: "c", text: "The token is not under card A." },
];

export default function CardsPuzzle({ attempt, busy }: PuzzleBodyProps) {
  const [wrong, setWrong] = useState<string[]>([]);
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {CARDS.map((c) => {
        const out = wrong.includes(c.id);
        return (
          <button key={c.id} type="button" disabled={busy || out}
            onClick={async () => { if ((await attempt(c.id)) === "wrong") setWrong((w) => [...w, c.id]); }}
            className={`flex min-h-32 flex-col justify-between rounded-xl border p-4 text-left transition ${
              out ? "border-[var(--line)] bg-transparent opacity-50" : "border-[var(--line)] bg-[var(--panel-2)] hover:border-[var(--amber)]"}`}>
            <span className="mono text-sm font-bold text-[var(--amber)]">Card {c.id.toUpperCase()}</span>
            <span className="text-sm">&ldquo;{c.text}&rdquo;</span>
            {out && <span className="mono text-xs text-[var(--life)]">✕ empty</span>}
          </button>
        );
      })}
    </div>
  );
}
