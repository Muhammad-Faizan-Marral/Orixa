"use client";

import { motion } from "framer-motion";

const FEATURES = [
  {
    title: "Multiple portfolios, one profile",
    description:
      "Keep a software engineer portfolio and a freelancer portfolio side by side — same identity, different presentation.",
    icon: "layers",
  },
  {
    title: "Live analytics, not guesswork",
    description:
      "Every view and resume download is tracked so you always know how your portfolio is performing.",
    icon: "chart",
  },
  {
    title: "Versioned publishing",
    description:
      "Every publish creates a snapshot. Edit freely — your live portfolio only changes when you say so.",
    icon: "layers-alt",
  },
  {
    title: "Direct-to-inbox contact",
    description:
      "Visitors reach you through email, instantly. No inbox to manage inside Orixa, nothing to check twice.",
    icon: "mail",
  },
  {
    title: "Visual customization",
    description:
      "Themes, animations and section visibility — all controlled visually. Never touch a config file.",
    icon: "palette",
  },
  {
    title: "Built-in SEO",
    description:
      "Every portfolio ships with sensible metadata so recruiters and search engines both find you.",
    icon: "search",
  },
];

function FeatureIcon({ name }: { name: string }) {
  const common = "h-5 w-5";
  switch (name) {
    case "layers":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 3l9 5-9 5-9-5 9-5Z" strokeLinejoin="round" />
          <path d="M3 13l9 5 9-5" strokeLinejoin="round" />
        </svg>
      );
    case "chart":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M4 19V9M12 19V5M20 19v-7" strokeLinecap="round" />
        </svg>
      );
    case "layers-alt":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="4" y="4" width="10" height="10" rx="2" />
          <rect x="10" y="10" width="10" height="10" rx="2" />
        </svg>
      );
    case "mail":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "palette":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="12" r="9" />
          <circle cx="8.5" cy="10.5" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="12" cy="8" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="15.5" cy="10.5" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" strokeLinecap="round" />
        </svg>
      );
  }
}

export function FeatureGrid() {
  return (
    <section className="relative py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group surface-card p-6 transition-colors hover:border-border-strong"
            >
              <div className="bg-gradient-ion-soft border-primary/20 flex h-10 w-10 items-center justify-center rounded-lg border text-primary transition-transform group-hover:scale-105">
                <FeatureIcon name={feature.icon} />
              </div>
              <h3 className="text-h3 mt-5">{feature.title}</h3>
              <p className="text-body mt-2 text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
