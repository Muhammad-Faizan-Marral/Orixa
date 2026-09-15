import { NextRequest, NextResponse } from "next/server";

import { portfolioViewService } from "@/services/portfolio/portfolio-view.service";
import { parseUserAgent } from "@/lib/analytics/user-agent";
import { normalizeTrafficSource } from "@/lib/analytics/referrer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const portfolioId = body?.portfolioId;

    if (!portfolioId || typeof portfolioId !== "string") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const userAgent =
      (typeof body?.userAgent === "string" && body.userAgent) ||
      req.headers.get("user-agent") ||
      null;

    const fromUa = parseUserAgent(userAgent);

    // Client-parsed values win when present (fixes Unknown)
    const browser =
      (typeof body?.browser === "string" && body.browser.trim()) ||
      fromUa.browser;
    const device =
      (typeof body?.device === "string" && body.device.trim()) || fromUa.device;
    const os = (typeof body?.os === "string" && body.os.trim()) || fromUa.os;

    const rawReferrer = req.headers.get("referer");
    const referrer = rawReferrer
      ? normalizeTrafficSource(rawReferrer)
      : "Direct";

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      null;

    const country =
      req.headers.get("cf-ipcountry") ||
      req.headers.get("x-vercel-ip-country") ||
      null;

    const cityRaw =
      req.headers.get("cf-ipcity") || req.headers.get("x-vercel-ip-city");
    const city = cityRaw ? decodeURIComponent(cityRaw) : null;

    await portfolioViewService.recordView({
      portfolioId,
      userAgent,
      browser,
      device,
      os,
      referrer,
      ip,
      country,
      city,
    });

    return NextResponse.json({ ok: true, browser, device, os });
  } catch (error) {
    console.error("[analytics/view]", error);
    return NextResponse.json({ ok: false });
  }
}
