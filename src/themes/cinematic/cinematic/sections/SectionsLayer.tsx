"use client";

import { useEffect, useRef, type ComponentType } from "react";
import type { CinematicModel } from "../data";
import type { ActId } from "../schema";
import { smoothstep } from "../shared/math";
import { subscribeScroll } from "../shared/scroll";
import { About } from "./about";
import { Hero } from "./hero";
import { ActTitleCard } from "./shared/ActTitleCard";
import type { SectionProps } from "./shared/types";

/**
 * Act -> component. Anything missing falls back to a title card,
 * so new sections are added here one at a time.
 */
const RENDERERS: Partial<Record<ActId, ComponentType<SectionProps>>> = {
  arrival: Hero,
  about: About,
};

const FADE = 0.14; // portion of an act used to dissolve in / out

/**
 * Fixed overlay. The page only provides scroll distance; each act is a stacked
 * layer whose visibility (--vis) and local progress (--act-p) are written as CSS
 * variables straight from scroll (no React re-render per frame).
 */
export function SectionsLayer({ model }: { model: CinematicModel }) {
  const root = useRef<HTMLDivElement>(null);
  const { acts } = model.journey;

  useEffect(() => {
    const els = Array.from(root.current?.querySelectorAll<HTMLElement>("[data-act]") ?? []);
    return subscribeScroll((p) => {
      acts.forEach((act, i) => {
        const el = els[i];
        if (!el) return;
        const span = act.range.end - act.range.start;
        const local = span > 0 ? (p - act.range.start) / span : 0;
        const fadeIn = i === 0 ? 1 : smoothstep(0, FADE, local);
        const fadeOut = i === acts.length - 1 ? 1 : 1 - smoothstep(1 - FADE, 1, local);
        const vis = local < 0 || local > 1 ? 0 : fadeIn * fadeOut;
        el.style.setProperty("--act-p", Math.min(1, Math.max(0, local)).toFixed(4));
        el.style.setProperty("--vis", vis.toFixed(3));
        el.dataset.active = vis > 0.02 ? "true" : "false";
      });
    });
  }, [acts]);

  return (
    <div ref={root} className="cin-layer">
      {acts.map((act, i) => {
        const Comp = RENDERERS[act.id] ?? ActTitleCard;
        return (
          <section
            key={act.id}
            data-act={act.id}
            data-active={i === 0 ? "true" : "false"}
            data-first={i === 0 ? "" : undefined}
            aria-label={act.title}
            className="cin-act"
          >
            <Comp portfolio={model.portfolio} act={act} />
          </section>
        );
      })}
    </div>
  );
}
