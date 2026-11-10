import type { WorldQuality } from "../../schema";

export type QualityPreset = {
  trees: number;
  flowers: number;
  clouds: number;
  stars: number;
  dpr: number;
  shadows: boolean;
  shadowMapSize: number;
  antialias: boolean;
};

export const QUALITY_PRESETS: Record<WorldQuality, QualityPreset> = {
  high:   { trees: 300, flowers: 350, clouds: 25, stars: 600, dpr: 2,   shadows: true,  shadowMapSize: 2048, antialias: true },
  medium: { trees: 200, flowers: 220, clouds: 18, stars: 300, dpr: 1.5, shadows: true,  shadowMapSize: 1024, antialias: true },
  low:    { trees: 100, flowers: 100, clouds: 12, stars: 150, dpr: 1,   shadows: false, shadowMapSize: 512,  antialias: false },
};

const ORDER: WorldQuality[] = ["low", "medium", "high"];

export const lowerQuality = (q: WorldQuality): WorldQuality => ORDER[Math.max(0, ORDER.indexOf(q) - 1)];
const rank = (q: WorldQuality) => ORDER.indexOf(q);

/** CPU/RAM se starting guess (GPU ka andaza nahi). Asal decision runtime FrameGovernor leta hai. */
export function pickQuality(requested: WorldQuality): WorldQuality {
  if (typeof window === "undefined") return requested;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const coarse = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const cores = nav.hardwareConcurrency ?? 8;
  const mem = nav.deviceMemory ?? 8;

  let drop = 0;
  if (coarse) drop += 1;
  if (cores <= 4) drop += 1;
  if (mem <= 4) drop += 1;

  const idx = Math.max(0, ORDER.indexOf(requested) - Math.min(drop, 2));
  return ORDER[idx];
}

/* ---------- learned quality: pichle session me slow nikla to wahin se shuru ---------- */
const KEY = "orixa-cin-quality";
const TTL = 7 * 24 * 3600 * 1000;

/** "low", "medium", "high" ya "off" (WebGL band, sirf gradient). */
export function readStoredQuality(): WorldQuality | "off" | null {
  try {
    const [v, ts] = (localStorage.getItem(KEY) ?? "").split("|");
    if (!ts || Date.now() - Number(ts) > TTL) return null;
    return v === "off" || ORDER.includes(v as WorldQuality) ? (v as WorldQuality | "off") : null;
  } catch {
    return null;
  }
}
export function storeQuality(v: WorldQuality | "off") {
  try {
    localStorage.setItem(KEY, `${v}|${Date.now()}`);
  } catch {
    /* private mode / blocked storage: ignore */
  }
}
/** requested se start karo, magar stored value usse neeche ho to wahi lo. */
export function resolveInitialQuality(requested: WorldQuality): WorldQuality | "off" {
  const picked = pickQuality(requested);
  const stored = readStoredQuality();
  if (stored === "off") return "off";
  return stored && rank(stored) < rank(picked) ? stored : picked;
}

/**
 * WebGL available aur *hardware* accelerated hai? failIfMajorPerformanceCaveat software
 * rasterizers (SwiftShader / WARP / llvmpipe) ko reject karta hai, jo blocklisted drivers par
 * "kaam" to karte hain magar 1-3 fps par. Probe context foran release hota hai.
 */
export function isWebGLAvailable(): boolean {
  if (typeof document === "undefined") return true;
  const attempt = (type: "webgl2" | "webgl") => {
    const c = document.createElement("canvas");
    const gl = c.getContext(type, { failIfMajorPerformanceCaveat: true }) as WebGLRenderingContext | null;
    if (!gl) return false;
    let software = false;
    try {
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      const name = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : "";
      software = /swiftshader|llvmpipe|software|basic render|warp/i.test(name);
    } catch {
      /* ignore */
    }
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !software;
  };
  try {
    return attempt("webgl2") || attempt("webgl");
  } catch {
    return false;
  }
}
