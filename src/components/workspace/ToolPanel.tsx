"use client";

import { X, Hammer } from "lucide-react";
import { TOOLS, type ToolId } from "@/lib/constants/tools";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

// Tool Panels
import { CalculadorasPanel } from "@/components/tools/CalculadorasPanel";
import { EscoresPanel } from "@/components/tools/EscoresPanel";
import { CidPanel } from "@/components/tools/CidPanel";
import { ReceituariosPanel } from "@/components/tools/ReceituariosPanel";
import { PlantonistaPanel } from "@/components/tools/PlantonistaPanel";
import { ProcedimentosPanel } from "@/components/tools/ProcedimentosPanel";

interface ToolPanelProps {
  toolId: ToolId;
  onClose: () => void;
}

export function ToolPanel({ toolId, onClose }: ToolPanelProps) {
  const tool = TOOLS.find((t) => t.id === toolId);
  if (!tool) return null;

  const renderContent = () => {
    switch (toolId) {
      case "calculadoras":
        return <CalculadorasPanel />;
      case "escores":
        return <EscoresPanel />;
      case "cid":
        return <CidPanel />;
      case "receituarios":
        return <ReceituariosPanel />;
      case "plantonista":
        return <PlantonistaPanel />;
      case "procedimentos":
        return <ProcedimentosPanel />;
      default:
        return (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-500">
              <Hammer className="h-6 w-6" aria-hidden />
            </div>
            <div className="max-w-xs">
              <Badge variant="warning" className="mb-3">
                Em construção
              </Badge>
              <h3 className="text-h4 text-neutral-800">
                {tool.label} chegará na próxima sprint
              </h3>
              <p className="mt-2 text-small text-neutral-600">
                Esta ferramenta está em curadoria com preceptores. Acompanha a referência{" "}
                <span className="font-mono">{tool.prdRef}</span> do PRD.
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Voltar ao notepad
            </Button>
          </div>
        );
    }
  };

  return (
    <aside
      role="complementary"
      aria-label={`Painel: ${tool.label}`}
      className="flex h-full flex-col rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden"
    >
      <header className="flex items-center justify-between border-b border-neutral-200 p-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-100 text-brand-700">
            <tool.icon className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="text-h4 text-neutral-800">{tool.label}</h2>
            <p className="text-small text-neutral-500">{tool.description}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar painel"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {renderContent()}
      </div>
    </aside>
  );
}
