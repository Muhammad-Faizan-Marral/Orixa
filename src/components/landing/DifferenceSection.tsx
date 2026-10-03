"use client";

import Relic from "./game/Relic";

const ROWS = [
  { from: "Random pages", to: "Projects, experience & skills, built around your work" },
  { from: "A blank canvas", to: "Resume parsing + guided sections" },
  { from: "Guessing at themes", to: "Design Lab: preview free & premium themes first" },
  { from: "Locked-in content", to: "Your content stays yours. Edit and republish anytime." },
];

export default function DifferenceSection() {
  return (
    <section className="relative bg-surface py-24 [clip-path:polygon(0_2.5rem,100%_0,100%_100%,0_100%)] md:py-36">
      <div className="bg-aurora absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="bg-grain absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-[.8fr_1.2fr]">
        <div>
          <p className="text-caption mb-3">Why OrixaAI</p>
          <h2 className="text-h1 text-balance">Not another <span className="text-gradient-ion">generic website generator.</span></h2>
          <p className="text-body-lg mt-4">OrixaAI is focused on one thing: helping you present your work.</p>
        </div>

        <div role="table" aria-label="What changes with OrixaAI" className="space-y-3">
          <div role="row" className="text-caption grid grid-cols-[1fr_1.6fr] gap-4 px-4">
            <span role="columnheader">Instead of</span><span role="columnheader">OrixaAI gives you</span>
          </div>
          {ROWS.map((r) => (
            <div role="row" key={r.from} className="surface-panel grid grid-cols-[1fr_1.6fr] gap-4 p-4 transition hover:border-primary/60">
              <span role="cell" className="text-muted-foreground line-through decoration-error/70">{r.from}</span>
              <span role="cell" className="font-medium">{r.to}</span>
            </div>
          ))}
          <Relic id="decoder" label="A corrupted row, inspect it" className="relative grid w-full grid-cols-[1fr_1.6fr] gap-4 rounded-lg border border-dashed border-border-strong p-4 text-left transition hover:border-accent">
            {({ solved }) => (
              <>
                <span className={`font-mono ${solved ? "text-success" : "anim-glitch text-error/70"}`} aria-hidden="true">{solved ? "restored" : "▒▒▒▒▒▒"}</span>
                <span className={`font-mono ${solved ? "text-muted-foreground" : "text-border-strong"}`} aria-hidden="true">{solved ? "signal recovered" : "▒▒▒ ▒▒▒▒▒▒▒▒ ▒▒"}</span>
              </>
            )}
          </Relic>
        </div>
      </div>
    </section>
  );
}
