import { NextRequest, NextResponse } from "next/server";
import { portfolioViewService } from "@/services/portfolio/portfolio-view.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const portfolioId = body?.portfolioId;

    if (!portfolioId || typeof portfolioId !== "string") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Fire and forget style – errors ko silently handle karo
    await portfolioViewService.recordView({
      portfolioId,
      userAgent: req.headers.get("user-agent"),
      referrer: req.headers.get("referer"),
      ip:
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        null,
      country:
        req.headers.get("cf-ipcountry") ||
        req.headers.get("x-vercel-ip-country") ||
        null,
      city:
        req.headers.get("cf-ipcity") ||
        (req.headers.get("x-vercel-ip-city")
          ? decodeURIComponent(req.headers.get("x-vercel-ip-city")!)
          : null),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[analytics/view]", error);
    // Always return 200 so client never retries aggressively
    return NextResponse.json({ ok: false });
  }
}
