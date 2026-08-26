"use client";

import { useEffect, useRef, useState, useTransition } from "react";

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

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUpload({ type, portfolioId, accept, label = "Upload file" }: Props) {
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
      if (inputRef.current) inputRef.current.value = "";
    });
  }

  function handleRemove(uploadId: string) {
    startTransition(async () => {
      await deleteUpload(uploadId);
      refreshFiles();
    });
  }

  return (
    <div className="space-y-3">
      <div
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
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors",
          isDragging ? "border-primary/50 bg-gradient-ion-soft" : "border-border hover:border-border-strong"
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
        />
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-ion-soft text-primary">
          ↑
        </span>
        <p className="text-label">{isPending ? "Uploading..." : label}</p>
        <p className="text-small">Drag & drop, or click to browse · up to 5MB</p>
      </div>

      {error && (
        <p role="alert" className="text-small rounded-lg border border-error/20 bg-error/10 px-3 py-2 text-error">
          {error}
        </p>
      )}

      {files && files.length > 0 && (
        <ul className="space-y-2">
          {files.map((upload) => (
            <li
              key={upload.id}
              className="surface-panel flex items-center justify-between gap-3 px-3 py-2.5"
            >
              <div className="flex min-w-0 items-center gap-3">
                {upload.mimeType?.startsWith("image/") && upload.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={upload.url} alt="" className="h-9 w-9 rounded-md object-cover" />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-surface-3 text-xs">
                    {upload.mimeType === "application/pdf" ? "PDF" : "FILE"}
                  </span>
                )}
                <div className="min-w-0">
                  {upload.url ? (
                    <a
                      href={upload.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-small block truncate text-foreground hover:text-primary"
                    >
                      View file
                    </a>
                  ) : (
                    <span className="text-small block truncate">Processing...</span>
                  )}
                  <span className="text-small block">{formatSize(upload.size)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(upload.id)}
                className="text-small shrink-0 text-error/80 hover:text-error"
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
