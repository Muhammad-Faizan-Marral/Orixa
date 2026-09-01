import React from "react";

type AboutDefaultProps = {
  config: {
    name?: string | null;
    about?: string | null;
    avatarUrl?: string | null;
    phone?: string | null;
    location?: string | null;
  };
};

export const AboutDefault: React.FC<AboutDefaultProps> = ({ config }) => {
  const { about } = config;

  if (!about) return null;

  return (
    <div
      className="w-full"
      style={{ fontFamily: "var(--pr-font)" }}
    >
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
        className="whitespace-pre-line text-foreground text-base sm:text-lg leading-relaxed"
        style={{ maxWidth: "65ch" }}
      >
        {about}
      </p>
    </div>
  );
};