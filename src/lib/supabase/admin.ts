import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// NOTE: this module reads `SUPABASE_SERVICE_ROLE_KEY`, a server-only secret
// (no `NEXT_PUBLIC_` prefix), so it can only ever run on the server. Do not
// import it from any file marked "use client".

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

/**
 * Service-role Supabase client — for the admin panel only.
 *
 * This client bypasses Row Level Security, so it must NEVER be imported
 * into any client component or exposed to the browser. It is only ever
 * used inside `src/app/api/admin/**` route handlers, which run on the
 * server and are themselves protected by the admin session cookie
 * (see `src/lib/admin-auth.ts`).
 *
 * Returns null (instead of throwing) if the service role key hasn't been
 * configured yet, so the admin API can return a clear "not configured"
 * error instead of crashing.
 */
export function getSupabaseAdminClient(): SupabaseClient | null {
  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  try {
    const parsedUrl = new URL(supabaseUrl);
    return createClient(parsedUrl.toString().replace(/\/$/, ""), serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  } catch (error) {
    console.error("[supabase-admin] Could not create admin client.", error instanceof Error ? error.message : error);
    return null;
  }
}

export const isSupabaseAdminConfigured = Boolean(supabaseUrl && serviceRoleKey);

