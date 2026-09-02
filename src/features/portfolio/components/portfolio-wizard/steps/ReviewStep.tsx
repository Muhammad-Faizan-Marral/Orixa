"use client";

type ReviewStepProps = {
  name: string;
  headline: string;
  skillsCount: number;
  projectsCount: number;
  experienceCount: number;
  prompt: string;
  autoGenerateResume: boolean;
  resumeUrl: string;
};

export function ReviewStep({
  name,
  headline,
  skillsCount,
  projectsCount,
  experienceCount,
  prompt,
  autoGenerateResume,
  resumeUrl,
}: ReviewStepProps) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-h3">Review & submit</h2>
        <p className="text-small text-muted-foreground mt-1">
          Check your details. On submit, AI will pick layout & variants
          from your prompt (or random if blank).
        </p>
      </div>

      <div className="space-y-3 rounded-lg border border-border bg-surface-2 p-4 text-sm">
        <p>
          <span className="text-muted-foreground">Name:</span> {name || "—"}
        </p>
        <p>
          <span className="text-muted-foreground">Headline:</span>{" "}
          {headline || "—"}
        </p>
        <p>
          <span className="text-muted-foreground">Skills:</span>{" "}
          {skillsCount}
        </p>
        <p>
          <span className="text-muted-foreground">Projects:</span>{" "}
          {projectsCount}
        </p>
        <p>
          <span className="text-muted-foreground">Experience:</span>{" "}
          {experienceCount}
        </p>
        <p>
          <span className="text-muted-foreground">Prompt:</span>{" "}
          {prompt
            ? `"${prompt.slice(0, 80)}${prompt.length > 80 ? "…" : ""}"`
            : "(blank → AI random)"}
        </p>
        <p>
          <span className="text-muted-foreground">Resume:</span>{" "}
          {autoGenerateResume
            ? "Auto-generate"
            : resumeUrl
              ? "Uploaded"
              : "None"}
        </p>
      </div>
    </section>
  );
}
