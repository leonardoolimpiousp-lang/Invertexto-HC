export type EducationLevel = "medico" | "residente" | "interno";

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
    };
  };
}
