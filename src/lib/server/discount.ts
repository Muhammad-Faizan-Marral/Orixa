import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

export const DISCOUNT_COOKIE = "orixa_secret_discount";
export const DISCOUNT_MAX_AGE = 60 * 60 * 24 * 7;

function secret() {
  const s = process.env.DISCOUNT_COOKIE_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV === "production") throw new Error("DISCOUNT_COOKIE_SECRET is required in production");
  return "dev-only-secret";
}
const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");

export function signDiscountToken(now = Date.now()) {
  const payload = `v1.${Math.floor(now / 1000) + DISCOUNT_MAX_AGE}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyDiscountToken(token: string | undefined | null, now = Date.now()) {
  if (!token) return false;
  const [v, exp, sig] = token.split(".");
  if (v !== "v1" || !exp || !sig || Number(exp) * 1000 < now) return false;
  const expected = Buffer.from(sign(`${v}.${exp}`));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

/**
 * Use this in the EXISTING Polar checkout route handler:
 *   if (hasSecretDiscount(req) && process.env.POLAR_SECRET_DISCOUNT_ID) -> pass it as the checkout's discountId.
 * Polar then enforces the amount, expiry and redemption limits configured in its dashboard.
 */
export const hasSecretDiscount = (req: NextRequest) =>
  verifyDiscountToken(req.cookies.get(DISCOUNT_COOKIE)?.value);
