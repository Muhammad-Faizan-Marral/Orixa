"use client";

import { useState, useTransition } from "react";

import { createSocialLink } from "@/actions/profile/create-social-link";
import { updateSocialLink } from "@/actions/profile/update-social-link";
import { deleteSocialLink } from "@/actions/profile/delete-social-link";

import { Input } from "@/components/UI/Input";
import { Button } from "@/components/UI/Button";
import { cn } from "@/lib/utils";

type SocialLink = {
  id: string;
  platform: string;
  url: string;
  displayOrder: number;
};

type Props = {
  initialLinks: SocialLink[];
};

const PLATFORM_SUGGESTIONS = [
  "GitHub",
  "LinkedIn",
  "Twitter / X",
  "Website",
  "Dribbble",
  "Behance",
];

const DISPLAY = "font-[family-name:var(--font-display,var(--font-dm))]";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function platformInitial(platform: string) {
  return platform.trim().slice(0, 1).toUpperCase() || "?";
}

export function SocialLinksManager({ initialLinks }: Props) {
  const [links, setLinks] = useState<SocialLink[]>(
    [...initialLinks].sort((a, b) => a.displayOrder - b.displayOrder),
  );

  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const resetForm = () => {
    setPlatform("");
    setUrl("");
    setEditingId(null);
    setIsFormOpen(false);
    setError(null);
  };

  const submit = () => {
    setError(null);

    if (!platform.trim() || !url.trim()) {
      setError("Platform and URL are required.");
      return;
    }

    const displayOrder = editingId
      ? (links.find((l) => l.id === editingId)?.displayOrder ?? links.length)
      : links.length;

    startTransition(async () => {
      if (editingId) {
        const result = await updateSocialLink({
          id: editingId,
          platform,
          url,
          displayOrder,
        });

        if (!result.success) {
          setError(result.message);
          return;
        }

        setLinks((current) =>
          current.map((link) => (link.id === editingId ? result.data! : link)),
        );
      } else {
        const result = await createSocialLink({ platform, url, displayOrder });

        if (!result.success) {
          setError(result.message);
          return;
        }

        if (result.data) {
          setLinks((current) =>
            [...current, result.data!].sort(
              (a, b) => a.displayOrder - b.displayOrder,
            ),
          );
        }
      }

      resetForm();
    });
  };

  const edit = (link: SocialLink) => {
    setEditingId(link.id);
    setPlatform(link.platform);
    setUrl(link.url);
    setIsFormOpen(true);
    setError(null);
  };

  const remove = (id: string) => {
    const confirmed = window.confirm("Delete this social link?");
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteSocialLink(id);

      if (!result.success) {
        setError(result.message);
        return;
      }

      setLinks((current) => current.filter((link) => link.id !== id));
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          <h2
            className={`${DISPLAY} text-2xl font-semibold leading-tight tracking-[-0.02em] text-foreground`}
          >
            Social links
          </h2>
          <p className="text-small max-w-[48ch] text-muted-foreground">
            Add the social profiles you want to show on your portfolio.
          </p>
        </div>

        {!isFormOpen && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setIsFormOpen(true)}
          >
            + Add link
          </Button>
        )}
      </div>

      {isFormOpen && (
        <div className="space-y-5 rounded-xl border border-violet-500/30 bg-gradient-to-br from-violet-500/[0.08] via-violet-500/[0.03] to-transparent p-4 sm:p-5">
          <p className="text-sm font-semibold text-foreground">
            {editingId ? "Edit link" : "New link"}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2.5">
              <Input
                label="Platform"
                value={platform}
                onChange={(event) => setPlatform(event.target.value)}
                placeholder="GitHub"
              />

              {!platform && (
                <div className="flex flex-wrap gap-1.5">
                  {PLATFORM_SUGGESTIONS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPlatform(p)}
                      className={cn(
                        "rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-violet-500/50 hover:text-foreground",
                        FOCUS,
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Input
              label="URL"
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://github.com/username"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="text-small flex items-center gap-2 text-red-600 dark:text-red-400"
            >
              <span
                aria-hidden="true"
                className="size-1.5 shrink-0 rounded-full bg-red-500"
              />
              {error}
            </p>
          )}

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={submit}
              loading={isPending}
            >
              {editingId ? "Update link" : "Add link"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetForm}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {links.length === 0 && !isFormOpen ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-foreground/25 px-4 py-10 text-center">
          <span
            aria-hidden="true"
            className="flex size-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-700 dark:bg-violet-400/15 dark:text-violet-300"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
            </svg>
          </span>
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-foreground">
              No social links added yet
            </p>
            <p className="text-small text-muted-foreground">
              Add GitHub, LinkedIn or your own website.
            </p>
          </div>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {links.map((link) => (
            <li
              key={link.id}
              className={cn(
                "flex items-center justify-between gap-3 rounded-xl border bg-background px-3.5 py-3 transition-colors hover:border-foreground/20",
                editingId === link.id
                  ? "border-violet-500/50 bg-violet-500/[0.04]"
                  : "border-border",
              )}
            >
              <div className="flex min-w-0 items-center gap-3.5">
                <span
                  aria-hidden="true"
                  className={`${DISPLAY} flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-sm font-semibold text-violet-700 dark:bg-violet-400/15 dark:text-violet-300`}
                >
                  {platformInitial(link.platform)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {link.platform}
                  </p>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "text-small block truncate rounded text-muted-foreground transition-colors hover:text-foreground hover:underline",
                      FOCUS,
                    )}
                  >
                    {link.url}
                  </a>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => edit(link)}
                  disabled={isPending}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(link.id)}
                  disabled={isPending}
                  className="text-red-600 hover:bg-red-500/10 dark:text-red-400"
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}