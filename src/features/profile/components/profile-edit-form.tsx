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
      setStatus({ type: "error", message: result.message });
      return;
    }

    setStatus({ type: "success", message: "Profile updated successfully." });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <p className="text-caption text-accent">Identity</p>
        <h2 className="text-h3 mt-1">Basic information</h2>
        <p className="text-small mt-1">
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
        rows={4}
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

      <div className="flex items-center justify-between gap-4 border-t border-border pt-5">
        <div className="min-h-[1.25rem]">
          {status && (
            <p
              className={
                "text-small animate-fade-in " +
                (status.type === "success" ? "text-success" : "text-error")
              }
              role={status.type === "error" ? "alert" : undefined}
            >
              {status.message}
            </p>
          )}
        </div>

        <Button type="submit" variant="primary" loading={isSubmitting} disabled={!isDirty && !isSubmitting}>
          {isSubmitting ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
