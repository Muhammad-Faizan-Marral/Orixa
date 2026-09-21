import { cn } from "@/lib/utils";
import {
  DEFAULT_COMPONENT_SELECTION,
  DEFAULT_DESIGN_PREFERENCES,
} from "@/features/portfolio/component-variants";
import { NavbarSection } from "./sections/navbar";

import { getThemeStyle, sectionShellFor, sectionAlignFor } from "./theme";
import { SectionWrapper } from "./shared/SectionWrapper";
import { HeroSection } from "./sections/hero";
import { AboutSection } from "./sections/about";
import { SkillsSection } from "./sections/skills";
import { ProjectsSection } from "./sections/projects";
import { ExperienceSection } from "./sections/experience";
import { EducationSection } from "./sections/education";
import { CertificatesSection } from "./sections/certificates";
import { ContactSection } from "./sections/contact";
import { FooterSection } from "./sections/footer";
import type {
  PortfolioRenderConfig,
  PublicProfileMeta,
  RendererComponentSelection,
  RendererDesignPreferences,
} from "./types";

function resolveSelection(
  incoming?: RendererComponentSelection | null,
): RendererComponentSelection {
  return { ...DEFAULT_COMPONENT_SELECTION, ...(incoming ?? {}) };
}

function resolveDesign(
  incoming?: RendererDesignPreferences | null,
): RendererDesignPreferences {
  return { ...DEFAULT_DESIGN_PREFERENCES, ...(incoming ?? {}) };
}

function isEnabled(
  selection: RendererComponentSelection,
  key: keyof RendererComponentSelection,
) {
  const s = selection[key];
  if (!s) return true;
  return s.enabled !== false;
}

export function DesignEngine({
  config,
  profile,
}: {
  config: PortfolioRenderConfig;
  profile: PublicProfileMeta & { isPremium?: boolean };
}) {
  const selection = resolveSelection(config.componentSelection);
  const design = resolveDesign(config.designPreferences);
  const themeMode = design.themeMode === "light" ? "light" : "dark";
  const designDna = design.designDna || "soft-luxury";
  const layout = design.layout || "standard";

  const shell = (
    section:
      | "hero"
      | "about"
      | "skills"
      | "projects"
      | "experience"
      | "education"
      | "certificates"
      | "contact",
    variant?: string,
  ) => sectionShellFor(section, variant, designDna);
  const align = (
    section:
      | "hero"
      | "about"
      | "skills"
      | "projects"
      | "experience"
      | "education"
      | "certificates"
      | "contact",
    variant?: string,
  ) => sectionAlignFor(shell(section, variant), layout, variant);

  return (
    <div
      className={cn(
        themeMode === "light" ? "light" : "",
        "min-h-screen bg-background text-foreground",
      )}
      style={getThemeStyle(design)}
    >
      {isEnabled(selection, "navbar") && (
        <NavbarSection
          variant={selection.navbar?.variant}
          config={config}
          profile={profile}
        />
      )}

      {isEnabled(selection, "hero") && (
        <SectionWrapper
          id="hero"
          shell={shell("hero", selection.hero?.variant)}
          align={align("hero", selection.hero?.variant)}
          layout={layout}
          designDna={designDna}
          className={
            selection.navbar?.variant === "floating" ? "pt-28" : "pt-16"
          }
        >
          <HeroSection
            variant={selection.hero?.variant}
            config={config}
            profile={profile}
          />
        </SectionWrapper>
      )}

      {isEnabled(selection, "about") && config.about && (
        <SectionWrapper
          id="about"
          shell={shell("about", selection.about?.variant)}
          align={align("about", selection.about?.variant)}
          layout={layout}
          designDna={designDna}
        >
          <AboutSection variant={selection.about?.variant} config={config} />
        </SectionWrapper>
      )}

      {isEnabled(selection, "skills") && (config.skills?.length ?? 0) > 0 && (
        <SectionWrapper
          id="skills"
          shell={shell("skills", selection.skills?.variant)}
          align={align("skills", selection.skills?.variant)}
          layout={layout}
          designDna={designDna}
        >
          <SkillsSection
            variant={selection.skills?.variant}
            skills={config.skills || []}
          />
        </SectionWrapper>
      )}

      {isEnabled(selection, "projects") &&
        (config.projects?.length ?? 0) > 0 && (
          <SectionWrapper
            id="projects"
            shell={shell("projects", selection.projects?.variant)}
            align={align("projects", selection.projects?.variant)}
            layout={layout}
            designDna={designDna}
          >
            <ProjectsSection
              variant={selection.projects?.variant}
              projects={config.projects || []}
              design={design}
              portfolioId={config.portfolioId}
            />
          </SectionWrapper>
        )}

      {isEnabled(selection, "experience") &&
        (config.experience?.length ?? 0) > 0 && (
          <SectionWrapper
            id="experience"
            shell={shell("experience", selection.experience?.variant)}
            align={align("experience", selection.experience?.variant)}
            layout={layout}
            designDna={designDna}
          >
            <ExperienceSection
              variant={selection.experience?.variant}
              experience={config.experience || []}
            />
          </SectionWrapper>
        )}

      {isEnabled(selection, "education") &&
        (config.education?.length ?? 0) > 0 && (
          <SectionWrapper
            id="education"
            shell={shell("education", selection.education?.variant)}
            align={align("education", selection.education?.variant)}
            layout={layout}
            designDna={designDna}
          >
            <EducationSection
              variant={selection.education?.variant}
              education={config.education || []}
            />
          </SectionWrapper>
        )}

      {isEnabled(selection, "certificates") &&
        (config.certificates?.length ?? 0) > 0 && (
          <SectionWrapper
            id="certificates"
            shell={shell("certificates", selection.certificates?.variant)}
            align={align("certificates", selection.certificates?.variant)}
            layout={layout}
            designDna={designDna}
          >
            <CertificatesSection
              variant={selection.certificates?.variant}
              certificates={config.certificates || []}
            />
          </SectionWrapper>
        )}

      {isEnabled(selection, "contact") && (
        <SectionWrapper
          id="contact"
          shell={shell("contact", selection.contact?.variant)}
          align={align("contact", selection.contact?.variant)}
          layout={layout}
          designDna={designDna}
        >
          <ContactSection
            variant={selection.contact?.variant}
            config={config}
          />
        </SectionWrapper>
      )}

      {isEnabled(selection, "footer") && (
        <FooterSection
          variant={selection.footer?.variant}
          name={config.name}
          username={profile.username}
          headline={config.headline}
          about={config.about}
          githubUrl={config.githubUrl}
          linkedinUrl={config.linkedinUrl}
          phone={config.phone}
          resumeUrl={config.resumeUrl}
          portfolioId={config.portfolioId}
          isPremium={profile.isPremium ?? false}
        />
      )}
    </div>
  );
}
