import type { Metadata } from "next";
import Link from "next/link";

import { PortfolioLaunchChecklist } from "@/components/resources/PortfolioLaunchChecklist";

const SITE_URL = "https://www.orixaai.me";
const PAGE_PATH = "/resources/portfolio-launch-checklist";
const TITLE = "Free Portfolio Launch Checklist";
const DESCRIPTION =
  "Use this free, printable portfolio checklist to review project content, accessibility, contact links, search metadata, sharing previews, and analytics before you publish.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    type: "website",
    url: `${SITE_URL}${PAGE_PATH}`,
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

export default function PortfolioLaunchChecklistPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}${PAGE_PATH}`,
    isPartOf: {
      "@type": "WebSite",
      name: "OrixaAI",
      url: SITE_URL,
    },
    audience: {
      "@type": "Audience",
      audienceType: "Developers, designers, students, and professionals publishing a portfolio",
    },
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <div className="mx-auto max-w-5xl px-5 pb-20 pt-10 sm:px-6 sm:pt-16">
        <Link
          href="/blog"
          className="inline-flex min-h-10 items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground print:hidden"
        >
          <span aria-hidden="true">←</span> Back to portfolio guides
        </Link>

        <header className="mx-auto mb-10 mt-8 max-w-3xl sm:mb-14">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent print:text-black">
            Free resource · No account required
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.06] tracking-tight text-foreground sm:text-5xl md:text-6xl print:text-black">
            The portfolio launch checklist
          </h1>
          <p className="mt-5 text-lg leading-7 text-muted-foreground sm:text-xl sm:leading-8 print:text-black">
            Review the details that are easy to miss before sharing your portfolio: accurate project stories, working contact links, accessibility, search basics, and measurement.
          </p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground print:text-black">
            This is a general checklist for portfolios built with any tool or with code. Tick each item as you verify it on the actual public site; checking a box does not automatically test the site for you.
          </p>
        </header>

        <PortfolioLaunchChecklist />

        <section className="mt-12 rounded-2xl border border-border bg-surface p-6 sm:p-8 print:hidden">
          <p className="text-sm font-medium text-accent">Want a guided workflow?</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Build, review, then publish.
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
            OrixaAI helps you organize resume or manually entered details into a shareable portfolio. Review the available workflow and features before deciding whether it is a fit.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/developer-portfolio-builder"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border px-5 text-sm font-medium text-foreground transition hover:border-primary"
            >
              Explore the portfolio builder
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover"
            >
              Get started
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
