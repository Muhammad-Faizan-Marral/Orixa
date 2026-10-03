/**
 * Shared (client + server) game configuration.
 * Digits and the secret code are server-only (lib/server/game-secrets.ts).
 * Puzzle *boards* live here because the client has to render them; the server re-verifies every answer.
 */
export const MAX_LIVES = 3;
export const CODE_LENGTH = 5;

export const PUZZLE_ORDER = ["lights", "decoder", "pads", "terminal", "alchemy"] as const;
export type PuzzleId = (typeof PUZZLE_ORDER)[number];

export interface PuzzleMeta {
  id: PuzzleId;
  /** Zero-based position of the digit in the code. */
  slot: number;
  title: string;
  kicker: string;
  teaser: string;
  objective: string;
  nudge: string;
  next: string;
}

export const PUZZLES: Record<PuzzleId, PuzzleMeta> = {
  lights: {
    id: "lights", slot: 0, title: "Power the Cartridge", kicker: "Circuit puzzle",
    teaser: "An old cartridge, half-buried in the workflow. Its contacts are dark and nothing boots.",
    objective: "Every contact must be switched off to ignite the cartridge. Pressing a contact flips it and its four neighbours (up, down, left, right). Reset is free.",
    nudge: "Think in presses, not cells: the order doesn't matter, and pressing the same contact twice cancels out.",
    next: "A transmission is breaking up in the comparison table. One row has gone to static.",
  },
  decoder: {
    id: "decoder", slot: 1, title: "Decoder Ring", kicker: "Cipher",
    teaser: "The corrupted row is a message. Someone shifted every letter by the same amount.",
    objective: "Turn the ring until the message becomes readable, then answer the question it asks.",
    nudge: "Every letter moved the same distance. Turn the ring until real words appear, then read the question again.",
    next: "Look at the corners of the Features section. One frame mark is not like the others.",
  },
  pads: {
    id: "pads", slot: 2, title: "Frame Sync", kicker: "Memory game",
    teaser: "You noticed the mark most people scroll past. The frame is syncing, and it wants a handshake.",
    objective: "Watch the pads light up, then repeat the exact sequence. A wrong sequence costs a life and replays the pattern.",
    nudge: "Say the colours in your head as they flash. Replays are free, so use them.",
    next: "There's a blinking cursor after the Features heading. Terminals wait for input.",
  },
  terminal: {
    id: "terminal", slot: 3, title: "ORIXA-OS", kicker: "Terminal",
    teaser: "The cursor was waiting for you. A tiny operating system boots in the dark.",
    objective: "Explore the files with commands. When you know how many steps are left before the portfolio is live, send it with submit <number>.",
    nudge: "Type help, then read every file. The legend in notes.txt tells you what each mark means.",
    next: "At the end of the Features grid, an empty slot has been waiting. It needs four digits.",
  },
  alchemy: {
    id: "alchemy", slot: 4, title: "Digit Alchemy", kicker: "Final forge",
    teaser: "The keyhole opens only for someone who has been collecting. Bring your digits.",
    objective: "Combine the digits you collected, using each at most once, with + − × ÷ and brackets, to forge a number equal to how many digits the full code has.",
    nudge: "How long is the code? Count the slots. Then find two of your digits that make that number.",
    next: "The code is complete. Take it to the Pro card in Pricing.",
  },
};

/* ---------- Puzzle boards (client-visible by necessity) ---------- */

/** 3x3 Lights Out. 1 = lit. Exactly one press-set clears it. */
export const LIGHTS_START = [1, 1, 0, 1, 0, 1, 1, 1, 1] as const;

/** Caesar-shifted message. Plaintext asks a question; the answer is typed back. */
export const DECODER_CIPHERTEXT = "OVD THUF CVDLSZ HYL PU AOL DVYK VYPEH";

export const PAD_NAMES = ["Indigo", "Cyan", "Mint", "Amber"] as const;
export const PAD_SEQUENCE = [2, 0, 3, 1, 1, 2] as const;

export const TERMINAL_FILES: Record<string, string> = {
  "README.txt": "Welcome to ORIXA-OS v0.1\nType help to list commands.",
  "status.log": "build: portfolio.orixa\n[x] add-work       resume parsed\n[ ] choose-design  waiting\n[?] publish        signal lost",
  "notes.txt": "legend:  [x] done   [ ] to do   [?] unknown, not done yet\nThe workflow has 3 steps in total.\nReport the number still left with: submit <n>",
};

/** Real prices taken from the existing PricingSection. */
export const PRICING = { monthly: 9, yearly: 69, secretOff: 9 } as const;

export interface DiscountState {
  applied: boolean;
  amountOff: number;
  yearlyPrice: number;
}
