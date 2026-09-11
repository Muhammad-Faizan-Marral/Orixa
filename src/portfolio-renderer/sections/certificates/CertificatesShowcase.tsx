"use client";

import React from "react";
import { motion,Variants } from "framer-motion";

export type CertificatesShowcaseProps = {
  certificates: Array<{
    id?: string;
    name: string;
    issuer?: string;
    issueDate?: string;
    credentialUrl?: string;
  }>;
};

const cardVariants:Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      delay: i * 0.09,
    },
  }),
};

// Small verified-seal SVG — replaces generic arrow icons
const SealIcon: React.FC<{ className?: string ,style?: React.CSSProperties}> = ({ className, style}) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <path
      d="M10 2L11.8 6.2L16.4 6.7L13.2 9.6L14.1 14.1L10 11.8L5.9 14.1L6.8 9.6L3.6 6.7L8.2 6.2L10 2Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 10.2L9.2 11.9L12.5 8.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CertificatesShowcase: React.FC<CertificatesShowcaseProps> = ({
  certificates,
}) => {
  if (!certificates || certificates.length === 0) return null;

  return (
    <section
      aria-label="Certificates"
      className="w-full"
      style={{ fontFamily: "var(--pr-font)" }}
    >
      {/* Heading */}
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2
          className="text-foreground font-semibold"
          style={{
            fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
            letterSpacing: "var(--pr-heading-tracking, -0.025em)",
          }}
        >
          Certificates
        </h2>
      </motion.div>

      {/* Credential card grid — 1 col mobile, 2 col md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        {certificates.map((cert, i) => {
          const key = cert.id ?? `${cert.name}-${i}`;
          const Tag = cert.credentialUrl ? "a" : "div";
          const linkProps = cert.credentialUrl
            ? {
                href: cert.credentialUrl,
                target: "_blank" as const,
                rel: "noopener noreferrer",
                "aria-label": `${cert.name} — view credential`,
              }
            : {};

          return (
            <motion.div
              key={key}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Tag
                {...linkProps}
                className="relative flex flex-col justify-between overflow-hidden border border-border bg-surface w-full group"
                style={{
                  aspectRatio: "8 / 5",
                  borderRadius: "var(--pr-radius)",
                  padding: "clamp(1.25rem, 3vw, 2rem)",
                  textDecoration: "none",
                  display: "flex",
                  boxShadow: "var(--pr-card-shadow, none)",
                }}
              >
                {/* Inner emboss border — visible on hover */}
                <div
                  className="pointer-events-none absolute inset-[6px] border border-border opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ borderRadius: "calc(var(--pr-radius) - 4px)" }}
                  aria-hidden="true"
                />

                {/* Corner accent — top-left */}
                <div
                  className="absolute top-0 left-0 w-1 h-full"
                  style={{ background: "var(--pr-accent)" }}
                  aria-hidden="true"
                />

                {/* Top row: issuer + seal */}
                <div className="flex items-center justify-between gap-3 pl-3">
                  {cert.issuer ? (
                    <span
                      className="text-muted-foreground font-medium leading-none"
                      style={{ fontSize: "clamp(0.75rem, 1.1vw, 0.875rem)" }}
                    >
                      {cert.issuer}
                    </span>
                  ) : (
                    <span />
                  )}
                  <SealIcon
                    className="shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors duration-200"
                    style={{ width: "1.1rem", height: "1.1rem" }}
                  />
                </div>

                {/* Centre: certificate name — typographic anchor */}
                <div className="flex-1 flex items-center pl-3">
                  <h3
                    className="text-foreground font-semibold leading-tight"
                    style={{
                      fontSize: "clamp(1rem, 2vw, 1.375rem)",
                      letterSpacing: "var(--pr-heading-tracking, -0.02em)",
                      maxWidth: "22ch",
                    }}
                  >
                    {cert.name}
                  </h3>
                </div>

                {/* Bottom row: date + credential link */}
                <div className="flex items-end justify-between gap-3 pl-3">
                  {cert.issueDate ? (
                    <span
                      className="text-muted-foreground tabular-nums"
                      style={{ fontSize: "0.8125rem", letterSpacing: "0.02em" }}
                    >
                      {cert.issueDate}
                    </span>
                  ) : (
                    <span />
                  )}
                  {cert.credentialUrl && (
                    <span
                      className="text-xs font-medium transition-colors duration-150"
                      style={{ color: "var(--pr-accent)" }}
                    >
                      Open credential
                    </span>
                  )}
                </div>
              </Tag>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};