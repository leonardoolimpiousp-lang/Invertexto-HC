"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, FolderOpen, FileText, ChevronRight, Clock } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { CreateFolderModal } from "@/components/workspace/CreateFolderModal";
import { NoteEditor } from "@/components/workspace/NoteEditor";
import type { Database, ContextType, Specialty } from "@/types/database";
import type { ToolId } from "@/lib/constants/tools";

type ClinicalFolder = Database["public"]["Tables"]["clinical_folders"]["Row"];
type ClinicalNote = Database["public"]["Tables"]["clinical_notes"]["Row"];

interface NotepadPanelProps {
  slug: string;
  onSelectTool: (toolId: ToolId) => void;
}

export function NotepadPanel({ slug, onSelectTool }: NotepadPanelProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [folders, setFolders] = useState<ClinicalFolder[]>([]);
  const [notes, setNotes] = useState<Record<string, ClinicalNote[]>>({});
  const [showModal, setShowModal] = useState(false);
  const [activeFolder, setActiveFolder] = useState<ClinicalFolder | null>(null);
  const [activeNote, setActiveNote] = useState<ClinicalNote | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFolders = async () => {
      setIsLoading(true);
      try {
        const { data: foldersData, error: foldersError } = await supabase
          .from("clinical_folders")
          .select("*")
          .eq("slug", slug)
          .order("created_at", { ascending: false });

        if (foldersError) throw foldersError;
        setFolders(foldersData || []);

        if (foldersData && foldersData.length > 0) {
          const notesMap: Record<string, ClinicalNote[]> = {};
          for (const folder of foldersData) {
            const { data: notesData, error: notesError } = await supabase
              .from("clinical_notes")
              .select("*")
              .eq("folder_id", folder.id)
              .order("created_at", { ascending: false });

            if (notesError) throw notesError;
            notesMap[folder.id] = notesData || [];
          }
          setNotes(notesMap);
        }
      } catch (error) {
        console.error("Error fetching folders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFolders();
  }, [slug, supabase]);

  // ── helpers ──────────────────────────────────────────────────────────────

  const createFolder = async (data: {
    context: ContextType;
    specialty?: Specialty | null;
    sub_specialty?: string | null;
    label: string;
  }) => {
    try {
      const { data: newFolder, error: folderError } = await supabase
        .from("clinical_folders")
        .insert({
          slug,
          context: data.context,
          specialty: data.specialty || null,
          sub_specialty: data.sub_specialty || null,
          label: data.label,
        })
        .select()
        .single();

      if (folderError) throw folderError;
      if (!newFolder) throw new Error("Failed to create folder");

      const { data: newNote, error: noteError } = await supabase
        .from("clinical_notes")
        .insert({
          folder_id: newFolder.id,
          content: "",
          hd_list: [],
        })
        .select()
        .single();

      if (noteError) throw noteError;
      if (!newNote) throw new Error("Failed to create note");

      setFolders((prev) => [newFolder, ...prev]);
      setNotes((prev) => ({ ...prev, [newFolder.id]: [newNote] }));
      setActiveFolder(newFolder);
      setActiveNote(newNote);
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  const createNote = async (folder: ClinicalFolder) => {
    try {
      const { data: newNote, error } = await supabase
        .from("clinical_notes")
        .insert({
          folder_id: folder.id,
          content: "",
          hd_list: [],
        })
        .select()
        .single();

      if (error) throw error;
      if (!newNote) throw new Error("Failed to create note");

      setNotes((prev) => ({
        ...prev,
        [folder.id]: [newNote, ...(prev[folder.id] || [])],
      }));
      setActiveNote(newNote);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const updateNote = async (updated: Partial<ClinicalNote> & { id: string }) => {
    if (!activeFolder) return;
    try {
      const { error } = await supabase
        .from("clinical_notes")
        .update({
          content: updated.content,
          hd_list: updated.hd_list,
          updated_at: new Date().toISOString(),
        })
        .eq("id", updated.id);

      if (error) throw error;

      const fullNote = { ...activeNote, ...updated } as ClinicalNote;
      setNotes((prev) => ({
        ...prev,
        [activeFolder.id]: (prev[activeFolder.id] || []).map((n) =>
          n.id === updated.id ? fullNote : n,
        ),
      }));
      setActiveNote(fullNote);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const currentFolderNotes = activeFolder ? notes[activeFolder.id] || [] : [];

  // ── Note editor ───────────────────────────────────────────────────────────

  if (activeNote && activeFolder) {
    return (
      <NoteEditor
        note={activeNote}
        folder={activeFolder}
        onBack={() => setActiveNote(null)}
        onUpdate={updateNote}
        onSelectTool={onSelectTool}
      />
    );
  }

  // ── Folder detail (note list) ─────────────────────────────────────────────

  if (activeFolder) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-overline uppercase text-brand-700">Notepad</p>
            <h2 className="mt-0.5 text-h3 text-neutral-900">{activeFolder.label}</h2>
            <p className="mt-0.5 text-caption text-neutral-400">
              {currentFolderNotes.length}{" "}
              {currentFolderNotes.length === 1 ? "nota" : "notas"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => createNote(activeFolder)}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-body font-medium text-white hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" />
            Nova nota
          </button>
        </div>

        <button
          type="button"
          onClick={() => setActiveFolder(null)}
          className="w-fit text-caption text-neutral-400 hover:text-neutral-600"
        >
          ← Todas as pastas
        </button>

        {currentFolderNotes.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="Nenhuma nota nesta pasta."
            action="Criar primeira nota"
            onAction={() => createNote(activeFolder)}
          />
        ) : (
          <div className="space-y-2">
            {currentFolderNotes.map((note) => (
              <button
                key={note.id}
                type="button"
                onClick={() => setActiveNote(note)}
                className="flex w-full items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 text-left transition-colors hover:border-brand-300 hover:bg-brand-50"
              >
                <FileText className="h-4 w-4 shrink-0 text-neutral-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body font-medium text-neutral-800">
                    {note.content.split("\n").find((l) => l.trim()) || "Nota vazia"}
                  </p>
                  {note.hd_list && note.hd_list.length > 0 && (
                    <p className="mt-0.5 truncate text-caption text-neutral-500">
                      HDs: {note.hd_list.join(", ")}
                    </p>
                  )}
                </div>
                <span className="flex shrink-0 items-center gap-1 text-caption text-neutral-400">
                  <Clock className="h-3 w-3" aria-hidden />
                  {new Date(note.created_at).toLocaleDateString("pt-BR")}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-neutral-300" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Folder list (home) ────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-overline uppercase text-brand-700">Notepad</p>
            <h2 className="mt-0.5 text-h3 text-neutral-900">Pastas clínicas</h2>
          </div>
        </div>
        <div className="flex items-center justify-center py-20 text-neutral-400">
          Carregando...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-overline uppercase text-brand-700">Notepad</p>
          <h2 className="mt-0.5 text-h3 text-neutral-900">Pastas clínicas</h2>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-body font-medium text-white hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          Criar pasta
        </button>
      </div>

      {folders.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="Nenhuma pasta criada ainda."
          subtitle="Crie uma pasta para organizar seus prontuários por contexto clínico."
          action="Criar primeira pasta"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="space-y-2">
          {folders.map((folder) => {
            const folderNotes = notes[folder.id] || [];
            return (
              <button
                key={folder.id}
                type="button"
                onClick={() => setActiveFolder(folder)}
                className="flex w-full items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 text-left transition-colors hover:border-brand-300 hover:bg-brand-50"
              >
                <FolderOpen className="h-5 w-5 shrink-0 text-brand-500" />
                <div className="min-w-0 flex-1">
                  <p className="text-body font-medium text-neutral-800">{folder.label}</p>
                  <p className="mt-0.5 text-caption text-neutral-500">
                    {folderNotes.length} {folderNotes.length === 1 ? "nota" : "notas"} ·{" "}
                    {new Date(folder.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-neutral-300" />
              </button>
            );
          })}
        </div>
      )}

      {showModal && (
        <CreateFolderModal onClose={() => setShowModal(false)} onCreate={createFolder} />
      )}
    </div>
  );
}

// ── EmptyState ────────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  action: string;
  onAction: () => void;
}

function EmptyState({ icon: Icon, title, subtitle, action, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 py-20 text-center">
      <Icon className="mb-3 h-10 w-10 text-neutral-300" aria-hidden />
      <p className="text-body font-medium text-neutral-600">{title}</p>
      {subtitle && <p className="mt-1 max-w-xs text-caption text-neutral-400">{subtitle}</p>}
      <button
        type="button"
        onClick={onAction}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-body font-medium text-white hover:bg-brand-700"
      >
        <Plus className="h-4 w-4" />
        {action}
      </button>
    </div>
  );
}
