"use client";

import { motion } from "framer-motion";

const AI_ACTIONS = [
  { label: "Rewrite headline", before: "Frontend Developer", after: "Full-Stack AI Engineer building fast, thoughtful products" },
  { label: "Improve about section", before: "I build web apps.", after: "I design and ship end-to-end web products — from data model to pixel." },
  { label: "Polish project summary", before: "A shop app I made.", after: "A full-stack e-commerce platform handling 10k+ monthly orders." },
];

export function AiShowcase() {
  return (
    <section id="ai" className="relative py-24 md:py-32">
      <div
        className="bg-aurora pointer-events-none absolute inset-0 opacity-70"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-6 md:grid-cols-2 md:items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-caption text-accent">AI, built into the editor</span>
          <h2 className="text-h1 mt-4 text-balance">
            You bring the story. <span className="text-gradient-ion">Orixa</span> finds
            the words.
          </h2>
          <p className="text-body-lg mt-5 max-w-md text-balance">
            Stuck on how to phrase your headline or a project description? One
            click rewrites, improves, or expands what you&rsquo;ve written —
            you always review and approve before it&rsquo;s saved.
          </p>

          <ul className="mt-8 space-y-3">
            {[
              "Generate a headline from your role and skills",
              "Improve tone and clarity of your About section",
              "Sharpen project descriptions for recruiters",
              "You always review results before they're saved",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gradient-ion-soft text-[0.6rem] text-primary">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="border-gradient-ion shadow-glow-primary space-y-3 rounded-2xl p-5"
        >
          {AI_ACTIONS.map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
              className="surface-panel space-y-2.5 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-caption text-primary">{action.label}</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-ion text-[0.55rem] text-white">
                  AI
                </span>
              </div>
              <p className="text-small text-subtle-foreground line-through decoration-subtle-foreground/40">
                {action.before}
              </p>
              <p className="text-body text-foreground">{action.after}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
