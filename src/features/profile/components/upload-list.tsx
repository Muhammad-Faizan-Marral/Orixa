"use client";

import { useTransition } from "react";

import { deleteUpload } from "@/actions/profile/delete-upload";

type Upload = {
  id: string;
  type: string;
  url: string | null;
  mimeType: string | null;
  size: number;
};

type Props = {
  uploads: Upload[];
};

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadList({ uploads }: Props) {
  const [isPending, startTransition] = useTransition();

  const remove = (id: string) => {
    if (!window.confirm("Delete this file?")) return;

    startTransition(async () => {
      await deleteUpload(id);
    });
  };

  if (uploads.length === 0) {
    return <p>No uploaded files.</p>;
  }

  return (
    <div>
      {uploads.map((upload) => (
        <article key={upload.id}>
          {upload.url && upload.mimeType?.startsWith("image/") ? (
            <img
              src={upload.url}
              alt="Uploaded asset"
              width={160}
              height={160}
            />
          ) : upload.url ? (
            <a href={upload.url} target="_blank" rel="noreferrer">
              Open File
            </a>
          ) : (
            <p>Preview unavailable.</p>
          )}

          <p>{upload.type}</p>
          <p>{formatFileSize(upload.size)}</p>

          <button
            type="button"
            disabled={isPending}
            onClick={() => remove(upload.id)}
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </article>
      ))}
    </div>
  );
}
