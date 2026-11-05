import ProgressLine from "./ProgressLine";
import CartridgeRelic from "./CartridgeRelic";

/** Server component: static HTML. Only ProgressLine and the relic ship JS. */

const STEPS = [
  {
    title: "Add your work",
    desc: "Upload your resume or add projects manually. AI does the heavy lifting.",
  },
  {
    title: "Choose design",
    desc: "Pick a theme and customize sections until it feels like you.",
  },
  {
    title: "Publish & share",
    desc: "Get a clean public link instantly. Share it anywhere.",
  },
];

function Visual({ i }: { i: number }) {
  if (i === 0)
    return (
      <div className="lp-mini-ico">
        <svg width="18" height="18" fill="none" stroke="#1E6BFF" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <path d="M14 2v6h6" />
        </svg>
        resume_2026.pdf
      </div>
    );
  if (i === 1)
    return (
      <div style={{ display: "flex", gap: 8 }} aria-hidden="true">
        <div style={{ width: 36, height: 48, background: "#fff", borderRadius: 6, border: "2px solid #1E6BFF" }} />
        <div style={{ width: 36, height: 48, background: "#fff", borderRadius: 6, border: "1px solid #CFE2FF" }} />
        <div style={{ width: 36, height: 48, background: "#fff", borderRadius: 6, border: "1px solid #CFE2FF" }} />
      </div>
    );
  return (
    <div className="lp-live-pill">
      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 13l4 4L19 7" />
      </svg>
      Live &amp; Ready
    </div>
  );
}

export default function WorkflowSection() {
  return (
    <section id="how" className="lp">
      <div className="lp-container">
        <div className="lp-head">
          <h2 className="lp-title">From blank page to live portfolio in minutes.</h2>
          <p className="lp-lead">Three simple steps. No design degree. No code.</p>
        </div>

        <div style={{ position: "relative", paddingTop: 4 }}>
          <div className="lp-how-track" aria-hidden="true" />
          <ProgressLine />

          <ol className="lp-how" style={{ paddingTop: 12 }}>
            {STEPS.map((s, i) => (
              <li key={s.title} className="lp-how-card">
                <div className="lp-how-visual">
                  <Visual i={i} />
                </div>
                <div>
                  <div className="lp-step-num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="lp-step-title">
                    <span className="sr-only">Step {i + 1}: </span>
                    {s.title}
                  </h3>
                  <p className="lp-step-desc">{s.desc}</p>
                </div>

                {/* Secret relic only on the middle card */}
                {i === 1 && (
                  <div className="lp-relic-slot">
                    <CartridgeRelic />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
