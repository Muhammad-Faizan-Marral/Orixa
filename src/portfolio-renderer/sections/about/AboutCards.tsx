import React from "react";

type AboutCardsProps = {
  config: {
    name?: string | null;
    about?: string | null;
    avatarUrl?: string | null;
    phone?: string | null;
    location?: string | null;
  };
};

export const AboutCards: React.FC<AboutCardsProps> = ({ config }) => {
  const { name, about, phone, location } = config;

  if (!about) return null;

  const infoItems: { label: string; value: string }[] = [];

  if (name) infoItems.push({ label: "Name", value: name });
  if (location) infoItems.push({ label: "Location", value: location });
  if (phone) infoItems.push({ label: "Phone", value: phone });

  const cards = infoItems.slice(0, 3);

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

      <p
        className="whitespace-pre-line text-foreground text-base sm:text-lg leading-relaxed mb-8"
        style={{ maxWidth: "65ch" }}
      >
        {about}
      </p>

      {cards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {cards.map((item) => (
            <div
              key={item.label}
              className="border border-border bg-surface-2 px-5 py-4 flex flex-col gap-1"
              style={{ borderRadius: "var(--pr-radius)" }}
            >
              <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {item.label}
              </span>
              <span className="text-sm text-foreground break-words">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};