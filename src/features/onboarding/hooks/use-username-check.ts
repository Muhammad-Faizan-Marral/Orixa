"use client";

import { useEffect, useState } from "react";

import { checkUsername } from "@/actions/profile/check-username";

import { USERNAME_CHECK_DELAY, USERNAME_MIN_LENGTH } from "../constants";

import type { UsernameState } from "../types";

export function useUsernameCheck(username: string) {
  const [state, setState] = useState<UsernameState>({
    status: "idle",
    message: "",
  });

  const value = username.trim().toLowerCase();
  const isInvalid = !value || value.length < USERNAME_MIN_LENGTH;

  if (isInvalid && state.status !== "idle") {
    setState({
      status: "idle",
      message: "",
    });
  }

  useEffect(() => {
    if (isInvalid) return;

    const timer = setTimeout(async () => {
      try {
        setState({
          status: "checking",
          message: "Checking username...",
        });

        const result = await checkUsername(value);

        if (!result.success) {
          setState({
            status: "error",
            message: result.message,
          });
          return;
        }

        setState({
          status: result.available ? "available" : "unavailable",
          message: result.message,
        });
      } catch {
        setState({
          status: "error",
          message: "Unable to check username.",
        });
      }
    }, USERNAME_CHECK_DELAY);

    return () => clearTimeout(timer);
  }, [value, isInvalid]);

  return {
    ...state,

    isChecking: state.status === "checking",

    isAvailable: state.status === "available",

    isUnavailable: state.status === "unavailable",

    hasError: state.status === "error",
  };
}
