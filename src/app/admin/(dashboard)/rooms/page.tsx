"use client";

import { useEffect, useState } from "react";
import type { Room } from "@/lib/types";

type RoomForm = {
  name: string;
  slug: string;
  short_description: string;
  description: string;
  price: string;
  max_guests: string;
  bed_type: string;
  amenities: string;
  featured_image: string;
  is_active: boolean;
};

const EMPTY_FORM: RoomForm = {
  name: "",
  slug: "",
  short_description: "",
  description: "",
  price: "",
  max_guests: "2",
  bed_type: "",
  amenities: "",
  featured_image: "",
  is_active: true,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<RoomForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  async function load() {
    setError(null);
    try {
      const res = await fetch("/api/admin/rooms");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRooms(data.rooms);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load rooms.");
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot data fetch on mount
    load();
  }, []);

  function startNew() {
    setForm(EMPTY_FORM);
    setEditingId("new");
  }

  function startEdit(room: Room) {
    setForm({
      name: room.name,
      slug: room.slug,
      short_description: room.short_description || "",
      description: room.description || "",
      price: room.price === null ? "" : String(room.price),
      max_guests: String(room.max_guests),
      bed_type: room.bed_type || "",
      amenities: (room.amenities || []).join(", "),
      featured_image: room.featured_image || "",
      is_active: room.is_active,
    });
    setEditingId(room.id);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      short_description: form.short_description,
      description: form.description,
      price: form.price.trim() === "" ? null : Number(form.price),
      max_guests: Number(form.max_guests) || 1,
      bed_type: form.bed_type,
      amenities: form.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      featured_image: form.featured_image || null,
      is_active: form.is_active,
    };

    try {
      const isNew = editingId === "new";
      const res = await fetch(isNew ? "/api/admin/rooms" : `/api/admin/rooms/${editingId}`, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEditingId(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save room.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this room permanently?")) return;
    try {
      const res = await fetch(`/api/admin/rooms/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRooms((prev) => prev?.filter((r) => r.id !== id) ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete room.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-maroon">Rooms</h1>
          <p className="mt-1 text-sm text-charcoal-soft">Room types shown on the website.</p>
        </div>
        <button
          onClick={startNew}
          className="rounded-full bg-maroon px-5 py-2.5 text-sm font-label font-medium text-ivory hover:bg-maroon-deep"
        >
          + Add room
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {editingId && (
        <div className="mt-6 rounded-2xl border border-stone bg-white p-6 space-y-4">
          <h2 className="font-display text-lg text-charcoal">
            {editingId === "new" ? "Add a room" : "Edit room"}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name">
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </Field>
            <Field label="Slug (URL)">
              <input
                className="input"
                value={form.slug}
                placeholder={slugify(form.name) || "auto-generated"}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              />
            </Field>
            <Field label="Price (₹, leave blank for 'Price on request')">
              <input
                className="input"
                type="number"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              />
            </Field>
            <Field label="Max guests">
              <input
                className="input"
                type="number"
                min={1}
                value={form.max_guests}
                onChange={(e) => setForm((f) => ({ ...f, max_guests: e.target.value }))}
              />
            </Field>
            <Field label="Bed type">
              <input
                className="input"
                value={form.bed_type}
                onChange={(e) => setForm((f) => ({ ...f, bed_type: e.target.value }))}
              />
            </Field>
            <Field label="Featured image URL">
              <input
                className="input"
                value={form.featured_image}
                onChange={(e) => setForm((f) => ({ ...f, featured_image: e.target.value }))}
              />
            </Field>
          </div>

          <Field label="Short description (used on cards)">
            <input
              className="input"
              value={form.short_description}
              onChange={(e) => setForm((f) => ({ ...f, short_description: e.target.value }))}
            />
          </Field>

          <Field label="Full description">
            <textarea
              className="input min-h-24"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </Field>

          <Field label="Amenities (comma-separated)">
            <input
              className="input"
              value={form.amenities}
              onChange={(e) => setForm((f) => ({ ...f, amenities: e.target.value }))}
            />
          </Field>

          <label className="flex items-center gap-2 text-sm text-charcoal">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
            />
            Visible on the website
          </label>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !form.name}
              className="rounded-full bg-maroon px-5 py-2.5 text-sm font-label font-medium text-ivory hover:bg-maroon-deep disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save room"}
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="rounded-full border border-stone px-5 py-2.5 text-sm font-label text-charcoal-soft"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {rooms && (
        <div className="mt-6 grid gap-3">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-stone bg-white p-4"
            >
              <div>
                <p className="font-display text-charcoal">
                  {room.name}{" "}
                  {!room.is_active && (
                    <span className="ml-2 rounded-full bg-stone/60 px-2 py-0.5 text-[11px] font-label text-charcoal-soft">
                      Hidden
                    </span>
                  )}
                </p>
                <p className="text-xs text-charcoal-soft mt-0.5">
                  /{room.slug} · {room.price ? `₹${room.price}` : "Price on request"} · {room.max_guests} guests
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <button onClick={() => startEdit(room)} className="text-sm font-label text-maroon">
                  Edit
                </button>
                <button onClick={() => remove(room.id)} className="text-sm font-label text-charcoal-soft hover:text-red-600">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {rooms.length === 0 && <p className="text-sm text-charcoal-soft">No rooms yet.</p>}
        </div>
      )}

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid var(--color-stone);
          border-radius: 0.5rem;
          padding: 0.6rem 0.9rem;
          font-size: 0.875rem;
          color: var(--color-charcoal);
        }
        .input:focus {
          outline: none;
          border-color: var(--color-maroon);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-label text-charcoal-soft mb-1">{label}</span>
      {children}
    </label>
  );
}

