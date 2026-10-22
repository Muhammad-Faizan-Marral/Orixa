"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion, useWebGL } from "@/lib/hooks";
import CanvasBoundary from "./CanvasBoundary";

// `loading` keeps the CSS hero on screen while the 3D chunk downloads, so the
// swap never flashes an empty box.
const PortfolioArtifact = dynamic(() => import("./PortfolioArtifact"), {
  ssr: false,
  loading: () => <Fallback />,
});

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

type NetworkInfo = { saveData?: boolean; effectiveType?: string };

/** Cheap, synchronous capability check. Unknown signals count as "capable". */
function deviceCanAffordWebGL() {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: NetworkInfo;
  };
  if (nav.connection?.saveData) return false;
  if (nav.connection?.effectiveType && /(^|-)2g$/.test(nav.connection.effectiveType)) return false;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return false;
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency < 4) return false;
  return true;
}

export default function ArtifactStage() {
  const webgl = useWebGL();
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  // The 3D chunk (three + r3f + drei) is the heaviest thing on the page. The CSS
  // fallback is already a complete hero, so only fetch WebGL once the browser is
  // idle and only on devices/connections that can afford it.
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!webgl || reduced || !deviceCanAffordWebGL()) return;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (h: number) => void;
    };
    let idle: number | undefined;
    let timer: number | undefined;
    const arm = () => setArmed(true);
    if (w.requestIdleCallback) idle = w.requestIdleCallback(arm, { timeout: 2500 });
    else timer = window.setTimeout(arm, 1500);
    return () => {
      if (idle !== undefined) w.cancelIdleCallback?.(idle);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [webgl, reduced]);

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
      {webgl && armed && !reduced ? (
        <CanvasBoundary fallback={<Fallback />}>
          <PortfolioArtifact active={visible} animate />
        </CanvasBoundary>
      ) : <Fallback />}
    </div>
  );
}
