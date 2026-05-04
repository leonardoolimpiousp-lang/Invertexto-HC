"use client";

import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { PROCEDIMENTOS, type Procedimento } from "@/lib/constants/procedimentos";
import { CONTEXT_LABELS } from "@/lib/constants/specialties";
import type { ContextType } from "@/lib/constants/specialties";

function ProcedimentoCard({ proc }: { proc: Procedimento }) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const toggle = (i: number) =>
    setChecked((prev) => ({ ...prev, [i]: !prev[i] }));

  const copyText = () => {
    const text = `Procedimento: ${proc.name}\n\n${proc.steps.map((s) => `- ${s.text}`).join("\n")}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const completedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between p-4 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-2 text-left min-w-0 flex-1"
          >
            <span className="text-body font-semibold text-neutral-800 truncate">
              {proc.name}
            </span>
            {expanded ? (
              <ChevronUp className="h-4 w-4 shrink-0 text-neutral-400" />
            ) : (
              <ChevronDown className="h-4 w-4 shrink-0 text-neutral-400" />
            )}
          </button>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {completedCount > 0 && (
            <span className="text-caption text-neutral-500">
              {completedCount}/{proc.steps.length}
            </span>
          )}
          <button
            type="button"
            onClick={copyText}
            aria-label="Copiar texto do procedimento"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <ol className="border-t border-neutral-100 px-4 pb-4 pt-3 space-y-2">
          {proc.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-label={checked[i] ? "Desmarcar etapa" : "Marcar etapa como concluída"}
                className={`mt-0.5 h-5 w-5 shrink-0 rounded border transition-colors ${
                  checked[i]
                    ? "border-brand-600 bg-brand-600"
                    : "border-neutral-300 bg-white hover:border-brand-400"
                }`}
              >
                {checked[i] && <Check className="h-4 w-4 text-white" />}
              </button>
              <span
                className={`text-body leading-snug transition-colors ${
                  checked[i] ? "text-neutral-400 line-through" : "text-neutral-700"
                }`}
              >
                {step.text}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export function ProcedimentosPanel() {
  const [activeContext, setActiveContext] = useState<ContextType | "all">("all");

  const contexts: Array<ContextType | "all"> = ["all", "ps", "uti", "sala_de_emergencia", "cirurgia", "ambulatorial"];

  const filtered =
    activeContext === "all"
      ? PROCEDIMENTOS
      : PROCEDIMENTOS.filter((p) => p.context.includes(activeContext as ContextType));

  return (
    <div className="flex flex-col gap-4">
      {/* Context filter */}
      <div className="flex gap-2 flex-wrap">
        {contexts.map((ctx) => (
          <button
            key={ctx}
            type="button"
            onClick={() => setActiveContext(ctx)}
            className={`rounded-full px-3 py-1 text-caption font-medium transition-colors ${
              activeContext === ctx
                ? "bg-brand-600 text-white"
                : "border border-neutral-200 bg-white text-neutral-600 hover:border-brand-300 hover:text-brand-700"
            }`}
          >
            {ctx === "all" ? "Todos" : CONTEXT_LABELS[ctx]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 py-16 text-center">
          <p className="text-body font-medium text-neutral-500">
            Nenhum procedimento disponível para este contexto ainda.
          </p>
          <p className="mt-1 text-caption text-neutral-400">
            Mais procedimentos serão adicionados em breve.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((proc) => (
            <ProcedimentoCard key={proc.id} proc={proc} />
          ))}
        </div>
      )}
    </div>
  );
}
