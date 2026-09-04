"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { PortfolioRenderConfig, PublicProfileMeta } from "../../types";

export function HeroModern({
  config,
  profile,
}: {
  config: PortfolioRenderConfig;
  profile: PublicProfileMeta;
}) {
  const name = config.name || profile.fullName || profile.username;
  const avatar = config.avatarUrl || profile.avatarUrl;

  // Magnetic / 3D tilt for avatar
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = (e.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(offsetX);
    y.set(offsetY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Soft ambient glow + noise texture */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,229,199,0.12),transparent_70%)] blur-3xl" />
        <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.04),transparent_70%)] blur-2xl" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative grid items-center gap-12 md:grid-cols-[1.15fr_0.85fr] md:gap-16">
        {/* Left content */}
        <div className="space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 text-[13px] font-medium tracking-wide text-[#00e5c7]"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00e5c7] opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#00e5c7]" />
            </span>
            Portfolio
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-[3.35rem] md:leading-[1.12]"
          >
            {name}
          </motion.h1>

          {config.headline && (
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.16,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="max-w-xl text-lg font-medium leading-relaxed text-white/80"
            >
              {config.headline}
            </motion.p>
          )}

          {config.about && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.24,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="max-w-xl text-[15px] leading-relaxed text-white/55 line-clamp-4"
            >
              {config.about}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.32,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-wrap gap-3 pt-3"
          >
            {config.resumeUrl && (
              <a
                href={config.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-5 py-2.5 text-sm font-medium text-[#050505] transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
              >
                {/* Glass + gradient fill */}
                <span className="absolute inset-0 rounded-xl bg-gradient-to-b from-[#00e5c7] to-[#00c4a7]" />
                <span className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)]" />
                <span className="relative flex items-center gap-2">
                  Download Resume
                  <svg
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </span>
              </a>
            )}

            {config.githubUrl && (
              <a
                href={config.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-white/90 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
              >
                <span className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_0%,rgba(0,229,199,0.12),transparent_70%)]" />
                <span className="relative">GitHub</span>
              </a>
            )}

            {config.linkedinUrl && (
              <a
                href={config.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-white/90 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
              >
                <span className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_0%,rgba(0,229,199,0.12),transparent_70%)]" />
                <span className="relative">LinkedIn</span>
              </a>
            )}
          </motion.div>
        </div>

        {/* Right – Avatar with 3D tilt + glass frame */}
        {avatar && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex justify-center md:justify-end"
          >
            <div
              ref={ref}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative"
              style={{ perspective: "1000px" }}
            >
              {/* Outer soft glow ring */}
              <div className="absolute -inset-4 rounded-[28px] bg-gradient-to-br from-[#00e5c7]/20 via-transparent to-white/5 blur-xl" />

              <motion.div
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                }}
                className="relative"
              >
                {/* Glass frame */}
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_25px_50px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl">
                  {/* Inner highlight line */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                  <img
                    src={avatar}
                    alt={name}
                    className="h-48 w-48 rounded-[14px] object-cover sm:h-56 sm:w-56 md:h-60 md:w-60"
                    style={{
                      borderRadius: "var(--pr-radius, 14px)",
                      transform: "translateZ(20px)",
                    }}
                  />

                  {/* Subtle bottom reflection */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 rounded-b-[14px] bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                {/* Floating accent orb */}
                <div className="absolute -bottom-3 -right-3 h-16 w-16 rounded-full bg-[#00e5c7]/15 blur-2xl" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
