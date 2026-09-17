"use client";

import { motion } from "framer-motion";

const EXAMPLES = [
  {
    name: "Amara Chen",
    role: "Product Designer",
    slug: "amara/product-design",
    accent: "from-primary/35 via-primary/10 to-transparent",
  },
  {
    name: "Daniyal Raza",
    role: "Backend Engineer",
    slug: "daniyal/backend",
    accent: "from-accent/30 via-accent/10 to-transparent",
  },
  {
    name: "Sofia Marín",
    role: "Freelance Developer",
    slug: "sofia/freelance",
    accent: "from-primary/25 via-accent/15 to-transparent",
  },
];

export function Showcase() {
  return (
    <section id="showcase" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-lg">
            <span className="text-caption">What it looks like</span>
            <h2 className="text-h1 mt-3 text-balance">Every portfolio, its own identity.</h2>
          </div>
          <p className="text-body max-w-sm text-muted-foreground md:text-right">
            Same product. Different design DNA, sections, and story — so your site matches how you work.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {EXAMPLES.map((example, i) => (
            <motion.article
              key={example.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="surface-card group overflow-hidden"
            >
              <div
                className={`relative flex h-36 items-end bg-gradient-to-br ${example.accent} p-4`}
              >
                <div className="h-12 w-12 rounded-full border-2 border-surface bg-surface-3 shadow-sm" />
                <div className="absolute top-3 right-3 rounded-full border border-border/60 bg-surface/70 px-2 py-0.5 text-[0.65rem] text-muted-foreground backdrop-blur">
                  Preview
                </div>
              </div>
              <div className="space-y-1.5 p-5">
                <p className="font-display text-[1.05rem] font-semibold tracking-tight text-foreground">
                  {example.name}
                </p>
                <p className="text-small">{example.role}</p>
                <p className="text-caption mt-3 normal-case tracking-normal text-primary/80">
                  orixa.ai/{example.slug}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}