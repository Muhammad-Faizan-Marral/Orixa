import { createHash, timingSafeEqual } from "node:crypto";
import { LIGHTS_START, PAD_SEQUENCE, PUZZLES, type PuzzleId } from "@/lib/game/config";

/** Server-only. Override with ORIXA_SECRET_CODE; the default is the code the product shipped with. */
const CODE = process.env.ORIXA_SECRET_CODE ?? "63125";

const hash = (v: string) => createHash("sha256").update(v).digest();
export const safeEqual = (a: string, b: string) => timingSafeEqual(hash(a), hash(b));

/* ---- Lights Out: replay the presses on the server ---- */
function lightsSolved(answer: string) {
  const presses = answer.split(",").map((n) => Number(n));
  if (presses.length > 12 || presses.some((n) => !Number.isInteger(n) || n < 0 || n > 8)) return false;
  const b: number[] = [...LIGHTS_START];
  for (const p of presses) {
    const r = Math.floor(p / 3), c = p % 3;
    for (const [dr, dc] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const rr = r + dr, cc = c + dc;
      if (rr >= 0 && rr < 3 && cc >= 0 && cc < 3) b[rr * 3 + cc] ^= 1;
    }
  }
  return b.every((x) => x === 0);
}

function isCorrect(id: PuzzleId, raw: string): boolean {
  const a = raw.trim();
  switch (id) {
    case "lights": return lightsSolved(a);
    case "decoder": return safeEqual("3", a);
    case "pads": return safeEqual(PAD_SEQUENCE.join(","), a);
    case "terminal": return safeEqual("complete", a) || safeEqual("2", a);
    case "alchemy": return safeEqual("forged", a) || safeEqual("5", a);
  }
}

/** Returns the earned digit for a correct answer, otherwise null. */
export const checkAnswer = (id: PuzzleId, answer: string): string | null =>
  isCorrect(id, answer) ? CODE[PUZZLES[id].slot] : null;

export const verifyCode = (input: string) => safeEqual(CODE, input.trim());
