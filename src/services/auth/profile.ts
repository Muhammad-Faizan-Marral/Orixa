import { eq } from "drizzle-orm";

import { db } from "@/db";
import { profiles } from "@/db/schema";

type AuthProfileInput = {
  userId: string;
  email?: string | null;
  fullName?: string | null;
};

export async function ensureProfile(
  input: AuthProfileInput,
) {
  const existingProfile = await db
    .select({
      id: profiles.id,
    })
    .from(profiles)
    .where(eq(profiles.userId, input.userId))
    .limit(1);

  if (existingProfile.length > 0) {
    return existingProfile[0];
  }

  const [profile] = await db
    .insert(profiles)
    .values({
      userId: input.userId,
      fullName: input.fullName ?? null,
    })
    .returning({
      id: profiles.id,
    });

  return profile;
}