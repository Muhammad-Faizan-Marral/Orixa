import { SectionHeading } from "../../shared/SectionHeading";
import type { PortfolioRenderConfig } from "../../types";

export function ContactSimple({ config }: { config: PortfolioRenderConfig }) {
  const has =
    config.phone || config.linkedinUrl || config.githubUrl || config.resumeUrl;
  if (!has) return null;

  return (
    <div>
      <SectionHeading title="Contact" />
      <div className="flex flex-wrap gap-3">
        {config.phone && (
          <a
            href={`tel:${config.phone}`}
            className="rounded-lg border border-border px-4 py-2 text-sm"
          >
            {config.phone}
          </a>
        )}
        {config.linkedinUrl && (
          <a
            href={config.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border px-4 py-2 text-sm"
          >
            LinkedIn
          </a>
        )}
        {config.githubUrl && (
          <a
            href={config.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border px-4 py-2 text-sm"
          >
            GitHub
          </a>
        )}
        {config.resumeUrl && (
          <a
            href={config.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg px-4 py-2 text-sm font-medium text-white"
            style={{ background: "var(--pr-accent, #6c5cff)" }}
          >
            Resume
          </a>
        )}
      </div>
    </div>
  );
}