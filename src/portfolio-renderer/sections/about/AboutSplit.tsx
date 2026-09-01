import React from "react";

type AboutSplitProps = {
  config: {
    name?: string | null;
    about?: string | null;
    avatarUrl?: string | null;
    phone?: string | null;
    location?: string | null;
  };
};

export const AboutSplit: React.FC<AboutSplitProps> = ({ config }) => {
  const { name, about, avatarUrl, phone, location } = config;

  if (!about) return null;

  const initial = (name ?? "").trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="w-full" style={{ fontFamily: "var(--pr-font)" }}>
      <div className="flex flex-col gap-3 mb-8">
        <h2 className="text-sm font-medium tracking-[0.18em] uppercase text-muted-foreground">
          About
        </h2>
        <div
          className="h-[3px] w-10 rounded-full"
          style={{
            background: "var(--pr-accent)",
            borderRadius: "var(--pr-radius)",
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,220px)_1fr] gap-8 md:gap-12 items-start">
        <div className="flex flex-col items-start gap-4">
          <div
            className="w-full aspect-square max-w-[220px] overflow-hidden border border-border bg-surface-2 flex items-center justify-center"
            style={{ borderRadius: "var(--pr-radius)" }}
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={name ? `${name} portrait` : "Portrait"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span
                className="text-4xl font-medium text-muted-foreground"
                aria-hidden="true"
              >
                {initial}
              </span>
            )}
          </div>

          {(phone || location) && (
            <div className="flex flex-col gap-2 w-full">
              {phone && (
                <span
                  className="inline-flex items-center gap-2 border border-border bg-surface px-3 py-1.5 text-sm text-muted-foreground w-fit"
                  style={{ borderRadius: "var(--pr-radius)" }}
                >
                  {phone}
                </span>
              )}
              {location && (
                <span
                  className="inline-flex items-center gap-2 border border-border bg-surface px-3 py-1.5 text-sm text-muted-foreground w-fit"
                  style={{ borderRadius: "var(--pr-radius)" }}
                >
                  {location}
                </span>
              )}
            </div>
          )}
        </div>

        <p
          className="whitespace-pre-line text-foreground text-base sm:text-lg leading-relaxed"
          style={{ maxWidth: "65ch" }}
        >
          {about}
        </p>
      </div>
    </div>
  );
};
