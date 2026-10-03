"use client";
import { useState, type ReactNode } from "react";
import { PUZZLES, type PuzzleId } from "@/lib/game/config";
import { useGameStore } from "@/lib/game/store";

interface Props {
  id: PuzzleId;
  label: string;
  className?: string;
  children: (state: { solved: boolean; sealed: boolean }) => ReactNode;
}

/** Accessible hotspot that opens a puzzle. The final puzzle stays sealed until four digits exist. */
export default function Relic({ id, label, className = "", children }: Props) {
  const openPuzzle = useGameStore((s) => s.openPuzzle);
  const digits = useGameStore((s) => s.digits);
  const solved = Boolean(digits[PUZZLES[id].slot]);
  const sealed = id === "alchemy" && !solved && !digits.slice(0, 4).every(Boolean);
  const [shake, setShake] = useState(false);
  const [hint, setHint] = useState(false);

  return (
    <button type="button"
      aria-label={solved ? `${label} (solved)` : sealed ? `${label} (sealed: needs four digits first)` : label}
      onClick={() => { if (sealed) { setShake(true); setHint(true); } else openPuzzle(id); }}
      onAnimationEnd={() => setShake(false)}
      className={`${shake ? "anim-shake" : ""} ${className}`}>
      {children({ solved, sealed })}
      {hint && sealed && (
        <span role="status" className="font-mono absolute left-1/2 top-full z-10 mt-2 w-max max-w-[14rem] -translate-x-1/2 rounded-md border border-border-strong bg-surface-2 px-2.5 py-1.5 text-xs text-muted-foreground">
          Sealed. It needs the first four digits.
        </span>
      )}
    </button>
  );
}
