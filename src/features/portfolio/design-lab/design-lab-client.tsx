"use client";

import { useMemo, useState } from "react";

import { DesignEngine } from "@/portfolio-renderer/DesignEngine";
import {
  SECTION_VARIANTS,
  type ComponentSelection,
} from "@/features/portfolio/component-variants";
import {
  DESIGN_DNAS,
  type DesignDna,
  type DesignIntent,
  resolveDesignFromIntent,
} from "@/lib/ai/design-dna";
import type { PortfolioRenderConfig } from "@/portfolio-renderer/types";

import { LAB_CONFIG_BASE, LAB_PROFILE } from "./dummy-data";

type SectionKey = keyof typeof SECTION_VARIANTS;

const SECTION_KEYS = Object.keys(SECTION_VARIANTS) as SectionKey[];

export function DesignLabClient() {
  const [dna, setDna] = useState<DesignDna>("cinematic");
  const [themeMode, setThemeMode] = useState<"light" | "dark">("dark");
  const [energy, setEnergy] = useState<DesignIntent["energy"]>("balanced");
  const [contentBias, setContentBias] =
    useState<DesignIntent["contentBias"]>("projects-first");
  const [accentFamily, setAccentFamily] =
    useState<DesignIntent["accentFamily"]>("cool");
  const [packForce, setPackForce] = useState<"auto" | "0" | "1">("auto");
  const [panelOpen, setPanelOpen] = useState(true);
  const [variantOverrides, setVariantOverrides] = useState<
    Partial<Record<SectionKey, string>>
  >({});
  const [seed, setSeed] = useState("design-lab-demo");

  const signals = useMemo(
    () => ({
      projectCount: LAB_CONFIG_BASE.projects?.length ?? 0,
      skillCount: LAB_CONFIG_BASE.skills?.length ?? 0,
      experienceCount: LAB_CONFIG_BASE.experience?.length ?? 0,
      educationCount: LAB_CONFIG_BASE.education?.length ?? 0,
      certificateCount: LAB_CONFIG_BASE.certificates?.length ?? 0,
      hasAbout: Boolean(LAB_CONFIG_BASE.about?.trim()),
      headline: LAB_CONFIG_BASE.headline ?? "",
    }),
    [],
  );

  const resolved = useMemo(() => {
    const intent: DesignIntent = {
      designDna: dna,
      themeMode,
      energy: packForce === "0" ? "calm" : packForce === "1" ? "bold" : energy,
      contentBias,
      accentFamily,
    };
    if (packForce === "auto") {
      intent.energy = energy;
    }
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

  const config: PortfolioRenderConfig = useMemo(
    () => ({
      ...LAB_CONFIG_BASE,
      componentSelection,
      designPreferences: resolved.designPreferences,
    }),
    [componentSelection, resolved.designPreferences],
  );

  const applyDnaPreset = (next: DesignDna) => {
    setDna(next);
    setVariantOverrides({});
    if (next === "editorial") setThemeMode("light");
    else if (next === "soft-luxury") setThemeMode("light");
    else if (next === "brutalist") setThemeMode("dark");
    else if (
      next === "cinematic" ||
      next === "neo-glass" ||
      next === "tech-dense" ||
      next === "minimal-airy"
    ) {
      setThemeMode("dark");
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={() => setPanelOpen((o) => !o)}
          className="rounded-full border border-white/20 bg-black/80 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur hover:bg-black"
        >
          {panelOpen ? "Hide lab controls" : "Show lab controls"}
        </button>

        {panelOpen && (
          <div className="max-h-[min(80vh,720px)] w-[min(100vw-2rem,380px)] overflow-y-auto rounded-2xl border border-white/15 bg-zinc-950/95 p-4 text-zinc-100 shadow-2xl backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-400">
              Design lab
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              Live preview · dummy data · no save
            </p>

            <label className="mt-4 block text-xs font-medium text-zinc-300">
              Design DNA
            </label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {DESIGN_DNAS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => applyDnaPreset(d)}
                  className={`rounded-full px-2.5 py-1 text-[11px] capitalize transition ${
                    dna === d
                      ? "bg-violet-500 text-white"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <label className="mt-4 block text-xs font-medium text-zinc-300">
              Theme mode
            </label>
            <div className="mt-2 flex gap-2">
              {(["dark", "light"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setThemeMode(m)}
                  className={`flex-1 rounded-lg py-1.5 text-xs capitalize ${
                    themeMode === m
                      ? "bg-white text-black"
                      : "bg-zinc-800 text-zinc-300"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <label className="mt-4 block text-xs font-medium text-zinc-300">
              Energy (pack A/B)
            </label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(
                [
                  ["calm", "calm → pack A"],
                  ["balanced", "balanced"],
                  ["bold", "bold → pack B"],
                ] as const
              ).map(([v, label]) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => {
                    setEnergy(v);
                    setPackForce("auto");
                  }}
                  className={`rounded-full px-2.5 py-1 text-[11px] ${
                    energy === v && packForce === "auto"
                      ? "bg-violet-500 text-white"
                      : "bg-zinc-800 text-zinc-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-2 flex gap-1.5">
              <button
                type="button"
                onClick={() => setPackForce("0")}
                className={`rounded-full px-2.5 py-1 text-[11px] ${
                  packForce === "0"
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-800 text-zinc-300"
                }`}
              >
                Force pack A
              </button>
              <button
                type="button"
                onClick={() => setPackForce("1")}
                className={`rounded-full px-2.5 py-1 text-[11px] ${
                  packForce === "1"
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-800 text-zinc-300"
                }`}
              >
                Force pack B
              </button>
            </div>

            <label className="mt-4 block text-xs font-medium text-zinc-300">
              Content bias
            </label>
            <select
              value={contentBias}
              onChange={(e) =>
                setContentBias(e.target.value as DesignIntent["contentBias"])
              }
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs"
            >
              <option value="projects-first">projects-first</option>
              <option value="experience-first">experience-first</option>
              <option value="balanced">balanced</option>
              <option value="about-first">about-first</option>
            </select>

            <label className="mt-4 block text-xs font-medium text-zinc-300">
              Accent family
            </label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(["cool", "warm", "neutral", "vivid"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setAccentFamily(f)}
                  className={`rounded-full px-2.5 py-1 text-[11px] capitalize ${
                    accentFamily === f
                      ? "bg-violet-500 text-white"
                      : "bg-zinc-800 text-zinc-300"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <label className="mt-4 block text-xs font-medium text-zinc-300">
              Seed (stable accent/font pick)
            </label>
            <div className="mt-1 flex gap-2">
              <input
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs"
              />
              <button
                type="button"
                onClick={() => setSeed(`lab-${Date.now()}`)}
                className="shrink-0 rounded-lg bg-zinc-800 px-2 text-xs"
              >
                Reseed
              </button>
            </div>

            <div className="mt-4 rounded-xl bg-zinc-900/80 p-3 font-mono text-[10px] leading-relaxed text-zinc-400">
              <div className="text-zinc-200">Resolved theme</div>
              <pre className="mt-1 whitespace-pre-wrap">
                {JSON.stringify(resolved.designPreferences, null, 2)}
              </pre>
            </div>

            <p className="mt-4 text-xs font-medium text-zinc-300">
              Section variants (override pack)
            </p>
            <div className="mt-2 space-y-2">
              {SECTION_KEYS.map((key) => {
                const current =
                  variantOverrides[key] ??
                  componentSelection[key]?.variant ??
                  "";
                const options = SECTION_VARIANTS[key] as readonly string[];
                return (
                  <div key={key} className="flex items-center gap-2">
                    <span className="w-20 shrink-0 text-[10px] capitalize text-zinc-500">
                      {key}
                    </span>
                    <select
                      value={current}
                      onChange={(e) => {
                        const v = e.target.value;
                        setVariantOverrides((prev) => ({
                          ...prev,
                          [key]: v,
                        }));
                      }}
                      className="min-w-0 flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-1.5 py-1 text-[11px]"
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

            <button
              type="button"
              onClick={() => setVariantOverrides({})}
              className="mt-3 w-full rounded-lg border border-zinc-700 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
            >
              Clear variant overrides (use DNA pack only)
            </button>
          </div>
        )}
      </div>

      <DesignEngine config={config} profile={LAB_PROFILE} />
    </div>
  );
}
