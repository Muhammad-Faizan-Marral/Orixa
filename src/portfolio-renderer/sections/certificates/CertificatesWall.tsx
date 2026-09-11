"use client";

import React from "react";
import { motion,Variants } from "framer-motion";

export type CertificatesWallProps = {
  certificates: Array<{
    id?: string;
    name: string;
    issuer?: string;
    issueDate?: string;
    credentialUrl?: string;
  }>;
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.055, delayChildren: 0.05 },
  },
};

const chipVariants:Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

// Determine whether a chip spans 2 columns (featured slot)
// First item is featured if total > 2; otherwise all equal.
function isFeatured(index: number, total: number): boolean {
  return index === 0 && total > 2;
}

export const CertificatesWall: React.FC<CertificatesWallProps> = ({
  certificates,
}) => {
  if (!certificates || certificates.length === 0) return null;

  const total = certificates.length;

  return (
    <section
      aria-label="Certificates"
      className="w-full"
      style={{ fontFamily: "var(--pr-font)" }}
    >
      {/* Heading row */}
      <motion.div
        className="mb-8 flex items-center gap-4"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2
          className="text-foreground font-semibold shrink-0"
          style={{
            fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
            letterSpacing: "var(--pr-heading-tracking, -0.025em)",
          }}
        >
          Certificates
        </h2>
        {/* Count badge */}
        <span
          className="inline-flex items-center justify-center rounded-full border border-border text-muted-foreground tabular-nums font-medium"
          style={{ fontSize: "0.75rem", padding: "0.15rem 0.6rem" }}
          aria-label={`${total} certificates`}
        >
          {total}
        </span>
      </motion.div>

      {/* Mosaic grid — 2-col base, featured item spans both cols */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        {certificates.map((cert, i) => {
          const key = cert.id ?? `${cert.name}-${i}`;
          const featured = isFeatured(i, total);
          const Tag = cert.credentialUrl ? "a" : "div";
          const linkProps = cert.credentialUrl
            ? {
                href: cert.credentialUrl,
                target: "_blank" as const,
                rel: "noopener noreferrer",
                "aria-label": `${cert.name}${cert.issuer ? ` — ${cert.issuer}` : ""} — open credential`,
              }
            : {};

          return (
            <motion.div
              key={key}
              variants={chipVariants}
              className={featured ? "col-span-2 sm:col-span-2" : "col-span-1"}
            >
              <Tag
                {...linkProps}
                className={[
                  "group relative flex flex-col gap-2 border border-border bg-surface overflow-hidden",
                  "transition-colors duration-200",
                  cert.credentialUrl
                    ? "hover:border-[color:var(--pr-accent)] cursor-pointer"
                    : "",
                  featured ? "p-5 sm:p-6" : "p-4",
                ].join(" ")}
                style={{
                  borderRadius: "var(--pr-radius)",
                  textDecoration: "none",
                  display: "flex",
                }}
              >
                {/* Accent dot — top-right corner, only on linkable certs */}
                {cert.credentialUrl && (
                  <div
                    className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: "var(--pr-accent)" }}
                    aria-hidden="true"
                  />
                )}

                {/* Issuer — small, quiet */}
                {cert.issuer && (
                  <span
                    className="text-muted-foreground font-medium leading-none"
                    style={{
                      fontSize: featured ? "0.8125rem" : "0.75rem",
                    }}
                  >
                    {cert.issuer}
                  </span>
                )}

                {/* Certificate name */}
                <h3
                  className="text-foreground font-semibold leading-snug"
                  style={{
                    fontSize: featured
                      ? "clamp(1rem, 1.8vw, 1.25rem)"
                      : "clamp(0.875rem, 1.3vw, 0.9375rem)",
                    letterSpacing: "var(--pr-heading-tracking, -0.015em)",
                  }}
                >
                  {cert.name}
                </h3>

                {/* Date — bottom, de-emphasised */}
                {cert.issueDate && (
                  <span
                    className="text-muted-foreground/70 tabular-nums mt-auto pt-1"
                    style={{ fontSize: "0.75rem", letterSpacing: "0.02em" }}
                  >
                    {cert.issueDate}
                  </span>
                )}

                {/* Credential link label — featured only, shown on hover */}
                {cert.credentialUrl && featured && (
                  <span
                    className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1"
                    style={{ color: "var(--pr-accent)" }}
                  >
                    View credential
                  </span>
                )}
              </Tag>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};