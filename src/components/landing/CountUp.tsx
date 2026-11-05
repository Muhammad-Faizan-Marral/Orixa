"use client";

import { useEffect, useRef, useState } from "react";

/** Counts up to `to` once the number scrolls into view. Respects reduced motion. */
export default function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setN(to);
      return;
    }
    let timer: number | undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        let cur = 0;
        const step = Math.max(1, to / 30);
        const tick = () => {
          cur += step;
          if (cur >= to) return setN(to);
          setN(Math.ceil(cur));
          timer = window.setTimeout(tick, 35);
        };
        tick();
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) window.clearTimeout(timer);
    };
  }, [to]);

  return <span ref={ref}>{n.toLocaleString()}</span>;
}
