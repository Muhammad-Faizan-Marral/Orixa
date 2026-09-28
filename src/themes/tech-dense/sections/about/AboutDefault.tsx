"use client";

import { useMemo, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

import type { ThemeSectionProps } from "../../../types";

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

function validImageUrl(value: string | null): boolean {
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

function getAboutData(config: unknown) {
  const root = asRecord(config);
  const content = asRecord(root?.content);
  const portfolio = asRecord(root?.portfolio);
  const profile = asRecord(root?.profile);
  const about = asRecord(root?.about);

  const sources = [about, portfolio, content, profile, root];

  const name = firstString(sources, ["fullName", "name", "displayName"]);
  const username = firstString(sources, ["username", "handle"]);

  const headline =
    firstString(sources, ["headline", "title", "role", "profession"]) ??
    nestedString(root, [
      ["about", "headline"],
      ["portfolio", "headline"],
      ["content", "headline"],
      ["profile", "headline"],
    ]);

  const aboutText =
    firstString(sources, ["about", "bio", "description", "summary", "aboutText"]) ??
    nestedString(root, [
      ["about", "description"],
      ["about", "bio"],
      ["portfolio", "about"],
      ["content", "about"],
      ["profile", "bio"],
    ]);

  const avatarUrl =
    firstString(
      [about, profile, portfolio, content, root],
      ["avatarUrl", "imageUrl", "image", "photoUrl", "profileImage"],
    ) ??
    nestedString(root, [
      ["profile", "avatarUrl"],
      ["about", "avatarUrl"],
      ["portfolio", "avatarUrl"],
    ]);

  const location = firstString(sources, ["location", "city"]);
  const identity = name ?? username;

  return {
    name,
    username,
    headline,
    aboutText,
    avatarUrl,
    location,
    identity,
    initials: identity ? getInitials(identity) : "",
  };
}

/**
 * Splits the about copy into a short lead statement (set large) and the
 * remaining body, so the same text is never rendered twice.
 */
function splitAbout(value: string | null): { lead: string; body: string[] } {
  if (!value) return { lead: "", body: [] };

  const paragraphs = value
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const [first = "", ...rest] = paragraphs;
  const sentences = first.split(/(?<=[.!?])\s+/).filter(Boolean);

  let lead = "";
  let used = 0;
  for (const sentence of sentences) {
    if (lead && (lead + " " + sentence).length > 190) break;
    lead = lead ? `${lead} ${sentence}` : sentence;
    used += 1;
  }

  const remainder = sentences.slice(used).join(" ");
  return { lead, body: remainder ? [remainder, ...rest] : rest };
}

/* ==========================================================================
   DESIGN TOKENS
   ========================================================================== */

const EASE = [0.16, 1, 0.3, 1] as const;
const CUT = "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)";

/** Seamless looping contour path: period 400 so a 400px shift repeats exactly. */
function wavePath(row: number) {
  const y = 40 + row * 26;
  const amp = 6 + row * 2.2;
  const phase = row * 0.5;
  let d = "";
  for (let x = 0; x <= 2800; x += 20) {
    const yy =
      y + Math.sin(((x / 400) * Math.PI * 2) + phase) * amp;
    d += `${x === 0 ? "M" : "L"}${x} ${yy.toFixed(1)} `;
  }
  return d;
}

const WAVES = Array.from({ length: 12 }, (_, i) => wavePath(i));

/* ==========================================================================
   SCROLL-LINKED WORD REVEAL — the section's single signature moment
   ========================================================================== */

function Word({
  word,
  range,
  progress,
  reduced,
}: {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity: reduced ? 1 : opacity }} className="inline">
      {word}{" "}
    </motion.span>
  );
}

function ScrollStatement({
  text,
  reduced,
}: {
  text: string;
  reduced: boolean;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  return (
    <h2
      ref={ref}
      className="max-w-[860px] font-[var(--font-bricolage)] text-[clamp(1.9rem,3.9vw,4rem)] font-medium leading-[1.04] tracking-[-0.045em] text-white"
    >
      {words.map((word, i) => {
        const start = i / words.length;
        const end = Math.min(1, start + 1.6 / words.length);
        return (
          <Word
            key={`${word}-${i}`}
            word={word}
            range={[start, end]}
            progress={scrollYProgress}
            reduced={reduced}
          />
        );
      })}
    </h2>
  );
}

/* ==========================================================================
   SECTION
   ========================================================================== */

export function AboutDefault({ config }: ThemeSectionProps) {
  const reduced = Boolean(useReducedMotion());
  const data = getAboutData(config);
  const { lead, body } = useMemo(
    () => splitAbout(data.aboutText),
    [data.aboutText],
  );

  const sectionRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: storyProgress } = useScroll({
    target: storyRef,
    offset: ["start 0.7", "end 0.6"],
  });

  const glowY = useTransform(sectionProgress, [0, 1], ["-12%", "18%"]);
  const imageY = useTransform(sectionProgress, [0, 1], ["-5%", "5%"]);
  const lineScale = useSpring(storyProgress, { stiffness: 120, damping: 28 });

  if (!data.aboutText && !data.headline && !data.identity && !data.avatarUrl) {
    return null;
  }

  const hasImage = validImageUrl(data.avatarUrl);
  const hasVisual = hasImage || Boolean(data.initials);
  const statement = lead || data.headline || data.identity || "";
  const showHeadlineLine = Boolean(data.headline && lead);
  const hasFacts = Boolean(data.location || data.username);

  const fade = {
    initial: { opacity: 0, y: reduced ? 0 : 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.9, ease: EASE },
  } as const;

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="About"
      className="relative isolate overflow-hidden bg-[#04060B] text-white"
    >
      {/* ------------------------------ BACKGROUND ------------------------------ */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* Contour lines drifting sideways — same language as the hero field */}
        <div
          className="absolute inset-x-0 top-[8%] h-[520px] opacity-[0.55]"
          style={{
            maskImage:
              "radial-gradient(ellipse at 30% 50%, black 0%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 30% 50%, black 0%, transparent 70%)",
          }}
        >
          <motion.svg
            viewBox="0 0 2800 380"
            preserveAspectRatio="none"
            className="h-full w-[2800px] max-w-none"
            animate={reduced ? undefined : { x: [0, -400] }}
            transition={{ duration: 46, repeat: Infinity, ease: "linear" }}
            fill="none"
          >
            {WAVES.map((d, i) => (
              <path
                key={i}
                d={d}
                stroke="rgba(96,165,250,1)"
                strokeOpacity={0.05 + i * 0.012}
                strokeWidth="1"
              />
            ))}
          </motion.svg>
        </div>

        {/* Parallax light that travels with the scroll */}
        <motion.div
          className="absolute -left-64 top-0 h-[44rem] w-[44rem] rounded-full blur-[150px]"
          style={{
            y: reduced ? 0 : glowY,
            background:
              "radial-gradient(circle, rgba(37,99,235,0.14), transparent 68%)",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />

        <div
          className="absolute inset-x-0 bottom-0 h-40"
          style={{ background: "linear-gradient(to bottom, transparent, #04060B)" }}
        />
      </div>

      {/* -------------------------------- CONTENT -------------------------------- */}
      <div className="relative mx-auto w-full max-w-[1480px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40 xl:px-16">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          {/* Portrait — sticky while the story scrolls past */}
          {hasVisual && (
            <div className="lg:col-span-5">
              <motion.div {...fade} className="lg:sticky lg:top-24">
                <div
                  style={{ clipPath: CUT }}
                  className="relative max-w-[440px] bg-gradient-to-b from-blue-300/40 via-white/[0.08] to-blue-500/30 p-px"
                >
                  <div
                    style={{ clipPath: CUT }}
                    className="relative aspect-[4/5] overflow-hidden bg-[#070A10]"
                  >
                    {hasImage ? (
                      <motion.div
                        className="absolute -inset-[8%]"
                        style={{ y: reduced ? 0 : imageY }}
                      >
                        <Image
                          src={data.avatarUrl!}
                          alt={
                            data.identity
                              ? `${data.identity} profile`
                              : "Profile"
                          }
                          fill
                          sizes="(max-width: 1024px) 90vw, 440px"
                          className="object-cover saturate-[0.85] contrast-[1.05]"
                        />
                      </motion.div>
                    ) : (
                      <div
                        aria-hidden="true"
                        className="flex h-full w-full items-center justify-center"
                        style={{
                          background:
                            "radial-gradient(circle at 50% 40%, rgba(59,130,246,0.2), transparent 42%), linear-gradient(160deg,#0C1220,#06080D)",
                        }}
                      >
                        <span className="font-[var(--font-bricolage)] text-[clamp(5rem,10vw,8rem)] font-medium tracking-[-0.06em] text-white/85">
                          {data.initials}
                        </span>
                      </div>
                    )}

                    <div
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(4,7,14,0.9), rgba(4,7,14,0) 55%), linear-gradient(135deg, rgba(37,99,235,0.14), transparent 45%)",
                      }}
                    />

                    {data.identity && (
                      <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
                        <p className="truncate font-[var(--font-inter)] text-[13px] font-medium text-white">
                          {data.identity}
                        </p>
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400 shadow-[0_0_14px_3px_rgba(59,130,246,0.75)]"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Story */}
          <div
            className={
              hasVisual ? "lg:col-span-7 xl:pl-8" : "lg:col-span-10 lg:col-start-2"
            }
          >
            <div ref={storyRef} className="relative pl-6 sm:pl-10">
              {/* Reading-progress line: fills as the story is read */}
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 top-0 w-px bg-white/[0.08]"
              />
              <motion.span
                aria-hidden="true"
                className="absolute left-0 top-0 h-full w-px origin-top bg-gradient-to-b from-blue-300 via-blue-500 to-blue-500/0 shadow-[0_0_14px_rgba(59,130,246,0.7)]"
                style={{ scaleY: reduced ? 1 : lineScale }}
              />

              {showHeadlineLine && (
                <motion.p
                  {...fade}
                  className="mb-8 max-w-[520px] font-[var(--font-inter)] text-sm text-blue-200/60"
                >
                  {data.headline}
                </motion.p>
              )}

              {statement && (
                <ScrollStatement text={statement} reduced={reduced} />
              )}

              {body.length > 0 && (
                <motion.div
                  {...fade}
                  className="mt-12 max-w-[600px] space-y-6 font-[var(--font-inter)] text-[15px] leading-7 text-white/55 sm:mt-16"
                >
                  {body.map((paragraph, i) => (
                    <p key={`${paragraph.slice(0, 24)}-${i}`}>{paragraph}</p>
                  ))}
                </motion.div>
              )}

              {hasFacts && (
                <motion.dl
                  {...fade}
                  className="mt-14 flex flex-wrap gap-x-14 gap-y-6 border-t border-white/[0.08] pt-6 font-[var(--font-inter)]"
                >
                  {data.location && (
                    <div>
                      <dt className="text-xs text-white/35">Based in</dt>
                      <dd className="mt-1.5 text-sm text-white/80">
                        {data.location}
                      </dd>
                    </div>
                  )}
                  {data.username && (
                    <div>
                      <dt className="text-xs text-white/35">Handle</dt>
                      <dd className="mt-1.5 text-sm text-white/80">
                        @{data.username.replace(/^@/, "")}
                      </dd>
                    </div>
                  )}
                </motion.dl>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutDefault;