import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

// Types for our database schema
export interface Lead {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  source: string;
  status: "new" | "contacted" | "qualified" | "converted";
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ContentItem {
  id: string;
  type: "text" | "image" | "video";
  platform: "linkedin" | "instagram" | "twitter" | "blog";
  content: string;
  media_url: string | null;
  scheduled_for: string | null;
  published_at: string | null;
  status: "draft" | "scheduled" | "published" | "failed";
  performance: Record<string, number>;
  created_at: string;
}

export interface AgentLog {
  id: string;
  agent_type: "scraper" | "generator" | "critic" | "distributor";
  action: string;
  status: "running" | "success" | "failed";
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  error: string | null;
  duration_ms: number | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      leads: {
        Row: Lead;
        Insert: Omit<Lead, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Lead, "id">>;
      };
      content_calendar: {
        Row: ContentItem;
        Insert: Omit<ContentItem, "id" | "created_at">;
        Update: Partial<Omit<ContentItem, "id">>;
      };
      agent_logs: {
        Row: AgentLog;
        Insert: Omit<AgentLog, "id" | "created_at">;
        Update: Partial<Omit<AgentLog, "id">>;
      };
    };
  };
}

// Browser client (for client components)
export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Server client (for API routes and server components)
export function createSupabaseServerClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

// Singleton for edge functions
let supabaseAdmin: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    supabaseAdmin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return supabaseAdmin;
}
