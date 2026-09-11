"use server";

import { createClient } from "@/lib/supabase/server";

export type OAuthProvider = "google" | "github";

function getSiteOrigin() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  // Production pe kabhi localhost fallback mat use karo
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "http://localhost:3000";
}

export async function signInWithOAuth(provider: OAuthProvider) {
  const supabase = await createClient();
  const origin = getSiteOrigin();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback?next=/dashboard`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data.url;
}