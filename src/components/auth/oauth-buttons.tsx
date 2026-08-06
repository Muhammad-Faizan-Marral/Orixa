"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

export function OAuthButtons() {
  const [loading, setLoading] = useState<"google" | "github" | null>(null);

  async function handleOAuth(provider: "google" | "github") {
    setLoading(provider);

    const supabase = createClient();

    const origin = window.location.origin;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      console.error(error);
      setLoading(null);
      return;
    }

    if (data.url) {
      window.location.assign(data.url);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => handleOAuth("google")}
        disabled={loading !== null}
      >
        {loading === "google" ? "Connecting..." : "Continue with Google"}
      </button>

      <button
        type="button"
        onClick={() => handleOAuth("github")}
        disabled={loading !== null}
      >
        {loading === "github" ? "Connecting..." : "Continue with GitHub"}
      </button>
    </div>
  );
}
