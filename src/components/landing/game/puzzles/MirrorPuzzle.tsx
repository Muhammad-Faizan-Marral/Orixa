"use client";
import { useState } from "react";
import type { PuzzleBodyProps } from "./types";

// Five tiles are the glyph rotated; one (t3) is mirrored. A mirrored F can never be rotated back.
const TILES = [
  { id: "t0", rot: 0, flip: false }, { id: "t1", rot: 90, flip: false }, { id: "t2", rot: 200, flip: false },
  { id: "t3", rot: 300, flip: true }, { id: "t4", rot: 45, flip: false }, { id: "t5", rot: 150, flip: false },
];

export default function MirrorPuzzle({ attempt, busy }: PuzzleBodyProps) {
  const [wrong, setWrong] = useState<string[]>([]);
  return (
    <div className="grid grid-cols-3 gap-3">
      {TILES.map((t, i) => (
        <button key={t.id} type="button" disabled={busy || wrong.includes(t.id)}
          aria-label={`Tile ${i + 1} of 6`}
          onClick={async () => { if ((await attempt(t.id)) === "wrong") setWrong((w) => [...w, t.id]); }}
          className={`flex aspect-square items-center justify-center rounded-xl border transition ${
            wrong.includes(t.id) ? "border-[var(--line)] opacity-40" : "border-[var(--line)] bg-[var(--panel-2)] hover:border-[var(--amber)]"}`}>
          <svg viewBox="0 0 28 32" className="h-14 w-14 sm:h-16 sm:w-16" aria-hidden="true"
            style={{ transform: `rotate(${t.rot}deg) scaleX(${t.flip ? -1 : 1})` }}>
            <path d="M6 3H23V9H12V13H20V19H12V29H6Z" fill="var(--bone)" />
          </svg>
          {wrong.includes(t.id) && <span className="mono absolute text-xl text-[var(--life)]" aria-hidden="true">✕</span>}
        </button>
      ))}
    </div>
  );
}
