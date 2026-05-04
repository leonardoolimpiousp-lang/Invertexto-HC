import { createSupabaseServerClient } from "./server";
import type { Database, ContextType, Specialty } from "@/types/database";

type ClinicalFolderRow = Database["public"]["Tables"]["clinical_folders"]["Row"];

export async function getFoldersBySlug(slug: string): Promise<ClinicalFolderRow[]> {
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
): Promise<ClinicalFolderRow> {
  const supabase = createSupabaseServerClient() as any;
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
  return data as unknown as ClinicalFolderRow;
}

export async function updateFolder(
  id: string,
  updates: {
    slug?: string;
    context?: ContextType;
    specialty?: Specialty | null;
    sub_specialty?: string | null;
    label?: string;
    parent_id?: string | null;
  },
): Promise<ClinicalFolderRow> {
  const supabase = createSupabaseServerClient() as any;
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
  return data as unknown as ClinicalFolderRow;
}

export async function deleteFolder(id: string): Promise<void> {
  const supabase = createSupabaseServerClient() as any;
  const { error } = await supabase.from("clinical_folders").delete().eq("id", id);
  if (error) throw error;
}
