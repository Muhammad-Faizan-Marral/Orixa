/**
 * OrixaAI — Design Lab teaser (compact).
 * Short line + link to the Design Lab + 7 style chips (Server Component, CSS in landing.css).
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
    <section id="design-lab" className="relative py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="dl-card">
          <div className="dl-glow" aria-hidden="true" />

          <div className="relative mx-auto max-w-2xl text-center">
            <p className="text-caption mb-3">Design Lab</p>
            <h2 className="text-h1 text-balance">
              Real portfolios.{" "}
              <span className="text-gradient-ion">Built by real people.</span>
            </h2>
            <p className="text-body-lg mx-auto mt-4 max-w-md">
              Explore portfolios our users have published, across every design
              style.
            </p>

            <div className="mt-7 flex flex-col items-center gap-3">
              <Link
                href={DESIGN_LAB_PATH}
                className="btn btn-ion w-full sm:w-auto sm:min-w-[12rem]"
              >
                Open Design Lab
              </Link>
              <p className="dl-url">orixaai.me/design-lab</p>
            </div>
          </div>

          <div className="relative mt-9">
            <p className="dl-hint">Or pick a style to see it in action</p>
            <ul className="dl-chips" aria-label="Design styles">
              {STYLES.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`${DESIGN_LAB_PATH}?theme=${s.id}`}
                    className="dl-chip"
                    style={
                      {
                        "--from": s.from,
                        "--to": s.to,
                      } as CSSProperties
                    }
                  >
                    <span className="dl-dot" aria-hidden="true" />
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
