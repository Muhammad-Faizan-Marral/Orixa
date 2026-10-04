"use client";

import { useState } from "react";
import Relic from "./game/Relic";
import SpotlightCard from "./SpotlightCard";

const FEATURES = [
  {
    title: "AI-Powered Onboarding",
    desc: "Upload your resume — OrixaAI structures experience, skills, education, and profile for you.",
    span: "lg:col-span-3",
  },
  {
    title: "ATS Resume Builder",
    desc: "No resume? Generate a clean, ATS-friendly resume from your profile in the same flow.",
    span: "lg:col-span-3",
  },
  {
    title: "Premium Designs",
    desc: "Layouts built to feel like a real personal site — not another generic template.",
    span: "lg:col-span-2",
  },
  {
    title: "Visitor Analytics",
    desc: "Views, countries, traffic sources, devices, and project clicks — know your real reach.",
    span: "lg:col-span-2",
  },
  {
    title: "Direct Contact",
    desc: "Working contact forms on your portfolio so recruiters and clients email you directly.",
    span: "lg:col-span-2",
  },
  {
    title: "Share Your Work",
    desc: "One clean URL for your resume, LinkedIn, GitHub, applications, and social profiles.",
    span: "lg:col-span-3",
  },
];

type Corner = "tl" | "tr" | "bl" | "br";
const CORNERS: { id: Corner; pos: string; edge: string }[] = [
  { id: "tl", pos: "left-3 top-3", edge: "border-l-2 border-t-2" },
  { id: "tr", pos: "right-3 top-3", edge: "border-r-2 border-t-2" },
  { id: "bl", pos: "bottom-3 left-3", edge: "border-b-2 border-l-2" },
  { id: "br", pos: "bottom-3 right-3", edge: "border-b-2 border-r-2" },
];
const ODD: Corner = "tr"; // the one with the tiny pulsing pip

export default function FeaturesSection() {
  const [nope, setNope] = useState<Corner | null>(null);

  return (
    <section className="relative py-24 md:py-36">
      {CORNERS.map((c) => {
        const mark = (
          <span className={`relative block h-5 w-5 ${c.edge} border-muted-foreground/60`} aria-hidden="true">
            {c.id === ODD && <span className="anim-beacon bg-accent absolute -right-px -top-px h-1.5 w-1.5" />}
          </span>
        );
        const box = `absolute ${c.pos} flex h-12 w-12 items-center justify-center`;
        return c.id === ODD ? (
          <Relic key={c.id} id="pads" label="Frame mark" className={box}>{() => mark}</Relic>
        ) : (
          <button key={c.id} type="button" aria-label="Frame mark" onClick={() => setNope(c.id)}
            onAnimationEnd={() => setNope(null)} className={`${box} ${nope === c.id ? "anim-shake" : ""}`}>{mark}</button>
        );
      })}

      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl">
          <p className="text-caption mb-3">Features</p>
          <h2 className="text-h1">
            Everything you need
            <Relic id="terminal" label="A blinking cursor" className="ml-1 inline-block align-baseline">
              {({ solved }) => <span className={solved ? "text-success" : "anim-blink text-accent"} aria-hidden="true">_</span>}
            </Relic>
          </h2>
          <p className="text-body-lg mt-4">Clean tools. No unnecessary complexity.</p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {FEATURES.map((f) => (
            <li key={f.title} className={f.span}>
              <SpotlightCard className="h-full p-6">
                <h3 className="text-h3 !text-lg">{f.title}</h3>
                <p className="text-body mt-2 text-muted-foreground">{f.desc}</p>
              </SpotlightCard>
            </li>
          ))}
          <li className="sm:col-span-2 lg:col-span-3">
            <Relic id="alchemy" label="An empty slot with a keyhole"
              className="relative flex h-full min-h-28 w-full items-center justify-center rounded-xl border border-dashed border-border-strong p-6 transition hover:border-accent">
              {({ solved, sealed }) => (
                <svg viewBox="0 0 10 14" width="26" height="36" shapeRendering="crispEdges" aria-hidden="true" className={sealed ? "opacity-40" : solved ? "" : "anim-beacon"}>
                  <path d="M3 1h4v1h1v4H7v1h1v6H2V7h1V6H2V2h1z" fill={solved ? "var(--success)" : "var(--border-strong)"} />
                  <path d="M4 3h2v3H4zM4 8h2v3H4z" fill="var(--background)" />
                </svg>
              )}
            </Relic>
          </li>
        </ul>
      </div>
    </section>
  );
}
