"use client";

import { useMemo, useState } from "react";
import type { ContextName } from "@/lib/calculators/types";
import { localPrescriptionGuideCatalog } from "@/lib/prescription-guides/catalog";
import type { PrescriptionGuideRecommendationOutput } from "@/lib/prescription-guides/types";
import { normalizeText } from "@/lib/calculators/text";

const CONTEXT_OPTIONS: ContextName[] = ["PS", "UTI", "Sala de Emergencia", "Enfermaria", "Ambulatorio"];

interface GuiaPrescricaoPanelProps {
  initialContexts?: ContextName[];
  initialHypotheses?: string[];
}

export function GuiaPrescricaoPanel({ initialContexts, initialHypotheses }: GuiaPrescricaoPanelProps) {
  const [contexts, setContexts] = useState<ContextName[]>(initialContexts && initialContexts.length > 0 ? initialContexts : ["PS"]);
  const [hypothesesInput, setHypothesesInput] = useState((initialHypotheses ?? []).join(", "));
  const [results, setResults] = useState<PrescriptionGuideRecommendationOutput[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rankedIds = useMemo(() => new Map(results.map((item, idx) => [item.id, idx + 1])), [results]);

  const parsedHypotheses = useMemo(
    () =>
      hypothesesInput
        .split(/[\n,;]+/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0),
    [hypothesesInput],
  );

  const visibleCatalog = useMemo(() => {
    if (results.length === 0) {
      return localPrescriptionGuideCatalog;
    }

    const rankById = new Map(results.map((item) => [item.id, item.score]));
    return [...localPrescriptionGuideCatalog].sort((a, b) => (rankById.get(b.id) ?? -1) - (rankById.get(a.id) ?? -1));
  }, [results]);

  const toggleContext = (ctx: ContextName) => {
    setContexts((prev) => {
      const exists = prev.some((item) => normalizeText(item) === normalizeText(ctx));
      if (exists) {
        return prev.filter((item) => normalizeText(item) !== normalizeText(ctx));
      }
      return [...prev, ctx];
    });
  };

  const runRanking = async () => {
    if (contexts.length === 0) {
      setError("Selecione ao menos um contexto clínico.");
      return;
    }
    if (parsedHypotheses.length === 0) {
      setError("Informe ao menos uma HD para ranquear.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/prescription-guides/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: contexts,
          hypotheses: parsedHypotheses,
          limit: 5,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao ranquear guias");
      }

      const data = (await response.json()) as { results: PrescriptionGuideRecommendationOutput[] };
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
        <h3 className="text-small font-semibold text-neutral-800">Contexto clínico da consulta</h3>
        <p className="mt-1 text-xs text-neutral-500">
          Associe múltiplos contextos e HDs para gerar sugestões no final da consulta.
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {CONTEXT_OPTIONS.map((ctx) => {
            const active = contexts.includes(ctx);
            return (
              <button
                key={ctx}
                type="button"
                onClick={() => toggleContext(ctx)}
                className={`rounded-full px-3 py-1 text-caption font-medium ${
                  active ? "bg-brand-600 text-white" : "border border-neutral-200 bg-white text-neutral-600"
                }`}
              >
                {ctx}
              </button>
            );
          })}
        </div>

        <label className="mt-4 block text-small font-medium text-neutral-700">HDs (vírgula, enter ou ponto-e-vírgula)</label>
        <textarea
          value={hypothesesInput}
          onChange={(event) => setHypothesesInput(event.target.value)}
          placeholder="Ex: sepse, choque séptico, foco pulmonar"
          className="mt-1 min-h-[90px] w-full rounded-lg border border-neutral-200 px-3 py-2 text-body text-neutral-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />

        <button
          type="button"
          onClick={runRanking}
          disabled={loading}
          className="mt-3 w-full rounded-lg bg-brand-600 px-4 py-2.5 text-small font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {loading ? "Ranqueando..." : "Ranquear guias de prescrição"}
        </button>

        {error ? <p className="mt-2 text-caption text-red-600">{error}</p> : null}
      </section>

      <section className="space-y-3">
        {visibleCatalog.map((guide) => (
          <article key={guide.id} className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-body font-semibold text-neutral-800">{guide.name}</h4>
              {rankedIds.has(guide.id) ? (
                <span className="rounded-full bg-brand-100 px-2 py-1 text-caption font-semibold text-brand-700">
                  #{rankedIds.get(guide.id)}
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-caption text-neutral-500">
              Contextos: {guide.contexts.join(", ")} · Tags: {guide.tags.map((tag) => tag.name).join(", ")}
            </p>
            <pre className="mt-3 whitespace-pre-wrap rounded-lg border border-brand-100 bg-brand-50 p-3 font-mono text-xs text-neutral-800">
              {guide.prescription}
            </pre>
          </article>
        ))}
      </section>
    </div>
  );
}
