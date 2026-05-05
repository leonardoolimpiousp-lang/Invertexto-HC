"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Calculator, BookOpen, Pill, Bug, Stethoscope } from "lucide-react";
import { CID10_DATA } from "@/lib/constants/cid10";
import { rankLocalCalculators } from "@/lib/calculators/local-ranking";
import { localCalculatorCatalog } from "@/lib/calculators/catalog";
import type { ContextName } from "@/lib/calculators/types";
import type { ContextType, EspecialidadeBase } from "@/lib/constants/specialties";
import type { ToolId } from "@/lib/constants/tools";
import type { Cid10RecommendationOutput } from "@/lib/cid10/types";
import type { DiseaseGuideRecommendationOutput } from "@/lib/disease-guides/types";

interface TagSuggestionsProps {
  hdList: string[];
  context: ContextType;
  specialty?: EspecialidadeBase;
  onSelectTool: (toolId: ToolId, itemId?: string) => void;
}

interface ToolSuggestion {
  id: ToolId;
  label: string;
  icon: React.ElementType;
}

const TOOL_META: Partial<Record<ToolId, ToolSuggestion>> = {
  calculadoras: { id: "calculadoras", label: "Calculadoras", icon: Calculator },
  cid: { id: "cid", label: "CID-10", icon: Search },
  receituarios: { id: "receituarios", label: "Receituários", icon: Pill },
  antimicrobianos: { id: "antimicrobianos", label: "Antimicrobianos", icon: Bug },
  guias: { id: "guias", label: "Guias", icon: BookOpen },
  diluicao: { id: "diluicao", label: "Diluição & dose", icon: Calculator },
  procedimentos: { id: "procedimentos", label: "Guia de Procedimentos", icon: Stethoscope },
};

const CONTEXT_TOOLS: Record<ContextType, ToolId[]> = {
  ps: ["calculadoras", "antimicrobianos", "receituarios"],
  uti: ["calculadoras", "diluicao", "antimicrobianos"],
  ambulatorial: ["receituarios", "guias", "cid"],
  sala_de_emergencia: ["calculadoras", "antimicrobianos", "receituarios"],
  cirurgia: ["calculadoras", "antimicrobianos"],
  enfermaria: ["calculadoras", "antimicrobianos", "receituarios", "guias"],
};

const SPECIALTY_TOOLS: Partial<Record<EspecialidadeBase, ToolId[]>> = {
  cirurgia: ["calculadoras", "antimicrobianos"],
  clinica_medica: ["calculadoras", "guias"],
  pediatria: ["calculadoras", "receituarios"],
  ginecologia: ["guias", "receituarios"],
  obstetricia: ["calculadoras", "guias"],
};

const CALCULATOR_CONTEXTS: Record<ContextType, ContextName[]> = {
  ps: ["PS"],
  uti: ["UTI"],
  ambulatorial: ["Ambulatorio"],
  sala_de_emergencia: ["Sala de Emergencia"],
  cirurgia: ["PS", "Enfermaria"],
  enfermaria: ["Enfermaria"],
};

export function TagSuggestions({ hdList, context, specialty, onSelectTool }: TagSuggestionsProps) {
  const [cidSuggestions, setCidSuggestions] = useState<Cid10RecommendationOutput[]>([]);
  const [guideSuggestions, setGuideSuggestions] = useState<DiseaseGuideRecommendationOutput[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    async function runCidRecommend() {
      if (!hdList.length) {
        setCidSuggestions([]);
        return;
      }

      try {
        const response = await fetch("/api/cid10/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hypotheses: hdList, limit: 6 }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Falha ao recomendar CID-10");
        }

        const data = (await response.json()) as { results?: Cid10RecommendationOutput[] };
        setCidSuggestions(Array.isArray(data.results) ? data.results : []);
      } catch {
        const seen = new Set<string>();
        const localResults: Cid10RecommendationOutput[] = [];

        for (const hd of hdList) {
          const words = hd
            .toLowerCase()
            .split(/\s+/)
            .filter((w) => w.length > 3);

          if (!words.length) continue;

          for (const cid of CID10_DATA) {
            if (seen.has(cid.code)) continue;
            const desc = cid.description.toLowerCase();
            const matches = words.filter((w) => desc.includes(w));
            if (matches.length) {
              seen.add(cid.code);
              localResults.push({
                code: cid.code,
                description: cid.description,
                score: matches.length,
                matchedTerms: matches,
              });
            }
            if (localResults.length >= 6) break;
          }
          if (localResults.length >= 6) break;
        }

        setCidSuggestions(localResults);
      }
    }

    void runCidRecommend();
    return () => controller.abort();
  }, [hdList]);

  useEffect(() => {
    const controller = new AbortController();

    async function runGuideRecommend() {
      if (!hdList.length) {
        setGuideSuggestions([]);
        return;
      }

      try {
        const response = await fetch("/api/guides/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            context: CALCULATOR_CONTEXTS[context],
            hypotheses: hdList,
            limit: 3,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Falha ao recomendar guias");
        }

        const data = (await response.json()) as { results?: DiseaseGuideRecommendationOutput[] };
        setGuideSuggestions(Array.isArray(data.results) ? data.results : []);
      } catch {
        setGuideSuggestions([]);
      }
    }

    void runGuideRecommend();
    return () => controller.abort();
  }, [context, hdList]);

  const calculatorSuggestions = useMemo(() => {
    if (!hdList.length) return [];

    return rankLocalCalculators({
      context: CALCULATOR_CONTEXTS[context],
      hypotheses: hdList,
      limit: 5,
    });
  }, [hdList, context]);

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
                onClick={() => onSelectTool("cid", cid.code)}
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

      {calculatorSuggestions.length > 0 && (
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-caption font-medium text-neutral-500">
            <Calculator className="h-3.5 w-3.5" aria-hidden />
            Calculadoras ranqueadas
          </p>
          <div className="flex flex-wrap gap-2">
            {calculatorSuggestions.map((calc, index) => {
              const calcSlug = localCalculatorCatalog.find((item) => item.name === calc.name)?.slug;
              return (
              <button
                key={calc.name}
                type="button"
                onClick={() => onSelectTool("calculadoras", calcSlug)}
                title={`Score ${calc.score}. Tags: ${calc.matchedTags.join(", ") || "contexto"}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-3 py-1 text-caption font-medium text-brand-700 transition-colors hover:bg-brand-100"
              >
                <span className="font-mono text-[10px] text-brand-500">#{index + 1}</span>
                <Calculator className="h-3.5 w-3.5" aria-hidden />
                {calc.name}
              </button>
              );
            })}
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

      {guideSuggestions.length > 0 && (
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-caption font-medium text-neutral-500">
            <BookOpen className="h-3.5 w-3.5" aria-hidden />
            Guias por doença sugeridos
          </p>
          <div className="flex flex-wrap gap-2">
            {guideSuggestions.map((guide, index) => (
              <button
                key={guide.id}
                type="button"
                onClick={() => onSelectTool("guias", guide.id)}
                title={`Score ${guide.score}. Tags: ${guide.matchedTags.join(", ") || "contexto"}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-3 py-1 text-caption font-medium text-brand-700 transition-colors hover:bg-brand-100"
              >
                <span className="font-mono text-[10px] text-brand-500">#{index + 1}</span>
                <BookOpen className="h-3.5 w-3.5" aria-hidden />
                {guide.disease}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
