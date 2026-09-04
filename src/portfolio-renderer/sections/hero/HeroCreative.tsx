"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import type { PortfolioRenderConfig, PublicProfileMeta } from "../../types";

export function HeroCreative({
  config,
  profile,
}: {
  config: PortfolioRenderConfig;
  profile: PublicProfileMeta;
}) {
  const name = config.name || profile.fullName || profile.username;
  const avatar = config.avatarUrl || profile.avatarUrl;

  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const yImage = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);

  // Magnetic effect values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x * 0.15);
    mouseY.set(y * 0.15);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] overflow-hidden py-20 lg:py-28"
    >
      {/* Background ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-[var(--pr-accent,#6c5cff)] opacity-[0.07] blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[450px] w-[450px] rounded-full bg-[var(--pr-accent,#6c5cff)] opacity-[0.06] blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--pr-accent,#6c5cff)] opacity-[0.03] blur-[140px]" />
      </div>

      {/* Subtle noise texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left Content */}
          <motion.div style={{ y: yText, opacity }} className="relative z-10">
            {/* Availability Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--pr-accent,#6c5cff)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--pr-accent,#6c5cff)]" />
              </span>
              <span className="text-xs font-medium tracking-wide text-white/80">
                Available for opportunities
              </span>
            </motion.div>

            {/* Name + Headline */}
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl"
              >
                {name}
              </motion.h1>
            </div>

            <div className="mt-2 overflow-hidden">
              <motion.h2
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
                style={{ color: "var(--pr-accent, #6c5cff)" }}
              >
                {config.headline || "Creative Professional"}
              </motion.h2>
            </div>

            {/* About */}
            {config.about && (
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="mt-8 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg"
              >
                {config.about}
              </motion.p>
            )}

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 flex flex-wrap items-center gap-5"
            >
              {config.resumeUrl && (
                <motion.a
                  href={config.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    x: springX,
                    y: springY,
                    backgroundColor: "var(--pr-accent, #6c5cff)",
                    borderRadius: "var(--pr-radius, 14px)",
                  }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative inline-flex items-center gap-2 overflow-hidden px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[var(--pr-accent,#6c5cff)]/25"
                >
                  <span className="relative z-10">Explore My Work</span>
                  <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                  <div className="absolute inset-0 -z-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </motion.a>
              )}

              <div className="flex items-center gap-5">
                {config.githubUrl && (
                  <a
                    href={config.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group text-sm font-medium text-white/50 transition-colors hover:text-white"
                  >
                    GitHub
                    <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </a>
                )}

                {config.linkedinUrl && (
                  <a
                    href={config.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group text-sm font-medium text-white/50 transition-colors hover:text-white"
                  >
                    LinkedIn
                    <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Avatar */}
          {avatar && (
            <motion.div
              style={{ y: yImage }}
              className="relative flex justify-center lg:justify-end"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
                className="relative"
              >
                {/* Glow behind image */}
                <div
                  className="absolute -inset-8 rounded-[32px] opacity-40 blur-3xl"
                  style={{
                    background: `radial-gradient(circle at center, var(--pr-accent, #6c5cff) 0%, transparent 70%)`,
                  }}
                />

                {/* Floating ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-4 rounded-[28px] border border-dashed border-white/10"
                />

                {/* Main image container */}
                <div
                  className="relative h-64 w-64 overflow-hidden border border-white/10 shadow-2xl sm:h-72 sm:w-72 lg:h-80 lg:w-80"
                  style={{
                    borderRadius: "var(--pr-radius, 28px)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatar}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />

                  {/* Subtle overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                {/* Decorative floating element */}
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-6 -left-6 h-20 w-20 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl"
                />
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}