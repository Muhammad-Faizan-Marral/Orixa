"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { DesignEngine } from "@/portfolio-renderer/DesignEngine";
import {
  SECTION_VARIANTS,
  DEFAULT_COMPONENT_SELECTION,
  DEFAULT_DESIGN_PREFERENCES,
  type ComponentSelection,
} from "@/features/portfolio/component-variants";
import {
  DESIGN_DNAS,
  type DesignDna,
  type DesignIntent,
  resolveDesignFromIntent,
} from "@/lib/ai/design-dna";
import type {
  PortfolioRenderConfig,
  PublicProfileMeta,
  RendererDesignPreferences,
} from "@/portfolio-renderer/types";
import { savePortfolioDesign } from "@/actions/portfolio/save-portfolio-design";
import { Button } from "@/components/UI/Button";

// ─── Types ────────────────────────────────────────────────────────────────────

type SectionKey = keyof typeof SECTION_VARIANTS;
const SECTION_KEYS = Object.keys(SECTION_VARIANTS) as SectionKey[];

const PRESET_COLORS = [
  "#6c5cff",
  "#22d3ee",
  "#34d399",
  "#fbbf24",
  "#fb7185",
  "#a78bfa",
  "#3b82f6",
  "#f97316",
  "#e4e4e7",
  "#000000",
];

type Props = {
  portfolioId: string;
  portfolioTitle: string;
  profile: PublicProfileMeta;
  initialConfig: PortfolioRenderConfig;
  isPremium: boolean;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function asComponentSelection(raw: unknown): ComponentSelection {
  if (!raw || typeof raw !== "object")
    return { ...DEFAULT_COMPONENT_SELECTION };
  return { ...DEFAULT_COMPONENT_SELECTION, ...(raw as ComponentSelection) };
}

function asDesignPreferences(raw: unknown): RendererDesignPreferences {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_DESIGN_PREFERENCES };
  return {
    ...DEFAULT_DESIGN_PREFERENCES,
    ...(raw as RendererDesignPreferences),
  };
}

// ─── Small UI pieces ──────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-violet-400/90">
      {children}
    </p>
  );
}

function Divider() {
  return <div className="my-4 h-px bg-zinc-800/70" />;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PortfolioDesignLabClient({
  portfolioId,
  portfolioTitle,
  profile,
  initialConfig,
  isPremium,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Panel open state (desktop + mobile)
  const [panelOpen, setPanelOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // ── Initial values ──────────────────────────────────────────────────────────

  const initialSelection = useMemo(
    () => asComponentSelection(initialConfig.componentSelection),
    [initialConfig.componentSelection],
  );
  const initialPrefs = useMemo(
    () => asDesignPreferences(initialConfig.designPreferences),
    [initialConfig.designPreferences],
  );

  // ── Design state ────────────────────────────────────────────────────────────

  const [dna, setDna] = useState<DesignDna>(
    (initialPrefs.designDna as DesignDna) || "soft-luxury",
  );
  const [themeMode, setThemeMode] = useState<"light" | "dark">(
    initialPrefs.themeMode === "light" ? "light" : "dark",
  );
  const [energy, setEnergy] = useState<DesignIntent["energy"]>("balanced");
  const [contentBias, setContentBias] =
    useState<DesignIntent["contentBias"]>("balanced");
  const [accentFamily, setAccentFamily] =
    useState<DesignIntent["accentFamily"]>("cool");
  const [packForce, setPackForce] = useState<"auto" | "0" | "1">("auto");
  const [accentColor, setAccentColor] = useState(
    initialPrefs.accentColor || "#6c5cff",
  );
  const [customHex, setCustomHex] = useState(
    initialPrefs.accentColor || "#6c5cff",
  );
  const [variantOverrides, setVariantOverrides] = useState<
    Partial<Record<SectionKey, string>>
  >(() => {
    const o: Partial<Record<SectionKey, string>> = {};
    for (const key of SECTION_KEYS) {
      const v = initialSelection[key]?.variant;
      if (v) o[key] = v;
    }
    return o;
  });
  const [seed] = useState(portfolioId);

  // ── Derived config ──────────────────────────────────────────────────────────

  const contentOnly = useMemo(() => {
    const {
      componentSelection: _c,
      designPreferences: _d,
      ...rest
    } = initialConfig;
    return rest;
  }, [initialConfig]);

  const signals = useMemo(
    () => ({
      projectCount: initialConfig.projects?.length ?? 0,
      skillCount: initialConfig.skills?.length ?? 0,
      experienceCount: initialConfig.experience?.length ?? 0,
      educationCount: initialConfig.education?.length ?? 0,
      certificateCount: initialConfig.certificates?.length ?? 0,
      hasAbout: Boolean(initialConfig.about?.trim()),
      headline: initialConfig.headline ?? "",
    }),
    [initialConfig],
  );

  const resolved = useMemo(() => {
    const intent: DesignIntent = {
      designDna: dna,
      themeMode,
      energy: packForce === "0" ? "calm" : packForce === "1" ? "bold" : energy,
      contentBias,
      accentFamily,
    };
    if (packForce === "auto") intent.energy = energy;
    return resolveDesignFromIntent(intent, signals, seed);
  }, [
    dna,
    themeMode,
    energy,
    contentBias,
    accentFamily,
    packForce,
    seed,
    signals,
  ]);

  const componentSelection: ComponentSelection = useMemo(() => {
    const base = { ...resolved.componentSelection };
    for (const key of SECTION_KEYS) {
      const override = variantOverrides[key];
      if (override) {
        base[key] = {
          enabled: base[key]?.enabled !== false,
          variant: override,
        };
      }
    }
    return base;
  }, [resolved.componentSelection, variantOverrides]);

  const designPreferences: RendererDesignPreferences = useMemo(
    () => ({
      ...resolved.designPreferences,
      themeMode,
      designDna: dna,
      accentColor: accentColor || resolved.designPreferences.accentColor,
    }),
    [resolved.designPreferences, themeMode, dna, accentColor],
  );

  const liveConfig: PortfolioRenderConfig = useMemo(
    () => ({ ...contentOnly, componentSelection, designPreferences }),
    [contentOnly, componentSelection, designPreferences],
  );

  // ── Handlers ────────────────────────────────────────────────────────────────

  const applyDna = (next: DesignDna) => {
    setDna(next);
    setVariantOverrides({});
    setThemeMode(
      next === "editorial" || next === "soft-luxury" ? "light" : "dark",
    );
  };

  const applyHex = (hex: string) => {
    const cleaned = hex.trim();
    if (/^#[0-9A-Fa-f]{6}$/.test(cleaned)) {
      setAccentColor(cleaned);
      setCustomHex(cleaned);
    } else if (/^[0-9A-Fa-f]{6}$/.test(cleaned)) {
      setAccentColor(`#${cleaned}`);
      setCustomHex(`#${cleaned}`);
    } else {
      setCustomHex(cleaned);
    }
  };

  const handleReset = () => {
    setDna((initialPrefs.designDna as DesignDna) || "soft-luxury");
    setThemeMode(initialPrefs.themeMode === "light" ? "light" : "dark");
    setAccentColor(initialPrefs.accentColor || "#6c5cff");
    setCustomHex(initialPrefs.accentColor || "#6c5cff");
    setEnergy("balanced");
    setPackForce("auto");
    setContentBias("balanced");
    const o: Partial<Record<SectionKey, string>> = {};
    for (const key of SECTION_KEYS) {
      const v = initialSelection[key]?.variant;
      if (v) o[key] = v;
    }
    setVariantOverrides(o);
    setMessage({ type: "success", text: "Reset to last saved design." });
  };

  const handleSave = useCallback(() => {
    setMessage(null);
    startTransition(async () => {
      const result = await savePortfolioDesign({
        portfolioId,
        componentSelection: componentSelection as ComponentSelection,
        designPreferences:
          designPreferences as typeof DEFAULT_DESIGN_PREFERENCES,
      });

      if (!result.success) {
        setMessage({ type: "error", text: result.message ?? "Save failed." });
        return;
      }

      router.push(`/dashboard/portfolios/${portfolioId}`);
    });
  }, [portfolioId, componentSelection, designPreferences, router]);

  // ── Controls content (shared) ───────────────────────────────────────────────

  const ControlsContent = (
    <div className="space-y-5 p-4 pb-6">
      {/* Design DNA */}
      <div>
        <SectionLabel>Design DNA</SectionLabel>
        <div className="flex flex-wrap gap-1.5">
          {DESIGN_DNAS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => applyDna(d)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize transition-all ${
                dna === d
                  ? "bg-violet-600 text-white shadow-md shadow-violet-900/40"
                  : "bg-zinc-800/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <Divider />

      {/* Theme Mode */}
      <div>
        <SectionLabel>Theme Mode</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          {(["dark", "light"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setThemeMode(m)}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-medium transition-all ${
                themeMode === m
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "bg-zinc-800/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              }`}
            >
              <span>{m === "dark" ? "🌙" : "☀️"}</span>
              <span className="capitalize">{m}</span>
            </button>
          ))}
        </div>
      </div>

      <Divider />

      {/* Accent Color */}
      <div>
        <SectionLabel>Accent color</SectionLabel>
        <div className="mb-3 flex flex-wrap gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              title={c}
              onClick={() => applyHex(c)}
              className={`h-7 w-7 rounded-full border-2 transition-all ${
                accentColor.toLowerCase() === c.toLowerCase()
                  ? "scale-110 border-white shadow-lg"
                  : "border-transparent hover:scale-105 hover:border-zinc-600"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="color"
            value={
              /^#[0-9A-Fa-f]{6}$/.test(accentColor) ? accentColor : "#6c5cff"
            }
            onChange={(e) => applyHex(e.target.value)}
            className="h-9 w-11 shrink-0 cursor-pointer rounded-lg border border-zinc-700 bg-zinc-900 p-1"
          />
          <input
            value={customHex}
            onChange={(e) => applyHex(e.target.value)}
            placeholder="#6c5cff"
            className="min-w-0 flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none"
          />
        </div>
      </div>

      <Divider />

      {/* Energy / Pack */}
      <div>
        <SectionLabel>Layout energy</SectionLabel>
        <div className="flex gap-1.5">
          {(
            [
              ["calm", "Pack A"],
              ["balanced", "Auto"],
              ["bold", "Pack B"],
            ] as const
          ).map(([v, label]) => (
            <button
              key={v}
              type="button"
              onClick={() => {
                setEnergy(v);
                setPackForce("auto");
                setVariantOverrides({});
              }}
              className={`flex-1 rounded-xl py-2 text-[11px] font-medium transition-all ${
                energy === v && packForce === "auto"
                  ? "bg-violet-600 text-white"
                  : "bg-zinc-800/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <Divider />

      {/* Content Bias */}
      <div>
        <SectionLabel>Content order</SectionLabel>
        <select
          value={contentBias}
          onChange={(e) =>
            setContentBias(e.target.value as DesignIntent["contentBias"])
          }
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-xs text-zinc-200 focus:border-violet-500 focus:outline-none"
        >
          <option value="projects-first">Projects first</option>
          <option value="experience-first">Experience first</option>
          <option value="balanced">Balanced</option>
          <option value="about-first">About first</option>
        </select>
      </div>

      <Divider />

      {/* Section Variants */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <SectionLabel>Section variants</SectionLabel>
          <button
            type="button"
            onClick={() => setVariantOverrides({})}
            className="rounded-lg border border-zinc-700/60 px-2 py-0.5 text-[10px] text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
          >
            DNA defaults
          </button>
        </div>
        <div className="space-y-2">
          {SECTION_KEYS.map((key) => {
            const current =
              variantOverrides[key] ?? componentSelection[key]?.variant ?? "";
            const options = SECTION_VARIANTS[key] as readonly string[];
            return (
              <div key={key} className="flex items-center gap-2">
                <span className="w-[4.5rem] shrink-0 text-[10px] capitalize text-zinc-500">
                  {key}
                </span>
                <select
                  value={current}
                  onChange={(e) =>
                    setVariantOverrides((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                  className="min-w-0 flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-[11px] text-zinc-300 focus:border-violet-500 focus:outline-none"
                >
                  {options.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      </div>

      <Divider />

      {/* Live theme debug */}
      <details className="group rounded-xl border border-zinc-800 bg-zinc-900/50">
        <summary className="cursor-pointer select-none px-3 py-2 text-[10px] font-medium text-zinc-500 hover:text-zinc-400">
          Live theme JSON
        </summary>
        <pre className="overflow-x-auto px-3 pb-3 font-mono text-[9px] leading-relaxed text-zinc-600">
          {JSON.stringify(designPreferences, null, 2)}
        </pre>
      </details>
    </div>
  );

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-zinc-950 text-zinc-100">
      {/* ── Sticky header (minimal) ─────────────────────────────────────────── */}
      <header className="z-40 shrink-0 border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur-xl">
        <div className="flex h-13 items-center justify-between gap-3 px-4 sm:px-5">
          {/* Left */}
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href={`/dashboard/portfolios/${portfolioId}`}
              className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              ← Back
            </Link>
            <div className="h-4 w-px shrink-0 bg-zinc-800" />
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-widest text-violet-400">
                Design Lab
              </p>
              <p className="truncate text-sm font-medium text-white">
                {portfolioTitle}
              </p>
            </div>
          </div>

          {/* Right – only mobile Controls button + status */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:bg-zinc-800 lg:hidden"
            >
              Controls
            </button>
          </div>
        </div>

        {/* Status message */}
        {message && (
          <div
            className={`border-t px-4 py-2 text-center text-xs font-medium ${
              message.type === "success"
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                : "border-red-500/20 bg-red-500/10 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}
      </header>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* ── Desktop left panel (collapsible) ─────────────────────────────── */}
        <aside
          className={`
            hidden lg:flex flex-col shrink-0 border-r border-zinc-800/80 bg-zinc-950
            transition-all duration-300 ease-in-out
            ${panelOpen ? "w-72 xl:w-80" : "w-12"}
          `}
        >
          {/* Panel header + toggle */}
          <div className="flex h-12 shrink-0 items-center border-b border-zinc-800/60 px-2">
            {panelOpen ? (
              <div className="flex w-full items-center justify-between px-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-violet-400">
                    Design Controls
                  </p>
                  <p className="text-[10px] text-zinc-500">Live preview</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPanelOpen(false)}
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                  title="Collapse panel"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setPanelOpen(true)}
                className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                title="Open design controls"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3v18" />
                  <path d="M3 12h18" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            )}
          </div>

          {/* Scrollable controls – only when open */}
          {panelOpen && (
            <>
              <div className="flex-1 overflow-y-auto">{ControlsContent}</div>

              {/* Sticky footer actions inside panel */}
              <div className="shrink-0 border-t border-zinc-800/80 bg-zinc-950/95 p-3 space-y-2">
                <Button
                  type="button"
                  variant="gradient"
                  loading={isPending}
                  onClick={handleSave}
                  className="w-full"
                >
                  {isPending ? "Saving…" : "Save design"}
                </Button>
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isPending}
                  className="w-full rounded-xl border border-zinc-700 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800 disabled:opacity-40"
                >
                  Reset to last saved
                </button>
              </div>
            </>
          )}
        </aside>

        {/* ── Preview pane ─────────────────────────────────────────────────── */}
        <main className="relative flex-1 overflow-y-auto bg-zinc-950">
          {/* Floating reopen button when panel is closed (desktop) */}
          {!panelOpen && (
            <button
              type="button"
              onClick={() => setPanelOpen(true)}
              className="absolute left-3 top-3 z-30 hidden lg:flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/90 px-3 py-1.5 text-xs text-zinc-300 shadow-lg backdrop-blur hover:bg-zinc-800 hover:text-white transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v18" />
                <path d="M3 12h18" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Controls
            </button>
          )}

          <DesignEngine config={liveConfig} profile={profile} />
        </main>
      </div>

      {/* ── Mobile bottom drawer ───────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Sheet */}
          <div className="absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-2xl border-t border-zinc-800 bg-zinc-950 shadow-2xl">
            {/* Sheet header */}
            <div className="flex shrink-0 items-center justify-between border-b border-zinc-800 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-zinc-100">
                  Design Controls
                </p>
                <p className="text-[11px] text-zinc-500">Live preview</p>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
              >
                Done
              </button>
            </div>

            {/* Scrollable controls */}
            <div className="flex-1 overflow-y-auto">{ControlsContent}</div>

            {/* Sticky actions */}
            <div className="shrink-0 border-t border-zinc-800 bg-zinc-950 p-3 space-y-2">
              <Button
                type="button"
                variant="gradient"
                loading={isPending}
                onClick={handleSave}
                className="w-full"
              >
                {isPending ? "Saving…" : "Save design"}
              </Button>
              <button
                type="button"
                onClick={handleReset}
                disabled={isPending}
                className="w-full rounded-xl border border-zinc-700 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 disabled:opacity-40"
              >
                Reset to last saved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
