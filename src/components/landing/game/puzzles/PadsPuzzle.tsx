"use client";
import { useEffect, useState } from "react";
import { PAD_NAMES, PAD_SEQUENCE } from "@/lib/game/config";
import type { PuzzleBodyProps } from "./types";

const COLORS = ["bg-primary", "bg-accent", "bg-success", "bg-warning"];
const GLOW = ["shadow-[0_0_40px_0_var(--primary)]", "shadow-[0_0_40px_0_var(--accent)]", "shadow-[0_0_40px_0_var(--success)]", "shadow-[0_0_40px_0_var(--warning)]"];

export default function PadsPuzzle({ attempt, busy }: PuzzleBodyProps) {
  const [run, setRun] = useState(1);
  const [lit, setLit] = useState<number | null>(null);
  const [watching, setWatching] = useState(true);
  const [entry, setEntry] = useState<number[]>([]);
  const [asText, setAsText] = useState(false);

  // Plays the pattern; every state change happens inside a timer callback and is cleaned up on unmount/replay.
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    PAD_SEQUENCE.forEach((pad, i) => {
      timers.push(setTimeout(() => setLit(pad), 700 + i * 800));
      timers.push(setTimeout(() => setLit(null), 700 + i * 800 + 520));
    });
    timers.push(setTimeout(() => setWatching(false), 700 + PAD_SEQUENCE.length * 800));
    return () => timers.forEach(clearTimeout);
  }, [run]);

  const replay = () => { setEntry([]); setWatching(true); setRun((r) => r + 1); };

  async function hit(i: number) {
    if (watching || busy) return;
    const next = [...entry, i];
    setEntry(next);
    setLit(i);
    setTimeout(() => setLit((l) => (l === i ? null : l)), 160);
    if (next.length === PAD_SEQUENCE.length) {
      const r = await attempt(next.join(","));
      if (r !== "correct") replay();
    }
  }

  return (
    <div className="space-y-5">
      <div className="mx-auto grid w-fit grid-cols-2 gap-3" role="group" aria-label="Sync pads">
        {PAD_NAMES.map((name, i) => (
          <button key={name} type="button" disabled={watching || busy} onClick={() => hit(i)} aria-label={`${name} pad`}
            className={`pad-tile h-28 w-28 rounded-2xl border border-white/10 sm:h-32 sm:w-32 ${COLORS[i]} ${lit === i ? `opacity-100 ${GLOW[i]} brightness-125` : "opacity-35"} ${watching ? "cursor-wait" : ""}`} />
        ))}
      </div>
      <p className="text-center font-mono text-xs text-muted-foreground" aria-live="polite">
        {watching ? "Watch…" : `Your turn · ${entry.length}/${PAD_SEQUENCE.length}`}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <button type="button" className="btn btn-ghost" disabled={watching || busy} onClick={replay}>Replay (free)</button>
        <button type="button" className="btn btn-ghost" aria-pressed={asText} onClick={() => setAsText((v) => !v)}>Show as text</button>
      </div>
      {asText && (
        <p className="rounded-lg border border-border bg-surface-2 p-3 text-center font-mono text-sm" data-testid="pad-text">
          {PAD_SEQUENCE.map((p) => PAD_NAMES[p]).join(" → ")}
        </p>
      )}
    </div>
  );
}
