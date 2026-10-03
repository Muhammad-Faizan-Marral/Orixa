import type { AttemptResult } from "@/lib/game/store";

export interface PuzzleBodyProps {
  attempt: (answer: string) => Promise<AttemptResult>;
  busy: boolean;
}
