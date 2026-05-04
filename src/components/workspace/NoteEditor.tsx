"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Plus, X } from "lucide-react";
import { SaveStatus, type SaveState } from "@/components/workspace/SaveStatus";
import { TagSuggestions } from "@/components/workspace/TagSuggestions";
import type { Database } from "@/types/database";
import type { ToolId } from "@/lib/constants/tools";

type ClinicalFolder = Database["public"]["Tables"]["clinical_folders"]["Row"];
type ClinicalNote = Database["public"]["Tables"]["clinical_notes"]["Row"];

const PLACEHOLDERS: Record<string, string> = {
  ps: `Queixa principal:
HDA:
Medicações em uso:
Exame físico:
Exames / resultados:`,
  uti: `Evolução diária:
Parâmetros ventilatórios:
Hemodinâmica:
Drogas vasoativas:
Balanço hídrico:
Conduta:`,
  ambulatorial: `Queixa principal:
HDA:
Antecedentes / comorbidades:
Medicações em uso:
Exame físico:
Hipóteses diagnósticas iniciais:
Conduta:`,
};

interface NoteEditorProps {
  note: ClinicalNote;
  folder: ClinicalFolder;
  onBack: () => void;
  onUpdate: (updated: Partial<ClinicalNote> & { id: string }) => Promise<void>;
  onSelectTool: (toolId: ToolId) => void;
}

export function NoteEditor({ note, folder, onBack, onUpdate, onSelectTool }: NoteEditorProps) {
  const [content, setContent] = useState(note.content);
  const [hdInput, setHdInput] = useState("");
  const [hdList, setHdList] = useState<string[]>(note.hd_list || []);
  const [conductDoubts, setConductDoubts] = useState(note.conduct_doubts || false);
  const [unexpectedOutcome, setUnexpectedOutcome] = useState(note.unexpected_outcome || false);
  const [procedureInput, setProcedureInput] = useState("");
  const [procedures, setProcedures] = useState<string[]>(note.procedures || []);
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(note.updated_at);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const hasChanges =
      content !== note.content ||
      JSON.stringify(hdList) !== JSON.stringify(note.hd_list) ||
      conductDoubts !== note.conduct_doubts ||
      unexpectedOutcome !== note.unexpected_outcome ||
      JSON.stringify(procedures) !== JSON.stringify(note.procedures);
    if (!hasChanges) return;

    setSaveState("saving");
    debounceRef.current = setTimeout(() => {
      onUpdate({
        id: note.id,
        content,
        hd_list: hdList,
        conduct_doubts: conductDoubts,
        unexpected_outcome: unexpectedOutcome,
        procedures,
      });
      setLastSavedAt(new Date().toISOString());
      setSaveState("saved");
    }, 600);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [content, hdList, conductDoubts, unexpectedOutcome, procedures, note, onUpdate]);

  const addHD = () => {
    const trimmed = hdInput.trim();
    if (!trimmed || hdList.includes(trimmed)) return;
    setHdList((prev) => [...prev, trimmed]);
    setHdInput("");
  };

  const removeHD = (hd: string) => setHdList((prev) => prev.filter((h) => h !== hd));

  const addProcedure = () => {
    const trimmed = procedureInput.trim();
    if (!trimmed || procedures.includes(trimmed)) return;
    setProcedures((prev) => [...prev, trimmed]);
    setProcedureInput("");
  };

  const removeProcedure = (procedure: string) =>
    setProcedures((prev) => prev.filter((p) => p !== procedure));

  const contextLabel =
    folder.sub_specialty ??
    (folder.specialty
      ? folder.label
      : { ps: "Pronto-Socorro", uti: "UTI", ambulatorial: "Ambulatório", sala_de_emergencia: "Sala de Emergência", cirurgia: "Cirurgia" }[folder.context]);

  const placeholder = PLACEHOLDERS[folder.context] ?? PLACEHOLDERS.ambulatorial;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-h4 font-bold text-neutral-900">{note.title || "Nova nota"}</h2>
            <div className="flex items-center gap-2">
              <span className="text-overline uppercase text-brand-700">{contextLabel}</span>
              <span className="text-caption text-neutral-300">•</span>
              <p className="text-caption text-neutral-400">
                {new Date(note.created_at).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
        <SaveStatus state={saveState} lastSavedAt={lastSavedAt ? new Date(lastSavedAt) : null} />
      </div>

      {/* Prontuário */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        spellCheck
        aria-label="Conteúdo do prontuário"
        className="min-h-[42vh] w-full resize-y rounded-xl border border-neutral-200 bg-white p-5 font-mono text-body text-neutral-800 placeholder-neutral-400 shadow-sm transition-colors duration-fast focus:border-brand-600 focus:outline-none focus:ring-[3px] focus:ring-brand-100"
      />

      {/* HD / Lista de Problemas */}
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-5">
        <h3 className="mb-1 text-body font-semibold text-neutral-800">
          Quais as HD / Lista de Problemas?
        </h3>
        <p className="mb-3 text-caption text-neutral-500">
          As hipóteses diagnósticas geram sugestões de CID, calculadoras e guias.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={hdInput}
            onChange={(e) => setHdInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addHD();
              }
            }}
            placeholder="Ex: IAM, Pneumonia, HAS descompensada…"
            className="flex-1 rounded-lg border border-brand-200 bg-white px-3 py-2 text-body text-neutral-800 placeholder-neutral-400 focus:border-brand-600 focus:outline-none focus:ring-[3px] focus:ring-brand-100"
          />
          <button
            type="button"
            onClick={addHD}
            aria-label="Adicionar hipótese"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-40"
            disabled={!hdInput.trim()}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {hdList.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {hdList.map((hd) => (
              <span
                key={hd}
                className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-3 py-1 text-caption font-medium text-brand-700"
              >
                {hd}
                <button
                  type="button"
                  onClick={() => removeHD(hd)}
                  aria-label={`Remover ${hd}`}
                  className="text-brand-300 hover:text-brand-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Conduct Doubts */}
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-5">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={conductDoubts}
            onChange={(e) => setConductDoubts(e.target.checked)}
            className="h-5 w-5 rounded border-brand-300 text-brand-600 focus:ring-2 focus:ring-brand-600"
          />
          <span className="text-body font-medium text-neutral-800">
            Dúvidas em relação a conduta?
          </span>
        </label>
      </div>

      {/* Unexpected Outcome */}
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-5">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={unexpectedOutcome}
            onChange={(e) => setUnexpectedOutcome(e.target.checked)}
            className="h-5 w-5 rounded border-brand-300 text-brand-600 focus:ring-2 focus:ring-brand-600"
          />
          <span className="text-body font-medium text-neutral-800">
            Desfecho não previsto?
          </span>
        </label>
      </div>

      {/* Procedures */}
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-5">
        <h3 className="mb-1 text-body font-semibold text-neutral-800">
          Algum procedimento realizado?
        </h3>
        <p className="mb-3 text-caption text-neutral-500">
          Registre os procedimentos realizados durante o atendimento.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={procedureInput}
            onChange={(e) => setProcedureInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addProcedure();
              }
            }}
            placeholder="Ex: Intubação, Punção arterial, Cateterismo…"
            className="flex-1 rounded-lg border border-brand-200 bg-white px-3 py-2 text-body text-neutral-800 placeholder-neutral-400 focus:border-brand-600 focus:outline-none focus:ring-[3px] focus:ring-brand-100"
          />
          <button
            type="button"
            onClick={addProcedure}
            aria-label="Adicionar procedimento"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-40"
            disabled={!procedureInput.trim()}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {procedures.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {procedures.map((procedure) => (
              <span
                key={procedure}
                className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-3 py-1 text-caption font-medium text-brand-700"
              >
                {procedure}
                <button
                  type="button"
                  onClick={() => removeProcedure(procedure)}
                  aria-label={`Remover ${procedure}`}
                  className="text-brand-300 hover:text-brand-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <TagSuggestions
        hdList={hdList}
        context={folder.context}
        specialty={(folder.specialty as any) || undefined}
        onSelectTool={onSelectTool}
      />
    </div>
  );
}
