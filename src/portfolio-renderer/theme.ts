import type { DesignDna, RendererDesignPreferences } from "./types";

const RADIUS: Record<string, string> = {
  none: "0px",
  small: "6px",
  medium: "12px",
  large: "20px",
};

const DNA_PRESETS: Record<
  DesignDna,
  {
    radius: string;
    cardShadow: string;
    cardBorder: string;
    headingTracking: string;
    bodyLeading: string;
    sectionPy: string;
    accentSoft: string;
  }
> = {
  editorial: {
    radius: "4px",
    cardShadow: "none",
    cardBorder: "1px solid var(--pr-border)",
    headingTracking: "-0.03em",
    bodyLeading: "1.75",
    sectionPy: "py-20 sm:py-28",
    accentSoft: "color-mix(in srgb, var(--pr-accent) 12%, transparent)",
  },
  "soft-luxury": {
    radius: "18px",
    cardShadow: "0 20px 50px -20px rgba(0,0,0,0.35)",
    cardBorder:
      "1px solid color-mix(in srgb, var(--pr-border) 70%, transparent)",
    headingTracking: "-0.02em",
    bodyLeading: "1.7",
    sectionPy: "py-20 sm:py-24",
    accentSoft: "color-mix(in srgb, var(--pr-accent) 15%, transparent)",
  },
  "tech-dense": {
    radius: "8px",
    cardShadow: "0 1px 0 rgba(255,255,255,0.04)",
    cardBorder: "1px solid var(--pr-border)",
    headingTracking: "-0.01em",
    bodyLeading: "1.55",
    sectionPy: "py-14 sm:py-18",
    accentSoft: "color-mix(in srgb, var(--pr-accent) 18%, transparent)",
  },
  "minimal-airy": {
    radius: "12px",
    cardShadow: "none",
    cardBorder: "1px solid transparent",
    headingTracking: "-0.04em",
    bodyLeading: "1.8",
    sectionPy: "py-24 sm:py-32",
    accentSoft: "color-mix(in srgb, var(--pr-accent) 8%, transparent)",
  },
  "neo-glass": {
    radius: "16px",
    cardShadow: "0 8px 32px rgba(0,0,0,0.25)",
    cardBorder: "1px solid color-mix(in srgb, white 12%, transparent)",
    headingTracking: "-0.02em",
    bodyLeading: "1.65",
    sectionPy: "py-18 sm:py-24",
    accentSoft: "color-mix(in srgb, var(--pr-accent) 20%, transparent)",
  },
  brutalist: {
    radius: "0px",
    cardShadow: "4px 4px 0 var(--pr-accent)",
    cardBorder: "2px solid var(--pr-foreground)",
    headingTracking: "0em",
    bodyLeading: "1.5",
    sectionPy: "py-16 sm:py-20",
    accentSoft: "color-mix(in srgb, var(--pr-accent) 25%, transparent)",
  },
  cinematic: {
    radius: "10px",
    cardShadow: "0 25px 60px -25px rgba(0,0,0,0.6)",
    cardBorder:
      "1px solid color-mix(in srgb, var(--pr-border) 50%, transparent)",
    headingTracking: "-0.025em",
    bodyLeading: "1.7",
    sectionPy: "py-22 sm:py-28",
    accentSoft: "color-mix(in srgb, var(--pr-accent) 14%, transparent)",
  },
};

export function getThemeStyle(
  prefs?: RendererDesignPreferences | null,
): React.CSSProperties {
  const accent = prefs?.accentColor || "#6c5cff";
  const font = prefs?.fontFamily || "Inter";
  const dna = (prefs?.designDna || "soft-luxury") as DesignDna;
  const preset = DNA_PRESETS[dna] || DNA_PRESETS["soft-luxury"];
  const radius =
    RADIUS[prefs?.borderRadius || "medium"] || preset.radius || "12px";

  return {
    ["--pr-accent" as string]: accent,
    ["--pr-font" as string]: font,
    ["--pr-radius" as string]: radius,
    ["--pr-card-shadow" as string]: preset.cardShadow,
    ["--pr-card-border" as string]: preset.cardBorder,
    ["--pr-heading-tracking" as string]: preset.headingTracking,
    ["--pr-body-leading" as string]: preset.bodyLeading,
    ["--pr-section-py" as string]: preset.sectionPy,
    ["--pr-accent-soft" as string]: preset.accentSoft,
    ["--pr-dna" as string]: dna,
    fontFamily: `var(--pr-font), ui-sans-serif, system-ui, sans-serif`,
  } as React.CSSProperties;
}

export function layoutMaxWidth(layout?: string) {
  if (layout === "wide") return "max-w-6xl";
  if (layout === "centered") return "max-w-3xl";
  return "max-w-5xl";
}

export function cardClass(style?: string) {
  const base = "transition-all duration-300";

  if (style === "flat") {
    return `${base} bg-surface`;
  }
  if (style === "elevated") {
    return `${base} bg-surface shadow-[var(--pr-card-shadow)]`;
  }
  // bordered (default)
  return `${base} bg-surface border border-[var(--pr-card-border)]`;
}

export function getDnaSectionPy(dna?: DesignDna) {
  const preset = DNA_PRESETS[dna || "soft-luxury"];
  return preset.sectionPy;
}
