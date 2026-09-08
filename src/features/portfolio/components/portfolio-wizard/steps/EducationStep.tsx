"use client";

import { createId } from "../utils";
import type { Education, FieldErrors, Setter } from "../types";

type EducationStepProps = {
  education: Education[];
  setEducation: Setter<Education[]>;
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

export function EducationStep({ education, setEducation, fieldErrors, clearFieldError }: EducationStepProps) {
  return (
    <div className="pw-section">
      <div>
        <div className="pw-step-header__eyebrow">Background</div>
        <h2 className="pw-step-header__title">Education</h2>
        <p className="pw-step-header__desc">
          Add your academic history. Recent graduates should put this near the top of their portfolio.
        </p>
      </div>

      {education.length === 0 && (
        <div className="pw-info">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25" />
            <path d="M8 7v4M8 5.25v.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          No education entries yet.
        </div>
      )}

      {education.map((item, index) => (
        <div key={item.id} className="pw-card">
          <div className="pw-card__header">
            <span className="pw-card__title">
              <span className="pw-card__num">{index + 1}</span>
              Degree
            </span>
            <button
              type="button"
              className="pw-card__remove"
              onClick={() => {
                setEducation((c) => c.filter((e) => e.id !== item.id));
                clearFieldError(`edu-inst-${item.id}`);
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Remove
            </button>
          </div>
          <div className="pw-card__body">
            <Field label="Institution" required error={fieldErrors[`edu-inst-${item.id}`]}>
              <PwInput
                value={item.institution}
                onChange={(e) => { setEducation((c) => c.map((x) => x.id === item.id ? { ...x, institution: e.target.value } : x)); clearFieldError(`edu-inst-${item.id}`); }}
                error={fieldErrors[`edu-inst-${item.id}`]}
              />
            </Field>
            <div className="pw-grid-2">
              <Field label="Degree">
                <PwInput
                  value={item.degree ?? ""}
                  onChange={(e) => setEducation((c) => c.map((x) => x.id === item.id ? { ...x, degree: e.target.value } : x))}
                  placeholder="B.Sc."
                />
              </Field>
              <Field label="Field of study">
                <PwInput
                  value={item.field ?? ""}
                  onChange={(e) => setEducation((c) => c.map((x) => x.id === item.id ? { ...x, field: e.target.value } : x))}
                  placeholder="Computer Science"
                />
              </Field>
            </div>
            <div className="pw-grid-2">
              <Field label="Start year">
                <PwInput
                  value={item.startDate ?? ""}
                  onChange={(e) => setEducation((c) => c.map((x) => x.id === item.id ? { ...x, startDate: e.target.value } : x))}
                  placeholder="2019"
                />
              </Field>
              <Field label="End year">
                <PwInput
                  value={item.endDate ?? ""}
                  onChange={(e) => setEducation((c) => c.map((x) => x.id === item.id ? { ...x, endDate: e.target.value } : x))}
                  placeholder="2023"
                />
              </Field>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="pw-add-btn"
        onClick={() => setEducation((c) => [...c, { id: createId(), institution: "", degree: "", field: "", startDate: "", endDate: "" }])}
      >
        <span className="pw-add-btn__icon">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </span>
        Add education
      </button>
    </div>
  );
}
