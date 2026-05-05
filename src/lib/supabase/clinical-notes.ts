import { createSupabaseServerClient } from "./server";
import type { Database } from "@/types/database";

type ClinicalNoteRow = Database["public"]["Tables"]["clinical_notes"]["Row"];

export async function getNotesByFolderId(folderId: string): Promise<ClinicalNoteRow[]> {
  const supabase = createSupabaseServerClient() as any;
  const { data, error } = await supabase
    .from("clinical_notes")
    .select("*")
    .eq("folder_id", folderId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getNote(id: string): Promise<ClinicalNoteRow | null> {
  const supabase = createSupabaseServerClient() as any;
  const { data, error } = await supabase
    .from("clinical_notes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data || null;
}

export async function createNote(
  folderId: string,
  content?: string,
  hdList?: string[],
): Promise<ClinicalNoteRow> {
  const supabase = createSupabaseServerClient() as any;
  const { data, error } = await supabase
    .from("clinical_notes")
    .insert({
      folder_id: folderId,
      content: content || "",
      hd_list: hdList || [],
    })
    .select()
    .single();

  if (error) throw error;
  return data as unknown as ClinicalNoteRow;
}

export async function updateNote(
  id: string,
  updates: {
    content?: string;
    hd_list?: string[];
    conduct_doubts?: boolean;
    unexpected_outcome?: boolean;
    procedures?: string[];
    patient_destination?: "alta" | "alta_retorno_ambulatorial" | "internacao" | "obito" | null;
    encounter_closed?: boolean;
    encounter_closed_at?: string | null;
    plantao_registro?: string | null;
    plantao_duvidas?: string | null;
    plantao_reflexoes?: string | null;
    title?: string | null;
  },
): Promise<ClinicalNoteRow> {
  const supabase = createSupabaseServerClient() as any;
  const { data, error } = await supabase
    .from("clinical_notes")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as ClinicalNoteRow;
}

export async function deleteNote(id: string): Promise<void> {
  const supabase = createSupabaseServerClient() as any;
  const { error } = await supabase.from("clinical_notes").delete().eq("id", id);
  if (error) throw error;
}
