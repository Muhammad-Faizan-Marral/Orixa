"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CODE_LENGTH, MAX_LIVES, PUZZLES, type PuzzleId } from "./config";
import { checkAnswer } from "./verify";

export type AttemptResult = "correct" | "wrong" | "error" | "ignored";
type Status = "playing" | "over";

interface GameState {
  lives: number;
  digits: (string | null)[];
  status: Status;
  /** True once the visitor has opened any puzzle (reveals the HUD). */
  started: boolean;
  activePuzzle: PuzzleId | null;
  /** True while an answer is being verified: blocks double submissions. */
  busy: boolean;
  openPuzzle: (id: PuzzleId) => void;
  closePuzzle: () => void;
  restart: () => void;
  submitAnswer: (id: PuzzleId, answer: string) => Promise<AttemptResult>;
}

const emptyDigits = () => Array<string | null>(CODE_LENGTH).fill(null);

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      lives: MAX_LIVES,
      digits: emptyDigits(),
      status: "playing",
      started: false,
      activePuzzle: null,
      busy: false,

      openPuzzle: (id) => set({ activePuzzle: id, started: true }),
      closePuzzle: () => set({ activePuzzle: null }),

      // Reset policy: a restart returns to 3 lives AND clears all collected digits.
      restart: () =>
        set({
          lives: MAX_LIVES,
          digits: emptyDigits(),
          status: "playing",
          activePuzzle: null,
          busy: false,
        }),

      submitAnswer: async (id, answer) => {
        const slot = PUZZLES[id].slot;
        const s = get();
        if (s.busy || s.status !== "playing" || s.digits[slot]) return "ignored";
        set({ busy: true });

        // Pure client check — no API, no cost, no network.
        // Small delay keeps the "busy" feel consistent with the old UX.
        await new Promise((r) => setTimeout(r, 180));

        try {
          const digit = checkAnswer(id, answer);
          const cur = get();
          if (cur.status !== "playing" || cur.digits[slot]) return "ignored";

          if (digit && /^\d$/.test(digit)) {
            const digits = [...cur.digits];
            digits[slot] = digit;
            set({ digits });
            return "correct";
          }

          const lives = Math.max(0, cur.lives - 1);
          set({ lives, status: lives === 0 ? "over" : "playing" });
          return "wrong";
        } finally {
          set({ busy: false });
        }
      },
    }),
    {
      name: "orixa-game-v1",
      storage: createJSONStorage(() => sessionStorage),
      skipHydration: true,
      partialize: (s) => ({
        lives: s.lives,
        digits: s.digits,
        status: s.status,
        started: s.started,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<GameState>;
        const digits =
          Array.isArray(p.digits) && p.digits.length === CODE_LENGTH
            ? p.digits.map((d) =>
                typeof d === "string" && /^\d$/.test(d) ? d : null,
              )
            : emptyDigits();
        const lives = Number.isInteger(p.lives)
          ? Math.min(MAX_LIVES, Math.max(0, p.lives as number))
          : MAX_LIVES;
        return {
          ...current,
          digits,
          lives,
          status: lives === 0 ? "over" : "playing",
          started: Boolean(p.started),
        };
      },
    },
  ),
);

/** True once persisted state has been read from sessionStorage. */
export function useHydrated() {
  return useSyncExternalStore(
    (cb) => useGameStore.persist.onFinishHydration(cb),
    () => useGameStore.persist.hasHydrated(),
    () => false,
  );
}

export const allDigitsFound = (digits: (string | null)[]) =>
  digits.every(Boolean);