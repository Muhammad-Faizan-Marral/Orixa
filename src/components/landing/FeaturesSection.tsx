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
    title: "Custom Domain Mapping",
    desc: "Connect your own custom domain name effortlessly to brand your personal portfolio.",
    span: "lg:col-span-2",
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
    span: "lg:col-span-3",
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
      {/* Decorative corner marks */}
      {CORNERS.map((c) => {
        const mark = (
          <span
            className={`relative block h-5 w-5 ${c.edge} border-muted-foreground/50`}
            aria-hidden="true"
          >
            {c.id === ODD && (
              <span className="anim-beacon absolute -right-px -top-px h-1.5 w-1.5 bg-accent" />
            )}
          </span>
        );
        const box = `absolute ${c.pos} flex h-12 w-12 items-center justify-center`;

        return c.id === ODD ? (
          <Relic key={c.id} id="pads" label="Frame mark" className={box}>
            {() => mark}
          </Relic>
        ) : (
          <button
            key={c.id}
            type="button"
            aria-label="Frame mark"
            onClick={() => setNope(c.id)}
            onAnimationEnd={() => setNope(null)}
            className={`${box} ${nope === c.id ? "anim-shake" : ""}`}
          >
            {mark}
          </button>
        );
      })}

      <div className="mx-auto max-w-6xl px-5">
        {/* Header */}
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-medium tracking-wide text-muted-foreground">
            Features
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[2.75rem] md:leading-[1.15]">
            Everything you need
            <Relic
              id="terminal"
              label="A blinking cursor"
              className="ml-1.5 inline-block align-baseline"
            >
              {({ solved }) => (
                <span
                  className={
                    solved ? "text-success" : "anim-blink text-accent"
                  }
                  aria-hidden="true"
                >
                  _
                </span>
              )}
            </Relic>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Clean tools. No unnecessary complexity.
          </p>
        </div>

        {/* Feature grid */}
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {FEATURES.map((f) => (
            <li key={f.title} className={f.span}>
              <SpotlightCard className="h-full p-6 md:p-7">
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {f.title}
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </SpotlightCard>
            </li>
          ))}

          {/* Alchemy easter egg */}
          <li className="sm:col-span-2 lg:col-span-6">
            <Relic
              id="alchemy"
              label="An empty slot with a keyhole"
              className="relative flex h-full min-h-28 w-full items-center justify-center rounded-xl border border-dashed border-border-strong/70 p-6 transition-all duration-200 hover:border-accent/70"
            >
              {({ solved, sealed }) => (
                <svg
                  viewBox="0 0 10 14"
                  width="26"
                  height="36"
                  shapeRendering="crispEdges"
                  aria-hidden="true"
                  className={
                    sealed
                      ? "opacity-40"
                      : solved
                        ? ""
                        : "anim-beacon"
                  }
                >
                  <path
                    d="M3 1h4v1h1v4H7v1h1v6H2V7h1V6H2V2h1z"
                    fill={
                      solved ? "var(--success)" : "var(--border-strong)"
                    }
                  />
                  <path
                    d="M4 3h2v3H4zM4 8h2v3H4z"
                    fill="var(--background)"
                  />
                </svg>
              )}
            </Relic>
          </li>
        </ul>
      </div>
    </section>
  );
}