import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Server-side Supabase client for use in Server Components and Route
 * Handlers. Uses the public anon key so it respects Row Level Security
 * policies — it is safe to use for public reads (rooms, gallery) and for
 * inserting booking inquiries.
 *
 * The service role key is intentionally NOT used here. If an admin
 * dashboard is built later, service-role operations must live in a
 * protected server-only route that checks an authenticated admin session.
 */
export function getSupabaseServerClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
