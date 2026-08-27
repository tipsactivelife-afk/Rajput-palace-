import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSupabase } from "@/lib/admin-api-helpers";
import type { Room } from "@/lib/types";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, errorResponse } = requireAdminSupabase();
  if (!supabase) return errorResponse;

  let body: Partial<Room>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  for (const key of [
    "name",
    "slug",
    "description",
    "short_description",
    "bed_type",
    "featured_image",
    "is_active",
  ] as const) {
    if (body[key] !== undefined) updates[key] = body[key];
  }
  if (body.price !== undefined) {
    updates.price = body.price === null || (body.price as unknown as string) === "" ? null : Number(body.price);
  }
  if (body.max_guests !== undefined) updates.max_guests = Number(body.max_guests) || 1;
  if (body.amenities !== undefined) updates.amenities = Array.isArray(body.amenities) ? body.amenities : [];

  const { data, error } = await supabase.from("rooms").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/");
  revalidatePath("/rooms");
  revalidatePath(`/rooms/${data.slug}`);
  return NextResponse.json({ room: data as Room });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, errorResponse } = requireAdminSupabase();
  if (!supabase) return errorResponse;

  const { error } = await supabase.from("rooms").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/");
  revalidatePath("/rooms");
  return NextResponse.json({ ok: true });
}
