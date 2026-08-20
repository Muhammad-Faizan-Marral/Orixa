"use client";

import { useState, useTransition } from "react";

import { createSocialLink } from "@/actions/profile/create-social-link";
import { updateSocialLink } from "@/actions/profile/update-social-link";
import { deleteSocialLink } from "@/actions/profile/delete-social-link";

type SocialLink = {
  id: string;
  platform: string;
  url: string;
  displayOrder: number;
};

type Props = {
  initialLinks: SocialLink[];
};

export function SocialLinksManager({ initialLinks }: Props) {
  const [links, setLinks] = useState<SocialLink[]>(initialLinks);

  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const resetForm = () => {
    setPlatform("");
    setUrl("");
    setDisplayOrder(0);
    setEditingId(null);
  };

  const submit = () => {
    setError(null);

    if (!platform.trim() || !url.trim()) {
      setError("Platform and URL are required.");
      return;
    }

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
        const result = await createSocialLink({
          platform,
          url,
          displayOrder,
        });

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
    setDisplayOrder(link.displayOrder);
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
    <section>
      <div>
        <h2>Social Links</h2>

        <p>Add the social profiles you want to show on your portfolio.</p>
      </div>

      <div>
        <label>
          Platform
          <input
            value={platform}
            onChange={(event) => setPlatform(event.target.value)}
            placeholder="GitHub"
          />
        </label>

        <label>
          URL
          <input
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://github.com/username"
          />
        </label>

        <label>
          Display Order
          <input
            type="number"
            min={0}
            value={displayOrder}
            onChange={(event) => setDisplayOrder(Number(event.target.value))}
          />
        </label>

        <button type="button" onClick={submit} disabled={isPending}>
          {isPending ? "Saving..." : editingId ? "Update Link" : "Add Link"}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm} disabled={isPending}>
            Cancel
          </button>
        )}

        {error && <p role="alert">{error}</p>}
      </div>

      <div>
        {links.length === 0 ? (
          <p>No social links added yet.</p>
        ) : (
          links.map((link) => (
            <article key={link.id}>
              <div>
                <strong>{link.platform}</strong>

                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.url}
                </a>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => edit(link)}
                  disabled={isPending}
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => remove(link.id)}
                  disabled={isPending}
                >
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
