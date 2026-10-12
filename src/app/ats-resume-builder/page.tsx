import type { Metadata } from "next";

import { FeatureLandingPage } from "@/components/seo/feature-landing-page";
import { SEO_LANDING_PAGES } from "@/content/seo-landing-pages";

const SITE_URL = "https://www.orixaai.me";
const PAGE_URL = "/ats-resume-builder";
const TITLE = "ATS-Friendly Resume Builder";
const DESCRIPTION = "Create a clean PDF resume from your portfolio form details, or attach an existing resume. Review your information before applying.";

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
  return <FeatureLandingPage data={SEO_LANDING_PAGES["ats-resume-builder"]} />;
}
