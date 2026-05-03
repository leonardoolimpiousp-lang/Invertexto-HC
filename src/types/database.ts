export type EducationLevel = "medico" | "residente" | "interno";
export type ContextType = "ps" | "uti" | "ambulatorial";
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
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          folder_id: string;
          content?: string;
          hd_list?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["clinical_notes"]["Insert"]>;
      };
    };
  };
}
