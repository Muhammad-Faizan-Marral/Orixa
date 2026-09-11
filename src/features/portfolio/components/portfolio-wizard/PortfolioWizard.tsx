"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { CreationModeSelect } from "../creation-mode-select";

import { CONTENT_STEPS } from "../../wizard-steps";
import { parseResumeAction } from "@/actions/portfolio/parse-resume";
import { finalizePortfolioAction } from "@/actions/portfolio/finalize-portfolio";
import { generateAndAttachResume } from "@/actions/portfolio/generate-resume";
import { uploadFile } from "@/actions/profile/upload-file";
import { deleteUpload } from "@/actions/profile/delete-upload";
import { getUploads } from "@/actions/profile/get-uploads";
import { createWorkingPortfolioVersion } from "@/actions/portfolio/create-working-version";

import type {
  PortfolioWizardProps,
  CreationMode,
  Skill,
  Experience,
  Project,
  Education,
  Certificate,
  FieldErrors,
  Message,
  ValidationState,
} from "./types";
import { validateStep } from "./validation";
import { assertValidResumeFile, isPortfolioEmpty } from "./utils";

import {
  BasicsStep,
  SkillsStep,
  ExperienceStep,
  ProjectsStep,
  EducationStep,
  CertificatesStep,
  ResumeStep,
  SeoStep,
  ReviewStep,
} from "./steps";

/** What screen the wizard is currently showing before/around the step content. */
type WizardStage = "select" | "import" | "content";

// ---------------------------------------------------------------------------
// Step icon map
// ---------------------------------------------------------------------------

const STEP_ICONS: Record<string, React.ReactNode> = {
  basics: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  skills: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8h2m3-3v2m0 2v2m3-3h2M8 2l1.5 2.5L12 5l-2 2 .5 2.5L8 8.5 5.5 9.5 6 7 4 5l2.5-.5L8 2z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  experience: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect
        x="2"
        y="5"
        width="12"
        height="9"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M5 5V4a3 3 0 016 0v1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M2 9h12" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  ),
  projects: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect
        x="2"
        y="2"
        width="5.5"
        height="5.5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="8.5"
        y="2"
        width="5.5"
        height="5.5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="2"
        y="8.5"
        width="5.5"
        height="5.5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="8.5"
        y="8.5"
        width="5.5"
        height="5.5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  ),
  education: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 2L1 6l7 4 7-4-7-4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M4 8v4c0 1.105 1.79 2 4 2s4-.895 4-2V8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M15 6v4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  certificates: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M10 12l2-2 2 2"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 10v4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <rect
        x="2"
        y="2"
        width="10"
        height="12"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M5 6h5M5 9h3"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  ),
  resume: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect
        x="3"
        y="1"
        width="10"
        height="14"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M6 5h4M6 8h4M6 11h2"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  ),
  seo: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10.5 10.5L14 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  review: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8l3.5 3.5L13 4.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

// ---------------------------------------------------------------------------
// WizardProgress — overhauled
// ---------------------------------------------------------------------------

function WizardProgressBar({ currentStepId }: { currentStepId: string }) {
  const currentIndex = CONTENT_STEPS.findIndex((s) => s.id === currentStepId);
  const progress = ((currentIndex + 1) / CONTENT_STEPS.length) * 100;

  return (
    <div className="wizard-progress">
      {/* Mobile: compact pill strip */}
      <div className="wizard-progress__mobile">
        <div className="wizard-progress__mobile-label">
          <span className="wizard-progress__step-count">
            Step {currentIndex + 1} of {CONTENT_STEPS.length}
          </span>
          <span className="wizard-progress__step-name">
            {CONTENT_STEPS[currentIndex]?.label}
          </span>
        </div>
        <div className="wizard-progress__track">
          <div
            className="wizard-progress__fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Desktop: step dots */}
      <div className="wizard-progress__desktop">
        {CONTENT_STEPS.map((step, idx) => {
          const state =
            idx < currentIndex
              ? "done"
              : idx === currentIndex
                ? "active"
                : "upcoming";
          return (
            <div key={step.id} className={`wizard-step wizard-step--${state}`}>
              <div className="wizard-step__node">
                {state === "done" ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l2.8 3L10 3"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span className="wizard-step__icon">
                    {STEP_ICONS[step.id]}
                  </span>
                )}
              </div>
              {idx < CONTENT_STEPS.length - 1 && (
                <div
                  className={`wizard-step__connector${state === "done" ? " wizard-step__connector--done" : ""}`}
                />
              )}
              <span className="wizard-step__label">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline styles (scoped via className prefix, avoids design system clash)
// ---------------------------------------------------------------------------

const WIZARD_STYLES = `
  /* ── Design tokens ── */
  .pw-root {
    --pw-bg: #0F1117;
    --pw-surface: #181C25;
    --pw-surface-2: #1E2333;
    --pw-border: rgba(255,255,255,0.08);
    --pw-border-focus: rgba(99,102,241,0.7);
    --pw-accent: #6366F1;
    --pw-accent-hover: #818CF8;
    --pw-accent-muted: rgba(99,102,241,0.12);
    --pw-accent-ring: rgba(99,102,241,0.25);
    --pw-success: #10B981;
    --pw-success-bg: rgba(16,185,129,0.08);
    --pw-success-border: rgba(16,185,129,0.25);
    --pw-error: #F87171;
    --pw-error-bg: rgba(248,113,113,0.08);
    --pw-error-border: rgba(248,113,113,0.25);
    --pw-text: #F1F5F9;
    --pw-text-secondary: #94A3B8;
    --pw-text-muted: #475569;
    --pw-radius: 10px;
    --pw-radius-sm: 6px;
    --pw-radius-lg: 16px;
    --pw-shadow: 0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04);
    --pw-shadow-lg: 0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04);
    --pw-font: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    --pw-mono: 'JetBrains Mono', 'Fira Code', monospace;
    --pw-transition: 180ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .pw-root {
    font-family: var(--pw-font);
    background: var(--pw-bg);
    color: var(--pw-text);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Layout ── */
  .pw-layout {
    display: grid;
    grid-template-columns: 260px 1fr;
    min-height: 100vh;
  }
  @media (max-width: 768px) {
    .pw-layout { grid-template-columns: 1fr; }
  }

  /* ── Sidebar ── */
  .pw-sidebar {
    background: var(--pw-surface);
    border-right: 1px solid var(--pw-border);
    padding: 32px 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
  }
  @media (max-width: 768px) { .pw-sidebar { display: none; } }

  .pw-sidebar__header {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--pw-border);
  }
  .pw-sidebar__logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 4px;
  }
  .pw-sidebar__logo-mark {
    width: 28px; height: 28px;
    background: var(--pw-accent);
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
  }
  .pw-sidebar__title {
    font-size: 14px;
    font-weight: 600;
    color: var(--pw-text);
    letter-spacing: -0.01em;
  }
  .pw-sidebar__subtitle {
    font-size: 12px;
    color: var(--pw-text-muted);
    margin-top: 6px;
  }

  /* ── Sidebar steps ── */
  .pw-nav-step {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border-radius: var(--pw-radius-sm);
    cursor: default;
    transition: background var(--pw-transition);
    position: relative;
  }
  .pw-nav-step--active {
    background: var(--pw-accent-muted);
  }
  .pw-nav-step--done {
    opacity: 0.75;
  }
  .pw-nav-step__dot {
    width: 24px; height: 24px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    border: 1.5px solid var(--pw-border);
    color: var(--pw-text-muted);
    font-size: 10px;
    transition: all var(--pw-transition);
  }
  .pw-nav-step--active .pw-nav-step__dot {
    border-color: var(--pw-accent);
    background: var(--pw-accent);
    color: #fff;
  }
  .pw-nav-step--done .pw-nav-step__dot {
    border-color: var(--pw-success);
    background: var(--pw-success);
    color: #fff;
  }
  .pw-nav-step__label {
    font-size: 13px;
    font-weight: 500;
    color: var(--pw-text-secondary);
    transition: color var(--pw-transition);
  }
  .pw-nav-step--active .pw-nav-step__label {
    color: var(--pw-text);
    font-weight: 600;
  }
  .pw-nav-step--done .pw-nav-step__label {
    color: var(--pw-text-muted);
  }
  .pw-nav-step__connector {
    position: absolute;
    left: 23px;
    top: 33px;
    width: 1.5px;
    height: 8px;
    background: var(--pw-border);
  }
  .pw-nav-step--done .pw-nav-step__connector {
    background: var(--pw-success);
    opacity: 0.5;
  }

  /* ── Progress (mobile) ── */
  .wizard-progress__mobile {
    padding: 16px 24px;
    border-bottom: 1px solid var(--pw-border);
    background: var(--pw-surface);
  }
  @media (min-width: 769px) { .wizard-progress__mobile { display: none; } }
  .wizard-progress__desktop { display: none; }
  .wizard-progress__mobile-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .wizard-progress__step-count {
    font-size: 11px;
    font-weight: 600;
    color: var(--pw-accent);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .wizard-progress__step-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--pw-text);
  }
  .wizard-progress__track {
    height: 3px;
    background: var(--pw-border);
    border-radius: 99px;
    overflow: hidden;
  }
  .wizard-progress__fill {
    height: 100%;
    background: linear-gradient(90deg, var(--pw-accent), var(--pw-accent-hover));
    border-radius: 99px;
    transition: width 400ms cubic-bezier(0.4,0,0.2,1);
  }

  /* ── Main content ── */
  .pw-main {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  .pw-content {
    flex: 1;
    padding: 40px 48px;
    max-width: 760px;
  }
  @media (max-width: 960px) { .pw-content { padding: 32px 24px; } }
  @media (max-width: 600px) { .pw-content { padding: 24px 16px; } }

  /* ── Step header ── */
  .pw-step-header {
    margin-bottom: 32px;
  }
  .pw-step-header__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 600;
    color: var(--pw-accent);
    letter-spacing: 0.07em;
    text-transform: uppercase;
    margin-bottom: 10px;
    padding: 4px 10px;
    background: var(--pw-accent-muted);
    border-radius: 99px;
    border: 1px solid rgba(99,102,241,0.2);
  }
  .pw-step-header__title {
    font-size: 26px;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: var(--pw-text);
    line-height: 1.2;
    margin: 0 0 8px;
  }
  .pw-step-header__desc {
    font-size: 14px;
    color: var(--pw-text-secondary);
    line-height: 1.6;
    max-width: 520px;
    margin: 0;
  }

  /* ── Form fields ── */
  .pw-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .pw-label {
    font-size: 13px;
    font-weight: 500;
    color: var(--pw-text-secondary);
    letter-spacing: -0.01em;
  }
  .pw-label--required::after {
    content: ' *';
    color: var(--pw-error);
    font-size: 12px;
  }
  .pw-input {
    width: 100%;
    background: var(--pw-surface-2);
    border: 1px solid var(--pw-border);
    border-radius: var(--pw-radius-sm);
    color: var(--pw-text);
    font-size: 14px;
    font-family: var(--pw-font);
    padding: 10px 14px;
    transition: border-color var(--pw-transition), box-shadow var(--pw-transition), background var(--pw-transition);
    outline: none;
    box-sizing: border-box;
  }
  .pw-input::placeholder { color: var(--pw-text-muted); }
  .pw-input:hover { border-color: rgba(255,255,255,0.14); }
  .pw-input:focus {
    border-color: var(--pw-border-focus);
    box-shadow: 0 0 0 3px var(--pw-accent-ring);
    background: var(--pw-surface);
  }
  .pw-input--error {
    border-color: var(--pw-error-border) !important;
    box-shadow: 0 0 0 3px rgba(248,113,113,0.12) !important;
  }
  .pw-input:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .pw-textarea { resize: vertical; min-height: 90px; }
  .pw-error-msg {
    font-size: 12px;
    color: var(--pw-error);
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .pw-hint {
    font-size: 12px;
    color: var(--pw-text-muted);
    line-height: 1.5;
  }

  /* ── Grid layouts ── */
  .pw-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .pw-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  @media (max-width: 600px) {
    .pw-grid-2 { grid-template-columns: 1fr; }
    .pw-grid-3 { grid-template-columns: 1fr; }
  }

  /* ── Section groups ── */
  .pw-section { display: flex; flex-direction: column; gap: 20px; }
  .pw-divider {
    height: 1px;
    background: var(--pw-border);
    border: none;
    margin: 8px 0;
  }
  .pw-group-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--pw-text-muted);
    padding-bottom: 12px;
    border-bottom: 1px solid var(--pw-border);
  }

  /* ── Repeater card ── */
  .pw-card {
    background: var(--pw-surface);
    border: 1px solid var(--pw-border);
    border-radius: var(--pw-radius);
    overflow: hidden;
    transition: border-color var(--pw-transition);
  }
  .pw-card:hover { border-color: rgba(255,255,255,0.12); }
  .pw-card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    border-bottom: 1px solid var(--pw-border);
    background: var(--pw-surface-2);
  }
  .pw-card__title {
    font-size: 13px;
    font-weight: 600;
    color: var(--pw-text-secondary);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .pw-card__num {
    width: 20px; height: 20px;
    background: var(--pw-accent-muted);
    border: 1px solid rgba(99,102,241,0.2);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px;
    font-weight: 700;
    color: var(--pw-accent);
  }
  .pw-card__body {
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .pw-card__remove {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px 10px;
    border-radius: var(--pw-radius-sm);
    border: 1px solid transparent;
    background: transparent;
    color: var(--pw-text-muted);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--pw-transition);
    font-family: var(--pw-font);
  }
  .pw-card__remove:hover {
    border-color: var(--pw-error-border);
    background: var(--pw-error-bg);
    color: var(--pw-error);
  }

  /* ── Add button ── */
  .pw-add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 12px;
    border-radius: var(--pw-radius);
    border: 1.5px dashed var(--pw-border);
    background: transparent;
    color: var(--pw-text-secondary);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--pw-transition);
    font-family: var(--pw-font);
  }
  .pw-add-btn:hover {
    border-color: var(--pw-accent);
    background: var(--pw-accent-muted);
    color: var(--pw-accent);
  }
  .pw-add-btn__icon {
    width: 20px; height: 20px;
    border-radius: 50%;
    background: var(--pw-accent-muted);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
    line-height: 1;
    transition: background var(--pw-transition);
  }
  .pw-add-btn:hover .pw-add-btn__icon {
    background: rgba(99,102,241,0.25);
  }

  /* ── Switch ── */
  .pw-switch-wrap {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px;
    border-radius: var(--pw-radius-sm);
    border: 1px solid var(--pw-border);
    background: var(--pw-surface-2);
    transition: border-color var(--pw-transition);
    cursor: pointer;
  }
  .pw-switch-wrap:has(.pw-switch:checked) {
    border-color: rgba(99,102,241,0.35);
    background: var(--pw-accent-muted);
  }
  .pw-switch {
    position: relative;
    width: 36px; height: 20px;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .pw-switch input { position: absolute; opacity: 0; width: 0; height: 0; }
  .pw-switch__track {
    position: absolute; inset: 0;
    background: var(--pw-border);
    border-radius: 99px;
    transition: background var(--pw-transition);
    cursor: pointer;
  }
  .pw-switch input:checked ~ .pw-switch__track {
    background: var(--pw-accent);
  }
  .pw-switch__thumb {
    position: absolute;
    top: 3px; left: 3px;
    width: 14px; height: 14px;
    background: #fff;
    border-radius: 50%;
    transition: transform var(--pw-transition);
    pointer-events: none;
  }
  .pw-switch input:checked ~ .pw-switch__track .pw-switch__thumb {
    transform: translateX(16px);
  }
  .pw-switch-label { flex: 1; }
  .pw-switch-label__title {
    font-size: 13px;
    font-weight: 600;
    color: var(--pw-text);
    line-height: 1.4;
  }
  .pw-switch-label__desc {
    font-size: 12px;
    color: var(--pw-text-muted);
    margin-top: 2px;
    line-height: 1.5;
  }
  .pw-switch input:disabled ~ .pw-switch__track {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* ── Message banner ── */
  .pw-message {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 16px;
    border-radius: var(--pw-radius-sm);
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 24px;
    border: 1px solid;
    line-height: 1.5;
  }
  .pw-message--success {
    background: var(--pw-success-bg);
    border-color: var(--pw-success-border);
    color: var(--pw-success);
  }
  .pw-message--error {
    background: var(--pw-error-bg);
    border-color: var(--pw-error-border);
    color: var(--pw-error);
  }
  .pw-message__icon { flex-shrink: 0; margin-top: 1px; }

  /* ── Footer / navigation ── */
  .pw-footer {
    position: sticky;
    bottom: 0;
    background: rgba(15,17,23,0.92);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-top: 1px solid var(--pw-border);
    padding: 16px 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    z-index: 10;
  }
  @media (max-width: 960px) { .pw-footer { padding: 16px 24px; } }
  @media (max-width: 600px) { .pw-footer { padding: 12px 16px; } }

  .pw-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 10px 20px;
    border-radius: var(--pw-radius-sm);
    font-size: 14px;
    font-weight: 600;
    font-family: var(--pw-font);
    cursor: pointer;
    transition: all var(--pw-transition);
    border: 1px solid transparent;
    text-decoration: none;
    letter-spacing: -0.01em;
    white-space: nowrap;
  }
  .pw-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    pointer-events: none;
  }
  .pw-btn--primary {
    background: var(--pw-accent);
    color: #fff;
    border-color: var(--pw-accent);
    box-shadow: 0 1px 4px rgba(99,102,241,0.35), 0 0 0 0 transparent;
  }
  .pw-btn--primary:hover:not(:disabled) {
    background: var(--pw-accent-hover);
    border-color: var(--pw-accent-hover);
    box-shadow: 0 2px 8px rgba(99,102,241,0.5), 0 0 0 0 transparent;
    transform: translateY(-1px);
  }
  .pw-btn--primary:active:not(:disabled) { transform: translateY(0); }
  .pw-btn--ghost {
    background: transparent;
    color: var(--pw-text-secondary);
    border-color: var(--pw-border);
  }
  .pw-btn--ghost:hover:not(:disabled) {
    background: var(--pw-surface-2);
    border-color: rgba(255,255,255,0.15);
    color: var(--pw-text);
  }
  .pw-btn--danger-ghost {
    background: transparent;
    color: var(--pw-error);
    border-color: transparent;
    padding: 8px 12px;
    font-size: 13px;
  }
  .pw-btn--danger-ghost:hover:not(:disabled) {
    background: var(--pw-error-bg);
    border-color: var(--pw-error-border);
  }

  /* ── Avatar upload zone ── */
  .pw-avatar-zone {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border-radius: var(--pw-radius);
    border: 1px solid var(--pw-border);
    background: var(--pw-surface-2);
  }
  .pw-avatar-preview {
    width: 56px; height: 56px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--pw-border);
    flex-shrink: 0;
  }
  .pw-avatar-placeholder {
    width: 56px; height: 56px;
    border-radius: 50%;
    background: var(--pw-surface);
    border: 2px dashed var(--pw-border);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    color: var(--pw-text-muted);
  }
  .pw-avatar-info { flex: 1; }
  .pw-avatar-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--pw-text);
    margin-bottom: 2px;
  }
  .pw-avatar-hint {
    font-size: 12px;
    color: var(--pw-text-muted);
    margin-bottom: 8px;
    line-height: 1.4;
  }
  .pw-file-input {
    display: none;
  }
  .pw-file-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: var(--pw-radius-sm);
    border: 1px solid var(--pw-border);
    background: var(--pw-surface);
    color: var(--pw-text-secondary);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--pw-transition);
    font-family: var(--pw-font);
  }
  .pw-file-btn:hover {
    border-color: var(--pw-accent);
    color: var(--pw-accent);
    background: var(--pw-accent-muted);
  }

  /* ── Prompt field (locked) ── */
  .pw-prompt-locked {
    position: relative;
  }
  .pw-locked-badge {
    position: absolute;
    right: 10px;
    top: 10px;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    background: var(--pw-surface);
    border: 1px solid var(--pw-border);
    border-radius: 99px;
    font-size: 11px;
    font-weight: 600;
    color: var(--pw-text-muted);
  }

  /* ── Resume option panels ── */
  .pw-resume-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
  }
  @media (max-width: 680px) { .pw-resume-grid { grid-template-columns: 1fr; } }
  .pw-resume-panel {
    background: var(--pw-surface);
    border: 1px solid var(--pw-border);
    border-radius: var(--pw-radius);
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    transition: border-color var(--pw-transition);
  }
  .pw-resume-panel:hover { border-color: rgba(255,255,255,0.12); }
  .pw-resume-panel__num {
    font-size: 11px;
    font-weight: 700;
    color: var(--pw-accent);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .pw-resume-panel__title {
    font-size: 14px;
    font-weight: 700;
    color: var(--pw-text);
    margin: 4px 0 6px;
  }
  .pw-resume-panel__desc {
    font-size: 12px;
    color: var(--pw-text-muted);
    line-height: 1.6;
    flex: 1;
  }

  /* ── Uploaded resume card ── */
  .pw-resume-attached {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 16px;
    border-radius: var(--pw-radius);
    border: 1px solid var(--pw-success-border);
    background: var(--pw-success-bg);
  }
  .pw-resume-attached__icon {
    width: 36px; height: 36px;
    border-radius: 8px;
    background: rgba(16,185,129,0.15);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    color: var(--pw-success);
  }

  /* ── Review card ── */
  .pw-review-card {
    background: var(--pw-surface);
    border: 1px solid var(--pw-border);
    border-radius: var(--pw-radius);
    overflow: hidden;
  }
  .pw-review-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 18px;
    border-bottom: 1px solid var(--pw-border);
  }
  .pw-review-item:last-child { border-bottom: none; }
  .pw-review-item__key {
    font-size: 12px;
    font-weight: 600;
    color: var(--pw-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    width: 110px;
    flex-shrink: 0;
  }
  .pw-review-item__val {
    font-size: 14px;
    color: var(--pw-text);
    font-weight: 500;
    flex: 1;
  }
  .pw-review-badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: 99px;
    font-size: 12px;
    font-weight: 600;
    background: var(--pw-accent-muted);
    color: var(--pw-accent);
    border: 1px solid rgba(99,102,241,0.2);
  }

  /* ── Import stage ── */
  .pw-import {
    max-width: 480px;
    margin: 0 auto;
    padding: 60px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 28px;
  }
  .pw-import__icon-wrap {
    width: 64px; height: 64px;
    border-radius: 18px;
    background: var(--pw-accent-muted);
    border: 1px solid rgba(99,102,241,0.2);
    display: flex; align-items: center; justify-content: center;
    color: var(--pw-accent);
  }
  .pw-import__heading {
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: var(--pw-text);
    text-align: center;
    margin: 0;
  }
  .pw-import__body {
    font-size: 14px;
    color: var(--pw-text-secondary);
    text-align: center;
    line-height: 1.6;
    max-width: 380px;
    margin: 0;
  }
  .pw-import__zone {
    width: 100%;
    border: 2px dashed var(--pw-border);
    border-radius: var(--pw-radius-lg);
    padding: 32px;
    text-align: center;
    transition: all var(--pw-transition);
    cursor: pointer;
  }
  .pw-import__zone:hover {
    border-color: var(--pw-accent);
    background: var(--pw-accent-muted);
  }
  .pw-import__zone-text {
    font-size: 14px;
    color: var(--pw-text-secondary);
    margin: 8px 0 4px;
    font-weight: 500;
  }
  .pw-import__zone-hint {
    font-size: 12px;
    color: var(--pw-text-muted);
  }
  .pw-import__actions {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    justify-content: space-between;
  }

  /* ── Skill tag (compact) ── */
  .pw-skill-row {
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }
  .pw-skill-row .pw-field:first-child { flex: 2; }
  .pw-skill-row .pw-field:last-child { flex: 1; }

  /* ── Info box ── */
  .pw-info {
    display: flex;
    gap: 10px;
    padding: 12px 14px;
    border-radius: var(--pw-radius-sm);
    background: var(--pw-surface-2);
    border: 1px solid var(--pw-border);
    font-size: 13px;
    color: var(--pw-text-secondary);
    line-height: 1.5;
  }
  .pw-info--accent {
    background: var(--pw-accent-muted);
    border-color: rgba(99,102,241,0.2);
    color: var(--pw-text);
  }

  /* ── Loading spinner ── */
  @keyframes pw-spin { to { transform: rotate(360deg); } }
  .pw-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: pw-spin 0.7s linear infinite;
  }

  /* ── Upload progress ── */
  .pw-uploading {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--pw-text-muted);
    padding: 8px 0;
  }

  /* ── SEO preview ── */
  .pw-seo-preview {
    padding: 16px;
    background: #0B0F18;
    border-radius: var(--pw-radius-sm);
    border: 1px solid var(--pw-border);
    font-family: Arial, sans-serif;
    max-width: 480px;
  }
  .pw-seo-preview__url { font-size: 12px; color: #4ade80; margin-bottom: 2px; }
  .pw-seo-preview__title { font-size: 18px; color: #60a5fa; margin-bottom: 4px; }
  .pw-seo-preview__desc { font-size: 13px; color: #94a3b8; line-height: 1.5; }
`;

// ---------------------------------------------------------------------------
// Re-usable micro-components
// ---------------------------------------------------------------------------

function Field({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pw-field">
      <label className={`pw-label${required ? " pw-label--required" : ""}`}>
        {label}
      </label>
      {children}
      {error && (
        <span className="pw-error-msg">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            style={{ flexShrink: 0 }}
          >
            <circle
              cx="6"
              cy="6"
              r="5.25"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M6 4v2.5M6 8.25v.25"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          {error}
        </span>
      )}
      {hint && !error && <span className="pw-hint">{hint}</span>}
    </div>
  );
}

function PwInput({
  error,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <input
      className={`pw-input${error ? " pw-input--error" : ""} ${className}`}
      {...props}
    />
  );
}

function PwTextarea({
  error,
  rows = 4,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
  rows?: number;
}) {
  return (
    <textarea
      rows={rows}
      className={`pw-input pw-textarea${error ? " pw-input--error" : ""}`}
      {...props}
    />
  );
}

function PwSwitch({
  checked,
  onChange,
  label,
  description,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}) {
  return (
    <label
      className="pw-switch-wrap"
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <span className="pw-switch">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="pw-switch__track">
          <span className="pw-switch__thumb" />
        </span>
      </span>
      <span className="pw-switch-label">
        <span className="pw-switch-label__title">{label}</span>
        {description && (
          <span className="pw-switch-label__desc">{description}</span>
        )}
      </span>
    </label>
  );
}

function Card({
  title,
  index,
  onRemove,
  children,
}: {
  title: string;
  index: number;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="pw-card">
      <div className="pw-card__header">
        <span className="pw-card__title">
          <span className="pw-card__num">{index + 1}</span>
          {title}
        </span>
        <button type="button" className="pw-card__remove" onClick={onRemove}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 2l8 8M10 2L2 10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Remove
        </button>
      </div>
      <div className="pw-card__body">{children}</div>
    </div>
  );
}

function AddBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="pw-add-btn" onClick={onClick}>
      <span className="pw-add-btn__icon">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path
            d="M5 1v8M1 5h8"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {label}
    </button>
  );
}

function MessageBanner({ message }: { message: Message }) {
  if (!message) return null;
  const isError = message.type === "error";
  return (
    <div className={`pw-message pw-message--${message.type}`}>
      <span className="pw-message__icon">
        {isError ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle
              cx="7"
              cy="7"
              r="6"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M7 4.5V7M7 9.5v.25"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle
              cx="7"
              cy="7"
              r="6"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M4.5 7l1.75 2L9.5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      {message.text}
    </div>
  );
}

function createId() {
  return Math.random().toString(36).slice(2, 10);
}

// ---------------------------------------------------------------------------
// Overhauled step components
// ---------------------------------------------------------------------------

function BasicsStepUI({
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
}: any) {
  async function handleAvatarUpload(
    file: File | null,
    inputEl?: HTMLInputElement | null,
  ) {
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
        setMessage({
          type: "error",
          text: result.message ?? "Avatar upload failed.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Unexpected error uploading avatar. Try again.",
      });
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
          This information appears on your portfolio. Add your name, bio, and
          contact links.
        </p>
      </div>

      <div className="pw-group-label">Personal details</div>

      <div className="pw-grid-2">
        <Field label="Full name" required error={fieldErrors.name}>
          <PwInput
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearFieldError("name");
            }}
            placeholder="Ali Khan"
            error={fieldErrors.name}
          />
        </Field>
        <Field label="Phone" error={fieldErrors.phone}>
          <PwInput
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              clearFieldError("phone");
            }}
            placeholder="+92 300 1234567"
            error={fieldErrors.phone}
          />
        </Field>
      </div>

      <Field
        label="Headline"
        required
        error={fieldErrors.headline}
        hint="One sharp line. This is the first thing visitors read."
      >
        <PwInput
          value={headline}
          onChange={(e) => {
            setHeadline(e.target.value);
            clearFieldError("headline");
          }}
          placeholder="Full-stack developer · Next.js & Node"
          error={fieldErrors.headline}
        />
      </Field>

      <Field
        label="About"
        error={fieldErrors.about}
        hint="Keep it under 300 words. Describe what you do and what you're looking for."
      >
        <PwTextarea
          value={about}
          onChange={(e) => {
            setAbout(e.target.value);
            clearFieldError("about");
          }}
          placeholder="Short bio about yourself..."
          rows={4}
          error={fieldErrors.about}
        />
      </Field>

      <div className="pw-group-label" style={{ marginTop: 8 }}>
        Profile photo
      </div>

      <div className="pw-avatar-zone">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="pw-avatar-preview" />
        ) : (
          <span className="pw-avatar-placeholder">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle
                cx="11"
                cy="8"
                r="4"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M3 21c0-4.418 3.582-8 8-8s8 3.582 8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        )}
        <div className="pw-avatar-info">
          <div className="pw-avatar-title">Portfolio photo</div>
          <div className="pw-avatar-hint">
            JPEG, PNG, or WebP. Shown on your public portfolio page.
          </div>
          <label className="pw-file-btn">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M6 1v7M3 4l3-3 3 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1 10h10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            {avatarUrl ? "Change photo" : "Upload photo"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="pw-file-input"
              onChange={(e) =>
                handleAvatarUpload(e.target.files?.[0] ?? null, e.target)
              }
            />
          </label>
        </div>
      </div>

      <div className="pw-group-label" style={{ marginTop: 8 }}>
        Social links
      </div>

      <div className="pw-grid-2">
        <Field label="LinkedIn" error={fieldErrors.linkedinUrl}>
          <PwInput
            value={linkedinUrl}
            onChange={(e) => {
              setLinkedinUrl(e.target.value);
              clearFieldError("linkedinUrl");
            }}
            placeholder="https://linkedin.com/in/..."
            error={fieldErrors.linkedinUrl}
          />
        </Field>
        <Field label="GitHub" error={fieldErrors.githubUrl}>
          <PwInput
            value={githubUrl}
            onChange={(e) => {
              setGithubUrl(e.target.value);
              clearFieldError("githubUrl");
            }}
            placeholder="https://github.com/..."
            error={fieldErrors.githubUrl}
          />
        </Field>
      </div>

      <div className="pw-group-label" style={{ marginTop: 8 }}>
        AI design prompt
      </div>

      <div className={promptLocked ? "pw-prompt-locked" : ""}>
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
            onChange={(e) => {
              if (!promptLocked) setPrompt(e.target.value);
            }}
            placeholder="Modern dark theme, focused on full-stack projects with subtle animations..."
            rows={3}
            disabled={promptLocked}
          />
        </Field>
        {promptLocked && (
          <span className="pw-locked-badge">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <rect
                x="2"
                y="4.5"
                width="6"
                height="4.5"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.25"
              />
              <path
                d="M3.5 4.5V3a1.5 1.5 0 013 0v1.5"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
              />
            </svg>
            Locked
          </span>
        )}
      </div>
    </div>
  );
}

function SkillsStepUI({
  skills,
  setSkills,
  fieldErrors,
  clearFieldError,
}: any) {
  return (
    <div className="pw-section">
      <div>
        <div className="pw-step-header__eyebrow">Expertise</div>
        <h2 className="pw-step-header__title">Skills & technologies</h2>
        <p className="pw-step-header__desc">
          List the tools, languages, and frameworks you work with. Each skill
          needs at least 2 characters.
        </p>
      </div>

      {skills.length === 0 && (
        <div className="pw-info">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{ flexShrink: 0, marginTop: 1 }}
          >
            <circle
              cx="8"
              cy="8"
              r="6.5"
              stroke="currentColor"
              strokeWidth="1.25"
            />
            <path
              d="M8 7v4M8 5.25v.25"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          No skills added yet. Add your first skill below.
        </div>
      )}

      {skills.map((skill: any, index: number) => (
        <Card
          key={skill.id}
          title="Skill"
          index={index}
          onRemove={() => {
            setSkills((c: any[]) => c.filter((s) => s.id !== skill.id));
            clearFieldError(`skill-${skill.id}`);
          }}
        >
          <div className="pw-skill-row">
            <Field label="Skill name" error={fieldErrors[`skill-${skill.id}`]}>
              <PwInput
                value={skill.name}
                onChange={(e) => {
                  setSkills((c: any[]) =>
                    c.map((s) =>
                      s.id === skill.id ? { ...s, name: e.target.value } : s,
                    ),
                  );
                  clearFieldError(`skill-${skill.id}`);
                }}
                placeholder="React"
                error={fieldErrors[`skill-${skill.id}`]}
              />
            </Field>
            <Field label="Proficiency (optional)">
              <PwInput
                value={skill.level ?? ""}
                onChange={(e) =>
                  setSkills((c: any[]) =>
                    c.map((s) =>
                      s.id === skill.id ? { ...s, level: e.target.value } : s,
                    ),
                  )
                }
                placeholder="Advanced"
              />
            </Field>
          </div>
        </Card>
      ))}

      <AddBtn
        label="Add skill"
        onClick={() =>
          setSkills((c: any[]) => [
            ...c,
            { id: createId(), name: "", level: "" },
          ])
        }
      />
    </div>
  );
}

function ExperienceStepUI({
  experience,
  setExperience,
  fieldErrors,
  clearFieldError,
}: any) {
  return (
    <div className="pw-section">
      <div>
        <div className="pw-step-header__eyebrow">Career</div>
        <h2 className="pw-step-header__title">Work experience</h2>
        <p className="pw-step-header__desc">
          Add your professional history, starting with your most recent
          position.
        </p>
      </div>

      {experience.length === 0 && (
        <div className="pw-info">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{ flexShrink: 0, marginTop: 1 }}
          >
            <circle
              cx="8"
              cy="8"
              r="6.5"
              stroke="currentColor"
              strokeWidth="1.25"
            />
            <path
              d="M8 7v4M8 5.25v.25"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          No experience entries yet.
        </div>
      )}

      {experience.map((item: any, index: number) => (
        <Card
          key={item.id}
          title="Position"
          index={index}
          onRemove={() => {
            setExperience((c: any[]) => c.filter((e) => e.id !== item.id));
            clearFieldError(`exp-company-${item.id}`);
            clearFieldError(`exp-role-${item.id}`);
          }}
        >
          <div className="pw-grid-2">
            <Field
              label="Company"
              required
              error={fieldErrors[`exp-company-${item.id}`]}
            >
              <PwInput
                value={item.company}
                onChange={(e) => {
                  setExperience((c: any[]) =>
                    c.map((x) =>
                      x.id === item.id ? { ...x, company: e.target.value } : x,
                    ),
                  );
                  clearFieldError(`exp-company-${item.id}`);
                }}
                error={fieldErrors[`exp-company-${item.id}`]}
              />
            </Field>
            <Field
              label="Role / title"
              required
              error={fieldErrors[`exp-role-${item.id}`]}
            >
              <PwInput
                value={item.role}
                onChange={(e) => {
                  setExperience((c: any[]) =>
                    c.map((x) =>
                      x.id === item.id ? { ...x, role: e.target.value } : x,
                    ),
                  );
                  clearFieldError(`exp-role-${item.id}`);
                }}
                error={fieldErrors[`exp-role-${item.id}`]}
              />
            </Field>
          </div>
          <div className="pw-grid-2">
            <Field label="Start date">
              <PwInput
                value={item.startDate ?? ""}
                onChange={(e) =>
                  setExperience((c: any[]) =>
                    c.map((x) =>
                      x.id === item.id
                        ? { ...x, startDate: e.target.value }
                        : x,
                    ),
                  )
                }
                placeholder="Jan 2022"
              />
            </Field>
            <Field label="End date">
              <PwInput
                value={item.endDate ?? ""}
                onChange={(e) =>
                  setExperience((c: any[]) =>
                    c.map((x) =>
                      x.id === item.id ? { ...x, endDate: e.target.value } : x,
                    ),
                  )
                }
                placeholder="Present"
                disabled={item.current}
              />
            </Field>
          </div>
          <PwSwitch
            checked={Boolean(item.current)}
            onChange={(v) =>
              setExperience((c: any[]) =>
                c.map((x) =>
                  x.id === item.id
                    ? { ...x, current: v, endDate: v ? "" : x.endDate }
                    : x,
                ),
              )
            }
            label="Currently working here"
          />
          <Field label="Description">
            <PwTextarea
              value={item.description ?? ""}
              onChange={(e) =>
                setExperience((c: any[]) =>
                  c.map((x) =>
                    x.id === item.id
                      ? { ...x, description: e.target.value }
                      : x,
                  ),
                )
              }
              rows={3}
              placeholder="What you built, shipped, or led..."
            />
          </Field>
        </Card>
      ))}

      <AddBtn
        label="Add position"
        onClick={() =>
          setExperience((c: any[]) => [
            ...c,
            {
              id: createId(),
              company: "",
              role: "",
              startDate: "",
              endDate: "",
              current: false,
              description: "",
            },
          ])
        }
      />
    </div>
  );
}

function ProjectsStepUI({
  portfolioId,
  projects,
  setProjects,
  fieldErrors,
  clearFieldError,
  setMessage,
}: any) {
  return (
    <div className="pw-section">
      <div>
        <div className="pw-step-header__eyebrow">Work</div>
        <h2 className="pw-step-header__title">Portfolio projects</h2>
        <p className="pw-step-header__desc">
          Showcase your best work. Include a live URL and image for maximum
          impact.
        </p>
      </div>

      {projects.map((item: any, index: number) => (
        <Card
          key={item.id}
          title="Project"
          index={index}
          onRemove={() => {
            setProjects((c: any[]) => c.filter((p) => p.id !== item.id));
            clearFieldError(`proj-title-${item.id}`);
            clearFieldError(`proj-url-${item.id}`);
          }}
        >
          <Field
            label="Project title"
            required
            error={fieldErrors[`proj-title-${item.id}`]}
          >
            <PwInput
              value={item.title}
              onChange={(e) => {
                setProjects((c: any[]) =>
                  c.map((p) =>
                    p.id === item.id ? { ...p, title: e.target.value } : p,
                  ),
                );
                clearFieldError(`proj-title-${item.id}`);
              }}
              error={fieldErrors[`proj-title-${item.id}`]}
            />
          </Field>
          <Field label="Description">
            <PwTextarea
              value={item.description ?? ""}
              onChange={(e) =>
                setProjects((c: any[]) =>
                  c.map((p) =>
                    p.id === item.id
                      ? { ...p, description: e.target.value }
                      : p,
                  ),
                )
              }
              rows={3}
              placeholder="What it does and how you built it..."
            />
          </Field>
          <div className="pw-grid-2">
            <Field label="Live URL" error={fieldErrors[`proj-url-${item.id}`]}>
              <PwInput
                value={item.url ?? ""}
                onChange={(e) => {
                  setProjects((c: any[]) =>
                    c.map((p) =>
                      p.id === item.id ? { ...p, url: e.target.value } : p,
                    ),
                  );
                  clearFieldError(`proj-url-${item.id}`);
                }}
                placeholder="https://..."
                error={fieldErrors[`proj-url-${item.id}`]}
              />
            </Field>
            <Field label="Technologies (comma separated)">
              <PwInput
                value={(item.technologies ?? []).join(", ")}
                onChange={(e) =>
                  setProjects((c: any[]) =>
                    c.map((p) =>
                      p.id === item.id
                        ? {
                            ...p,
                            technologies: e.target.value
                              .split(",")
                              .map((t: string) => t.trim())
                              .filter(Boolean),
                          }
                        : p,
                    ),
                  )
                }
                placeholder="Next.js, Tailwind, Supabase"
              />
            </Field>
          </div>
          <div>
            <div className="pw-label" style={{ marginBottom: 8 }}>
              Project image
            </div>
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt=""
                style={{
                  width: 160,
                  height: 96,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid var(--pw-border)",
                  marginBottom: 10,
                }}
              />
            )}
            <label className="pw-file-btn">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M6 1v7M3 4l3-3 3 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1 10h10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              {item.imageUrl ? "Change image" : "Upload image"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="pw-file-input"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  const inputEl = e.target;
                  if (!file) return;
                  const fd = new FormData();
                  fd.append("file", file);
                  fd.append("type", "project-image");
                  fd.append("portfolioId", portfolioId);
                  try {
                    const res = await uploadFile(fd);
                    if (res.success && res.data?.url) {
                      setProjects((c: any[]) =>
                        c.map((p) =>
                          p.id === item.id
                            ? { ...p, imageUrl: res.data!.url! }
                            : p,
                        ),
                      );
                    } else if (!res.success) {
                      setMessage({
                        type: "error",
                        text: res.message ?? "Image upload failed.",
                      });
                    }
                  } catch {
                    setMessage({
                      type: "error",
                      text: "Unexpected error uploading image.",
                    });
                  } finally {
                    inputEl.value = "";
                  }
                }}
              />
            </label>
          </div>
        </Card>
      ))}

      <AddBtn
        label="Add project"
        onClick={() =>
          setProjects((c: any[]) => [
            ...c,
            {
              id: createId(),
              title: "",
              description: "",
              url: "",
              technologies: [],
              imageUrl: "",
            },
          ])
        }
      />
    </div>
  );
}

function EducationStepUI({
  education,
  setEducation,
  fieldErrors,
  clearFieldError,
}: any) {
  return (
    <div className="pw-section">
      <div>
        <div className="pw-step-header__eyebrow">Background</div>
        <h2 className="pw-step-header__title">Education</h2>
        <p className="pw-step-header__desc">
          Add your academic history. Recent graduates should put this first.
        </p>
      </div>

      {education.map((item: any, index: number) => (
        <Card
          key={item.id}
          title="Degree"
          index={index}
          onRemove={() => {
            setEducation((c: any[]) => c.filter((e) => e.id !== item.id));
            clearFieldError(`edu-inst-${item.id}`);
          }}
        >
          <Field
            label="Institution"
            required
            error={fieldErrors[`edu-inst-${item.id}`]}
          >
            <PwInput
              value={item.institution}
              onChange={(e) => {
                setEducation((c: any[]) =>
                  c.map((x) =>
                    x.id === item.id
                      ? { ...x, institution: e.target.value }
                      : x,
                  ),
                );
                clearFieldError(`edu-inst-${item.id}`);
              }}
              error={fieldErrors[`edu-inst-${item.id}`]}
            />
          </Field>
          <div className="pw-grid-2">
            <Field label="Degree">
              <PwInput
                value={item.degree ?? ""}
                onChange={(e) =>
                  setEducation((c: any[]) =>
                    c.map((x) =>
                      x.id === item.id ? { ...x, degree: e.target.value } : x,
                    ),
                  )
                }
                placeholder="B.Sc."
              />
            </Field>
            <Field label="Field of study">
              <PwInput
                value={item.field ?? ""}
                onChange={(e) =>
                  setEducation((c: any[]) =>
                    c.map((x) =>
                      x.id === item.id ? { ...x, field: e.target.value } : x,
                    ),
                  )
                }
                placeholder="Computer Science"
              />
            </Field>
          </div>
          <div className="pw-grid-2">
            <Field label="Start year">
              <PwInput
                value={item.startDate ?? ""}
                onChange={(e) =>
                  setEducation((c: any[]) =>
                    c.map((x) =>
                      x.id === item.id
                        ? { ...x, startDate: e.target.value }
                        : x,
                    ),
                  )
                }
                placeholder="2019"
              />
            </Field>
            <Field label="End year">
              <PwInput
                value={item.endDate ?? ""}
                onChange={(e) =>
                  setEducation((c: any[]) =>
                    c.map((x) =>
                      x.id === item.id ? { ...x, endDate: e.target.value } : x,
                    ),
                  )
                }
                placeholder="2023"
              />
            </Field>
          </div>
        </Card>
      ))}

      <AddBtn
        label="Add education"
        onClick={() =>
          setEducation((c: any[]) => [
            ...c,
            {
              id: createId(),
              institution: "",
              degree: "",
              field: "",
              startDate: "",
              endDate: "",
            },
          ])
        }
      />
    </div>
  );
}

function CertificatesStepUI({
  certificates,
  setCertificates,
  fieldErrors,
  clearFieldError,
}: any) {
  return (
    <div className="pw-section">
      <div>
        <div className="pw-step-header__eyebrow">Credentials</div>
        <h2 className="pw-step-header__title">Certifications</h2>
        <p className="pw-step-header__desc">
          Add professional certifications, courses, and credentials that back up
          your skills.
        </p>
      </div>

      {certificates.map((item: any, index: number) => (
        <Card
          key={item.id}
          title="Certificate"
          index={index}
          onRemove={() => {
            setCertificates((c: any[]) => c.filter((e) => e.id !== item.id));
            clearFieldError(`cert-name-${item.id}`);
            clearFieldError(`cert-url-${item.id}`);
          }}
        >
          <div className="pw-grid-2">
            <Field
              label="Certificate name"
              required
              error={fieldErrors[`cert-name-${item.id}`]}
            >
              <PwInput
                value={item.name}
                onChange={(e) => {
                  setCertificates((c: any[]) =>
                    c.map((x) =>
                      x.id === item.id ? { ...x, name: e.target.value } : x,
                    ),
                  );
                  clearFieldError(`cert-name-${item.id}`);
                }}
                error={fieldErrors[`cert-name-${item.id}`]}
              />
            </Field>
            <Field label="Issuing organization">
              <PwInput
                value={item.issuer ?? ""}
                onChange={(e) =>
                  setCertificates((c: any[]) =>
                    c.map((x) =>
                      x.id === item.id ? { ...x, issuer: e.target.value } : x,
                    ),
                  )
                }
                placeholder="Google, AWS, Coursera..."
              />
            </Field>
          </div>
          <div className="pw-grid-2">
            <Field label="Issue date">
              <PwInput
                value={item.issueDate ?? ""}
                onChange={(e) =>
                  setCertificates((c: any[]) =>
                    c.map((x) =>
                      x.id === item.id
                        ? { ...x, issueDate: e.target.value }
                        : x,
                    ),
                  )
                }
                placeholder="Mar 2024"
              />
            </Field>
            <Field
              label="Credential URL"
              error={fieldErrors[`cert-url-${item.id}`]}
            >
              <PwInput
                value={item.credentialUrl ?? ""}
                onChange={(e) => {
                  setCertificates((c: any[]) =>
                    c.map((x) =>
                      x.id === item.id
                        ? { ...x, credentialUrl: e.target.value }
                        : x,
                    ),
                  );
                  clearFieldError(`cert-url-${item.id}`);
                }}
                placeholder="https://..."
                error={fieldErrors[`cert-url-${item.id}`]}
              />
            </Field>
          </div>
        </Card>
      ))}

      <AddBtn
        label="Add certificate"
        onClick={() =>
          setCertificates((c: any[]) => [
            ...c,
            {
              id: createId(),
              name: "",
              issuer: "",
              issueDate: "",
              credentialUrl: "",
            },
          ])
        }
      />
    </div>
  );
}

function ResumeStepUI({
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
}: any) {
  const hasCurrentResume = Boolean(resumeUrl);
  const hasPendingUpload = Boolean(uploadedResumeUrl) && hasUploadedResume;
  return (
    <div className="pw-section">
      <div>
        <div className="pw-step-header__eyebrow">Document</div>
        <h2 className="pw-step-header__title">Resume</h2>
        <p className="pw-step-header__desc">
          Choose how your portfolio provides a resume to visitors. You can
          upload your own or let us generate one from your form data.
        </p>
      </div>

      {hasCurrentResume && (
        <div className="pw-resume-attached">
          <span className="pw-resume-attached__icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect
                x="3"
                y="1"
                width="10"
                height="14"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M6 5h4M6 8h4M6 11h2"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <div style={{ flex: 1 }}>
            <div className="pw-label" style={{ marginBottom: 2 }}>
              Current resume attached
            </div>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 12,
                color: "var(--pw-accent)",
                textDecoration: "underline",
              }}
            >
              View / download
            </a>
          </div>
        </div>
      )}

      <div className="pw-resume-grid">
        <div className="pw-resume-panel">
          <div>
            <div className="pw-resume-panel__num">Step 1</div>
            <div className="pw-resume-panel__title">Upload a PDF</div>
            <div className="pw-resume-panel__desc">
              Upload your own resume from your device. It stays available until
              you remove or attach it.
            </div>
          </div>
          <label
            className="pw-file-btn"
            style={{
              cursor: parsing ? "not-allowed" : "pointer",
              opacity: parsing ? 0.5 : 1,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M6 1v7M3 4l3-3 3 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1 10h10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            {parsing ? "Uploading…" : "Choose PDF"}
            <input
              type="file"
              accept="application/pdf,.pdf"
              disabled={parsing}
              className="pw-file-input"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                onResumeFileSelected(file, e.target);
              }}
            />
          </label>
          <span className="pw-hint">PDF only · max 5 MB</span>
        </div>

        <div className="pw-resume-panel">
          <div>
            <div className="pw-resume-panel__num">Step 2</div>
            <div className="pw-resume-panel__title">Attach to portfolio</div>
            <div className="pw-resume-panel__desc">
              Enable this once your PDF is uploaded to make it the resume shown
              on your public portfolio.
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

        <div className="pw-resume-panel">
          <div>
            <div className="pw-resume-panel__num">Or</div>
            <div className="pw-resume-panel__title">Auto-generate</div>
            <div className="pw-resume-panel__desc">
              We'll build a PDF from your form data automatically when you save
              the portfolio.
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
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            padding: "14px 16px",
            borderRadius: "var(--pw-radius-sm)",
            border: "1px solid var(--pw-border)",
            background: "var(--pw-surface-2)",
          }}
        >
          <div>
            <div className="pw-label" style={{ marginBottom: 3 }}>
              Uploaded resume ready
            </div>
            <a
              href={uploadedResumeUrl ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 12,
                color: "var(--pw-accent)",
                textDecoration: "underline",
              }}
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
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            style={{ flexShrink: 0, marginTop: 1 }}
          >
            <circle
              cx="7"
              cy="7"
              r="5.75"
              stroke="var(--pw-accent)"
              strokeWidth="1.25"
            />
            <path
              d="M7 6v3.5M7 4.5v.25"
              stroke="var(--pw-accent)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          A resume will be auto-generated from your form data and attached when
          you save.
        </div>
      )}

      {mode === "resume" && !hasCurrentResume && !hasPendingUpload && (
        <div className="pw-info">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            style={{ flexShrink: 0, marginTop: 1 }}
          >
            <circle
              cx="7"
              cy="7"
              r="5.75"
              stroke="currentColor"
              strokeWidth="1.25"
            />
            <path
              d="M7 6v3.5M7 4.5v.25"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Your original resume was only used for text extraction. The source PDF
          is not saved to your portfolio.
        </div>
      )}
    </div>
  );
}

function SeoStepUI({
  seoTitle,
  setSeoTitle,
  seoDescription,
  setSeoDescription,
  seoKeywords,
  setSeoKeywords,
  seoNoIndex,
  setSeoNoIndex,
  fieldErrors,
  clearFieldError,
}: any) {
  return (
    <div className="pw-section">
      <div>
        <div className="pw-step-header__eyebrow">Discoverability</div>
        <h2 className="pw-step-header__title">SEO & metadata</h2>
        <p className="pw-step-header__desc">
          Control how your portfolio appears in search engines. A good title and
          description help recruiters find you.
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
          onChange={(e) => {
            setSeoTitle(e.target.value);
            clearFieldError("seoTitle");
          }}
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
          onChange={(e) => {
            setSeoDescription(e.target.value);
            clearFieldError("seoDescription");
          }}
          rows={3}
          placeholder="Portfolio of Ali Khan, full-stack developer specializing in Next.js and cloud infrastructure."
          maxLength={160}
          error={fieldErrors.seoDescription}
        />
      </Field>

      <Field
        label="Keywords"
        hint="Comma-separated. Used by some search engines."
      >
        <PwInput
          value={seoKeywords}
          onChange={(e) => setSeoKeywords(e.target.value)}
          placeholder="developer, nextjs, portfolio, full-stack"
        />
      </Field>

      {(seoTitle || seoDescription) && (
        <div>
          <div className="pw-label" style={{ marginBottom: 8 }}>
            Search preview
          </div>
          <div className="pw-seo-preview">
            <div className="pw-seo-preview__url">yourportfolio.com</div>
            <div className="pw-seo-preview__title">
              {seoTitle || "Your portfolio title"}
            </div>
            <div className="pw-seo-preview__desc">
              {seoDescription || "Your meta description will appear here..."}
            </div>
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

function ReviewStepUI({
  name,
  headline,
  skillsCount,
  projectsCount,
  experienceCount,
  prompt,
  autoGenerateResume,
  resumeUrl,
}: any) {
  const items = [
    { key: "Name", value: name || "—" },
    { key: "Headline", value: headline || "—" },
    {
      key: "Skills",
      value: <span className="pw-review-badge">{skillsCount}</span>,
    },
    {
      key: "Projects",
      value: <span className="pw-review-badge">{projectsCount}</span>,
    },
    {
      key: "Experience",
      value: <span className="pw-review-badge">{experienceCount}</span>,
    },
    {
      key: "AI Prompt",
      value: prompt ? (
        `"${prompt.slice(0, 60)}${prompt.length > 60 ? "…" : ""}"`
      ) : (
        <span style={{ color: "var(--pw-text-muted)" }}>
          Blank — AI picks randomly
        </span>
      ),
    },
    {
      key: "Resume",
      value: autoGenerateResume ? (
        "Auto-generate on save"
      ) : resumeUrl ? (
        "Attached"
      ) : (
        <span style={{ color: "var(--pw-text-muted)" }}>None</span>
      ),
    },
  ];

  return (
    <div className="pw-section">
      <div>
        <div className="pw-step-header__eyebrow">Final check</div>
        <h2 className="pw-step-header__title">Review & save</h2>
        <p className="pw-step-header__desc">
          Everything looks good? Hit "Save portfolio" and AI will generate your
          layout based on your prompt.
        </p>
      </div>

      <div className="pw-review-card">
        {items.map(({ key, value }) => (
          <div key={key} className="pw-review-item">
            <span className="pw-review-item__key">{key}</span>
            <span className="pw-review-item__val">{value}</span>
          </div>
        ))}
      </div>

      <div className="pw-info pw-info--accent">
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          style={{ flexShrink: 0, marginTop: 1 }}
        >
          <path
            d="M7 1l1.5 3 3.5.5-2.5 2.5.5 3.5L7 9 4 10.5l.5-3.5L2 4.5 5.5 4 7 1z"
            stroke="var(--pw-accent)"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
        </svg>
        AI will pick your layout, color scheme, and component variants based on
        your prompt. You can regenerate anytime from the portfolio settings.
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sidebar navigation
// ---------------------------------------------------------------------------

function SidebarNav({ currentStepId }: { currentStepId: string }) {
  const currentIndex = CONTENT_STEPS.findIndex((s) => s.id === currentStepId);

  return (
    <aside className="pw-sidebar">
      <div className="pw-sidebar__header">
        <div className="pw-sidebar__logo">
          <span className="pw-sidebar__logo-mark">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="2" y="2" width="4" height="4" rx="1" fill="white" />
              <rect
                x="8"
                y="2"
                width="4"
                height="4"
                rx="1"
                fill="rgba(255,255,255,0.5)"
              />
              <rect
                x="2"
                y="8"
                width="4"
                height="4"
                rx="1"
                fill="rgba(255,255,255,0.5)"
              />
              <rect x="8" y="8" width="4" height="4" rx="1" fill="white" />
            </svg>
          </span>
          <span className="pw-sidebar__title">Portfolio Wizard</span>
        </div>
        <div className="pw-sidebar__subtitle">
          {currentIndex + 1} of {CONTENT_STEPS.length} steps complete
        </div>
      </div>

      {CONTENT_STEPS.map((step, idx) => {
        const state =
          idx < currentIndex
            ? "done"
            : idx === currentIndex
              ? "active"
              : "upcoming";
        return (
          <div key={step.id} style={{ position: "relative" }}>
            <div className={`pw-nav-step pw-nav-step--${state}`}>
              <span className="pw-nav-step__dot">
                {state === "done" ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M2 5l2.3 2.5L8 3"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  STEP_ICONS[step.id]
                )}
              </span>
              <span className="pw-nav-step__label">{step.label}</span>
            </div>
            {idx < CONTENT_STEPS.length - 1 && (
              <div
                className={`pw-nav-step__connector${state === "done" ? " pw-nav-step__connector--done" : ""}`}
              />
            )}
          </div>
        );
      })}
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Main PortfolioWizard component
// ---------------------------------------------------------------------------

export function PortfolioWizard({
  portfolio,
  data,
  isNew,
}: PortfolioWizardProps) {
  const router = useRouter();

  const startsEmpty = Boolean(isNew) && isPortfolioEmpty(data);
  const [stage, setStage] = useState<WizardStage>(
    startsEmpty ? "select" : "content",
  );
  const [mode, setMode] = useState<CreationMode | null>(
    startsEmpty ? null : "manual",
  );

  // Basics
  const [name, setName] = useState(data?.name ?? portfolio.title ?? "");
  const [prompt, setPrompt] = useState(data?.prompt ?? "");
  const [avatarUrl, setAvatarUrl] = useState(data?.avatarUrl ?? "");
  const [phone, setPhone] = useState(data?.phone ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(data?.linkedinUrl ?? "");
  const [githubUrl, setGithubUrl] = useState(data?.githubUrl ?? "");
  const [headline, setHeadline] = useState(data?.headline ?? "");
  const [about, setAbout] = useState(data?.about ?? "");

  // Sections
  const [skills, setSkills] = useState<Skill[]>(data?.skills ?? []);
  const [experience, setExperience] = useState<Experience[]>(
    data?.experience ?? [],
  );
  const [projects, setProjects] = useState<Project[]>(data?.projects ?? []);
  const [education, setEducation] = useState<Education[]>(
    data?.education ?? [],
  );
  const [certificates, setCertificates] = useState<Certificate[]>(
    data?.certificates ?? [],
  );

  // Resume
  const [resumeUrl, setResumeUrl] = useState(data?.resumeUrl ?? "");
  const [uploadedResumeId, setUploadedResumeId] = useState<string | null>(null);
  const [uploadedResumeUrl, setUploadedResumeUrl] = useState<string | null>(
    null,
  );
  const [hasUploadedResume, setHasUploadedResume] = useState(false);
  const [attachUploadedResume, setAttachUploadedResume] = useState(false);
  const [autoGenerateResume, setAutoGenerateResume] = useState(
    !Boolean(data?.resumeUrl),
  );
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isGeneratingResume, setIsGeneratingResume] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await getUploads({
          type: "resume",
          portfolioId: portfolio.id,
        });
        if (cancelled || !result.success) return;
        const uploads = result.data;
        const current = data?.resumeUrl
          ? uploads.find((item: any) => item.url === data.resumeUrl)
          : null;
        const latest = current ?? uploads[0] ?? null;
        if (!latest) return;
        setUploadedResumeId(latest.id);
        setUploadedResumeUrl(latest.url);
        setHasUploadedResume(true);
        if (data?.resumeUrl && latest.url === data.resumeUrl) {
          setAttachUploadedResume(true);
          setAutoGenerateResume(false);
        }
      } catch (error) {
        console.error("load portfolio resumes:", error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [portfolio.id, data?.resumeUrl]);

  // SEO
  const [seoTitle, setSeoTitle] = useState(
    (data?.seo?.title as string | undefined) ?? portfolio.title ?? "",
  );
  const [seoDescription, setSeoDescription] = useState(
    (data?.seo?.description as string | undefined) ?? "",
  );
  const [seoKeywords, setSeoKeywords] = useState(
    ((data?.seo?.keywords as string[] | undefined) ?? []).join(", "),
  );
  const [seoNoIndex, setSeoNoIndex] = useState(
    (data?.seo?.noIndex as boolean | undefined) ?? false,
  );

  // Wizard state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<Message>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStepId = CONTENT_STEPS[currentStepIndex].id;
  const isLastStep = currentStepIndex === CONTENT_STEPS.length - 1;
  const promptLocked = Boolean(data?.prompt && data.prompt.trim().length > 0);

  const clearFieldError = useCallback((key: string) => {
    setFieldErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const buildValidationState = useCallback(
    (): ValidationState => ({
      name,
      headline,
      about,
      phone,
      linkedinUrl,
      githubUrl,
      prompt,
      skills,
      experience,
      projects,
      education,
      certificates,
      seoTitle,
      seoDescription,
    }),
    [
      name,
      headline,
      about,
      phone,
      linkedinUrl,
      githubUrl,
      prompt,
      skills,
      experience,
      projects,
      education,
      certificates,
      seoTitle,
      seoDescription,
    ],
  );

  const validateCurrentStep = useCallback(() => {
    const errors = validateStep(currentStepId, buildValidationState());
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [currentStepId, buildValidationState]);

  const handleImportResume = useCallback(
    async (file: File | null) => {
      if (!file) return;
      setMessage(null);
      try {
        assertValidResumeFile(file);
        setIsParsingResume(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("portfolioId", portfolio.id);
        const result = await parseResumeAction(formData);
        if (!result.success || !result.data)
          throw new Error(result.message || "Failed to parse resume.");
        const parsed = result.data;
        setName(parsed.name);
        setHeadline(parsed.headline);
        setAbout(parsed.about);
        setPhone(parsed.phone);
        setLinkedinUrl(parsed.linkedinUrl);
        setGithubUrl(parsed.githubUrl);
        setSkills(parsed.skills);
        setExperience(parsed.experience);
        setProjects(parsed.projects);
        setEducation(parsed.education);
        setCertificates(parsed.certificates);
        setMode("resume");
        setStage("content");
        setCurrentStepIndex(0);
        setMessage({
          type: "success",
          text: "Resume parsed! Review and edit the details below.",
        });
      } catch (err) {
        setMessage({
          type: "error",
          text:
            err instanceof Error
              ? err.message
              : "Something went wrong while processing the resume.",
        });
      } finally {
        setIsParsingResume(false);
      }
    },
    [portfolio.id],
  );

  const handleResumeStepUpload = useCallback(
    async (file: File | null, inputEl?: HTMLInputElement | null) => {
      if (!file) return;
      setMessage(null);
      try {
        assertValidResumeFile(file);
        setIsUploadingResume(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "resume");
        formData.append("portfolioId", portfolio.id);
        const result = await uploadFile(formData);
        if (!result.success || !result.data?.url)
          throw new Error(result.message || "Failed to upload resume.");
        setUploadedResumeId(result.data.id);
        setUploadedResumeUrl(result.data.url);
        setHasUploadedResume(true);
        setAttachUploadedResume(false);
        setAutoGenerateResume(false);
      } catch (err) {
        setMessage({
          type: "error",
          text:
            err instanceof Error
              ? err.message
              : "Something went wrong while uploading the resume.",
        });
      } finally {
        setIsUploadingResume(false);
        if (inputEl) inputEl.value = "";
      }
    },
    [portfolio.id],
  );

  const handleRemoveUploadedResume = useCallback(async () => {
    if (!uploadedResumeId) return;
    setMessage(null);
    try {
      const result = await deleteUpload(uploadedResumeId);
      if (!result.success)
        throw new Error(result.message || "Unable to delete resume.");
      setUploadedResumeId(null);
      setUploadedResumeUrl(null);
      setHasUploadedResume(false);
      setAttachUploadedResume(false);
      setResumeUrl(
        uploadedResumeUrl && resumeUrl === uploadedResumeUrl ? "" : resumeUrl,
      );
      setAutoGenerateResume(true);
      setMessage({ type: "success", text: "Uploaded resume removed." });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Unable to delete resume.",
      });
    }
  }, [uploadedResumeId, uploadedResumeUrl, resumeUrl]);

  const handleNext = useCallback(() => {
    if (!validateCurrentStep()) {
      setMessage({
        type: "error",
        text: "Please fix the highlighted fields before continuing.",
      });
      return;
    }
    setMessage(null);
    setCurrentStepIndex((prev) => Math.min(prev + 1, CONTENT_STEPS.length - 1));
  }, [validateCurrentStep]);

  const handleBack = useCallback(() => {
    setMessage(null);
    setFieldErrors({});
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateCurrentStep()) {
      setMessage({
        type: "error",
        text: "Please fix the highlighted fields before saving.",
      });
      return;
    }
    setMessage(null);
    setIsSubmitting(true);
    try {
      let finalResumeUrl = (data?.resumeUrl ?? resumeUrl ?? "").trim();
      if (autoGenerateResume) {
        finalResumeUrl = "";
      } else if (attachUploadedResume) {
        finalResumeUrl = (uploadedResumeUrl || resumeUrl || "").trim();
      }
      const keywords = seoKeywords
        .split(",")
        .map((k: string) => k.trim())
        .filter(Boolean);
      const payload = {
        portfolioId: portfolio.id,
        name: name.trim(),
        prompt: (promptLocked ? (data?.prompt ?? prompt) : prompt).trim(),
        avatarUrl: avatarUrl.trim(),
        phone: phone.trim(),
        linkedinUrl: linkedinUrl.trim(),
        githubUrl: githubUrl.trim(),
        headline: headline.trim(),
        about: about.trim(),
        skills,
        experience,
        projects,
        education,
        certificates,
        resumeUrl: finalResumeUrl,
        theme: data?.theme ?? "minimal",
        animations: data?.animations ?? true,
        componentSelection: data?.componentSelection ?? {},
        designPreferences: data?.designPreferences ?? {},
        seo: {
          title: seoTitle.trim(),
          description: seoDescription.trim(),
          keywords,
          noIndex: seoNoIndex,
        },
      };
      const result = await finalizePortfolioAction(payload);
      if (!result.success)
        throw new Error(result.message ?? "Failed to save portfolio.");
      if (autoGenerateResume) {
        setIsGeneratingResume(true);
        const generateResult = await generateAndAttachResume(
          portfolio.id,
          data?.resumeUrl ?? resumeUrl,
        );
        if (!generateResult.success)
          throw new Error(
            generateResult.message ??
              "Portfolio saved, but resume generation failed.",
          );
        if (generateResult.data?.resumeUrl) {
          setResumeUrl(generateResult.data.resumeUrl);
          setAttachUploadedResume(false);
          setAutoGenerateResume(false);
          setUploadedResumeId(null);
          setUploadedResumeUrl(null);
          setHasUploadedResume(false);
        }
      }
      const versionResult = await createWorkingPortfolioVersion(portfolio.id);
      if (!versionResult.success)
        throw new Error(
          versionResult.message ??
            "Portfolio saved, but version creation failed.",
        );
      setMessage({ type: "success", text: "Portfolio saved successfully." });
      router.push(`/dashboard/portfolios/${portfolio.id}`);
      router.refresh();
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Something went wrong while saving the portfolio.",
      });
    } finally {
      setIsSubmitting(false);
      setIsGeneratingResume(false);
    }
  }, [
    validateCurrentStep,
    autoGenerateResume,
    attachUploadedResume,
    resumeUrl,
    data,
    seoKeywords,
    portfolio.id,
    name,
    promptLocked,
    prompt,
    avatarUrl,
    phone,
    linkedinUrl,
    githubUrl,
    headline,
    about,
    skills,
    experience,
    projects,
    education,
    certificates,
    seoTitle,
    seoDescription,
    seoNoIndex,
    router,
  ]);

  const currentStepContent = useMemo(() => {
    switch (currentStepId) {
      case "basics":
        return (
          <BasicsStepUI
            portfolioId={portfolio.id}
            name={name}
            setName={setName}
            headline={headline}
            setHeadline={setHeadline}
            about={about}
            setAbout={setAbout}
            avatarUrl={avatarUrl}
            setAvatarUrl={setAvatarUrl}
            phone={phone}
            setPhone={setPhone}
            linkedinUrl={linkedinUrl}
            setLinkedinUrl={setLinkedinUrl}
            githubUrl={githubUrl}
            setGithubUrl={setGithubUrl}
            prompt={prompt}
            setPrompt={setPrompt}
            promptLocked={promptLocked}
            fieldErrors={fieldErrors}
            clearFieldError={clearFieldError}
            setMessage={setMessage}
          />
        );
      case "skills":
        return (
          <SkillsStepUI
            skills={skills}
            setSkills={setSkills}
            fieldErrors={fieldErrors}
            clearFieldError={clearFieldError}
          />
        );
      case "experience":
        return (
          <ExperienceStepUI
            experience={experience}
            setExperience={setExperience}
            fieldErrors={fieldErrors}
            clearFieldError={clearFieldError}
          />
        );
      case "projects":
        return (
          <ProjectsStepUI
            portfolioId={portfolio.id}
            projects={projects}
            setProjects={setProjects}
            fieldErrors={fieldErrors}
            clearFieldError={clearFieldError}
            setMessage={setMessage}
          />
        );
      case "education":
        return (
          <EducationStepUI
            education={education}
            setEducation={setEducation}
            fieldErrors={fieldErrors}
            clearFieldError={clearFieldError}
          />
        );
      case "certificates":
        return (
          <CertificatesStepUI
            certificates={certificates}
            setCertificates={setCertificates}
            fieldErrors={fieldErrors}
            clearFieldError={clearFieldError}
          />
        );
      case "resume":
        return (
          <ResumeStepUI
            mode={mode}
            resumeUrl={resumeUrl}
            uploadedResumeUrl={uploadedResumeUrl}
            hasUploadedResume={hasUploadedResume}
            attachUploadedResume={attachUploadedResume}
            setAttachUploadedResume={setAttachUploadedResume}
            autoGenerateResume={autoGenerateResume}
            setAutoGenerateResume={setAutoGenerateResume}
            parsing={isUploadingResume}
            onResumeFileSelected={handleResumeStepUpload}
            onRemoveUploadedResume={handleRemoveUploadedResume}
          />
        );
      case "seo":
        return (
          <SeoStepUI
            seoTitle={seoTitle}
            setSeoTitle={setSeoTitle}
            seoDescription={seoDescription}
            setSeoDescription={setSeoDescription}
            seoKeywords={seoKeywords}
            setSeoKeywords={setSeoKeywords}
            seoNoIndex={seoNoIndex}
            setSeoNoIndex={setSeoNoIndex}
            fieldErrors={fieldErrors}
            clearFieldError={clearFieldError}
          />
        );
      case "review":
        return (
          <ReviewStepUI
            name={name}
            headline={headline}
            skillsCount={skills.length}
            projectsCount={projects.length}
            experienceCount={experience.length}
            prompt={prompt}
            autoGenerateResume={autoGenerateResume}
            resumeUrl={resumeUrl}
          />
        );
      default:
        return null;
    }
  }, [
    currentStepId,
    portfolio.id,
    name,
    headline,
    about,
    avatarUrl,
    phone,
    linkedinUrl,
    githubUrl,
    prompt,
    promptLocked,
    fieldErrors,
    clearFieldError,
    skills,
    experience,
    projects,
    education,
    certificates,
    mode,
    resumeUrl,
    hasUploadedResume,
    attachUploadedResume,
    autoGenerateResume,
    isUploadingResume,
    handleResumeStepUpload,
    handleRemoveUploadedResume,
    seoTitle,
    seoDescription,
    seoKeywords,
    seoNoIndex,
  ]);

  // ── Render: mode select ──
  if (stage === "select") {
    return (
      <div className="pw-root">
        <style>{WIZARD_STYLES}</style>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: 24,
          }}
        >
          <CreationModeSelect
            onSelect={(selected) => {
              if (selected === "manual") {
                setMode("manual");
                setStage("content");
              } else {
                setStage("import");
              }
              setMessage(null);
            }}
          />
        </div>
      </div>
    );
  }

  // ── Render: resume import ──
  if (stage === "import") {
    return (
      <div className="pw-root">
        <style>{WIZARD_STYLES}</style>
        <div className="pw-import">
          <span className="pw-import__icon-wrap">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect
                x="6"
                y="3"
                width="16"
                height="22"
                rx="2.5"
                stroke="currentColor"
                strokeWidth="1.75"
              />
              <path
                d="M10 9h8M10 13h8M10 17h5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M20 21l2.5 2.5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <h1 className="pw-import__heading">Import your resume</h1>
          <p className="pw-import__body">
            Upload a PDF and we'll extract your details and fill the form
            automatically. You can edit everything afterwards.
          </p>

          {message && <MessageBanner message={message} />}

          <label
            className="pw-import__zone"
            style={{
              cursor: isParsingResume ? "not-allowed" : "pointer",
              opacity: isParsingResume ? 0.6 : 1,
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              style={{
                margin: "0 auto 8px",
                display: "block",
                color: "var(--pw-text-muted)",
              }}
            >
              <path
                d="M16 6v14M9 13l7-7 7 7"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 26h20"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
            <div className="pw-import__zone-text">
              {isParsingResume
                ? "Parsing your resume…"
                : "Click to choose a PDF"}
            </div>
            <div className="pw-import__zone-hint">PDF only · max 5 MB</div>
            <input
              type="file"
              accept="application/pdf,.pdf"
              disabled={isParsingResume}
              className="pw-file-input"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                handleImportResume(file);
                e.target.value = "";
              }}
            />
          </label>

          <div className="pw-import__actions">
            <button
              type="button"
              className="pw-btn pw-btn--ghost"
              onClick={() => setStage("select")}
              disabled={isParsingResume}
            >
              ← Back
            </button>
            <button
              type="button"
              className="pw-btn pw-btn--ghost"
              style={{ border: "none", color: "var(--pw-text-muted)" }}
              onClick={() => {
                setMode("manual");
                setStage("content");
                setMessage(null);
              }}
              disabled={isParsingResume}
            >
              Skip, fill manually
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Render: step content ──
  return (
    <div className="pw-root">
      <style>{WIZARD_STYLES}</style>
      <div className="pw-layout">
        <SidebarNav currentStepId={currentStepId} />

        <div className="pw-main">
          {/* Mobile progress bar */}
          <WizardProgressBar currentStepId={currentStepId} />

          <div className="pw-content">
            {message && <MessageBanner message={message} />}
            <div style={{ minHeight: 400 }}>{currentStepContent}</div>
          </div>

          {/* Sticky footer */}
          <footer className="pw-footer">
            <button
              type="button"
              className="pw-btn pw-btn--ghost"
              onClick={handleBack}
              disabled={currentStepIndex === 0 || isSubmitting}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M9 2L4 7l5 5"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 12, color: "var(--pw-text-muted)" }}>
                {currentStepIndex + 1} / {CONTENT_STEPS.length}
              </span>

              {!isLastStep ? (
                <button
                  type="button"
                  className="pw-btn pw-btn--primary"
                  onClick={handleNext}
                  disabled={isSubmitting}
                >
                  Continue
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M5 2l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  className="pw-btn pw-btn--primary"
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    isUploadingResume ||
                    isParsingResume ||
                    isGeneratingResume
                  }
                >
                  {isSubmitting || isGeneratingResume ? (
                    <>
                      <span className="pw-spinner" />
                      {isGeneratingResume ? "Generating resume…" : "Saving…"}
                    </>
                  ) : (
                    <>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M2 7l3.5 3.5L12 3.5"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Save portfolio
                    </>
                  )}
                </button>
              )}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
