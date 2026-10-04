"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DesignEngine } from "@/portfolio-renderer/DesignEngine";
import {
  DEFAULT_COMPONENT_SELECTION,
  DEFAULT_DESIGN_PREFERENCES,
  type ComponentSelection,
} from "@/features/portfolio/component-variants";
import {
  getThemeIdFromPreferences,
  getSectionVariantsForTheme,
  listThemesForLab,
  normalizeSelectionForTheme,
} from "@/themes/lab-helpers";
import { getTheme } from "@/themes/registry";
import type { ThemeId } from "@/themes/types";
import type {
  PortfolioRenderConfig,
  PublicProfileMeta,
  RendererDesignPreferences,
} from "@/portfolio-renderer/types";
import { savePortfolioDesign } from "@/actions/portfolio/save-portfolio-design";
import { Button } from "@/components/UI/Button";
import { isPremiumTheme } from "@/constants/billing";

// ─── Types ────────────────────────────────────────────────────────────────────

type SectionKey = keyof ComponentSelection;
const SECTION_KEYS = Object.keys(DEFAULT_COMPONENT_SELECTION) as SectionKey[];

type Props = {
  portfolioId: string;
  portfolioTitle: string;
  profile: PublicProfileMeta;
  initialConfig: PortfolioRenderConfig;
  isPremium?: boolean;
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-violet-400/90">
      {children}
    </p>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function PortfolioDesignLabClient({ portfolioId, portfolioTitle, profile, initialConfig, isPremium = false}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string;} | null>(null);

  const [panelOpen, setPanelOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [comingSoonOpen, setComingSoonOpen] = useState(false);

  const initialSelection = useMemo(() => asComponentSelection(initialConfig.componentSelection),
    [initialConfig.componentSelection],
  );

  const initialPrefs = useMemo(
    () => asDesignPreferences(initialConfig.designPreferences),
    [initialConfig.designPreferences],
  );

  const [dna, setDna] = useState<ThemeId>(
    getThemeIdFromPreferences(initialPrefs),
  );

  const [variantOverrides, setVariantOverrides] = useState<Partial<Record<SectionKey, string>>>(() => {
    const o: Partial<Record<SectionKey, string>> = {};
    for (const key of SECTION_KEYS) {
      const v = initialSelection[key]?.variant;
      if (v) o[key] = v;
    }
    return o;
  });

  const [activeSection, setActiveSection] = useState<SectionKey>("hero");

  const contentOnly = useMemo(() => {
    return Object.fromEntries(
      Object.entries(initialConfig).filter(
        ([key]) => key !== "componentSelection" && key !== "designPreferences",
      ),
    ) as Omit<
      PortfolioRenderConfig,
      "componentSelection" | "designPreferences"
    >;
  }, [initialConfig]);

  const componentSelection: ComponentSelection = useMemo(() => {
    const base = normalizeSelectionForTheme(getTheme(dna), initialSelection);
    for (const key of SECTION_KEYS) {
      const override = variantOverrides[key];
      if (override) {
        base[key] = {
          enabled: base[key]?.enabled !== false,
          variant: override,
        };
      }
    }
    return base as ComponentSelection;
  }, [dna, initialSelection, variantOverrides]);

  const designPreferences: RendererDesignPreferences = useMemo(
    () => ({
      ...initialPrefs,
      themeId: dna,
      designDna: dna,
      themeMode: getTheme(dna).tokens.themeMode,
      accentColor: getTheme(dna).tokens.accentColor,
      fontFamily: getTheme(dna).tokens.fontSans,
      sectionVariants: Object.fromEntries(
        Object.entries(componentSelection).map(([key, value]) => [
          key,
          value.variant,
        ]),
      ),
    }),
    [initialPrefs, componentSelection, dna],
  );

  const liveConfig: PortfolioRenderConfig = useMemo(
    () => ({ ...contentOnly, componentSelection, designPreferences }),
    [contentOnly, componentSelection, designPreferences],
  );

  const applyDna = (next: ThemeId) => {
    setDna(next);
    setVariantOverrides({});
  };

  const handleReset = () => {
    setDna(getThemeIdFromPreferences(initialPrefs));
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

    if (!isPremium && isPremiumTheme(dna)) {
      setMessage({
        type: "error",
        text: "This is a Premium design. Upgrade to apply it, or pick a free DNA.",
      });
      return;
    }

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
  }, [
    portfolioId,
    componentSelection,
    designPreferences,
    router,
    isPremium,
    dna,
  ]);

  const labThemeOptions = useMemo(
    () => [
      ...listThemesForLab(isPremium),
      {
        id: "coming-soon" as const,
        name: "Coming Soon",
        description: "More premium portfolio experiences are on the way.",
        premium: false,
      },
    ],
    [isPremium],
  );

  const sectionVariants = getSectionVariantsForTheme(
    getTheme(dna),
    activeSection,
  );

  // ── Controls panel content ──────────────────────────────────────────────────

  const ControlsContent = (
    <div className="space-y-5 p-4 pb-6">
      {/* Themes */}
      <div>
        <SectionLabel>Designs</SectionLabel>
        <div className="space-y-2.5">
          {labThemeOptions.map((theme) => {
            const d = theme.id;
            const isComingSoon = d === "coming-soon";
            const locked = !isPremium && theme.premium;
            const isSelected = dna === d && !isComingSoon;

            return (
              <button
                key={d}
                type="button"
                onClick={() => {
                  if (isComingSoon) {
                    setComingSoonOpen(true);
                    return;
                  }
                  applyDna(d as ThemeId);
                }}
                title={
                  locked
                    ? "Premium — preview only. Upgrade to apply."
                    : isComingSoon
                      ? "More designs are on the way."
                      : undefined
                }
                className={`w-full rounded-2xl border p-3 text-left transition-all ${
                  isSelected
                    ? "border-violet-500 bg-violet-600/10 shadow-lg shadow-violet-900/20"
                    : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900"
                } ${isComingSoon ? "ring-1 ring-violet-500/40" : ""}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-zinc-100">
                        {theme.name}
                      </span>
                      {isComingSoon && (
                        <span className="rounded-full border border-violet-500/40 bg-violet-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-violet-300">
                          Soon
                        </span>
                      )}
                      {!isComingSoon && locked && (
                        <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-amber-300">
                          Premium
                        </span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-2 text-[11px] text-zinc-400">
                      {isComingSoon
                        ? "More premium portfolio experiences are on the way."
                        : theme.description}
                    </p>
                  </div>
                  {isSelected && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500 text-[10px] text-white">
                      ✓
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-zinc-800/70" />

      {/* Section picker */}
      <div>
        <SectionLabel>Section</SectionLabel>
        <div className="flex flex-wrap gap-1.5">
          {SECTION_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveSection(key)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-medium capitalize transition-colors ${
                activeSection === key
                  ? "bg-violet-600 text-white"
                  : "bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Variants for active section */}
      {sectionVariants.length > 0 && (
        <div>
          <SectionLabel>Variant — {activeSection}</SectionLabel>
          <div className="space-y-1.5">
            {sectionVariants.map((v) => {
              const current =
                variantOverrides[activeSection] ??
                componentSelection[activeSection]?.variant ??
                "default";
              const selected = current === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() =>
                    setVariantOverrides((prev) => ({
                      ...prev,
                      [activeSection]: v,
                    }))
                  }
                  className={`w-full rounded-xl border px-3 py-2 text-left text-xs transition-all ${
                    selected
                      ? "border-violet-500 bg-violet-600/10 text-violet-200"
                      : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  {v}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="relative min-h-screen bg-black">
      {/* ── Fixed top bar ─────────────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-[100] border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
        <div className="flex h-12 items-center justify-between gap-3 px-3 sm:px-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href={`/dashboard/portfolios/${portfolioId}`}
              className="shrink-0 rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              ← Back
            </Link>
            <div className="h-5 w-px shrink-0 bg-zinc-800" />
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-violet-400">
                Design Lab
              </p>
              <p className="truncate text-sm font-medium text-white">
                {portfolioTitle}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={isPending}
              className="hidden rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:bg-zinc-800 disabled:opacity-40 sm:inline-flex"
            >
              Reset
            </button>
            <Button
              type="button"
              variant="gradient"
              loading={isPending}
              onClick={handleSave}
              className="!h-8 !px-3 !text-xs"
            >
              {isPending ? "Saving…" : "Save design"}
            </Button>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:bg-zinc-800 lg:hidden"
            >
              Controls
            </button>
            <button
              type="button"
              onClick={() => setPanelOpen((v) => !v)}
              className="hidden rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:bg-zinc-800 lg:inline-flex"
            >
              {panelOpen ? "Hide panel" : "Controls"}
            </button>
          </div>
        </div>

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

      {/* ── FULL portfolio preview (no overflow clip, no nested box) ──────── */}
      <div className="min-h-screen pt-12">
        <DesignEngine config={liveConfig} profile={profile} />
      </div>

      {/* ── Desktop fixed right panel ─────────────────────────────────────── */}
      {panelOpen && (
        <aside className="fixed bottom-0 right-0 top-12 z-[90] hidden w-[320px] flex-col border-l border-zinc-800/80 bg-zinc-950/95 shadow-2xl backdrop-blur-md lg:flex">
          <div className="flex h-11 shrink-0 items-center justify-between border-b border-zinc-800/60 px-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-violet-400">
                Design Controls
              </p>
              <p className="text-[10px] text-zinc-500">Live preview</p>
            </div>
            <button
              type="button"
              onClick={() => setPanelOpen(false)}
              className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              title="Close panel"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">{ControlsContent}</div>

          <div className="shrink-0 space-y-2 border-t border-zinc-800/80 bg-zinc-950/95 p-3">
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
        </aside>
      )}

      {/* ── Coming soon modal ─────────────────────────────────────────────── */}
      {comingSoonOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[1.75rem] border border-violet-500/30 bg-zinc-950/95 p-6 shadow-[0_24px_80px_rgba(76,29,149,0.38)] sm:p-8">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-500/40 bg-violet-500/10 text-base text-violet-200">
                  ✦
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-violet-300">
                  Coming Soon
                </span>
              </div>
              <button
                type="button"
                onClick={() => setComingSoonOpen(false)}
                className="rounded-lg border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                More is on the way.
              </h2>
              <p className="text-sm leading-7 text-zinc-300">
                OrixaAI is continuously creating new premium portfolio
                experiences for you. New templates will be added to Design Lab
                over time.
              </p>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-violet-300">
                  Premium keeps you ahead
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-200">
                  Active yearly Premium plan users get access to new premium
                  templates as they are released.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile bottom drawer ──────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-2xl border-t border-zinc-800 bg-zinc-950 shadow-2xl">
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
                className="rounded-lg border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{ControlsContent}</div>
            <div className="shrink-0 space-y-2 border-t border-zinc-800 p-3">
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
