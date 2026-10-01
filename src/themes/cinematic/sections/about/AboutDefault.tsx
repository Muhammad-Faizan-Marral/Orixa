"use client";

import { useState } from "react";
import type { SectionProps } from "../shared/types";

const SHOW_WORDS = 110; // what fits on one "screen" before offering the full story
const SHOW_PARAS = 3;

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;
const at = (t: number) => ({ ["--at" as string]: t });

/** Body paragraphs after the lead sentence; `shown` fits the screen, `rest` goes behind the button. */
function splitBody(paragraphs: string[], lead: string) {
  const first = paragraphs[0].slice(lead.length).trim();
  const body = [first, ...paragraphs.slice(1)].filter(Boolean);
  const shown: string[] = [];
  let used = 0;
  for (const p of body) {
    if (shown.length >= SHOW_PARAS || (shown.length > 0 && used + words(p) > SHOW_WORDS)) break;
    shown.push(p);
    used += words(p);
  }
  return { shown, rest: body.slice(shown.length) };
}

export function AboutDefault({ portfolio, act }: SectionProps) {
  const { about, person, stats } = portfolio;
  const [open, setOpen] = useState(false);
  if (!about) return null;

  const { shown, rest } = splitBody(about.paragraphs, about.lead);
  const facts = [
    stats.experienceYears >= 1 ? { v: String(Math.floor(stats.experienceYears)), l: "Years" } : null,
    stats.projectCount ? { v: String(stats.projectCount), l: stats.projectCount === 1 ? "Project" : "Projects" } : null,
    stats.skillCount ? { v: String(stats.skillCount), l: stats.skillCount === 1 ? "Skill" : "Skills" } : null,
  ].filter((x): x is { v: string; l: string } => x !== null);

  return (
    <div className="cin-about">
      <div className="cin-about-text">
        <p className="cin-eyebrow">{act.label}</p>
        <h2 className="cin-about-title">{act.title}</h2>

        <blockquote className="cin-lead cin-reveal" style={at(0)}>
          {about.lead}
        </blockquote>

        <div className={`cin-about-body${open ? " is-open" : ""}`}>
          {shown.map((p, i) => (
            <p key={i} className="cin-reveal" style={at(0.1 + i * 0.1)}>
              {p}
            </p>
          ))}
          {open && rest.map((p, i) => <p key={`r${i}`}>{p}</p>)}
        </div>

        {rest.length > 0 && (
          <button type="button" className="cin-more cin-reveal" style={at(0.4)} onClick={() => setOpen((v) => !v)}>
            {open ? "Show less" : "Read the full story"}
          </button>
        )}

        {facts.length > 0 && (
          <dl className="cin-facts cin-reveal" style={at(0.42)}>
            {facts.map((f) => (
              <div key={f.l}>
                <dt>{f.l}</dt>
                <dd>{f.v}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {person.avatarUrl && (
        <figure className="cin-still cin-reveal" style={at(0.05)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={person.avatarUrl} alt={person.name} loading="lazy" decoding="async" />
          <figcaption>{person.name}</figcaption>
        </figure>
      )}
    </div>
  );
}
