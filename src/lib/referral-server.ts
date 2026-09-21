import { cookies } from "next/headers";
import { REFERRAL_COOKIE } from "@/lib/referral";

export async function getReferralCodeFromCookie(): Promise<string | null> {
  try {
    const jar = await cookies();
    const value = jar.get(REFERRAL_COOKIE)?.value;
    if (!value || value.length < 3) return null;
    return value.toLowerCase().trim();
  } catch {
    return null;
  }
}