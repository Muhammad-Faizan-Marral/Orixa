"use client";

/**
 * Hero3D.tsx
 * src/portfolio-renderer/sections/hero/Hero3D.tsx
 *
 * Design reference: Orange full-viewport cinematic hero.
 * Typography IS the artwork — the model breaks through the name letterforms.
 * Every element is intentional. Nothing decorative added without purpose.
 *
 * Stats are computed from config:
 *   • Experience → years (if ≥12 months) or months (if <12 months), empty if no data
 *   • Projects    → count from config.projects, empty if none
 */

import { useRef, useState, useEffect, useCallback, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, ContactShadows, Float } from "@react-three/drei";
import * as THREE from "three";
import type { PortfolioRenderConfig, PublicProfileMeta } from "../../types";

/* ═══════════════════════════════════════════════════════════════════════════
   FONT INJECTION
   Uses a useEffect-based link injection so it works in both pages and app
   router without any FOUC risk from style @import.
═══════════════════════════════════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════════════════════
   STAT CALCULATION
═══════════════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════════════
   STAT CALCULATION
═══════════════════════════════════════════════════════════════════════════ */

type Stat = { value: string; label: string };

function parseConfigDate(s?: string): Date | null {
  if (!s?.trim()) return null;
  const p = s.trim().split("-");
  const year = parseInt(p[0], 10);
  if (isNaN(year)) return null;
  const month = p[1] ? parseInt(p[1], 10) - 1 : 0;
  const d = new Date(year, month, 1);
  return isNaN(d.getTime()) ? null : d;
}

function calcExperienceStat(
  exp?: Array<{ startDate?: string; [k: string]: unknown }>
): Stat | null {
  if (!exp?.length) return null;
  const dates = exp
    .map((e) => parseConfigDate(e.startDate))
    .filter((d): d is Date => d !== null);
  if (!dates.length) return null;

  const oldest = dates.reduce((a, b) => (a < b ? a : b));
  const now = new Date();
  const months =
    (now.getFullYear() - oldest.getFullYear()) * 12 +
    (now.getMonth() - oldest.getMonth());

  if (months <= 0) return null;
  if (months < 12) return { value: String(months), label: "Months Exp." };
  return { value: `${Math.floor(months / 12)}+`, label: "Years Exp." };
}

function calcProjectsStat(
  projects?: Array<{ id?: string; [k: string]: unknown }>
): Stat | null {
  if (!projects?.length) return null;
  return { value: `${projects.length}+`, label: "Projects" };
}

/* ═══════════════════════════════════════════════════════════════════════════
   MATERIAL HELPERS
═══════════════════════════════════════════════════════════════════════════ */

function getAccentColor(): THREE.Color {
  if (typeof window === "undefined") return new THREE.Color("#f97316");
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--pr-accent")
    .trim();
  return new THREE.Color(raw || "#f97316");
}

function isNaturalPart(name: string): boolean {
  const n = name.toLowerCase();
  return (
    n.includes("skin") ||
    n.includes("face") ||
    n.includes("body") ||
    n.includes("hand") ||
    n.includes("arm") ||
    n.includes("leg") ||
    n.includes("hair") ||
    n.includes("eye") ||
    n.includes("brow") ||
    n.includes("lash") ||
    n.includes("mouth") ||
    n.includes("lip") ||
    n.includes("tooth") ||
    n.includes("teeth") ||
    n.includes("nose") ||
    n.includes("ear") ||
    n.includes("neck") ||
    n.includes("head")
  );
}

function isAccentPart(name: string): boolean {
  const n = name.toLowerCase();
  return (
    n.includes("jacket") ||
    n.includes("coat") ||
    n.includes("hoodie") ||
    n.includes("shirt") ||
    n.includes("cloth") ||
    n.includes("outfit") ||
    n.includes("wear") ||
    n.includes("dress") ||
    n.includes("pant") ||
    n.includes("shoe") ||
    n.includes("boot") ||
    n.includes("glove") ||
    n.includes("hat") ||
    n.includes("cap") ||
    n.includes("bag") ||
    n.includes("backpack") ||
    n.includes("headphone") ||
    n.includes("earphone") ||
    n.includes("headset") ||
    n.includes("accessory") ||
    n.includes("accessories") ||
    n.includes("band") ||
    n.includes("strap") ||
    n.includes("belt") ||
    n.includes("mask") ||
    n.includes("scarf")
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   3D — ANIME MODEL
═══════════════════════════════════════════════════════════════════════════ */

function AnimeModel({ mouse }: { mouse: { x: number; y: number } }) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/Anime3d.glb");
  const accentMats = useRef<THREE.MeshStandardMaterial[]>([]);

  useEffect(() => {
    const accent = getAccentColor();
    accentMats.current = [];

    const applyMat = (mesh: THREE.Mesh, mat: THREE.Material) => {
      const m = mat as THREE.MeshStandardMaterial;
      if (!m.isMeshStandardMaterial) return;

      // Raise material quality across the board
      m.envMapIntensity = 1.5;
      m.roughness = Math.min(m.roughness ?? 0.55, 0.44);
      m.metalness = Math.max(m.metalness ?? 0.05, 0.06);
      m.needsUpdate = true;

      const partName = `${mesh.name} ${m.name ?? ""}`.toLowerCase();
      if (isNaturalPart(partName)) return;

      if (isAccentPart(partName)) {
        m.color.copy(accent);
        m.emissive.copy(accent).multiplyScalar(0.1);
        accentMats.current.push(m);
      }
    };

    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      if (Array.isArray(mesh.material))
        mesh.material.forEach((mat) => applyMat(mesh, mat));
      else if (mesh.material) applyMat(mesh, mesh.material);
    });

    // ── Fallback: if no named part matched, apply a subtle accent tint
    //    to all non-natural parts so the model never looks fully gray.
    if (accentMats.current.length === 0) {
      scene.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;
        const tint = (mat: THREE.Material) => {
          const m = mat as THREE.MeshStandardMaterial;
          if (!m.isMeshStandardMaterial) return;
          const n = `${mesh.name} ${m.name ?? ""}`.toLowerCase();
          if (!isNaturalPart(n)) {
            // 22% lerp toward accent — adds identity without overwhelming
            m.color.lerp(accent, 0.22);
            m.needsUpdate = true;
          }
        };
        if (Array.isArray(mesh.material)) mesh.material.forEach(tint);
        else if (mesh.material) tint(mesh.material);
      });
    }
  }, [scene]);

  // Keep accent in sync when theme/CSS var changes
  useEffect(() => {
    const obs = new MutationObserver(() => {
      const accent = getAccentColor();
      accentMats.current.forEach((m) => {
        m.color.copy(accent);
        m.emissive.copy(accent).multiplyScalar(0.1);
      });
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });
    return () => obs.disconnect();
  }, []);

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      mouse.x * 0.1,
      0.05
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -mouse.y * 0.055,
      0.05
    );
  });

  return (
    <Float speed={0.85} rotationIntensity={0.04} floatIntensity={0.08}>
      {/* Slight right offset keeps model from being perfectly centered —
          creates visual tension that mirrors the reference composition */}
      <group ref={group} position={[0.18, -1.08, 0]} scale={1.92}>
        <primitive object={scene} />
      </group>
    </Float>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   3D — SCENE / LIGHTING
   Three-point studio setup with a strong rim to silhouette the figure
   against the orange background.
═══════════════════════════════════════════════════════════════════════════ */

function Scene({ mouse }: { mouse: { x: number; y: number } }) {
  return (
    <>
      {/* Key — warm, overhead-front, primary illumination */}
      <directionalLight
        position={[1.5, 7, 5]}
        intensity={2.5}
        color="#fff8f0"
      />
      {/* Rim — strong back-right, creates crisp silhouette edge */}
      <directionalLight
        position={[6, 2.5, -5]}
        intensity={1.7}
        color="#fff0dd"
      />
      {/* Fill — cool left, prevents pure shadow on face */}
      <directionalLight
        position={[-5, 2, 3]}
        intensity={0.42}
        color="#dde8ff"
      />
      {/* Ambient — warm base so shadows aren't black */}
      <ambientLight intensity={0.28} color="#ffe8d8" />
      {/* Ground bounce */}
      <pointLight position={[0, -1.2, 2.5]} intensity={0.52} color="#ffd0a0" />
      {/* Front softbox — lifts the face */}
      <spotLight
        position={[0, 4, 5.5]}
        angle={0.38}
        penumbra={0.85}
        intensity={0.6}
        color="#fff5e8"
        decay={2}
      />

      <Suspense fallback={null}>
        <AnimeModel mouse={mouse} />
      </Suspense>

      <ContactShadows
        position={[0, -1.28, 0]}
        opacity={0.62}
        scale={14}
        blur={4}
        far={5}
        color="#1a0500"
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   GRAIN TEXTURE
═══════════════════════════════════════════════════════════════════════════ */

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/* ═══════════════════════════════════════════════════════════════════════════
   HERO COMPONENT
═══════════════════════════════════════════════════════════════════════════ */

export function HeroCinematic({
  config,
  profile,
}: {
  config: PortfolioRenderConfig;
  profile: PublicProfileMeta;
}) {
 

  const displayName =  config.name || profile.fullName || profile.username || "Portfolio";
  const headline = config.headline;

  const containerRef = useRef<HTMLElement>(null);
  const nameWrapRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  /* ── Fit name edge-to-edge ─────────────────────────────────────────────
     Measures at 400 px then scales proportionally.
     Runs after fonts load to avoid wrong metrics.
  ─────────────────────────────────────────────────────────────────────── */
  const fitName = useCallback(() => {
    const el = nameRef.current;
    const wrap = nameWrapRef.current;
    if (!el || !wrap) return;
    el.style.fontSize = "400px";
    const targetWidth = wrap.offsetWidth * 0.975;
    const ratio = targetWidth / (el.scrollWidth || 1);
    el.style.fontSize = `${Math.max(28, Math.floor(400 * ratio))}px`;
  }, [displayName]);

  useEffect(() => {
    let cancelled = false;
    const safeFit = () => { if (!cancelled) fitName(); };

    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(safeFit);
    } else {
      setTimeout(safeFit, 180);
    }

    const ro = new ResizeObserver(safeFit);
    if (nameWrapRef.current) ro.observe(nameWrapRef.current);

    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [fitName]);

  /* ── Mouse parallax tracking ─────────────────────────────────────────── */
  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      setMouse({
        x: ((e.clientX - r.left) / r.width) * 2 - 1,
        y: -(((e.clientY - r.top) / r.height) * 2 - 1),
      });
    };
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("pointermove", move);
    return () => el.removeEventListener("pointermove", move);
  }, []);

  /* ── Stats (calculated from config) ─────────────────────────────────── */
  const expStat = calcExperienceStat(config.experience);
  const projStat = calcProjectsStat(config.projects);
  // Show experience first (most narrative), then projects — max 2 stats
  const stats = [expStat, projStat].filter(Boolean) as Stat[];

  /* ── Contact badge link ──────────────────────────────────────────────── */
  const contactHref =
    config.linkedinUrl ||
    config.githubUrl ||
    (config.phone ? `tel:${config.phone}` : null);

  /* ════════════════════════════════════════════════════════════════════════
     RENDER

     Z-index layering (back → front):
       [0]  Section background (CSS var --pr-accent)
       [1]  Atmospheric vignette (edge darkening)
       [2]  Giant name — typography IS the background
       [5]  3D Canvas — model sits IN FRONT of letters
       [10] Foreground UI (label, headline, stats)
       [15] Floating badge
       [20] Film grain
  ════════════════════════════════════════════════════════════════════════ */
  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: "var(--pr-accent, #f97316)",
        height: "min(100svh, 880px)",
      }}
    >
      {/* ── [1] Atmospheric vignette ──────────────────────────────────────
          Darkens edges without adding any visible gradient bands.
          Keeps the flat orange feel while adding subtle spatial depth.     */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 46%, transparent 34%, rgba(0,0,0,0.18) 100%)",
        }}
      />

      {/* ── [2] GIANT NAME ────────────────────────────────────────────────
          Spans full viewport width. JavaScript measures and sets exact
          font-size so the name always fills edge-to-edge regardless of
          character count or viewport size.
          Renders BEHIND the Canvas (z-[2] < z-[5]).                       */}
      <div
        ref={nameWrapRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center overflow-hidden"
        style={{ paddingInline: "0.5%" }}
      >
        <h1
          ref={nameRef}
          className="select-none whitespace-nowrap text-white"
          style={{
            
            fontWeight: 800,
            lineHeight: 0.87,
            letterSpacing: "-0.04em",
            opacity: 0.94,
            // SSR / pre-JS fallback — overridden client-side after measurement
            fontSize: "clamp(3rem, 16vw, 16rem)",
          }}
        >
          {displayName}
        </h1>
      </div>

      {/* ── [5] 3D MODEL ──────────────────────────────────────────────────
          Canvas fills the full section. alpha:true so the orange
          background and name text show through the transparent canvas.
          Model renders ON TOP of the name letters.                        */}
      <div className="absolute inset-0 z-[5]">
        <Canvas
          camera={{ position: [0, 0.22, 3.15], fov: 31 }}
          dpr={[1, 1.75]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.08,
          }}
          style={{ background: "transparent" }}
        >
          <Scene mouse={mouse} />
        </Canvas>
      </div>

      {/* ── [10] FOREGROUND UI ────────────────────────────────────────────
          pointer-events-none on the wrapper so the 3D canvas receives
          mouse events for parallax. pointer-events-auto is restored on
          individual interactive children.                                  */}
      <div
        className="pointer-events-none absolute inset-0 z-[10] flex flex-col justify-between"
        style={{
          padding:
            "clamp(1.25rem, 2.8vw, 2rem) clamp(1.25rem, 3.5vw, 2.5rem)",
        }}
      >
        {/* ── Top row: micro-label + résumé CTA ── */}
        <div className="flex items-start justify-between">
          {/* Left: editorial section label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "'Inter', sans-serif",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.46)",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 22,
                height: 1,
                background: "rgba(255,255,255,0.3)",
                flexShrink: 0,
              }}
            />
            Portfolio
          </div>

          {/* Right: résumé pill (restored pointer-events) */}
          {config.resumeUrl && (
            <a
              href={config.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 16px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.26)",
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                fontFamily: "'Inter', sans-serif",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.88)",
                textDecoration: "none",
                cursor: "pointer",
                transition: "background 0.18s, border-color 0.18s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(255,255,255,0.18)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(255,255,255,0.1)";
              }}
            >
              Résumé&nbsp;↗
            </a>
          )}
        </div>

        {/* ── Bottom row: headline (left) + stats (right) ── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          {/* Left: large headline — treated as major typography, not body copy */}
          {headline && (
            <div style={{ maxWidth: "clamp(200px, 42vw, 460px)" }}>
              <p
                style={{
                  fontFamily: "'Syne', 'Arial Black', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.3rem, 2.4vw, 2.45rem)",
                  lineHeight: 1.13,
                  letterSpacing: "-0.025em",
                  color: "rgba(255,255,255,0.97)",
                  margin: 0,
                }}
              >
                {headline}
              </p>
              {/* Thin accent rule — anchors the text visually */}
              <div
                style={{
                  marginTop: 11,
                  width: 28,
                  height: 2,
                  background: "rgba(255,255,255,0.38)",
                  borderRadius: 2,
                }}
              />
            </div>
          )}

          {/* Right: numeric stats from config */}
          {stats.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: "clamp(1.5rem, 4vw, 3.5rem)",
                alignItems: "flex-end",
                flexShrink: 0,
              }}
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <div
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 800,
                      fontSize: "clamp(1.8rem, 3.2vw, 3.2rem)",
                      lineHeight: 1,
                      letterSpacing: "-0.045em",
                      color: "#ffffff",
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      marginTop: 5,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 9,
                      fontWeight: 600,
                      letterSpacing: "0.26em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.46)",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── [15] FLOATING CONTACT BADGE ──────────────────────────────────
          Positioned right-center, desktop only.
          Mirrors the "Let's Talk" pill seen in the reference.             */}
      {contactHref && (
        <a
          href={contactHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Get in touch"
          className="hidden sm:flex"
          style={{
            position: "absolute",
            right: "clamp(1.5rem, 3.5vw, 2.75rem)",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 15,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 68,
            height: 68,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.24)",
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            textDecoration: "none",
            cursor: "pointer",
            gap: 2,
            transition: "transform 0.22s ease, background 0.22s ease",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = "translateY(-50%) scale(1.08)";
            el.style.background = "rgba(255,255,255,0.18)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = "translateY(-50%) scale(1)";
            el.style.background = "rgba(255,255,255,0.1)";
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.88)",
              textAlign: "center",
              lineHeight: 1.3,
            }}
          >
            Let&rsquo;s
            <br />
            Talk
          </span>
          <span
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.6)",
              marginTop: 2,
            }}
          >
            ↗
          </span>
        </a>
      )}

      {/* ── [20] Film grain ───────────────────────────────────────────────
          Ultra-light fractal noise. mix-blend-overlay so it reads on
          any accent color. Rewards up-close inspection.                   */}
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

useGLTF.preload("/models/Anime3d.glb");