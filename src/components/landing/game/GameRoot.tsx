"use client";
import { useEffect, useState } from "react";
import { useGameStore } from "@/lib/game/store";
import GameHud from "./GameHud";
import PuzzleHost from "./PuzzleHost";

const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];

/** Mount once per landing page: restores session progress, renders the HUD + modal host, hides one harmless easter egg. */
export default function GameRoot() {
  const [egg, setEgg] = useState(false);

  useEffect(() => { void useGameStore.persist.rehydrate(); }, []);

  useEffect(() => {
    let seq: string[] = [];
    let t: ReturnType<typeof setTimeout> | undefined;
    const onKey = (e: KeyboardEvent) => {
      seq = [...seq, e.key.length === 1 ? e.key.toLowerCase() : e.key].slice(-KONAMI.length);
      if (seq.join() === KONAMI.join()) {
        setEgg(true);
        clearTimeout(t);
        t = setTimeout(() => setEgg(false), 4500); // grants nothing: purely a wink
      }
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); clearTimeout(t); };
  }, []);

  return (
    <>
      <GameHud />
      <PuzzleHost />
      {egg && (
        <div role="status" className="fixed left-1/2 top-20 z-[60] -translate-x-1/2 rounded-xl border-gradient-ion px-5 py-3 text-sm shadow-glow-primary anim-pop">
          Cheat code accepted. It does nothing, but we respect the dedication.
        </div>
      )}
    </>
  );
}
