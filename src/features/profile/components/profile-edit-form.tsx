"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { updateProfile } from "@/actions/profile/update-profile";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/validations/profile.schema";

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

export function ProfileEditForm({
  profile,
}: ProfileEditFormProps) {
  const [serverMessage, setServerMessage] =
    useState("");

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(
      updateProfileSchema,
    ),
    defaultValues: {
      username: profile.username,
      fullName: profile.fullName ?? "",
      headline: profile.headline ?? "",
      bio: profile.bio ?? "",
      location: profile.location ?? "",
      avatarUrl: profile.avatarUrl ?? "",
    },
  });

  const onSubmit = async (
    data: UpdateProfileInput,
  ) => {
    setServerMessage("");

    const result =
      await updateProfile(data);

    if (!result.success) {
      setServerMessage(result.message);
      return;
    }

    setServerMessage(
      "Profile updated successfully.",
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="username">
          Username
        </label>

        <input
          id="username"
          {...register("username")}
        />

        {errors.username && (
          <p>{errors.username.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="fullName">
          Full Name
        </label>

        <input
          id="fullName"
          {...register("fullName")}
        />
      </div>

      <div>
        <label htmlFor="headline">
          Headline
        </label>

        <input
          id="headline"
          {...register("headline")}
        />
      </div>

      <div>
        <label htmlFor="bio">
          Bio
        </label>

        <textarea
          id="bio"
          {...register("bio")}
        />
      </div>

      <div>
        <label htmlFor="location">
          Location
        </label>

        <input
          id="location"
          {...register("location")}
        />
      </div>

      <div>
        <label htmlFor="avatarUrl">
          Avatar URL
        </label>

        <input
          id="avatarUrl"
          {...register("avatarUrl")}
        />

        {errors.avatarUrl && (
          <p>{errors.avatarUrl.message}</p>
        )}
      </div>

      {serverMessage && (
        <p>{serverMessage}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Saving..."
          : "Save Changes"}
      </button>
    </form>
  );
}