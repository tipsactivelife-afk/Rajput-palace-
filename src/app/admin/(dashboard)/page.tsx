"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Counts {
  bookings: number;
  newBookings: number;
  rooms: number;
  gallery: number;
  testimonials: number;
}

export default function AdminDashboardHome() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [bookingsRes, roomsRes, galleryRes, testimonialsRes] = await Promise.all([
          fetch("/api/admin/bookings"),
          fetch("/api/admin/rooms"),
          fetch("/api/admin/gallery"),
          fetch("/api/admin/testimonials"),
        ]);
        const [bookingsData, roomsData, galleryData, testimonialsData] = await Promise.all([
          bookingsRes.json(),
          roomsRes.json(),
          galleryRes.json(),
          testimonialsRes.json(),
        ]);

        if (!bookingsRes.ok) throw new Error(bookingsData.error);

        setCounts({
          bookings: bookingsData.bookings?.length ?? 0,
          newBookings: bookingsData.bookings?.filter((b: { status: string }) => b.status === "new").length ?? 0,
          rooms: roomsData.rooms?.length ?? 0,
          gallery: galleryData.items?.length ?? 0,
          testimonials: testimonialsData.testimonials?.length ?? 0,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load dashboard data.");
      }
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl text-maroon">Dashboard</h1>
      <p className="mt-1 text-sm text-charcoal-soft">Overview of your site content.</p>

      {error && (
        <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          {error}
        </div>
      )}

      {counts && (
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card href="/admin/bookings" label="New enquiries" value={counts.newBookings} highlight />
          <Card href="/admin/bookings" label="Total bookings" value={counts.bookings} />
          <Card href="/admin/rooms" label="Rooms" value={counts.rooms} />
          <Card href="/admin/gallery" label="Gallery photos" value={counts.gallery} />
          <Card href="/admin/testimonials" label="Testimonials" value={counts.testimonials} />
          <Card href="/admin/settings" label="Contact settings" value="Edit" isText />
        </div>
      )}
    </div>
  );
}

function Card({
  href,
  label,
  value,
  highlight,
  isText,
}: {
  href: string;
  label: string;
  value: number | string;
  highlight?: boolean;
  isText?: boolean;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-stone bg-white p-5 hover:shadow-[var(--shadow-card)] transition-shadow"
    >
      <p className="text-xs font-label uppercase tracking-wide text-charcoal-soft">{label}</p>
      <p className={`mt-2 font-display ${isText ? "text-lg" : "text-3xl"} ${highlight ? "text-maroon" : "text-charcoal"}`}>
        {value}
      </p>
    </Link>
  );
}

