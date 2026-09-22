import { ThemeSection } from "./ThemeSection";
import type { ThemeSectionComponent, ThemeSectionId } from "../types";

export function makeThemeSection(section: ThemeSectionId): ThemeSectionComponent {
  return function ThemeSectionVariant(props) {
    return <ThemeSection {...props} section={section} tone={props.tone} />;
  };
}
