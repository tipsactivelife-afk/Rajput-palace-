import { NextResponse } from "next/server";
import { requireAdminSupabase } from "@/lib/admin-api-helpers";
import type { Testimonial } from "@/lib/types";

export async function GET() {
  const { supabase, errorResponse } = requireAdminSupabase();
  if (!supabase) return errorResponse;

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ testimonials: data as Testimonial[] });
}

export async function POST(request: Request) {
  const { supabase, errorResponse } = requireAdminSupabase();
  if (!supabase) return errorResponse;

  let body: Partial<Testimonial>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const guestName = String(body.guest_name || "").trim();
  const quote = String(body.quote || "").trim();
  if (!guestName || !quote) {
    return NextResponse.json({ error: "Guest name and quote are required." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("testimonials")
    .insert({
      guest_name: guestName,
      quote,
      location: body.location ? String(body.location) : null,
      is_active: body.is_active ?? false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ testimonial: data as Testimonial }, { status: 201 });
}

