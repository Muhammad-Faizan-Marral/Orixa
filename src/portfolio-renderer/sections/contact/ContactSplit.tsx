// src/portfolio-renderer/sections/contact/ContactSplit.tsx
import React from "react";

export type ContactSplitProps = {
  config: {
    name?: string | null;
    phone?: string | null;
    linkedinUrl?: string | null;
    githubUrl?: string | null;
    resumeUrl?: string | null;
  };
};

type ContactLink = {
  key: string;
  label: string;
  href: string;
  external: boolean;
};

function buildLinks(config: ContactSplitProps["config"]): ContactLink[] {
  const links: ContactLink[] = [];

  if (config?.phone) {
    links.push({
      key: "phone",
      label: config.phone,
      href: `tel:${config.phone.replace(/[^\d+]/g, "")}`,
      external: false,
    });
  }

  if (config?.linkedinUrl) {
    links.push({
      key: "linkedin",
      label: "LinkedIn",
      href: config.linkedinUrl,
      external: true,
    });
  }

  if (config?.githubUrl) {
    links.push({
      key: "github",
      label: "GitHub",
      href: config.githubUrl,
      external: true,
    });
  }

  if (config?.resumeUrl) {
    links.push({
      key: "resume",
      label: "Resume",
      href: config.resumeUrl,
      external: true,
    });
  }

  return links;
}

export const ContactSplit: React.FC<ContactSplitProps> = ({ config }) => {
  const links = buildLinks(config);

  if (links.length === 0) return null;

  const name = config?.name?.trim() || undefined;

  return (
    <section aria-label="Contact" className="w-full py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 sm:mb-12">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Contact
          </h2>
          <div
            className="mt-3 h-1 w-12 rounded-full"
            style={{ backgroundColor: "var(--pr-accent)" }}
            aria-hidden="true"
          />
        </div>

        <div
          className="grid grid-cols-1 gap-8 border border-border bg-surface p-6 sm:gap-10 sm:p-10 md:grid-cols-2 md:gap-12"
          style={{ borderRadius: "var(--pr-radius)" }}
        >
          <div className="flex flex-col justify-center">
            <h3 className="text-xl font-semibold leading-snug text-foreground sm:text-2xl">
              {name ? `Let's connect, I'm ${name}` : "Let's connect"}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Reach out through any of the channels below — happy to talk
              about roles, projects, or collaboration.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:gap-3.5">
            {links.map((link) => (
              <a
                key={link.key}
                href={link.href}
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group flex items-center justify-between gap-3 border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors duration-200 hover:border-[var(--pr-accent)] sm:px-5 sm:py-3.5 sm:text-base"
                style={{ borderRadius: "var(--pr-radius)" }}
              >
                <span className="truncate">{link.label}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5"
                  style={{ color: "var(--pr-accent)" }}
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};