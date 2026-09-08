"use client";

import { createId } from "../utils";
import type { Certificate, FieldErrors, Setter } from "../types";

type CertificatesStepProps = {
  certificates: Certificate[];
  setCertificates: Setter<Certificate[]>;
  fieldErrors: FieldErrors;
  clearFieldError: (key: string) => void;
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

export function CertificatesStep({ certificates, setCertificates, fieldErrors, clearFieldError }: CertificatesStepProps) {
  return (
    <div className="pw-section">
      <div>
        <div className="pw-step-header__eyebrow">Credentials</div>
        <h2 className="pw-step-header__title">Certifications</h2>
        <p className="pw-step-header__desc">
          Add professional certifications, courses, and credentials that back up your skills.
        </p>
      </div>

      {certificates.length === 0 && (
        <div className="pw-info">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25" />
            <path d="M8 7v4M8 5.25v.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          No certifications added yet.
        </div>
      )}

      {certificates.map((item, index) => (
        <div key={item.id} className="pw-card">
          <div className="pw-card__header">
            <span className="pw-card__title">
              <span className="pw-card__num">{index + 1}</span>
              Certificate
            </span>
            <button
              type="button"
              className="pw-card__remove"
              onClick={() => {
                setCertificates((c) => c.filter((e) => e.id !== item.id));
                clearFieldError(`cert-name-${item.id}`);
                clearFieldError(`cert-url-${item.id}`);
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Remove
            </button>
          </div>
          <div className="pw-card__body">
            <div className="pw-grid-2">
              <Field label="Certificate name" required error={fieldErrors[`cert-name-${item.id}`]}>
                <PwInput
                  value={item.name}
                  onChange={(e) => { setCertificates((c) => c.map((x) => x.id === item.id ? { ...x, name: e.target.value } : x)); clearFieldError(`cert-name-${item.id}`); }}
                  error={fieldErrors[`cert-name-${item.id}`]}
                />
              </Field>
              <Field label="Issuing organization">
                <PwInput
                  value={item.issuer ?? ""}
                  onChange={(e) => setCertificates((c) => c.map((x) => x.id === item.id ? { ...x, issuer: e.target.value } : x))}
                  placeholder="Google, AWS, Coursera..."
                />
              </Field>
            </div>
            <div className="pw-grid-2">
              <Field label="Issue date">
                <PwInput
                  value={item.issueDate ?? ""}
                  onChange={(e) => setCertificates((c) => c.map((x) => x.id === item.id ? { ...x, issueDate: e.target.value } : x))}
                  placeholder="Mar 2024"
                />
              </Field>
              <Field label="Credential URL" error={fieldErrors[`cert-url-${item.id}`]}>
                <PwInput
                  value={item.credentialUrl ?? ""}
                  onChange={(e) => { setCertificates((c) => c.map((x) => x.id === item.id ? { ...x, credentialUrl: e.target.value } : x)); clearFieldError(`cert-url-${item.id}`); }}
                  placeholder="https://..."
                  error={fieldErrors[`cert-url-${item.id}`]}
                />
              </Field>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="pw-add-btn"
        onClick={() => setCertificates((c) => [...c, { id: createId(), name: "", issuer: "", issueDate: "", credentialUrl: "" }])}
      >
        <span className="pw-add-btn__icon">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </span>
        Add certificate
      </button>
    </div>
  );
}
