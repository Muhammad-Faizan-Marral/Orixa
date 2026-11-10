"use client";

import { useState, type ReactNode } from "react";
import Relic from "./game/Relic";

type Icon = "bolt" | "doc" | "globe" | "layout" | "chart" | "mail" | "link";

const ICONS: Record<Icon, string> = {
  bolt: "M13 10V3L4 14h7v7l9-11h-7z",
  doc: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  globe:
    "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9",
  layout:
    "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
  chart:
    "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  mail: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  link: "M10 13a5 5 0 007.07 0l3-3a5 5 0 00-7.07-7.07l-1.5 1.5M14 11a5 5 0 00-7.07 0l-3 3a5 5 0 007.07 7.07l1.5-1.5",
};

const FEATURES: { title: string; desc: string; icon: Icon }[] = [
  {
    title: "AI-Powered Onboarding",
    desc: "Upload your resume — OrixaAI structures experience, skills, education, and profile for you.",
    icon: "bolt",
  },
  {
    title: "ATS Resume Builder",
    desc: "No resume? Generate a clean, ATS-friendly resume from your profile in the same flow.",
    icon: "doc",
  },
  {
    title: "Custom Domain Mapping",
    desc: "Connect your own custom domain name effortlessly to brand your personal portfolio.",
    icon: "globe",
  },
  {
    title: "Premium Designs",
    desc: "Layouts built to feel like a real personal site — not another generic template.",
    icon: "layout",
  },
  {
    title: "Visitor Analytics",
    desc: "Views, countries, traffic sources, devices, and project clicks — know your real reach.",
    icon: "chart",
  },
  {
    title: "Direct Contact",
    desc: "Working contact forms on your portfolio so recruiters and clients email you directly.",
    icon: "mail",
  },
  {
    title: "Share Your Work",
    desc: "One clean URL for your resume, LinkedIn, GitHub, applications, and social profiles.",
    icon: "link",
  },
];

type Corner = "tl" | "tr" | "bl" | "br";
const CORNERS: {
  id: Corner;
  pos: React.CSSProperties;
  edge: React.CSSProperties;
}[] = [
  {
    id: "tl",
    pos: { left: 12, top: 12 },
    edge: { borderLeftWidth: 2, borderTopWidth: 2 },
  },
  {
    id: "tr",
    pos: { right: 12, top: 12 },
    edge: { borderRightWidth: 2, borderTopWidth: 2 },
  },
  {
    id: "bl",
    pos: { left: 12, bottom: 12 },
    edge: { borderLeftWidth: 2, borderBottomWidth: 2 },
  },
  {
    id: "br",
    pos: { right: 12, bottom: 12 },
    edge: { borderRightWidth: 2, borderBottomWidth: 2 },
  },
];
const ODD: Corner = "tr"; // the one with the tiny pulsing pip

export default function FeaturesSection() {
  const [nope, setNope] = useState<Corner | null>(null);

  return (
    <section id="features" className="lp">
      {/* Decorative corner marks */}
      {CORNERS.map((c) => {
        const mark: ReactNode = (
          <i aria-hidden="true" style={c.edge}>
            {c.id === ODD && <span className="lp-mark-pip anim-beacon " />}
          </i>
        );

        return true ? (
          <Relic key={c.id} id="pads" label="Frame mark" className="lp-mark">
            {() => mark}
          </Relic>
        ) : (
          <button
            key={c.id}
            type="button"
            aria-label="Frame mark"
            onClick={() => setNope(c.id)}
            onAnimationEnd={() => setNope(null)}
            className={`lp-mark ${nope === c.id ? "anim-shake" : ""}`}
          >
            {mark}
          </button>
        );
      })}

      <div className="lp-container">
        <div className="lp-head">
          <h2 className="lp-title">
            Everything you need
            <Relic
              id="terminal"
              label="A blinking cursor"
              className="inline-block align-baseline"
            >
              {({ solved }) => (
                <span
                  className={`lp-cursor ${solved ? "is-solved" : "anim-blink"}`}
                  style={{ marginLeft: 6 }}
                  aria-hidden="true"
                >
                  _
                </span>
              )}
            </Relic>
          </h2>
          <p className="lp-lead">Clean tools. No unnecessary complexity.</p>
        </div>

        <ul className="lp-features">
          {FEATURES.map((f) => (
            <li key={f.title} className="lp-feature">
              <div className="lp-feature-ico">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d={ICONS[f.icon]} />
                </svg>
              </div>
              <div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </li>
          ))}

          {/* Alchemy easter egg */}
          <li className="lp-relic-cell">
            <Relic
              id="alchemy"
              label="An empty slot with a keyhole"
              className="lp-feature-relic "
            >
              {({ solved, sealed }) => (
                <svg
                  viewBox="0 0 10 14"
                  width="26"
                  height="36"
                  shapeRendering="crispEdges"
                  aria-hidden="true"
                  className={
                    sealed ? "opacity-40" : solved ? "" : "anim-beacon"
                  }
                >
                  <path
                    d="M3 1h4v1h1v4H7v1h1v6H2V7h1V6H2V2h1z"
                    fill={solved ? "#10B981" : "#AFC4E8"}
                  />
                  <path d="M4 3h2v3H4zM4 8h2v3H4z" fill="#F6F8FC" />
                </svg>
              )}
            </Relic>
          </li>
        </ul>
      </div>
    </section>
  );
}
