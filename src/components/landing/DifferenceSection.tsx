"use client";

import Relic from "./game/Relic";

const ROWS = [
  {
    from: "Generic website builders",
    to: "Built only for portfolios — projects, skills, experience",
  },
  {
    from: "Starting from a blank page",
    to: "Resume upload → structured portfolio in minutes",
  },
  {
    from: "Guessing which design works",
    to: "Design Lab: preview free & premium themes before publishing",
  },
  {
    from: "No idea if anyone sees your work",
    to: "Analytics + direct contact form so people can reach you",
  },
];

export default function DifferenceSection() {
  return (
    <section className="lp" aria-labelledby="why-heading">
      <div className="lp-container">
        <div className="lp-head">
          <h2 id="why-heading" className="lp-title">Not another website builder.</h2>
          <p className="lp-lead">
            Most tools help you make a site. OrixaAI helps you get noticed — with the right
            structure, design, and a way for people to contact you.
          </p>
        </div>

        <div className="lp-compare" role="table" aria-label="What changes with OrixaAI">
          {ROWS.map((r) => (
            <div role="row" key={r.from} className="lp-compare-row">
              <div role="cell" className="lp-instead">{r.from}</div>
              <div role="cell" className="lp-gives">
                <svg width="18" height="18" fill="none" stroke="#1E6BFF" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <span>{r.to}</span>
              </div>
            </div>
          ))}

          {/* Easter egg Relic */}
          <Relic
            id="decoder"
            label="A corrupted row, inspect it"
            className="lp-compare-relic"
          >
            {({ solved }) => (
              <>
                <span
                  className={solved ? "" : "anim-glitch"}
                  style={{ display: "block", fontSize: 13, color: solved ? "#10B981" : "#EF4444", opacity: solved ? 1 : 0.7 }}
                  aria-hidden="true"
                >
                  {solved ? "restored" : "▒▒▒▒▒▒"}
                </span>
                <span
                  style={{ display: "block", fontSize: 15, marginTop: 4, color: solved ? "#7A86A1" : "#AFC4E8" }}
                  aria-hidden="true"
                >
                  {solved ? "signal recovered" : "▒▒▒ ▒▒▒▒▒▒▒▒ ▒▒"}
                </span>
              </>
            )}
          </Relic>
        </div>
      </div>
    </section>
  );
}
