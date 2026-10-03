"use client";

import Link from "next/link";
import { useRef } from "react";
import ArtifactStage from "./hero/ArtifactStage";

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  return (
    <section ref={ref} className="relative isolate overflow-hidden"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        ref.current?.style.setProperty("--mx", `${e.clientX - r.left}px`);
        ref.current?.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}>
      <div className="bg-aurora absolute inset-0 -z-30" aria-hidden="true" />
      <div className="bg-grain absolute inset-0 -z-20" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 [background:radial-gradient(520px_circle_at_var(--mx,70%)_var(--my,40%),color-mix(in_srgb,var(--primary)_16%,transparent),transparent_65%)]" aria-hidden="true" />

      <div className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-6xl items-center gap-4 px-5 pb-10 pt-10 md:grid-cols-[1.05fr_.95fr] md:pt-0">
        <div className="relative z-10 max-w-xl">
          <p className="text-caption mb-5 inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/70 px-3.5 py-1.5 backdrop-blur">
            <span className="anim-beacon bg-gradient-ion h-1.5 w-1.5 rounded-full" aria-hidden="true" />
            AI portfolio builder
          </p>
          <h1 className="text-display-2 text-balance">
            Your work deserves <span className="text-gradient-ion">more than a template.</span>
          </h1>
          <p className="text-body-lg mt-6 max-w-md">
            Turn projects, skills and your resume into a portfolio that actually feels like you. Publish it with a link anyone can open.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/auth/signup" className="btn btn-ion w-full sm:w-auto sm:min-w-[11rem]">Build free portfolio</Link>
            <Link href="#how" className="btn btn-ghost w-full sm:w-auto sm:min-w-[11rem]">See how it works</Link>
          </div>
          <p className="text-caption mt-10 flex items-center gap-2 normal-case tracking-normal">
            <span className="anim-blink bg-accent inline-block h-3 w-2" aria-hidden="true" />
            Some corners of this page are hiding something. Look closer.
          </p>
        </div>

        <div className="relative h-[22rem] sm:h-[28rem] md:h-[min(36rem,80dvh)]">
          <ArtifactStage />
        </div>
      </div>
    </section>
  );
}
