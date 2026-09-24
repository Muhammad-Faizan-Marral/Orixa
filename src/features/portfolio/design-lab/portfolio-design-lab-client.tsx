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
  isPremium = false,
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

  const [dna, setDna] = useState<ThemeId>(getThemeIdFromPreferences(initialPrefs));
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
  const [activeSection, setActiveSection] = useState<SectionKey>("hero");
  // ── Derived config ──────────────────────────────────────────────────────────

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

  // ── Handlers ────────────────────────────────────────────────────────────────

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

    // Free user cannot save premium DNA
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

  // ── Controls content (shared) ───────────────────────────────────────────────

  const ControlsContent = (
    <div className="space-y-5 p-4 pb-6">
      {/* Theme */}
      <div>
        <SectionLabel>Theme ecosystem</SectionLabel>
        <div className="flex flex-wrap gap-1.5">
          {listThemesForLab(isPremium).map((theme) => {
            const d = theme.id;
            const locked = !isPremium && theme.premium;
            return (
              <button
                key={d}
                type="button"
                onClick={() => applyDna(d)}
                title={
                  locked
                    ? "Premium — preview only. Upgrade to apply."
                    : undefined
                }
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize transition-all ${
                  dna === d
                    ? "bg-violet-600 text-white shadow-md shadow-violet-900/40"
                    : "bg-zinc-800/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                }`}
              >
                {theme.name}
                {locked ? " ★" : ""}
              </button>
            );
          })}
        </div>
        {!isPremium && isPremiumTheme(dna) && (
          <p className="mt-2 text-[11px] text-amber-400/90">
            Preview only.{" "}
            <Link href="/pricing" className="underline underline-offset-2">
              Upgrade to Premium
            </Link>{" "}
            to save this design.
          </p>
        )}
      </div>

      <Divider />

      {/* Current theme section variants */}
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
        <div className="mb-3 flex flex-wrap gap-1.5">
          {SECTION_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveSection(key)}
              className={`rounded-lg px-2 py-1 text-[10px] capitalize ${activeSection === key ? "bg-violet-600 text-white" : "bg-zinc-800 text-zinc-400"}`}
            >
              {key}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="w-[4.5rem] shrink-0 text-[10px] capitalize text-zinc-500">
            {activeSection}
          </span>
          <select
            value={
              variantOverrides[activeSection] ??
              componentSelection[activeSection]?.variant ??
              ""
            }
            onChange={(e) =>
              setVariantOverrides((prev) => ({
                ...prev,
                [activeSection]: e.target.value,
              }))
            }
            className="min-w-0 flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-[11px] text-zinc-300 focus:border-violet-500 focus:outline-none"
          >
            {getSectionVariantsForTheme(dna, activeSection).map((variant) => (
              <option key={variant} value={variant}>
                {variant}
              </option>
            ))}
          </select>
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
