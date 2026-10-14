import type { MetadataRoute } from "next";

const SITE_URL = "https://www.orixaai.me";

const publicSearchRules = {
  allow: "/",
  // API endpoints are not useful public search results. Authentication and
  // dashboard content is also protected by application auth and noindex.
  disallow: ["/api/"],
};

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        ...publicSearchRules,
      },
      // These search crawlers are explicitly allowed to discover public pages.
      // This does not guarantee citation or recommendation by their products.
      {
        userAgent: "OAI-SearchBot",
        ...publicSearchRules,
      },
      {
        userAgent: "ChatGPT-User",
        ...publicSearchRules,
      },
      {
        userAgent: "Claude-SearchBot",
        ...publicSearchRules,
      },
      {
        userAgent: "PerplexityBot",
        ...publicSearchRules,
      },
      {
        userAgent: "bingbot",
        ...publicSearchRules,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
