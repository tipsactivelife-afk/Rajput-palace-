import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Every /api/admin/** route is already gated by src/middleware.ts (which
 * checks the signed session cookie before the request reaches here). This
 * helper adds the second, independent piece every one of those routes
 * needs: a working service-role Supabase client, or a clear error if
 * Supabase hasn't been connected yet.
 */
export function requireAdminSupabase() {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return {
      supabase: null,
      errorResponse: NextResponse.json(
        {
          error:
            "Supabase isn't connected yet. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment variables to enable the admin panel.",
        },
        { status: 503 },
      ),
    } as const;
  }
  return { supabase, errorResponse: null } as const;
}

