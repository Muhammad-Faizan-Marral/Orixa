import type { Metadata } from "next";

import { FeatureLandingPage } from "@/components/seo/feature-landing-page";
import { SEO_LANDING_PAGES } from "@/content/seo-landing-pages";

const SITE_URL = "https://www.orixaai.me";
const PAGE_URL = "/resume-to-portfolio";
const TITLE = "Resume to Portfolio Builder";
const DESCRIPTION = "Turn your resume into a portfolio website. Upload a PDF or enter details manually, then review, customize, and publish your work.";

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
  return <FeatureLandingPage data={SEO_LANDING_PAGES["resume-to-portfolio"]} />;
}
