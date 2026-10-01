"use client";

import type { CSSProperties } from "react";
import type { SectionProps } from "../shared/types";

const at = (t: number): CSSProperties => ({ ["--at" as string]: t });

export function CertificatesDefault({ portfolio, act }: SectionProps) {
  const { certificates } = portfolio;
  if (!certificates.length) return null;

  let delay = 0.1;

  return (
    <div className="cin-keeps">
      <header className="cin-keeps-head">
        <p className="cin-eyebrow">{act.label}</p>
        <h2 className="cin-keeps-title">{act.title}</h2>
        {act.caption && <p className="cin-caption">{act.caption}</p>}
      </header>

      <ul className="cin-keeps-grid">
        {certificates.map((c) => {
          const t = (delay += 0.05);
          return (
            <li key={c.id} className="cin-keep cin-reveal" style={at(t)}>
              <div className="cin-keep-card">
                <p className="cin-keep-name">{c.name}</p>
                {c.issuer && <p className="cin-keep-issuer">{c.issuer}</p>}
                {c.issuedLabel && <p className="cin-keep-date">{c.issuedLabel}</p>}
                {c.url && (
                  <a
                    className="cin-keep-link"
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View credential <b aria-hidden>↗</b>
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}