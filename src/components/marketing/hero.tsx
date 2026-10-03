"use client";

import Link from "next/link";
import { Button } from "@/components/UI/Button";
import { useState } from "react";

export function Hero() {
  const [showHint, setShowHint] = useState(false);

  return (
    <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
      {/* Subtle background accent */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-zinc-50 via-white to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-900" />
      
      <div className="mx-auto max-w-5xl px-5 text-center">
        {/* Small badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-sm text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          AI-assisted portfolio builder
        </div>

        {/* Main Headline - short & strong */}
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl md:text-6xl dark:text-white">
          Your work deserves
          <br />
          <span className="bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-white dark:to-zinc-400">
            more than a template
          </span>
        </h1>

        {/* Supporting line - max 2 lines */}
        <p className="mx-auto mt-5 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Turn your projects, skills, and resume into a portfolio that actually feels like you.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="w-full sm:w-auto px-8">
            <Link href="/auth/signup">
              Build your portfolio free
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto px-8">
            <Link href="/design-lab">
              Explore designs
            </Link>
          </Button>
        </div>

        {/* Soft secret teaser - optional, non-blocking */}
        <div className="mt-10">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-sm text-zinc-500 transition hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-300"
          >
            {showHint ? "There's a little secret hiding on this page..." : "There's a little secret on this page"}
          </button>
          
          {showHint && (
            <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
              Explore the page. Find 5 numbers. Unlock $9 off yearly Premium.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}