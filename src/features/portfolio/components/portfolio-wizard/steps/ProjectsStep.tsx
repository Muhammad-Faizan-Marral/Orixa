"use client";

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

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="pw-field">
      <label className={`pw-label${required ? " pw-label--required" : ""}`}>{label}</label>
      {children}
      {error && (
        <span className="pw-error-msg">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="6" cy="6" r="5.25" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6 4v2.5M6 8.25v.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
}

function PwInput({ error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return <input className={`pw-input${error ? " pw-input--error" : ""}`} {...props} />;
}

function PwTextarea({ rows = 3, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { rows?: number }) {
  return <textarea rows={rows} className="pw-input pw-textarea" {...props} />;
}

export function ProjectsStep({ portfolioId, projects, setProjects, fieldErrors, clearFieldError, setMessage }: ProjectsStepProps) {
  return (
    <div className="pw-section">
      <div>
        <div className="pw-step-header__eyebrow">Work</div>
        <h2 className="pw-step-header__title">Portfolio projects</h2>
        <p className="pw-step-header__desc">
          Showcase your best work. Include a live URL and image for maximum impact.
        </p>
      </div>

      {projects.length === 0 && (
        <div className="pw-info">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25" />
            <path d="M8 7v4M8 5.25v.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          No projects added yet. Add your best work below.
        </div>
      )}

      {projects.map((item, index) => (
        <div key={item.id} className="pw-card">
          <div className="pw-card__header">
            <span className="pw-card__title">
              <span className="pw-card__num">{index + 1}</span>
              Project
            </span>
            <button
              type="button"
              className="pw-card__remove"
              onClick={() => {
                setProjects((c) => c.filter((p) => p.id !== item.id));
                clearFieldError(`proj-title-${item.id}`);
                clearFieldError(`proj-url-${item.id}`);
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Remove
            </button>
          </div>
          <div className="pw-card__body">
            <Field label="Project title" required error={fieldErrors[`proj-title-${item.id}`]}>
              <PwInput
                value={item.title}
                onChange={(e) => { setProjects((c) => c.map((p) => p.id === item.id ? { ...p, title: e.target.value } : p)); clearFieldError(`proj-title-${item.id}`); }}
                error={fieldErrors[`proj-title-${item.id}`]}
              />
            </Field>
            <Field label="Description">
              <PwTextarea
                value={item.description ?? ""}
                onChange={(e) => setProjects((c) => c.map((p) => p.id === item.id ? { ...p, description: e.target.value } : p))}
                rows={3}
                placeholder="What it does and how you built it..."
              />
            </Field>
            <div className="pw-grid-2">
              <Field label="Live URL" error={fieldErrors[`proj-url-${item.id}`]}>
                <PwInput
                  value={item.url ?? ""}
                  onChange={(e) => { setProjects((c) => c.map((p) => p.id === item.id ? { ...p, url: e.target.value } : p)); clearFieldError(`proj-url-${item.id}`); }}
                  placeholder="https://..."
                  error={fieldErrors[`proj-url-${item.id}`]}
                />
              </Field>
              <Field label="Technologies (comma separated)">
                <PwInput
                  value={(item.technologies ?? []).join(", ")}
                  onChange={(e) => setProjects((c) => c.map((p) => p.id === item.id ? { ...p, technologies: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) } : p))}
                  placeholder="Next.js, Tailwind, Supabase"
                />
              </Field>
            </div>
            <div>
              <div className="pw-label" style={{ marginBottom: 8 }}>Project image</div>
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt=""
                  style={{ width: 160, height: 96, objectFit: "cover", borderRadius: 8, border: "1px solid var(--pw-border)", marginBottom: 10, display: "block" }}
                />
              )}
              <label className="pw-file-btn">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1v7M3 4l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M1 10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {item.imageUrl ? "Change image" : "Upload image"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  style={{ display: "none" }}
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
                        setProjects((c) => c.map((p) => p.id === item.id ? { ...p, imageUrl: res.data!.url! } : p));
                      } else if (!res.success) {
                        setMessage({ type: "error", text: res.message ?? "Image upload failed." });
                      }
                    } catch {
                      setMessage({ type: "error", text: "Unexpected error uploading image." });
                    } finally {
                      inputEl.value = "";
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="pw-add-btn"
        onClick={() => setProjects((c) => [...c, { id: createId(), title: "", description: "", url: "", technologies: [], imageUrl: "" }])}
      >
        <span className="pw-add-btn__icon">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </span>
        Add project
      </button>
    </div>
  );
}
