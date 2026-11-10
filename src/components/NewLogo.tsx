"use client";

import Image from "next/image";
import { memo, useSyncExternalStore } from "react";

/* ---------- Per-theme config + tuning ----------
   Saari values `height` ka multiplier hain.
   Light/dark ko alag alag adjust karna ho to sirf yahan badlo. */

const LOGOS = {
  light: {
    image: "/neworixaaiimg.png",
    svg: "/neworixaaisvg.svg",
    tune: {
      boxW: 0.9, // symbol box width
      boxH: 0.8, // symbol box height
      markW: 1.31, // image width
      markH: 1.23, // image height
      markX: -0.325, // image left offset
      markY: -0.157, // image top offset
      wordH: 0.64, // wordmark height
      gap: 0.16, // symbol aur wordmark ke beech gap
    },
  },
  dark: {
    image: "/neworixaaiimg-dark.png",
    svg: "/neworixaaisvg-dark.svg",
    tune: {
      boxW: 0.9,
      boxH: 0.9,
      markW: 1.71,
      markH: 1.13,
      markX: -0.325,
      markY: -0.157,
      wordH: 0.64,
      gap: 0.16,
      
    },
  },
} as const;

/* ---------- Shared theme store (ek hi observer sab instances ke liye) ---------- */

const listeners = new Set<() => void>();
let cleanup: (() => void) | null = null;

function start() {
  const notify = () => listeners.forEach((l) => l());

  const observer = new MutationObserver(notify);
  const opts = {
    attributes: true,
    attributeFilter: ["class", "data-theme", "data-mode"],
  };
  observer.observe(document.documentElement, opts);
  observer.observe(document.body, opts);

  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", notify);

  cleanup = () => {
    observer.disconnect();
    mq.removeEventListener("change", notify);
  };
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (listeners.size === 1) start();

  return () => {
    listeners.delete(cb);
    if (listeners.size === 0) {
      cleanup?.();
      cleanup = null;
    }
  };
}

function readTheme(el: HTMLElement): boolean | null {
  const attr = el.getAttribute("data-theme") ?? el.getAttribute("data-mode");
  if (el.classList.contains("dark") || attr === "dark") return true;
  if (el.classList.contains("light") || attr === "light") return false;
  return null;
}

function getSnapshot(): boolean {
  const explicit =
    readTheme(document.documentElement) ?? readTheme(document.body);
  if (explicit !== null) return explicit;

  // koi explicit theme nahi -> system theme
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

const getServerSnapshot = () => false;

/* ---------------------------------- Component ---------------------------------- */

interface NewLogoProps {
  variant?: "auto" | "image" | "svg";
  theme?: "auto" | "dark" | "light";
  height?: number;
  className?: string;
  alt?: string;
  priority?: boolean;
}

function NewLogo({
  theme = "auto",
  height = 38,
  className = "",
  alt = "Orixa AI",
  priority = false,
}: NewLogoProps) {
  const autoDark = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const isDark = theme === "auto" ? autoDark : theme === "dark";
  const logo = isDark ? LOGOS.dark : LOGOS.light;
  const t = logo.tune;
  const markSize = height;

  return (
    <span
      className={`new-orixa-logo ${className}`}
      role="img"
      aria-label={alt}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: markSize * t.gap,
        height: markSize,
        width: "fit-content",
        flexShrink: 0,
        whiteSpace: "nowrap",
      }}
    >
      {/* Symbol */}
      <span
        style={{
          position: "relative",
          display: "block",
          width: markSize * t.boxW,
          height: markSize * t.boxH,
          overflow: "hidden", // debug ke liye: outline: "1px solid red" lagao
          flexShrink: 0,
        }}
      >
        <Image
          key={logo.image}
          src={logo.image}
          alt=""
          width={516}
          height={483}
          priority={priority}
          draggable={false}
          style={{
            position: "absolute",
            width: markSize * t.markW,
            height: markSize * t.markH,
            maxWidth: "none",
            left: markSize * t.markX,
            top: markSize * t.markY,
            objectFit: "contain",
          }}
        />
      </span>

      {/* SVG Wordmark */}
      <Image
        key={logo.svg}
        src={logo.svg}
        alt=""
        width={842}
        height={201}
        priority={priority}
        unoptimized
        draggable={false}
        style={{
          display: "block",
          height: markSize * t.wordH,
          width: "auto",
          maxWidth: "none",
          objectFit: "contain",
          flexShrink: 0,
        }}
      />
    </span>
  );
}

export default memo(NewLogo);