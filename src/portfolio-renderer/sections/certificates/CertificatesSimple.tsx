import { SectionHeading } from "../../shared/SectionHeading";
import type { RendererCertificate } from "../../types";

export function CertificatesSimple({
  certificates,
}: {
  certificates: RendererCertificate[];
}) {
  if (!certificates?.length) return null;

  return (
    <div>
      <SectionHeading title="Certificates" />
      <ul className="space-y-3">
        {certificates.map((c, i) => (
          <li key={c.id || i} className="text-sm">
            <span className="font-medium">{c.name}</span>
            {c.issuer && (
              <span className="text-muted-foreground"> · {c.issuer}</span>
            )}
            {c.issueDate && (
              <span className="text-muted-foreground"> · {c.issueDate}</span>
            )}
            {c.credentialUrl && (
              <a
                href={c.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-xs"
                style={{ color: "var(--pr-accent, #6c5cff)" }}
              >
                Credential
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}