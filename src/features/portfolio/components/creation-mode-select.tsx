"use client";

import { Button } from "@/components/UI/Button";

type CreationModeSelectProps = {
  onSelect: (mode: "resume" | "manual") => void;
};

export function CreationModeSelect({ onSelect }: CreationModeSelectProps) {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="text-center">
        <p className="text-caption text-accent">New portfolio</p>
        <h1 className="text-h1 mt-2">How do you want to start?</h1>
        <p className="text-body mt-2 text-muted-foreground">
          Upload a resume and we&apos;ll extract your details, or fill
          everything in manually.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onSelect("resume")}
          className="surface-card group flex flex-col items-start gap-3 p-6 text-left transition-all hover:border-primary/40 hover:bg-gradient-ion-soft"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div>
            <p className="text-h3">Upload Resume</p>
            <p className="text-small mt-1 text-muted-foreground">
              PDF resume se data extract + rewrite. Phir form auto-fill ho
              jayega.
            </p>
          </div>
          <span className="text-small mt-auto text-primary opacity-0 transition-opacity group-hover:opacity-100">
            Continue →
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelect("manual")}
          className="surface-card group flex flex-col items-start gap-3 p-6 text-left transition-all hover:border-primary/40 hover:bg-gradient-ion-soft"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </div>
          <div>
            <p className="text-h3">Start Manually</p>
            <p className="text-small mt-1 text-muted-foreground">
              Khud saari fields fill karo — projects, skills, experience, sab.
            </p>
          </div>
          <span className="text-small mt-auto text-primary opacity-0 transition-opacity group-hover:opacity-100">
            Continue →
          </span>
        </button>
      </div>
    </div>
  );
}
