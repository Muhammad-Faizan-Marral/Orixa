"use client";

import React, { useEffect, useMemo, useRef } from "react";
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

function getHeroData(config: unknown, profile: unknown) {
  const configRecord = asRecord(config);
  const profileRecord = asRecord(profile);
  const nestedContent = asRecord(configRecord?.content);
  const portfolio = asRecord(configRecord?.portfolio);
  const hero = asRecord(configRecord?.hero);

  const sources = [hero, portfolio, nestedContent, configRecord, profileRecord];

  // const name = firstString(sources, ["fullName", "name", "displayName"]);
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
      [hero, profileRecord, portfolio, nestedContent, configRecord],
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
   DESIGN TOKENS
   ========================================================================== */

const EASE = [0.16, 1, 0.3, 1] as const;
const CUT = "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)";

/* ==========================================================================
   ANIMATED BACKGROUND — a perspective field of luminous contour lines.
   Lines rise from a horizon, swell with layered sine waves, and bend away
   from / light up around the pointer. Pauses when off-screen or hidden.
   ========================================================================== */

function ContourField({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    const pointer = { x: -999, y: -999, tx: -999, ty: -999 };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      pointer.x += (pointer.tx - pointer.x) * 0.07;
      pointer.y += (pointer.ty - pointer.y) * 0.07;

      const lines = w < 640 ? 24 : 42;
      const step = w < 640 ? 10 : 8;
      const t = time * 0.00035;

      for (let i = 0; i < lines; i++) {
        const p = i / (lines - 1);
        const depth = Math.pow(p, 1.7);
        const baseY = h * (0.36 + 0.7 * depth);
        const amp = 4 + 54 * depth;
        const alpha = 0.03 + 0.2 * depth;

        ctx.beginPath();
        for (let x = 0; x <= w + step; x += step) {
          const nx = x / w;
          let y =
            baseY +
            Math.sin(nx * 5.2 + i * 0.16 + t * 1.1) * amp +
            Math.sin(nx * 11.5 - i * 0.28 - t * 0.8) * amp * 0.38;

          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const falloff = Math.exp(-(dx * dx + dy * dy) / (2 * 150 * 150));
          y -= falloff * 34;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(96,165,250,${alpha})`;
        ctx.lineWidth = 0.6 + depth * 0.7;
        ctx.stroke();
      }

      // Pointer bloom lives on the canvas so it follows the lines
      if (pointer.x > -900) {
        const g = ctx.createRadialGradient(
          pointer.x,
          pointer.y,
          0,
          pointer.x,
          pointer.y,
          260,
        );
        g.addColorStop(0, "rgba(59,130,246,0.10)");
        g.addColorStop(1, "rgba(59,130,246,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
    };

    const loop = (time: number) => {
      draw(time);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - r.left;
      pointer.ty = e.clientY - r.top;
    };
    const onLeave = () => {
      pointer.tx = -999;
      pointer.ty = -999;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    resize();
    draw(0);
    if (!reduced) start();

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    io.observe(canvas);

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent 8%, black 45%, black 88%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 8%, black 45%, black 88%, transparent)",
      }}
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
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          clipPath: CUT,
        }}
        className="relative bg-gradient-to-b from-blue-300/40 via-white/[0.08] to-blue-500/30 p-px"
      >
        <div
          style={{ clipPath: CUT }}
          className="relative aspect-[4/5] overflow-hidden bg-[#070A10]"
        >
          {showImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl as string}
              alt={identity ? `${identity} profile` : "Portfolio profile"}
              loading="eager"
              className="h-full w-full object-cover saturate-[0.85] contrast-[1.05]"
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex h-full w-full items-center justify-center"
              style={{
                background:
                  "radial-gradient(circle at 50% 38%, rgba(59,130,246,0.22), transparent 42%), linear-gradient(160deg,#0C1220,#06080D)",
              }}
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
            style={{
              background:
                "linear-gradient(to top, rgba(4,7,14,0.92), rgba(4,7,14,0) 55%), linear-gradient(135deg, rgba(37,99,235,0.14), transparent 45%)",
            }}
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

export default function HeroDefault({ config, profile }: ThemeSectionProps) {
  const reducedMotion = Boolean(useReducedMotion());
  const data = useMemo(() => getHeroData(config, profile), [config, profile]);

  // Spotlight follows the pointer across the whole section
  const px = useSpring(useMotionValue(50), { stiffness: 60, damping: 20 });
  const py = useSpring(useMotionValue(30), { stiffness: 60, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(640px circle at ${px}% ${py}%, rgba(37,99,235,0.16), transparent 62%)`;

  if (
    !data.identity &&
    !data.headline &&
    !data.description &&
    !data.avatarUrl &&
    !data.eyebrow
  ) {
    return null;
  }

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

  const rise = (delay: number, distance = 24) => ({
    initial: { opacity: 0, y: reducedMotion ? 0 : distance },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: EASE },
  });

  return (
    <section
      aria-label={
        data.identity
          ? `${data.identity} portfolio introduction`
          : "Portfolio introduction"
      }
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        px.set(((e.clientX - r.left) / r.width) * 100);
        py.set(((e.clientY - r.top) / r.height) * 100);
      }}
      className="relative isolate min-h-[100svh] overflow-hidden bg-[#04060B] text-white"
    >
      {/* ------------------------------ BACKGROUND ------------------------------ */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* Slow ambient light, drifting on its own clock */}
        <motion.div
          className="absolute -top-[30rem] left-1/2 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full blur-[140px]"
          style={{
            background:
              "radial-gradient(circle, rgba(37,99,235,0.18), rgba(30,64,175,0.06) 40%, transparent 68%)",
          }}
          animate={
            reducedMotion
              ? undefined
              : { x: ["-54%", "-46%", "-54%"], opacity: [0.8, 1, 0.8] }
          }
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        <ContourField reduced={reducedMotion} />

        <motion.div
          className="absolute inset-0"
          style={{ background: spotlight }}
        />

        {/* Film grain keeps the black from banding and reads as material */}
        <div
          className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />

        {/* Edge vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(2,3,6,0.85) 100%)",
          }}
        />
      </div>

      {/* -------------------------------- CONTENT -------------------------------- */}
      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-[1480px] flex-col px-5 pb-8 pt-5 sm:px-8 lg:px-12 xl:px-16">
        {/* Header */}
        {/* <motion.header
          {...rise(0, -10)}
          className="flex h-14 items-center justify-between gap-4 border-b border-white/[0.07]"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden="true"
              className="relative flex h-7 w-7 shrink-0 items-center justify-center border border-blue-400/30 bg-blue-500/[0.06]"
              style={{ clipPath: CUT }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_12px_3px_rgba(59,130,246,0.8)]" />
            </span>
            {data.identity && (
              <span className="truncate font-[var(--font-inter)] text-[13px] font-medium text-white/75">
                {data.identity}
              </span>
            )}
          </div>

          {data.eyebrow && (
            <span className="inline-flex max-w-[60%] items-center gap-2.5 truncate rounded-full border border-white/10 bg-white/[0.03] py-1.5 pl-2.5 pr-3.5 font-[var(--font-inter)] text-xs text-white/65 backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                {!reducedMotion && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400/60" />
                )}
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-400" />
              </span>
              <span className="truncate">{data.eyebrow}</span>
            </span>
          )}
        </motion.header> */}

        {/* Composition */}
        <div className="flex flex-1 items-center">
          <div className="grid w-full gap-12 py-14 sm:py-16 lg:grid-cols-12 lg:items-end lg:gap-8 lg:py-20">
            {/* Type column */}
            <div className="relative z-10 lg:col-span-8">
              {hasHeadline && (
                <h1
                  className="max-w-[1100px] font-[var(--font-bricolage)] text-[clamp(2.9rem,7.4vw,8.25rem)] font-medium leading-[0.9] tracking-[-0.055em] text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(180deg,#fff 0%,#F1F5FF 45%,rgba(147,197,253,0.62) 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                  }}
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
                  {...rise(0.45, 18)}
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
                            style={{ clipPath: CUT }}
                            className="group relative inline-flex bg-gradient-to-br from-blue-300/70 via-blue-500/40 to-blue-600/70 p-px outline-none transition-shadow duration-500 hover:shadow-[0_0_44px_-6px_rgba(59,130,246,0.65)] focus-visible:ring-2 focus-visible:ring-blue-300"
                          >
                            <span
                              style={{ clipPath: CUT }}
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
                {...rise(0.3, 30)}
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
            <motion.span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-3 bg-blue-400"
              animate={reducedMotion ? undefined : { y: ["-100%", "280%"] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
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
