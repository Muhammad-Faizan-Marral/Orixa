// src/portfolio-renderer/sections/certificates/CertificatesGrid.tsx
import React from "react";

export type CertificatesGridProps = {
  certificates: Array<{
    id?: string;
    name: string;
    issuer?: string;
    issueDate?: string;
    credentialUrl?: string;
  }>;
};

export const CertificatesGrid: React.FC<CertificatesGridProps> = ({
  certificates,
}) => {
  if (!certificates || certificates.length === 0) return null;

  return (
    <section
      aria-label="Certificates"
      className="w-full py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Certificates
          </h2>
          <div
            className="mt-3 h-1 w-12 rounded-full"
            style={{ backgroundColor: "var(--pr-accent)" }}
            aria-hidden="true"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {certificates.map((cert, index) => {
            const key = cert.id ?? `${cert.name}-${index}`;
            const CardTag = cert.credentialUrl ? "a" : "div";
            const cardProps = cert.credentialUrl
              ? {
                  href: cert.credentialUrl,
                  target: "_blank",
                  rel: "noopener noreferrer",
                }
              : {};

            return (
              <CardTag
                key={key}
                {...cardProps}
                className="group flex flex-col gap-3 border border-border bg-surface p-6 transition-shadow duration-200 hover:shadow-md"
                style={{ borderRadius: "var(--pr-radius)" }}
              >
                <div
                  className="h-1 w-8 rounded-full"
                  style={{ backgroundColor: "var(--pr-accent)" }}
                  aria-hidden="true"
                />

                <h3 className="text-base font-semibold leading-snug text-foreground sm:text-lg">
                  {cert.name}
                </h3>

                {cert.issuer ? (
                  <p className="text-sm font-medium text-muted-foreground">
                    {cert.issuer}
                  </p>
                ) : null}

                {cert.issueDate ? (
                  <p className="text-xs font-medium tracking-wide text-muted-foreground/80 sm:text-sm">
                    {cert.issueDate}
                  </p>
                ) : null}

                {cert.credentialUrl ? (
                  <span
                    className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-medium sm:text-sm"
                    style={{ color: "var(--pr-accent)" }}
                  >
                    View credential
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-3.5 w-3.5"
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
                  </span>
                ) : null}
              </CardTag>
            );
          })}
        </div>
      </div>
    </section>
  );
};