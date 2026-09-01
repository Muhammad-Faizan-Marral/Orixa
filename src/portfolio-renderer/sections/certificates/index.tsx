import type { RendererCertificate } from "../../types";
import { CertificatesBadges } from "./CertificatesBadges";
import { CertificatesGrid } from "./CertificatesGrid";
import { CertificatesSimple } from "./CertificatesSimple";

export function CertificatesSection({
  variant,
  certificates,
}: {
  variant?: string;
  certificates: RendererCertificate[];
}) {
  switch (variant) {
    case "badges":
      return <CertificatesBadges certificates={certificates} />;

    case "grid":
      return <CertificatesGrid certificates={certificates} />;

    case "simple":
    default:
      return <CertificatesSimple certificates={certificates} />;
  }
}