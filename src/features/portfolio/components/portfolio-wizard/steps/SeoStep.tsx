"use client";

import type { FieldErrors } from "../types";

type SeoStepProps = {
  seoTitle: string;
  setSeoTitle: (v: string) => void;
  seoDescription: string;
  setSeoDescription: (v: string) => void;
  seoKeywords: string;
  setSeoKeywords: (v: string) => void;
  seoNoIndex: boolean;
  setSeoNoIndex: (v: boolean) => void;
  fieldErrors: FieldErrors;
  clearFieldError: (key: string) => void;
};

function Field({ label, required, error, hint, children }: { label: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode }) {
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

function PwInput({ error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return <input className={`pw-input${error ? " pw-input--error" : ""}`} {...props} />;
}

function PwTextarea({ error, rows = 3, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string; rows?: number }) {
  return <textarea rows={rows} className={`pw-input pw-textarea${error ? " pw-input--error" : ""}`} {...props} />;
}

function PwSwitch({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
  return (
    <label className="pw-switch-wrap">
      <span className="pw-switch">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="pw-switch__track"><span className="pw-switch__thumb" /></span>
      </span>
      <span className="pw-switch-label">
        <span className="pw-switch-label__title">{label}</span>
        {description && <span className="pw-switch-label__desc">{description}</span>}
      </span>
    </label>
  );
}

export function SeoStep({
  seoTitle, setSeoTitle, seoDescription, setSeoDescription,
  seoKeywords, setSeoKeywords, seoNoIndex, setSeoNoIndex,
  fieldErrors, clearFieldError,
}: SeoStepProps) {
  return (
    <div className="pw-section">
      <div>
        <div className="pw-step-header__eyebrow">Discoverability</div>
        <h2 className="pw-step-header__title">SEO &amp; metadata</h2>
        <p className="pw-step-header__desc">
          Control how your portfolio appears in search engines. A good title and description help recruiters find you.
        </p>
      </div>

      <Field
        label="Page title"
        required
        error={fieldErrors.seoTitle}
        hint={`${seoTitle.length}/70 characters`}
      >
        <PwInput
          value={seoTitle}
          onChange={(e) => { setSeoTitle(e.target.value); clearFieldError("seoTitle"); }}
          placeholder="Ali Khan – Full-stack Developer"
          maxLength={70}
          error={fieldErrors.seoTitle}
        />
      </Field>

      <Field
        label="Meta description"
        error={fieldErrors.seoDescription}
        hint={`${seoDescription.length}/160 characters`}
      >
        <PwTextarea
          value={seoDescription}
          onChange={(e) => { setSeoDescription(e.target.value); clearFieldError("seoDescription"); }}
          rows={3}
          placeholder="Portfolio of Ali Khan, full-stack developer specializing in Next.js and cloud infrastructure."
          maxLength={160}
          error={fieldErrors.seoDescription}
        />
      </Field>

      <Field label="Keywords" hint="Comma-separated. Used by some search engines.">
        <PwInput
          value={seoKeywords}
          onChange={(e) => setSeoKeywords(e.target.value)}
          placeholder="developer, nextjs, portfolio, full-stack"
        />
      </Field>

      {/* Live search preview */}
      {(seoTitle || seoDescription) && (
        <div>
          <div className="pw-label" style={{ marginBottom: 8 }}>Search preview</div>
          <div className="pw-seo-preview">
            <div className="pw-seo-preview__url">yourportfolio.com</div>
            <div className="pw-seo-preview__title">{seoTitle || "Your portfolio title"}</div>
            <div className="pw-seo-preview__desc">{seoDescription || "Your meta description will appear here..."}</div>
          </div>
        </div>
      )}

      <PwSwitch
        checked={seoNoIndex}
        onChange={setSeoNoIndex}
        label="Hide from search engines"
        description="Adds a noindex tag. Use this while your portfolio is still a work in progress."
      />
    </div>
  );
}
