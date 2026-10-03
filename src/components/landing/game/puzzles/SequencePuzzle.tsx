"use client";
import { useState } from "react";
import type { PuzzleBodyProps } from "./types";

const SEQ = ["0", "1", "1", "2", "?", "5", "8"];

export default function SequencePuzzle({ attempt, busy }: PuzzleBodyProps) {
  const [pick, setPick] = useState<string | null>(null);
  const [tried, setTried] = useState<string[]>([]);
  return (
    <div className="space-y-5">
      <ol className="mono flex flex-wrap items-center justify-center gap-2" aria-label="Sequence: 0, 1, 1, 2, missing, 5, 8">
        {SEQ.map((n, i) => (
          <li key={i} className={`flex h-12 w-11 items-center justify-center rounded-lg border text-xl font-bold ${
            n === "?" ? "border-[var(--amber)] text-[var(--amber)]" : "border-[var(--line)]"}`}>
            {n === "?" ? (pick ?? "?") : n}
          </li>
        ))}
      </ol>
      <div role="group" aria-label="Choose the missing number" className="grid grid-cols-5 gap-2">
        {Array.from({ length: 10 }, (_, i) => String(i)).map((d) => (
          <button key={d} type="button" disabled={busy || tried.includes(d)} aria-pressed={pick === d}
            onClick={() => setPick(d)}
            className={`mono h-12 rounded-lg border text-lg font-bold transition ${
              pick === d ? "border-[var(--amber)] bg-[rgba(255,181,71,.15)]" : "border-[var(--line)] hover:border-[var(--violet)]"
            } ${tried.includes(d) ? "line-through opacity-40" : ""}`}>{d}</button>
        ))}
      </div>
      <button type="button" className="btn btn-primary w-full" disabled={busy || !pick}
        onClick={async () => {
          if (!pick) return;
          const r = await attempt(pick);
          if (r === "wrong") { setTried((t) => [...t, pick]); setPick(null); }
        }}>Lock in {pick ?? ""}</button>
    </div>
  );
}
