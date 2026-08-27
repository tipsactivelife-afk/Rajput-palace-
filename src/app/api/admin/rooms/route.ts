import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSupabase } from "@/lib/admin-api-helpers";
import type { Room } from "@/lib/types";

function revalidateRoomPages() {
  revalidatePath("/");
  revalidatePath("/rooms");
}

export async function GET() {
  const { supabase, errorResponse } = requireAdminSupabase();
  if (!supabase) return errorResponse;

  const { data, error } = await supabase.from("rooms").select("*").order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ rooms: data as Room[] });
}

export async function POST(request: Request) {
  const { supabase, errorResponse } = requireAdminSupabase();
  if (!supabase) return errorResponse;

  let body: Partial<Room>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const slug = String(body.slug || "").trim();
  if (!name || !slug) {
    return NextResponse.json({ error: "Name and slug are required." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("rooms")
    .insert({
      name,
      slug,
      description: String(body.description || ""),
      short_description: String(body.short_description || ""),
      price: body.price === null || body.price === undefined || (body.price as unknown as string) === "" ? null : Number(body.price),
      max_guests: Number(body.max_guests) || 2,
      bed_type: String(body.bed_type || ""),
      amenities: Array.isArray(body.amenities) ? body.amenities : [],
      featured_image: body.featured_image ? String(body.featured_image) : null,
      is_active: body.is_active ?? true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidateRoomPages();
  return NextResponse.json({ room: data as Room }, { status: 201 });
}
