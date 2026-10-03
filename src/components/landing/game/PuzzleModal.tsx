"use client";
import { useState, type ComponentType } from "react";
import { PUZZLES, type PuzzleId } from "@/lib/game/config";
import { useGameStore } from "@/lib/game/store";
import Logo from "../Logo";
import DigitRail from "./DigitRail";
import LifeMeter from "./LifeMeter";
import AlchemyPuzzle from "./puzzles/AlchemyPuzzle";
import DecoderPuzzle from "./puzzles/DecoderPuzzle";
import LightsPuzzle from "./puzzles/LightsPuzzle";
import PadsPuzzle from "./puzzles/PadsPuzzle";
import TerminalPuzzle from "./puzzles/TerminalPuzzle";
import type { PuzzleBodyProps } from "./puzzles/types";

const BODIES: Record<PuzzleId, ComponentType<PuzzleBodyProps>> = {
  lights: LightsPuzzle, decoder: DecoderPuzzle, pads: PadsPuzzle, terminal: TerminalPuzzle, alchemy: AlchemyPuzzle,
};

const SPARKS = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2;
  return { dx: Math.round(Math.cos(a) * 100), dy: Math.round(Math.sin(a) * 100) };
});

export default function PuzzleModal({ id }: { id: PuzzleId }) {
  const meta = PUZZLES[id];
  const lives = useGameStore((s) => s.lives);
  const digits = useGameStore((s) => s.digits);
  const busy = useGameStore((s) => s.busy);
  const submitAnswer = useGameStore((s) => s.submitAnswer);
  const close = useGameStore((s) => s.closePuzzle);

  const digit = digits[meta.slot];
  const [playing, setPlaying] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; tone: "wrong" | "error" } | null>(null);
  const [shake, setShake] = useState(false);
  const Body = BODIES[id];

  const attempt: PuzzleBodyProps["attempt"] = async (answer) => {
    setFeedback(null);
    const r = await submitAnswer(id, answer);
    if (r === "wrong") {
      const left = useGameStore.getState().lives;
      setShake(true);
      setFeedback({ tone: "wrong", text: `Not quite. ${left === 1 ? "One life left." : `${left} lives left.`} ${meta.nudge}` });
    } else if (r === "error") {
      setFeedback({ tone: "error", text: "Couldn't reach the cabinet. Check your connection and try again. No life was lost." });
    }
    return r;
  };

  const goPricing = () => { close(); document.getElementById("pricing")?.scrollIntoView(); };

  return (
    <div className="anim-portal border-gradient-ion relative overflow-hidden rounded-2xl shadow-glow-primary">
      <div className="pointer-events-none absolute inset-0 bg-aurora opacity-70" aria-hidden="true" />
      <header className="relative flex items-center justify-between gap-3 border-b border-border px-5 py-3">
        <div className="flex items-center gap-3"><Logo variant="markCutout" height={22} alt="" /><LifeMeter lives={lives} /></div>
        <button type="button" onClick={close} aria-label="Close" className="btn btn-ghost !min-h-10 !px-3">✕</button>
      </header>

      <div className="relative space-y-5 p-5 sm:p-7">
        <div>
          <p className="text-caption">{meta.kicker} · digit {meta.slot + 1} of 5</p>
          <h2 id="cabinet-title" className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">{meta.title}</h2>
        </div>

        {digit ? (
          <div className="relative text-center">
            <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
              {SPARKS.map((s, i) => (
                <span key={i} className="spark" aria-hidden="true" style={{ ["--dx" as string]: `${s.dx}px`, ["--dy" as string]: `${s.dy}px` }} />
              ))}
              <div className="anim-pop border-gradient-ion shadow-glow-primary flex h-28 w-28 items-center justify-center rounded-2xl font-mono text-7xl font-bold">
                <span className="text-gradient-ion">{digit}</span>
              </div>
            </div>
            <p role="status" className="mt-4 font-semibold">Digit {meta.slot + 1} collected</p>
            <div className="mt-3 flex justify-center"><DigitRail digits={digits} /></div>
            <p className="mx-auto mt-4 max-w-sm text-sm text-muted-foreground">{meta.next}</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
              {digits.every(Boolean) && <button type="button" className="btn btn-ion" onClick={goPricing}>Go to the Pro card</button>}
              <button type="button" className="btn btn-ghost" onClick={close}>Back to the page</button>
            </div>
          </div>
        ) : !playing ? (
          <div className="text-center">
            <div className="mx-auto my-4 h-20 w-20" style={{ perspective: 400 }} aria-hidden="true">
              <div className="coin border-gradient-ion shadow-glow-primary flex h-20 w-20 items-center justify-center rounded-full">
                <Logo variant="mark" height={38} alt="" />
              </div>
            </div>
            <p className="text-muted-foreground">{meta.teaser}</p>
            <p className="mt-3 text-sm">{meta.objective}</p>
            <p className="mt-3 text-xs text-subtle-foreground">Wrong answers cost one of your three shared lives. Closing this window costs nothing.</p>
            <button type="button" className="btn btn-ion mt-6 w-full sm:w-auto" onClick={() => setPlaying(true)} autoFocus>Start</button>
          </div>
        ) : (
          <div className={shake ? "anim-shake" : ""} onAnimationEnd={() => setShake(false)}>
            <p className="mb-4 text-sm text-muted-foreground">{meta.objective}</p>
            <Body attempt={attempt} busy={busy} />
            <p role="status" aria-live="polite" className={`mt-4 min-h-6 text-sm ${feedback?.tone === "wrong" ? "text-error" : "text-warning"}`}>{feedback?.text}</p>
          </div>
        )}
      </div>
    </div>
  );
}
