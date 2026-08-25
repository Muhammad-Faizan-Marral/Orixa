"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    n: "01",
    title: "Add your content",
    description: "Projects, experience, skills, education, resume — bring what you already have.",
  },
  {
    n: "02",
    title: "Customize visually",
    description: "Pick a theme, toggle sections, tune motion. No config files, no code.",
  },
  {
    n: "03",
    title: "Publish your URL",
    description: "orixa.ai/you goes live instantly, with versioning so past publishes stay safe.",
  },
];

export function Workflow() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-xl text-center"
        >
          <span className="text-caption">From idea to live URL</span>
          <h2 className="text-h1 mt-4 text-balance">Three steps. No developer required.</h2>
        </motion.div>

        <div className="relative mt-16 grid gap-8 md:grid-cols-3 md:gap-6">
          <div
            className="bg-gradient-ion-soft absolute top-8 hidden h-px w-full md:block"
            aria-hidden="true"
          />
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative"
            >
              <span className="font-display text-gradient-ion relative z-10 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/25 bg-surface text-xl font-semibold">
                {step.n}
              </span>
              <h3 className="text-h3 mt-5">{step.title}</h3>
              <p className="text-body mt-2 text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
