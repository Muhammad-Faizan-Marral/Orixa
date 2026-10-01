"use client";

import { useEffect, useRef } from "react";
import type { FilmLook, Journey } from "../../schema";
import { actIndexAt } from "../../shared/math";
import { subscribeScroll } from "../../shared/scroll";

const SECONDS_PER_SCREEN = 12; // runtime of the "film": 12s per 100vh of scroll
const FPS = 24;

const pad = (n: number) => String(n).padStart(2, "0");

function timecode(progress: number, totalVh: number) {
  const total = (totalVh / 100) * SECONDS_PER_SCREEN * progress;
  const s = Math.floor(total);
  const f = Math.floor((total - s) * FPS);
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}:${pad(f)}`;
}

/** Grain, vignette, flicker, letterbox, and a camcorder HUD. Pure overlay, never blocks input. */
export function FilmOverlay({ journey, look }: { journey: Journey; look: FilmLook }) {
  const stamp = useRef<HTMLSpanElement>(null);
  const code = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!look.timestamp) return;
    let last = -1;
    return subscribeScroll((p) => {
      const i = actIndexAt(journey.acts, p);
      if (i !== last && stamp.current) {
        last = i;
        const a = journey.acts[i];
        stamp.current.textContent = `${a.label} — ${a.title}`;
      }
      if (code.current) code.current.textContent = timecode(p, journey.totalScrollVh);
    });
  }, [journey, look.timestamp]);

  return (
    <div className="cin-film" aria-hidden>
      <div className="cin-grain" />
      <div className="cin-vignette" />
      <div className="cin-flicker" />
      {look.letterbox && (
        <>
          <div className="cin-bar cin-bar-top" />
          <div className="cin-bar cin-bar-bottom" />
        </>
      )}
      {look.timestamp && (
        <>
          <div className="cin-hud cin-hud-top">
            <span className="cin-rec">
              <i /> REC
            </span>
            <span ref={stamp}>{journey.acts[0].label}</span>
          </div>
          <div className="cin-hud cin-hud-bottom">
            <span ref={code}>00:00:00:00</span>
            <span>24 FPS</span>
          </div>
        </>
      )}
    </div>
  );
}
