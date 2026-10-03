"use client";
import { useEffect, useRef } from "react";
import { useGameStore } from "@/lib/game/store";
import GameOver from "./GameOver";
import PuzzleModal from "./PuzzleModal";

/**
 * One native <dialog> for every secret. showModal() gives us a focus trap, Escape-to-close,
 * an inert background, and focus restoration to the element that opened it.
 */
export default function PuzzleHost() {
  const active = useGameStore((s) => s.activePuzzle);
  const status = useGameStore((s) => s.status);
  const ref = useRef<HTMLDialogElement>(null);
  const open = active !== null;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog ref={ref} className="cabinet" aria-labelledby="cabinet-title"
      onClose={() => useGameStore.getState().closePuzzle()}
      onClick={(e) => { if (e.target === e.currentTarget) useGameStore.getState().closePuzzle(); }}>
      {open && (
        <div className="max-h-[92dvh] w-[min(34rem,calc(100vw-1.5rem))] overflow-y-auto rounded-2xl">
          {status === "over" ? <GameOver /> : <PuzzleModal key={active} id={active} />}
        </div>
      )}
    </dialog>
  );
}
