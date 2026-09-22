import type { ThemeDefinition } from "../types";
import { ThemePage } from "./ThemePage";
import { tokens } from "./tokens";
export default {
  id: "soft-luxury",
  name: "Soft Luxury",
  description: "Restrained warmth and polished surfaces.",
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
    navbar: ["default", "alt"],
    hero: ["default", "alt"],
    about: ["default", "alt"],
    skills: ["default", "alt"],
    projects: ["default", "alt"],
    experience: ["default", "alt"],
    education: ["default", "alt"],
    certificates: ["default", "alt"],
    contact: ["default", "alt"],
    footer: ["default", "alt"],
  },
  ThemePage,
} satisfies ThemeDefinition;
