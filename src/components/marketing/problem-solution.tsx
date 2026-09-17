"use client";

import { motion } from "framer-motion";

const PAIRS = [
  {
    problem: "Most portfolio tools are built for designers — not for people who just need to get hired.",
    solution: "Add projects, experience, and your resume. Orixa handles layout, design, and publishing.",
  },
  {
    problem: "You publish once and never know if anyone looked — or downloaded your resume.",
    solution: "Views and resume downloads show up in your dashboard as they happen.",
  },
  {
    problem: "Contact forms dump messages into a black hole you have to check separately.",
    solution: "Visitor messages go straight to your email the moment they're sent.",
  },
];

export function ProblemSolution() {
  return (
    <section id="product" className="relative border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="max-w-2xl"
        >
          <span className="text-caption">Why Orixa exists</span>
          <h2 className="text-h1 mt-3 text-balance">
            Portfolio builders were never designed for people who ship work for a living.
          </h2>
        </motion.div>

        <div className="mt-14 space-y-0 divide-y divide-border border-y border-border">
          {PAIRS.map((pair, i) => (
            <motion.div
              key={pair.problem}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="grid gap-6 py-8 md:grid-cols-2 md:gap-12 md:py-10"
            >
              <div>
                <span className="text-caption text-error/80">Before</span>
                <p className="text-body mt-2 text-muted-foreground">{pair.problem}</p>
              </div>
              <div>
                <span className="text-caption text-accent">With Orixa</span>
                <p className="text-body mt-2 text-foreground">{pair.solution}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}