import type { MetadataRoute } from "next";

const SITE_URL = "https://www.orixaai.me";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // API endpoints are not useful search results. Private app pages use
      // noindex metadata and remain protected by authentication separately.
      disallow: ["/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
