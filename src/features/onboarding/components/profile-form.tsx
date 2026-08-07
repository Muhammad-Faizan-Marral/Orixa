"use client";

import type {
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";

import { Input } from "../../../components/UI/Input";

import { UsernameField } from "./username-field";
import type { OnboardingFormValues } from "../types";

interface ProfileFormProps {
  register: UseFormRegister<OnboardingFormValues>;
  watch: UseFormWatch<OnboardingFormValues>;
  errors: FieldErrors<OnboardingFormValues>;
  disabled?: boolean;
}

export function ProfileForm({
  register,
  watch,
  errors,
  disabled = false,
}: ProfileFormProps) {
  const username = watch("username");

  return (
    <div className="space-y-6">
      <UsernameField
        registration={register("username")}
        value={username}
        error={errors.username?.message}
        disabled={disabled}
      />

      <Input
        {...register("fullName")}
        type="text"
        label="Full name"
        placeholder="Your full name"
        autoComplete="name"
        disabled={disabled}
        error={errors.fullName?.message}
      />

      <Input
        {...register("headline")}
        type="text"
        label="Headline"
        placeholder="Full Stack Developer"
        autoComplete="organization-title"
        disabled={disabled}
        error={errors.headline?.message}
      />

      <div className="space-y-1">
        <label htmlFor="bio" className="block text-sm font-medium">
          Bio
        </label>

        <textarea
          id="bio"
          {...register("bio")}
          rows={5}
          placeholder="Tell people about yourself..."
          disabled={disabled}
          aria-invalid={Boolean(errors.bio)}
          className={`w-full rounded-md border px-3 py-2 outline-none ${
            errors.bio ? "border-red-500" : ""
          }`}
        />

        {errors.bio?.message && (
          <p className="text-sm text-red-500">{errors.bio.message}</p>
        )}
      </div>

      <Input
        {...register("location")}
        type="text"
        label="Location"
        placeholder="Sargodha, Pakistan"
        autoComplete="address-level2"
        disabled={disabled}
        error={errors.location?.message}
      />

      <Input
        {...register("avatarUrl")}
        type="url"
        label="Avatar URL"
        placeholder="https://example.com/avatar.jpg"
        autoComplete="url"
        disabled={disabled}
        error={errors.avatarUrl?.message}
      />
    </div>
  );
}
