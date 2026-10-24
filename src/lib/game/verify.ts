import {
  LIGHTS_START,
  PAD_SEQUENCE,
  PUZZLES,
  type PuzzleId,
} from "./config";

const CODE = "63125";

function lightsSolved(answer: string) {
  const presses = answer.split(",").map((n) => Number(n));
  if (
    presses.length > 12 ||
    presses.some((n) => !Number.isInteger(n) || n < 0 || n > 8)
  )
    return false;
  const board: number[] = [...LIGHTS_START];
  for (const press of presses) {
    const row = Math.floor(press / 3);
    const column = press % 3;
    for (const [rowOffset, columnOffset] of [
      [0, 0],
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const nextRow = row + rowOffset;
      const nextColumn = column + columnOffset;
      if (
        nextRow >= 0 &&
        nextRow < 3 &&
        nextColumn >= 0 &&
        nextColumn < 3
      ) {
        board[nextRow * 3 + nextColumn] ^= 1;
      }
    }
  }
  return board.every((cell) => cell === 0);
}

export function checkAnswer(id: PuzzleId, answer: string): string | null {
  const normalized = answer.trim();
  let correct: boolean;

  switch (id) {
    case "lights":
      correct = lightsSolved(normalized);
      break;
    case "decoder":
      correct = normalized === "3";
      break;
    case "pads":
      correct = normalized === PAD_SEQUENCE.join(",");
      break;
    case "terminal":
      correct = normalized === "complete" || normalized === "2";
      break;
    case "alchemy":
      correct = normalized === "forged" || normalized === "5";
      break;
  }

  return correct ? CODE[PUZZLES[id].slot] : null;
}
