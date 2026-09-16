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
  const items: { key: string; value: React.ReactNode }[] = [
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
      key: "Style direction",
      value: prompt ? (
        `"${prompt.slice(0, 60)}${prompt.length > 60 ? "…" : ""}"`
      ) : (
        <span style={{ color: "var(--pw-text-muted)" }}>
          Default — matched to your content
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
        <h2 className="pw-step-header__title">Review &amp; save</h2>
        <p className="pw-step-header__desc">
          Looks good? Save and we&apos;ll build a coherent design around your
          content and style direction — one clear visual system, not a random
          template mix.
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
        <span>
          A design engine maps your profile into a Design DNA (theme + matching
          sections). Your words stay yours — visuals stay intentional and
          consistent.
        </span>
      </div>
    </div>
  );
}
