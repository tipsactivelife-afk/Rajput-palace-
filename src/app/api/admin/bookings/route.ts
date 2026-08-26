import { NextResponse } from "next/server";
import { requireAdminSupabase } from "@/lib/admin-api-helpers";
import type { BookingInquiry } from "@/lib/types";

export async function GET() {
  const { supabase, errorResponse } = requireAdminSupabase();
  if (!supabase) return errorResponse;

  const { data, error } = await supabase
    .from("booking_inquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ bookings: data as BookingInquiry[] });
}

