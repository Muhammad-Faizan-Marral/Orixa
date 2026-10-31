"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, useGLTF } from "@react-three/drei";
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

type InvalidateRef = React.MutableRefObject<(() => void) | null>;

/* ============================================================================
   CONSTANTS
============================================================================ */

/** Below this width (px) the hero switches to its phone layout (Tailwind `sm`). */
const NARROW_BREAKPOINT = 640;

const MODEL_URL = "/models/Anime3d.glb";

const DISPLAY_FONT =
  "var(--theme-font-display, var(--pr-font-display, sans-serif))";
const SANS_FONT = "var(--theme-font-sans, Inter, sans-serif)";

/** Parallax damping (≈ the old 0.045 per-frame lerp at 60fps, but FPS independent). */
const DAMP_LAMBDA = 2.8;
const SETTLE_EPSILON = 0.0005;

/* Hoisted static styles: no new objects on every render. */

const SECTION_STYLE: React.CSSProperties = {
  height: "min(100svh, 900px)",
  minHeight: "640px",
  background: "var(--pr-accent, #f97316)",
  contain: "layout paint",
};

const VIGNETTE_STYLE: React.CSSProperties = {
  background:
    "radial-gradient(ellipse 90% 80% at 50% 45%, transparent 30%, rgba(0,0,0,0.18) 100%)",
};

const NAME_WRAP_STYLE: React.CSSProperties = { paddingInline: "0.5%" };

const CANVAS_STYLE: React.CSSProperties = {
  background: "transparent",
  touchAction: "pan-y",
};

const FOREGROUND_STYLE: React.CSSProperties = {
  padding: "clamp(1.25rem, 2.8vw, 2rem) clamp(1.25rem, 3.5vw, 2.5rem)",
};

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: SANS_FONT,
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: "0.32em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.48)",
};

const LABEL_LINE_STYLE: React.CSSProperties = {
  width: 22,
  height: 1,
  background: "rgba(255,255,255,0.32)",
};

const RESUME_STYLE: React.CSSProperties = {
  padding: "7px 16px",
  fontFamily: SANS_FONT,
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.9)",
  textDecoration: "none",
};

const HEADLINE_WRAP_STYLE: React.CSSProperties = {
  maxWidth: "clamp(220px, 42vw, 480px)",
};

const HEADLINE_STYLE: React.CSSProperties = {
  margin: 0,
  fontFamily: DISPLAY_FONT,
  fontWeight: 700,
  fontSize: "clamp(1.3rem, 2.4vw, 2.45rem)",
  lineHeight: 1.13,
  letterSpacing: "-0.025em",
  color: "rgba(255,255,255,0.97)",
};

const HEADLINE_RULE_STYLE: React.CSSProperties = {
  marginTop: 12,
  width: 30,
  height: 2,
  borderRadius: 999,
  background: "rgba(255,255,255,0.4)",
};

const STATS_WRAP_STYLE: React.CSSProperties = {
  gap: "clamp(1.5rem, 4vw, 3.5rem)",
  flexShrink: 0,
};

const STAT_VALUE_STYLE: React.CSSProperties = {
  fontFamily: DISPLAY_FONT,
  fontWeight: 800,
  fontSize: "clamp(1.8rem, 3.2vw, 3.2rem)",
  lineHeight: 1,
  letterSpacing: "-0.045em",
  color: "#ffffff",
};

const STAT_LABEL_STYLE: React.CSSProperties = {
  marginTop: 5,
  fontFamily: SANS_FONT,
  fontSize: 9,
  fontWeight: 600,
  letterSpacing: "0.26em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.48)",
};

const MOBILE_CONTACT_STYLE: React.CSSProperties = {
  padding: "8px 13px",
  fontFamily: SANS_FONT,
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.9)",
  textDecoration: "none",
};

const BADGE_STYLE: React.CSSProperties = {
  width: 68,
  height: 68,
  textDecoration: "none",
  gap: 2,
};

const BADGE_TEXT_STYLE: React.CSSProperties = {
  fontFamily: SANS_FONT,
  fontSize: 8,
  fontWeight: 700,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.9)",
  textAlign: "center",
  lineHeight: 1.3,
};

const BADGE_ARROW_STYLE: React.CSSProperties = {
  fontSize: 11,
  color: "rgba(255,255,255,0.62)",
  marginTop: 2,
};

/** Shared glass look. Blur is 8px (cheaper than 12px, visually the same). */
const GLASS_CLASS =
  "border border-white/25 bg-white/10 backdrop-blur-[8px] transition-[background-color,border-color,transform] duration-200 hover:bg-white/[0.18] hover:border-white/40";

/* ============================================================================
   PERFORMANCE HOOKS
============================================================================ */

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);

    update();
    mq.addEventListener("change", update);

    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

/** Pause 3D when the hero is off-screen. */
function useInView(
  ref: React.RefObject<HTMLElement | null>,
  rootMargin = "100px",
) {
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;

    if (!el || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin, threshold: 0 },
    );

    io.observe(el);

    return () => io.disconnect();
  }, [ref, rootMargin]);

  return inView;
}

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
  experience?: Array<{ startDate?: string; [key: string]: unknown }>,
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
    return { value: String(months), label: "Months Exp." };
  }

  return { value: `${Math.floor(months / 12)}+`, label: "Years Exp." };
}

function calculateProjectsStat(
  projects?: Array<{ id?: string; [key: string]: unknown }>,
): Stat | null {
  if (!projects?.length) return null;

  return { value: `${projects.length}+`, label: "Projects" };
}

/* ============================================================================
   THEME / COLOR HELPERS
============================================================================ */

/**
 * Resolves --pr-accent through the browser (handles hsl/rgb/var/hex) and
 * returns the raw token too, so callers can skip work when it hasn't changed.
 */
function readThemeAccent(): { raw: string; color: THREE.Color } {
  if (typeof window === "undefined") {
    return { raw: "", color: new THREE.Color("#f97316") };
  }

  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--pr-accent")
    .trim();

  if (!raw) {
    return { raw, color: new THREE.Color("#f5f1eb") };
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
    return { raw, color: new THREE.Color(resolved) };
  } catch {
    try {
      return { raw, color: new THREE.Color(raw) };
    } catch {
      return { raw, color: new THREE.Color("#f5f1eb") };
    }
  }
}

/** Parts that keep their original material (skin, face, hair, ...). */
const NATURAL_KEYWORDS = [
  "skin",
  "face",
  "body",
  "hand",
  "arm",
  "leg",
  "hair",
  "eye",
  "brow",
  "lash",
  "mouth",
  "lip",
  "tooth",
  "teeth",
  "nose",
  "ear",
  "neck",
  "head",
];

/** Parts that strongly receive the portfolio accent. */
const ACCENT_KEYWORDS = [
  "jacket",
  "coat",
  "hoodie",
  "shirt",
  "cloth",
  "outfit",
  "wear",
  "dress",
  "pant",
  "shoe",
  "boot",
  "glove",
  "hat",
  "cap",
  "bag",
  "backpack",
  "headphone",
  "earphone",
  "headset",
  "accessory",
  "accessories",
  "band",
  "strap",
  "belt",
  "mask",
  "scarf",
];

const matchesAny = (value: string, keywords: string[]) =>
  keywords.some((keyword) => value.includes(keyword));

/* ============================================================================
   MATERIAL HELPERS
============================================================================ */

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
    (material as THREE.Material & { envMapIntensity: number }).envMapIntensity =
      1.35;
  }

  if ("roughness" in material) {
    const m = material as THREE.Material & { roughness: number };
    m.roughness = Math.min(m.roughness || 0.55, 0.48);
  }

  if ("metalness" in material) {
    const m = material as THREE.Material & { metalness: number };
    m.metalness = Math.max(m.metalness || 0.05, 0.05);
  }
}

/* ============================================================================
   3D MODEL
============================================================================ */

function AnimeModel({
  pointer,
  reducedMotion,
}: {
  pointer: React.MutableRefObject<PointerState>;
  reducedMotion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const { scene } = useGLTF(MODEL_URL);

  const isNarrow = useThree((state) => state.size.width < NARROW_BREAKPOINT);
  const invalidate = useThree((state) => state.invalidate);

  const accentMaterialsRef = useRef<THREE.Material[]>([]);
  const fallbackMaterialsRef = useRef<THREE.Material[]>([]);
  const appliedAccentKeyRef = useRef<string | null>(null);

  /**
   * Apply the portfolio accent. Skips all work when the CSS token didn't
   * change (the MutationObserver fires on any style/class mutation).
   */
  const applyAccent = useCallback(
    (force = false) => {
      const { raw, color: accent } = readThemeAccent();

      if (!force && raw === appliedAccentKeyRef.current) return;

      appliedAccentKeyRef.current = raw;

      accentMaterialsRef.current.forEach((material) => {
        if (supportsColor(material)) {
          material.color.copy(accent);
        }

        if (supportsEmissive(material)) {
          material.emissive.copy(accent);
          material.emissiveIntensity = 0.08;
        }
      });

      fallbackMaterialsRef.current.forEach((material) => {
        if (!supportsColor(material)) return;

        const original =
          material.userData.__orixaOriginalColor instanceof THREE.Color
            ? material.userData.__orixaOriginalColor
            : material.color.clone();

        material.color.copy(original).lerp(accent, 0.42);
      });

      /* demand frameloop: redraw once with the new colors */
      invalidate();
    },
    [invalidate],
  );

  /** Prepare GLTF materials once (clone, never mutate the cached originals). */
  useEffect(() => {
    accentMaterialsRef.current = [];
    fallbackMaterialsRef.current = [];

    const originals = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>();
    const clones: THREE.Material[] = [];

    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      originals.set(object, object.material);

      const sources: THREE.Material[] = Array.isArray(object.material)
        ? object.material
        : [object.material];

      const meshName = object.name || "";

      const prepared = sources.map((source) => {
        const material = source.clone();

        clones.push(material);
        improveMaterialQuality(material);

        const fullName = `${meshName} ${material.name || ""}`.toLowerCase();

        if (supportsColor(material)) {
          material.userData.__orixaOriginalColor = material.color.clone();
        }

        if (matchesAny(fullName, NATURAL_KEYWORDS)) return material;

        if (matchesAny(fullName, ACCENT_KEYWORDS)) {
          accentMaterialsRef.current.push(material);
        } else {
          fallbackMaterialsRef.current.push(material);
        }

        return material;
      });

      object.material = Array.isArray(object.material) ? prepared : prepared[0];
    });

    applyAccent(true);

    return () => {
      /* restore the cached originals, then free only our clones */
      originals.forEach((material, mesh) => {
        mesh.material = material;
      });

      clones.forEach((material) => material.dispose());
    };
  }, [scene, applyAccent]);

  /** Keep the accent in sync when DesignEngine changes CSS variables. */
  useEffect(() => {
    const observer = new MutationObserver(() => applyAccent());

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    return () => observer.disconnect();
  }, [applyAccent]);

  /**
   * Parallax. With frameloop="demand" this only runs when something
   * invalidated. We keep requesting frames ONLY until the rotation has
   * settled on its target, then the GPU goes completely idle.
   */
  useFrame((state, delta) => {
    const group = groupRef.current;

    if (!group || reducedMotion) return;

    const targetY = pointer.current.x * 0.11;
    const targetX = -pointer.current.y * 0.055;
    const dt = Math.min(delta, 0.05);

    group.rotation.y = THREE.MathUtils.damp(
      group.rotation.y,
      targetY,
      DAMP_LAMBDA,
      dt,
    );
    group.rotation.x = THREE.MathUtils.damp(
      group.rotation.x,
      targetX,
      DAMP_LAMBDA,
      dt,
    );

    const settled =
      Math.abs(targetY - group.rotation.y) < SETTLE_EPSILON &&
      Math.abs(targetX - group.rotation.x) < SETTLE_EPSILON;

    if (!settled) state.invalidate();
  });

  return (
    <group
      ref={groupRef}
      position={[isNarrow ? 0 : 0.18, -1.08, 0]}
      scale={1.92}
    >
      <primitive object={scene} />
    </group>
  );
}

/* ============================================================================
   CAMERA (RESPONSIVE FRAMING)
============================================================================ */

function CameraRig() {
  const camera = useThree((state) => state.camera);
  const width = useThree((state) => state.size.width);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    const narrow = width < NARROW_BREAKPOINT;
    const perspective = camera as THREE.PerspectiveCamera;

    perspective.fov = narrow ? 36 : 31;
    perspective.position.set(0, narrow ? 0.18 : 0.22, narrow ? 3.5 : 3.15);
    perspective.updateProjectionMatrix();

    invalidate();
  }, [camera, width, invalidate]);

  return null;
}

/** Draws one frame when the canvas becomes active again (off-screen -> visible). */
function FrameSync({ active }: { active: boolean }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (active) invalidate();
  }, [active, invalidate]);

  return null;
}

/* ============================================================================
   3D SCENE
============================================================================ */

function HeroScene({
  pointer,
  active,
  reducedMotion,
}: {
  pointer: React.MutableRefObject<PointerState>;
  active: boolean;
  reducedMotion: boolean;
}) {
  const isNarrow = useThree((state) => state.size.width < NARROW_BREAKPOINT);

  return (
    <>
      <CameraRig />
      <FrameSync active={active} />

      {/* 3 lights instead of 6 */}
      <directionalLight position={[1.5, 7, 5]} intensity={2.2} color="#fff8f0" />
      <directionalLight position={[6, 2.5, -5]} intensity={1.2} color="#fff0dd" />
      <ambientLight intensity={0.35} color="#ffe8d8" />

      <Suspense fallback={null}>
        <AnimeModel pointer={pointer} reducedMotion={reducedMotion} />

        {/*
          Mounted in the same Suspense boundary as the model, so the single
          baked frame (frames={1}) actually contains the model. Skipped on phones.
        */}
        {!isNarrow && (
          <ContactShadows
            position={[0, -1.28, 0]}
            opacity={0.45}
            scale={10}
            blur={1.5}
            far={4}
            resolution={256}
            color="#160500"
            frames={1}
          />
        )}
      </Suspense>
    </>
  );
}

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
  const fitRafRef = useRef(0);

  const pointerRef = useRef<PointerState>({ x: 0, y: 0 });
  const invalidateRef: InvalidateRef = useRef(null);

  const [isReady, setIsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const reducedMotion = usePrefersReducedMotion();
  const heroInView = useInView(containerRef);

  /* ---------------------------- viewport ---------------------------- */

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${NARROW_BREAKPOINT - 1}px)`);
    const update = () => setIsMobile(query.matches);

    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  /* --------------------------- name layout -------------------------- */

  const nameWords = useMemo(
    () => displayName.trim().split(/\s+/).filter(Boolean),
    [displayName],
  );

  const stackName = isMobile && nameWords.length > 1;
  const lineCount = stackName ? nameWords.length : 1;

  const fitName = useCallback(() => {
    const nameElement = nameRef.current;
    const wrapper = nameWrapRef.current;

    if (!nameElement || !wrapper) return;

    /* one write, then all reads, then one write: minimal layout thrash */
    nameElement.style.fontSize = "400px";

    const availableWidth = wrapper.offsetWidth * 0.975;
    const availableHeight = wrapper.offsetHeight;
    const actualWidth = nameElement.scrollWidth || 1;

    const sizeByWidth = Math.floor(400 * (availableWidth / actualWidth));
    const sizeByHeight = Math.floor(
      (availableHeight * 0.6) / (0.87 * lineCount),
    );

    nameElement.style.fontSize = `${Math.max(
      30,
      Math.min(sizeByWidth, sizeByHeight),
    )}px`;

    setIsReady(true);
  }, [lineCount]);

  useEffect(() => {
    let cancelled = false;

    /* coalesce bursts of resize/font events into one fit per frame */
    const scheduleFit = () => {
      if (cancelled) return;

      cancelAnimationFrame(fitRafRef.current);
      fitRafRef.current = requestAnimationFrame(() => {
        if (!cancelled) fitName();
      });
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(scheduleFit);
    } else {
      scheduleFit();
    }

    /* ResizeObserver already covers window resizes (wrapper is inset-0) */
    const resizeObserver = new ResizeObserver(scheduleFit);

    if (nameWrapRef.current) {
      resizeObserver.observe(nameWrapRef.current);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(fitRafRef.current);
      resizeObserver.disconnect();
    };
  }, [fitName]);

  /* ------------------------- pointer parallax ----------------------- */

  useEffect(() => {
    const element = containerRef.current;

    if (!element || reducedMotion) return;

    /* cache the rect: no forced layout on every pointermove */
    let rect = element.getBoundingClientRect();

    const refreshRect = () => {
      rect = element.getBoundingClientRect();
    };

    const handlePointerMove = (event: PointerEvent) => {
      /* touch has no hover parallax and would only waste frames */
      if (event.pointerType === "touch") return;
      if (!rect.width || !rect.height) return;

      pointerRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerRef.current.y = -(
        ((event.clientY - rect.top) / rect.height) * 2 -
        1
      );

      /* demand frameloop: wake the canvas (r3f coalesces to 1 frame / rAF) */
      invalidateRef.current?.();
    };

    const resetPointer = () => {
      pointerRef.current.x = 0;
      pointerRef.current.y = 0;
      invalidateRef.current?.();
    };

    element.addEventListener("pointerenter", refreshRect, { passive: true });
    element.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    element.addEventListener("pointerleave", resetPointer, { passive: true });
    window.addEventListener("resize", refreshRect, { passive: true });

    return () => {
      element.removeEventListener("pointerenter", refreshRect);
      element.removeEventListener("pointermove", handlePointerMove);
      element.removeEventListener("pointerleave", resetPointer);
      window.removeEventListener("resize", refreshRect);
    };
  }, [reducedMotion]);

  /* ------------------------------ stats ----------------------------- */

  const stats = useMemo(
    () =>
      [
        calculateExperienceStat(config.experience),
        calculateProjectsStat(config.projects),
      ].filter(Boolean) as Stat[],
    [config.experience, config.projects],
  );

  /* ----------------------------- contact ---------------------------- */

  const contactHref =
    config.linkedinUrl ||
    config.githubUrl ||
    (config.phone ? `tel:${config.phone}` : null);

  /* ----------------------------- render ----------------------------- */

  const h1Style = useMemo<React.CSSProperties>(
    () => ({
      fontFamily: DISPLAY_FONT,
      fontWeight: 800,
      lineHeight: 0.87,
      letterSpacing: "-0.055em",
      color: "rgba(255,255,255,0.94)",
      opacity: isReady ? 0.94 : 0.88,
      fontSize: "clamp(3rem, 16vw, 16rem)",
      transition: "opacity 300ms ease",
      textAlign: stackName ? "center" : undefined,
    }),
    [isReady, stackName],
  );

  /* antialiasing is wasted on high-DPR screens */
  const antialias =
    typeof window === "undefined" ? true : window.devicePixelRatio < 1.5;

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={SECTION_STYLE}
    >
      {/* Atmospheric depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={VIGNETTE_STYLE}
      />

      {/* Giant name */}
      <div
        ref={nameWrapRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center overflow-hidden"
        style={NAME_WRAP_STYLE}
      >
        <h1
          ref={nameRef}
          className="select-none whitespace-nowrap"
          style={h1Style}
        >
          {stackName
            ? nameWords.map((word, index) => (
                <span key={`${word}-${index}`} style={{ display: "block" }}>
                  {word}
                </span>
              ))
            : displayName}
        </h1>
      </div>

      {/*
        3D model.
        - frameloop "demand": draws only on invalidate (pointer move, theme
          change, resize, settling animation). Idle = 0% GPU.
        - frameloop "never" while off-screen. Canvas stays mounted, so there is
          no WebGL context re-creation or model re-upload when scrolling back.
        - reduced motion: model still renders (one static frame), no parallax.
      */}
      <div className="absolute inset-0 z-[5]">
        <Canvas
          frameloop={heroInView ? "demand" : "never"}
          camera={{ position: [0, 0.22, 3.15], fov: 31 }}
          dpr={[1, 1.5]}
          gl={{
            antialias,
            alpha: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.08,
            stencil: false,
            depth: true,
          }}
          style={CANVAS_STYLE}
          onCreated={({ gl, invalidate }) => {
            gl.setClearColor(0x000000, 0);
            invalidateRef.current = invalidate;
            invalidate();
          }}
        >
          <HeroScene
            pointer={pointerRef}
            active={heroInView}
            reducedMotion={reducedMotion}
          />
        </Canvas>
      </div>

      {/* Foreground UI */}
      <div
        className="pointer-events-none absolute inset-0 z-[10] flex flex-col justify-between"
        style={FOREGROUND_STYLE}
      >
        {/* Top */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5" style={LABEL_STYLE}>
            <span
              aria-hidden="true"
              className="inline-block shrink-0"
              style={LABEL_LINE_STYLE}
            />
            Portfolio
          </div>

          {config.resumeUrl && (
            <a
              href={config.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`pointer-events-auto inline-flex items-center gap-1.5 rounded-full hover:-translate-y-px ${GLASS_CLASS}`}
              style={RESUME_STYLE}
            >
              Résumé <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>

        {/* Bottom: stacks on phones, row from `sm` up */}
        <div className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-6">
          {headline && (
            <div style={HEADLINE_WRAP_STYLE}>
              <p style={HEADLINE_STYLE}>{headline}</p>
              <div aria-hidden="true" style={HEADLINE_RULE_STYLE} />
            </div>
          )}

          {(stats.length > 0 || contactHref) && (
            <div className="flex items-end justify-between gap-4 sm:contents">
              {stats.length > 0 && (
                <div className="flex items-end" style={STATS_WRAP_STYLE}>
                  {stats.map((stat) => (
                    <div key={stat.label}>
                      <div style={STAT_VALUE_STYLE}>{stat.value}</div>
                      <div style={STAT_LABEL_STYLE}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {contactHref && (
                <a
                  href={contactHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`pointer-events-auto z-[15] ml-auto flex shrink-0 items-center gap-2 rounded-full sm:hidden ${GLASS_CLASS}`}
                  style={MOBILE_CONTACT_STYLE}
                >
                  Let&apos;s Talk
                  <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Contact badge (desktop) */}
      {contactHref && (
        <a
          href={contactHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Get in touch"
          className={`pointer-events-auto absolute right-[clamp(1.25rem,3.5vw,2.75rem)] top-1/2 z-[15] hidden -translate-y-1/2 flex-col items-center justify-center rounded-full hover:scale-[1.08] sm:flex ${GLASS_CLASS}`}
          style={BADGE_STYLE}
        >
          <span style={BADGE_TEXT_STYLE}>
            Let&apos;s
            <br />
            Talk
          </span>

          <span aria-hidden="true" style={BADGE_ARROW_STYLE}>
            ↗
          </span>
        </a>
      )}
    </section>
  );
}

/* ============================================================================
   GLTF PRELOAD
============================================================================ */

useGLTF.preload(MODEL_URL);