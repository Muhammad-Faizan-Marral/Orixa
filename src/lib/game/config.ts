/**
 * Shared (client + server) game configuration.
 * Puzzle boards live here because the client has to render them.
 */
import { BILLING } from "@/constants/billing";

export const MAX_LIVES = 3;
export const CODE_LENGTH = 5;

export const PUZZLE_ORDER = [
  "lights",
  "decoder",
  "pads",
  "terminal",
  "alchemy",
] as const;
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
    id: "lights",
    slot: 0,
    title: "Power the Cartridge",
    kicker: "Circuit puzzle",
    teaser:
      "An old cartridge, half-buried in the workflow. Its contacts are dark and nothing boots.",
    objective:
      "Every contact must be switched off to ignite the cartridge. Pressing a contact flips it and its four neighbours (up, down, left, right). Reset is free.",
    nudge:
      "Think in presses, not cells: the order doesn't matter, and pressing the same contact twice cancels out.",
    next: "A sealed case file has surfaced. The leak happened after midnight, and someone left a trail.",
  },
  decoder: {
    id: "decoder",
    slot: 1,
    title: "The Black File",
    kicker: "Classified case",
    teaser:
      "Portfolio template “neo-glass” appeared in a public gist at 01:14. The access trail is still warm.",
    objective:
      "Review the brief, access log, chat, and field notes. How many people still had write access after midnight?",
    nudge:
      "Count only people with write access at midnight. Mira had logged out; Kai was read-only.",
    next: "Case closed. The frame's handshake is next: watch the pads, then repeat their sequence.",
  },
  pads: {
    id: "pads",
    slot: 2,
    title: "Frame Sync",
    kicker: "Memory game",
    teaser:
      "You noticed the mark most people scroll past. The frame is syncing, and it wants a handshake.",
    objective:
      "Watch the pads light up, then repeat the exact sequence. A wrong sequence costs a life and replays the pattern.",
    nudge:
      "Say the colours in your head as they flash. Replays are free, so use them.",
    next: "Handshake accepted. A fictional recruiter is waiting to evaluate your portfolio and your boundaries.",
  },
  terminal: {
    id: "terminal",
    slot: 3,
    title: "AI Interview from Hell",
    kicker: "Unpaid opportunity",
    teaser:
      "The recruiter promises a “quick chat” and has already scheduled seven follow-ups.",
    objective:
      "Answer five questions from a fictional AI recruiter. The choices are for fun; only accepting your final classification claims the digit.",
    nudge:
      "No answer costs a life. Pick what feels right, then decide whether to accept the classification.",
    next: "Interview complete. One last step: forge a creative identity from the clues you've collected.",
  },
  alchemy: {
    id: "alchemy",
    slot: 4,
    title: "The Identity Forge",
    kicker: "Creative identity",
    teaser:
      "The forge is sealed until your first four digits are collected. Bring your choices, not a résumé.",
    objective:
      "Choose an artifact, a personality, a superpower, and a visual identity. Your combination will become a small creative identity card.",
    nudge:
      "There are no wrong choices here. Each choice shapes the title, description, and tagline on your card.",
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
  "status.log":
    "build: portfolio.orixa\n[x] add-work       resume parsed\n[ ] choose-design  waiting\n[?] publish        signal lost",
  "notes.txt":
    "legend:  [x] done   [ ] to do   [?] unknown, not done yet\nThe workflow has 3 steps in total.\nReport the number still left with: submit <n>",
};

/** Prices come from constants/billing.ts so the UI, JSON-LD and checkout can never drift apart. */
export const PRICING = {
  monthly: BILLING.PRICE_MONTHLY,
  yearly: BILLING.PRICE_YEARLY,
  secretOff: 9,
} as const;

export interface DiscountState {
  applied: boolean;
  amountOff: number;
  yearlyPrice: number;
}
