"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ContextName } from "@/lib/calculators/types";
import { localDiseaseGuidesCatalog } from "@/lib/disease-guides/catalog";
import type { DiseaseGuideRecommendationOutput } from "@/lib/disease-guides/types";

const CONTEXT_OPTIONS: ContextName[] = ["PS", "UTI", "Sala de Emergencia", "Enfermaria", "Ambulatorio"];

function parseHdInput(value: string): string[] {
  return value
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

interface GuiasDoencaPanelProps {
  initialId?: string;
}

export function GuiasDoencaPanel({ initialId }: GuiasDoencaPanelProps = {}) {
  const [contexts, setContexts] = useState<ContextName[]>(["PS"]);
  const guideRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (initialId && guideRefs.current[initialId]) {
      guideRefs.current[initialId]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [initialId]);
  const [hdInput, setHdInput] = useState("");
  const [results, setResults] = useState<DiseaseGuideRecommendationOutput[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rankedById = useMemo(
    () => new Map(results.map((item, index) => [item.id, index + 1])),
    [results],
  );

  const catalogView = useMemo(() => {
    if (!results.length) {
      return localDiseaseGuidesCatalog;
    }
    const scoreById = new Map(results.map((item) => [item.id, item.score]));
    return [...localDiseaseGuidesCatalog].sort((a, b) => (scoreById.get(b.id) ?? -1) - (scoreById.get(a.id) ?? -1));
  }, [results]);

  const toggleContext = (ctx: ContextName) => {
    setContexts((prev) => {
      if (prev.includes(ctx)) {
        return prev.filter((item) => item !== ctx);
      }
      return [...prev, ctx];
    });
  };

  const handleRank = async () => {
    const hypotheses = parseHdInput(hdInput);
    if (!contexts.length) {
      setError("Selecione ao menos um contexto clínico.");
      return;
    }
    if (!hypotheses.length) {
      setError("Preencha ao menos uma HD para ranquear.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/guides/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: contexts,
          hypotheses,
          limit: 5,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao ranquear guias");
      }

      const data = (await response.json()) as { results: DiseaseGuideRecommendationOutput[] };
      setResults(data.results);
    } catch {
      setError("Não foi possível ranquear os guias agora.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-neutral-200 bg-white p-4">
        <h3 className="text-small font-semibold text-neutral-800">Contexto e HD da consulta</h3>
        <p className="mt-1 text-xs text-neutral-500">
          Defina o contexto no início e as HDs no fim para priorizar os guias por doença.
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {CONTEXT_OPTIONS.map((ctx) => {
            const active = contexts.includes(ctx);
            return (
              <button
                key={ctx}
                type="button"
                onClick={() => toggleContext(ctx)}
                className={`rounded-full px-3 py-1 text-caption font-medium transition-colors ${
                  active
                    ? "bg-brand-600 text-white"
                    : "border border-neutral-200 bg-white text-neutral-600 hover:border-brand-300 hover:text-brand-700"
                }`}
              >
                {ctx}
              </button>
            );
          })}
        </div>

        <label className="mt-4 block text-small font-medium text-neutral-700">HDs / hipóteses</label>
        <textarea
          value={hdInput}
          onChange={(event) => setHdInput(event.target.value)}
          placeholder="Ex: sepse, pneumonia, insuficiência cardíaca"
          className="mt-1 min-h-[90px] w-full rounded-lg border border-neutral-200 px-3 py-2 text-body text-neutral-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />

        <button
          type="button"
          onClick={handleRank}
          disabled={loading}
          className="mt-3 w-full rounded-lg bg-brand-600 px-4 py-2.5 text-small font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {loading ? "Ranqueando..." : "Ranquear guias por doença"}
        </button>

        {error ? <p className="mt-2 text-caption text-red-600">{error}</p> : null}
      </section>

      <section className="space-y-3">
        {catalogView.map((guide) => (
          <article
            key={guide.id}
            ref={(el) => {
              guideRefs.current[guide.id] = el;
            }}
            className={`rounded-xl border bg-white p-4 ${
              guide.id === initialId ? "border-brand-500 ring-2 ring-brand-100" : "border-neutral-200"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-body font-semibold text-neutral-800">{guide.disease}</h4>
              {rankedById.has(guide.id) ? (
                <span className="rounded-full bg-brand-100 px-2 py-1 text-caption font-semibold text-brand-700">
                  #{rankedById.get(guide.id)}
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-caption text-neutral-500">
              Contextos: {guide.contexts.join(", ")} · Tags HD: {guide.hdTags.map((tag) => tag.name).join(", ")}
            </p>

            <div className="mt-3 space-y-3">
              {guide.sections.map((section) => (
                <div key={section.title}>
                  <p className="text-caption font-semibold text-neutral-700">{section.title}</p>
                  <ul className="mt-1 space-y-1">
                    {section.content.map((line, index) => (
                      <li key={`${section.title}-${index}`} className="text-caption text-neutral-600">
                        - {line}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
