"use client";

import { Input } from "@/components/UI/Input";
import { Textarea } from "@/components/UI/Textarea";
import {
  RepeaterCard,
  AddButton,
} from "@/features/portfolio/components/repeater-card";
import { uploadFile } from "@/actions/profile/upload-file";
import { createId } from "../utils";
import type { Project, FieldErrors, Message, Setter } from "../types";

type ProjectsStepProps = {
  portfolioId: string;
  projects: Project[];
  setProjects: Setter<Project[]>;
  fieldErrors: FieldErrors;
  clearFieldError: (key: string) => void;
  setMessage: (msg: Message) => void;
};

export function ProjectsStep({
  portfolioId,
  projects,
  setProjects,
  fieldErrors,
  clearFieldError,
  setMessage,
}: ProjectsStepProps) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-h3">Projects</h2>
        <p className="text-small text-muted-foreground mt-1">
          Image upload only here (per project).
        </p>
      </div>

      {projects.map((item, index) => (
        <RepeaterCard
          key={item.id}
          title={`Project ${index + 1}`}
          onRemove={() => {
            setProjects((c) => c.filter((p) => p.id !== item.id));
            clearFieldError(`proj-title-${item.id}`);
            clearFieldError(`proj-url-${item.id}`);
          }}
        >
          <Input
            label="Title"
            value={item.title}
            onChange={(e) => {
              setProjects((c) =>
                c.map((p) =>
                  p.id === item.id ? { ...p, title: e.target.value } : p,
                ),
              );
              clearFieldError(`proj-title-${item.id}`);
            }}
            error={fieldErrors[`proj-title-${item.id}`]}
          />
          <Textarea
            label="Description"
            value={item.description ?? ""}
            onChange={(e) =>
              setProjects((c) =>
                c.map((p) =>
                  p.id === item.id
                    ? { ...p, description: e.target.value }
                    : p,
                ),
              )
            }
            rows={3}
          />
          <Input
            label="Live URL"
            value={item.url ?? ""}
            onChange={(e) => {
              setProjects((c) =>
                c.map((p) =>
                  p.id === item.id ? { ...p, url: e.target.value } : p,
                ),
              );
              clearFieldError(`proj-url-${item.id}`);
            }}
            placeholder="https://..."
            error={fieldErrors[`proj-url-${item.id}`]}
          />
          <Input
            label="Technologies (comma separated)"
            value={(item.technologies ?? []).join(", ")}
            onChange={(e) =>
              setProjects((c) =>
                c.map((p) =>
                  p.id === item.id
                    ? {
                        ...p,
                        technologies: e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean),
                      }
                    : p,
                ),
              )
            }
            placeholder="Next.js, Tailwind, Supabase"
          />
          <div className="space-y-2">
            <p className="text-label">Project image</p>
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt=""
                className="h-24 w-40 rounded-md object-cover border border-border"
              />
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                const inputEl = e.target;
                if (!file) return;

                const fd = new FormData();
                fd.append("file", file);
                fd.append("type", "project-image");
                fd.append("portfolioId", portfolioId);

                try {
                  const res = await uploadFile(fd);

                  if (res.success && res.data?.url) {
                    setProjects((c) =>
                      c.map((p) =>
                        p.id === item.id
                          ? { ...p, imageUrl: res.data!.url! }
                          : p,
                      ),
                    );
                  } else if (!res.success) {
                    setMessage({
                      type: "error",
                      text: res.message ?? "Image upload failed.",
                    });
                  }
                } catch (err) {
                  console.error(
                    "[ProjectsStep] project image upload error:",
                    err,
                  );
                  setMessage({
                    type: "error",
                    text: "Unexpected error uploading image.",
                  });
                } finally {
                  inputEl.value = "";
                }
              }}
              className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary"
            />
          </div>
        </RepeaterCard>
      ))}

      <AddButton
        label="Add project"
        onClick={() =>
          setProjects((c) => [
            ...c,
            {
              id: createId(),
              title: "",
              description: "",
              url: "",
              technologies: [],
              imageUrl: "",
            },
          ])
        }
      />
    </section>
  );
}
