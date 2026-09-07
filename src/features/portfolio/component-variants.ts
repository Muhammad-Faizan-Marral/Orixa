export const SECTION_VARIANTS = {
  navbar: ["minimal", "floating", "glass"] as const,

  hero: [ "modern", "minimal", "creative", "centered", "split", "editorial", "cinematic", "brutalist",  ] as const,

  about: [ "default", "split", "cards", "editorial", "story", "portrait",  ] as const,

  skills: [ "grid", "list", "tags", "bars", "cloud", "progress", "cards",  ] as const,

  projects: [ "cards", "list", "featured", "masonry", "showcase", "bento", "cinema",  ] as const,

  experience: [ "timeline", "cards", "compact", "rail", "stack", "editorial",  ] as const,

  education: [ "simple", "detailed", "timeline", "rail", "cards", "editorial",  ] as const,

  certificates: [ "simple", "grid", "badges", "showcase", "wall", "minimal-grid",  ] as const,

  contact: [ "form", "simple", "split", "magnetic", "split-motion", "glass",  ] as const,

  footer: ["minimal", "detailed", "editorial", "mega"] as const,
  
} as const;


export type SectionKey = keyof typeof SECTION_VARIANTS;

export type SectionSelection = {
  enabled: boolean;
  variant: string;
};

export type ComponentSelection = {
  [K in SectionKey]: SectionSelection;
};

export const DEFAULT_COMPONENT_SELECTION: ComponentSelection = {
  navbar: { enabled: true, variant: "minimal" },
  hero: { enabled: true, variant: "modern" },
  about: { enabled: true, variant: "default" },
  skills: { enabled: true, variant: "grid" },
  projects: { enabled: true, variant: "cards" },
  experience: { enabled: true, variant: "timeline" },
  education: { enabled: true, variant: "simple" },
  certificates: { enabled: true, variant: "simple" },
  contact: { enabled: true, variant: "form" },
  footer: { enabled: true, variant: "minimal" },
};

export const DEFAULT_DESIGN_PREFERENCES = {
  themeMode: "dark" as "light" | "dark",
  layout: "standard" as "standard" | "wide" | "centered",
  accentColor: "#6c5cff",
  fontFamily: "Inter",
  borderRadius: "medium" as "none" | "small" | "medium" | "large",
  cardStyle: "bordered" as "flat" | "bordered" | "elevated",
  designDna: "soft-luxury" as
    | "editorial"
    | "soft-luxury"
    | "tech-dense"
    | "minimal-airy"
    | "neo-glass"
    | "brutalist"
    | "cinematic",
  density: "comfortable" as "compact" | "comfortable" | "spacious",
  sectionSpacing: "normal" as "tight" | "normal" | "loose",
};

/** Short list for AI prompt (keep prompt small / cheap) */
export function variantsPromptBlock(): string {
  return Object.entries(SECTION_VARIANTS)
    .map(
      ([section, variants]) =>
        `- ${section}: ${(variants as readonly string[]).join(" | ")}`,
    )
    .join("\n");
}
