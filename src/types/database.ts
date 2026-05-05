export type EducationLevel = "medico" | "residente" | "interno";
export type ContextType = "ps" | "uti" | "ambulatorial" | "sala_de_emergencia" | "cirurgia" | "enfermaria";
export type Specialty = "cirurgia" | "clinica_medica" | "pediatria" | "ginecologia" | "obstetricia";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          slug: string;
          full_name: string;
          level: EducationLevel;
          hospital: string;
          created_at: string;
        };
        Insert: {
          slug: string;
          full_name: string;
          level: EducationLevel;
          hospital: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      notes: {
        Row: {
          slug: string;
          content: string;
          updated_at: string;
        };
        Insert: {
          slug: string;
          content?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notes"]["Insert"]>;
      };
      access_log: {
        Row: {
          id: string;
          slug: string | null;
          event: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug?: string | null;
          event: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["access_log"]["Insert"]>;
      };
      clinical_folders: {
        Row: {
          id: string;
          slug: string;
          context: ContextType;
          specialty: Specialty | null;
          sub_specialty: string | null;
          label: string;
          parent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          context: ContextType;
          specialty?: Specialty | null;
          sub_specialty?: string | null;
          label: string;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["clinical_folders"]["Insert"]>;
      };
      clinical_notes: {
        Row: {
          id: string;
          folder_id: string;
          content: string;
          hd_list: string[];
          conduct_doubts: boolean;
          unexpected_outcome: boolean;
          procedures: string[];
          patient_destination: "alta" | "alta_retorno_ambulatorial" | "internacao" | "obito" | null;
          encounter_closed: boolean;
          encounter_closed_at: string | null;
          plantao_registro: string | null;
          plantao_duvidas: string | null;
          plantao_reflexoes: string | null;
          title: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          folder_id: string;
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
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["clinical_notes"]["Insert"]>;
      };
      resident_procedure_logs: {
        Row: {
          id: string;
          slug: string;
          procedure_id: string;
          procedure_name: string;
          performed_at: string;
          training_year: "5_ano" | "6_ano" | "R1" | "R2" | "R3" | "R_plus";
          previous_experience: number;
          patient_type: "adulto" | "pediatrico";
          assistance: "assistente" | "r_plus" | "preceptor" | "sem_auxilio";
          first_attempt_success: boolean;
          unsuccessful: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          procedure_id: string;
          procedure_name: string;
          performed_at: string;
          training_year: "5_ano" | "6_ano" | "R1" | "R2" | "R3" | "R_plus";
          previous_experience?: number;
          patient_type: "adulto" | "pediatrico";
          assistance: "assistente" | "r_plus" | "preceptor" | "sem_auxilio";
          first_attempt_success: boolean;
          unsuccessful?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["resident_procedure_logs"]["Insert"]>;
      };
      handover_cases: {
        Row: {
          id: string;
          slug: string;
          cenario: string | null;
          leito: string;
          paciente: string;
          idade: string;
          severity: "estavel" | "instavel" | "grave" | null;
          patient_summary: string;
          action_list: string;
          situation: string;
          synthesis: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          cenario?: string | null;
          leito: string;
          paciente: string;
          idade?: string;
          severity?: "estavel" | "instavel" | "grave" | null;
          patient_summary?: string;
          action_list?: string;
          situation?: string;
          synthesis?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["handover_cases"]["Insert"]>;
      };
    };
  };
}
