"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Do I need to know how to code?",
    a: "No. You add your content and customize visually — Orixa handles the layout, hosting and responsiveness.",
  },
  {
    q: "Can I have more than one portfolio?",
    a: "Yes. One profile can hold multiple portfolios — for example a software engineer version and a freelance version — each with its own URL.",
  },
  {
    q: "What happens when I edit a published portfolio?",
    a: "Your changes are saved as a draft. Nothing changes on your live URL until you publish again, which creates a new version while your previous version stays intact.",
  },
  {
    q: "How do people contact me?",
    a: "Visitors fill out a contact form on your public portfolio. The message is emailed directly to you — there's no separate inbox to check inside Orixa.",
  },
  {
    q: "Is my resume file public?",
    a: "Only if you choose to show it. Uploaded files are stored securely and only exposed through the portfolio sections you enable.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-lg text-center"
        >
          <span className="text-caption">Questions</span>
          <h2 className="text-h1 mt-4 text-balance">
            Everything you're wondering.
          </h2>
        </motion.div>

        <div className="mt-12 space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="surface-card overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-label text-[0.95rem]">{item.q}</span>
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border-strong text-xs transition-transform duration-300",
                      isOpen && "rotate-45 border-primary/40 text-primary",
                    )}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p className="text-body px-5 pb-5 text-muted-foreground">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
