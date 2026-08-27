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

const PLATFORM_SUGGESTIONS = ["GitHub", "LinkedIn", "Twitter / X", "Website", "Dribbble", "Behance"];

function platformInitial(platform: string) {
  return platform.trim().slice(0, 1).toUpperCase() || "?";
}

export function SocialLinksManager({ initialLinks }: Props) {
  const [links, setLinks] = useState<SocialLink[]>(
    [...initialLinks].sort((a, b) => a.displayOrder - b.displayOrder)
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
      ? links.find((l) => l.id === editingId)?.displayOrder ?? links.length
      : links.length;

    startTransition(async () => {
      if (editingId) {
        const result = await updateSocialLink({ id: editingId, platform, url, displayOrder });

        if (!result.success) {
          setError(result.message);
          return;
        }

        setLinks((current) => current.map((link) => (link.id === editingId ? result.data! : link)));
      } else {
        const result = await createSocialLink({ platform, url, displayOrder });

        if (!result.success) {
          setError(result.message);
          return;
        }

        if (result.data) {
          setLinks((current) => [...current, result.data!].sort((a, b) => a.displayOrder - b.displayOrder));
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
    <section className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-caption text-accent">Presence</p>
          <h2 className="text-h3 mt-1">Social links</h2>
          <p className="text-small mt-1">
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
        <div className="surface-panel animate-fade-in-up space-y-4 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Input
                label="Platform"
                value={platform}
                onChange={(event) => setPlatform(event.target.value)}
                placeholder="GitHub"
                list="platform-suggestions"
              />
              <datalist id="platform-suggestions">
                {PLATFORM_SUGGESTIONS.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
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
            <p role="alert" className="text-small text-error">
              {error}
            </p>
          )}

          <div className="flex items-center gap-2">
            <Button type="button" variant="primary" size="sm" onClick={submit} loading={isPending}>
              {editingId ? "Update link" : "Add link"}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={resetForm} disabled={isPending}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {links.length === 0 && !isFormOpen ? (
        <div className="surface-panel flex flex-col items-center gap-2 px-4 py-8 text-center">
          <span className="bg-gradient-ion-soft flex h-10 w-10 items-center justify-center rounded-lg text-primary">
            ⛓
          </span>
          <p className="text-small">No social links added yet.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {links.map((link) => (
            <li
              key={link.id}
              className={cn(
                "surface-panel flex items-center justify-between gap-3 px-3.5 py-3 transition-colors",
                editingId === link.id && "border-primary/40"
              )}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="bg-gradient-ion-soft flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-primary">
                  {platformInitial(link.platform)}
                </span>
                <div className="min-w-0">
                  <p className="text-label truncate">{link.platform}</p>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-small block truncate hover:text-primary"
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
                  className="text-error/80 hover:bg-error/10 hover:text-error"
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
