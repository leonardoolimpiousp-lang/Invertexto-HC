"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { TOOLS, type ToolId } from "@/lib/constants/tools";
import { cn } from "@/lib/utils/cn";

interface SidebarProps {
  activeTool: ToolId | null;
  onSelectTool: (tool: ToolId | null) => void;
}

export function Sidebar({ activeTool, onSelectTool }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelect = (id: ToolId) => {
    onSelectTool(activeTool === id ? null : id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-3 top-3 z-30 inline-flex h-10 w-10 items-center justify-center rounded-md border border-neutral-200 bg-white shadow-sm md:hidden"
        aria-label="Abrir menu de ferramentas"
      >
        <Menu className="h-5 w-5 text-neutral-700" aria-hidden />
      </button>

      {/* overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-neutral-900/50 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-neutral-200 bg-white transition-transform duration-slow ease-out-soft",
          "md:sticky md:top-0 md:z-auto md:h-screen md:w-20 md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-4 md:justify-center md:px-0">
          <Logo size="sm" href="/" className="md:hidden" />
          <Link
            href="/"
            className="hidden md:flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-brand-600 to-brand-700 font-extrabold text-white shadow-sm focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            aria-label="Página inicial"
          >
            i
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <nav
          aria-label="Ferramentas clínicas"
          className="flex flex-1 flex-col gap-1 overflow-y-auto p-3 md:items-center md:p-2"
        >
          {TOOLS.map((tool) => {
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => handleSelect(tool.id)}
                aria-pressed={isActive}
                aria-label={tool.label}
                title={tool.label}
                className={cn(
                  "group flex items-center gap-3 rounded-md p-3 text-left transition-colors duration-fast",
                  "md:h-12 md:w-12 md:justify-center md:p-0",
                  isActive
                    ? "bg-brand-100 text-brand-700"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-brand-700",
                )}
              >
                <tool.icon className="h-5 w-5 shrink-0" aria-hidden />
                <span className="text-body font-medium md:hidden">{tool.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-neutral-200 p-3 md:flex md:justify-center">
          <span className="text-caption uppercase tracking-wider text-neutral-400">v0.1</span>
        </div>
      </aside>
    </>
  );
}
