"use client";

import { useState } from "react";
import { X, User } from "lucide-react";
import {
  CONTEXT_LABELS,
  ESPECIALIDADE_BASE_LABELS,
  SUBESPECIALIDADES,
  type ContextType,
  type EspecialidadeBase,
} from "@/lib/constants/specialties";

interface CreateFolderModalProps {
  onClose: () => void;
  onCreate: (data: {
    context: ContextType;
    specialty?: string | null;
    subSpecialty?: string | null;
    label: string;
    patientName: string;
    patientAge: string;
  }) => void;
}

type Step = "context" | "specialty" | "subSpecialty" | "patientInfo";

const CONTEXT_DESCRIPTIONS: Record<ContextType, string> = {
  ps: "Atendimentos de urgência e emergência",
  uti: "Pacientes em terapia intensiva",
  ambulatorial: "Consultas eletivas por especialidade",
  sala_de_emergencia: "Atendimento em sala de emergência",
  cirurgia: "Procedimentos cirúrgicos",
};

export function CreateFolderModal({ onClose, onCreate }: CreateFolderModalProps) {
  const [step, setStep] = useState<Step>("context");
  const [context, setContext] = useState<ContextType | null>(null);
  const [specialty, setSpecialty] = useState<EspecialidadeBase | null>(null);
  const [subSpecialty, setSubSpecialty] = useState<string | null>(null);
  
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");

  const handleContext = (ctx: ContextType) => {
    setContext(ctx);
    if (ctx === "ambulatorial") {
      setStep("specialty");
    } else {
      setStep("patientInfo");
    }
  };

  const handleSpecialty = (spec: EspecialidadeBase) => {
    setSpecialty(spec);
    if (spec === "cirurgia" || spec === "clinica_medica") {
      setStep("subSpecialty");
    } else {
      setStep("patientInfo");
    }
  };

  const handleSubSpecialty = (sub: string) => {
    setSubSpecialty(sub);
    setStep("patientInfo");
  };

  const handleFinish = () => {
    if (!context) return;
    
    let label = CONTEXT_LABELS[context];
    if (context === "ambulatorial" && specialty) {
      label = `Ambulatório · ${subSpecialty || ESPECIALIDADE_BASE_LABELS[specialty]}`;
    }

    onCreate({
      context,
      specialty: specialty,
      subSpecialty: subSpecialty,
      label,
      patientName,
      patientAge,
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
            <h2 className="text-h3 text-neutral-900">Nova nota clínica</h2>
            <p className="mt-0.5 text-caption text-neutral-400">
              {step === "context" && "Selecione o contexto clínico"}
              {step === "specialty" && "Selecione a especialidade"}
              {step === "subSpecialty" && "Selecione a subespecialidade"}
              {step === "patientInfo" && "Identificação do paciente"}
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

        {step === "patientInfo" && (
          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <label htmlFor="pname" className="text-xs font-medium text-neutral-500">Nome do Paciente</label>
                <input
                  id="pname"
                  autoFocus
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Nome completo ou iniciais"
                  className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-3 text-body text-neutral-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="page" className="text-xs font-medium text-neutral-500">Idade</label>
                <input
                  id="page"
                  type="text"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="Ex: 45 anos"
                  className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-3 text-body text-neutral-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
                />
              </div>
            </div>
            
            <button
              type="button"
              disabled={!patientName || !patientAge}
              onClick={handleFinish}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-4 text-body font-semibold text-white transition-all hover:bg-brand-700 disabled:opacity-50"
            >
              Começar nota
            </button>
            
            <button
              type="button"
              onClick={() => context === "ambulatorial" ? setStep("specialty") : setStep("context")}
              className="mt-1 w-full text-left text-caption text-neutral-400 hover:text-neutral-600"
            >
              ← Voltar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
