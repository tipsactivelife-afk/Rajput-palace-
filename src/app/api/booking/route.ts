import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { notifyNewBooking } from "@/lib/notify-booking";
import type { BookingInquiry } from "@/lib/types";

function isValidDate(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(new Date(value).getTime());
}

export async function POST(request: Request) {
  let body: Partial<BookingInquiry>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const guestName = String(body.guest_name || "").trim();
  const phone = String(body.phone || "").trim();
  const email = String(body.email || "").trim();
  const checkIn = body.check_in;
  const checkOut = body.check_out;

  if (!guestName) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!phone || !/^[+]?[\d\s-]{7,15}$/.test(phone)) {
    return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!isValidDate(checkIn) || !isValidDate(checkOut)) {
    return NextResponse.json({ error: "Please provide valid check-in and check-out dates." }, { status: 400 });
  }
  if (new Date(checkOut as string) <= new Date(checkIn as string)) {
    return NextResponse.json({ error: "Check-out date must be after check-in date." }, { status: 400 });
  }

  const inquiry: BookingInquiry = {
    guest_name: guestName,
    phone,
    email,
    check_in: checkIn as string,
    check_out: checkOut as string,
    guests: Number(body.guests) || 1,
    rooms_requested: Number(body.rooms_requested) || 1,
    room_type: String(body.room_type || ""),
    special_request: body.special_request ? String(body.special_request).slice(0, 1000) : null,
    status: "new",
  };

  const supabase = getSupabaseServerClient();

  // If Supabase is not yet configured, don't fail the guest's request —
  // acknowledge receipt so the UX still works end to end. Once Supabase
  // is connected, inquiries are persisted for real.
  if (!supabase) {
    console.warn(
      "[booking] Supabase is not configured — inquiry was not persisted. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
    // Still email the hotel so the enquiry isn't lost even before
    // Supabase is connected.
    await notifyNewBooking(inquiry);
    return NextResponse.json({ ok: true, persisted: false });
  }

  const { error } = await supabase.from("booking_inquiries").insert(inquiry);

  if (error) {
    // Never leak raw database errors to the client.
    console.error("[booking] Supabase insert failed:", error.message);
    return NextResponse.json(
      { error: "Something went wrong. Please try again or contact us on WhatsApp." },
      { status: 500 },
    );
  }

  // Best-effort email to the hotel's official inbox — never blocks or
  // fails the guest's booking confirmation.
  await notifyNewBooking(inquiry);

  return NextResponse.json({ ok: true, persisted: true });
}
