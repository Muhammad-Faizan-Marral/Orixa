import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { PUZZLE_ORDER } from "@/lib/game/config";
import { checkAnswer } from "@/lib/server/game-secrets";
import { clientKey, rateLimit } from "@/lib/server/rate-limit";

const Body = z.object({ puzzle: z.enum(PUZZLE_ORDER), answer: z.string().min(1).max(64) });
const headers = { "Cache-Control": "no-store" };

export async function POST(req: NextRequest) {
  if (!rateLimit(`ans:${clientKey(req)}`, 60, 60_000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429, headers });
  }
  let json: unknown;
  try { json = await req.json(); } catch { return NextResponse.json({ error: "bad_json" }, { status: 400, headers }); }
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400, headers });

  const digit = checkAnswer(parsed.data.puzzle, parsed.data.answer);
  return NextResponse.json(digit ? { correct: true, digit } : { correct: false }, { headers });
}
