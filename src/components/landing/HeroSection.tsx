"use client";

import Link from "next/link";

const TRUST = [
  "Free to start",
  "No credit card",
  "No design or coding skills",
];

export default function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-background py-17 sm:py-19 lg:py-20"
    >
      {/* Soft ambient glow */}
      <div
        className="absolute top-0 left-1/2 -z-10 h-[480px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-primary/12 via-foreground/5 to-transparent blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(var(--border-rgb),0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--border-rgb),0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_60%,transparent_100%)] pointer-events-none opacity-50"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        {/* Main Headline */}
        <h1
          id="hero-heading"
          className="mx-auto max-w-4xl text-balance text-[clamp(2.9rem,7.5vw,5.5rem)] font-bold tracking-[-0.045em] leading-[1.05] text-foreground"
        >
          Build a portfolio
          <span className="block mt-2 bg-gradient-to-r from-foreground via-foreground/85 to-muted-foreground bg-clip-text text-transparent">
            that gets you noticed.
          </span>
        </h1>

        {/* Supporting text — tighter & stronger */}
        <p className="mx-auto mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl sm:leading-8">
          Turn your resume into a polished professional portfolio with Orixa AI.
          Choose your design, showcase your work, and share your website in minutes.
        </p>

        {/* CTAs */}
        <div className="mt-12 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
          <Link
            href="/auth/signup"
            className="group relative inline-flex min-h-[54px] items-center justify-center gap-2.5 rounded-full bg-foreground px-9 py-3.5 text-sm font-semibold text-background shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.18)] transition-all duration-300 hover:opacity-90 hover:shadow-[0_10px_28px_-8px_rgba(0,0,0,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] sm:min-w-[15rem]"
          >
            <span>Create my portfolio</span>
            <svg
              viewBox="0 0 20 20"
              fill="none"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              <path
                d="M4.5 10h11m-4.5-4.5L15.5 10 11 14.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          <Link
            href="#pillars"
            className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-border-strong/60 bg-surface/40 px-8 py-3.5 text-sm font-medium text-foreground backdrop-blur-sm transition-all duration-200 hover:bg-surface hover:border-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-w-[13rem]"
          >
            See how it works
          </Link>
        </div>

        {/* Trust indicators — cleaner & tighter */}
        <ul className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground font-medium">
          {TRUST.map((item) => (
            <li key={item} className="flex items-center gap-2.5">
              <svg
                viewBox="0 0 16 16"
                className="h-4 w-4 shrink-0 text-success"
                aria-hidden="true"
              >
                <path
                  d="M3 8.5l3.2 3L13 4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}