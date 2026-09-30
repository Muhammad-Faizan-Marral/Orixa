/**
 * Mutable, re-render-free state. Scroll/pointer har frame badalte hain, isliye React state nahi.
 * Sirf useFrame ke andar read/write karo.
 */
export type JourneyState = {
  /** scroll se mila target, 0..1 */
  target: number;
  /** eased progress jo scene use karti hai */
  progress: number;
  /** progress/sec (signed, smoothed): propeller speed, motion streaks ke liye */
  velocity: number;
  /** -1..1 (x: left→right, y: bottom→top), original zip jaisa */
  pointer: { x: number; y: number };
  /** performance.now() jab pointer aakhri baar hila */
  pointerAt: number;
  reducedMotion: boolean;
};

export function createJourneyState(reducedMotion: boolean): JourneyState {
  return {
    target: 0,
    progress: 0,
    velocity: 0,
    pointer: { x: 0, y: 0 },
    pointerAt: -Infinity,
    reducedMotion,
  };
}