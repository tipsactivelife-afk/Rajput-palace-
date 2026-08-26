import type { BookingInquiry } from "./types";
import { hotelConfig } from "./hotel-config";

/**
 * Sends a "new booking enquiry" email to the hotel's official inbox
 * (hotelConfig.email) using Resend (https://resend.com — free tier is
 * enough for a small hotel's volume of enquiries).
 *
 * This is best-effort and NEVER throws: if RESEND_API_KEY isn't set yet,
 * or the email fails to send for any reason, we log a warning and the
 * booking flow continues normally (the enquiry is still saved to
 * Supabase and shown in /admin/bookings either way).
 */
export async function notifyNewBooking(inquiry: BookingInquiry): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.warn(
      "[booking-notify] RESEND_API_KEY is not set — skipping email notification. See .env.example.",
    );
    return;
  }

  const fromAddress = process.env.RESEND_FROM_EMAIL?.trim() || "Rajput Palace Website <onboarding@resend.dev>";
  const toAddress = hotelConfig.email;
  if (!toAddress) return;

  const subject = `New booking enquiry — ${inquiry.guest_name}`;
  const html = `
    <div style="font-family:sans-serif;font-size:14px;color:#262220;">
      <h2 style="color:#5c1420;margin-bottom:4px;">New booking enquiry</h2>
      <p style="color:#4a433d;margin-top:0;">Rajput Palace, Ayodhya</p>
      <table cellpadding="6" style="border-collapse:collapse;">
        <tr><td><strong>Guest name</strong></td><td>${escapeHtml(inquiry.guest_name)}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${escapeHtml(inquiry.phone)}</td></tr>
        <tr><td><strong>Email</strong></td><td>${escapeHtml(inquiry.email || "—")}</td></tr>
        <tr><td><strong>Check-in</strong></td><td>${escapeHtml(inquiry.check_in)}</td></tr>
        <tr><td><strong>Check-out</strong></td><td>${escapeHtml(inquiry.check_out)}</td></tr>
        <tr><td><strong>Guests</strong></td><td>${inquiry.guests}</td></tr>
        <tr><td><strong>Rooms requested</strong></td><td>${inquiry.rooms_requested}</td></tr>
        <tr><td><strong>Room type</strong></td><td>${escapeHtml(inquiry.room_type || "—")}</td></tr>
        <tr><td><strong>Special request</strong></td><td>${escapeHtml(inquiry.special_request || "—")}</td></tr>
      </table>
      <p style="margin-top:16px;color:#4a433d;">
        View and manage this enquiry in the admin panel at /admin/bookings.
      </p>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [toAddress],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[booking-notify] Resend API error:", res.status, text);
    }
  } catch (error) {
    console.error("[booking-notify] Failed to send email:", error instanceof Error ? error.message : error);
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

