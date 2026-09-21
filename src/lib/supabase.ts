import { createClient } from "@supabase/supabase-js";

// Supabase Project Configuration from environment variables
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://pypflthgysczjbqzqskq.supabase.co";

// Public anon key (from environment variable or fallback)
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5cGZsdGhneXNjempicXpxc2txIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NjAwMDAsImV4cCI6MjA1ODEzNjAwMH0.placeholder";

/**
 * Checks whether user has provided their real Supabase project URL & key
 */
export function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL || "";
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
  return Boolean(
    url &&
    key &&
    !key.includes("placeholder") &&
    url.includes("supabase.co")
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

