// src/portfolio-renderer/sections/footer/index.tsx
"use client";

import { FooterDetailed } from "./FooterDetailed";
import { FooterMinimal } from "./FooterMinimal";
import { FooterEditorial } from "./FooterEditorial";
import { FooterMega } from "./FooterMega";

export function FooterSection({
  variant,
  name,
  username,
  headline,
  about,
  githubUrl,
  linkedinUrl,
  phone,
  resumeUrl,
  portfolioId,
}: {
  variant?: string;
  name?: string | null;
  username: string;
  headline?: string | null;
  about?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  phone?: string | null;
  resumeUrl?: string | null;
  portfolioId?: string;
}) {
  switch (variant) {
    case "detailed":
      return (
        <FooterDetailed
          name={name ?? undefined}
          username={username}
          githubUrl={githubUrl}
          linkedinUrl={linkedinUrl}
        />
      );

    case "editorial":
      return (
        <FooterEditorial
          name={name}
          username={username}
          headline={headline}
          githubUrl={githubUrl}
          linkedinUrl={linkedinUrl}
          phone={phone}
          portfolioId={portfolioId}

        />
      );

    case "mega":
      return (
        <FooterMega
          name={name}
          username={username}
          headline={headline}
          about={about}
          githubUrl={githubUrl}
          linkedinUrl={linkedinUrl}
          phone={phone}
          resumeUrl={resumeUrl}
          portfolioId={portfolioId}
        />
      );

    case "minimal":
    default:
      return <FooterMinimal name={name ?? undefined} username={username} />;
  }
}

export { FooterDetailed } from "./FooterDetailed";
export { FooterMinimal } from "./FooterMinimal";
export { FooterEditorial } from "./FooterEditorial";
export { FooterMega } from "./FooterMega";
