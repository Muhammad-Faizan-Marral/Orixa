import type { Metadata } from "next";
import "@/components/landing/landing.css";

import dynamic from "next/dynamic";

import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import DeferredGameRoot from "@/components/landing/DeferredGameRoot";
// Server components (no client JS): static imports. next/dynamic around them only added chunk indirection.
import DesignLabSection from "@/components/landing/Designlabsection";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import { CookieNotice } from "@/components/legal/legal-notices";
import { BILLING } from "@/constants/billing";

// Client sections stay code-split.
const PillarsSection = dynamic(
  () => import("@/components/landing/PillarsSection"),
  { loading: () => null },
);
const WorkflowSection = dynamic(
  () => import("@/components/landing/WorkflowSection"),
  { loading: () => null },
);
const DifferenceSection = dynamic(
  () => import("@/components/landing/DifferenceSection"),
  { loading: () => null },
);
const FeaturesSection = dynamic(
  () => import("@/components/landing/FeaturesSection"),
  { loading: () => null },
);
const PricingSection = dynamic(
  () => import("@/components/landing/PricingSection"),
  { loading: () => null },
);
const FAQSection = dynamic(() => import("@/components/landing/FAQSection"), {
  loading: () => null,
});

const HOME_TITLE = "Orixa AI | AI Portfolio Builder";
const HOME_DESCRIPTION =
  "Orixa AI is an AI-assisted portfolio builder for developers, designers, and professionals. Start with your resume or details, customize your portfolio, and share one professional link.";

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  keywords: [
    "Orixa AI",
    "OrixaAI",
    "AI portfolio builder",
    "portfolio builder",
    "online portfolio builder",
    "portfolio website builder",
    "resume to portfolio",
    "developer portfolio builder",
    "designer portfolio builder",
    "portfolio analytics",
    "ATS-friendly resume builder",
  ],
  openGraph: {
    type: "website",
    url: "https://www.orixaai.me",
    siteName: "Orixa AI",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [
      {
        url: "/logowithBGandText.png",
        alt: "Orixa AI — AI portfolio builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: ["/logowithBGandText.png"],
  },
};

const SITE_URL = "https://www.orixaai.me";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Orixa AI",
      alternateName: ["OrixaAI"],
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/justLogoWihoutText.png`,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Orixa AI",
      alternateName: "OrixaAI",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: "Orixa AI",
      alternateName: "OrixaAI",
      url: SITE_URL,
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      description:
        "An AI-assisted portfolio builder for creating and publishing professional portfolios, generating ATS-friendly resumes, tracking portfolio visits, and receiving direct contact messages.",
      featureList: [
        "AI-assisted portfolio creation",
        "Resume upload and parsing",
        "ATS-friendly resume generation",
        "Portfolio visitor analytics",
        "Direct visitor-to-owner contact messages",
        "Customizable portfolio designs",
      ],
      offers: [
        {
          "@type": "Offer",
          name: "Free",
          price: "0",
          priceCurrency: "USD",
          url: `${SITE_URL}/pricing`,
        },
        {
          "@type": "Offer",
          name: "Premium Monthly",
          price: String(BILLING.PRICE_MONTHLY),
          priceCurrency: "USD",
          url: `${SITE_URL}/pricing`,
        },
        {
          "@type": "Offer",
          name: "Premium Yearly",
          price: String(BILLING.PRICE_YEARLY),
          priceCurrency: "USD",
          url: `${SITE_URL}/pricing`,
        },
      ],
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <div
        className="relative overflow-x-clip bg-background text-foreground"
        style={{ ["--font-display" as string]: "var(--font-dm), sans-serif" }}
      >
        <Navbar />
        <main>
          <HeroSection />
          <PillarsSection />
          <div id="how">
            <WorkflowSection />
          </div>
          <DifferenceSection />
          <div id="features">
            <FeaturesSection />
            <div id="samplework">
              <DesignLabSection />
            </div>
          </div>
          <PricingSection />
          <FAQSection />
          <FinalCTA />
        </main>
        <Footer />
        <DeferredGameRoot />
        <CookieNotice />
      </div>
    </>
  );
}
