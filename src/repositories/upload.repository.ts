import { and, desc, eq, inArray, sql } from "drizzle-orm";

import { db } from "@/db";
import { uploads } from "@/db/schema";

export class UploadRepository {
  async reserve(data: {
    profileId: string;
    type: string;
    bucket: string;
    storagePath: string;
    mimeType: string;
    size: number;
    maxBytes: number;
    maxFiles: number;
  }) {
    return db.transaction(async (tx) => {
      // Same profile ID always maps to the same advisory lock.
      // This makes quota reservation atomic across concurrent requests.
      await tx.execute(
        sql`select pg_advisory_xact_lock(hashtextextended(${data.profileId}, 0))`,
      );

      const [usage] = await tx
        .select({
          totalBytes: sql<number>`coalesce(sum(${uploads.size}), 0)`,
          totalFiles: sql<number>`count(*)`,
        })
        .from(uploads)
        .where(
          and(
            eq(uploads.profileId, data.profileId),
            inArray(uploads.status, ["reserved", "active", "deleting"]),
          ),
        );

      const totalBytes = Number(usage?.totalBytes ?? 0);
      const totalFiles = Number(usage?.totalFiles ?? 0);

      if (totalFiles >= data.maxFiles) {
        throw new Error(`You can upload a maximum of ${data.maxFiles} files.`);
      }

      if (totalBytes + data.size > data.maxBytes) {
        throw new Error("Your 100MB storage quota has been reached.");
      }

      const [reservation] = await tx
        .insert(uploads)
        .values({
          profileId: data.profileId,
          type: data.type,
          bucket: data.bucket,
          storagePath: data.storagePath,
          url: null,
          mimeType: data.mimeType,
          size: data.size,
          status: "reserved",
        })
        .returning();

      if (!reservation) {
        throw new Error("Unable to reserve upload quota.");
      }

      return reservation;
    });
  }

  async activate(id: string, profileId: string, url: string | null) {
    const [upload] = await db
      .update(uploads)
      .set({
        status: "active",
        url,
      })
      .where(
        and(
          eq(uploads.id, id),
          eq(uploads.profileId, profileId),
          eq(uploads.status, "reserved"),
        ),
      )
      .returning();

    return upload ?? null;
  }

  async releaseReservation(id: string, profileId: string) {
    await db
      .delete(uploads)
      .where(
        and(
          eq(uploads.id, id),
          eq(uploads.profileId, profileId),
          eq(uploads.status, "reserved"),
        ),
      );
  }

  async findById(id: string, profileId: string) {
    const [upload] = await db
      .select()
      .from(uploads)
      .where(and(eq(uploads.id, id), eq(uploads.profileId, profileId)))
      .limit(1);

    return upload ?? null;
  }

  async findByUrl(url: string, profileId: string) {
    const [upload] = await db
      .select()
      .from(uploads)
      .where(
        and(
          eq(uploads.profileId, profileId),
          eq(uploads.url, url),
          eq(uploads.status, "active"),
        ),
      )
      .limit(1);

    return upload ?? null;
  }

  async findByProfileId(profileId: string) {
    return db
      .select()
      .from(uploads)
      .where(
        and(eq(uploads.profileId, profileId), eq(uploads.status, "active")),
      )
      .orderBy(desc(uploads.createdAt));
  }

  async markDeleting(id: string, profileId: string) {
    const [upload] = await db
      .update(uploads)
      .set({ status: "deleting" })
      .where(
        and(
          eq(uploads.id, id),
          eq(uploads.profileId, profileId),
          eq(uploads.status, "active"),
        ),
      )
      .returning();

    return upload ?? null;
  }

  async restoreActive(id: string, profileId: string) {
    const [upload] = await db
      .update(uploads)
      .set({ status: "active" })
      .where(
        and(
          eq(uploads.id, id),
          eq(uploads.profileId, profileId),
          eq(uploads.status, "deleting"),
        ),
      )
      .returning();

    return upload ?? null;
  }

  async markDeleted(id: string, profileId: string) {
    const [upload] = await db
      .update(uploads)
      .set({
        status: "deleted",
        url: null,
      })
      .where(
        and(
          eq(uploads.id, id),
          eq(uploads.profileId, profileId),
          eq(uploads.status, "deleting"),
        ),
      )
      .returning();

    return upload ?? null;
  }
}

export const uploadRepository = new UploadRepository();
