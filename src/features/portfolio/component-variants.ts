export const SECTION_VARIANTS = {
  navbar: ["minimal", "floating"] as const,
  hero: ["modern", "minimal", "creative", "centered", "split"] as const,
  about: ["default", "split", "cards"] as const,
  skills: ["grid", "list", "tags", "bars"] as const,
  projects: ["cards", "list", "featured", "masonry"] as const,
  experience: ["timeline", "cards", "compact"] as const,
  education: ["simple", "detailed", "timeline"] as const,
  certificates: ["simple", "grid", "badges"] as const,
  contact: ["form", "simple", "split"] as const,
  footer: ["minimal", "detailed"] as const,
} as const;

// DEFAULT_COMPONENT_SELECTION mein add:
// navbar: { enabled: true, variant: "minimal" },

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
