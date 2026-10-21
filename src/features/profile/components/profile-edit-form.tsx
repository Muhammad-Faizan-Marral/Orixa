"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { updateProfile } from "@/actions/profile/update-profile";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/validations/profile.schema";

import { Input } from "@/components/UI/Input";
import { Textarea } from "@/components/UI/Textarea";
import { Button } from "@/components/UI/Button";

type ProfileEditFormProps = {
  profile: {
    username: string;
    fullName: string | null;
    headline: string | null;
    bio: string | null;
    location: string | null;
    avatarUrl: string | null;
  };
};

const DISPLAY = "font-[family-name:var(--font-display,var(--font-dm))]";

export function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      username: profile.username,
      fullName: profile.fullName ?? "",
      headline: profile.headline ?? "",
      bio: profile.bio ?? "",
      location: profile.location ?? "",
      avatarUrl: profile.avatarUrl ?? "",
    },
  });

  const onSubmit = async (data: UpdateProfileInput) => {
    setStatus(null);

    const result = await updateProfile(data);

    if (!result.success) {
      setStatus({
        type: "error",
        message: result.message || "Unable to update profile.",
      });
      return;
    }

    setStatus({ type: "success", message: "Profile updated successfully." });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      <div className="space-y-1.5">
        <h2
          className={`${DISPLAY} text-2xl font-semibold leading-tight tracking-[-0.02em] text-foreground`}
        >
          Basic information
        </h2>
        <p className="text-small max-w-[56ch] text-muted-foreground">
          This appears on your public profile and every portfolio you publish.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Username"
          hint="orixa.ai/username"
          {...register("username")}
          error={errors.username?.message}
        />

        <Input
          label="Full name"
          placeholder="John Doe"
          {...register("fullName")}
          error={errors.fullName?.message}
        />
      </div>

      <Input
        label="Headline"
        placeholder="Full Stack Developer"
        {...register("headline")}
        error={errors.headline?.message}
      />

      <Textarea
        label="Bio"
        placeholder="I build scalable web applications..."
        rows={5}
        {...register("bio")}
        error={errors.bio?.message}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Location"
          placeholder="Lahore, Pakistan"
          {...register("location")}
          error={errors.location?.message}
        />

        <Input
          label="Avatar URL"
          placeholder="https://..."
          {...register("avatarUrl")}
          error={errors.avatarUrl?.message}
        />
      </div>

      <div className="flex flex-col-reverse gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-h-[1.25rem]" aria-live="polite">
          {status ? (
            <p
              className={`text-small flex items-center gap-2 ${
                status.type === "success"
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-red-600 dark:text-red-400"
              }`}
              role={status.type === "error" ? "alert" : undefined}
            >
              <span
                aria-hidden="true"
                className={`size-1.5 shrink-0 rounded-full ${
                  status.type === "success" ? "bg-emerald-500" : "bg-red-500"
                }`}
              />
              {status.message}
            </p>
          ) : isDirty ? (
            <p className="text-small flex items-center gap-2 text-muted-foreground">
              <span
                aria-hidden="true"
                className="size-1.5 shrink-0 rounded-full bg-amber-500"
              />
              You have unsaved changes
            </p>
          ) : null}
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          disabled={!isDirty && !isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}