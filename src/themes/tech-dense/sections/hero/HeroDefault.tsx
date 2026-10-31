"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ThemeSectionProps } from "@/themes/types";

/* ==========================================================================
   DATA LAYER (unchanged behaviour)
   ========================================================================== */

type AnyRecord = Record<string, unknown>;

function asRecord(value: unknown): AnyRecord | null {
  return value !== null && typeof value === "object"
    ? (value as AnyRecord)
    : null;
}

function cleanString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function firstString(
  sources: Array<AnyRecord | null | undefined>,
  keys: string[],
): string | null {
  for (const source of sources) {
    if (!source) continue;
    for (const key of keys) {
      const value = cleanString(source[key]);
      if (value) return value;
    }
  }
  return null;
}

function nestedString(
  source: AnyRecord | null,
  paths: string[][],
): string | null {
  if (!source) return null;
  for (const path of paths) {
    let current: unknown = source;
    for (const key of path) {
      const record = asRecord(current);
      if (!record) {
        current = null;
        break;
      }
      current = record[key];
    }
    const result = cleanString(current);
    if (result) return result;
  }
  return null;
}

function validUrl(value: string | null): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function getInitials(value: string): string {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

function getHeroData(config: unknown) {
  const configRecord = asRecord(config);
  const nestedContent = asRecord(configRecord?.content);
  const portfolio = asRecord(configRecord?.portfolio);
  const hero = asRecord(configRecord?.hero);

  const sources = [hero, portfolio, nestedContent, configRecord];

  // FIX: this line was commented out but `name` is used below. Without it
  // `name` resolved to the browser global `window.name` (an empty string).
  // If you intentionally do NOT want the name here, delete it from `identity`.
  const name = firstString(sources, ["fullName", "name", "displayName"]);
  const username = firstString(sources, ["username", "handle"]);

  const headline =
    firstString(sources, [
      "headline",
      "title",
      "role",
      "profession",
      "position",
    ]) ??
    nestedString(configRecord, [
      ["portfolio", "headline"],
      ["content", "headline"],
      ["hero", "headline"],
      ["profile", "headline"],
    ]);

  const description =
    firstString(sources, ["description", "bio", "summary", "about"]) ??
    nestedString(configRecord, [
      ["portfolio", "about"],
      ["content", "about"],
      ["hero", "description"],
      ["profile", "bio"],
    ]);

  const avatarUrl =
    firstString(
      [hero, portfolio, nestedContent, configRecord],
      ["avatarUrl", "imageUrl", "image", "photoUrl", "profileImage"],
    ) ??
    nestedString(configRecord, [
      ["profile", "avatarUrl"],
      ["hero", "avatarUrl"],
      ["portfolio", "avatarUrl"],
    ]);

  const location = firstString(sources, ["location", "city"]);
  const eyebrow = firstString(
    [hero, configRecord],
    ["eyebrow", "label", "badge", "availability"],
  );
  const primaryLabel = firstString(
    [hero, configRecord],
    ["primaryCtaLabel", "ctaLabel", "buttonLabel", "primaryLabel"],
  );
  const primaryHref = firstString(
    [hero, configRecord],
    ["primaryCtaHref", "ctaHref", "buttonHref", "primaryHref"],
  );
  const secondaryLabel = firstString(
    [hero, configRecord],
    ["secondaryCtaLabel", "secondaryButtonLabel", "secondaryLabel"],
  );
  const secondaryHref = firstString(
    [hero, configRecord],
    ["secondaryCtaHref", "secondaryButtonHref", "secondaryHref"],
  );

  const identity = name ?? username ?? null;

  return {
    name,
    username,
    headline,
    description,
    avatarUrl,
    location,
    eyebrow,
    primaryLabel,
    primaryHref,
    secondaryLabel,
    secondaryHref,
    initials: identity ? getInitials(identity) : "",
    identity,
  };
}

function splitHeadline(value: string) {
  const explicitLines = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  return explicitLines.length > 1 ? explicitLines : [value];
}

/* ==========================================================================
   DESIGN TOKENS + HOISTED STATIC VALUES
   ========================================================================== */

const EASE = [0.16, 1, 0.3, 1] as const;
const CUT = "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)";

const CANVAS_MASK =
  "linear-gradient(to bottom, transparent 8%, black 45%, black 88%, transparent)";

const AMBIENT_BG =
  "radial-gradient(circle, rgba(37,99,235,0.18), rgba(30,64,175,0.06) 40%, transparent 68%)";

/** Same gradient as before (640px circle), but now a fixed bitmap that is MOVED, not repainted. */
const SPOTLIGHT_BG =
  "radial-gradient(640px circle at 50% 50%, rgba(37,99,235,0.16), transparent 62%)";

const GRAIN_BG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const VIGNETTE_BG =
  "radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(2,3,6,0.85) 100%)";

const H1_STYLE: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(180deg,#fff 0%,#F1F5FF 45%,rgba(147,197,253,0.62) 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
};

const CUT_STYLE: React.CSSProperties = { clipPath: CUT };

const PLACEHOLDER_BG: React.CSSProperties = {
  background:
    "radial-gradient(circle at 50% 38%, rgba(59,130,246,0.22), transparent 42%), linear-gradient(160deg,#0C1220,#06080D)",
};

const PORTRAIT_TINT: React.CSSProperties = {
  background:
    "linear-gradient(to top, rgba(4,7,14,0.92), rgba(4,7,14,0) 55%), linear-gradient(135deg, rgba(37,99,235,0.14), transparent 45%)",
};

/**
 * Infinite loops as pure CSS keyframes: they run on the compositor instead of
 * the main thread (framer animates `x`/`y` with JS), and can be paused
 * off-screen with animation-play-state.
 */
const KEYFRAMES = `
@keyframes hero-drift{0%,100%{transform:translateX(-54%);opacity:.8}50%{transform:translateX(-46%);opacity:1}}
@keyframes hero-scan{0%{transform:translateY(-100%)}100%{transform:translateY(280%)}}
`;

const rise = (reduced: boolean, delay: number, distance = 24) => ({
  initial: { opacity: 0, y: reduced ? 0 : distance },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: EASE },
});

/* ==========================================================================
   HOOKS
   ========================================================================== */

/** True while the element intersects the viewport. */
function useInView(
  ref: React.RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);

    return () => io.disconnect();
  }, [ref, enabled]);

  return inView;
}

type PointerShared = { x: number; y: number; last: number };

/* ==========================================================================
   ANIMATED BACKGROUND — perspective field of luminous contour lines.

   Same look as before. What changed under the hood:
   - sin(a + phase) is expanded (sin·cos + cos·sin) with the x-dependent half
     precomputed once, so the per-point cost is a few multiplies, no trig.
   - Pointer falloff (exp) only runs for points near the pointer.
   - Per-line strokeStyle/lineWidth/baseY/amp are precomputed.
   - Bloom fills a 520px box instead of the full canvas.
   - Idle = 30fps (motion is slow), full rate while the pointer is active.
   - Pointer smoothing is time-based, so it feels the same at any FPS.
   - Runs only while visible, tab-visible and not reduced-motion.
   - One shared pointer source (no extra window listener, no rect reads).
   ========================================================================== */

function ContourField({
  reduced,
  active,
  pointer,
}: {
  reduced: boolean;
  active: boolean;
  pointer: React.MutableRefObject<PointerShared>;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const syncRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const R = 150 * 3.5; // beyond this the bend is < 0.1px
    const R2 = R * R;
    const INV = 1 / (2 * 150 * 150);

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let running = false;
    let lastDraw = 0;
    let resizeRaf = 0;

    let lines = 0;
    let step = 8;
    let cols = 0;
    let sinA = new Float32Array(0);
    let cosA = new Float32Array(0);
    let sinB = new Float32Array(0);
    let cosB = new Float32Array(0);
    let phase1 = new Float32Array(0);
    let phase2 = new Float32Array(0);
    let baseYs = new Float32Array(0);
    let amps = new Float32Array(0);
    let widths = new Float32Array(0);
    let strokes: string[] = [];

    const smooth = { x: -999, y: -999 };

    const build = () => {
      const mobile = w < 640;
      lines = mobile ? 24 : 42;
      step = mobile ? 10 : 8;
      cols = Math.floor((w + step) / step) + 1;

      sinA = new Float32Array(cols);
      cosA = new Float32Array(cols);
      sinB = new Float32Array(cols);
      cosB = new Float32Array(cols);

      for (let k = 0; k < cols; k++) {
        const nx = (k * step) / w;
        sinA[k] = Math.sin(nx * 5.2);
        cosA[k] = Math.cos(nx * 5.2);
        sinB[k] = Math.sin(nx * 11.5);
        cosB[k] = Math.cos(nx * 11.5);
      }

      phase1 = new Float32Array(lines);
      phase2 = new Float32Array(lines);
      baseYs = new Float32Array(lines);
      amps = new Float32Array(lines);
      widths = new Float32Array(lines);
      strokes = new Array(lines);

      for (let i = 0; i < lines; i++) {
        const p = i / (lines - 1);
        const depth = Math.pow(p, 1.7);
        phase1[i] = i * 0.16;
        phase2[i] = -i * 0.28;
        baseYs[i] = h * (0.36 + 0.7 * depth);
        amps[i] = 4 + 54 * depth;
        widths[i] = 0.6 + depth * 0.7;
        strokes[i] = `rgba(96,165,250,${0.03 + 0.2 * depth})`;
      }
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);

      const t = time * 0.00035;
      const px = smooth.x;
      const py = smooth.y;
      const hasPointer = px > -900;

      for (let i = 0; i < lines; i++) {
        const ph1 = phase1[i] + t * 1.1;
        const ph2 = phase2[i] - t * 0.8;
        const s1 = Math.sin(ph1);
        const c1 = Math.cos(ph1);
        const s2 = Math.sin(ph2);
        const c2 = Math.cos(ph2);
        const base = baseYs[i];
        const a1 = amps[i];
        const a2 = a1 * 0.38;

        ctx.beginPath();
        for (let k = 0; k < cols; k++) {
          const x = k * step;
          let y =
            base +
            (sinA[k] * c1 + cosA[k] * s1) * a1 +
            (sinB[k] * c2 + cosB[k] * s2) * a2;

          if (hasPointer) {
            const dx = x - px;
            if (dx < R && dx > -R) {
              const dy = y - py;
              const d2 = dx * dx + dy * dy;
              if (d2 < R2) y -= Math.exp(-d2 * INV) * 34;
            }
          }

          if (k === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = strokes[i];
        ctx.lineWidth = widths[i];
        ctx.stroke();
      }

      if (hasPointer) {
        const g = ctx.createRadialGradient(px, py, 0, px, py, 260);
        g.addColorStop(0, "rgba(59,130,246,0.10)");
        g.addColorStop(1, "rgba(59,130,246,0)");
        ctx.fillStyle = g;
        ctx.fillRect(px - 260, py - 260, 520, 520);
      }
    };

    const resize = () => {
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      if (!cw || !ch) return;

      dpr = Math.min(window.devicePixelRatio || 1, cw < 640 ? 1.5 : 2);

      const bw = Math.round(cw * dpr);
      const bh = Math.round(ch * dpr);

      /* assigning width/height clears + reallocates: only when it changed */
      if (bw !== canvas.width || bh !== canvas.height) {
        canvas.width = bw;
        canvas.height = bh;
      }

      w = cw;
      h = ch;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();

      if (!running) draw(0);
    };

    const loop = (time: number) => {
      if (!running) return;
      raf = requestAnimationFrame(loop);

      const p = pointer.current;
      const hot = time - p.last < 700;
      const minGap = hot ? 14 : 30; // 60fps+ while interacting, ~30fps idle

      if (time - lastDraw < minGap) return;

      const dt = Math.min((time - lastDraw) / 1000, 0.1);
      const k = 1 - Math.exp(-dt * 4.35); // ≈ old 0.07 per frame at 60fps
      smooth.x += (p.x - smooth.x) * k;
      smooth.y += (p.y - smooth.y) * k;
      lastDraw = time;

      draw(time);
    };

    const sync = () => {
      const shouldRun = activeRef.current && !document.hidden && !reduced;

      if (shouldRun && !running) {
        running = true;
        lastDraw = performance.now();
        raf = requestAnimationFrame(loop);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    syncRef.current = sync;

    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(resize);
    });
    ro.observe(canvas);

    resize();
    draw(0);
    sync();

    document.addEventListener("visibilitychange", sync);

    return () => {
      running = false;
      syncRef.current = null;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizeRaf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [reduced, pointer]);

  /* start/stop when the hero enters/leaves the viewport */
  useEffect(() => {
    activeRef.current = active;
    syncRef.current?.();
  }, [active]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      style={{ maskImage: CANVAS_MASK, WebkitMaskImage: CANVAS_MASK }}
    />
  );
}

/* ==========================================================================
   MAGNETIC WRAPPER — subtle pull toward the pointer on the primary CTA
   ========================================================================== */

function Magnetic({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (disabled || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.22);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.22);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

/* ==========================================================================
   PORTRAIT — tilting, light-catching identity plate
   ========================================================================== */

function Portrait({
  avatarUrl,
  identity,
  initials,
  username,
  location,
  reduced,
}: {
  avatarUrl: string | null;
  identity: string | null;
  initials: string;
  username: string | null;
  location: string | null;
  reduced: boolean;
}) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 140, damping: 20 });
  const sy = useSpring(my, { stiffness: 140, damping: 20 });

  const rotateY = useTransform(sx, [0, 1], [reduced ? 0 : -7, reduced ? 0 : 7]);
  const rotateX = useTransform(sy, [0, 1], [reduced ? 0 : 6, reduced ? 0 : -6]);
  const glowX = useTransform(sx, [0, 1], ["0%", "100%"]);
  const glowY = useTransform(sy, [0, 1], ["0%", "100%"]);
  const glow = useMotionTemplate`radial-gradient(circle at ${glowX} ${glowY}, rgba(96,165,250,0.28), transparent 55%)`;

  const showImage = Boolean(avatarUrl && validUrl(avatarUrl));

  const plateStyle = useMemo(
    () => ({
      rotateX,
      rotateY,
      transformStyle: "preserve-3d" as const,
      clipPath: CUT,
    }),
    [rotateX, rotateY],
  );

  return (
    <div className="relative w-full max-w-[400px] [perspective:1200px] lg:justify-self-end">
      <motion.div
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        style={plateStyle}
        className="relative bg-gradient-to-b from-blue-300/40 via-white/[0.08] to-blue-500/30 p-px"
      >
        <div
          style={CUT_STYLE}
          className="relative aspect-[4/5] overflow-hidden bg-[#070A10]"
        >
          {showImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl as string}
              alt={identity ? `${identity} profile` : "Portfolio profile"}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="h-full w-full object-cover saturate-[0.85] contrast-[1.05]"
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex h-full w-full items-center justify-center"
              style={PLACEHOLDER_BG}
            >
              <span className="font-[var(--font-bricolage)] text-[clamp(4.5rem,9vw,7.5rem)] font-medium tracking-[-0.06em] text-white/85">
                {initials}
              </span>
            </div>
          )}

          {/* Blue tint that pools at the base, keeping the photo in the palette */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={PORTRAIT_TINT}
          />

          {/* Cursor-following sheen */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 mix-blend-screen"
            style={{ background: glow }}
          />

          {(identity || username) && (
            <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
              <div className="min-w-0">
                {identity && (
                  <p className="truncate font-[var(--font-inter)] text-[13px] font-medium text-white">
                    {identity}
                  </p>
                )}
                {username && (
                  <p className="mt-0.5 truncate font-[var(--font-inter)] text-xs text-white/45">
                    @{username.replace(/^@/, "")}
                  </p>
                )}
              </div>
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400 shadow-[0_0_14px_3px_rgba(59,130,246,0.75)]"
              />
            </div>
          )}
        </div>
      </motion.div>

      {location && (
        <p className="mt-4 flex items-center gap-2 font-[var(--font-inter)] text-xs text-white/40">
          <span className="h-px w-6 bg-blue-400/60" />
          Based in <span className="text-white/70">{location}</span>
        </p>
      )}
    </div>
  );
}

/* ==========================================================================
   HERO
   ========================================================================== */

export default function HeroDefault({ config }: ThemeSectionProps) {
  const reducedMotion = Boolean(useReducedMotion());
  const data = useMemo(() => getHeroData(config), [config]);

  const shouldRender = Boolean(
    data.identity ||
      data.headline ||
      data.description ||
      data.avatarUrl ||
      data.eyebrow,
  );

  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, shouldRender);

  /* single pointer source shared by the spotlight and the canvas */
  const pointerRef = useRef<PointerShared>({ x: -999, y: -999, last: 0 });

  /* spotlight = offset from its resting point (50% / 30%), moved via transform */
  const spotX = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const spotY = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });

  useEffect(() => {
    const el = sectionRef.current;
    if (!shouldRender || !el) return;

    let rect = el.getBoundingClientRect();
    let dirty = false;

    const markDirty = () => {
      dirty = true;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;

      /* rect only re-read after scroll/resize, not on every move */
      if (dirty) {
        rect = el.getBoundingClientRect();
        dirty = false;
      }

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const p = pointerRef.current;

      p.x = x;
      p.y = y;
      p.last = performance.now();

      spotX.set(x - rect.width * 0.5);
      spotY.set(y - rect.height * 0.3);
    };

    const onLeave = () => {
      pointerRef.current.x = -999;
      pointerRef.current.y = -999;
    };

    el.addEventListener("pointerenter", markDirty, { passive: true });
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("scroll", markDirty, { passive: true });
    window.addEventListener("resize", markDirty, { passive: true });

    return () => {
      el.removeEventListener("pointerenter", markDirty);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", markDirty);
      window.removeEventListener("resize", markDirty);
    };
  }, [shouldRender, spotX, spotY]);

  if (!shouldRender) return null;

  const primaryLink =
    data.primaryLabel && data.primaryHref && validUrl(data.primaryHref)
      ? { label: data.primaryLabel, href: data.primaryHref }
      : null;
  const secondaryLink =
    data.secondaryLabel && data.secondaryHref && validUrl(data.secondaryHref)
      ? { label: data.secondaryLabel, href: data.secondaryHref }
      : null;

  const headlineLines = splitHeadline(data.headline ?? data.identity ?? "");
  const hasHeadline = Boolean(data.headline ?? data.identity);
  const hasVisual =
    Boolean(data.avatarUrl && validUrl(data.avatarUrl)) ||
    Boolean(data.initials);

  const playState = inView ? "running" : "paused";

  return (
    <section
      ref={sectionRef}
      aria-label={
        data.identity
          ? `${data.identity} portfolio introduction`
          : "Portfolio introduction"
      }
      className="relative isolate min-h-[100svh] overflow-hidden bg-[#04060B] text-white"
    >
      <style>{KEYFRAMES}</style>

      {/* ------------------------------ BACKGROUND ------------------------------ */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* Slow ambient light (CSS keyframes, paused off-screen).
            The old 140px blur was redundant: the gradient already fades to
            transparent before the circle's edge. */}
        <div
          className="absolute -top-[30rem] left-1/2 h-[60rem] w-[60rem] rounded-full"
          style={{
            background: AMBIENT_BG,
            transform: "translateX(-50%)",
            willChange: reducedMotion ? undefined : "transform, opacity",
            animation: reducedMotion
              ? undefined
              : "hero-drift 18s ease-in-out infinite",
            animationPlayState: playState,
          }}
        />

        <ContourField
          reduced={reducedMotion}
          active={inView}
          pointer={pointerRef}
        />

        {/* Spotlight: fixed 1280px gradient bitmap, moved with a transform */}
        <motion.div
          className="absolute"
          style={{
            left: "50%",
            top: "30%",
            width: 1280,
            height: 1280,
            marginLeft: -640,
            marginTop: -640,
            background: SPOTLIGHT_BG,
            x: spotX,
            y: spotY,
            willChange: "transform",
          }}
        />

        {/* Film grain keeps the black from banding and reads as material */}
        <div
          className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{ backgroundImage: GRAIN_BG }}
        />

        {/* Edge vignette */}
        <div
          className="absolute inset-0"
          style={{ background: VIGNETTE_BG }}
        />
      </div>

      {/* -------------------------------- CONTENT -------------------------------- */}
      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-[1480px] flex-col px-5 pb-8 pt-5 sm:px-8 lg:px-12 xl:px-16">
        {/* Composition */}
        <div className="flex flex-1 items-center">
          <div className="grid w-full gap-12 py-14 sm:py-16 lg:grid-cols-12 lg:items-end lg:gap-8 lg:py-20">
            {/* Type column */}
            <div className="relative z-10 lg:col-span-8">
              {hasHeadline && (
                <h1
                  className="max-w-[1100px] font-[var(--font-bricolage)] text-[clamp(2.9rem,7.4vw,8.25rem)] font-medium leading-[0.9] tracking-[-0.055em] text-transparent"
                  style={H1_STYLE}
                >
                  {headlineLines.map((line, index) => (
                    <span
                      key={`${line}-${index}`}
                      className="block overflow-hidden pb-[0.08em]"
                    >
                      <motion.span
                        className="block"
                        initial={{ y: reducedMotion ? 0 : "108%" }}
                        animate={{ y: 0 }}
                        transition={{
                          duration: 1.1,
                          delay: 0.12 + index * 0.1,
                          ease: EASE,
                        }}
                      >
                        {line}
                      </motion.span>
                    </span>
                  ))}
                </h1>
              )}

              {(data.description || primaryLink || secondaryLink) && (
                <motion.div
                  {...rise(reducedMotion, 0.45, 18)}
                  className="mt-10 flex flex-col gap-9 sm:mt-12 sm:flex-row sm:items-center sm:gap-14"
                >
                  {data.description && (
                    <p className="max-w-[500px] border-l border-blue-400/40 pl-5 font-[var(--font-inter)] text-[15px] leading-7 text-white/55">
                      {data.description}
                    </p>
                  )}

                  {(primaryLink || secondaryLink) && (
                    <div className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-3">
                      {primaryLink && (
                        <Magnetic disabled={reducedMotion}>
                          <Link
                            href={primaryLink.href}
                            style={CUT_STYLE}
                            className="group relative inline-flex bg-gradient-to-br from-blue-300/70 via-blue-500/40 to-blue-600/70 p-px outline-none transition-shadow duration-500 hover:shadow-[0_0_44px_-6px_rgba(59,130,246,0.65)] focus-visible:ring-2 focus-visible:ring-blue-300"
                          >
                            <span
                              style={CUT_STYLE}
                              className="relative flex min-h-12 items-center gap-4 overflow-hidden bg-[#070B14] px-6 font-[var(--font-inter)] text-sm font-medium text-white"
                            >
                              <span
                                aria-hidden="true"
                                className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-blue-300/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[320%]"
                              />
                              <span className="relative">
                                {primaryLink.label}
                              </span>
                              <svg
                                aria-hidden="true"
                                viewBox="0 0 16 16"
                                className="relative h-3.5 w-3.5 text-blue-300 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              >
                                <path d="M4 12L12 4M5.5 4H12v6.5" />
                              </svg>
                            </span>
                          </Link>
                        </Magnetic>
                      )}

                      {secondaryLink && (
                        <Link
                          href={secondaryLink.href}
                          className="group relative inline-flex min-h-12 items-center font-[var(--font-inter)] text-sm text-white/55 outline-none transition-colors duration-300 hover:text-white focus-visible:text-white focus-visible:ring-2 focus-visible:ring-blue-400/60"
                        >
                          {secondaryLink.label}
                          <span
                            aria-hidden="true"
                            className="absolute inset-x-0 bottom-2.5 h-px origin-left scale-x-0 bg-blue-400 transition-transform duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                          />
                        </Link>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Visual column */}
            {hasVisual && (
              <motion.div
                {...rise(reducedMotion, 0.3, 30)}
                className="relative lg:col-span-4 lg:pb-2"
              >
                <Portrait
                  avatarUrl={data.avatarUrl}
                  identity={data.identity}
                  initials={data.initials}
                  username={data.username}
                  location={data.location}
                  reduced={reducedMotion}
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex items-center gap-4 border-t border-white/[0.07] pt-5"
        >
          <span className="relative h-8 w-px overflow-hidden bg-white/10">
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-3 bg-blue-400"
              style={{
                animation: reducedMotion
                  ? undefined
                  : "hero-scan 2.2s ease-in-out infinite",
                animationPlayState: playState,
              }}
            />
          </span>
          <span className="font-[var(--font-inter)] text-xs text-white/35">
            Scroll to explore the work
          </span>
        </motion.div>
      </div>
    </section>
  );
}