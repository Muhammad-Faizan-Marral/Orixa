import { LIGHTS_START, PAD_SEQUENCE, PUZZLES, type PuzzleId } from "./config";

const CODE = "63125";

function lightsSolved(answer: string): boolean {
  const presses = answer.split(",").map((n) => Number(n));
  if (
    presses.length > 12 ||
    presses.some((n) => !Number.isInteger(n) || n < 0 || n > 8)
  )
    return false;
  const b: number[] = [...LIGHTS_START];
  for (const p of presses) {
    const r = Math.floor(p / 3);
    const c = p % 3;
    for (const [dr, dc] of [
      [0, 0],
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const rr = r + dr;
      const cc = c + dc;
      if (rr >= 0 && rr < 3 && cc >= 0 && cc < 3) b[rr * 3 + cc] ^= 1;
    }
  }
  return b.every((x) => x === 0);
}

function evalExpr(src: string): number | null {
  const t = src.replace(/\s+/g, "");
  let i = 0;
  const peek = () => t[i];
  function expr(): number {
    let v = term();
    while (peek() === "+" || peek() === "-") {
      const op = t[i++];
      const r = term();
      v = op === "+" ? v + r : v - r;
    }
    return v;
  }
  function term(): number {
    let v = factor();
    while (peek() === "*" || peek() === "/") {
      const op = t[i++];
      const r = factor();
      if (op === "/" && r === 0) throw new Error("div0");
      v = op === "*" ? v * r : v / r;
    }
    return v;
  }
  function factor(): number {
    const ch = peek();
    if (ch === "(") {
      i++;
      const v = expr();
      if (t[i++] !== ")") throw new Error("paren");
      return v;
    }
    if (ch !== undefined && /\d/.test(ch)) {
      i++;
      if (t[i] !== undefined && /\d/.test(t[i])) throw new Error("multi");
      return Number(ch);
    }
    throw new Error("syntax");
  }
  try {
    const v = expr();
    return i === t.length ? v : null;
  } catch {
    return null;
  }
}

function alchemySolved(answer: string): boolean {
  if (answer.length > 24 || !/^[\d+\-*/() ]+$/.test(answer)) return false;
  const pool = CODE.slice(0, 4).split("");
  for (const d of answer.match(/\d/g) ?? []) {
    const k = pool.indexOf(d);
    if (k === -1) return false;
    pool.splice(k, 1);
  }
  if ((answer.match(/\d/g) ?? []).length < 2) return false;
  const v = evalExpr(answer);
  return v !== null && Math.abs(v - CODE.length) < 1e-9;
}

function isCorrect(id: PuzzleId, raw: string): boolean {
  const a = raw.trim().toLowerCase();
  switch (id) {
    case "lights":
      return lightsSolved(a);
    case "decoder":
      return a === "3";
    case "pads":
      return a === PAD_SEQUENCE.join(",");
    case "terminal":
      return a === "2";
    case "alchemy":
      return alchemySolved(a);
  }
}

/** Returns the earned digit for a correct answer, otherwise null. */
export function checkAnswer(id: PuzzleId, answer: string): string | null {
  return isCorrect(id, answer) ? CODE[PUZZLES[id].slot] : null;
}
