import { NextResponse } from "next/server";
import { requireAdminSupabase } from "@/lib/admin-api-helpers";
import type { HotelSettings } from "@/lib/types";

export async function GET() {
  const { supabase, errorResponse } = requireAdminSupabase();
  if (!supabase) return errorResponse;

  const { data, error } = await supabase.from("hotel_settings").select("*").limit(1).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ settings: data as HotelSettings | null });
}

export async function PATCH(request: Request) {
  const { supabase, errorResponse } = requireAdminSupabase();
  if (!supabase) return errorResponse;

  let body: Partial<HotelSettings>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { data: existing, error: fetchError } = await supabase
    .from("hotel_settings")
    .select("id")
    .limit(1)
    .maybeSingle();
  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });

  const updates: Record<string, unknown> = {};
  for (const key of [
    "hotel_name",
    "address",
    "phone",
    "whatsapp",
    "email",
    "google_maps_url",
    "description",
  ] as const) {
    if (body[key] !== undefined) updates[key] = body[key];
  }

  if (!existing) {
    const { data, error } = await supabase.from("hotel_settings").insert(updates).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ settings: data as HotelSettings });
  }

  const { data, error } = await supabase
    .from("hotel_settings")
    .update(updates)
    .eq("id", existing.id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ settings: data as HotelSettings });
}

