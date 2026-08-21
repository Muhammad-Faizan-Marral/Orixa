"use server";

import { headers } from "next/headers";

import { portfolioViewService } from "@/services/portfolio/portfolio-view.service";

type RecordPortfolioViewInput = {
  portfolioId: string;
  country?: string | null;
  city?: string | null;
};

export async function recordPortfolioView(input: RecordPortfolioViewInput) {
  try {
    const requestHeaders = await headers();

    const userAgent = requestHeaders.get("user-agent");

    const referrer = requestHeaders.get("referer");

    const forwardedFor = requestHeaders.get("x-forwarded-for");

    const realIp = requestHeaders.get("x-real-ip");

    const ip = forwardedFor?.split(",")[0]?.trim() || realIp || null;

    const browser = getBrowser(userAgent);

    const device = getDevice(userAgent);

    const os = getOperatingSystem(userAgent);

    await portfolioViewService.recordView({
      portfolioId: input.portfolioId,
      country: input.country,
      city: input.city,
      browser,
      device,
      os,
      referrer,
      ip,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("recordPortfolioView:", error);

    // Analytics failure should never break
    // the public portfolio.
    return {
      success: false,
    };
  }
}

function getBrowser(userAgent: string | null) {
  if (!userAgent) return null;

  if (/edg/i.test(userAgent)) return "Edge";

  if (/chrome/i.test(userAgent)) return "Chrome";

  if (/firefox/i.test(userAgent)) return "Firefox";

  if (/safari/i.test(userAgent)) return "Safari";

  if (/opera|opr/i.test(userAgent)) return "Opera";

  return "Other";
}

function getDevice(userAgent: string | null) {
  if (!userAgent) return null;

  if (/mobile/i.test(userAgent)) return "Mobile";

  if (/tablet|ipad/i.test(userAgent)) return "Tablet";

  return "Desktop";
}

function getOperatingSystem(userAgent: string | null) {
  if (!userAgent) return null;

  if (/windows/i.test(userAgent)) return "Windows";

  if (/android/i.test(userAgent)) return "Android";

  if (/iphone|ipad|ios/i.test(userAgent)) return "iOS";

  if (/mac os/i.test(userAgent)) return "macOS";

  if (/linux/i.test(userAgent)) return "Linux";

  return "Other";
}
