import type { ThemeDefinition } from "../types";
import { ThemePage } from "./ThemePage";
import { tokens } from "./tokens";

// NOTE: the uploaded zip had id: "brutalist" here (copy-paste) – fixed to "cinematic".
export default {
  id: "cinematic",
  name: "Cinematic",
  description: "A nostalgic, scroll-driven film: one living world, one chapter per section.",
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
  // Only "default" until real variants exist (each acts as an alternate "cut").
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
