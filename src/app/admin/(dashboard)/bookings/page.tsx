"use client";

import { useEffect, useState } from "react";
import type { BookingInquiry, BookingStatus } from "@/lib/types";

const STATUS_OPTIONS: BookingStatus[] = ["new", "contacted", "confirmed", "cancelled"];

const STATUS_STYLES: Record<BookingStatus, string> = {
  new: "bg-amber-100 text-amber-800",
  contacted: "bg-blue-100 text-blue-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-stone/60 text-charcoal-soft",
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingInquiry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBookings(data.bookings);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load bookings.");
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot data fetch on mount
    load();
  }, []);

  async function updateStatus(id: string, status: BookingStatus) {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBookings((prev) => prev?.map((b) => (b.id === id ? data.booking : b)) ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update status.");
    } finally {
      setSavingId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this booking enquiry permanently?")) return;
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBookings((prev) => prev?.filter((b) => b.id !== id) ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete booking.");
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-maroon">Booking enquiries</h1>
      <p className="mt-1 text-sm text-charcoal-soft">Guest booking requests submitted from the website.</p>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {bookings && bookings.length === 0 && (
        <p className="mt-6 text-sm text-charcoal-soft">No booking enquiries yet.</p>
      )}

      {bookings && bookings.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-stone bg-white">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-stone text-left text-xs font-label uppercase text-charcoal-soft">
                <th className="px-4 py-3">Guest</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Guests / Rooms</th>
                <th className="px-4 py-3">Room type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-stone last:border-0 align-top">
                  <td className="px-4 py-3 font-medium text-charcoal">{b.guest_name}</td>
                  <td className="px-4 py-3 text-charcoal-soft">
                    <div>{b.phone}</div>
                    {b.email && <div>{b.email}</div>}
                  </td>
                  <td className="px-4 py-3 text-charcoal-soft whitespace-nowrap">
                    {b.check_in} → {b.check_out}
                  </td>
                  <td className="px-4 py-3 text-charcoal-soft">
                    {b.guests} guests / {b.rooms_requested} rooms
                  </td>
                  <td className="px-4 py-3 text-charcoal-soft">{b.room_type || "—"}</td>
                  <td className="px-4 py-3">
                    <select
                      value={b.status}
                      disabled={savingId === b.id}
                      onChange={(e) => updateStatus(b.id!, e.target.value as BookingStatus)}
                      className={`rounded-full px-3 py-1.5 text-xs font-label border-0 ${STATUS_STYLES[b.status ?? "new"]}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => remove(b.id!)}
                      className="text-xs font-label text-charcoal-soft hover:text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

