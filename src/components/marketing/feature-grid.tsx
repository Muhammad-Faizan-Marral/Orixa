"use client";

import { motion } from "framer-motion";

const FEATURES = [
  {
    title: "Multiple portfolios, one identity",
    description:
      "A software-engineer site and a freelance site can live side by side — same profile, different story and URL.",
  },
  {
    title: "Analytics that matter",
    description:
      "Track portfolio views and resume downloads so you know what's working — not just that something is “live.”",
  },
  {
    title: "Versioned publishing",
    description:
      "Every publish is a snapshot. Edit freely; your public URL only updates when you choose to ship.",
  },
  {
    title: "Direct-to-inbox contact",
    description:
      "Messages from your portfolio land in your email. No separate Orixa inbox to manage.",
  },
  {
    title: "Visual customization",
    description:
      "Themes, section visibility, and motion — controlled in the editor. No config files.",
  },
  {
    title: "SEO that ships with you",
    description:
      "Sensible metadata on every portfolio so recruiters and search engines can find the right version of you.",
  },
];

export function FeatureGrid() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-xl"
        >
          <span className="text-caption">Built for careers</span>
          <h2 className="text-h1 mt-3 text-balance">
            Everything you need after “I should make a portfolio.”
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.05 }}
            >
              <div className="mb-3 h-px w-8 bg-gradient-ion" aria-hidden="true" />
              <h3 className="text-h3 !text-[1.05rem]">{feature.title}</h3>
              <p className="text-body mt-2 text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}