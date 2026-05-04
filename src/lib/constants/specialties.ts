export type ContextType = "ps" | "uti" | "ambulatorial" | "sala_de_emergencia" | "cirurgia";

export type EspecialidadeBase =
  | "cirurgia"
  | "clinica_medica"
  | "pediatria"
  | "ginecologia"
  | "obstetricia";

export const CONTEXT_LABELS: Record<ContextType, string> = {
  ps: "Pronto-Socorro",
  uti: "UTI",
  ambulatorial: "Consulta Ambulatorial",
  sala_de_emergencia: "Sala de Emergência",
  cirurgia: "Cirurgia",
};

export const ESPECIALIDADE_BASE_LABELS: Record<EspecialidadeBase, string> = {
  cirurgia: "Cirurgia",
  clinica_medica: "Clínica Médica",
  pediatria: "Pediatria",
  ginecologia: "Ginecologia",
  obstetricia: "Obstetrícia",
};

export const SUBESPECIALIDADES: Partial<Record<EspecialidadeBase, readonly string[]>> = {
  cirurgia: [
    "Cirurgia Geral",
    "Cirurgia Cardiovascular",
    "Cirurgia Torácica",
    "Cirurgia do Aparelho Digestivo",
    "Cirurgia de Cabeça e Pescoço",
    "Cirurgia Plástica",
    "Cirurgia Vascular",
    "Neurocirurgia",
    "Cirurgia Oncológica",
    "Urologia",
    "Ortopedia e Traumatologia",
    "Coloproctologia",
    "Cirurgia Pediátrica",
  ],
  clinica_medica: [
    "Cardiologia",
    "Pneumologia",
    "Gastroenterologia",
    "Nefrologia",
    "Endocrinologia",
    "Reumatologia",
    "Hematologia",
    "Neurologia",
    "Infectologia",
    "Geriatria",
    "Medicina Intensiva",
    "Oncologia Clínica",
    "Dermatologia",
    "Psiquiatria",
  ],
};

export interface ClinicalNote {
  id: string;
  content: string;
  hdList: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ClinicalFolder {
  id: string;
  context: ContextType;
  specialty?: EspecialidadeBase;
  subSpecialty?: string;
  label: string;
  createdAt: Date;
  notes: ClinicalNote[];
}
