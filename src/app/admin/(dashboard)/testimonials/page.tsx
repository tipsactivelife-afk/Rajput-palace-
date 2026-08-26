"use client";

import { useEffect, useState } from "react";
import type { Testimonial } from "@/lib/types";

type TestimonialForm = {
  guest_name: string;
  quote: string;
  location: string;
  is_active: boolean;
};

const EMPTY_FORM: TestimonialForm = { guest_name: "", quote: "", location: "", is_active: false };

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<TestimonialForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  async function load() {
    setError(null);
    try {
      const res = await fetch("/api/admin/testimonials");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setItems(data.testimonials);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load testimonials.");
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

  function startEdit(item: Testimonial) {
    setForm({
      guest_name: item.guest_name,
      quote: item.quote,
      location: item.location || "",
      is_active: item.is_active,
    });
    setEditingId(item.id);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    const payload = {
      guest_name: form.guest_name,
      quote: form.quote,
      location: form.location || null,
      is_active: form.is_active,
    };
    try {
      const isNew = editingId === "new";
      const res = await fetch(isNew ? "/api/admin/testimonials" : `/api/admin/testimonials/${editingId}`, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEditingId(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save testimonial.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setItems((prev) => prev?.filter((i) => i.id !== id) ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete testimonial.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-maroon">Testimonials</h1>
          <p className="mt-1 text-sm text-charcoal-soft">
            Only add real, verifiable guest reviews — nothing here should be invented.
          </p>
        </div>
        <button
          onClick={startNew}
          className="rounded-full bg-maroon px-5 py-2.5 text-sm font-label font-medium text-ivory hover:bg-maroon-deep"
        >
          + Add
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {editingId && (
        <div className="mt-6 rounded-2xl border border-stone bg-white p-6 space-y-4">
          <h2 className="font-display text-lg text-charcoal">{editingId === "new" ? "Add testimonial" : "Edit testimonial"}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Guest name">
              <input className="input" value={form.guest_name} onChange={(e) => setForm((f) => ({ ...f, guest_name: e.target.value }))} />
            </Field>
            <Field label="Location (optional)">
              <input className="input" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
            </Field>
          </div>
          <Field label="Quote">
            <textarea className="input min-h-24" value={form.quote} onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))} />
          </Field>
          <label className="flex items-center gap-2 text-sm text-charcoal">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} />
            Visible on the website
          </label>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !form.guest_name || !form.quote}
              className="rounded-full bg-maroon px-5 py-2.5 text-sm font-label font-medium text-ivory hover:bg-maroon-deep disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button onClick={() => setEditingId(null)} className="rounded-full border border-stone px-5 py-2.5 text-sm font-label text-charcoal-soft">
              Cancel
            </button>
          </div>
        </div>
      )}

      {items && (
        <div className="mt-6 grid gap-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-stone bg-white p-4">
              <p className="font-display text-charcoal">
                {item.guest_name} {!item.is_active && <span className="ml-2 text-[11px] font-label text-charcoal-soft">Hidden</span>}
              </p>
              <p className="text-sm text-charcoal-soft mt-1">&ldquo;{item.quote}&rdquo;</p>
              <div className="mt-3 flex gap-3">
                <button onClick={() => startEdit(item)} className="text-sm font-label text-maroon">
                  Edit
                </button>
                <button onClick={() => remove(item.id)} className="text-sm font-label text-charcoal-soft hover:text-red-600">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-charcoal-soft">No testimonials yet.</p>}
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

