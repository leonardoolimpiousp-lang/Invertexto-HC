import { createSupabaseServerClient } from "./server";
import type { Database, ContextType, Specialty } from "@/types/database";

type ClinicalFolder = Database["public"]["Tables"]["clinical_folders"]["Row"];
type CreateFolderInput = Database["public"]["Tables"]["clinical_folders"]["Insert"];
type UpdateFolderInput = Database["public"]["Tables"]["clinical_folders"]["Update"];

export async function getFoldersBySlug(slug: string): Promise<ClinicalFolder[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("clinical_folders")
    .select("*")
    .eq("slug", slug)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createFolder(
  slug: string,
  context: ContextType,
  label: string,
  specialty?: Specialty | null,
  subSpecialty?: string | null,
): Promise<ClinicalFolder> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("clinical_folders")
    .insert({
      slug,
      context,
      label,
      specialty: specialty || null,
      sub_specialty: subSpecialty || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateFolder(
  id: string,
  updates: UpdateFolderInput,
): Promise<ClinicalFolder> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("clinical_folders")
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

export async function deleteFolder(id: string): Promise<void> {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("clinical_folders").delete().eq("id", id);
  if (error) throw error;
}
