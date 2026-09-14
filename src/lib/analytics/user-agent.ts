/**
 * Shared User-Agent parsers for analytics.
 * Used by /api/analytics/view and server actions.
 */

export type ParsedUserAgent = {
  browser: string;
  device: string;
  os: string;
};

/** Normalize null/empty to a safe label for storage + UI */
function label(value: string | null | undefined, fallback: string): string {
  const v = (value ?? "").trim();
  return v.length > 0 ? v : fallback;
}

export function getBrowser(userAgent: string | null | undefined): string {
  if (!userAgent) return "Unknown";
  const ua = userAgent;

  // Order matters — more specific first
  if (/edg(?:e|a|ios)?\//i.test(ua)) return "Edge";
  if (/opr\//i.test(ua) || /opera/i.test(ua)) return "Opera";
  if (/samsungbrowser\//i.test(ua)) return "Samsung Internet";
  if (/ucbrowser\//i.test(ua)) return "UC Browser";
  if (/brave/i.test(ua)) return "Brave";
  if (/vivaldi\//i.test(ua)) return "Vivaldi";
  if (/firefox\/\d/i.test(ua) || /fxios\//i.test(ua)) return "Firefox";
  if (/crios\//i.test(ua)) return "Chrome"; // iOS Chrome
  if (/chrome\/\d/i.test(ua) && !/chromium/i.test(ua)) return "Chrome";
  if (/chromium\//i.test(ua)) return "Chromium";
  if (/safari\/\d/i.test(ua) && !/chrome|crios|chromium/i.test(ua))
    return "Safari";
  if (/msie\s|trident\//i.test(ua)) return "Internet Explorer";

  return "Other";
}

export function getDevice(userAgent: string | null | undefined): string {
  if (!userAgent) return "Unknown";
  const ua = userAgent;

  // iPadOS 13+ may report as Macintosh — check for touch + Mac
  if (
    /ipad/i.test(ua) ||
    /tablet/i.test(ua) ||
    (/android/i.test(ua) && !/mobile/i.test(ua))
  ) {
    return "Tablet";
  }

  if (
    /iphone|ipod|android.*mobile|windows phone|mobile|blackberry|opera mini|iemobile/i.test(
      ua,
    )
  ) {
    return "Mobile";
  }

  return "Desktop";
}

export function getOperatingSystem(
  userAgent: string | null | undefined,
): string {
  if (!userAgent) return "Unknown";
  const ua = userAgent;

  if (/windows nt|win64|win32|windows/i.test(ua)) return "Windows";
  if (/android/i.test(ua)) return "Android";
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  // iPadOS 13+ desktop UA still has Mac — leave as macOS if no iPhone/iPad token
  if (/mac os x|macintosh/i.test(ua)) return "macOS";
  if (/cros/i.test(ua)) return "Chrome OS";
  if (/linux/i.test(ua)) return "Linux";

  return "Other";
}

export function parseUserAgent(
  userAgent: string | null | undefined,
): ParsedUserAgent {
  return {
    browser: label(getBrowser(userAgent), "Unknown"),
    device: label(getDevice(userAgent), "Unknown"),
    os: label(getOperatingSystem(userAgent), "Unknown"),
  };
}
