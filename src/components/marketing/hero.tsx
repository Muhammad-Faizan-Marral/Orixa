"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/UI/Button";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24 lg:pt-40">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(70% 55% at 70% 0%, color-mix(in srgb, var(--color-primary) 14%, transparent) 0%, transparent 55%), radial-gradient(40% 35% at 10% 40%, color-mix(in srgb, var(--color-accent) 8%, transparent) 0%, transparent 50%)",
        }}
      />
      <div className="bg-grain pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 md:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="text-caption mb-5"
          >
            AI-assisted portfolio builder
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.04, ease }}
            className="font-display text-[2.35rem] font-semibold leading-[1.08] tracking-[-0.03em] text-foreground sm:text-[2.85rem] md:text-[3.25rem] lg:text-[3.5rem]"
          >
            Your work deserves a
            <span className="text-gradient-ion"> portfolio</span>
            <br className="hidden sm:block" /> that works as hard as you do.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12, ease }}
            className="text-body-lg mt-6 max-w-md text-balance"
          >
            Bring projects, experience, and your resume. Orixa turns them into a
            fast, professional site with a shareable URL — so recruiters and
            clients see the best version of you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2, ease }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link href="/auth/signup">
              <Button variant="gradient" size="lg" className="w-full sm:w-auto">
                Build your portfolio free
              </Button>
            </Link>
            <a href="#how">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                See how it works
              </Button>
            </a>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-caption"
          >
            <li>No credit card</li>
            <li className="text-border-strong">·</li>
            <li>Live in minutes</li>
            <li className="text-border-strong">·</li>
            <li>orixa.ai/you</li>
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.18, ease }}
          className="relative"
        >
          <div className="border-gradient-ion shadow-glow-primary overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-4 py-2.5">
              <span className="h-2 w-2 rounded-full bg-error/60" />
              <span className="h-2 w-2 rounded-full bg-warning/60" />
              <span className="h-2 w-2 rounded-full bg-success/60" />
              <span className="text-caption ml-2 normal-case tracking-normal text-subtle-foreground">
                orixa.ai/jordan/product
              </span>
            </div>

            <div className="bg-surface p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 shrink-0 rounded-full bg-gradient-ion-soft ring-2 ring-primary/20" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-3.5 w-36 rounded-md bg-foreground/90" />
                  <div className="h-2.5 w-48 max-w-full rounded bg-muted-foreground/40" />
                  <div className="h-2.5 w-28 rounded bg-muted-foreground/25" />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="surface-panel space-y-2 p-3">
                  <div className="h-16 rounded-lg bg-gradient-to-br from-primary/25 to-accent/15" />
                  <div className="h-2 w-3/4 rounded bg-muted-foreground/30" />
                  <div className="h-2 w-1/2 rounded bg-muted-foreground/20" />
                </div>
                <div className="surface-panel space-y-2 p-3">
                  <div className="h-16 rounded-lg bg-gradient-to-br from-accent/20 to-primary/20" />
                  <div className="h-2 w-2/3 rounded bg-muted-foreground/30" />
                  <div className="h-2 w-1/2 rounded bg-muted-foreground/20" />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {["TypeScript", "Design systems", "AI products"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[0.7rem] text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.55, ease }}
            className="absolute -right-2 bottom-8 hidden rounded-xl border border-border bg-surface/95 px-3.5 py-2.5 shadow-elevated backdrop-blur sm:block lg:-right-4"
          >
            <p className="text-caption text-accent">Live</p>
            <p className="text-small mt-0.5 text-foreground">12 views today</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}