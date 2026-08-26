import { NextResponse } from "next/server";
import { requireAdminSupabase } from "@/lib/admin-api-helpers";
import type { GalleryItem } from "@/lib/types";

export async function GET() {
  const { supabase, errorResponse } = requireAdminSupabase();
  if (!supabase) return errorResponse;

  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data as GalleryItem[] });
}

export async function POST(request: Request) {
  const { supabase, errorResponse } = requireAdminSupabase();
  if (!supabase) return errorResponse;

  let body: Partial<GalleryItem>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const title = String(body.title || "").trim();
  const imageUrl = String(body.image_url || "").trim();
  const category = String(body.category || "Hotel");
  if (!title || !imageUrl) {
    return NextResponse.json({ error: "Title and image URL are required." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("gallery")
    .insert({
      title,
      image_url: imageUrl,
      category,
      alt_text: String(body.alt_text || title),
      sort_order: Number(body.sort_order) || 0,
      is_active: body.is_active ?? true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data as GalleryItem }, { status: 201 });
}

