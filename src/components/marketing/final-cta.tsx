"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/UI/Button";

export function FinalCta() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-14 text-center sm:px-10 md:py-16"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-80"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(60% 80% at 50% 0%, color-mix(in srgb, var(--color-primary) 18%, transparent) 0%, transparent 60%)",
            }}
          />

          <div className="relative mx-auto max-w-xl">
            <h2 className="text-h1 text-balance">
              Your next opportunity starts with a clear portfolio.
            </h2>
            <p className="text-body-lg mt-4 text-balance">
              Create a professional site from the work you already have — free to start, live when you are ready.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/auth/signup">
                <Button variant="gradient" size="lg" className="w-full sm:w-auto">
                  Build your portfolio free
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Log in
                </Button>
              </Link>
            </div>
            <p className="text-caption mt-6">No credit card · Your own orixa.ai URL</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}