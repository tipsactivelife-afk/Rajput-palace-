import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSupabase } from "@/lib/admin-api-helpers";
import type { GalleryItem } from "@/lib/types";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, errorResponse } = requireAdminSupabase();
  if (!supabase) return errorResponse;

  let body: Partial<GalleryItem>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  for (const key of ["title", "image_url", "category", "alt_text", "is_active"] as const) {
    if (body[key] !== undefined) updates[key] = body[key];
  }
  if (body.sort_order !== undefined) updates.sort_order = Number(body.sort_order) || 0;

  const { data, error } = await supabase.from("gallery").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/gallery");
  return NextResponse.json({ item: data as GalleryItem });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, errorResponse } = requireAdminSupabase();
  if (!supabase) return errorResponse;

  const { error } = await supabase.from("gallery").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/gallery");
  return NextResponse.json({ ok: true });
}
