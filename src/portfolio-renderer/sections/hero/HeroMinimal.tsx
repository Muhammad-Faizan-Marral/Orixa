import type { FC } from "react";

type HeroMinimalProps = {
  config: {
    name?: string | null;
    headline?: string | null;
    about?: string | null;
    avatarUrl?: string | null;
    phone?: string | null;
    linkedinUrl?: string | null;
    githubUrl?: string | null;
    resumeUrl?: string | null;
  };
  profile: {
    username: string;
    fullName?: string | null;
    avatarUrl?: string | null;
  };
};

export const HeroMinimal: FC<HeroMinimalProps> = ({ config, profile }) => {
  const name = config.name || profile.fullName || profile.username;
  const avatar = config.avatarUrl || profile.avatarUrl || null;
  const { headline, about, resumeUrl, githubUrl, linkedinUrl } = config;

  // One quiet primary action: resume first, then LinkedIn, then GitHub.
  const primary = resumeUrl
    ? { href: resumeUrl, label: "Resume" }
    : linkedinUrl
      ? { href: linkedinUrl, label: "LinkedIn" }
      : githubUrl
        ? { href: githubUrl, label: "GitHub" }
        : null;

  // Any remaining links become quiet inline text below the primary CTA.
  const secondaryLinks = [
    resumeUrl && primary?.href !== resumeUrl
      ? { href: resumeUrl, label: "Resume" }
      : null,
    githubUrl && primary?.href !== githubUrl
      ? { href: githubUrl, label: "GitHub" }
      : null,
    linkedinUrl && primary?.href !== linkedinUrl
      ? { href: linkedinUrl, label: "LinkedIn" }
      : null,
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <section className="w-full">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-4 text-center sm:px-6">
        {avatar ? (
          <div
            className="h-16 w-16 overflow-hidden border border-border bg-surface-2"
            style={{ borderRadius: "var(--pr-radius, 12px)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatar}
              alt={name}
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}

        <div className="flex flex-col items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {name}
          </h1>

          {headline ? (
            <p className="text-base font-normal text-muted-foreground sm:text-lg">
              {headline}
            </p>
          ) : null}
        </div>

        {about ? (
          <p
            className="max-w-md text-sm leading-relaxed text-muted-foreground"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {about}
          </p>
        ) : null}

        {primary ? (
          <a
            href={primary.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "var(--pr-accent, #6c5cff)",
              borderRadius: "var(--pr-radius, 12px)",
            }}
          >
            {primary.label}
          </a>
        ) : null}

        {secondaryLinks.length > 0 ? (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {secondaryLinks.map((link, index) => (
              <div key={link.href} className="flex items-center gap-3">
                {index > 0 ? (
                  <span aria-hidden="true" className="text-border">
                    ·
                  </span>
                ) : null}

                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
};
