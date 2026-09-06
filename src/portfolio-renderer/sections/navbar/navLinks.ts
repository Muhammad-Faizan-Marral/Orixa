import type { PortfolioRenderConfig } from "../../types";

export type NavLink = {
  id: string;
  label: string;
};

/**
 * Returns only the nav links whose corresponding section has real data.
 * "About" and "Contact" are always included if config has any content at all.
 */
export function buildNavLinks(config: PortfolioRenderConfig): NavLink[] {
  const links: NavLink[] = [];

  // About — shown if name or about text exists
  if (config.name || config.about) {
    links.push({ id: "about", label: "About" });
  }

  // Skills — shown if skills array is non-empty
  if (Array.isArray(config.skills) && config.skills.length > 0) {
    links.push({ id: "skills", label: "Skills" });
  }

  // Projects — shown if projects array is non-empty
  if (Array.isArray(config.projects) && config.projects.length > 0) {
    links.push({ id: "projects", label: "Work" });
  }

  // Experience — shown if experience array is non-empty
  if (Array.isArray(config.experience) && config.experience.length > 0) {
    links.push({ id: "experience", label: "Experience" });
  }

  // Education — shown if education array is non-empty
  if (Array.isArray(config.education) && config.education.length > 0) {
    links.push({ id: "education", label: "Education" });
  }

  // Certificates — shown if certificates array is non-empty
  if (Array.isArray(config.certificates) && config.certificates.length > 0) {
    links.push({ id: "certificates", label: "Certificates" });
  }

  // Contact — always included as the final CTA anchor
  links.push({ id: "contact", label: "Contact" });

  return links;
}
