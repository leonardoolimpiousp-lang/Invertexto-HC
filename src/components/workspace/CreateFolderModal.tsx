"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  CONTEXT_LABELS,
  ESPECIALIDADE_BASE_LABELS,
  SUBESPECIALIDADES,
  type ContextType,
  type EspecialidadeBase,
  type ClinicalFolder,
} from "@/lib/constants/specialties";

interface CreateFolderModalProps {
  onClose: () => void;
  onCreate: (data: Omit<ClinicalFolder, "id" | "createdAt" | "notes">) => void;
}

type Step = "context" | "specialty" | "subSpecialty";

const CONTEXT_DESCRIPTIONS: Record<ContextType, string> = {
  ps: "Atendimentos de urgência e emergência",
  uti: "Pacientes em terapia intensiva",
  ambulatorial: "Consultas eletivas por especialidade",
};

export function CreateFolderModal({ onClose, onCreate }: CreateFolderModalProps) {
  const [step, setStep] = useState<Step>("context");
  const [context, setContext] = useState<ContextType | null>(null);
  const [specialty, setSpecialty] = useState<EspecialidadeBase | null>(null);

  const handleContext = (ctx: ContextType) => {
    setContext(ctx);
    if (ctx === "ambulatorial") {
      setStep("specialty");
    } else {
      onCreate({ context: ctx, label: CONTEXT_LABELS[ctx] });
      onClose();
    }
  };

  const handleSpecialty = (spec: EspecialidadeBase) => {
    setSpecialty(spec);
    if (spec === "cirurgia" || spec === "clinica_medica") {
      setStep("subSpecialty");
    } else {
      onCreate({
        context: "ambulatorial",
        specialty: spec,
        label: `Ambulatório · ${ESPECIALIDADE_BASE_LABELS[spec]}`,
      });
      onClose();
    }
  };

  const handleSubSpecialty = (sub: string) => {
    onCreate({
      context: "ambulatorial",
      specialty: specialty!,
      subSpecialty: sub,
      label: `Ambulatório · ${sub}`,
    });
    onClose();
  };

  const subEsps = specialty ? SUBESPECIALIDADES[specialty] : undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-h3 text-neutral-900">Nova pasta clínica</h2>
            <p className="mt-0.5 text-caption text-neutral-400">
              {step === "context" && "Selecione o contexto clínico"}
              {step === "specialty" && "Selecione a especialidade"}
              {step === "subSpecialty" && "Selecione a subespecialidade"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {step === "context" && (
          <div className="space-y-2">
            {(["ps", "uti", "ambulatorial"] as ContextType[]).map((ctx) => (
              <button
                key={ctx}
                type="button"
                onClick={() => handleContext(ctx)}
                className="flex w-full flex-col rounded-xl border border-neutral-200 p-4 text-left transition-colors hover:border-brand-300 hover:bg-brand-50"
              >
                <span className="text-body font-semibold text-neutral-800">
                  {CONTEXT_LABELS[ctx]}
                </span>
                <span className="mt-0.5 text-caption text-neutral-500">
                  {CONTEXT_DESCRIPTIONS[ctx]}
                </span>
              </button>
            ))}
          </div>
        )}

        {step === "specialty" && (
          <div className="space-y-2">
            {(Object.entries(ESPECIALIDADE_BASE_LABELS) as [EspecialidadeBase, string][]).map(
              ([spec, label]) => (
                <button
                  key={spec}
                  type="button"
                  onClick={() => handleSpecialty(spec)}
                  className="flex w-full items-center rounded-xl border border-neutral-200 p-4 text-left transition-colors hover:border-brand-300 hover:bg-brand-50"
                >
                  <span className="text-body font-medium text-neutral-800">{label}</span>
                  {(spec === "cirurgia" || spec === "clinica_medica") && (
                    <span className="ml-auto text-caption text-neutral-400">
                      {SUBESPECIALIDADES[spec]?.length} opções →
                    </span>
                  )}
                </button>
              ),
            )}
            <button
              type="button"
              onClick={() => setStep("context")}
              className="mt-1 w-full text-left text-caption text-neutral-400 hover:text-neutral-600"
            >
              ← Voltar
            </button>
          </div>
        )}

        {step === "subSpecialty" && subEsps && (
          <div>
            <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
              {subEsps.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => handleSubSpecialty(sub)}
                  className="flex w-full items-center rounded-xl border border-neutral-200 px-4 py-3 text-left transition-colors hover:border-brand-300 hover:bg-brand-50"
                >
                  <span className="text-body text-neutral-800">{sub}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep("specialty")}
              className="mt-3 w-full text-left text-caption text-neutral-400 hover:text-neutral-600"
            >
              ← Voltar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
