"use client";

import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

/**
 * Browser Supabase client.
 * Returns null instead of throwing if Supabase is not configured or the URL
 * is invalid, so a configuration problem cannot crash the UI.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  try {
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
      "[supabase] Could not create browser client. Check Supabase environment variables.",
      error instanceof Error ? error.message : error
    );

    return null;
  }
}

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey
);
