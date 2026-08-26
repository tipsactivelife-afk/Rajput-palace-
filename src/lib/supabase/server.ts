import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

/**
 * Server-side Supabase client for Server Components and Route Handlers.
 *
 * The site must remain usable even when Supabase is not configured yet or
 * when a Vercel environment variable contains an invalid value. In those
 * cases we return null and the calling code falls back to demo data.
 */
export function getSupabaseServerClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  try {
    // Validate the URL before handing it to Supabase. This prevents an
    // invalid NEXT_PUBLIC_SUPABASE_URL from crashing a Vercel function.
    const parsedUrl = new URL(supabaseUrl);

    if (
      parsedUrl.protocol !== "https:" &&
      parsedUrl.protocol !== "http:"
    ) {
      console.error("[supabase] Invalid Supabase URL protocol.");
      return null;
    }

    return createClient(
      parsedUrl.toString().replace(/\/$/, ""),
      supabaseAnonKey,
      {
        auth: {
          persistSession: false,
        },
      }
    );
  } catch (error) {
    console.error(
      "[supabase] Could not create server client. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      error instanceof Error ? error.message : error
    );

    return null;
  }
}

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey
);
