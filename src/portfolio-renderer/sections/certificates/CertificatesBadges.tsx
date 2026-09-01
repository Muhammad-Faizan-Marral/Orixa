// src/portfolio-renderer/sections/certificates/CertificatesBadges.tsx
import React from "react";

export type CertificatesBadgesProps = {
  certificates: Array<{
    id?: string;
    name: string;
    issuer?: string;
    issueDate?: string;
    credentialUrl?: string;
  }>;
};

export const CertificatesBadges: React.FC<CertificatesBadgesProps> = ({
  certificates,
}) => {
  if (!certificates || certificates.length === 0) return null;

  return (
    <section
      aria-label="Certificates"
      className="w-full py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 sm:mb-12">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Certificates
          </h2>
          <div
            className="mt-3 h-1 w-12 rounded-full"
            style={{ backgroundColor: "var(--pr-accent)" }}
            aria-hidden="true"
          />
        </div>

        <div className="flex flex-wrap gap-3 sm:gap-4">
          {certificates.map((cert, index) => {
            const key = cert.id ?? `${cert.name}-${index}`;
            const Tag = cert.credentialUrl ? "a" : "div";
            const tagProps = cert.credentialUrl
              ? {
                  href: cert.credentialUrl,
                  target: "_blank",
                  rel: "noopener noreferrer",
                }
              : {};

            const metaParts = [cert.issuer, cert.issueDate].filter(
              (part): part is string => Boolean(part)
            );

            return (
              <Tag
                key={key}
                {...tagProps}
                className="group inline-flex items-center gap-2 border border-border bg-surface px-4 py-2.5 transition-shadow duration-200 hover:shadow-md sm:px-5 sm:py-3"
                style={{ borderRadius: "var(--pr-radius)" }}
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: "var(--pr-accent)" }}
                  aria-hidden="true"
                />

                <span className="flex flex-col">
                  <span className="text-sm font-semibold leading-snug text-foreground sm:text-base">
                    {cert.name}
                  </span>
                  {metaParts.length > 0 ? (
                    <span className="text-xs text-muted-foreground sm:text-sm">
                      {metaParts.join(" · ")}
                    </span>
                  ) : null}
                </span>

                {cert.credentialUrl ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.25 5.5a.75.75 0 0 0-.75.75v9.5c0 .414.336.75.75.75h9.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 13.75 18h-9.5A2.25 2.25 0 0 1 2 15.75v-9.5A2.25 2.25 0 0 1 4.25 4h4a.75.75 0 0 1 0 1.5h-4Z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M6.194 13.806a.75.75 0 0 0 1.06 0l7.996-7.996v3.36a.75.75 0 0 0 1.5 0v-5.17a.75.75 0 0 0-.75-.75h-5.17a.75.75 0 0 0 0 1.5h3.36l-7.996 7.996a.75.75 0 0 0 0 1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : null}
              </Tag>
            );
          })}
        </div>
      </div>
    </section>
  );
};