"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Input } from "@/components/UI/Input";
import { Textarea } from "@/components/UI/Textarea";

import type { OnboardingFormValues } from "../types";

interface StepFieldsProps {
  register: UseFormRegister<OnboardingFormValues>;
  errors: FieldErrors<OnboardingFormValues>;
  disabled?: boolean;
}

/** Step: Identity — who they are, visually. */
export function IdentityFields({ register, errors, disabled = false }: StepFieldsProps) {
  return (
    <div className="space-y-5">
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
        {...register("avatarUrl")}
        type="url"
        label="Avatar URL"
        placeholder="https://example.com/avatar.jpg"
        autoComplete="url"
        disabled={disabled}
        error={errors.avatarUrl?.message}
        hint="Optional — you can upload a photo later from your dashboard."
      />
    </div>
  );
}

/** Step: Professional info — headline, bio, location. */
export function ProfessionalFields({ register, errors, disabled = false }: StepFieldsProps) {
  return (
    <div className="space-y-5">
      <Input
        {...register("headline")}
        type="text"
        label="Headline"
        placeholder="Full Stack Developer"
        autoComplete="organization-title"
        disabled={disabled}
        error={errors.headline?.message}
      />

      <Textarea
        {...register("bio")}
        label="Bio"
        rows={5}
        placeholder="Tell people about yourself..."
        disabled={disabled}
        error={errors.bio?.message}
      />

      <Input
        {...register("location")}
        type="text"
        label="Location"
        placeholder="Sargodha, Pakistan"
        autoComplete="address-level2"
        disabled={disabled}
        error={errors.location?.message}
      />
    </div>
  );
}
