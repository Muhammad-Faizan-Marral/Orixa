import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { PRICING, type DiscountState } from "@/lib/game/config";
import { DISCOUNT_COOKIE, DISCOUNT_MAX_AGE, hasSecretDiscount, signDiscountToken } from "@/lib/server/discount";
import { verifyCode } from "@/lib/server/game-secrets";
import { clientKey, rateLimit } from "@/lib/server/rate-limit";

const headers = { "Cache-Control": "no-store" };
const state = (applied: boolean): DiscountState => ({
  applied,
  amountOff: applied ? PRICING.secretOff : 0,
  yearlyPrice: applied ? PRICING.yearly - PRICING.secretOff : PRICING.yearly,
});

/** Is the discount already applied for this browser? (signed httpOnly cookie, not localStorage) */
export async function GET(req: NextRequest) {
  return NextResponse.json(state(hasSecretDiscount(req)), { headers });
}

export async function POST(req: NextRequest) {
  if (!rateLimit(`code:${clientKey(req)}`, 10, 60_000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429, headers });
  }
  let json: unknown;
  try { json = await req.json(); } catch { return NextResponse.json({ error: "bad_json" }, { status: 400, headers }); }
  const parsed = z.object({ code: z.string().max(16) }).safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400, headers });

  // Duplicate protection: applying again never stacks, it just reports the existing state.
  if (hasSecretDiscount(req)) return NextResponse.json({ valid: true, alreadyApplied: true, ...state(true) }, { headers });

  if (!verifyCode(parsed.data.code)) return NextResponse.json({ valid: false, ...state(false) }, { headers });

  const res = NextResponse.json({ valid: true, alreadyApplied: false, ...state(true) }, { headers });
  res.cookies.set(DISCOUNT_COOKIE, signDiscountToken(), {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: DISCOUNT_MAX_AGE,
  });
  return res;
}
