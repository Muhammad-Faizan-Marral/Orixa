"use client";

import { Input } from "@/components/UI/Input";
import { Textarea } from "@/components/UI/Textarea";
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

export function BasicsStep({
  portfolioId,
  name,
  setName,
  headline,
  setHeadline,
  about,
  setAbout,
  avatarUrl,
  setAvatarUrl,
  phone,
  setPhone,
  linkedinUrl,
  setLinkedinUrl,
  githubUrl,
  setGithubUrl,
  prompt,
  setPrompt,
  promptLocked,
  fieldErrors,
  clearFieldError,
  setMessage,
}: BasicsStepProps) {
  async function handleAvatarUpload(
    file: File | null,
    inputEl?: HTMLInputElement | null,
  ) {
    if (!file) return;
    console.log("[BasicsStep] handleAvatarUpload — file selected:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    const formData = new FormData();
    formData.append("file", file);
    // temporary: project-image type until portfolio-avatar type add
    formData.append("type", "project-image");
    formData.append("portfolioId", portfolioId);

    try {
      const result = await uploadFile(formData);
      console.log("[BasicsStep] handleAvatarUpload — result:", result);

      if (result.success && result.data?.url) {
        setAvatarUrl(result.data.url);
      } else if (!result.success) {
        setMessage({
          type: "error",
          text: result.message ?? "Avatar upload failed.",
        });
      }
    } catch (err) {
      console.error("[BasicsStep] handleAvatarUpload — unexpected error:", err);
      setMessage({
        type: "error",
        text: "Unexpected error uploading avatar. Try again.",
      });
    } finally {
      if (inputEl) inputEl.value = "";
    }
  }

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-h3">Basics</h2>
        <p className="text-small text-muted-foreground mt-1">
          Name, headline, contact links and your prompt for AI design.
        </p>
      </div>

      <Input
        id="name"
        label="Full name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          clearFieldError("name");
        }}
        placeholder="Ali Khan"
        error={fieldErrors.name}
      />

      <Input
        id="headline"
        label="Headline"
        value={headline}
        onChange={(e) => {
          setHeadline(e.target.value);
          clearFieldError("headline");
        }}
        placeholder="Full-stack developer · Next.js & Node"
        error={fieldErrors.headline}
      />

      <Textarea
        id="about"
        label="About"
        value={about}
        onChange={(e) => {
          setAbout(e.target.value);
          clearFieldError("about");
        }}
        placeholder="Short bio about yourself..."
        rows={4}
        error={fieldErrors.about}
      />

      <div className="space-y-2">
        <p className="text-label">Avatar / profile photo</p>
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt="Avatar preview"
            className="h-20 w-20 rounded-full object-cover border border-border"
          />
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(e) =>
            handleAvatarUpload(e.target.files?.[0] ?? null, e.target)
          }
          className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary"
        />
        <p className="text-small text-muted-foreground">
          Portfolio-specific photo (profile avatar se alag).
        </p>
      </div>

      <Input
        id="phone"
        label="Phone"
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value);
          clearFieldError("phone");
        }}
        placeholder="+92 300 1234567"
        error={fieldErrors.phone}
      />

      <Input
        id="linkedin"
        label="LinkedIn URL"
        value={linkedinUrl}
        onChange={(e) => {
          setLinkedinUrl(e.target.value);
          clearFieldError("linkedinUrl");
        }}
        placeholder="https://linkedin.com/in/..."
        error={fieldErrors.linkedinUrl}
      />

      <Input
        id="github"
        label="GitHub URL"
        value={githubUrl}
        onChange={(e) => {
          setGithubUrl(e.target.value);
          clearFieldError("githubUrl");
        }}
        placeholder="https://github.com/..."
        error={fieldErrors.githubUrl}
      />

      <div className="space-y-2">
        <Textarea
          id="prompt"
          label="Enter a prompt (for AI design)"
          value={prompt}
          onChange={(e) => {
            if (!promptLocked) setPrompt(e.target.value);
          }}
          placeholder="Make it modern, dark theme, focus on full-stack projects..."
          rows={3}
          disabled={promptLocked}
        />
        {promptLocked && (
          <p className="text-small text-muted-foreground">
            Prompt is locked after first save / publish.
          </p>
        )}
      </div>
    </section>
  );
}
