import type { InferSelectModel } from "drizzle-orm";

import { profiles } from "@/db/schema";

export type Profile =
  InferSelectModel<typeof profiles>;