/**
 * Ripple pool: petals call spawn() when they touch the water,
 * <Ripples/> reads `items` each frame and draws expanding rings.
 * Plain data, no React, no allocations while running.
 */
export type Ripple = { active: boolean; age: number; x: number; z: number };

export type RipplePool = {
  items: Ripple[];
  life: number;
  maxRadius: number;
  spawn: (x: number, z: number) => void;
  update: (dt: number) => void;
};

export function createRipplePool(size = 24, life = 2.6, maxRadius = 1.5): RipplePool {
  const items: Ripple[] = Array.from({ length: size }, () => ({ active: false, age: 0, x: 0, z: 0 }));
  let cursor = 0;
  return {
    items,
    life,
    maxRadius,
    spawn(x, z) {
      // round-robin: oldest ripple gets recycled if the pool is full
      const r = items[cursor];
      cursor = (cursor + 1) % size;
      r.active = true;
      r.age = 0;
      r.x = x;
      r.z = z;
    },
    update(dt) {
      for (const r of items) {
        if (!r.active) continue;
        r.age += dt;
        if (r.age >= life) r.active = false;
      }
    },
  };
}
