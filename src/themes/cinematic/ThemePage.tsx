import type { CSSProperties } from "react";
import type { ThemePageProps } from "../types";
import { buildCinematicModel } from "./data";
import { FILM_LOOK } from "./data/mood.config";
import { CinematicSceneLazy } from "./scene";
import { SectionsLayer } from "./sections/SectionsLayer";
import { FilmOverlay } from "./sections/film/FilmOverlay";
import { Styles } from "./sections/shared/Styles";
import { tokens } from "./tokens";

/**
 * Layers (back -> front):  0 WebGL scene · 10 acts (HTML) · 50 film overlay.
 * The <main> itself is only a scroll spacer: (total + 100)vh makes
 * scrollY / (scrollHeight - innerHeight) line up exactly with journey ranges.
 */
export function ThemePage({ config, profile }: ThemePageProps) {
  const model = buildCinematicModel({ config, profile });

  const style = {
    height: `${model.journey.totalScrollVh + 100}vh`,
    background: tokens.backgroundColor,
    color: tokens.foregroundColor,
    "--cin-bg": tokens.backgroundColor,
    "--cin-fg": tokens.foregroundColor,
    "--cin-muted": tokens.mutedColor,
    "--cin-accent": tokens.accentColor,
    "--cin-display": `"${tokens.fontDisplay}", Georgia, "Times New Roman", serif`,
    "--cin-sans": `"${tokens.fontSans}", system-ui, sans-serif`,
  } as CSSProperties;

  return (
    <main
      data-theme="cinematic"
      data-motion={model.portfolio.flags.reducedMotion ? "reduced" : "full"}
      data-letterbox={FILM_LOOK.letterbox ? "on" : "off"}
      style={style}
    >
      <Styles />
      <CinematicSceneLazy model={model} />
      <SectionsLayer model={model} />
      <FilmOverlay journey={model.journey} look={FILM_LOOK} />
    </main>
  );
}
