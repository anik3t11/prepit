import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url: string | null;
          track: string;
          experience: string;
          xp: number;
          streak: number;
          last_active: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["users"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      questions: {
        Row: {
          id: string;
          title: string;
          description: string;
          topic: string;
          difficulty: "Easy" | "Medium" | "Hard";
          tags: string[];
          answer: string | null;
          type: "coding" | "theory" | "system_design" | "behavioral";
          source: string | null;
          upvotes: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["questions"]["Row"], "id" | "created_at" | "upvotes">;
        Update: Partial<Database["public"]["Tables"]["questions"]["Insert"]>;
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          question_id: string;
          status: "solved" | "in-progress" | "unsolved";
          attempts: number;
          last_attempted: string;
          time_spent: number;
          score: number | null;
        };
        Insert: Omit<Database["public"]["Tables"]["user_progress"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["user_progress"]["Insert"]>;
      };
      interviews: {
        Row: {
          id: string;
          user_id: string;
          role: string;
          experience: string;
          type: string;
          duration: number;
          company: string | null;
          jd_text: string | null;
          score: number | null;
          feedback: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["interviews"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["interviews"]["Insert"]>;
      };
    };
  };
};
