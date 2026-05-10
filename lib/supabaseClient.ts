import { createClient } from "@supabase/supabase-js";

/**
 * Anonymous Supabase client for server components, server actions, and the browser.
 * Configure in `.env.local` (not committed):
 * - NEXT_PUBLIC_SUPABASE_URL — project Settings → API → Project URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY — project Settings → API → anon/public key
 *
 * If the table has rows in the Supabase dashboard but queries return none, enable
 * Row Level Security policies allowing `SELECT` (and `INSERT` for the form) for role `anon`.
 */
export function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return null;
  }
  return createClient(url, key);
}
