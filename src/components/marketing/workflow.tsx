"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    n: "01",
    title: "Add your content",
    description:
      "Projects, experience, skills, education, resume — bring what you already have. No blank-page pressure.",
  },
  {
    n: "02",
    title: "Shape the presentation",
    description:
      "Pick a visual direction, toggle sections, adjust motion. Everything is controlled in the editor.",
  },
  {
    n: "03",
    title: "Publish your URL",
    description:
      "orixa.ai/you goes live when you're ready. Versioning keeps past publishes intact while you iterate.",
  },
];

export function Workflow() {
  return (
    <section id="how" className="relative border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-xl"
        >
          <span className="text-caption">From content to live URL</span>
          <h2 className="text-h1 mt-3 text-balance">Three steps. No developer required.</h2>
        </motion.div>

        <div className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          <div
            className="bg-gradient-ion-soft absolute top-[1.75rem] right-0 left-0 hidden h-px md:block"
            style={{ marginLeft: "2rem", marginRight: "2rem" }}
            aria-hidden="true"
          />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="relative"
            >
              <span className="font-display relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-surface text-lg font-semibold text-gradient-ion">
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