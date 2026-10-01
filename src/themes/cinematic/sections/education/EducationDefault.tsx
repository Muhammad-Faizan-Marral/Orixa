"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { clamp } from "../../shared/math";
import { scrollToProgress, subscribeScroll } from "../../shared/scroll";
import type { SectionProps } from "../shared/types";

/** Where, inside the act (0..1), the chapters play. */
const START = 0.1;
const SPAN = 0.8;

const no = (i: number) => String(i + 1).padStart(2, "0");
const vars = (v: Record<string, string | number>) => v as CSSProperties;

export function EducationDefault({ portfolio, act }: SectionProps) {
  const { education } = portfolio;
  const n = education.length;
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (n <= 1) return;
    const span = act.range.end - act.range.start;
    return subscribeScroll((p) => {
      const local = span > 0 ? (p - act.range.start) / span : 0;
      setActive(Math.min(n - 1, Math.floor(clamp((local - START) / SPAN) * n)));
    });
  }, [act.range.start, act.range.end, n]);

  const jump = (i: number) =>
    scrollToProgress(act.range.start + (START + (SPAN * (i + 0.5)) / n) * (act.range.end - act.range.start));

  if (!n) return null;

  return (
    <div className="cin-edu" style={vars({ "--n": n })}>
      <header className="cin-edu-head">
        <p className="cin-eyebrow">{act.label}</p>
        <h2 className="cin-edu-title">{act.title}</h2>
        {act.caption && <p className="cin-caption">{act.caption}</p>}
      </header>

      <div className="cin-chapters">
        {education.map((ed, i) => (
          <article
            key={ed.id}
            className="cin-chapter"
            data-on={i === active}
            style={vars({ "--i": i })}
            aria-label={`${ed.title} at ${ed.institution}`}
          >
            <div className="cin-chapter-mark" aria-hidden>
              <span>{no(i)}</span>
            </div>

            <div className="cin-chapter-body">
              <p className="cin-chapter-meta">
                {ed.span.label}
                {ed.span.durationLabel && <span> · {ed.span.durationLabel}</span>}
              </p>

              <h3 className="cin-chapter-degree">{ed.title}</h3>
              <p className="cin-chapter-school">{ed.institution}</p>

              {ed.summary && <p className="cin-chapter-sum">{ed.summary}</p>}
            </div>
          </article>
        ))}
      </div>

      {n > 1 && (
        <nav className="cin-edu-nav" aria-label="Education">
          {education.map((ed, i) => (
            <button
              key={ed.id}
              type="button"
              data-on={i === active}
              onClick={() => jump(i)}
              aria-label={`Go to ${ed.title}`}
            >
              <i />
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}