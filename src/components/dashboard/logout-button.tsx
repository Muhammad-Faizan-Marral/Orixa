"use client";

import { logout } from "@/actions/auth/logout";

export function LogoutButton({ className }: { className?: string }) {
  return (
    <form action={logout}>
      <button
        type="submit"
        className={
          className ??
          "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-500/50 dark:hover:text-red-400"
        }
      >
        <svg
          className="size-[18px] shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          aria-hidden="true"
        >
          <path
            d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 17l5-5-5-5M21 12H9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Log out
      </button>
    </form>
  );
}