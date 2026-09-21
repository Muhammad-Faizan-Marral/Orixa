"use client";

import { motion, useReducedMotion } from "framer-motion";

type AboutDefaultProps = {
  config: {
    name?: string | null;
    about?: string | null;
    avatarUrl?: string | null;
    phone?: string | null;
    location?: string | null;
  };
};

const ease = [0.22, 1, 0.36, 1] as const;

export function AboutDefault({ config }: AboutDefaultProps) {
  const { about } = config;
  const reduceMotion = useReducedMotion();

  if (!about) return null;

  return (
    <div className="w-full" style={{ fontFamily: "var(--pr-font)" }}>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, ease }}
        className="mb-8 flex flex-col gap-3"
      >
        <h2
          className="text-[0.7rem] font-medium uppercase tracking-[0.2em]"
          style={{ color: "var(--pr-muted, var(--muted-foreground))" }}
        >
          About
        </h2>
        <div
          className="h-[2px] w-10 rounded-full"
          style={{ background: "var(--pr-accent)" }}
          aria-hidden="true"
        />
      </motion.div>

      <motion.p
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, delay: 0.06, ease }}
        className="whitespace-pre-line text-foreground"
        style={{
          fontSize: "clamp(1.05rem, 1.6vw, 1.2rem)",
          lineHeight: "var(--pr-body-leading, 1.7)",
          maxWidth: "62ch",
          letterSpacing: "-0.01em",
        }}
      >
        {about}
      </motion.p>
    </div>
  );
}

export default AboutDefault;