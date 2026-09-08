"use server";

import { headers } from "next/headers";

import { portfolioViewService } from "@/services/portfolio/portfolio-view.service";

type RecordPortfolioViewInput = {
  portfolioId: string;
  /** Client se bheji gayi country (optional override) */
  country?: string | null;
  /** Client se bheji gayi city (optional override) */
  city?: string | null;
};

export async function recordPortfolioView(input: RecordPortfolioViewInput) {
  try {
    const requestHeaders = await headers();

    // ── Basic request metadata ────────────────────────────────────────────
    const userAgent = requestHeaders.get("user-agent");
    const referrer = requestHeaders.get("referer");

    // Real IP: x-forwarded-for ka pehla entry sabse reliable hota hai
    const forwardedFor = requestHeaders.get("x-forwarded-for");
    const realIp = requestHeaders.get("x-real-ip");
    const ip = forwardedFor?.split(",")[0]?.trim() || realIp || null;

    const browser = getBrowser(userAgent);
    const device = getDevice(userAgent);
    const os = getOperatingSystem(userAgent);

    // ── Geo resolution (priority order) ──────────────────────────────────
    //
    // Priority:
    //   1. Client-side override (input.country / input.city)
    //   2. Cloudflare headers       → cf-ipcountry / cf-ipcity
    //   3. Vercel edge headers      → x-vercel-ip-country / x-vercel-ip-city
    //      (sirf Vercel production/preview pe available hote hain)
    //   4. IP geolocation fallback  → ip-api.com (localhost + missing headers)

    // Cloudflare city header
    const cfCity = requestHeaders.get("cf-ipcity");

    // Vercel city header URL-encoded hoti hai — decode karna zaroori hai
    const vercelCityRaw = requestHeaders.get("x-vercel-ip-city");
    const vercelCity = vercelCityRaw ? decodeURIComponent(vercelCityRaw) : null;

    let country: string | null =
      input.country ??
      requestHeaders.get("cf-ipcountry") ?? // Cloudflare
      requestHeaders.get("x-vercel-ip-country") ?? // Vercel
      null;

    let city: string | null =
      input.city ??
      cfCity ?? // Cloudflare
      vercelCity ?? // Vercel
      null;

    // ── IP Geolocation fallback ───────────────────────────────────────────
    // Yeh tab chalega jab:
    //   - country ya city kisi bhi header se nahi mili
    //   - IP valid ho (localhost exclude nahi kiya — localhost pe bhi try karta hai)
    if ((!country || !city) && ip) {
      const isLocalhost =
        ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.");

      if (isLocalhost) {
        // Localhost pe public IP se geo lookup — development ke liye
        const geo = await lookupGeoFromPublicIp();
        if (geo) {
          country = country || geo.country;
          city = city || geo.city;
        }
      } else {
        // Production: real IP se lookup
        const geo = await lookupGeoFromIp(ip);
        if (geo) {
          country = country || geo.country;
          city = city || geo.city;
        }
      }
    }

    await portfolioViewService.recordView({
      portfolioId: input.portfolioId,
      country,
      city,
      browser,
      device,
      os,
      referrer,
      ip,
    });

    return { success: true };
  } catch (error) {
    console.error("recordPortfolioView:", error);
    return { success: false };
  }
}

// ── Geo helpers ─────────────────────────────────────────────────────────────

type GeoResult = { country: string | null; city: string | null };

/**
 * Kisi bhi IP ke liye ip-api.com se geo lookup.
 * Free tier: ~45 req/min, HTTPS ke liye paid plan chahiye.
 */
async function lookupGeoFromIp(ip: string): Promise<GeoResult | null> {
  try {
    const url = `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,countryCode,city`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });

    if (!res.ok) return null;

    const data = (await res.json()) as {
      status?: string;
      country?: string;
      countryCode?: string;
      city?: string;
    };

    if (data.status !== "success") return null;

    return {
      country: data.countryCode || data.country || null,
      city: data.city || null,
    };
  } catch {
    return null;
  }
}

/**
 * Localhost development ke liye:
 * Pehle apna public IP pata karo, phir us IP ka geo lookup karo.
 * Yeh sirf development mein useful hai — production mein kabhi nahi aayega.
 */
async function lookupGeoFromPublicIp(): Promise<GeoResult | null> {
  try {
    // Step 1: Public IP pata karo
    const ipRes = await fetch("https://api.ipify.org?format=json", {
      signal: AbortSignal.timeout(3000),
    });

    if (!ipRes.ok) return null;

    const { ip } = (await ipRes.json()) as { ip: string };
    if (!ip) return null;

    // Step 2: Us IP ka geo lookup
    return await lookupGeoFromIp(ip);
  } catch {
    return null;
  }
}

// ── User-Agent parsers ───────────────────────────────────────────────────────

function getBrowser(userAgent: string | null): string | null {
  if (!userAgent) return null;
  // Edge ko Chrome se pehle check karo (Edge mein "Chrome" bhi hota hai UA mein)
  if (/edg\//i.test(userAgent)) return "Edge";
  if (/opr\//i.test(userAgent) || /opera/i.test(userAgent)) return "Opera";
  if (/chrome\/\d/i.test(userAgent)) return "Chrome";
  if (/firefox\/\d/i.test(userAgent)) return "Firefox";
  // Safari ko Chrome ke baad check karo (Chrome UA mein "Safari" bhi hota hai)
  if (/safari\/\d/i.test(userAgent)) return "Safari";
  return "Other";
}

function getDevice(userAgent: string | null): string | null {
  if (!userAgent) return null;
  if (/tablet|ipad/i.test(userAgent)) return "Tablet";
  if (/mobile/i.test(userAgent)) return "Mobile";
  return "Desktop";
}

function getOperatingSystem(userAgent: string | null): string | null {
  if (!userAgent) return null;
  if (/windows/i.test(userAgent)) return "Windows";
  if (/android/i.test(userAgent)) return "Android";
  if (/iphone|ipad|ios/i.test(userAgent)) return "iOS";
  if (/mac os x/i.test(userAgent)) return "macOS";
  if (/linux/i.test(userAgent)) return "Linux";
  return "Other";
}
