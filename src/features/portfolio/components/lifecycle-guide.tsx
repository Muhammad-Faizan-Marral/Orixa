"use client";

type Props = {
  status: "draft" | "published" | "archived";
  hasSavedVersion: boolean;
  hasUnpublishedChanges: boolean;
};

type StatusKey =
  | "archived"
  | "draft-unsaved"
  | "draft-ready"
  | "published-edits"
  | "published";

const STATUS_CONFIG: Record<
  StatusKey,
  { dot: string; label: string; hint: string; accent: string }
> = {
  archived: {
    dot: "bg-amber-400",
    label: "Archived",
    hint: "Hidden from visitors — restore to edit or publish again.",
    accent: "border-l-amber-400/70",
  },
  "draft-unsaved": {
    dot: "bg-zinc-400",
    label: "Unsaved draft",
    hint: "Complete your content in the editor and save to proceed.",
    accent: "border-l-zinc-400/50",
  },
  "draft-ready": {
    dot: "bg-sky-400",
    label: "Ready to publish",
    hint: "Your draft is saved. Publish whenever you're ready.",
    accent: "border-l-sky-400/70",
  },
  "published-edits": {
    dot: "bg-violet-400 animate-pulse",
    label: "Live · edits pending",
    hint: "Visitors see your last release. Push changes to go live.",
    accent: "border-l-violet-400/70",
  },
  published: {
    dot: "bg-emerald-400",
    label: "Live",
    hint: "Public and live. Edit freely — publish again to release changes.",
    accent: "border-l-emerald-400/70",
  },
};

function resolveKey(
  status: Props["status"],
  hasSavedVersion: boolean,
  hasUnpublishedChanges: boolean,
): StatusKey {
  if (status === "archived") return "archived";
  if (status === "draft" && !hasSavedVersion) return "draft-unsaved";
  if (status === "draft") return "draft-ready";
  if (status === "published" && hasUnpublishedChanges) return "published-edits";
  return "published";
}

export function LifecycleGuide({
  status,
  hasSavedVersion,
  hasUnpublishedChanges,
}: Props) {
  const key = resolveKey(status, hasSavedVersion, hasUnpublishedChanges);
  const cfg = STATUS_CONFIG[key];

  return (
    <div
      className={`
        flex items-start gap-3
        rounded-lg border-l-2 border border-border/50
        bg-surface-2/40 px-4 py-3
        backdrop-blur-sm
        ${cfg.accent}
      `}
    >
      {/* Status dot */}
      <span className="mt-[5px] flex-shrink-0">
        <span className={`block h-2 w-2 rounded-full ${cfg.dot}`} />
      </span>

      {/* Text */}
      <div className="min-w-0">
        <p className="text-small font-semibold tracking-tight text-foreground">
          {cfg.label}
        </p>
        <p className="text-small mt-0.5 leading-snug text-muted-foreground">
          {cfg.hint}
        </p>
      </div>
    </div>
  );
}