"use client";

import { motion } from "framer-motion";

const AI_ACTIONS = [
  {
    label: "Rewrite headline",
    before: "Frontend Developer",
    after: "Full-stack engineer building fast, thoughtful products",
  },
  {
    label: "Improve about",
    before: "I build web apps.",
    after: "I design and ship end-to-end products — from data model to pixel.",
  },
  {
    label: "Polish project summary",
    before: "A shop app I made.",
    after: "E-commerce platform handling 10k+ monthly orders with real-time inventory.",
  },
];

export function AiShowcase() {
  return (
    <section id="ai" className="relative border-t border-border py-20 md:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(50% 40% at 80% 20%, color-mix(in srgb, var(--color-primary) 12%, transparent) 0%, transparent 55%)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-2 md:items-center md:gap-16 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
        >
          <span className="text-caption text-accent">AI in the editor</span>
          <h2 className="text-h1 mt-3 text-balance">
            You bring the story.
            <span className="text-gradient-ion"> Orixa</span> helps you say it clearly.
          </h2>
          <p className="text-body-lg mt-5 max-w-md">
            Orixa reads your role, projects, and resume, then suggests stronger
            headlines and summaries. You always review before anything goes live.
          </p>

          <ul className="mt-8 space-y-3.5">
            {[
              "Highlights what matters in your experience",
              "Suggests clearer headlines and project copy",
              "Layouts adapt to your content — not a random theme",
              "Nothing publishes without your approval",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-ion"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="space-y-3"
        >
          {AI_ACTIONS.map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.12 + i * 0.08 }}
              className="surface-card p-4 sm:p-5"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-caption text-primary">{action.label}</span>
                <span className="rounded-full bg-gradient-ion px-2 py-0.5 text-[0.65rem] font-medium text-white">
                  AI
                </span>
              </div>
              <p className="text-small text-subtle-foreground line-through decoration-subtle-foreground/35">
                {action.before}
              </p>
              <p className="text-body mt-1.5 text-foreground">{action.after}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}