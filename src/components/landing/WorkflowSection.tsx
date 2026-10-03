"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import Relic from "./game/Relic";
import SpotlightCard from "./SpotlightCard";

const STEPS = [
  { title: "Add your work", desc: "Upload resume or add projects manually", offset: "" },
  { title: "Choose design", desc: "Pick a theme & customize sections", offset: "md:mt-14" },
  { title: "Publish & share", desc: "Get a clean public link instantly", offset: "md:mt-28" },
];

export default function WorkflowSection() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <section className="relative py-20 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl">
          <p className="text-caption mb-3">How it works</p>
          <h2 className="text-h1 text-balance">From blank page to <span className="text-gradient-ion">live portfolio</span> in minutes.</h2>
          <p className="text-body-lg mt-4">Three steps. No design degree, no code.</p>
        </div>

        <div ref={ref} className="relative mt-14">
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-border-strong md:block" aria-hidden="true" />
          <motion.div aria-hidden="true" style={{ scaleX: reduced ? 1 : progress }} className="bg-gradient-ion absolute left-0 right-0 top-8 hidden h-px origin-left shadow-[0_0_12px_var(--accent)] md:block" />

          <ol className="grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className={`relative ${s.offset}`}>
                <SpotlightCard className="relative p-6 pt-12">
                  <span className="text-gradient-ion absolute -top-2 left-6 font-display text-6xl font-semibold" aria-hidden="true">{i + 1}</span>
                  <h3 className="text-h3"><span className="sr-only">Step {i + 1}: </span>{s.title}</h3>
                  <p className="text-body mt-2 text-muted-foreground">{s.desc}</p>
                  {i === 1 && (
                    <Relic id="lights" label="A half-buried cartridge" className="absolute -bottom-5 right-5 z-10 flex h-12 w-12 items-center justify-center">
                      {({ solved }) => (
                        <svg viewBox="0 0 12 14" width="26" height="30" shapeRendering="crispEdges" aria-hidden="true" className={solved ? "" : "anim-beacon"}>
                          <path d="M1 1h10v12H1z" fill={solved ? "var(--accent)" : "var(--border-strong)"} />
                          <path d="M3 3h6v4H3z" fill="var(--background)" /><path d="M4 10h4v3H4z" fill="var(--background)" />
                        </svg>
                      )}
                    </Relic>
                  )}
                </SpotlightCard>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
