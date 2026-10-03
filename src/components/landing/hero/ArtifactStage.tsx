"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion, useWebGL } from "@/lib/hooks";
import CanvasBoundary from "./CanvasBoundary";

const PortfolioArtifact = dynamic(() => import("./PortfolioArtifact"), { ssr: false });

/** Pure-CSS stand-in used for no-WebGL browsers, load errors, and while the 3D chunk loads. */
function Fallback() {
  return (
    <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
      <div className="relative h-72 w-56 -rotate-6 rounded-2xl border border-border-strong bg-surface-2 p-4 shadow-glow-primary">
        <div className="h-14 rounded-lg bg-gradient-ion" />
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((i) => <div key={i} className={`h-16 rounded-lg ${i % 3 === 0 ? "bg-primary" : "bg-surface-3"}`} />)}
        </div>
      </div>
    </div>
  );
}

export default function ArtifactStage() {
  const webgl = useWebGL();
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Pause rendering entirely while the hero is off-screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      {webgl ? (
        <CanvasBoundary fallback={<Fallback />}>
          <PortfolioArtifact active={visible} animate={!reduced} />
        </CanvasBoundary>
      ) : <Fallback />}
    </div>
  );
}
