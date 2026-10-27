"use client";

import { useEffect, useRef } from "react";

/**
 * Replaces framer-motion's useScroll + useSpring (saves its whole bundle).
 * Same range as before: 0 when the block's top reaches 80% of the viewport,
 * 1 when its bottom reaches 60%. The scroll listener exists only while the
 * block is on screen and the line is visible (md and up).
 */
export default function ProgressLine() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const box = el?.parentElement;
    if (!el || !box) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.transform = "scaleX(1)";
      return;
    }

    const wide = window.matchMedia("(min-width: 768px)");
    let raf = 0;
    let on = false;
    let visible = false;

    const update = () => {
      raf = 0;
      const r = box.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (vh * 0.2 + r.height)));
      el.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const attach = () => {
      if (on || !wide.matches) return;
      on = true;
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
    };
    const detach = () => {
      if (!on) return;
      on = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      update(); // settle on 0 or 1 when leaving the viewport
    };
    const sync = () => (visible && wide.matches ? attach() : detach());

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
    io.observe(box);
    wide.addEventListener("change", sync);

    return () => {
      io.disconnect();
      wide.removeEventListener("change", sync);
      detach();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{ transform: "scaleX(0)" }}
      className="bg-gradient-ion absolute left-0 right-0 top-8 hidden h-px origin-left shadow-[0_0_12px_var(--accent)] will-change-transform md:block"
    />
  );
}