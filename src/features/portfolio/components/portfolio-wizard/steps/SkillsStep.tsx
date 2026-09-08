"use client";

import { createId } from "../utils";
import type { Skill, FieldErrors, Setter } from "../types";

type SkillsStepProps = {
  skills: Skill[];
  setSkills: Setter<Skill[]>;
  fieldErrors: FieldErrors;
  clearFieldError: (key: string) => void;
};

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="pw-field">
      <label className="pw-label">{label}</label>
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

export function SkillsStep({ skills, setSkills, fieldErrors, clearFieldError }: SkillsStepProps) {
  return (
    <div className="pw-section">
      <div>
        <div className="pw-step-header__eyebrow">Expertise</div>
        <h2 className="pw-step-header__title">Skills &amp; technologies</h2>
        <p className="pw-step-header__desc">
          List the tools, languages, and frameworks you work with. Each skill needs at least 2 characters.
        </p>
      </div>

      {skills.length === 0 && (
        <div className="pw-info">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25" />
            <path d="M8 7v4M8 5.25v.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          No skills added yet. Add your first skill below.
        </div>
      )}

      {skills.map((skill, index) => (
        <div key={skill.id} className="pw-card">
          <div className="pw-card__header">
            <span className="pw-card__title">
              <span className="pw-card__num">{index + 1}</span>
              Skill
            </span>
            <button
              type="button"
              className="pw-card__remove"
              onClick={() => {
                setSkills((c) => c.filter((s) => s.id !== skill.id));
                clearFieldError(`skill-${skill.id}`);
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Remove
            </button>
          </div>
          <div className="pw-card__body">
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ flex: 2 }}>
                <Field label="Skill name" error={fieldErrors[`skill-${skill.id}`]}>
                  <PwInput
                    value={skill.name}
                    onChange={(e) => {
                      setSkills((c) => c.map((s) => s.id === skill.id ? { ...s, name: e.target.value } : s));
                      clearFieldError(`skill-${skill.id}`);
                    }}
                    placeholder="React"
                    error={fieldErrors[`skill-${skill.id}`]}
                  />
                </Field>
              </div>
              <div style={{ flex: 1 }}>
                <Field label="Proficiency (optional)">
                  <PwInput
                    value={skill.level ?? ""}
                    onChange={(e) => setSkills((c) => c.map((s) => s.id === skill.id ? { ...s, level: e.target.value } : s))}
                    placeholder="Advanced"
                  />
                </Field>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="pw-add-btn"
        onClick={() => setSkills((c) => [...c, { id: createId(), name: "", level: "" }])}
      >
        <span className="pw-add-btn__icon">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </span>
        Add skill
      </button>
    </div>
  );
}
