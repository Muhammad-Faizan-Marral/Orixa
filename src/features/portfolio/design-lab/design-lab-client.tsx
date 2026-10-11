"use client";

import { useState } from "react";
import { DesignEngine } from "@/portfolio-renderer/DesignEngine";
import { getTheme, listThemes } from "@/themes/registry";
import { normalizeSelectionForTheme } from "@/themes/lab-helpers";
import type { ThemeId } from "@/themes/types";
import { LAB_CONFIG_BASE, LAB_PROFILE } from "./dummy-data";

/**
 * Public Design Lab playground.
 * Dummy data only — all themes (free + premium) previewable.
 * No save/apply; premium lock still applies on real portfolio Design Lab.
 */
export function DesignLabClient() {
  const [themeId, setThemeId] = useState<ThemeId>("cinematic");
  const theme = getTheme(themeId);

  const config = {
    ...LAB_CONFIG_BASE,
    designPreferences: {
      ...LAB_CONFIG_BASE.designPreferences,
      themeId,
      designDna: themeId,
    },
    componentSelection: normalizeSelectionForTheme(theme, undefined),
  };

  return (
    <div className="min-h-screen">
      <div className="fixed bottom-4 right-4 z-99 flex flex-wrap gap-2 rounded-xl bg-black/80 p-3 max-w-[90vw]">
        {listThemes().map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setThemeId(item.id)}
            className={`rounded px-2 py-1 text-xs transition-colors ${
              themeId === item.id
                ? "bg-white text-black"
                : "text-white hover:bg-white/20"
            }`}
          >
            {item.name}
            {item.premium}
          </button>
        ))}
      </div>

      {/* isPremium: true → playground mein saari DNAs preview; real portfolios pe lock same */}
      <DesignEngine
        config={config}
        profile={{ ...LAB_PROFILE, isPremium: true }}
      />
    </div>
  );
}