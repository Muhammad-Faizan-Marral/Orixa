import type { CreateProfileInput } from "@/validations/profile.schema";

export type UsernameStatus =
  | "idle"
  | "checking"
  | "available"
  | "unavailable"
  | "error";

export interface UsernameState {
  status: UsernameStatus;
  message: string;
}

export type OnboardingFormValues = CreateProfileInput;
