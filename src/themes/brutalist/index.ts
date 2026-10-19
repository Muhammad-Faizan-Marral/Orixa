import type { ThemeDefinition } from "../types";
import { ThemePage } from "./ThemePage";
import { tokens } from "./tokens";

export default {
  id: "brutalist",
  name: "Brutalist",
  description: "Direct graphic portfolio system.",
  premium: true,
  tokens,
  defaults: {
    navbar: "default",
    hero: "default",
    about: "default",
    skills: "default",
    projects: "default",
    experience: "default",
    education: "default",
    certificates: "default",
    contact: "default",
    footer: "default",
  },
  variants: {
    navbar: ["default"],
    hero: ["default"],
    about: ["default"],
    skills: ["default"],
    projects: ["default"],
    experience: ["default"],
    education: ["default"],
    certificates: ["default"],
    contact: ["default"],
    footer: ["default"],
  },
  ThemePage,
} satisfies ThemeDefinition;