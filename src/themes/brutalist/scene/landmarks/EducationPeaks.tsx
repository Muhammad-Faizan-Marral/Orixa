"use client";

import type { EducationStation } from "../../schema";
import { ACCENT_CYCLE } from "../../data/world.config";
import { placementsOf, type Placement } from "./placement";
import { C, flat } from "./materials";
import { Placed } from "./parts/Placed";

/**
 * Education -> "Academy Peak"
 *
 * Concept:
 * A nostalgic hilltop academy that feels like a memory from
 * an old illustrated travel book.
 *
 * Visual language:
 * - layered mountain silhouette
 * - warm vintage school building
 * - clock tower
 * - soft glowing windows
 * - pennant flag
 * - stepped entrance
 * - restrained low-poly geometry
 */
export function EducationPeaks({
  station,
  placements,
}: {
  station: EducationStation;
  placements: Placement[];
}) {
  const mine = placementsOf(placements, "education");

  return (
    <>
      {station.data.items.map((item, i) => {
        const flag = ACCENT_CYCLE[(i + 1) % ACCENT_CYCLE.length];

        const rockMaterial = flat(C.rock);
        const grassMaterial = flat(C.grass);
        const creamMaterial = flat(C.cream);
        const navyMaterial = flat(C.navy);
        const whiteMaterial = flat(C.white);

        const windowMaterial = flat(C.cream, {
          emissive: C.cream,
          emissiveIntensity: 0.22,
        });

        const flagMaterial = flat(flag, {
          emissive: flag,
          emissiveIntensity: 0.14,
        });

        return (
          <Placed key={item.id} p={mine[i]}>
            <group>
              {/* -------------------------------------------------------
               * MOUNTAIN BASE
               * ----------------------------------------------------- */}
              <mesh
                material={rockMaterial}
                position={[0, 24, 0]}
                rotation={[0, Math.PI / 6, 0]}
                castShadow
                receiveShadow
              >
                <coneGeometry args={[82, 58, 7]} />
              </mesh>

              {/* Secondary carved terrace */}
              <mesh
                material={rockMaterial}
                position={[0, 50, 0]}
                rotation={[0, Math.PI / 7, 0]}
                castShadow
                receiveShadow
              >
                <coneGeometry args={[60, 34, 7]} />
              </mesh>

              {/* Grass cap */}
              <mesh
                material={grassMaterial}
                position={[0, 67, 0]}
                rotation={[0, Math.PI / 7, 0]}
                receiveShadow
              >
                <cylinderGeometry args={[31, 40, 8, 7]} />
              </mesh>

              {/* Small upper terrace */}
              <mesh
                material={grassMaterial}
                position={[0, 73, 0]}
                receiveShadow
              >
                <cylinderGeometry args={[24, 28, 5, 7]} />
              </mesh>

              {/* -------------------------------------------------------
               * ACADEMY MAIN BUILDING
               * ----------------------------------------------------- */}

              {/* Main body */}
              <mesh
                material={creamMaterial}
                position={[0, 86, 0]}
                castShadow
                receiveShadow
              >
                <boxGeometry args={[38, 24, 28]} />
              </mesh>

              {/* Left wing */}
              <mesh
                material={creamMaterial}
                position={[-24, 84, 0]}
                castShadow
              >
                <boxGeometry args={[14, 18, 24]} />
              </mesh>

              {/* Right wing */}
              <mesh
                material={creamMaterial}
                position={[24, 84, 0]}
                castShadow
              >
                <boxGeometry args={[14, 18, 24]} />
              </mesh>

              {/* -------------------------------------------------------
               * ROOFS
               * ----------------------------------------------------- */}

              {/* Main roof */}
              <mesh
                material={navyMaterial}
                position={[0, 104, 0]}
                rotation={[0, Math.PI / 4, 0]}
                scale={[1.12, 1, 0.78]}
                castShadow
              >
                <coneGeometry args={[30, 18, 4]} />
              </mesh>

              {/* Left roof */}
              <mesh
                material={navyMaterial}
                position={[-24, 96, 0]}
                rotation={[0, Math.PI / 4, 0]}
                scale={[0.68, 1, 0.72]}
                castShadow
              >
                <coneGeometry args={[17, 10, 4]} />
              </mesh>

              {/* Right roof */}
              <mesh
                material={navyMaterial}
                position={[24, 96, 0]}
                rotation={[0, Math.PI / 4, 0]}
                scale={[0.68, 1, 0.72]}
                castShadow
              >
                <coneGeometry args={[17, 10, 4]} />
              </mesh>

              {/* -------------------------------------------------------
               * CLOCK TOWER
               * ----------------------------------------------------- */}

              <mesh
                material={creamMaterial}
                position={[0, 112, 0]}
                castShadow
              >
                <boxGeometry args={[12, 28, 12]} />
              </mesh>

              <mesh
                material={navyMaterial}
                position={[0, 130, 0]}
                rotation={[0, Math.PI / 4, 0]}
                castShadow
              >
                <coneGeometry args={[10, 11, 4]} />
              </mesh>

              {/* Clock face */}
              <mesh
                material={whiteMaterial}
                position={[0, 114, 6.15]}
                rotation={[0, 0, 0]}
              >
                <cylinderGeometry args={[4, 4, 0.7, 16]} />
              </mesh>

              {/* Clock hand - minute */}
              <mesh
                material={navyMaterial}
                position={[0, 115.4, 6.65]}
                rotation={[0, 0, -Math.PI / 4]}
              >
                <boxGeometry args={[0.7, 3.2, 0.45]} />
              </mesh>

              {/* Clock hand - hour */}
              <mesh
                material={navyMaterial}
                position={[0.8, 114.6, 6.65]}
                rotation={[0, 0, Math.PI / 2]}
              >
                <boxGeometry args={[0.65, 2.2, 0.45]} />
              </mesh>

              {/* -------------------------------------------------------
               * WINDOWS
               * ----------------------------------------------------- */}

              {[-13, 0, 13].map((x) => (
                <group key={`front-window-${x}`}>
                  {/* Window frame */}
                  <mesh
                    material={navyMaterial}
                    position={[x, 87, 14.25]}
                  >
                    <boxGeometry args={[7, 9, 1]} />
                  </mesh>

                  {/* Warm glass */}
                  <mesh
                    material={windowMaterial}
                    position={[x, 87, 14.8]}
                  >
                    <boxGeometry args={[5.1, 7, 0.6]} />
                  </mesh>

                  {/* Vertical divider */}
                  <mesh
                    material={whiteMaterial}
                    position={[x, 87, 15.15]}
                  >
                    <boxGeometry args={[0.65, 7, 0.35]} />
                  </mesh>

                  {/* Horizontal divider */}
                  <mesh
                    material={whiteMaterial}
                    position={[x, 87, 15.15]}
                  >
                    <boxGeometry args={[5.1, 0.65, 0.35]} />
                  </mesh>
                </group>
              ))}

              {/* Side windows */}
              {[-9, 9].map((z) => (
                <mesh
                  key={`side-window-${z}`}
                  material={windowMaterial}
                  position={[19.25, 87, z]}
                >
                  <boxGeometry args={[0.8, 8, 5]} />
                </mesh>
              ))}

              {/* -------------------------------------------------------
               * FRONT ENTRANCE
               * ----------------------------------------------------- */}

              {/* Entrance frame */}
              <mesh
                material={navyMaterial}
                position={[0, 82, 14.8]}
                castShadow
              >
                <boxGeometry args={[9, 13, 2]} />
              </mesh>

              {/* Door */}
              <mesh
                material={whiteMaterial}
                position={[0, 80.8, 15.8]}
              >
                <boxGeometry args={[5.8, 10.5, 1]} />
              </mesh>

              {/* Door split */}
              <mesh
                material={navyMaterial}
                position={[0, 80.8, 16.4]}
              >
                <boxGeometry args={[0.55, 10.5, 0.45]} />
              </mesh>

              {/* Entrance steps */}
              <mesh
                material={rockMaterial}
                position={[0, 74.5, 17]}
                receiveShadow
              >
                <boxGeometry args={[15, 2, 7]} />
              </mesh>

              <mesh
                material={rockMaterial}
                position={[0, 72.5, 19.5]}
                receiveShadow
              >
                <boxGeometry args={[19, 2, 6]} />
              </mesh>

              <mesh
                material={rockMaterial}
                position={[0, 70.5, 22]}
                receiveShadow
              >
                <boxGeometry args={[23, 2, 6]} />
              </mesh>

              {/* -------------------------------------------------------
               * CLASSIC SCHOOL SIGN
               * ----------------------------------------------------- */}

              <mesh
                material={navyMaterial}
                position={[0, 101, 15.2]}
                rotation={[0, 0, 0]}
                castShadow
              >
                <boxGeometry args={[17, 4, 1.5]} />
              </mesh>

              {/* sign highlight */}
              <mesh
                material={creamMaterial}
                position={[0, 101, 16.1]}
              >
                <boxGeometry args={[13, 1.3, 0.35]} />
              </mesh>

              {/* -------------------------------------------------------
               * FLAG POLE
               * ----------------------------------------------------- */}

              <mesh
                material={whiteMaterial}
                position={[13, 118, -1]}
                castShadow
              >
                <cylinderGeometry args={[0.7, 0.7, 36, 6]} />
              </mesh>

              {/* flag */}
              <mesh
                material={flagMaterial}
                position={[20.2, 127, -1]}
                castShadow
              >
                <boxGeometry args={[13, 8, 1]} />
              </mesh>

              {/* flag tip */}
              <mesh
                material={flagMaterial}
                position={[26.5, 127, -1]}
                rotation={[0, 0, Math.PI / 4]}
              >
                <coneGeometry args={[3.1, 6, 3]} />
              </mesh>

              {/* -------------------------------------------------------
               * LITTLE VINTAGE CHIMNEYS
               * ----------------------------------------------------- */}

              <mesh
                material={rockMaterial}
                position={[-12, 107, -6]}
                castShadow
              >
                <boxGeometry args={[5, 10, 5]} />
              </mesh>

              <mesh
                material={rockMaterial}
                position={[12, 107, -5]}
                castShadow
              >
                <boxGeometry args={[5, 10, 5]} />
              </mesh>

              {/* Chimney caps */}
              <mesh
                material={navyMaterial}
                position={[-12, 112.5, -6]}
              >
                <boxGeometry args={[6, 1.4, 6]} />
              </mesh>

              <mesh
                material={navyMaterial}
                position={[12, 112.5, -5]}
              >
                <boxGeometry args={[6, 1.4, 6]} />
              </mesh>

              {/* -------------------------------------------------------
               * SMALL PATH MARKERS
               * ----------------------------------------------------- */}

              {[-12, -6, 0, 6, 12].map((x) => (
                <mesh
                  key={`path-${x}`}
                  material={whiteMaterial}
                  position={[x, 69, 25]}
                  rotation={[0, 0, 0]}
                  receiveShadow
                >
                  <boxGeometry args={[3.4, 0.7, 2]} />
                </mesh>
              ))}
            </group>
          </Placed>
        );
      })}
    </>
  );
}