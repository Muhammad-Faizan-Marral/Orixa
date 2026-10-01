"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, useGLTF } from "@react-three/drei";
import * as THREE from "three";

import type { ThemeSectionProps } from "../../../types";

/* ============================================================================
   TYPES
============================================================================ */

type Stat = {
  value: string;
  label: string;
};

type PointerState = {
  x: number;
  y: number;
};

/* ============================================================================
   STATS
============================================================================ */

function parseConfigDate(value?: string): Date | null {
  if (!value?.trim()) return null;

  const parts = value.trim().split("-");
  const year = Number.parseInt(parts[0], 10);

  if (Number.isNaN(year)) return null;

  const month = parts[1] ? Number.parseInt(parts[1], 10) - 1 : 0;

  const date = new Date(year, month, 1);

  return Number.isNaN(date.getTime()) ? null : date;
}

function calculateExperienceStat(
  experience?: Array<{
    startDate?: string;
    [key: string]: unknown;
  }>,
): Stat | null {
  if (!experience?.length) return null;

  const dates = experience
    .map((item) => parseConfigDate(item.startDate))
    .filter((date): date is Date => date !== null);

  if (!dates.length) return null;

  const oldest = dates.reduce((a, b) => (a < b ? a : b));
  const now = new Date();

  const months =
    (now.getFullYear() - oldest.getFullYear()) * 12 +
    (now.getMonth() - oldest.getMonth());

  if (months <= 0) return null;

  if (months < 12) {
    return {
      value: String(months),
      label: "Months Exp.",
    };
  }

  return {
    value: `${Math.floor(months / 12)}+`,
    label: "Years Exp.",
  };
}

function calculateProjectsStat(
  projects?: Array<{
    id?: string;
    [key: string]: unknown;
  }>,
): Stat | null {
  if (!projects?.length) return null;

  return {
    value: `${projects.length}+`,
    label: "Projects",
  };
}

/* ============================================================================
   THEME / COLOR HELPERS
============================================================================ */

/**
 * Reads --pr-accent safely.
 *
 * The old implementation passed the CSS variable directly into THREE.Color.
 * Depending on how the theme token is generated, that value can be something
 * like:
 *
 *   hsl(...)
 *   rgb(...)
 *   var(...)
 *   hex
 *
 * We first let the browser resolve the CSS value and then give THREE a
 * browser-resolved rgb() value.
 */
function getThemeAccentColor(): THREE.Color {
  if (typeof window === "undefined") {
    return new THREE.Color("#f97316");
  }

  const root = document.documentElement;
  const raw = getComputedStyle(root).getPropertyValue("--pr-accent").trim();

  if (!raw) {
    return new THREE.Color("#f5f1eb");
  }

  const probe = document.createElement("span");

  probe.style.position = "absolute";
  probe.style.width = "0";
  probe.style.height = "0";
  probe.style.pointerEvents = "none";
  probe.style.color = raw;

  document.body.appendChild(probe);

  const resolved = getComputedStyle(probe).color;

  probe.remove();

  try {
    return new THREE.Color(resolved);
  } catch {
    try {
      return new THREE.Color(raw);
    } catch {
      return new THREE.Color("#f5f1eb");
    }
  }
}

/**
 * Parts that should retain their original material.
 *
 * We do not want the user's accent color turning the face, hair, eyes,
 * skin, etc. into the theme accent.
 */
function isNaturalPart(name: string): boolean {
  const value = name.toLowerCase();

  return (
    value.includes("skin") ||
    value.includes("face") ||
    value.includes("body") ||
    value.includes("hand") ||
    value.includes("arm") ||
    value.includes("leg") ||
    value.includes("hair") ||
    value.includes("eye") ||
    value.includes("brow") ||
    value.includes("lash") ||
    value.includes("mouth") ||
    value.includes("lip") ||
    value.includes("tooth") ||
    value.includes("teeth") ||
    value.includes("nose") ||
    value.includes("ear") ||
    value.includes("neck") ||
    value.includes("head")
  );
}

/**
 * Parts that should strongly receive the portfolio accent.
 */
function isAccentPart(name: string): boolean {
  const value = name.toLowerCase();

  return (
    value.includes("jacket") ||
    value.includes("coat") ||
    value.includes("hoodie") ||
    value.includes("shirt") ||
    value.includes("cloth") ||
    value.includes("outfit") ||
    value.includes("wear") ||
    value.includes("dress") ||
    value.includes("pant") ||
    value.includes("shoe") ||
    value.includes("boot") ||
    value.includes("glove") ||
    value.includes("hat") ||
    value.includes("cap") ||
    value.includes("bag") ||
    value.includes("backpack") ||
    value.includes("headphone") ||
    value.includes("earphone") ||
    value.includes("headset") ||
    value.includes("accessory") ||
    value.includes("accessories") ||
    value.includes("band") ||
    value.includes("strap") ||
    value.includes("belt") ||
    value.includes("mask") ||
    value.includes("scarf")
  );
}

/* ============================================================================
   MATERIAL HELPERS
============================================================================ */

/**
 * GLTF files can contain different material types.
 *
 * The old implementation only modified MeshStandardMaterial.
 * This version handles every common Three.js material that exposes a color.
 */
function supportsColor(material: THREE.Material): material is THREE.Material & {
  color: THREE.Color;
} {
  return "color" in material && material.color instanceof THREE.Color;
}

function supportsEmissive(
  material: THREE.Material,
): material is THREE.Material & {
  emissive: THREE.Color;
  emissiveIntensity: number;
} {
  return "emissive" in material && material.emissive instanceof THREE.Color;
}

function improveMaterialQuality(material: THREE.Material) {
  if ("envMapIntensity" in material) {
    (
      material as THREE.Material & {
        envMapIntensity: number;
      }
    ).envMapIntensity = 1.35;
  }

  if ("roughness" in material) {
    const roughnessMaterial = material as THREE.Material & {
      roughness: number;
    };

    roughnessMaterial.roughness = Math.min(
      roughnessMaterial.roughness || 0.55,
      0.48,
    );
  }

  if ("metalness" in material) {
    const metalnessMaterial = material as THREE.Material & {
      metalness: number;
    };

    metalnessMaterial.metalness = Math.max(
      metalnessMaterial.metalness || 0.05,
      0.05,
    );
  }

  material.needsUpdate = true;
}

/**
 * Clone the material before changing it.
 *
 * This is important because useGLTF caches the loaded scene.
 * Mutating a shared cached material can create hard-to-debug visual
 * side effects when the model is rendered again.
 */
function cloneMaterial(material: THREE.Material): THREE.Material {
  return material.clone();
}

/* ============================================================================
   3D MODEL
============================================================================ */

function AnimeModel({
  pointer,
}: {
  pointer: React.MutableRefObject<PointerState>;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const { scene } = useGLTF("/models/Anime3d.glb");

  const accentMaterialsRef = useRef<THREE.Material[]>([]);
  const fallbackMaterialsRef = useRef<THREE.Material[]>([]);

  /**
   * Apply portfolio accent to model materials.
   */
  const applyAccent = useCallback(() => {
    const accent = getThemeAccentColor();

    accentMaterialsRef.current.forEach((material) => {
      if (supportsColor(material)) {
        material.color.copy(accent);
      }

      if (supportsEmissive(material)) {
        material.emissive.copy(accent);
        material.emissiveIntensity = 0.08;
      }

      material.needsUpdate = true;
    });

    fallbackMaterialsRef.current.forEach((material) => {
      if (!supportsColor(material)) return;

      /**
       * Fallback materials use a controlled tint instead of replacing
       * their entire original color.
       *
       * This keeps the model visually rich when a GLB does not have
       * semantic mesh names such as "jacket" or "headphone".
       */
      const original =
        material.userData.__orixaOriginalColor instanceof THREE.Color
          ? material.userData.__orixaOriginalColor
          : material.color.clone();

      material.color.copy(original).lerp(accent, 0.42);

      material.needsUpdate = true;
    });
  }, []);

  /**
   * Prepare the GLTF materials once.
   */
  useEffect(() => {
    accentMaterialsRef.current = [];
    fallbackMaterialsRef.current = [];

    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      const meshName = object.name || "";

      const preparedMaterials = materials.map((sourceMaterial) => {
        const material = cloneMaterial(sourceMaterial);

        improveMaterialQuality(material);

        const materialName = material.name || "";

        const fullName = `${meshName} ${materialName}`.toLowerCase();

        /**
         * Save original color so fallback tinting can be recalculated
         * whenever the theme accent changes.
         */
        if (supportsColor(material)) {
          material.userData.__orixaOriginalColor = material.color.clone();
        }

        if (isNaturalPart(fullName)) {
          return material;
        }

        if (isAccentPart(fullName)) {
          accentMaterialsRef.current.push(material);
        } else {
          fallbackMaterialsRef.current.push(material);
        }

        return material;
      });

      object.material = Array.isArray(object.material)
        ? preparedMaterials
        : preparedMaterials[0];
    });

    /**
     * First accent application.
     */
    applyAccent();

    return () => {
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;

        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];

        materials.forEach((material) => {
          material.dispose();
        });
      });
    };
  }, [scene, applyAccent]);

  /**
   * Keep model accent synchronized with theme changes.
   *
   * DesignEngine can update CSS variables without remounting this component.
   */
  useEffect(() => {
    if (typeof document === "undefined") return;

    const observer = new MutationObserver(() => {
      applyAccent();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    return () => observer.disconnect();
  }, [applyAccent]);

  /**
   * Smooth mouse parallax.
   *
   * Pointer values are kept in a ref instead of React state so every mouse
   * movement does not trigger a React render.
   */
  useFrame(() => {
    if (!groupRef.current) return;

    const targetRotationY = pointer.current.x * 0.11;
    const targetRotationX = -pointer.current.y * 0.055;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotationY,
      0.045,
    );

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotationX,
      0.045,
    );
  });

  return (
    <Float speed={0.75} rotationIntensity={0.025} floatIntensity={0.06}>
      <group ref={groupRef} position={[0.18, -1.08, 0]} scale={1.92}>
        <primitive object={scene} />
      </group>
    </Float>
  );
}

/* ============================================================================
   3D SCENE
============================================================================ */

function HeroScene({
  pointer,
}: {
  pointer: React.MutableRefObject<PointerState>;
}) {
  return (
    <>
      {/* Primary studio light */}
      <directionalLight
        position={[1.5, 7, 5]}
        intensity={2.45}
        color="#fff8f0"
      />

      {/* Rim light */}
      <directionalLight
        position={[6, 2.5, -5]}
        intensity={1.65}
        color="#fff0dd"
      />

      {/* Cool fill */}
      <directionalLight
        position={[-5, 2, 3]}
        intensity={0.42}
        color="#dde8ff"
      />

      {/* Ambient */}
      <ambientLight intensity={0.3} color="#ffe8d8" />

      {/* Lower bounce */}
      <pointLight position={[0, -1.2, 2.5]} intensity={0.5} color="#ffd0a0" />

      {/* Soft frontal light */}
      <spotLight
        position={[0, 4, 5.5]}
        angle={0.38}
        penumbra={0.85}
        intensity={0.58}
        color="#fff5e8"
        decay={2}
      />

      <Suspense fallback={null}>
        <AnimeModel pointer={pointer} />
      </Suspense>

      <ContactShadows
        position={[0, -1.28, 0]}
        opacity={0.55}
        scale={14}
        blur={4}
        far={5}
        color="#160500"
      />
    </>
  );
}

/* ============================================================================
   GRAIN
============================================================================ */

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`;

/* ============================================================================
   HERO
============================================================================ */

export function HeroDefault({ config, profile }: ThemeSectionProps) {
  const displayName =
    config.name || profile.fullName || profile.username || "Portfolio";

  const headline = config.headline?.trim();

  const containerRef = useRef<HTMLElement>(null);
  const nameWrapRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);

  const pointerRef = useRef<PointerState>({
    x: 0,
    y: 0,
  });

  const [isReady, setIsReady] = useState(false);

  /* --------------------------------------------------------------------------
     NAME FITTING
  -------------------------------------------------------------------------- */

  const fitName = useCallback(() => {
    const nameElement = nameRef.current;
    const wrapper = nameWrapRef.current;

    if (!nameElement || !wrapper) return;

    /**
     * Start from a predictable measurement size.
     */
    nameElement.style.fontSize = "400px";

    const availableWidth = wrapper.offsetWidth * 0.975;
    const actualWidth = nameElement.scrollWidth || 1;

    const ratio = availableWidth / actualWidth;

    const calculatedSize = Math.max(30, Math.floor(400 * ratio));

    nameElement.style.fontSize = `${calculatedSize}px`;

    setIsReady(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const safeFit = () => {
      if (cancelled) return;

      requestAnimationFrame(() => {
        if (!cancelled) {
          fitName();
        }
      });
    };

    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(safeFit);
    } else {
      window.setTimeout(safeFit, 150);
    }

    const resizeObserver = new ResizeObserver(safeFit);

    if (nameWrapRef.current) {
      resizeObserver.observe(nameWrapRef.current);
    }

    window.addEventListener("resize", safeFit);

    return () => {
      cancelled = true;
      resizeObserver.disconnect();
      window.removeEventListener("resize", safeFit);
    };
  }, [fitName]);

  /* --------------------------------------------------------------------------
     POINTER PARALLAX
  -------------------------------------------------------------------------- */

  useEffect(() => {
    const element = containerRef.current;

    if (!element) return;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();

      if (!rect.width || !rect.height) return;

      pointerRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;

      pointerRef.current.y = -(
        ((event.clientY - rect.top) / rect.height) * 2 -
        1
      );
    };

    const resetPointer = () => {
      pointerRef.current.x = 0;
      pointerRef.current.y = 0;
    };

    element.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    element.addEventListener("pointerleave", resetPointer, { passive: true });

    return () => {
      element.removeEventListener("pointermove", handlePointerMove);

      element.removeEventListener("pointerleave", resetPointer);
    };
  }, []);

  /* --------------------------------------------------------------------------
     STATS
  -------------------------------------------------------------------------- */

  const experienceStat = calculateExperienceStat(config.experience);

  const projectsStat = calculateProjectsStat(config.projects);

  const stats = [experienceStat, projectsStat].filter(Boolean) as Stat[];

  /* --------------------------------------------------------------------------
     CONTACT
  -------------------------------------------------------------------------- */

  const contactHref =
    config.linkedinUrl ||
    config.githubUrl ||
    (config.phone ? `tel:${config.phone}` : null);

  /* --------------------------------------------------------------------------
     RENDER
  -------------------------------------------------------------------------- */

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{
        height: "min(100svh, 900px)",
        minHeight: "640px",
        background: "var(--pr-accent, #f97316)",
      }}
    >
      {/* ======================================================================
          ATMOSPHERIC DEPTH
      ====================================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, transparent 30%, rgba(0,0,0,0.18) 100%)",
        }}
      />

      {/* ======================================================================
          GIANT NAME / TYPOGRAPHY
      ====================================================================== */}

      <div
        ref={nameWrapRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center overflow-hidden"
        style={{
          paddingInline: "0.5%",
        }}
      >
        <h1
          ref={nameRef}
          className="select-none whitespace-nowrap"
          style={{
            fontFamily:
              "var(--theme-font-display, var(--pr-font-display, sans-serif))",
            fontWeight: 800,
            lineHeight: 0.87,
            letterSpacing: "-0.055em",
            color: "rgba(255,255,255,0.94)",
            opacity: isReady ? 0.94 : 0.88,
            fontSize: "clamp(3rem, 16vw, 16rem)",
            transition: "opacity 300ms ease",
          }}
        >
          {displayName}
        </h1>
      </div>

      {/* ======================================================================
          3D MODEL
      ====================================================================== */}

      <div className="absolute inset-0 z-[5]">
        <Canvas
          camera={{
            position: [0, 0.22, 3.15],
            fov: 31,
          }}
          dpr={[1, 1.75]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.08,
          }}
          style={{
            background: "transparent",
          }}
        >
          <HeroScene pointer={pointerRef} />
        </Canvas>
      </div>

      {/* ======================================================================
          FOREGROUND UI
      ====================================================================== */}

      <div
        className="pointer-events-none absolute inset-0 z-[10] flex flex-col justify-between"
        style={{
          padding: "clamp(1.25rem, 2.8vw, 2rem) clamp(1.25rem, 3.5vw, 2.5rem)",
        }}
      >
        {/* --------------------------------------------------------------------
            TOP
        -------------------------------------------------------------------- */}

        <div className="flex items-start justify-between gap-4">
          {/* Portfolio label */}

          <div
            className="flex items-center gap-2.5"
            style={{
              fontFamily: "var(--theme-font-sans, Inter, sans-serif)",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.48)",
            }}
          >
            <span
              aria-hidden="true"
              className="inline-block shrink-0"
              style={{
                width: 22,
                height: 1,
                background: "rgba(255,255,255,0.32)",
              }}
            />
            Portfolio
          </div>

          {/* Resume */}

          {config.resumeUrl && (
            <a
              href={config.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto inline-flex items-center gap-1.5"
              style={{
                padding: "7px 16px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.26)",
                background: "rgba(255,255,255,0.10)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                fontFamily: "var(--theme-font-sans, Inter, sans-serif)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.9)",
                textDecoration: "none",
                transition:
                  "background 180ms ease, border-color 180ms ease, transform 180ms ease",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.background = "rgba(255,255,255,0.18)";

                event.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";

                event.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.background = "rgba(255,255,255,0.10)";

                event.currentTarget.style.borderColor =
                  "rgba(255,255,255,0.26)";

                event.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Résumé <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>

        {/* --------------------------------------------------------------------
            BOTTOM
        -------------------------------------------------------------------- */}

        <div
          className="flex items-end justify-between gap-6"
          style={{
            flexWrap: "wrap",
          }}
        >
          {/* Headline */}

          {headline && (
            <div
              style={{
                maxWidth: "clamp(220px, 42vw, 480px)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontFamily:
                    "var(--theme-font-display, var(--pr-font-display, sans-serif))",
                  fontWeight: 700,
                  fontSize: "clamp(1.3rem, 2.4vw, 2.45rem)",
                  lineHeight: 1.13,
                  letterSpacing: "-0.025em",
                  color: "rgba(255,255,255,0.97)",
                }}
              >
                {headline}
              </p>

              <div
                aria-hidden="true"
                style={{
                  marginTop: 12,
                  width: 30,
                  height: 2,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.4)",
                }}
              />
            </div>
          )}

          {/* Stats */}

          {stats.length > 0 && (
            <div
              className="flex items-end"
              style={{
                gap: "clamp(1.5rem, 4vw, 3.5rem)",
                flexShrink: 0,
              }}
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div
                    style={{
                      fontFamily:
                        "var(--theme-font-display, var(--pr-font-display, sans-serif))",
                      fontWeight: 800,
                      fontSize: "clamp(1.8rem, 3.2vw, 3.2rem)",
                      lineHeight: 1,
                      letterSpacing: "-0.045em",
                      color: "#ffffff",
                    }}
                  >
                    {stat.value}
                  </div>

                  <div
                    style={{
                      marginTop: 5,
                      fontFamily: "var(--theme-font-sans, Inter, sans-serif)",
                      fontSize: 9,
                      fontWeight: 600,
                      letterSpacing: "0.26em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.48)",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ======================================================================
          CONTACT BADGE
      ====================================================================== */}

      {contactHref && (
        <a
          href={contactHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Get in touch"
          className="pointer-events-auto absolute right-[clamp(1.25rem,3.5vw,2.75rem)] top-1/2 z-[15] hidden -translate-y-1/2 flex-col items-center justify-center sm:flex"
          style={{
            width: 68,
            height: 68,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.24)",
            background: "rgba(255,255,255,0.10)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            textDecoration: "none",
            gap: 2,
            transition: "transform 220ms ease, background 220ms ease",
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.transform =
              "translateY(-50%) scale(1.08)";

            event.currentTarget.style.background = "rgba(255,255,255,0.18)";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.transform = "translateY(-50%) scale(1)";

            event.currentTarget.style.background = "rgba(255,255,255,0.10)";
          }}
        >
          <span
            style={{
              fontFamily: "var(--theme-font-sans, Inter, sans-serif)",
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.9)",
              textAlign: "center",
              lineHeight: 1.3,
            }}
          >
            Let&apos;s
            <br />
            Talk
          </span>

          <span
            aria-hidden="true"
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.62)",
              marginTop: 2,
            }}
          >
            ↗
          </span>
        </a>
      )}

      {/* ======================================================================
          MOBILE CONTACT
      ====================================================================== */}

      {contactHref && (
        <a
          href={contactHref}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto absolute bottom-5 right-5 z-[15] flex items-center gap-2 rounded-full sm:hidden"
          style={{
            padding: "8px 13px",
            border: "1px solid rgba(255,255,255,0.24)",
            background: "rgba(255,255,255,0.10)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            fontFamily: "var(--theme-font-sans, Inter, sans-serif)",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.9)",
            textDecoration: "none",
          }}
        >
          Let&apos;s Talk
          <span aria-hidden="true">↗</span>
        </a>
      )}

      {/* ======================================================================
          FILM GRAIN
      ====================================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[20] mix-blend-overlay"
        style={{
          backgroundImage: GRAIN,
          opacity: 0.025,
        }}
      />
    </section>
  );
}

/* ============================================================================
   GLTF PRELOAD
============================================================================ */

useGLTF.preload("/models/Anime3d.glb");
