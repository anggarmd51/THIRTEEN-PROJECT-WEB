import { createClient } from "@supabase/supabase-js";

// Supabase Project Configuration
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://pypflthgysczjbqzqskq.supabase.co";

// Public anon key (from environment variable or placeholder)
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5cGZsdGhneXNjempicXpxc2txIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NjAwMDAsImV4cCI6MjA1ODEzNjAwMH0.placeholder";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
