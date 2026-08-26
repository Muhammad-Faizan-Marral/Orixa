"use client";

import { cn } from "@/lib/utils";

export type EditorSectionId =
  | "overview"
  | "projects"
  | "experience"
  | "skills"
  | "education"
  | "certificates"
  | "resume"
  | "design"
  | "seo";

const SECTIONS: { id: EditorSectionId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "certificates", label: "Certificates" },
  { id: "resume", label: "Resume" },
  { id: "design", label: "Sections & Design" },
  { id: "seo", label: "SEO" },
];

export function EditorNav({
  active,
  onChange,
}: {
  active: EditorSectionId;
  onChange: (section: EditorSectionId) => void;
}) {
  return (
    <nav className="no-scrollbar flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
      {SECTIONS.map((section) => {
        const isActive = section.id === active;
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onChange(section.id)}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors lg:w-full",
              isActive
                ? "bg-gradient-ion-soft border border-primary/25 text-foreground"
                : "border border-transparent text-muted-foreground hover:bg-surface-2 hover:text-foreground"
            )}
          >
            {section.label}
          </button>
        );
      })}
    </nav>
  );
}
