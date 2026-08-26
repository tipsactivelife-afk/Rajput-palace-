import { NextResponse } from "next/server";
import { requireAdminSupabase } from "@/lib/admin-api-helpers";
import type { BookingInquiry, BookingStatus } from "@/lib/types";

const VALID_STATUSES: BookingStatus[] = ["new", "contacted", "confirmed", "cancelled"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, errorResponse } = requireAdminSupabase();
  if (!supabase) return errorResponse;

  let body: Partial<BookingInquiry>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.status || !VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("booking_inquiries")
    .update({ status: body.status })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ booking: data as BookingInquiry });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, errorResponse } = requireAdminSupabase();
  if (!supabase) return errorResponse;

  const { error } = await supabase.from("booking_inquiries").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

