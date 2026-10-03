"use client";
import { useGameStore } from "@/lib/game/store";
import Logo from "../Logo";
import LifeMeter from "./LifeMeter";

export default function GameOver() {
  const restart = useGameStore((s) => s.restart);
  const close = useGameStore((s) => s.closePuzzle);
  return (
    <div className="anim-portal border-gradient-ion rounded-2xl p-6 text-center shadow-glow-primary sm:p-8">
      <div className="flex justify-center opacity-60 grayscale"><Logo variant="markCutout" height={40} alt="" /></div>
      <div className="mt-4 flex justify-center"><LifeMeter lives={0} /></div>
      <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight" id="cabinet-title">The cabinet went dark</h2>
      <p className="mx-auto mt-3 max-w-sm text-muted-foreground">
        Out of lives. Even the best portfolios take a few drafts. Restarting brings back all three lives and puts the digits back in the machine, so you&apos;ll collect them again.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button type="button" className="btn btn-ion" onClick={restart} autoFocus>Restart the game</button>
        <button type="button" className="btn btn-ghost" onClick={close}>Back to the page</button>
      </div>
    </div>
  );
}
