import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { REFERRAL_COOKIE, REFERRAL_COOKIE_MAX_AGE } from "@/lib/referral";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  // Capture ?ref=CODE into cookie (survives signup → onboarding)
  const ref = request.nextUrl.searchParams.get("ref");
  if (ref && ref.length >= 3 && ref.length <= 64) {
    const res =
      response instanceof NextResponse
        ? response
        : NextResponse.next({ request });

    res.cookies.set(REFERRAL_COOKIE, ref.toLowerCase().trim(), {
      maxAge: REFERRAL_COOKIE_MAX_AGE,
      path: "/",
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
