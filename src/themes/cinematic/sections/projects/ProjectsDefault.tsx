"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { trackProjectClick } from "@/features/portfolio/components/use-portfolio-events";
import { clamp } from "../../shared/math";
import { scrollToProgress, subscribeScroll } from "../../shared/scroll";
import type { SectionProps } from "../shared/types";

/** Where, inside the act (0..1), the frames play. The rest is lead-in / lead-out. */
const START = 0.08;
const SPAN = 0.84;

const no = (i: number) => String(i + 1).padStart(2, "0");
const vars = (v: Record<string, string | number>) => v as CSSProperties;

export function ProjectsDefault({ portfolio, act }: SectionProps) {
  const { projects } = portfolio;
  const portfolioId = portfolio.contact.portfolioId;
  const n = projects.length;
  const [active, setActive] = useState(0);

  useEffect(() => {
    const span = act.range.end - act.range.start;
    return subscribeScroll((p) => {
      const local = span > 0 ? (p - act.range.start) / span : 0;
      setActive(Math.min(n - 1, Math.floor(clamp((local - START) / SPAN) * n)));
    });
  }, [act.range.start, act.range.end, n]);

  const jump = (i: number) =>
    scrollToProgress(act.range.start + (START + (SPAN * (i + 0.5)) / n) * (act.range.end - act.range.start));

  const onProjectClick = (title: string) => {
    if (portfolioId) trackProjectClick(portfolioId, title);
  };

  return (
    <div className="cin-works" style={vars({ "--n": n })}>
      <header className="cin-works-head">
        <p className="cin-eyebrow">{act.label}</p>
        <h2 className="cin-works-title">{act.title}</h2>
        {act.caption && <p className="cin-caption">{act.caption}</p>}
      </header>

      <div className="cin-frames">
        {projects.map((p, i) => (
          <article key={p.id} className="cin-frame" data-on={i === active} style={vars({ "--i": i })} aria-label={p.title}>
            <div className="cin-frame-text">
              <p className="cin-frame-no">
                No. {no(i)} <span>/ {no(n - 1)}</span>
              </p>
              <h3 className="cin-frame-title">{p.title}</h3>
              {p.summary && <p className="cin-frame-sum">{p.summary}</p>}
              {p.tech.length > 0 && (
                <ul className="cin-tech" aria-label="Built with">
                  {p.tech.slice(0, 6).map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}
              {p.url && (
                <a
                  className="cin-watch"
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={i === active ? 0 : -1}
                  onClick={() => onProjectClick(p.title)}
                >
                  View project{p.host ? <span>{p.host}</span> : null} <b aria-hidden>↗</b>
                </a>
              )}
            </div>

            <div className="cin-screen">
              {p.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imageUrl} alt={`${p.title} preview`} loading="lazy" decoding="async" />
              ) : (
                <div className="cin-poster" aria-hidden>
                  <span>{no(i)}</span>
                  <em>{p.title}</em>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {n > 1 && (
        <nav className="cin-reel" aria-label="Projects">
          {projects.map((p, i) => (
            <button key={p.id} type="button" data-on={i === active} onClick={() => jump(i)} aria-label={`Go to ${p.title}`}>
              <i />
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}