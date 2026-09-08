"use client";

import { createId } from "../utils";
import type { Experience, FieldErrors, Setter } from "../types";

type ExperienceStepProps = {
  experience: Experience[];
  setExperience: Setter<Experience[]>;
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

function PwTextarea({ rows = 3, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { rows?: number }) {
  return <textarea rows={rows} className="pw-input pw-textarea" {...props} />;
}

function PwSwitch({ checked, onChange, label, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <label className="pw-switch-wrap" style={{ cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 }}>
      <span className="pw-switch">
        <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
        <span className="pw-switch__track"><span className="pw-switch__thumb" /></span>
      </span>
      <span className="pw-switch-label">
        <span className="pw-switch-label__title">{label}</span>
      </span>
    </label>
  );
}

export function ExperienceStep({ experience, setExperience, fieldErrors, clearFieldError }: ExperienceStepProps) {
  return (
    <div className="pw-section">
      <div>
        <div className="pw-step-header__eyebrow">Career</div>
        <h2 className="pw-step-header__title">Work experience</h2>
        <p className="pw-step-header__desc">
          Add your professional history, starting with your most recent position.
        </p>
      </div>

      {experience.length === 0 && (
        <div className="pw-info">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25" />
            <path d="M8 7v4M8 5.25v.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          No experience entries yet.
        </div>
      )}

      {experience.map((item, index) => (
        <div key={item.id} className="pw-card">
          <div className="pw-card__header">
            <span className="pw-card__title">
              <span className="pw-card__num">{index + 1}</span>
              Position
            </span>
            <button
              type="button"
              className="pw-card__remove"
              onClick={() => {
                setExperience((c) => c.filter((e) => e.id !== item.id));
                clearFieldError(`exp-company-${item.id}`);
                clearFieldError(`exp-role-${item.id}`);
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
              <Field label="Company" required error={fieldErrors[`exp-company-${item.id}`]}>
                <PwInput
                  value={item.company}
                  onChange={(e) => { setExperience((c) => c.map((x) => x.id === item.id ? { ...x, company: e.target.value } : x)); clearFieldError(`exp-company-${item.id}`); }}
                  error={fieldErrors[`exp-company-${item.id}`]}
                />
              </Field>
              <Field label="Role / title" required error={fieldErrors[`exp-role-${item.id}`]}>
                <PwInput
                  value={item.role}
                  onChange={(e) => { setExperience((c) => c.map((x) => x.id === item.id ? { ...x, role: e.target.value } : x)); clearFieldError(`exp-role-${item.id}`); }}
                  error={fieldErrors[`exp-role-${item.id}`]}
                />
              </Field>
            </div>
            <div className="pw-grid-2">
              <Field label="Start date">
                <PwInput
                  value={item.startDate ?? ""}
                  onChange={(e) => setExperience((c) => c.map((x) => x.id === item.id ? { ...x, startDate: e.target.value } : x))}
                  placeholder="Jan 2022"
                />
              </Field>
              <Field label="End date">
                <PwInput
                  value={item.endDate ?? ""}
                  onChange={(e) => setExperience((c) => c.map((x) => x.id === item.id ? { ...x, endDate: e.target.value } : x))}
                  placeholder="Present"
                  disabled={item.current}
                />
              </Field>
            </div>
            <PwSwitch
              checked={Boolean(item.current)}
              onChange={(v) => setExperience((c) => c.map((x) => x.id === item.id ? { ...x, current: v, endDate: v ? "" : x.endDate } : x))}
              label="Currently working here"
            />
            <Field label="Description">
              <PwTextarea
                value={item.description ?? ""}
                onChange={(e) => setExperience((c) => c.map((x) => x.id === item.id ? { ...x, description: e.target.value } : x))}
                rows={3}
                placeholder="What you built, shipped, or led..."
              />
            </Field>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="pw-add-btn"
        onClick={() => setExperience((c) => [...c, { id: createId(), company: "", role: "", startDate: "", endDate: "", current: false, description: "" }])}
      >
        <span className="pw-add-btn__icon">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </span>
        Add position
      </button>
    </div>
  );
}
