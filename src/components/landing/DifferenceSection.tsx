"use client";

import Relic from "./game/Relic";

const ROWS = [
  {
    from: "Generic website builders",
    to: "Built only for portfolios — projects, skills, experience",
  },
  {
    from: "Starting from a blank page",
    to: "Resume upload → structured portfolio in minutes",
  },
  {
    from: "Guessing which design works",
    to: "Design Lab: preview free & premium themes before publishing",
  },
  {
    from: "No idea if anyone sees your work",
    to: "Analytics + direct contact form so people can reach you",
  },
];

export default function DifferenceSection() {
  return (
    <section className="relative bg-surface py-24 [clip-path:polygon(0_2.5rem,100%_0,100%_100%,0_100%)] md:py-36">
      {/* Background effects */}
      <div className="bg-aurora absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="bg-grain absolute inset-0 opacity-40" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-6xl gap-14 px-5 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
        {/* Left column — Text */}
        <div className="max-w-md">
          <p className="mb-3 text-sm font-medium tracking-wide text-muted-foreground">
            Why OrixaAI
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[2.75rem] md:leading-[1.15]">
            Not another{" "}
            <span className="bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground bg-clip-text text-transparent">
              website builder.
            </span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Most tools help you make a site. OrixaAI helps you get noticed —
            with the right structure, design, and a way for people to contact you.
          </p>
        </div>

        {/* Right column — Comparison table */}
        <div className="space-y-3">
          <div
            role="table"
            aria-label="What changes with OrixaAI"
            className="space-y-2.5"
          >
            {/* Header */}
            <div
              role="row"
              className="grid grid-cols-[1fr_1.55fr] gap-5 px-5 text-xs font-medium uppercase tracking-wider text-muted-foreground/80"
            >
              <span role="columnheader">Instead of</span>
              <span role="columnheader">OrixaAI gives you</span>
            </div>

            {/* Rows */}
            {ROWS.map((r) => (
              <div
                role="row"
                key={r.from}
                className="grid grid-cols-[1fr_1.55fr] gap-5 rounded-xl border border-border/60 bg-background/40 px-5 py-4 transition-all duration-200 hover:border-primary/40 hover:bg-background/60"
              >
                <span
                  role="cell"
                  className="text-[15px] text-muted-foreground line-through decoration-error/60"
                >
                  {r.from}
                </span>
                <span role="cell" className="text-[15px] font-medium text-foreground">
                  {r.to}
                </span>
              </div>
            ))}
          </div>

          {/* Easter egg Relic */}
          <Relic
            id="decoder"
            label="A corrupted row, inspect it"
            className="relative grid w-full grid-cols-[1fr_1.55fr] gap-5 rounded-xl border border-dashed border-border-strong/70 px-5 py-4 text-left transition-all duration-200 hover:border-accent/70"
          >
            {({ solved }) => (
              <>
                <span
                  className={`font-mono text-[15px] ${
                    solved ? "text-success" : "anim-glitch text-error/70"
                  }`}
                  aria-hidden="true"
                >
                  {solved ? "restored" : "▒▒▒▒▒▒"}
                </span>
                <span
                  className={`font-mono text-[15px] ${
                    solved ? "text-muted-foreground" : "text-border-strong"
                  }`}
                  aria-hidden="true"
                >
                  {solved ? "signal recovered" : "▒▒▒ ▒▒▒▒▒▒▒▒ ▒▒"}
                </span>
              </>
            )}
          </Relic>
        </div>
      </div>
    </section>
  );
}