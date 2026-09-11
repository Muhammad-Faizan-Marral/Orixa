"use client";

import React from "react";
import { motion,Variants } from "framer-motion";

export type CertificatesMinimalGridProps = {
  certificates: Array<{
    id?: string;
    name: string;
    issuer?: string;
    issueDate?: string;
    credentialUrl?: string;
  }>;
};

const rowVariants:Variants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      delay: 0.05 + i * 0.06,
    },
  }),
};

// Minimal external-link icon — no arrow, just a small square-with-arrow
const ExternalIcon: React.FC = () => (
  <svg
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: "0.7em", height: "0.7em", display: "inline", marginLeft: "0.3em", verticalAlign: "middle" }}
    aria-hidden="true"
  >
    <path
      d="M2 10L10 2M10 2H5.5M10 2V6.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CertificatesMinimalGrid: React.FC<CertificatesMinimalGridProps> = ({
  certificates,
}) => {

  const grouped = React.useMemo(() => {
    const map = new Map<string, typeof certificates>();
    for (const cert of certificates) {
      const group = cert.issuer ?? "";
      if (!map.has(group)) map.set(group, []);
      map.get(group)!.push(cert);
    }
    return Array.from(map.entries());
  }, [certificates]);
  if (!certificates || certificates.length === 0) return null;

  const useGroups = grouped.length > 1 && grouped.some(([k]) => k !== "");

  return (
    <section
      aria-label="Certificates"
      className="w-full"
      style={{ fontFamily: "var(--pr-font)" }}
    >
      {/* Heading + heavy top rule */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.4 }}
      >
        <div className="border-t-2 border-foreground pt-4 pb-3 flex items-baseline justify-between gap-4">
          <h2
            className="text-foreground font-semibold"
            style={{
              fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
              letterSpacing: "var(--pr-heading-tracking, -0.025em)",
            }}
          >
            Certificates
          </h2>
          {/* Column headers — desktop only */}
          <div
            className="hidden md:grid text-xs text-muted-foreground font-medium gap-x-8 shrink-0"
            style={{ gridTemplateColumns: "1fr 120px", letterSpacing: "0.05em" }}
            aria-hidden="true"
          >
            <span className="text-right">Issuer</span>
            <span className="text-right">Date</span>
          </div>
        </div>
        <div className="border-t border-border" aria-hidden="true" />
      </motion.div>

      {/* Rows */}
      {useGroups ? (
        /* Grouped by issuer */
        <div className="flex flex-col">
          {grouped.map(([issuerGroup, certs], gi) => (
            <div key={issuerGroup || `group-${gi}`}>
              {/* Group label row — only if issuer exists and more than one group */}
              {issuerGroup && (
                <motion.div
                  className="py-3 border-b border-border"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: gi * 0.05 }}
                >
                  <span
                    className="text-sm font-semibold text-muted-foreground"
                    style={{ letterSpacing: "0.01em" }}
                  >
                    {issuerGroup}
                  </span>
                </motion.div>
              )}
              {certs.map((cert, i) => {
                const globalIndex = gi * 10 + i;
                const key = cert.id ?? `${cert.name}-${globalIndex}`;
                return (
                  <CertRow
                    key={key}
                    cert={cert}
                    index={globalIndex}
                    hideIssuer={!!issuerGroup}
                  />
                );
              })}
            </div>
          ))}
        </div>
      ) : (
        /* Flat list */
        <div className="flex flex-col">
          {certificates.map((cert, i) => {
            const key = cert.id ?? `${cert.name}-${i}`;
            return <CertRow key={key} cert={cert} index={i} hideIssuer={false} />;
          })}
        </div>
      )}

      {/* Heavy bottom rule */}
      <div className="border-t-2 border-foreground" aria-hidden="true" />

      {/* Footer count */}
      <motion.p
        className="mt-3 text-xs text-muted-foreground"
        style={{ letterSpacing: "0.04em" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {certificates.length}{" "}
        {certificates.length === 1 ? "certificate" : "certificates"}
      </motion.p>
    </section>
  );
};

// ── Sub-component: single ledger row ─────────────────────────────────────────

type CertRowProps = {
  cert: {
    name: string;
    issuer?: string;
    issueDate?: string;
    credentialUrl?: string;
  };
  index: number;
  hideIssuer: boolean;
};

const CertRow: React.FC<CertRowProps> = ({ cert, index, hideIssuer }) => {
  const hasLink = !!cert.credentialUrl;
  const NameTag = hasLink ? "a" : "span";
  const nameProps = hasLink
    ? {
        href: cert.credentialUrl,
        target: "_blank" as const,
        rel: "noopener noreferrer",
        "aria-label": `${cert.name}${cert.issuer ? ` — ${cert.issuer}` : ""} — open credential`,
      }
    : {};

  return (
    <motion.article
      className="group relative border-b border-border"
      custom={index}
      variants={rowVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
    >
      {/* Hover accent line */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: "var(--pr-accent)" }}
        aria-hidden="true"
      />

      {/* Desktop: 3-col row */}
      <div
        className="hidden md:grid items-center py-4 gap-x-8 pl-3"
        style={{ gridTemplateColumns: "1fr 1fr 120px" }}
      >
        {/* Name — links underline on hover */}
        <NameTag
          {...nameProps}
          className={[
            "text-foreground font-medium leading-snug",
            hasLink
              ? "underline-offset-2 hover:underline cursor-pointer"
              : "",
          ].join(" ")}
          style={{
            fontSize: "clamp(0.9rem, 1.2vw, 1rem)",
            letterSpacing: "var(--pr-heading-tracking, -0.01em)",
            textDecoration: "none",
          }}
        >
          {cert.name}
          {hasLink && <ExternalIcon />}
        </NameTag>

        {/* Issuer */}
        <span
          className="text-muted-foreground text-sm"
          style={{ opacity: hideIssuer ? 0.4 : 1 }}
        >
          {hideIssuer ? "↳" : (cert.issuer ?? "—")}
        </span>

        {/* Date */}
        <span
          className="text-muted-foreground text-sm tabular-nums text-right"
          style={{ letterSpacing: "0.02em" }}
        >
          {cert.issueDate ?? "—"}
        </span>
      </div>

      {/* Mobile: stacked */}
      <div className="md:hidden py-4 pl-3 flex flex-col gap-1">
        <NameTag
          {...nameProps}
          className={[
            "text-foreground font-medium leading-snug text-sm",
            hasLink ? "hover:underline underline-offset-2" : "",
          ].join(" ")}
          style={{ textDecoration: "none" }}
        >
          {cert.name}
          {hasLink && <ExternalIcon />}
        </NameTag>
        <div className="flex items-center justify-between gap-2">
          {!hideIssuer && cert.issuer && (
            <span className="text-xs text-muted-foreground">{cert.issuer}</span>
          )}
          {cert.issueDate && (
            <span
              className="text-xs text-muted-foreground tabular-nums ml-auto"
              style={{ letterSpacing: "0.02em" }}
            >
              {cert.issueDate}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
};