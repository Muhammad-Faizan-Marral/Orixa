/**
 * OrixaAI — Design Lab teaser (compact).
 * Short line + link to the Design Lab + 7 style chips (Server Component).
 * Each chip opens the Design Lab filtered to that style.
 */

import Link from "next/link";
import type { CSSProperties } from "react";

/** Internal route: works on previews/localhost too, and keeps visitors in the app. */
const DESIGN_LAB_PATH = "/design-lab";

type Style = { id: string; name: string; from: string; to: string };

const STYLES: Style[] = [
  { id: "minimal-airy", name: "Minimal Airy", from: "#f8fafc", to: "#2563eb" },
  { id: "tech-dense", name: "Tech Dense", from: "#07111c", to: "#22d3ee" },
  { id: "editorial", name: "Editorial", from: "#f4f0ea", to: "#b45309" },
  { id: "soft-luxury", name: "Soft Luxury", from: "#1a1520", to: "#d4af8c" },
  { id: "neo-glass", name: "Neo Glass", from: "#6c5cff", to: "#22d3ee" },
  { id: "brutalist", name: "Brutalist", from: "#facc15", to: "#000000" },
  { id: "cinematic", name: "Cinematic", from: "#07060b", to: "#fb7185" },
];

export default function DesignLabSection() {
  return (
    <section id="design-lab" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="dl-card relative overflow-hidden rounded-2xl border border-border/60 bg-surface/60 px-6 py-12 shadow-sm backdrop-blur-sm sm:px-10 sm:py-14 md:px-14">
          {/* Soft ambient glow */}
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[28rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary/15 via-foreground/5 to-transparent blur-3xl"
            aria-hidden="true"
          />

          {/* Header */}
          <div className="relative mx-auto max-w-2xl text-center">
            <p className="mb-3 text-sm font-medium tracking-wide text-muted-foreground">
              Design Lab
            </p>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[2.6rem] md:leading-[1.15]">
              Real portfolios.{" "}
              <span className="bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground bg-clip-text text-transparent">
                Built by real people.
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
              Explore portfolios our users have published, across every design
              style.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col items-center gap-3">
              <Link
                href={DESIGN_LAB_PATH}
                className="btn btn-ion w-full sm:w-auto sm:min-w-[13rem]"
              >
                Open Design Lab
              </Link>
              <p className="text-sm text-muted-foreground/70">
                orixaai.me/design-lab
              </p>
            </div>
          </div>

          {/* Style chips */}
          <div className="relative mt-12">
            <p className="mb-5 text-center text-sm text-muted-foreground">
              Or pick a style to see it in action
            </p>
            <ul
              className="flex flex-wrap items-center justify-center gap-2.5"
              aria-label="Design styles"
            >
              {STYLES.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`${DESIGN_LAB_PATH}?theme=${s.id}`}
                    className="group inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/50 px-4 py-2 text-sm font-medium text-foreground transition-all duration-200 hover:border-foreground/30 hover:bg-background"
                    style={
                      {
                        "--from": s.from,
                        "--to": s.to,
                      } as CSSProperties
                    }
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{
                        background: `linear-gradient(135deg, ${s.from}, ${s.to})`,
                      }}
                      aria-hidden="true"
                    />
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}