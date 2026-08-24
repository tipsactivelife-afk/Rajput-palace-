"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Browser Supabase client, safe to use in Client Components.
 * Only ever uses the public anon key — never the service role key.
 *
 * Returns `null` when Supabase env vars are not configured yet, so the
 * rest of the site can gracefully fall back to demo data instead of
 * crashing during local development or before the owner connects Supabase.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
