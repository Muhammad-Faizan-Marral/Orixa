"use client";

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
  onResumeFileSelected: (file: File | null, inputEl?: HTMLInputElement | null) => void;
  onRemoveUploadedResume: () => void;
};

function PwSwitch({
  checked, onChange, label, description, disabled,
}: {
  checked: boolean; onChange: (v: boolean) => void; label: string; description?: string; disabled?: boolean;
}) {
  return (
    <label className="pw-switch-wrap" style={{ cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 }}>
      <span className="pw-switch">
        <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
        <span className="pw-switch__track"><span className="pw-switch__thumb" /></span>
      </span>
      <span className="pw-switch-label">
        <span className="pw-switch-label__title">{label}</span>
        {description && <span className="pw-switch-label__desc">{description}</span>}
      </span>
    </label>
  );
}

export function ResumeStep({
  mode, resumeUrl, uploadedResumeUrl, hasUploadedResume,
  attachUploadedResume, setAttachUploadedResume,
  autoGenerateResume, setAutoGenerateResume,
  parsing, onResumeFileSelected, onRemoveUploadedResume,
}: ResumeStepProps) {
  const hasCurrentResume = Boolean(resumeUrl);
  const hasPendingUpload = Boolean(uploadedResumeUrl) && hasUploadedResume;

  return (
    <div className="pw-section">
      <div>
        <div className="pw-step-header__eyebrow">Document</div>
        <h2 className="pw-step-header__title">Resume</h2>
        <p className="pw-step-header__desc">
          Choose how your portfolio provides a resume to visitors. Upload your own or let us generate one from your form data.
        </p>
      </div>

      {hasCurrentResume && (
        <div className="pw-resume-attached">
          <span className="pw-resume-attached__icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="3" y="1" width="10" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M6 5h4M6 8h4M6 11h2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
            </svg>
          </span>
          <div style={{ flex: 1 }}>
            <div className="pw-label" style={{ marginBottom: 2 }}>Current resume attached</div>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 12, color: "var(--pw-accent)", textDecoration: "underline" }}
            >
              View / download
            </a>
          </div>
        </div>
      )}

      <div className="pw-resume-grid">
        {/* Panel 1: Upload */}
        <div className="pw-resume-panel">
          <div>
            <div className="pw-resume-panel__num">Step 1</div>
            <div className="pw-resume-panel__title">Upload a PDF</div>
            <div className="pw-resume-panel__desc">
              Upload your own resume from your device. It stays available until you remove or attach it.
            </div>
          </div>
          <label
            className="pw-file-btn"
            style={{ cursor: parsing ? "not-allowed" : "pointer", opacity: parsing ? 0.5 : 1 }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v7M3 4l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M1 10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {parsing ? "Uploading…" : "Choose PDF"}
            <input
              type="file"
              accept="application/pdf,.pdf"
              disabled={parsing}
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                onResumeFileSelected(file, e.target);
              }}
            />
          </label>
          <span className="pw-hint">PDF only · max 5 MB</span>
        </div>

        {/* Panel 2: Attach */}
        <div className="pw-resume-panel">
          <div>
            <div className="pw-resume-panel__num">Step 2</div>
            <div className="pw-resume-panel__title">Attach to portfolio</div>
            <div className="pw-resume-panel__desc">
              Enable this once your PDF is uploaded to make it the resume shown on your public portfolio.
            </div>
          </div>
          <PwSwitch
            checked={attachUploadedResume}
            disabled={!hasPendingUpload || autoGenerateResume}
            onChange={(value) => {
              setAttachUploadedResume(value);
              if (value) setAutoGenerateResume(false);
            }}
            label="Attach uploaded resume"
          />
        </div>

        {/* Panel 3: Auto-generate */}
        <div className="pw-resume-panel">
          <div>
            <div className="pw-resume-panel__num">Or</div>
            <div className="pw-resume-panel__title">Auto-generate</div>
            <div className="pw-resume-panel__desc">
              We'll build a PDF from your form data automatically when you save the portfolio.
            </div>
          </div>
          <PwSwitch
            checked={autoGenerateResume}
            onChange={(value) => {
              setAutoGenerateResume(value);
              if (value) setAttachUploadedResume(false);
            }}
            label="Generate from form data"
          />
        </div>
      </div>

      {hasPendingUpload && (
        <div
          style={{
            display: "flex", alignItems: "flex-start", justifyContent: "space-between",
            gap: 12, padding: "14px 16px", borderRadius: "var(--pw-radius-sm)",
            border: "1px solid var(--pw-border)", background: "var(--pw-surface-2)",
          }}
        >
          <div>
            <div className="pw-label" style={{ marginBottom: 3 }}>Uploaded resume ready</div>
            <a
              href={uploadedResumeUrl ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 12, color: "var(--pw-accent)", textDecoration: "underline" }}
            >
              View PDF
            </a>
            <div className="pw-hint" style={{ marginTop: 4 }}>
              {attachUploadedResume
                ? "Will be attached when you save."
                : "Uploaded but not yet attached."}
            </div>
          </div>
          <button
            type="button"
            className="pw-btn pw-btn--danger-ghost"
            disabled={parsing}
            onClick={onRemoveUploadedResume}
          >
            Remove
          </button>
        </div>
      )}

      {!hasCurrentResume && !hasPendingUpload && autoGenerateResume && (
        <div className="pw-info pw-info--accent">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="7" cy="7" r="5.75" stroke="var(--pw-accent)" strokeWidth="1.25" />
            <path d="M7 6v3.5M7 4.5v.25" stroke="var(--pw-accent)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          A resume will be auto-generated from your form data and attached when you save.
        </div>
      )}

      {mode === "resume" && !hasCurrentResume && !hasPendingUpload && (
        <div className="pw-info">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="7" cy="7" r="5.75" stroke="currentColor" strokeWidth="1.25" />
            <path d="M7 6v3.5M7 4.5v.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Your original resume was only used for text extraction. The source PDF is not saved to your portfolio.
        </div>
      )}
    </div>
  );
}
