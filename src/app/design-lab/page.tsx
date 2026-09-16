import type { Metadata } from "next";

import { DesignLabClient } from "@/features/portfolio/design-lab/design-lab-client";

export const metadata: Metadata = {
  title: "Design Lab · Orixa",
  description: "Live Design DNA + section variant playground (dev)",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * http://localhost:3000/design-lab
 * Internal playground — dummy data, live DNA / variant switching.
 */
export default function DesignLabPage() {
  return <DesignLabClient />;
}