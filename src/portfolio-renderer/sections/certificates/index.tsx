// src/portfolio-renderer/sections/certificates/index.tsx
"use client";

import type { RendererCertificate } from "../../types";
import { CertificatesBadges } from "./CertificatesBadges";
import { CertificatesGrid } from "./CertificatesGrid";
import { CertificatesSimple } from "./CertificatesSimple";
import { CertificatesShowcase } from "./CertificatesShowcase";
import { CertificatesWall } from "./CertificatesWall";
import { CertificatesMinimalGrid } from "./CertificatesMinimalGrid";

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

    case "showcase":
      return <CertificatesShowcase certificates={certificates} />;

    case "wall":
      return <CertificatesWall certificates={certificates} />;

    case "minimal-grid":
      return <CertificatesMinimalGrid certificates={certificates} />;

    case "simple":
    default:
      return <CertificatesSimple certificates={certificates} />;
  }
}

export { CertificatesBadges } from "./CertificatesBadges";
export { CertificatesGrid } from "./CertificatesGrid";
export { CertificatesSimple } from "./CertificatesSimple";
export { CertificatesShowcase } from "./CertificatesShowcase";
export { CertificatesWall } from "./CertificatesWall";
export { CertificatesMinimalGrid } from "./CertificatesMinimalGrid";