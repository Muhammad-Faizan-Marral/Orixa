"use client";

/**
 * OrixaAI — Design Lab teaser (compact).
 * Short line + link to the Design Lab + 7 style chips.
 * Each chip opens the Design Lab filtered to that style.
 */

import type { CSSProperties } from "react";

const DESIGN_LAB_URL = "https://www.orixaai.me/design-lab";

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
              <a
                href={DESIGN_LAB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ion w-full sm:w-auto sm:min-w-[12rem]"
              >
                Open Design Lab
              </a>
              <p className="dl-url">orixaai.me/design-lab</p>
            </div>
          </div>

          <div className="relative mt-9">
            <p className="dl-hint">Or pick a style to see it in action</p>
            <ul className="dl-chips" aria-label="Design styles">
              {STYLES.map((s) => (
                <li key={s.id}>
                  <a
                    href={`${DESIGN_LAB_URL}?theme=${s.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
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
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .dl-card {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          border: 1px solid rgb(120 120 140 / 0.25);
          border-radius: 1.4rem;
          background: rgb(120 120 140 / 0.06);
          padding: 2.2rem 1.25rem;
        }
        @media (min-width: 768px) {
          .dl-card {
            padding: 3rem 2.5rem;
          }
        }
        .dl-glow {
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          background:
            radial-gradient(
              520px circle at 15% 0%,
              rgb(108 92 255 / 0.16),
              transparent 60%
            ),
            radial-gradient(
              520px circle at 90% 100%,
              rgb(34 211 238 / 0.14),
              transparent 60%
            );
        }
        .dl-url {
          font-size: 0.74rem;
          opacity: 0.55;
          letter-spacing: 0.02em;
        }
        .dl-hint {
          text-align: center;
          font-size: 0.8rem;
          opacity: 0.65;
          margin-bottom: 0.9rem;
        }
        .dl-chips {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem;
          max-width: 40rem;
          margin: 0 auto;
        }
        .dl-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.45rem 0.9rem 0.45rem 0.55rem;
          border-radius: 999px;
          font-size: 0.82rem;
          white-space: nowrap;
          border: 1px solid rgb(120 120 140 / 0.3);
          background: rgb(120 120 140 / 0.08);
          transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }
        .dl-dot {
          width: 1.15rem;
          height: 1.15rem;
          border-radius: 50%;
          flex: none;
          background: linear-gradient(135deg, var(--from), var(--to));
          box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.25);
        }
        .dl-chip:hover {
          transform: translateY(-2px);
          border-color: var(--to);
          box-shadow: 0 8px 22px color-mix(in srgb, var(--to) 28%, transparent);
        }
        .dl-chip:focus-visible {
          outline: 2px solid var(--to);
          outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          .dl-chip {
            transition: none;
          }
          .dl-chip:hover {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}
