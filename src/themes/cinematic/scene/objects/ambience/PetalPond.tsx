"use client";

import { useMemo } from "react";
import { createRipplePool } from "../../lib/ripples";
import { Petals } from "./Petals";
import { Ripples } from "./Ripples";
import { Water } from "./Water";

/** Ambience "petals": dark pond + falling cherry petals + ripples on touch-down. */
export function PetalPond() {
  const pool = useMemo(() => createRipplePool(), []);
  return (
    <>
      <Water />
      <Ripples pool={pool} />
      <Petals onLand={pool.spawn} />
    </>
  );
}
