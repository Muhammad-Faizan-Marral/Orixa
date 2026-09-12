"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
type ToastType = "success" | "error" | "info" | "warning";

type ToastItem = {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
};

type ToastContextValue = {
  toast: (opts: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
};

// ─── Context ──────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  // Safe no-op when used outside provider
  if (!ctx) return { toast: () => {}, dismiss: () => {} };
  return ctx;
}

// ─── Design tokens ────────────────────────────────────────────────────────────
const CONFIG = {
  success: {
    accent: "#22C55E",
    bg: "rgba(34,197,94,0.07)",
    border: "rgba(34,197,94,0.2)",
    glow: "rgba(34,197,94,0.12)",
    label: "text-emerald-800 dark:text-emerald-50",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
  error: {
    accent: "#EF4444",
    bg: "rgba(239,68,68,0.07)",
    border: "rgba(239,68,68,0.2)",
    glow: "rgba(239,68,68,0.12)",
    label: "text-red-800 dark:text-red-50",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
  warning: {
    accent: "#F59E0B",
    bg: "rgba(245,158,11,0.07)",
    border: "rgba(245,158,11,0.2)",
    glow: "rgba(245,158,11,0.12)",
    label: "text-amber-800 dark:text-amber-50",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    ),
  },
  info: {
    accent: "#3B82F6",
    bg: "rgba(59,130,246,0.07)",
    border: "rgba(59,130,246,0.2)",
    glow: "rgba(59,130,246,0.12)",
    label: "text-blue-800 dark:text-blue-50",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
} as const satisfies Record<
  ToastType,
  {
    accent: string;
    bg: string;
    border: string;
    glow: string;
    label: string;
    icon: ReactNode;
  }
>;

// ─── Single Toast ─────────────────────────────────────────────────────────────
function Toast({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const cfg = CONFIG[item.type];

  return (
    <div
      className={cn(
        "toast-item pointer-events-auto relative overflow-hidden",
        "flex items-start gap-3",
        "rounded-2xl px-4 py-3.5",
        "backdrop-blur-xl",
        cfg.label,
      )}
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        boxShadow: `0 8px 32px ${cfg.glow}, 0 2px 8px rgba(0,0,0,0.06)`,
      }}
    >
      {/* Left accent bar */}
      <span
        className="absolute left-0 inset-y-0 w-[3px] rounded-r-full"
        style={{ background: cfg.accent }}
        aria-hidden
      />

      {/* Type icon */}
      <svg
        className="w-5 h-5 shrink-0 mt-0.5"
        style={{ color: cfg.accent }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
        aria-hidden
      >
        {cfg.icon}
      </svg>

      {/* Text */}
      <div className="flex-1 min-w-0 ml-0.5">
        <p className="text-sm font-semibold leading-snug">{item.title}</p>
        {item.description ? (
          <p className="mt-1 text-xs leading-relaxed opacity-75">
            {item.description}
          </p>
        ) : null}
      </div>

      {/* Dismiss */}
      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        aria-label="Dismiss"
        className="shrink-0 rounded-lg p-1 opacity-40 hover:opacity-90 transition-opacity duration-150"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Auto-dismiss progress bar */}
      {item.duration && item.duration > 0 ? (
        <span
          className="toast-progress absolute bottom-0 left-0 right-0 h-[2px]"
          style={
            {
              background: cfg.accent,
              opacity: 0.35,
              "--dur": `${item.duration}ms`,
            } as React.CSSProperties
          }
          aria-hidden
        />
      ) : null}
    </div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (opts: Omit<ToastItem, "id">) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const item: ToastItem = { id, duration: 4_000, ...opts };
      setItems((prev) => [...prev.slice(-4), item]); // max 5 visible
      if (item.duration && item.duration > 0) {
        window.setTimeout(() => dismiss(id), item.duration);
      }
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <style>{`
        @keyframes toast-in {
          from { transform: translateX(calc(100% + 1.5rem)); opacity: 0; }
          to   { transform: translateX(0);                  opacity: 1; }
        }
        @keyframes bar-shrink {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
        .toast-item {
          animation: toast-in 0.38s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .toast-progress {
          transform-origin: left;
          animation: bar-shrink var(--dur, 4000ms) linear forwards;
        }
      `}</style>

      <div
        className="pointer-events-none fixed bottom-5 right-5 z-[90] flex w-full max-w-[22rem] flex-col gap-2.5"
        aria-live="polite"
        aria-atomic="false"
      >
        {items.map((item) => (
          <Toast key={item.id} item={item} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}