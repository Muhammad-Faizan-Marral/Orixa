"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { clamp } from "../../shared/math";
import { scrollToProgress, subscribeScroll } from "../../shared/scroll";
import type { SectionProps } from "../shared/types";

/** Where, inside the act (0..1), the stations play. */
const START = 0.1;
const SPAN = 0.8;

const no = (i: number) => String(i + 1).padStart(2, "0");
const vars = (v: Record<string, string | number>) => v as CSSProperties;

export function ExperienceDefault({ portfolio, act }: SectionProps) {
  const { experience } = portfolio;
  const n = experience.length;
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
    <div className="cin-road" style={vars({ "--n": n })}>
      <header className="cin-road-head">
        <p className="cin-eyebrow">{act.label}</p>
        <h2 className="cin-road-title">{act.title}</h2>
        {act.caption && <p className="cin-caption">{act.caption}</p>}
      </header>

      <div className="cin-stations">
        {experience.map((job, i) => (
          <article
            key={job.id}
            className="cin-station"
            data-on={i === active}
            style={vars({ "--i": i })}
            aria-label={`${job.role} at ${job.company}`}
          >
            <div className="cin-station-mark" aria-hidden>
              <span>{no(i)}</span>
            </div>

            <div className="cin-station-body">
              <p className="cin-station-meta">
                {job.span.label}
                {job.span.durationLabel && <span> · {job.span.durationLabel}</span>}
                {job.location && <span> · {job.location}</span>}
              </p>

              <h3 className="cin-station-role">{job.role || job.company}</h3>
              {job.role && job.company && <p className="cin-station-co">{job.company}</p>}

              {job.summary && <p className="cin-station-sum">{job.summary}</p>}

              {job.highlights.length > 0 && (
                <ul className="cin-station-list">
                  {job.highlights.slice(0, 4).map((h, hi) => (
                    <li key={hi}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        ))}
      </div>

      {n > 1 && (
        <nav className="cin-road-nav" aria-label="Experience">
          {experience.map((job, i) => (
            <button
              key={job.id}
              type="button"
              data-on={i === active}
              onClick={() => jump(i)}
              aria-label={`Go to ${job.role || job.company}`}
            >
              <i />
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}