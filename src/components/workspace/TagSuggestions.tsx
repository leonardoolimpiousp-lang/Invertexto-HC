"use client";

import { useMemo } from "react";
import { Search, Calculator, BookOpen, Pill, Bug, Stethoscope } from "lucide-react";
import { CID10_DATA } from "@/lib/constants/cid10";
import { PROCEDIMENTOS } from "@/lib/constants/procedimentos";
import type { ContextType, EspecialidadeBase } from "@/lib/constants/specialties";
import type { ToolId } from "@/lib/constants/tools";

interface TagSuggestionsProps {
  hdList: string[];
  context: ContextType;
  specialty?: EspecialidadeBase;
  onSelectTool: (toolId: ToolId) => void;
}

interface ToolSuggestion {
  id: ToolId;
  label: string;
  icon: React.ElementType;
}

const TOOL_META: Partial<Record<ToolId, ToolSuggestion>> = {
  calculadoras: { id: "calculadoras", label: "Calculadoras", icon: Calculator },
  escores: { id: "escores", label: "Escores", icon: Calculator },
  cid: { id: "cid", label: "CID-10", icon: Search },
  receituarios: { id: "receituarios", label: "Receituários", icon: Pill },
  antimicrobianos: { id: "antimicrobianos", label: "Antimicrobianos", icon: Bug },
  guias: { id: "guias", label: "Guias", icon: BookOpen },
  diluicao: { id: "diluicao", label: "Diluição & dose", icon: Calculator },
  procedimentos: { id: "procedimentos", label: "Guia de Procedimentos", icon: Stethoscope },
};

const CONTEXT_TOOLS: Record<ContextType, ToolId[]> = {
  ps: ["calculadoras", "escores", "antimicrobianos", "receituarios"],
  uti: ["calculadoras", "diluicao", "antimicrobianos", "escores"],
  ambulatorial: ["receituarios", "guias", "cid"],
};

const SPECIALTY_TOOLS: Partial<Record<EspecialidadeBase, ToolId[]>> = {
  cirurgia: ["calculadoras", "antimicrobianos"],
  clinica_medica: ["calculadoras", "escores", "guias"],
  pediatria: ["calculadoras", "receituarios"],
  ginecologia: ["guias", "receituarios"],
  obstetricia: ["calculadoras", "guias"],
};

export function TagSuggestions({ hdList, context, specialty, onSelectTool }: TagSuggestionsProps) {
  const procedureSuggestions = useMemo(() => {
    if (!hdList.length) return [];
    const hdWords = hdList.map((hd) => hd.toLowerCase());
    return PROCEDIMENTOS.filter(
      (proc) =>
        proc.context.includes(context) &&
        proc.hdTags.some((tag) => hdWords.some((hd) => hd.includes(tag))),
    );
  }, [hdList, context]);

  const cidSuggestions = useMemo(() => {
    if (!hdList.length) return [];
    const seen = new Set<string>();
    const results: typeof CID10_DATA = [];

    for (const hd of hdList) {
      const words = hd
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 3);
      if (!words.length) continue;

      for (const cid of CID10_DATA) {
        if (seen.has(cid.code)) continue;
        const desc = cid.description.toLowerCase();
        const match = words.some((w) => desc.includes(w));
        if (match) {
          seen.add(cid.code);
          results.push(cid);
          if (results.length >= 6) break;
        }
      }
      if (results.length >= 6) break;
    }

    return results;
  }, [hdList]);

  const toolSuggestions = useMemo(() => {
    const ids = new Set<ToolId>([
      ...(CONTEXT_TOOLS[context] ?? []),
      ...(specialty ? SPECIALTY_TOOLS[specialty] ?? [] : []),
    ]);
    return Array.from(ids)
      .map((id) => TOOL_META[id])
      .filter(Boolean) as ToolSuggestion[];
  }, [context, specialty]);

  if (!hdList.length) return null;

  return (
    <div className="mt-2 space-y-4 rounded-xl border border-neutral-100 bg-neutral-50 p-5">
      <h3 className="text-overline uppercase text-brand-700">
        Sugestões baseadas nas HDs
      </h3>

      {cidSuggestions.length > 0 && (
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-caption font-medium text-neutral-500">
            <Search className="h-3.5 w-3.5" aria-hidden />
            CID-10 sugeridos
          </p>
          <div className="flex flex-wrap gap-2">
            {cidSuggestions.map((cid) => (
              <button
                key={cid.code}
                type="button"
                onClick={() => onSelectTool("cid")}
                title={`Abrir CID-10: ${cid.description}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-caption text-neutral-700 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
              >
                <span className="font-mono font-semibold text-brand-600">{cid.code}</span>
                <span>{cid.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {toolSuggestions.length > 0 && (
        <div>
          <p className="mb-2 text-caption font-medium text-neutral-500">
            Ferramentas sugeridas
          </p>
          <div className="flex flex-wrap gap-2">
            {toolSuggestions.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => onSelectTool(id)}
                className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-3 py-1 text-caption font-medium text-brand-700 transition-colors hover:bg-brand-100"
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {procedureSuggestions.length > 0 && (
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-caption font-medium text-neutral-500">
            <Stethoscope className="h-3.5 w-3.5" aria-hidden />
            Procedimentos sugeridos
          </p>
          <div className="flex flex-wrap gap-2">
            {procedureSuggestions.map((proc) => (
              <button
                key={proc.id}
                type="button"
                onClick={() => onSelectTool("procedimentos")}
                className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-3 py-1 text-caption font-medium text-brand-700 transition-colors hover:bg-brand-100"
              >
                <Stethoscope className="h-3.5 w-3.5" aria-hidden />
                {proc.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
