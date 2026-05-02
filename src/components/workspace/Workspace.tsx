"use client";

import { useState } from "react";
import type { Database } from "@/types/database";
import { Sidebar } from "@/components/workspace/Sidebar";
import { Notepad } from "@/components/workspace/Notepad";
import { ToolPanel } from "@/components/workspace/ToolPanel";
import { WelcomeBanner } from "@/components/workspace/WelcomeBanner";
import { Badge } from "@/components/ui/Badge";
import type { ToolId } from "@/lib/constants/tools";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const LEVEL_LABEL: Record<Profile["level"], string> = {
  medico: "Médico",
  residente: "Residente",
  interno: "Interno",
};

interface WorkspaceProps {
  profile: Profile;
  initialContent: string;
  initialUpdatedAt: string | null;
  isWelcome: boolean;
}

export function Workspace({
  profile,
  initialContent,
  initialUpdatedAt,
  isWelcome,
}: WorkspaceProps) {
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar activeTool={activeTool} onSelectTool={setActiveTool} />

      <main className="flex-1 min-w-0">
        <div className="mx-auto max-w-5xl px-4 py-6 pl-16 md:py-10 md:pl-8 md:pr-8">
          <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-overline uppercase text-brand-700">
                Workspace · {profile.slug}
              </p>
              <h1 className="mt-1 text-h2 text-neutral-900">
                Olá, {profile.full_name.split(" ")[0]}.
              </h1>
              <p className="mt-1 text-body text-neutral-600">
                {profile.hospital}
              </p>
            </div>
            <Badge variant="brand">{LEVEL_LABEL[profile.level]}</Badge>
          </header>

          {isWelcome && <WelcomeBanner slug={profile.slug} />}

          <div className={activeTool ? "grid gap-6 lg:grid-cols-2" : ""}>
            <Notepad
              slug={profile.slug}
              initialContent={initialContent}
              initialUpdatedAt={initialUpdatedAt}
            />

            {activeTool && (
              <ToolPanel toolId={activeTool} onClose={() => setActiveTool(null)} />
            )}
          </div>

          <footer className="mt-10 border-t border-neutral-200 pt-6">
            <p className="text-caption text-neutral-400">
              Apoio à decisão clínica. Não substitui julgamento médico nem prontuário oficial.
              Não inclua dados identificáveis de pacientes.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
