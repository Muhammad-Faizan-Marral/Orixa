import type { RendererDesignPreferences } from "./types";

const RADIUS: Record<string, string> = {
  none: "0px",
  small: "4px",
  medium: "10px",
  large: "18px",
};

export function getThemeStyle(
  prefs?: RendererDesignPreferences | null,
): React.CSSProperties {
  const accent = prefs?.accentColor || "#6c5cff";
  const font = prefs?.fontFamily || "Inter";
  const radius = RADIUS[prefs?.borderRadius || "medium"] || "10px";

  return {
    ["--pr-accent" as string]: accent,
    ["--pr-font" as string]: font,
    ["--pr-radius" as string]: radius,
    fontFamily: `var(--pr-font), ui-sans-serif, system-ui, sans-serif`,
  } as React.CSSProperties;
}

export function layoutMaxWidth(layout?: string) {
  if (layout === "wide") return "max-w-6xl";
  if (layout === "centered") return "max-w-3xl";
  return "max-w-5xl";
}

export function cardClass(style?: string) {
  if (style === "flat") return "bg-surface";
  if (style === "elevated") return "bg-surface shadow-lg shadow-black/20";
  return "bg-surface border border-border";
}
