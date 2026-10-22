import type { Metadata } from "next";

import { FeatureLandingPage } from "@/components/seo/feature-landing-page";
import { SEO_LANDING_PAGES } from "@/content/seo-landing-pages";

const SITE_URL = "https://www.orixaai.me";
const PAGE_URL = "/portfolio-builder";
const TITLE = "Portfolio Builder | Orixa AI";
const DESCRIPTION =
  "Build a professional portfolio website with Orixa AI. Start from your resume or details, customize the design, publish projects, and share one link.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: `${SITE_URL}${PAGE_URL}`,
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Orixa AI",
    images: [
      {
        url: "/logowithBGandText.png",
        alt: "Orixa AI portfolio builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/logowithBGandText.png"],
  },
};

export default function PortfolioBuilderPage() {
  return <FeatureLandingPage data={SEO_LANDING_PAGES["portfolio-builder"]} />;
}
