"use client";
import type { ReactNode } from "react";

/** Card whose border light follows the cursor. Pure CSS variables, no re-renders. */
export default function SpotlightCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`spot surface-card shadow-elevated ${className}`}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
      }}>
      {children}
    </div>
  );
}
