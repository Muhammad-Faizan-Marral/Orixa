
"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

import { Arc } from "./Arc";
import { C, flat } from "../materials";
import { useScene } from "../../state/scene-context";


type Props = {
  length: number;
  width: number;
  lit?: boolean;
};

const SEG = 40;
const LIGHT_OFFSET = 5;

/**
 * Premium curved runway.
 *
 * Features:
 * - Follows spherical surface through <Arc />
 * - Segmented construction for large/world-scale runways
 * - Center markings
 * - Dual edge guidance lights
 * - Optional animated landing-light chase
 * - Subtle emissive asphalt/markings
 * - Reduced-motion aware
 * - Materials are memoized instead of recreated every render
 */
export function RunwayStrip({
  length,
  width,
  lit = false,
}: Props) {
  const { journey } = useScene();

  const lights = useRef<Array<Mesh | null>>([]);

  /*
   * Keep geometry segmentation predictable.
   * At least one section is rendered for positive lengths.
   */
  const segmentCount = Math.max(
    1,
    Math.ceil(Math.max(length, 1) / SEG),
  );

  /*
   * Use a stable visual length for edge calculations.
   */
  const runwayLength = Math.max(length, SEG);

  /* ============================================================
     MATERIALS
  ============================================================ */

  const materials = useMemo(() => {
    const asphalt = flat(C.asphalt, {
      roughness: 0.96,
      metalness: 0.02,
    });

    const asphaltEdge = flat(C.asphalt, {
      roughness: 0.82,
      metalness: 0.04,
    });

    const centerMark = flat(C.white, {
      roughness: 0.52,
      metalness: 0.04,
      emissive: "#ffffff",
      emissiveIntensity: 0.08,
    });

    const edgeMark = flat(C.white, {
      roughness: 0.42,
      metalness: 0.03,
      emissive: "#ffffff",
      emissiveIntensity: 0.12,
    });

    const landingLight = flat(
      lit ? "#ffd27a" : C.white,
      {
        roughness: 0.28,
        metalness: 0.18,
        emissive: lit
          ? "#ff9d45"
          : "#ffffff",
        emissiveIntensity: lit ? 1.8 : 0.18,
      },
    );

    const lightHousing = flat(C.dark, {
      roughness: 0.9,
      metalness: 0.08,
    });

    const threshold = flat(C.white, {
      roughness: 0.38,
      metalness: 0.02,
      emissive: "#ffffff",
      emissiveIntensity: 0.1,
    });

    return {
      asphalt,
      asphaltEdge,
      centerMark,
      edgeMark,
      landingLight,
      lightHousing,
      threshold,
    };
  }, [lit]);

  /* ============================================================
     LANDING LIGHT ANIMATION
  ============================================================ */

  useFrame((state) => {
    if (!lit || journey.reducedMotion) {
      return;
    }

    const t = state.clock.elapsedTime;

    lights.current.forEach((mesh, index) => {
      if (!mesh) return;

      /*
       * Forward-moving chase wave.
       *
       * Each pair is intentionally offset very slightly so
       * the runway feels like a real landing sequence.
       */
      const phase =
        t * 5.2 -
        index * 0.38;

      const pulse =
        0.72 +
        0.9 *
          Math.max(
            0,
            Math.sin(phase),
          );

      mesh.scale.setScalar(pulse);
    });
  });

  /* ============================================================
     RUNWAY DIMENSIONS
  ============================================================ */

  const safeWidth = Math.max(width, 12);

  const shoulderWidth =
    safeWidth + 8;

  const markerLength =
    Math.min(
      16,
      SEG * 0.42,
    );

  const edgeOffset =
    safeWidth / 2 + LIGHT_OFFSET;

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <group>
      {Array.from(
        { length: segmentCount },
        (_, i) => {
          const s =
            -runwayLength / 2 +
            SEG / 2 +
            i * SEG;

          const showCenterMark =
            i % 2 === 0;

          const isFirst =
            i === 0;

          const isLast =
            i === segmentCount - 1;

          /*
           * Only extend the segment when necessary.
           * This prevents ugly gaps without making the whole
           * runway visually bloated.
           */
          const currentSegmentWidth =
            Math.min(
              SEG + 1,
              runwayLength -
                i * SEG +
                1,
            );

          return (
            <Arc
              key={i}
              s={s}
            >
              {/* ==================================================
                  MAIN ASPHALT
              ================================================== */}

              <mesh
                material={materials.asphalt}
                position={[0, -4, 0]}
                receiveShadow
              >
                <boxGeometry
                  args={[
                    currentSegmentWidth,
                    2,
                    safeWidth,
                  ]}
                />
              </mesh>

              {/* ==================================================
                  SUBTLE OUTER SHOULDER
              ================================================== */}

              <mesh
                material={materials.asphaltEdge}
                position={[0, -3.35, 0]}
                receiveShadow
              >
                <boxGeometry
                  args={[
                    currentSegmentWidth,
                    0.45,
                    shoulderWidth,
                  ]}
                />
              </mesh>

              {/* Restore asphalt surface above shoulder */}
              <mesh
                material={materials.asphalt}
                position={[0, -3.02, 0]}
                receiveShadow
              >
                <boxGeometry
                  args={[
                    currentSegmentWidth,
                    0.16,
                    safeWidth,
                  ]}
                />
              </mesh>

              {/* ==================================================
                  CENTER DASH
              ================================================== */}

              {showCenterMark && (
                <mesh
                  material={materials.centerMark}
                  position={[
                    0,
                    -2.82,
                    0,
                  ]}
                >
                  <boxGeometry
                    args={[
                      markerLength,
                      0.42,
                      2.3,
                    ]}
                  />
                </mesh>
              )}

              {/* ==================================================
                  EDGE STRIPES
              ================================================== */}

              <mesh
                material={materials.edgeMark}
                position={[
                  0,
                  -2.82,
                  safeWidth / 2 - 3,
                ]}
              >
                <boxGeometry
                  args={[
                    currentSegmentWidth,
                    0.32,
                    1.5,
                  ]}
                />
              </mesh>

              <mesh
                material={materials.edgeMark}
                position={[
                  0,
                  -2.82,
                  -(safeWidth / 2 - 3),
                ]}
              >
                <boxGeometry
                  args={[
                    currentSegmentWidth,
                    0.32,
                    1.5,
                  ]}
                />
              </mesh>

              {/* ==================================================
                  LANDING LIGHT HOUSINGS
              ================================================== */}

              {[-1, 1].map((side) => {
                const lightIndex =
                  i * 2 +
                  (side > 0 ? 1 : 0);

                return (
                  <group
                    key={side}
                    position={[
                      0,
                      -2.58,
                      side * edgeOffset,
                    ]}
                  >
                    {/* recessed housing */}
                    <mesh
                      material={
                        materials.lightHousing
                      }
                    >
                      <boxGeometry
                        args={[
                          6,
                          1.5,
                          4.8,
                        ]}
                      />
                    </mesh>

                    {/* actual light */}
                    <mesh
                      ref={(el) => {
                        lights.current[
                          lightIndex
                        ] = el;
                      }}
                      material={
                        materials.landingLight
                      }
                      position={[
                        0,
                        1.0,
                        0,
                      ]}
                    >
                      <sphereGeometry
                        args={[
                          2.15,
                          8,
                          6,
                        ]}
                      />
                    </mesh>
                  </group>
                );
              })}

              {/* ==================================================
                  START THRESHOLD DETAIL
              ================================================== */}

              {isFirst && (
                <group
                  position={[
                    -SEG * 0.24,
                    -2.72,
                    0,
                  ]}
                >
                  {[-3, -1, 1, 3].map(
                    (offset) => (
                      <mesh
                        key={offset}
                        material={
                          materials.threshold
                        }
                        position={[
                          0,
                          0,
                          offset *
                            (safeWidth / 8),
                        ]}
                      >
                        <boxGeometry
                          args={[
                            8,
                            0.35,
                            3.2,
                          ]}
                        />
                      </mesh>
                    ),
                  )}
                </group>
              )}

              {/* ==================================================
                  END THRESHOLD DETAIL
              ================================================== */}

              {isLast && (
                <group
                  position={[
                    SEG * 0.24,
                    -2.72,
                    0,
                  ]}
                >
                  {[-3, -1, 1, 3].map(
                    (offset) => (
                      <mesh
                        key={offset}
                        material={
                          materials.threshold
                        }
                        position={[
                          0,
                          0,
                          offset *
                            (safeWidth / 8),
                        ]}
                      >
                        <boxGeometry
                          args={[
                            8,
                            0.35,
                            3.2,
                          ]}
                        />
                      </mesh>
                    ),
                  )}
                </group>
              )}
            </Arc>
          );
        },
      )}
    </group>
  );
}
