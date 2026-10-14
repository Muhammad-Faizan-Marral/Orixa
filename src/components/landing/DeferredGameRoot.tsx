"use client";

import { useEffect, useState, type ComponentType } from "react";

/**
 * Defers the optional landing-page easter egg until the browser is idle.
 * This keeps its puzzle components out of the initial homepage JavaScript path.
 */
export default function DeferredGameRoot() {
  const [GameRoot, setGameRoot] = useState<ComponentType | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: number | undefined;
    let idleId: number | undefined;

    const loadGame = () => {
      void import("@/components/landing/game/GameRoot")
        .then(({ default: LoadedGameRoot }) => {
          if (!cancelled) setGameRoot(() => LoadedGameRoot);
        })
        .catch(() => {
          // The game is a non-essential easter egg; never block the page on it.
        });
    };

    const idleWindow = window as Window & {
      requestIdleCallback?: (
        callback: IdleRequestCallback,
        options?: IdleRequestOptions,
      ) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (typeof idleWindow.requestIdleCallback === "function") {
      idleId = idleWindow.requestIdleCallback(loadGame, { timeout: 2500 });
    } else {
      timeoutId = window.setTimeout(loadGame, 1200);
    }

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      if (idleId !== undefined) idleWindow.cancelIdleCallback?.(idleId);
    };
  }, []);

  if (!GameRoot) return null;
  return <GameRoot />;
}
