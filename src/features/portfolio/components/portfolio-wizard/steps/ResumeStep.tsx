"use client";

import { Switch } from "@/components/UI/Switch";

type ResumeStepProps = {
  mode: "resume" | "manual" | null;
  resumeUrl: string;
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
};

export function ResumeStep({
  mode,
  resumeUrl,
  hasUploadedResume,
  attachUploadedResume,
  setAttachUploadedResume,
  autoGenerateResume,
  setAutoGenerateResume,
  parsing,
  onResumeFileSelected,
}: ResumeStepProps) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-h3">Resume</h2>
        <p className="text-small text-muted-foreground mt-1">
          {mode === "resume"
            ? "The resume you uploaded during creation will appear here. The attach toggle will link it to your portfolio."
            : "Optional: upload your PDF (form fields will not be overwritten), or auto-generate a resume from your form data."}
        </p>
      </div>

      {resumeUrl ? (
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
      ) : (
        <p className="text-small text-muted-foreground">
         No resume is currently attached.
        </p>
      )}

      {/* Upload — disabled while auto-generate is on */}
      {!autoGenerateResume && (
        <div className="space-y-2">
          <p className="text-label">
            {resumeUrl
              ? "Replace resume (PDF only, max 5MB)"
              : "Upload resume (PDF only, max 5MB)"}
          </p>
          <input
            type="file"
            accept="application/pdf,.pdf"
            disabled={parsing}
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null;
              onResumeFileSelected(f, e.target);
            }}
            className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary disabled:opacity-50"
          />
          <p className="text-small text-muted-foreground">
            {mode === "manual"
              ? "Manual mode: only the file is saved — your filled fields will not change."
              : "PDF only · max 5MB · Example: Ali_Khan_Resume.pdf"}
          </p>
        </div>
      )}

      {/* Toggle A: attach uploaded resume */}
      {(hasUploadedResume || Boolean(resumeUrl)) && !autoGenerateResume && (
        <Switch
          checked={attachUploadedResume}
          onChange={(v) => {
            setAttachUploadedResume(v);
            if (v) setAutoGenerateResume(false);
          }}
          label="Attach this resume to portfolio"
          description="The uploaded PDF will be visible to visitors and available for download with your portfolio."
        />
      )}

      {/* Toggle B: auto-generate from form data (local PDF, no AI) */}
      <Switch
        checked={autoGenerateResume}
        onChange={(v) => {
          setAutoGenerateResume(v);
          if (v) setAttachUploadedResume(false);
        }}
        label="Auto-generate resume from form data"
        description="The PDF will be generated from the form data (no AI call required) and attached to your portfolio."
      />
    </section>
  );
}
