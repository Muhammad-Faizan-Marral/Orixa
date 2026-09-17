"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Do I need to know how to code?",
    a: "No. You add your content and customize visually — Orixa handles layout, hosting, and responsiveness.",
  },
  {
    q: "Can I have more than one portfolio?",
    a: "Yes. One profile can hold multiple portfolios — for example a software-engineer version and a freelance version — each with its own URL.",
  },
  {
    q: "What happens when I edit a published portfolio?",
    a: "Changes stay as a draft until you publish again. Publishing creates a new version; previous versions remain intact.",
  },
  {
    q: "How do people contact me?",
    a: "Visitors use the contact form on your public portfolio. Messages are emailed directly to you — there is no separate inbox inside Orixa.",
  },
  {
    q: "Is my resume file public?",
    a: "Only if you choose to show it. Uploaded files are stored securely and only exposed through the portfolio sections you enable.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-lg"
        >
          <span className="text-caption">Questions</span>
          <h2 className="text-h1 mt-3 text-balance">Clear answers before you start.</h2>
        </motion.div>

        <div className="mt-10 divide-y divide-border border-y border-border">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-[1.02rem] font-semibold tracking-tight text-foreground">
                    {item.q}
                  </span>
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-transform",
                      isOpen && "rotate-45 border-primary/40 text-primary",
                    )}
                    aria-hidden="true"
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
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="text-body pb-5 pr-10 text-muted-foreground">{item.a}</p>
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