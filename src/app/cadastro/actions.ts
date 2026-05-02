"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  generateRandomSlug,
  isValidSlug,
  isReservedSlug,
  normalizeSlug,
} from "@/lib/utils/slug";
import type { EducationLevel } from "@/types/database";

export type CadastroState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"fullName" | "level" | "hospital" | "slug", string>>;
};

const VALID_LEVELS: EducationLevel[] = ["medico", "residente", "interno"];

export async function createProfile(
  _prev: CadastroState,
  formData: FormData,
): Promise<CadastroState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const level    = String(formData.get("level") ?? "").trim();
  const hospital = String(formData.get("hospital") ?? "").trim();
  const slugRaw  = String(formData.get("slug") ?? "").trim();

  const fieldErrors: CadastroState["fieldErrors"] = {};

  if (fullName.length < 3) fieldErrors.fullName = "Informe seu nome completo (mín. 3 caracteres).";
  if (!VALID_LEVELS.includes(level as EducationLevel)) fieldErrors.level = "Selecione seu nível de formação.";
  if (hospital.length < 3) fieldErrors.hospital = "Informe a instituição (mín. 3 caracteres).";

  let slug = slugRaw ? normalizeSlug(slugRaw) : generateRandomSlug();
  if (slugRaw && !isValidSlug(slug)) {
    fieldErrors.slug = "Use apenas letras, números e hífens (3 a 48 caracteres).";
  } else if (isReservedSlug(slug)) {
    fieldErrors.slug = "Esse slug é reservado. Escolha outro.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Revise os campos destacados.", fieldErrors };
  }

  const supabase = createSupabaseServerClient();

  const { data: existing } = await supabase
    .from("profiles")
    .select("slug")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) {
    if (slugRaw) {
      return {
        status: "error",
        message: "Esse slug já está em uso.",
        fieldErrors: { slug: "Já existe um perfil com esse slug." },
      };
    }
    // colisão em slug aleatório (raro): regenera
    slug = generateRandomSlug(14);
  }

  const { error: insertProfileError } = await supabase.from("profiles").insert({
    slug,
    full_name: fullName,
    level: level as EducationLevel,
    hospital,
  });

  if (insertProfileError) {
    return {
      status: "error",
      message: "Não foi possível criar seu perfil. Tente novamente em instantes.",
    };
  }

  await supabase.from("notes").insert({ slug, content: "" });
  await supabase.from("access_log").insert({ slug, event: "create" });

  redirect(`/${slug}?welcome=1`);
}
