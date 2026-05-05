"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Check, Clock, Loader2, MessageSquareText, RefreshCcw } from "lucide-react";
import {
  getNoteEncounterClosedAt,
  getNotePatientDestination,
  getNotePlantaoRegistro,
  isNoteEncounterClosed,
  withClinicalNoteMetadata,
} from "@/lib/clinical-note-metadata";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type ClinicalFolder = Database["public"]["Tables"]["clinical_folders"]["Row"];
type ClinicalNote = Database["public"]["Tables"]["clinical_notes"]["Row"];

interface DuvidasPlantaoPanelProps {
  slug: string;
}

function parsePatientTitle(title: string | null): { name: string; age: string } {
  const fallback = { name: "Paciente sem identificação", age: "idade não informada" };
  if (!title) return fallback;

  const parts = title.split("-");
  if (parts.length < 2) return { name: title.trim(), age: "idade não informada" };

  const age = parts.pop()?.trim() || "idade não informada";
  const name = parts.join("-").trim() || fallback.name;

  return { name, age };
}

export function DuvidasPlantaoPanel({ slug }: DuvidasPlantaoPanelProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient() as any, []);
  const [notes, setNotes] = useState<ClinicalNote[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [registro, setRegistro] = useState("");
  const [isRegistroSaved, setIsRegistroSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const hasMissingColumnError = (error: any, column: string) => {
    const message = String(
      `${error?.code || ""} ${error?.message || ""} ${error?.details || ""} ${error?.hint || ""}`,
    ).toLowerCase();
    const normalizedColumn = column.toLowerCase();

    return (
      message.includes(normalizedColumn) &&
      (message.includes("does not exist") ||
        message.includes("schema cache") ||
        message.includes("could not find") ||
        message.includes("pgrst204"))
    );
  };

  const loadFlaggedNotes = useCallback(async () => {
    setIsLoading(true);
    setSaveMessage(null);

    try {
      const { data: foldersData, error: foldersError } = await supabase
        .from("clinical_folders")
        .select("id")
        .eq("slug", slug);

      if (foldersError) throw foldersError;

      const folderIds = (foldersData || []).map((folder: Pick<ClinicalFolder, "id">) => folder.id);
      if (!folderIds.length) {
        setNotes([]);
        setSelectedNoteId(null);
        return;
      }

      let { data: notesData, error: notesError } = await supabase
        .from("clinical_notes")
        .select("*")
        .in("folder_id", folderIds)
        .or("conduct_doubts.eq.true,unexpected_outcome.eq.true")
        .order("updated_at", { ascending: false });

      if (notesError && hasMissingColumnError(notesError, "conduct_doubts")) {
        ({ data: notesData, error: notesError } = await supabase
          .from("clinical_notes")
          .select("*")
          .in("folder_id", folderIds)
          .order("updated_at", { ascending: false }));
      }

      if (notesError) throw notesError;

      const nextNotes = ((notesData || []) as ClinicalNote[]).filter(
        (note) =>
          isNoteEncounterClosed(note) &&
          (Boolean(note.conduct_doubts) || Boolean(note.unexpected_outcome)),
      );
      setNotes(nextNotes);

      if (!nextNotes.length) {
        setSelectedNoteId(null);
        return;
      }

      setSelectedNoteId((current) => {
        if (current && nextNotes.some((note) => note.id === current)) return current;
        return nextNotes[0].id;
      });
    } catch (error) {
      console.error("Erro ao carregar dúvidas do plantão:", error);
      setSaveMessage("Não foi possível carregar os casos agora.");
    } finally {
      setIsLoading(false);
    }
  }, [slug, supabase]);

  useEffect(() => {
    void loadFlaggedNotes();
  }, [loadFlaggedNotes]);

  const selectedNote = notes.find((note) => note.id === selectedNoteId) || null;

  useEffect(() => {
    if (!selectedNote) {
      setRegistro("");
      setIsRegistroSaved(false);
      return;
    }

    const savedRegistro = getNotePlantaoRegistro(selectedNote);
    setRegistro(savedRegistro);
    setIsRegistroSaved(Boolean(savedRegistro));
    setSaveMessage(null);
  }, [selectedNote]);

  const handleSave = async () => {
    if (!selectedNote) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const trimmedRegistro = registro.trim();
      const updatedHdList = withClinicalNoteMetadata(selectedNote.hd_list, {
        patientDestination: getNotePatientDestination(selectedNote),
        encounterClosed: isNoteEncounterClosed(selectedNote),
        encounterClosedAt: getNoteEncounterClosedAt(selectedNote),
        plantaoRegistro: trimmedRegistro || null,
      });

      let { error } = await supabase
        .from("clinical_notes")
        .update({
          hd_list: updatedHdList,
          plantao_registro: trimmedRegistro || null,
          plantao_duvidas: trimmedRegistro || null,
          plantao_reflexoes: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedNote.id);

      if (error && hasMissingColumnError(error, "plantao_registro")) {
        ({ error } = await supabase
          .from("clinical_notes")
          .update({
            hd_list: updatedHdList,
            plantao_duvidas: trimmedRegistro || null,
            plantao_reflexoes: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", selectedNote.id));
      }

      if (error && hasMissingColumnError(error, "plantao_duvidas")) {
        ({ error } = await supabase
          .from("clinical_notes")
          .update({
            hd_list: updatedHdList,
            updated_at: new Date().toISOString(),
          })
          .eq("id", selectedNote.id));
      }

      if (error) throw error;

      setNotes((prev) =>
        prev.map((note) =>
          note.id === selectedNote.id
            ? {
                ...note,
                hd_list: updatedHdList,
                plantao_registro: trimmedRegistro || null,
                plantao_duvidas: trimmedRegistro || null,
                plantao_reflexoes: null,
                updated_at: new Date().toISOString(),
              }
            : note,
        ),
      );

      setSaveMessage("Registro salvo.");
      setIsRegistroSaved(true);
      void loadFlaggedNotes();
    } catch (error) {
      console.error("Erro ao salvar dúvidas/reflexões:", error);
      setSaveMessage("Não foi possível salvar. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-small text-neutral-600">
          Casos entram automaticamente aqui quando há marcação de dúvida/desfecho e o atendimento é encerrado no final da nota.
        </p>
        <button
          type="button"
          onClick={() => void loadFlaggedNotes()}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
        >
          <RefreshCcw className="h-3.5 w-3.5" aria-hidden />
          Atualizar
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-small text-neutral-500">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Carregando casos sinalizados...
        </div>
      ) : notes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-6 text-center">
          <p className="text-body font-medium text-neutral-700">Nenhum caso sinalizado no momento.</p>
          <p className="mt-1 text-caption text-neutral-500">
            Marque dúvida/desfecho e encerre o atendimento no final da nota para o caso aparecer aqui.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-[280px_1fr]">
          <div className="space-y-2">
            {notes.map((note) => {
              const patient = parsePatientTitle(note.title);
              const isActive = selectedNoteId === note.id;

              return (
                <button
                  key={note.id}
                  type="button"
                  onClick={() => setSelectedNoteId(note.id)}
                  className={`w-full rounded-xl border p-3 text-left transition-colors ${
                    isActive
                      ? "border-brand-300 bg-brand-50"
                      : "border-neutral-200 bg-white hover:border-brand-200 hover:bg-brand-50/40"
                  }`}
                >
                  <p className="truncate text-small font-semibold text-neutral-800">{patient.name}</p>
                  <p className="text-caption text-neutral-500">{patient.age}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {note.conduct_doubts && (
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                        Dúvida de conduta
                      </span>
                    )}
                    {note.unexpected_outcome && (
                      <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-rose-700">
                        Desfecho não previsto
                      </span>
                    )}
                  </div>
                  <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-neutral-400">
                    <Clock className="h-3 w-3" aria-hidden />
                    {new Date(note.updated_at || note.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </button>
              );
            })}
          </div>

          {selectedNote ? (
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2">
                <MessageSquareText className="h-4 w-4 text-brand-700" aria-hidden />
                <h3 className="text-body font-semibold text-neutral-800">Registro de dúvidas e reflexões</h3>
              </div>

              <label className="mb-1 block text-caption font-medium text-neutral-600">
                Registro
              </label>
              <textarea
                value={registro}
                onChange={(e) => {
                  setRegistro(e.target.value);
                  setIsRegistroSaved(false);
                  if (saveMessage === "Registro salvo.") setSaveMessage(null);
                }}
                placeholder={`Dúvidas sobre conduta: necessidade de discutir antibiótico, dose, timing de reavaliação...\n\nReflexões: hipóteses que poderiam ter sido revistas antes, sinais de alerta, aprendizado para o próximo caso...`}
                className="min-h-56 w-full resize-y rounded-lg border border-neutral-200 px-3 py-2 text-small text-neutral-800 placeholder-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />

              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3 py-2 text-small font-medium text-white hover:bg-brand-700 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Check className="h-4 w-4" aria-hidden />}
                  {isRegistroSaved ? "Editar registro" : "Salvar registro"}
                </button>
                {saveMessage && (
                  <p
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-medium ${
                      saveMessage === "Registro salvo."
                        ? "border border-green-200 bg-green-50 text-green-700"
                        : "border border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    <AlertCircle className="h-3.5 w-3.5" aria-hidden />
                    {saveMessage}
                  </p>
                )}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
