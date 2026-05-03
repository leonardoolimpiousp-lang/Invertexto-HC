import { createSupabaseServerClient } from "./server";
import type { Database } from "@/types/database";

type ClinicalNote = Database["public"]["Tables"]["clinical_notes"]["Row"];
type CreateNoteInput = Database["public"]["Tables"]["clinical_notes"]["Insert"];
type UpdateNoteInput = Database["public"]["Tables"]["clinical_notes"]["Update"];

export async function getNotesByFolderId(folderId: string): Promise<ClinicalNote[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("clinical_notes")
    .select("*")
    .eq("folder_id", folderId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getNote(id: string): Promise<ClinicalNote | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("clinical_notes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createNote(
  folderId: string,
  content?: string,
  hdList?: string[],
): Promise<ClinicalNote> {
  const supabase = createSupabaseServerClient();
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
  return data;
}

export async function updateNote(
  id: string,
  updates: UpdateNoteInput,
): Promise<ClinicalNote> {
  const supabase = createSupabaseServerClient();
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
  return data;
}

export async function deleteNote(id: string): Promise<void> {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("clinical_notes").delete().eq("id", id);
  if (error) throw error;
}
