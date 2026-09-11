"use server";

import { createClient } from "@/lib/supabase/server";

export type OAuthProvider = "google" | "github";

export async function signInWithOAuth(
  provider: OAuthProvider,
) {
  const supabase = await createClient();

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://orixa-one.vercel.app/";

  const { data, error } =
    await supabase.auth.signInWithOAuth({
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