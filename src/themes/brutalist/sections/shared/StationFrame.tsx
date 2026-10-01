"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { useScrollProgress } from "./use-scroll-progress";

type Props = {
  id: string;
  /** station.range.center / half-width: is window me panel nazar aata hai */
  center: number;
  halfWidth: number;
  /** "first": progress 0 se center tak full visible. "last": center se 1 tak full visible */
  edge?: "first" | "last";
  align?: "left" | "right" | "center";
  /** desktop par vertical jagah: default center, "top" = upar (plane neeche nazar aaye) */
  valign?: "center" | "top";
  label: string;
  children: ReactNode;
};

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Fixed full-screen panel jo scroll progress ke hisaab se fade hota hai.
 * Content server par render hota hai (SEO), sirf opacity/transform ref se badalta hai.
 */
export function StationFrame({ id, center, halfWidth, edge, align = "left", valign = "top", label, children }: Props) {
  const ref = useRef<HTMLElement>(null);

  const update = useCallback(
    (p: number) => {
      const el = ref.current;
      if (!el) return;
      const off = (edge === "first" && p < center) || (edge === "last" && p > center) ? 0 : Math.abs(p - center);
      const d = off / Math.max(halfWidth, 0.04);
      const v = clamp01((1 - d) / 0.4);
      const dir = p < center ? 1 : -1;
      el.style.opacity = String(v);
      el.style.transform = `translate3d(0, ${(1 - v) * 34 * dir}px, 0) scale(${0.97 + 0.03 * v})`;
      el.style.visibility = v <= 0.01 ? "hidden" : "visible";
      el.style.pointerEvents = v > 0.6 ? "auto" : "none";
    },
    [center, halfWidth, edge],
  );
  useScrollProgress(update);

  const valignCls = valign === "top" ? "md:items-start md:pt-20" : "md:items-center";
  const justify =
    align === "right" ? "md:justify-end" : align === "center" ? "md:justify-center" : "md:justify-start";

  return (
    <section
      ref={ref}
      id={id}
      aria-label={label}
      data-station={id}
      className={`cin-root fixed inset-0 z-10 flex items-start px-4 pb-28 pt-20 md:pb-14 md:pl-20 md:pr-36 ${valignCls} ${justify}`}
      style={{ opacity: 0, visibility: "hidden", pointerEvents: "none", willChange: "opacity, transform" }}
    >
      {children}
    </section>
  );
}
