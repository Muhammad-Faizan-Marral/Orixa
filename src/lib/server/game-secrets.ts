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

/* ---- Alchemy: tiny safe expression evaluator (no eval) ---- */
function evalExpr(src: string): number | null {
  const t = src.replace(/\s+/g, "");
  let i = 0;
  const peek = () => t[i];
  function expr(): number {
    let v = term();
    while (peek() === "+" || peek() === "-") { const op = t[i++]; const r = term(); v = op === "+" ? v + r : v - r; }
    return v;
  }
  function term(): number {
    let v = factor();
    while (peek() === "*" || peek() === "/") {
      const op = t[i++]; const r = factor();
      if (op === "/" && r === 0) throw new Error("div0");
      v = op === "*" ? v * r : v / r;
    }
    return v;
  }
  function factor(): number {
    const ch = peek();
    if (ch === "(") { i++; const v = expr(); if (t[i++] !== ")") throw new Error("paren"); return v; }
    if (ch !== undefined && /\d/.test(ch)) { i++; if (t[i] !== undefined && /\d/.test(t[i])) throw new Error("multi"); return Number(ch); }
    throw new Error("syntax");
  }
  try { const v = expr(); return i === t.length ? v : null; } catch { return null; }
}

function alchemySolved(answer: string) {
  if (answer.length > 24 || !/^[\d+\-*/() ]+$/.test(answer)) return false;
  const pool = CODE.slice(0, 4).split("");
  for (const d of answer.match(/\d/g) ?? []) {
    const k = pool.indexOf(d);
    if (k === -1) return false; // only collected digits, each at most once
    pool.splice(k, 1);
  }
  if ((answer.match(/\d/g) ?? []).length < 2) return false;
  const v = evalExpr(answer);
  return v !== null && Math.abs(v - CODE.length) < 1e-9;
}

function isCorrect(id: PuzzleId, raw: string): boolean {
  const a = raw.trim().toLowerCase();
  switch (id) {
    case "lights": return lightsSolved(a);
    case "decoder": return safeEqual("3", a);
    case "pads": return safeEqual(PAD_SEQUENCE.join(","), a);
    case "terminal": return safeEqual("2", a);
    case "alchemy": return alchemySolved(a);
  }
}

/** Returns the earned digit for a correct answer, otherwise null. */
export const checkAnswer = (id: PuzzleId, answer: string): string | null =>
  isCorrect(id, answer) ? CODE[PUZZLES[id].slot] : null;

export const verifyCode = (input: string) => safeEqual(CODE, input.trim());
