"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/UI/Button";

const words = ["developers.", "designers.", "students.", "freelancers.", "you."];

function RotatingWord() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), 2200);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="relative inline-grid">
      {words.map((w, i) => (
        <motion.span
          key={w}
          className="col-start-1 row-start-1 text-gradient-ion"
          initial={false}
          animate={{
            opacity: i === index ? 1 : 0,
            y: i === index ? 0 : 10,
            filter: i === index ? "blur(0px)" : "blur(4px)",
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {w}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
      <div className="bg-aurora pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="bg-grain pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3.5 py-1.5 text-xs text-muted-foreground backdrop-blur"
        >
          <span className="flex h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
          AI-assisted portfolio builder
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="text-display-2 md:text-display-1 text-balance text-foreground"
        >
          A portfolio built
          <br className="hidden md:block" /> for <RotatingWord />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-body-lg mx-auto mt-6 max-w-xl text-balance"
        >
          Bring your projects, experience and resume — Orixa turns it into a
          fast, professional website with a URL you can share today. No code,
          no template guesswork, no guessing what happens after someone
          visits.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link href="/auth/signup">
            <Button variant="gradient" size="lg" className="w-full sm:w-auto">
              Build your portfolio — it&rsquo;s free
            </Button>
          </Link>
          <a href="#showcase">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              See it in action
            </Button>
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-caption mt-5"
        >
          NO CREDIT CARD · LIVE IN MINUTES · YOUR OWN ORIXA.AI/USERNAME
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto mt-20 max-w-5xl px-6"
      >
        <div className="border-gradient-ion shadow-glow-primary overflow-hidden rounded-2xl">
          <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-error/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
            <span className="text-caption ml-3 normal-case tracking-normal">
              orixa.ai/jordan/product-designer
            </span>
          </div>
          <div className="grid gap-4 bg-surface p-6 sm:grid-cols-3 md:p-10">
            <div className="sm:col-span-2 space-y-4">
              <div className="h-4 w-2/3 animate-shimmer rounded" />
              <div className="h-3 w-1/2 animate-shimmer rounded" />
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="h-24 animate-shimmer rounded-xl" />
                <div className="h-24 animate-shimmer rounded-xl" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-20 w-20 animate-shimmer rounded-full" />
              <div className="h-3 w-full animate-shimmer rounded" />
              <div className="h-3 w-3/4 animate-shimmer rounded" />
              <div className="h-9 w-full animate-shimmer rounded-lg" />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
