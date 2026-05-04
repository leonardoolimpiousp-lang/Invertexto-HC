"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, FolderOpen, FileText, ChevronRight, Clock, Trash2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { CreateFolderModal } from "@/components/workspace/CreateFolderModal";
import { NoteEditor } from "@/components/workspace/NoteEditor";
import { cn } from "@/lib/utils/cn";
import { ESPECIALIDADE_BASE_LABELS } from "@/lib/constants/specialties";
import type { Database, ContextType, Specialty } from "@/types/database";
import type { ToolId } from "@/lib/constants/tools";

type ClinicalFolder = Database["public"]["Tables"]["clinical_folders"]["Row"];
type ClinicalNote = Database["public"]["Tables"]["clinical_notes"]["Row"];

interface NotepadPanelProps {
  slug: string;
  onSelectTool: (toolId: ToolId) => void;
}

export function NotepadPanel({ slug, onSelectTool }: NotepadPanelProps) {
  const supabase = useMemo(() => {
    const client = createSupabaseBrowserClient() as any;
    console.log("Supabase client initialized:", {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      keyExists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });
    return client;
  }, []);
  const [folders, setFolders] = useState<ClinicalFolder[]>([]);
  const [notes, setNotes] = useState<Record<string, ClinicalNote[]>>({});
  const [showModal, setShowModal] = useState(false);
  const [activeFolder, setActiveFolder] = useState<ClinicalFolder | null>(null);
  const [activeNote, setActiveNote] = useState<ClinicalNote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadFoldersAndNotes = async () => {
    setIsLoading(true);
    try {
      const { data: foldersData, error: foldersError } = await supabase
        .from("clinical_folders")
        .select("*")
        .eq("slug", slug)
        .order("created_at", { ascending: false });

      if (foldersError) throw foldersError;
      const typedFolders = (foldersData || []) as ClinicalFolder[];
      setFolders(typedFolders);

      if (typedFolders.length > 0) {
        const notesMap: Record<string, ClinicalNote[]> = {};
        for (const folder of typedFolders) {
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
      const errorMsg = error instanceof Error ? error.message : JSON.stringify(error);
      console.error("Error fetching folders:", errorMsg, error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFoldersAndNotes();
  }, [slug, supabase, refreshKey]);

  // ── helpers ──────────────────────────────────────────────────────────────

  const createFolder = async (data: {
    context: ContextType;
    specialty?: string | null;
    subSpecialty?: string | null;
    label: string;
    patientName: string;
    patientAge: string;
  }) => {
    try {
      let parentId: string | null = null;

      // ── Outpatient Hierarchy ──────────────────────────────────────────────
      if (data.context === "ambulatorial") {
        // 1. Check/Create Root "Ambulatório" folder
        const { data: rootFolder, error: rootError } = await supabase
          .from("clinical_folders")
          .select("id")
          .eq("slug", slug)
          .eq("label", "Ambulatório")
          .maybeSingle();

        if (rootError) throw rootError;

        if (rootFolder) {
          parentId = (rootFolder as any).id;
        } else {
          const { data: newRoot, error: createRootError } = await supabase
            .from("clinical_folders")
            .insert({
              slug,
              context: "ambulatorial",
              label: "Ambulatório",
            } as any)
            .select()
            .single();
          
          if (createRootError) throw createRootError;
          if (newRoot) {
            parentId = (newRoot as any).id;
            setFolders((prev) => [newRoot as any, ...prev]);
          }
        }
      }

      // 2. Create the specific folder (or use existing subfolder if it matches?)
      // For now, we always create a new folder for the specific case/patient 
      // if it's PS/UTI, but for Ambulatório we might want to group by specialty.
      // USER SAID: "sub-pasta chamada ambulatorio-especialidade"
      
      const targetLabel = data.context === "ambulatorial" 
        ? `Ambulatório · ${data.subSpecialty || (data.specialty ? (ESPECIALIDADE_BASE_LABELS as any)[data.specialty] : "Geral")}`
        : data.label;

      const { data: existingFolder, error: findError } = await supabase
        .from("clinical_folders")
        .select("*")
        .eq("slug", slug)
        .eq("label", targetLabel)
        .maybeSingle();

      if (findError) throw findError;

      let folderId: string;
      let finalFolder: ClinicalFolder;

      if (existingFolder) {
        folderId = (existingFolder as any).id;
        finalFolder = existingFolder as any;
      } else {
        const { data: newFolder, error: folderError } = await supabase
          .from("clinical_folders")
          .insert({
            slug,
            context: data.context,
            specialty: data.specialty || null,
            sub_specialty: data.subSpecialty || null,
            label: targetLabel,
            parent_id: parentId,
          } as any)
          .select()
          .single();

        if (folderError) throw folderError;
        if (!newFolder) throw new Error("Failed to create folder");
        folderId = (newFolder as any).id;
        finalFolder = newFolder as any;
        setFolders((prev) => [newFolder as any, ...prev]);
      }

      // 3. Create the note with Patient Info as title
      const title = `${data.patientName} - ${data.patientAge}`;
      const { data: newNote, error: noteError } = await supabase
        .from("clinical_notes")
        .insert({
          folder_id: folderId,
          content: "",
          title: title,
          hd_list: [],
        } as any)
        .select()
        .single();

      if (noteError) throw noteError;
      if (!newNote) throw new Error("Failed to create note");

      setNotes((prev) => ({ 
        ...prev, 
        [folderId]: [newNote as any, ...(prev[folderId] || [])] 
      }));
      setActiveFolder(finalFolder);
      setActiveNote(newNote as any);

      // Force refresh to ensure data consistency
      setRefreshKey((k) => k + 1);
    } catch (error) {
      console.error("Error creating folder/note:", error);
    }
  };

  const createNote = async (folder: ClinicalFolder) => {
    const patientName = window.prompt("Nome do paciente:");
    const patientAge = window.prompt("Idade do paciente:");
    
    if (!patientName || !patientAge) return;

    try {
      const title = `${patientName} - ${patientAge}`;
      const { data: newNote, error } = await supabase
        .from("clinical_notes")
        .insert({
          folder_id: folder.id,
          content: "",
          title: title,
          hd_list: [],
        } as any)
        .select()
        .single();

      if (error) throw error;
      if (!newNote) throw new Error("Failed to create note");

      setNotes((prev) => ({
        ...prev,
        [folder.id]: [newNote, ...(prev[folder.id] || [])],
      }));
      setActiveNote(newNote);

      // Force refresh to ensure data consistency
      setRefreshKey((k) => k + 1);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const deleteFolder = async (folderId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta pasta e TODAS as notas dentro dela?")) return;
    
    try {
      const { error } = await supabase
        .from("clinical_folders")
        .delete()
        .eq("id", folderId);

      if (error) throw error;

      setFolders((prev) => prev.filter((f) => f.id !== folderId));
      setNotes((prev) => {
        const next = { ...prev };
        delete next[folderId];
        return next;
      });
    // Force refresh to ensure data consistency
    setRefreshKey((k) => k + 1);
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  const deleteNote = async (noteId: string, folderId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta nota?")) return;
    
    try {
      const { error } = await supabase
        .from("clinical_notes")
        .delete()
        .eq("id", noteId);

      if (error) throw error;

      setNotes((prev) => ({
        ...prev,
        [folderId]: (prev[folderId] || []).filter((n) => n.id !== noteId),
      }));

      // Force refresh to ensure data consistency
      setRefreshKey((k) => k + 1);
    } catch (error) {
      console.error("Error deleting note:", error);
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
          conduct_doubts: updated.conduct_doubts,
          unexpected_outcome: updated.unexpected_outcome,
          procedures: updated.procedures,
          updated_at: new Date().toISOString(),
        } as any)
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

      // Force refresh to ensure data consistency
      setRefreshKey((k) => k + 1);
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
              <div
                key={note.id}
                className="group relative flex w-full items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-brand-300 hover:bg-brand-50"
              >
                <button
                  type="button"
                  onClick={() => setActiveNote(note)}
                  className="flex flex-1 items-center gap-3 text-left min-w-0"
                >
                  <FileText className="h-4 w-4 shrink-0 text-neutral-400" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body font-medium text-neutral-800">
                      {note.title || note.content.split("\n").find((l) => l.trim()) || "Nota vazia"}
                    </p>
                    {note.hd_list && note.hd_list.length > 0 && (
                      <p className="mt-0.5 truncate text-caption text-neutral-500">
                        HDs: {note.hd_list.join(", ")}
                      </p>
                    )}
                  </div>
                </button>
                
                <div className="flex shrink-0 items-center gap-3">
                  <span className="hidden sm:flex items-center gap-1 text-caption text-neutral-400">
                    <Clock className="h-3 w-3" aria-hidden />
                    {new Date(note.created_at).toLocaleDateString("pt-BR")}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id, activeFolder.id);
                    }}
                    className="p-2 text-neutral-300 hover:text-red-500 transition-colors"
                    title="Excluir nota"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <ChevronRight className="h-4 w-4 text-neutral-300" />
                </div>
              </div>
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
            <h2 className="mt-0.5 text-h3 text-neutral-900">Suas pastas clínicas</h2>
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
          <h2 className="mt-0.5 text-h3 text-neutral-900">Suas pastas clínicas</h2>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-body font-medium text-white hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          Nova nota
        </button>
      </div>

      {folders.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="Nenhuma nota criada ainda."
          subtitle="Organize seus atendimentos por contexto clínico e especialidade."
          action="Criar primeira nota"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="space-y-6">
          <div className="space-y-2">
            {folders.map((folder) => {
              const folderNotes = notes[folder.id] || [];
              const isSubfolder = !!folder.parent_id;
              
              return (
                <div
                  key={folder.id}
                  className={cn(
                    "group relative flex w-full items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-brand-300 hover:bg-brand-50",
                    isSubfolder && "ml-6 border-dashed bg-neutral-50/50"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setActiveFolder(folder)}
                    className="flex flex-1 items-center gap-3 text-left min-w-0"
                  >
                    <FolderOpen className={cn("h-5 w-5 shrink-0", isSubfolder ? "text-neutral-400" : "text-brand-500")} />
                    <div className="min-w-0 flex-1">
                      <p className="text-body font-medium text-neutral-800">{folder.label}</p>
                      <p className="mt-0.5 text-caption text-neutral-500">
                        {folderNotes.length} {folderNotes.length === 1 ? "nota" : "notas"} ·{" "}
                        {new Date(folder.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </button>

                  <div className="flex shrink-0 items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFolder(folder.id);
                      }}
                      className="p-2 text-neutral-300 hover:text-red-500 transition-colors"
                      title="Excluir pasta"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <ChevronRight className="h-4 w-4 text-neutral-300" />
                  </div>
                </div>
              );
            })}
          </div>
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
