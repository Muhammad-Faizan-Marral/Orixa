export function normalizeTrafficSource(referrer?: string | null): string {
  if (!referrer || !referrer.trim()) return "Direct";

  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "").toLowerCase();

    if (host.includes("linkedin.")) return "LinkedIn";
    if (host.includes("twitter.") || host.includes("x.com")) return "X / Twitter";
    if (host.includes("facebook.") || host.includes("fb.")) return "Facebook";
    if (host.includes("instagram.")) return "Instagram";
    if (host.includes("youtube.")) return "YouTube";
    if (host.includes("github.")) return "GitHub";
    if (host.includes("google.") || host.includes("goo.gl")) return "Google";
    if (host.includes("bing.")) return "Bing";
    if (host.includes("reddit.")) return "Reddit";
    if (host.includes("producthunt.")) return "Product Hunt";
    if (host.includes("localhost") || host.includes("orixa.")) return "Orixa";

    return host;
  } catch {
    return "Other";
  }
}