"use client";
import { useState } from "react";
import { useGameStore } from "@/lib/game/store";
import type { PuzzleBodyProps } from "./types";

const OPS: { label: string; value: string; aria: string }[] = [
  { label: "+", value: "+", aria: "plus" }, { label: "−", value: "-", aria: "minus" },
  { label: "×", value: "*", aria: "times" }, { label: "÷", value: "/", aria: "divided by" },
  { label: "(", value: "(", aria: "open bracket" }, { label: ")", value: ")", aria: "close bracket" },
];

type Token = { v: string; tile?: number };

export default function AlchemyPuzzle({ attempt, busy }: PuzzleBodyProps) {
  const digits = useGameStore((s) => s.digits).slice(0, 4);
  const [tokens, setTokens] = useState<Token[]>([]);
  const used = new Set(tokens.filter((t) => t.tile !== undefined).map((t) => t.tile));
  const expr = tokens.map((t) => t.v).join("");
  const show = tokens.map((t) => (t.v === "*" ? "×" : t.v === "/" ? "÷" : t.v === "-" ? "−" : t.v)).join(" ");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-center gap-3" role="group" aria-label="Your collected digits">
        {digits.map((d, i) => (
          <button key={i} type="button" disabled={busy || used.has(i) || !d} aria-label={`Digit ${d}`}
            onClick={() => d && setTokens((t) => [...t, { v: d, tile: i }])}
            className={`pad-tile h-16 w-14 rounded-xl border font-mono text-3xl font-bold ${used.has(i) ? "border-border opacity-30" : "border-gradient-ion shadow-glow-primary"}`}>
            <span className={used.has(i) ? "" : "text-gradient-ion"}>{d ?? "?"}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-6 gap-2" role="group" aria-label="Operators">
        {OPS.map((o) => (
          <button key={o.value} type="button" disabled={busy} aria-label={o.aria} onClick={() => setTokens((t) => [...t, { v: o.value }])}
            className="pad-tile h-12 rounded-lg border border-border-strong bg-surface-2 font-mono text-xl hover:border-primary">{o.label}</button>
        ))}
      </div>

      <output aria-live="polite" className="flex min-h-14 items-center justify-center rounded-xl border border-dashed border-border-strong bg-surface p-3 font-mono text-2xl tracking-widest">
        {show || <span className="text-subtle-foreground">build an expression</span>}
      </output>

      <div className="grid grid-cols-3 gap-3">
        <button type="button" className="btn btn-ghost" disabled={busy || !tokens.length} onClick={() => setTokens((t) => t.slice(0, -1))} aria-label="Undo last">⌫</button>
        <button type="button" className="btn btn-ghost" disabled={busy || !tokens.length} onClick={() => setTokens([])}>Clear</button>
        <button type="button" className="btn btn-ion" disabled={busy || tokens.length < 3}
          onClick={async () => { const r = await attempt(expr); if (r === "wrong") setTokens([]); }}>Forge</button>
      </div>
      <p className="text-center text-xs text-subtle-foreground">The result stays sealed until you forge it.</p>
    </div>
  );
}
