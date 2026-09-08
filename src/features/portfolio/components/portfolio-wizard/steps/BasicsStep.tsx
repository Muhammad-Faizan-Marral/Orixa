"use client";

import { uploadFile } from "@/actions/profile/upload-file";
import type { FieldErrors, Message } from "../types";

type BasicsStepProps = {
  portfolioId: string;
  name: string;
  setName: (v: string) => void;
  headline: string;
  setHeadline: (v: string) => void;
  about: string;
  setAbout: (v: string) => void;
  avatarUrl: string;
  setAvatarUrl: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  linkedinUrl: string;
  setLinkedinUrl: (v: string) => void;
  githubUrl: string;
  setGithubUrl: (v: string) => void;
  prompt: string;
  setPrompt: (v: string) => void;
  promptLocked: boolean;
  fieldErrors: FieldErrors;
  clearFieldError: (key: string) => void;
  setMessage: (msg: Message) => void;
};

// ---------------------------------------------------------------------------
// Micro-components (self-contained so this file works standalone)
// ---------------------------------------------------------------------------

function Field({
  label, required, error, hint, children,
}: {
  label: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode;
}) {
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
      {hint && !error && <span className="pw-hint">{hint}</span>}
    </div>
  );
}

function PwInput({ error, className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return <input className={`pw-input${error ? " pw-input--error" : ""} ${className}`} {...props} />;
}

function PwTextarea({ error, rows = 4, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string; rows?: number }) {
  return <textarea rows={rows} className={`pw-input pw-textarea${error ? " pw-input--error" : ""}`} {...props} />;
}

// ---------------------------------------------------------------------------
// BasicsStep
// ---------------------------------------------------------------------------

export function BasicsStep({
  portfolioId, name, setName, headline, setHeadline, about, setAbout,
  avatarUrl, setAvatarUrl, phone, setPhone, linkedinUrl, setLinkedinUrl,
  githubUrl, setGithubUrl, prompt, setPrompt, promptLocked,
  fieldErrors, clearFieldError, setMessage,
}: BasicsStepProps) {
  async function handleAvatarUpload(file: File | null, inputEl?: HTMLInputElement | null) {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "project-image");
    formData.append("portfolioId", portfolioId);
    try {
      const result = await uploadFile(formData);
      if (result.success && result.data?.url) {
        setAvatarUrl(result.data.url);
      } else if (!result.success) {
        setMessage({ type: "error", text: result.message ?? "Avatar upload failed." });
      }
    } catch {
      setMessage({ type: "error", text: "Unexpected error uploading avatar. Try again." });
    } finally {
      if (inputEl) inputEl.value = "";
    }
  }

  return (
    <div className="pw-section">
      <div>
        <div className="pw-step-header__eyebrow">Identity</div>
        <h2 className="pw-step-header__title">Your public profile</h2>
        <p className="pw-step-header__desc">
          This information appears on your portfolio. Add your name, bio, and contact links.
        </p>
      </div>

      <div className="pw-group-label">Personal details</div>

      <div className="pw-grid-2">
        <Field label="Full name" required error={fieldErrors.name}>
          <PwInput
            value={name}
            onChange={(e) => { setName(e.target.value); clearFieldError("name"); }}
            placeholder="Ali Khan"
            error={fieldErrors.name}
          />
        </Field>
        <Field label="Phone" error={fieldErrors.phone}>
          <PwInput
            value={phone}
            onChange={(e) => { setPhone(e.target.value); clearFieldError("phone"); }}
            placeholder="+92 300 1234567"
            error={fieldErrors.phone}
          />
        </Field>
      </div>

      <Field label="Headline" required error={fieldErrors.headline} hint="One sharp line — the first thing visitors read.">
        <PwInput
          value={headline}
          onChange={(e) => { setHeadline(e.target.value); clearFieldError("headline"); }}
          placeholder="Full-stack developer · Next.js & Node"
          error={fieldErrors.headline}
        />
      </Field>

      <Field label="About" error={fieldErrors.about} hint="Keep it under 300 words. Describe what you do and what you're looking for.">
        <PwTextarea
          value={about}
          onChange={(e) => { setAbout(e.target.value); clearFieldError("about"); }}
          placeholder="Short bio about yourself..."
          rows={4}
          error={fieldErrors.about}
        />
      </Field>

      <div className="pw-group-label" style={{ marginTop: 8 }}>Profile photo</div>

      <div className="pw-avatar-zone">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="pw-avatar-preview" />
        ) : (
          <span className="pw-avatar-placeholder">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3 21c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
        )}
        <div className="pw-avatar-info">
          <div className="pw-avatar-title">Portfolio photo</div>
          <div className="pw-avatar-hint">JPEG, PNG, or WebP. Shown on your public portfolio page.</div>
          <label className="pw-file-btn">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v7M3 4l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M1 10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {avatarUrl ? "Change photo" : "Upload photo"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              style={{ display: "none" }}
              onChange={(e) => handleAvatarUpload(e.target.files?.[0] ?? null, e.target)}
            />
          </label>
        </div>
      </div>

      <div className="pw-group-label" style={{ marginTop: 8 }}>Social links</div>

      <div className="pw-grid-2">
        <Field label="LinkedIn" error={fieldErrors.linkedinUrl}>
          <PwInput
            value={linkedinUrl}
            onChange={(e) => { setLinkedinUrl(e.target.value); clearFieldError("linkedinUrl"); }}
            placeholder="https://linkedin.com/in/..."
            error={fieldErrors.linkedinUrl}
          />
        </Field>
        <Field label="GitHub" error={fieldErrors.githubUrl}>
          <PwInput
            value={githubUrl}
            onChange={(e) => { setGithubUrl(e.target.value); clearFieldError("githubUrl"); }}
            placeholder="https://github.com/..."
            error={fieldErrors.githubUrl}
          />
        </Field>
      </div>

      <div className="pw-group-label" style={{ marginTop: 8 }}>AI design prompt</div>

      <div style={{ position: "relative" }}>
        <Field
          label="Design prompt"
          hint={
            promptLocked
              ? "Locked — prompts cannot be changed after first save."
              : "Describe the look you want. AI uses this to pick your layout, colors, and style."
          }
        >
          <PwTextarea
            value={prompt}
            onChange={(e) => { if (!promptLocked) setPrompt(e.target.value); }}
            placeholder="Modern dark theme, focused on full-stack projects with subtle animations..."
            rows={3}
            disabled={promptLocked}
          />
        </Field>
        {promptLocked && (
          <span
            style={{
              position: "absolute", right: 10, top: 34,
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "3px 8px", background: "var(--pw-surface)",
              border: "1px solid var(--pw-border)", borderRadius: 99,
              fontSize: 11, fontWeight: 600, color: "var(--pw-text-muted)",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <rect x="2" y="4.5" width="6" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.25" />
              <path d="M3.5 4.5V3a1.5 1.5 0 013 0v1.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
            </svg>
            Locked
          </span>
        )}
      </div>
    </div>
  );
}
