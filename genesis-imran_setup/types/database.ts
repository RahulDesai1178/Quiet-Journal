export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      journal_entries: {
        Row: {
          analysis_created_at: string | null;
          analysis_emotions: Json | null;
          analysis_model: string | null;
          analysis_note: string | null;
          analysis_recommendations: Json | null;
          content: string;
          created_at: string;
          id: string;
          title: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          analysis_created_at?: string | null;
          analysis_emotions?: Json | null;
          analysis_model?: string | null;
          analysis_note?: string | null;
          analysis_recommendations?: Json | null;
          content: string;
          created_at?: string;
          id?: string;
          title?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          analysis_created_at?: string | null;
          analysis_emotions?: Json | null;
          analysis_model?: string | null;
          analysis_note?: string | null;
          analysis_recommendations?: Json | null;
          content?: string;
          created_at?: string;
          id?: string;
          title?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "journal_entries_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type JournalEntry = Database["public"]["Tables"]["journal_entries"]["Row"];
export type JournalEntryInsert = Database["public"]["Tables"]["journal_entries"]["Insert"];
export type JournalEntryUpdate = Database["public"]["Tables"]["journal_entries"]["Update"];
