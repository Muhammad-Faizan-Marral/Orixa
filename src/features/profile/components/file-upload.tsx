"use client";

import { useRef, useState, useTransition } from "react";

import { uploadFile } from "@/actions/profile/upload-file";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

type Props = {
  type: "avatar" | "project-image" | "resume";
  portfolioId?: string;
  accept: string;
  label?: string;
};

export function FileUpload({
  type,
  portfolioId,
  accept,
  label = "Choose File",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setMessage(null);

    if (file.size <= 0) {
      setMessage("File is empty.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setMessage("File size must be 5MB or less.");
      event.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    if (portfolioId) {
      formData.append("portfolioId", portfolioId);
    }

    startTransition(async () => {
      const result = await uploadFile(formData);
      setMessage(result.message);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    });
  };

  return (
    <div>
      <label>
        {label}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          disabled={isPending}
          onChange={handleChange}
        />
      </label>

      {isPending && <p>Uploading...</p>}
      {message && <p>{message}</p>}
    </div>
  );
}
