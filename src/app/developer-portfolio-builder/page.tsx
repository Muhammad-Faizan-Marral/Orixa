import type { Metadata } from "next";

import { FeatureLandingPage } from "@/components/seo/feature-landing-page";
import { SEO_LANDING_PAGES } from "@/content/seo-landing-pages";

const SITE_URL = "https://www.orixaai.me";
const PAGE_URL = "/developer-portfolio-builder";
const TITLE = "Developer Portfolio Builder";
const DESCRIPTION = "Build a developer portfolio from your resume or details. Present projects, skills, experience, and contact options in one shareable website.";

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
  return <FeatureLandingPage data={SEO_LANDING_PAGES["developer-portfolio-builder"]} />;
}
