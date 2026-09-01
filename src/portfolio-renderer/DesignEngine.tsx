import { cn } from "@/lib/utils";
import {
  DEFAULT_COMPONENT_SELECTION,
  DEFAULT_DESIGN_PREFERENCES,
} from "@/features/portfolio/component-variants";
import { NavbarSection } from "./sections/navbar";

import { getThemeStyle, layoutMaxWidth } from "./theme";
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
  return {
    ...DEFAULT_COMPONENT_SELECTION,
    ...(incoming ?? {}),
  };
}

function resolveDesign(
  incoming?: RendererDesignPreferences | null,
): RendererDesignPreferences {
  return {
    ...DEFAULT_DESIGN_PREFERENCES,
    ...(incoming ?? {}),
  };
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
  profile: PublicProfileMeta;
}) {
  const selection = resolveSelection(config.componentSelection);
  const design = resolveDesign(config.designPreferences);
  const maxW = layoutMaxWidth(design.layout);
  const themeMode = design.themeMode === "light" ? "light" : "dark";

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
          maxWidthClass={maxW}
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
        <SectionWrapper id="about" maxWidthClass={maxW}>
          <AboutSection variant={selection.about?.variant} config={config} />
        </SectionWrapper>
      )}

      {isEnabled(selection, "skills") && (config.skills?.length ?? 0) > 0 && (
        <SectionWrapper id="skills" maxWidthClass={maxW}>
          <SkillsSection
            variant={selection.skills?.variant}
            skills={config.skills || []}
          />
        </SectionWrapper>
      )}

      {isEnabled(selection, "projects") &&
        (config.projects?.length ?? 0) > 0 && (
          <SectionWrapper id="projects" maxWidthClass={maxW}>
            <ProjectsSection
              variant={selection.projects?.variant}
              projects={config.projects || []}
              design={design}
            />
          </SectionWrapper>
        )}

      {isEnabled(selection, "experience") &&
        (config.experience?.length ?? 0) > 0 && (
          <SectionWrapper id="experience" maxWidthClass={maxW}>
            <ExperienceSection
              variant={selection.experience?.variant}
              experience={config.experience || []}
            />
          </SectionWrapper>
        )}

      {isEnabled(selection, "education") &&
        (config.education?.length ?? 0) > 0 && (
          <SectionWrapper id="education" maxWidthClass={maxW}>
            <EducationSection
              variant={selection.education?.variant}
              education={config.education || []}
            />
          </SectionWrapper>
        )}

      {isEnabled(selection, "certificates") &&
        (config.certificates?.length ?? 0) > 0 && (
          <SectionWrapper id="certificates" maxWidthClass={maxW}>
            <CertificatesSection
              variant={selection.certificates?.variant}
              certificates={config.certificates || []}
            />
          </SectionWrapper>
        )}

      {isEnabled(selection, "contact") && (
        <SectionWrapper id="contact" maxWidthClass={maxW}>
          <ContactSection
            variant={selection.contact?.variant}
            config={config}
          />
        </SectionWrapper>
      )}

      {isEnabled(selection, "footer") && (
        <FooterSection
          variant={selection.footer?.variant}
          name={config.name || undefined}
          username={profile.username}
        />
      )}
    </div>
  );
}
