"use client";

import type { ReactNode } from "react";
import {
  trackContactClick,
  trackProjectClick,
} from "@/features/portfolio/components/use-portfolio-events";

export function TrackedProjectLink({
  portfolioId,
  projectTitle,
  href,
  className,
  children,
}: {
  portfolioId?: string;
  projectTitle: string;
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => {
        if (portfolioId) trackProjectClick(portfolioId, projectTitle);
      }}
    >
      {children}
    </a>
  );
}

/** ExtLink jaisa hi look, bas contact click track karta hai (GitHub, LinkedIn, Resume, phone). */
export function TrackedExtLink({
  portfolioId,
  href,
  external,
  children,
  solid = false,
}: {
  portfolioId?: string;
  href: string;
  external?: boolean;
  children: ReactNode;
  solid?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`cin-btn ${solid ? "cin-btn--solid" : "cin-btn--ghost"}`}
      onClick={() => {
        if (portfolioId) trackContactClick(portfolioId);
      }}
    >
      {children}
      {external && (
        <span className="arr" aria-hidden>
          ↗
        </span>
      )}
    </a>
  );
}