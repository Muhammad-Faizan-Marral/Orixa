import type { Metadata } from "next";

import { FeatureLandingPage } from "@/components/seo/feature-landing-page";
import { SEO_LANDING_PAGES } from "@/content/seo-landing-pages";

const SITE_URL = "https://www.orixaai.me";
const PAGE_URL = "/portfolio-analytics";
const TITLE = "Portfolio Analytics for Your Website";
const DESCRIPTION = "Understand portfolio views and available traffic breakdowns, including sources, countries, devices, and project engagement.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: `${SITE_URL}${PAGE_URL}`,
    title: `${TITLE} | OrixaAI`,
    description: DESCRIPTION,
    siteName: "OrixaAI",
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | OrixaAI`,
    description: DESCRIPTION,
  },
};

export default function Page() {
  return <FeatureLandingPage data={SEO_LANDING_PAGES["portfolio-analytics"]} />;
}
