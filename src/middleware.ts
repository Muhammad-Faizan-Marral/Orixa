import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { REFERRAL_COOKIE, REFERRAL_COOKIE_MAX_AGE } from "@/lib/referral";

function applyReferralCookie(
  request: NextRequest,
  response: NextResponse,
): NextResponse {
  const ref = request.nextUrl.searchParams.get("ref");
  if (!ref || ref.length < 3 || ref.length > 64) return response;

  const value = ref.toLowerCase().trim();

  request.cookies.set(REFERRAL_COOKIE, value);

  response.cookies.set(REFERRAL_COOKIE, value, {
    maxAge: REFERRAL_COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}

export async function middleware(request: NextRequest) {
  const hasRef = Boolean(request.nextUrl.searchParams.get("ref"));

  const response = await updateSession(request);

  if (hasRef && response instanceof NextResponse) {
    return applyReferralCookie(request, response);
  }

  if (hasRef) {
    const res = NextResponse.next({ request });
    return applyReferralCookie(request, res);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};