"use client";

import { useCallback, useRef } from "react";
import type { HudItem } from "../../schema";
import { scrollToProgress, useScrollProgress } from "../shared/use-scroll-progress";

type Props = {
  items: HudItem[];
  name: string;
  initials: string;
  avatarUrl?: string;
  variant?: string;
  reducedMotion?: boolean;
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * HUD: stations ki list. Click -> plane us station tak scroll ho kar jata hai.
 * Active station / progress scroll se nikalta hai aur DOM ko directly update karta hai (re-render nahi).
 */
export function HudNav({ items, name, initials, avatarUrl, variant, reducedMotion }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const alt = variant === "alt";

  const update = useCallback(
    (p: number) => {
      const el = root.current;
      if (!el || !items.length) return;

      let active = 0;
      let best = Infinity;
      items.forEach((it, i) => {
        const d = Math.abs(it.center - p);
        if (d < best) {
          best = d;
          active = i;
        }
      });

      el.style.setProperty("--p", String(p));
      // desktop rail + mobile dots dono DOM me hain, isliye index data-hud se lo
      el.querySelectorAll<HTMLButtonElement>("button[data-hud]").forEach((b) => {
        const on = Number(b.dataset.hud) === active;
        b.dataset.active = on ? "true" : "false";
        if (on) b.setAttribute("aria-current", "step");
        else b.removeAttribute("aria-current");
      });
      const pct = el.querySelector<HTMLElement>("[data-pct]");
      if (pct) pct.textContent = `${pad(Math.round(p * 100))}%`;
      const lab = el.querySelectorAll<HTMLElement>("[data-label]");
      lab.forEach((l) => (l.textContent = items[active].label));
      const idx = el.querySelector<HTMLElement>("[data-idx]");
      if (idx) idx.textContent = `${pad(active + 1)}/${pad(items.length)}`;
    },
    [items],
  );
  useScrollProgress(update);

  const go = (c: number) => scrollToProgress(c, reducedMotion);

  return (
    <div ref={root} className="cin-root" style={{ ["--p" as string]: 0 }}>
      {/* top flight-progress line */}
      <div aria-hidden className="fixed inset-x-0 top-0 z-30 h-[3px] bg-white/10">
        <div
          className="h-full origin-left"
          style={{
            background: "linear-gradient(90deg,#ffb347,var(--cin-accent))",
            transform: "scaleX(var(--p))",
            boxShadow: "0 0 12px var(--cin-accent)",
          }}
        />
      </div>

      {/* brand */}
      <button
        type="button"
        onClick={() => go(0)}
        aria-label={`${name} — back to takeoff`}
        className="cin-glass-pill fixed left-4 top-4 z-30 flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4 text-left md:left-7 md:top-6"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="" width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <span
            aria-hidden
            className="cin-display flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg,#ff6a5c,#d93a30)" }}
          >
            {initials}
          </span>
        )}
        <span className="cin-display hidden max-w-[11rem] truncate text-sm font-semibold text-white sm:block">{name}</span>
      </button>

      {/* flight readout (desktop, bottom-left) */}
      <div
        aria-hidden
        className="cin-glass-pill cin-mono fixed bottom-4 left-7 z-30 hidden items-center gap-3 rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[.18em] text-white/70 md:flex"
      >
        <span className="text-[var(--cin-accent)]" data-idx>01/{pad(items.length)}</span>
        <span className="h-3 w-px bg-white/20" />
        <span data-label className="text-white">{items[0]?.label}</span>
        <span className="h-3 w-px bg-white/20" />
        <span data-pct>00%</span>
      </div>

      <nav aria-label="Flight stations">
        {alt ? (
          /* ---------- alt: top centered pill ---------- */
          <ul className="cin-glass-pill fixed left-1/2 top-4 z-30 flex -translate-x-1/2 items-center gap-1 rounded-full p-1.5 md:top-6">
            {items.map((it, i) => (
              <li key={it.id}>
                <button
                  type="button"
                  data-hud={i}
                  data-active="false"
                  onClick={() => go(it.center)}
                  title={it.label}
                  className="cin-hud-btn rounded-full px-3 py-2 data-[active=true]:bg-white/10"
                >
                  <span className="cin-hud-dot" aria-hidden />
                  <span className="hidden text-xs lg:inline" style={{ opacity: 1, transform: "none" }}>{it.label}</span>
                  <span className="sr-only lg:hidden">{it.label}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <>
            {/* ---------- default desktop: right vertical rail ---------- */}
            <ul className="cin-glass-pill fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-0.5 rounded-[26px] px-3 py-4 md:flex">
              {items.map((it, i) => (
                <li key={it.id}>
                  <button
                    type="button"
                    data-hud={i}
                    data-active="false"
                    onClick={() => go(it.center)}
                    className="cin-hud-btn py-2 pl-2"
                  >
                    <span className="cin-hud-label">{it.label}</span>
                    <span className="cin-hud-dot" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>

            {/* ---------- default mobile: bottom dots + current label ---------- */}
            <div className="fixed inset-x-0 bottom-4 z-30 flex flex-col items-center gap-2 md:hidden">
              <span data-label className="cin-mono cin-glass-pill rounded-full px-3 py-1 text-[10px] uppercase tracking-[.18em] text-white">
                {items[0]?.label}
              </span>
              <ul className="cin-glass-pill flex items-center gap-0.5 rounded-full px-2 py-1">
                {items.map((it, i) => (
                  <li key={it.id}>
                    <button
                      type="button"
                      data-hud={i}
                      data-active="false"
                      onClick={() => go(it.center)}
                      className="cin-hud-btn p-2.5"
                    >
                      <span className="cin-hud-dot" aria-hidden />
                      <span className="sr-only">{it.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </nav>
    </div>
  );
}
