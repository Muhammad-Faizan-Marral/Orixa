"use client";

import { motion } from "framer-motion";

const EXAMPLES = [
  { name: "Amara Chen", role: "Product Designer", slug: "amara/product-design", theme: "from-primary/30 to-accent/20" },
  { name: "Daniyal Raza", role: "Backend Engineer", slug: "daniyal/backend", theme: "from-accent/25 to-primary/15" },
  { name: "Sofia Marín", role: "Freelance Developer", slug: "sofia/freelance", theme: "from-primary/25 to-accent/25" },
];

export function Showcase() {
  return (
    <section id="showcase" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-xl text-center"
        >
          <span className="text-caption">Built with Orixa</span>
          <h2 className="text-h1 mt-4 text-balance">Every portfolio, its own identity.</h2>
        </motion.div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {EXAMPLES.map((example, i) => (
            <motion.div
              key={example.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="surface-card group overflow-hidden"
            >
              <div
                className={`h-40 bg-gradient-to-br ${example.theme} relative flex items-end p-4`}
              >
                <div className="h-14 w-14 rounded-full border-2 border-surface bg-surface-3" />
              </div>
              <div className="space-y-3 p-5">
                <div>
                  <p className="text-h3 !text-base">{example.name}</p>
                  <p className="text-small">{example.role}</p>
                </div>
                <p className="text-caption text-primary/80 normal-case tracking-normal">
                  orixa.ai/{example.slug}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
