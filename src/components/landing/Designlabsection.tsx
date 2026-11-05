/**
 * OrixaAI — Design Lab teaser (Server Component).
 * Style chips + showcase gallery. Every chip / card opens the Design Lab.
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

const SHOWCASE = [
  { img: "/lp/tpl-glass.webp", tag: "Glassmorphism", name: "Neo Glass", theme: "neo-glass" },
  { img: "/lp/tpl-editorial.webp", tag: "Typography led", name: "Editorial", theme: "editorial" },
  { img: "/lp/tpl-sport.webp", tag: "High energy", name: "Cinematic", theme: "cinematic" },
  { img: "/lp/tpl-playful.webp", tag: "Character & clay", name: "Minimal Airy", theme: "minimal-airy" },
];

export default function DesignLabSection() {
  return (
    <section id="design-lab" className="lp">
      <div className="lp-container">
        <div className="lp-head">
          <h2 className="lp-title">Real portfolios. Built by real people.</h2>
          <p className="lp-lead">
            Explore portfolios our users have published, across every design style.
          </p>
        </div>

        {/* Style chips */}
        <ul className="lp-filter" aria-label="Design styles">
          {STYLES.map((s) => (
            <li key={s.id}>
              <Link
                href={`${DESIGN_LAB_PATH}?theme=${s.id}`}
                className="lp-filter-chip"
                style={{ "--from": s.from, "--to": s.to } as CSSProperties}
              >
                <span
                  className="lp-swatch"
                  style={{ background: `linear-gradient(135deg, ${s.from}, ${s.to})` }}
                  aria-hidden="true"
                />
                {s.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Gallery */}
        <div className="lp-gallery">
          {SHOWCASE.map((t) => (
            <Link
              key={t.name}
              href={`${DESIGN_LAB_PATH}?theme=${t.theme}`}
              className="lp-template"
              aria-label={`Open ${t.name} in the Design Lab`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.img} alt="" width={280} height={440} loading="lazy" decoding="async" />
              <div className="lp-template-overlay">
                <span className="lp-template-tag">{t.tag}</span>
                <span className="lp-template-name">{t.name}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="lp-center">
          <Link href={DESIGN_LAB_PATH} className="lp-btn lp-btn-glass">
            Open Design Lab
          </Link>
          <p className="lp-url">orixaai.me/design-lab</p>
        </div>
      </div>
    </section>
  );
}
