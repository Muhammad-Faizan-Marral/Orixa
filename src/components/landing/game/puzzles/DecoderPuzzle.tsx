"use client";
import { useState } from "react";
import { DECODER_CIPHERTEXT } from "@/lib/game/config";
import type { PuzzleBodyProps } from "./types";

const shift = (text: string, k: number) =>
  text.replace(/[A-Z]/g, (ch) => String.fromCharCode(((ch.charCodeAt(0) - 65 - k + 26) % 26) + 65));

export default function DecoderPuzzle({ attempt, busy }: PuzzleBodyProps) {
  const [k, setK] = useState(0);
  const [guess, setGuess] = useState("");
  const [tried, setTried] = useState<string[]>([]);
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border-strong bg-surface p-4 font-mono text-sm">
        <p className="text-subtle-foreground">received</p>
        <p className="break-words tracking-widest text-error/90">{DECODER_CIPHERTEXT}</p>
        <p className="mt-3 text-subtle-foreground">decoded with ring at +{k}</p>
        <p aria-live="polite" className="break-words tracking-widest text-accent">{shift(DECODER_CIPHERTEXT, k)}</p>
      </div>

      <div className="rounded-xl border border-border bg-surface-2 p-3">
        <div className="flex items-center gap-3">
          <button type="button" className="btn btn-ghost !min-h-11 !px-4" aria-label="Turn ring back" onClick={() => setK((v) => (v + 25) % 26)}>◀</button>
          <input type="range" min={0} max={25} value={k} onChange={(e) => setK(Number(e.target.value))} aria-label="Ring position" className="h-11 flex-1 accent-primary" />
          <button type="button" className="btn btn-ghost !min-h-11 !px-4" aria-label="Turn ring forward" onClick={() => setK((v) => (v + 1) % 26)}>▶</button>
        </div>
        <p className="mt-2 break-all text-center font-mono text-[0.65rem] tracking-[0.25em] text-subtle-foreground" aria-hidden="true">
          {alphabet}<br /><span className="text-primary">{alphabet.slice(k) + alphabet.slice(0, k)}</span>
        </p>
      </div>

      <div className="flex gap-2">
        <label className="sr-only" htmlFor="decoder-answer">Your answer</label>
        <input id="decoder-answer" inputMode="numeric" maxLength={2} value={guess} placeholder="Your answer"
          onChange={(e) => setGuess(e.target.value.replace(/\D/g, ""))}
          className="min-h-12 min-w-0 flex-1 rounded-lg border border-border-strong bg-surface px-4 text-center font-mono text-lg" />
        <button type="button" className="btn btn-ion" disabled={busy || !guess || tried.includes(guess)}
          onClick={async () => { const r = await attempt(guess); if (r === "wrong") { setTried((t) => [...t, guess]); setGuess(""); } }}>Send</button>
      </div>
    </div>
  );
}
