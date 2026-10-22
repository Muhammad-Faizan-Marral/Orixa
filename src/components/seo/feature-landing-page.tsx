import Link from "next/link";

import type { SeoLandingPageData } from "@/content/seo-landing-pages";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { CookieNotice } from "@/components/legal/legal-notices";
import "@/components/landing/landing.css";

const SITE_URL = "https://www.orixaai.me";

const RELATED_PAGES = [
  {
    href: "/portfolio-builder",
    title: "Portfolio builder",
    description: "Create a portfolio website from your resume or professional details.",
  },
  {
    href: "/developer-portfolio-builder",
    title: "Developer portfolio builder",
    description: "Present projects, skills, experience, and profile links.",
  },
  {
    href: "/resume-to-portfolio",
    title: "Resume to portfolio",
    description: "Use your resume as a starting point for a public portfolio.",
  },
  {
    href: "/ats-resume-builder",
    title: "ATS-friendly resume builder",
    description: "Create a PDF resume from your portfolio form details.",
  },
  {
    href: "/portfolio-analytics",
    title: "Portfolio analytics",
    description: "Understand views and available traffic breakdowns.",
  },
  {
    href: "/portfolio-templates",
    title: "Portfolio designs and templates",
    description: "Compare visual directions for your portfolio.",
  },
];

export function FeatureLandingPage({ data }: { data: SeoLandingPageData }) {
  const pageUrl = `${SITE_URL}/${data.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: data.title,
        description: data.description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#software` },
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: data.title,
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <main>
        <section className="relative isolate overflow-hidden border-b border-border">
          <div className="bg-aurora absolute inset-0 -z-20" aria-hidden="true" />
          <div className="bg-grain absolute inset-0 -z-10" aria-hidden="true" />
          <div className="mx-auto max-w-6xl px-5 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-24 lg:pb-24">
            <div className="max-w-4xl">
              <p className="text-caption mb-5 inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/70 px-3.5 py-1.5 backdrop-blur">
                <span className="anim-beacon h-1.5 w-1.5 rounded-full bg-gradient-ion" aria-hidden="true" />
                {data.eyebrow}
              </p>
              <h1 className="text-balance text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl lg:text-7xl">
                {data.title}
              </h1>
              <p className="text-body-lg mt-6 max-w-3xl text-muted-foreground sm:text-xl">
                {data.description}
              </p>
              <p className="mt-4 max-w-2xl leading-7 text-foreground/80">
                {data.promise}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/auth/signup" className="btn btn-ion w-full sm:w-auto">
                  Build your portfolio free
                </Link>
                <Link href="/pricing" className="btn btn-ghost w-full sm:w-auto">
                  Compare plans
                </Link>
              </div>
              <p className="text-caption mt-4">
                Review your details before publishing. Features and plan limits are described on the product and pricing pages.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {data.outcomes.map((outcome, index) => (
                <article
                  key={outcome.title}
                  className="relative rounded-2xl border border-border bg-surface/75 p-5 shadow-sm backdrop-blur sm:p-6"
                >
                  <p className="font-mono text-xs tracking-[0.18em] text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-4 text-lg font-semibold tracking-tight sm:text-xl">
                    {outcome.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {outcome.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-caption mb-3">Built around the workflow</p>
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Useful features, connected in one portfolio workflow
            </h2>
            <p className="text-body-lg mt-4 text-muted-foreground">
              Start with your information, shape how it is presented, and make the published portfolio useful to the people viewing it.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {data.sections.map((section, index) => (
              <article
                key={section.title}
                className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
              >
                <p className="text-caption text-accent">{section.eyebrow}</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                  {section.title}
                </h3>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {section.description}
                </p>
                <ul className="mt-5 space-y-3">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-sm leading-6">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 border-t border-border pt-4 font-mono text-xs text-muted-foreground">
                  OrixaAI · {String(index + 1).padStart(2, "0")}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-surface/45">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
            <div className="max-w-2xl">
              <p className="text-caption mb-3">Three steps</p>
              <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                From your details to a shareable portfolio
              </h2>
            </div>
            <ol className="mt-9 grid gap-4 md:grid-cols-3">
              {data.steps.map((step, index) => (
                <li key={step.title} className="rounded-2xl border border-border bg-background p-6">
                  <p className="font-mono text-sm text-accent">STEP {index + 1}</p>
                  <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-5 py-16 sm:px-6 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-caption mb-3">Frequently asked questions</p>
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Answers before you get started
            </h2>
          </div>
          <div className="mt-8 divide-y divide-border border-y border-border">
            {data.faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium [&::-webkit-details-marker]:hidden">
                  <span>{faq.question}</span>
                  <span className="text-xl text-accent transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-6 sm:pb-24">
          <div className="rounded-3xl border border-border bg-surface p-7 sm:p-10">
            <div className="max-w-2xl">
              <p className="text-caption text-accent">Explore OrixaAI</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                Find the part of the workflow you need
              </h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                Learn about the other tools and workflows that connect your portfolio, resume, design, and performance reporting.
              </p>
            </div>
            <nav aria-label="Related OrixaAI features" className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {RELATED_PAGES.filter((page) => page.href !== `/${data.slug}`).map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className="rounded-xl border border-border bg-background p-4 transition hover:border-accent/70 hover:bg-surface-2"
                >
                  <span className="font-medium">{page.title}</span>
                  <span className="mt-1 block text-sm leading-5 text-muted-foreground">{page.description}</span>
                </Link>
              ))}
              <Link href="/blog" className="rounded-xl border border-border bg-background p-4 transition hover:border-accent/70 hover:bg-surface-2">
                <span className="font-medium">Portfolio guides</span>
                <span className="mt-1 block text-sm leading-5 text-muted-foreground">Practical advice for presenting projects and experience.</span>
              </Link>
            </nav>
          </div>
        </section>

        <section className="relative isolate overflow-hidden border-t border-border py-16 sm:py-20">
          <div className="bg-aurora absolute inset-0 -z-10" aria-hidden="true" />
          <div className="mx-auto max-w-3xl px-5 text-center sm:px-6">
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
              Give your work a place people can explore.
            </h2>
            <p className="text-body-lg mx-auto mt-4 max-w-2xl text-muted-foreground">
              Start with your resume or details, make the presentation yours, and publish when you are ready.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/auth/signup" className="btn btn-ion w-full sm:w-auto">Create your portfolio</Link>
              <Link href="/pricing" className="btn btn-ghost w-full sm:w-auto">View pricing</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <CookieNotice />
    </div>
  );
}
