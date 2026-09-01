import type {
  RendererDesignPreferences,
  RendererProject,
} from "../../types";

import { ProjectsCards } from "./ProjectsCards";
import { ProjectsFeatured } from "./ProjectsFeatured";
import { ProjectsList } from "./ProjectsList";
import { ProjectsMasonry } from "./ProjectsMasonry";

export function ProjectsSection({
  variant,
  projects,
  design,
}: {
  variant?: string;
  projects: RendererProject[];
  design?: RendererDesignPreferences;
}) {
  switch (variant) {
    case "featured":
      return (
        <ProjectsFeatured
          projects={projects}
          design={design}
        />
      );

    case "list":
      return (
        <ProjectsList
          projects={projects}
          design={design}
        />
      );

    case "masonry":
      return (
        <ProjectsMasonry
          projects={projects}
          design={design}
        />
      );

    case "cards":
    default:
      return (
        <ProjectsCards
          projects={projects}
          design={design}
        />
      );
  }
}