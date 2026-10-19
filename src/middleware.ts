import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { REFERRAL_COOKIE, REFERRAL_COOKIE_MAX_AGE } from "@/lib/referral";
import { isAppHost, normalizeDomain } from "@/lib/domain";

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
  const hostHeader = request.headers.get("host") || "";
  const host = normalizeDomain(hostHeader);

  // Custom domain → resolve → rewrite to /username/slug (analytics same portfolioId)
  if (host && !isAppHost(host)) {
    try {
      const origin =
        process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
        request.nextUrl.origin;

      const res = await fetch(
        `${origin}/api/internal/resolve-domain?host=${encodeURIComponent(host)}`,
        { headers: { "x-middleware-domain-resolve": "1" }, cache: "no-store" },
      );

      if (res.ok) {
        const data = (await res.json()) as {
          found: boolean;
          active?: boolean;
          username?: string;
          slug?: string;
        };

        if (data.found && data.username && data.slug) {
          if (!data.active) {
            // Premium ended / suspended → default Orixa URL
            const root =
              process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
              "https://www.orixaai.me";
            return NextResponse.redirect(
              `${root}/${data.username}/${data.slug}`,
              307,
            );
          }

          const url = request.nextUrl.clone();
          url.pathname = `/${data.username}/${data.slug}${
            request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname
          }`;
          return NextResponse.rewrite(url);
        }
      }
    } catch (e) {
      console.error("[middleware] domain resolve failed", e);
    }
  }

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
    "/((?!_next/static|_next/image|favicon.ico|api/internal/resolve-domain|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
