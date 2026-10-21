"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { uploadFile } from "@/actions/profile/upload-file";
import { deleteUpload } from "@/actions/profile/delete-upload";
import { getUploads } from "@/actions/profile/get-uploads";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

type UploadType = "avatar" | "project-image" | "resume";

type UploadRecord = {
  id: string;
  type: string;
  url: string | null;
  mimeType: string | null;
  size: number;
  createdAt: string;
};

type Props = {
  type: UploadType;
  portfolioId?: string;
  accept: string;
  label?: string;
};

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUpload({
  type,
  portfolioId,
  accept,
  label = "Upload file",
}: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [files, setFiles] = useState<UploadRecord[] | null>(null);

  function refreshFiles() {
    startTransition(async () => {
      const result = await getUploads({ type, portfolioId });
      if (result.success) setFiles(result.data);
    });
  }

  useEffect(() => {
    refreshFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, portfolioId]);

  function handleFile(file: File) {
    setError(null);

    if (file.size <= 0) {
      setError("File is empty.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be 5MB or less.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    if (portfolioId) formData.append("portfolioId", portfolioId);

    startTransition(async () => {
      const result = await uploadFile(formData);
      if (!result.success) {
        setError(result.message);
        return;
      }

      refreshFiles();

      if (type === "avatar") {
        router.refresh();
      }

      if (inputRef.current) inputRef.current.value = "";
    });
  }

  function handleRemove(uploadId: string) {
    startTransition(async () => {
      await deleteUpload(uploadId);
      refreshFiles();

      if (type === "avatar") {
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        aria-label={label}
        aria-busy={isPending}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-5 text-center transition-colors",
          FOCUS,
          isDragging
            ? "border-violet-500 bg-violet-500/[0.08]"
            : "border-foreground/25 hover:border-violet-500/50 hover:bg-violet-500/[0.04]",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          disabled={isPending}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          className="hidden"
          tabIndex={-1}
        />

        <span
          aria-hidden="true"
          className="flex size-10 items-center justify-center rounded-xl bg-violet-600 text-white"
        >
          {isPending ? (
            <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none" />
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 16V4M7 9l5-5 5 5M5 15v4h14v-4" />
            </svg>
          )}
        </span>

        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-foreground">
            {isPending ? "Uploading..." : label}
          </p>
          <p className="text-xs text-muted-foreground">
            Drag and drop or click to browse. Up to 5MB.
          </p>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="text-small flex items-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-red-700 dark:text-red-300"
        >
          <span
            aria-hidden="true"
            className="size-1.5 shrink-0 rounded-full bg-red-500"
          />
          {error}
        </p>
      )}

      {files && files.length > 0 && (
        <ul className="space-y-2">
          {files.map((upload) => (
            <li
              key={upload.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3 py-2.5"
            >
              <div className="flex min-w-0 items-center gap-3">
                {upload.mimeType?.startsWith("image/") && upload.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={upload.url}
                    alt=""
                    className="size-10 shrink-0 rounded-lg object-cover ring-1 ring-border"
                  />
                ) : (
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.06] text-[11px] font-semibold text-foreground/70">
                    {upload.mimeType === "application/pdf" ? "PDF" : "FILE"}
                  </span>
                )}

                <div className="min-w-0">
                  {upload.url ? (
                    <a
                      href={upload.url}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(
                        "block truncate rounded text-sm font-medium text-foreground underline decoration-foreground/25 underline-offset-4 transition-colors hover:decoration-foreground",
                        FOCUS,
                      )}
                    >
                      View file
                    </a>
                  ) : (
                    <span className="block truncate text-sm text-muted-foreground">
                      Processing...
                    </span>
                  )}
                  <span className="mt-0.5 block text-xs tabular-nums text-muted-foreground">
                    {formatSize(upload.size)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRemove(upload.id)}
                disabled={isPending}
                className={cn(
                  "text-small shrink-0 rounded-md px-2 py-1 text-red-600 transition-colors hover:bg-red-500/10 disabled:opacity-50 dark:text-red-400",
                  FOCUS,
                )}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}