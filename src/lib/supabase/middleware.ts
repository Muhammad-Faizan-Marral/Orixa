import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { publicPageCacheHeaders } from "@/lib/cache/portfolio-public";

const PROTECTED_PREFIXES = ["/dashboard", "/onboarding"];
const GUEST_ONLY_PREFIXES = [
  "/auth/login",
  "/auth/signup",
  "/auth/forgot-password",
  "/auth/reset-password",
];

const NO_CACHE_PREFIXES = [
  "/dashboard",
  "/onboarding",
  "/auth",
  "/api",
];

const RESERVED_FIRST_SEGMENTS = new Set([
  "dashboard",
  "onboarding",
  "auth",
  "api",
  "login",
  "signup",
  "_next",
  "favicon.ico",
]);

function isPublicContentPath(pathname: string): boolean {
  if (pathname === "/" || pathname === "") return false;
  if (
    NO_CACHE_PREFIXES.some(
      (p) => pathname === p || pathname.startsWith(p + "/"),
    )
  ) {
    return false;
  }
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return false;
  if (RESERVED_FIRST_SEGMENTS.has(parts[0]!)) return false;
  return parts.length >= 1 && parts.length <= 3;
}

function applyPublicCacheHeaders(response: NextResponse) {
  const headers = publicPageCacheHeaders();
  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }
  return response;
}

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Auth code on wrong path → /auth/callback
  const code = request.nextUrl.searchParams.get("code");
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  if ((code || tokenHash) && !pathname.startsWith("/auth/callback")) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/callback";
    if (!url.searchParams.get("next")) {
      url.searchParams.set("next", "/dashboard");
    }
    return NextResponse.redirect(url);
  }

  if (isPublicContentPath(pathname)) {
    const response = NextResponse.next({ request });
    return applyPublicCacheHeaders(response);
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
  const isGuestOnly = GUEST_ONLY_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isGuestOnly && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  supabaseResponse.headers.set(
    "Cache-Control",
    "private, no-store, max-age=0, must-revalidate",
  );

  return supabaseResponse;
}