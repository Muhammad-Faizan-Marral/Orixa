"use client";

import { useMemo, useState } from "react";

interface ChecklistItem {
  id: string;
  label: string;
}

interface ChecklistGroup {
  id: string;
  title: string;
  description: string;
  items: ChecklistItem[];
}

const CHECKLIST_GROUPS: ChecklistGroup[] = [
  {
    id: "message",
    title: "1. Message and project content",
    description: "Make the work and your contribution easy to understand.",
    items: [
      {
        id: "headline",
        label: "The headline clearly says what I do and who I help.",
      },
      {
        id: "bio",
        label: "My introduction is current, specific, and proofread.",
      },
      {
        id: "case-studies",
        label:
          "Each featured project explains the problem, my role, key decisions, and outcome.",
      },
      {
        id: "truthful-results",
        label:
          "Metrics and outcomes are accurate; nothing is invented or exaggerated.",
      },
      {
        id: "confidentiality",
        label:
          "I removed confidential client data, private documents, and information I do not have permission to share.",
      },
    ],
  },
  {
    id: "visuals",
    title: "2. Visual quality and accessibility",
    description:
      "Check that people can read and use the portfolio on different devices.",
    items: [
      {
        id: "mobile",
        label:
          "I checked the public portfolio on a phone, tablet-sized viewport, and desktop.",
      },
      {
        id: "contrast",
        label: "Text has readable contrast and keyboard focus is visible.",
      },
      {
        id: "images",
        label:
          "Images are compressed appropriately and meaningful images have useful alt text.",
      },
      {
        id: "headings",
        label:
          "Headings are in a logical order and buttons/links have clear labels.",
      },
    ],
  },
  {
    id: "contact",
    title: "3. Contact, resume, and links",
    description:
      "Test the actions a recruiter, client, or collaborator may take.",
    items: [
      {
        id: "contact-test",
        label:
          "I tested the contact form or email action and confirmed where the message is delivered.",
      },
      {
        id: "socials",
        label:
          "Social profiles, project demos, repositories, and external links open the intended destination.",
      },
      {
        id: "resume",
        label:
          "If I share a resume, the file opens, text is selectable where expected, and its details match the portfolio.",
      },
      {
        id: "cta",
        label:
          "The primary next step is clear and works without dead buttons or placeholder links.",
      },
    ],
  },
  {
    id: "search",
    title: "4. Search and sharing basics",
    description:
      "Help search engines and link previews understand the public page.",
    items: [
      {
        id: "title-description",
        label:
          "The page title and description are unique, accurate, and written for people.",
      },
      {
        id: "canonical",
        label:
          "The public URL is stable and the canonical points to the preferred URL.",
      },
      {
        id: "indexability",
        label:
          "The page is intended to be public, is not unintentionally noindexed, and is reachable through a normal link.",
      },
      {
        id: "share-preview",
        label:
          "The social sharing title, description, and preview image look correct.",
      },
      {
        id: "sitemap",
        label:
          "If this is a page I want search engines to discover, its canonical URL is in the sitemap or linked from relevant pages.",
      },
    ],
  },
  {
    id: "measurement",
    title: "5. Measurement and follow-up",
    description: "Set a baseline so future changes are based on evidence.",
    items: [
      {
        id: "analytics",
        label:
          "I checked which analytics are available and confirmed the tracking works where expected.",
      },
      {
        id: "privacy",
        label:
          "My privacy notice accurately describes the data and tracking used by this site.",
      },
      {
        id: "feedback",
        label:
          "At least one other person has reviewed the live portfolio and tried the main links.",
      },
      {
        id: "refresh",
        label:
          "I have a reminder to update outdated project, contact, resume, or role information.",
      },
    ],
  },
];

const ALL_ITEMS = CHECKLIST_GROUPS.flatMap((group) => group.items);

export function PortfolioLaunchChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [notice, setNotice] = useState("");
  const completedCount = useMemo(
    () => ALL_ITEMS.filter((item) => checked[item.id]).length,
    [checked],
  );
  const progress = Math.round((completedCount / ALL_ITEMS.length) * 100);

  function toggleItem(id: string) {
    setChecked((current) => ({ ...current, [id]: !current[id] }));
    setNotice("");
  }

  async function copyChecklist() {
    const lines = CHECKLIST_GROUPS.flatMap((group) => [
      group.title,
      ...group.items.map(
        (item) => `${checked[item.id] ? "[x]" : "[ ]"} ${item.label}`,
      ),
      "",
    ]);

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setNotice(
        "Checklist copied. Paste it into your notes or project tracker.",
      );
    } catch {
      setNotice(
        "Clipboard access was blocked. Use Print / Save as PDF to keep a copy.",
      );
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border bg-surface p-5 sm:p-7 print:border-black print:bg-white print:p-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-accent print:text-black">
              Your progress
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground print:text-black">
              {completedCount} of {ALL_ITEMS.length} checks complete
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground print:text-black">
              This checklist is saved in this page session only. Copy or print
              it if you want to keep your progress.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 print:hidden">
            <button
              type="button"
              onClick={copyChecklist}
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition hover:border-primary"
            >
              Copy checklist
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex min-h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover"
            >
              Print / Save PDF
            </button>
          </div>
        </div>
        <div
          className="mt-5 h-2 overflow-hidden rounded-full bg-surface-2 print:hidden"
          role="progressbar"
          aria-label="Portfolio launch checklist progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-muted-foreground print:hidden">
          {progress}% complete
        </p>
        {notice && (
          <p
            className="mt-4 text-sm text-foreground"
            role="status"
            aria-live="polite"
          >
            {notice}
          </p>
        )}
      </section>

      {CHECKLIST_GROUPS.map((group) => (
        <section
          key={group.id}
          className="rounded-2xl border border-border bg-surface p-5 sm:p-7 print:break-inside-avoid print:border-black print:bg-white print:p-4"
        >
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl print:text-black">
            {group.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground print:text-black">
            {group.description}
          </p>
          <ul className="mt-5 space-y-3">
            {group.items.map((item) => (
              <li key={item.id}>
                <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2 transition hover:bg-surface-2 print:cursor-auto print:p-1">
                  <input
                    type="checkbox"
                    checked={Boolean(checked[item.id])}
                    onChange={() => toggleItem(item.id)}
                    className="mt-1 h-4 w-4 shrink-0 rounded border-border accent-primary print:appearance-auto"
                  />
                  <span
                    className={`text-sm leading-6 sm:text-base print:text-black ${checked[item.id] ? "text-muted-foreground line-through" : "text-foreground"}`}
                  >
                    {item.label}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
