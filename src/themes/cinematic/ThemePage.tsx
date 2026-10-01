import type { ThemePageProps } from "../types";
import { buildCinematicModel } from "./data";

/**
 * STEP 1 (schema only): builds the model, renders no UI yet.
 * Next steps replace the <main> body with <Scene/> + <Sections/> + <FilmOverlay/>.
 */
export function ThemePage({ config, profile }: ThemePageProps) {
  const { journey } = buildCinematicModel({ config, profile });

  return (
    <main
      data-theme="cinematic"
      data-acts={journey.acts.map((a) => a.id).join(",")}
      style={{ minHeight: `${journey.totalScrollVh}vh` }}
    />
  );
}
