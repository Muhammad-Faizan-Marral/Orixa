"use client";
import { useState } from "react";
import { LIGHTS_START } from "@/lib/game/config";
import type { PuzzleBodyProps } from "./types";

function press(board: number[], i: number) {
  const next = [...board];
  const r = Math.floor(i / 3), c = i % 3;
  for (const [dr, dc] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const rr = r + dr, cc = c + dc;
    if (rr >= 0 && rr < 3 && cc >= 0 && cc < 3) next[rr * 3 + cc] ^= 1;
  }
  return next;
}

export default function LightsPuzzle({ attempt, busy }: PuzzleBodyProps) {
  const [board, setBoard] = useState<number[]>([...LIGHTS_START]);
  const [presses, setPresses] = useState<number[]>([]);
  const lit = board.filter(Boolean).length;

  return (
    <div className="space-y-5">
      <div className="mx-auto grid w-fit grid-cols-3 gap-2 rounded-2xl border border-border-strong bg-surface p-3" role="group" aria-label="Cartridge contacts, 3 by 3">
        {board.map((on, i) => (
          <button key={i} type="button" disabled={busy} aria-pressed={on === 1}
            aria-label={`Contact row ${Math.floor(i / 3) + 1}, column ${(i % 3) + 1}: ${on ? "lit" : "dark"}`}
            onClick={() => { setBoard((b) => press(b, i)); setPresses((p) => [...p, i]); }}
            className={`pad-tile h-[4.5rem] w-[4.5rem] rounded-xl border sm:h-20 sm:w-20 ${
              on ? "border-accent bg-accent/80 shadow-[0_0_28px_-4px_var(--accent)]" : "border-border-strong bg-surface-2 hover:border-primary"}`}>
            <span className="font-mono text-xs text-accent-foreground" aria-hidden="true">{on ? "ON" : ""}</span>
          </button>
        ))}
      </div>
      <p className="text-center font-mono text-xs text-muted-foreground" aria-live="polite">{lit} lit · {presses.length} presses</p>
      <div className="grid grid-cols-2 gap-3">
        <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => { setBoard([...LIGHTS_START]); setPresses([]); }}>Reset board</button>
        <button type="button" className="btn btn-ion" disabled={busy}
          onClick={async () => { const r = await attempt(presses.length ? presses.join(",") : "-1"); if (r === "wrong") { setBoard([...LIGHTS_START]); setPresses([]); } }}>
          Ignite
        </button>
      </div>
    </div>
  );
}
