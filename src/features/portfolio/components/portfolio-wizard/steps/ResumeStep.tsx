"use client";

import { Switch } from "@/components/UI/Switch";

type ResumeStepProps = {
  mode: "resume" | "manual" | null;
  resumeUrl: string;
  uploadedResumeUrl: string | null;
  hasUploadedResume: boolean;
  attachUploadedResume: boolean;
  setAttachUploadedResume: (v: boolean) => void;
  autoGenerateResume: boolean;
  setAutoGenerateResume: (v: boolean) => void;
  parsing: boolean;
  onResumeFileSelected: (
    file: File | null,
    inputEl?: HTMLInputElement | null,
  ) => void;
  onRemoveUploadedResume: () => void;
};

export function ResumeStep({
  mode,
  resumeUrl,
  uploadedResumeUrl,
  hasUploadedResume,
  attachUploadedResume,
  setAttachUploadedResume,
  autoGenerateResume,
  setAutoGenerateResume,
  parsing,
  onResumeFileSelected,
  onRemoveUploadedResume,
}: ResumeStepProps) {
  const hasCurrentResume = Boolean(resumeUrl);
  const hasPendingUpload = Boolean(uploadedResumeUrl) && hasUploadedResume;

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-h3">Resume</h2>
        <p className="text-small text-muted-foreground mt-1">
          Choose how your portfolio should provide a resume. Uploading a file
          here does not attach it until you enable the attach option.
        </p>
      </div>

      {hasCurrentResume && (
        <div className="space-y-2 rounded-lg border border-border bg-surface-2 p-4">
          <p className="text-label">Current resume</p>
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-small break-all text-primary underline"
          >
            View / download resume
          </a>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-3">
        <label className="surface-panel flex cursor-pointer flex-col gap-3 p-4 transition hover:border-primary/40">
          <div>
            <p className="text-label">1. Upload resume</p>
            <p className="text-small mt-1 text-muted-foreground">
              Upload a PDF from your device. It stays available until you remove
              it or attach it.
            </p>
          </div>
          <input
            type="file"
            accept="application/pdf,.pdf"
            disabled={parsing}
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              onResumeFileSelected(file, e.target);
            }}
            className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary disabled:opacity-50"
          />
          <p className="text-caption text-muted-foreground">
            PDF only · max 5MB
          </p>
        </label>

        <div className="surface-panel flex flex-col justify-between gap-4 p-4">
          <div>
            <p className="text-label">2. Attach uploaded resume</p>
            <p className="text-small mt-1 text-muted-foreground">
              Enable this only when you want the uploaded PDF to become the
              resume shown on your public portfolio.
            </p>
          </div>
          <Switch
            checked={attachUploadedResume}
            disabled={!hasPendingUpload || autoGenerateResume}
            onChange={(value) => {
              setAttachUploadedResume(value);
              if (value) setAutoGenerateResume(false);
            }}
            label="Attach this resume to portfolio"
          />
        </div>

        <div className="surface-panel flex flex-col justify-between gap-4 p-4">
          <div>
            <p className="text-label">3. Create resume from form data</p>
            <p className="text-small mt-1 text-muted-foreground">
              Generate a PDF automatically from the information you entered in
              the portfolio form.
            </p>
          </div>
          <Switch
            checked={autoGenerateResume}
            onChange={(value) => {
              setAutoGenerateResume(value);
              if (value) setAttachUploadedResume(false);
            }}
            label="Auto-generate resume from form data"
          />
        </div>
      </div>

      {hasPendingUpload && (
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface-2 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-label">Uploaded resume</p>
            <a
              href={uploadedResumeUrl ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="text-small break-all text-primary underline"
            >
              View uploaded PDF
            </a>
            <p className="text-caption mt-1 text-muted-foreground">
              {attachUploadedResume
                ? "This PDF will be attached when you save."
                : "This PDF is uploaded but is not attached yet."}
            </p>
          </div>

          <button
            type="button"
            disabled={parsing}
            onClick={onRemoveUploadedResume}
            className="shrink-0 rounded-md border border-border px-3 py-2 text-sm font-medium transition hover:border-destructive hover:text-destructive disabled:opacity-50"
          >
            Remove uploaded resume
          </button>
        </div>
      )}

      {!hasCurrentResume && !hasPendingUpload && autoGenerateResume && (
        <p className="text-small text-muted-foreground">
          Default: a resume will be generated automatically from your form data
          and attached to the portfolio when you save.
        </p>
      )}

      {mode === "resume" && !hasCurrentResume && !hasPendingUpload && (
        <p className="text-small text-muted-foreground">
          Your original resume was used only for text extraction and AI parsing.
          The uploaded source PDF is not saved.
        </p>
      )}
    </section>
  );
}
