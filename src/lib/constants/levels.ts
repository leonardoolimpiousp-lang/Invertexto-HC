import type { EducationLevel } from "@/types/database";

export const EDUCATION_LEVELS: Array<{ value: EducationLevel; label: string; description: string }> = [
  { value: "medico",    label: "Médico",    description: "Médico formado e em atuação clínica." },
  { value: "residente", label: "Residente", description: "Em programa de residência médica." },
  { value: "interno",   label: "Interno",   description: "Estudante em internato (5º ou 6º ano)." },
];

export const SUGGESTED_HOSPITALS = [
  "HCFMUSP — Hospital das Clínicas FMUSP",
  "HCFMRP — Hospital das Clínicas FMRP/USP",
  "Hospital São Paulo — UNIFESP",
  "Hospital Albert Einstein",
  "Hospital Sírio-Libanês",
  "INCOR — Instituto do Coração",
  "ICESP — Instituto do Câncer do Estado de SP",
];
