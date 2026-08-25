"use client";

import { motion } from "framer-motion";

const PAIRS = [
  {
    problem: "Portfolio builders are built for designers, not for you.",
    solution: "Add your projects, resume and skills — Orixa handles layout, design and code.",
  },
  {
    problem: "You publish a portfolio and never know what happens next.",
    solution: "See views and resume downloads as they happen, right from your dashboard.",
  },
  {
    problem: "Someone wants to hire you — their message disappears into a form.",
    solution: "Contact messages land straight in your inbox, the moment they're sent.",
  },
];

export function ProblemSolution() {
  return (
    <section id="product" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-caption">Why Orixa exists</span>
          <h2 className="text-h1 mt-4 text-balance">
            Portfolio builders were never built for people who just want to
            get hired.
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {PAIRS.map((pair, i) => (
            <motion.div
              key={pair.problem}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="surface-card flex h-full flex-col gap-5 p-6"
            >
              <div className="space-y-2">
                <span className="text-caption text-error/80">The old way</span>
                <p className="text-body text-muted-foreground line-through decoration-error/30">
                  {pair.problem}
                </p>
              </div>
              <div className="h-px w-full bg-gradient-ion-soft" />
              <div className="space-y-2">
                <span className="text-caption text-accent">With Orixa</span>
                <p className="text-body text-foreground">{pair.solution}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
