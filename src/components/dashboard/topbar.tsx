"use client";

import Link from "next/link";
import { SidebarToggle } from "@/components/dashboard/sidebar-toggle";
import { Button } from "@/components/UI/Button";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl lg:px-8">
      <div className="flex items-center gap-3">
        <SidebarToggle />
        <span className="font-display text-[0.95rem] font-semibold text-foreground lg:hidden">
          Orixa<span className="text-gradient-ion">AI</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/dashboard/portfolios/new">
          <Button variant="gradient" size="sm">
            + New portfolio
          </Button>
        </Link>
      </div>
    </header>
  );
}
