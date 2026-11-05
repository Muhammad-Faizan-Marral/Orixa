"use client";

/**
 * OrixaAI — "What you get" bento.
 * Four tiles: resume → portfolio, custom domain, visitor analytics, contact.
 */

import CountUp from "./CountUp";

const DOMAIN = "ayeshakhan.com";
const SUBDOMAIN = "ayeshakhan.orixaai.com";
const COUNTRIES = [
  { flag: "🇵🇰", name: "Pakistan" },
  { flag: "🇦🇪", name: "UAE" },
  { flag: "🇺🇸", name: "USA" },
];

const FileIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6" />
  </svg>
);

export default function PillarsSection() {
  return (
    <section id="pillars" className="lp">
      <div className="lp-container">
        <div className="lp-head">
          <h2 className="lp-title">Built for people who are tired of generic portfolios.</h2>
          <p className="lp-lead">Everything you need to showcase your work with confidence and elegance.</p>
        </div>

        <div className="lp-bento">
          {/* 1 — Resume in, portfolio out */}
          <div className="lp-tile lp-tile-blue">
            <div className="lp-z">
              <h3 className="lp-tile-title">Resume in. Portfolio out.</h3>
              <p className="lp-tile-desc">
                Upload your CV. AI fills in your experience, skills and education, then you choose a
                design. No typing every field.
              </p>
            </div>
            <div className="lp-z">
              <div className="lp-flow" aria-label="Resume to portfolio flow">
                <div className="lp-flow-box"><FileIcon /><span>resume.pdf</span></div>
                <div className="lp-dash" aria-hidden="true" />
                <div className="lp-flow-box">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
                  </svg>
                  <span>Choose design</span>
                </div>
                <div className="lp-dash" aria-hidden="true" />
                <div className="lp-flow-box is-final">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20" />
                  </svg>
                  <span>{SUBDOMAIN}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2 — Custom domain */}
          <div className="lp-tile lp-tile-navy">
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <h3 className="lp-tile-title">Custom Domain Mapping</h3>
                <span className="lp-pill">1 min setup</span>
              </div>
              <p className="lp-tile-desc">
                Connect your own custom domain name effortlessly to brand your personal portfolio.
              </p>
            </div>
            <div>
              <div className="lp-browser">
                <span>{DOMAIN}</span>
                <span className="lp-ssl"><span className="lp-dot" /> SSL Active</span>
              </div>
              <div className="lp-steps">
                <span>1. Add CNAME</span>
                <span>2. Verify DNS</span>
                <span className="is-live">3. Live</span>
              </div>
            </div>
          </div>

          {/* 3 — Analytics */}
          <div className="lp-tile lp-tile-light">
            <div>
              <h3 className="lp-tile-title">See who visited your portfolio.</h3>
              <p className="lp-tile-desc">
                Know your views, countries, top projects and where your traffic comes from.
              </p>
            </div>
            <div>
              <div className="lp-bigstat"><CountUp to={2847} /></div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--lp-body)", marginTop: 2 }}>
                Visitors this week
              </div>
              <div style={{ width: "100%", height: 50, margin: "8px 0" }}>
                <svg viewBox="0 0 500 60" fill="none" preserveAspectRatio="none" style={{ width: "100%", height: "100%", overflow: "visible" }} aria-hidden="true">
                  <path d="M0 50 Q 100 35, 200 45 T 350 15 T 500 5" stroke="#1E6BFF" strokeWidth="3.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="lp-chips">
                {COUNTRIES.map((c) => (
                  <span key={c.name} className="lp-chip"><span aria-hidden="true">{c.flag}</span> {c.name}</span>
                ))}
              </div>
            </div>
          </div>

          {/* 4 — Contact */}
          <div className="lp-tile lp-tile-white">
            <div>
              <h3 className="lp-tile-title">Let visitors reach you.</h3>
              <p className="lp-tile-desc">
                A visitor sends a message from your site and it lands straight in your email inbox.
              </p>
            </div>
            <div className="lp-bubble">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/lp/tpl-glass.webp" alt="" className="lp-avatar" style={{ width: 40, height: 40 }} />
              <div>
                <q>Hi Ayesha, loved your work. Are you free for a project next month?</q>
                <span className="lp-delivered">✓ Message delivered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
