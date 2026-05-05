"use client";

import Link from "next/link";
import { Menu, NotebookPen, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { TOOLS, type ToolId } from "@/lib/constants/tools";
import { cn } from "@/lib/utils/cn";

interface SidebarProps {
  activeTool: ToolId | null;
  onSelectTool: (tool: ToolId | null) => void;
  onNotepadHome: () => void;
}

export function Sidebar({ activeTool, onSelectTool, onNotepadHome }: SidebarProps) {
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
          "md:sticky md:top-0 md:z-auto md:h-screen md:w-64 md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-4 md:px-5">
          <Logo size="sm" href="/" />
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
          className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2"
        >
          {/* Notepad — item fixo acima das ferramentas */}
          <button
            type="button"
            onClick={() => { onNotepadHome(); setMobileOpen(false); }}
            aria-label="Notepad"
            title="Notepad"
            className={cn(
              "group flex items-center gap-2 rounded-lg p-2 text-left transition-colors duration-fast",
              "text-neutral-600 hover:bg-neutral-100 hover:text-brand-700",
            )}
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-neutral-50 group-hover:bg-white">
              <NotebookPen className="h-4 w-4" aria-hidden />
            </div>
            <span className="text-caption font-semibold">Notepad</span>
          </button>
          <div className="my-1 border-t border-neutral-100 mx-2" />

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
                  "group flex items-center gap-2 rounded-lg p-2 text-left transition-colors duration-fast",
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-brand-700",
                )}
              >
                <div className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors",
                  isActive ? "bg-brand-100" : "bg-neutral-50 group-hover:bg-white"
                )}>
                  <tool.icon className="h-4 w-4" aria-hidden />
                </div>
                <span className="text-caption font-medium truncate">{tool.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-neutral-200 p-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-caption font-bold uppercase tracking-widest text-neutral-400">Versão Alpha 0.1</span>
          </div>
        </div>
      </aside>
    </>
  );
}
