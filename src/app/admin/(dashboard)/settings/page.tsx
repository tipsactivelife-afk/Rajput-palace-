"use client";

import { useEffect, useState } from "react";
import type { HotelSettings } from "@/lib/types";

type SettingsForm = {
  hotel_name: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  google_maps_url: string;
  description: string;
};

const EMPTY_FORM: SettingsForm = {
  hotel_name: "",
  address: "",
  phone: "",
  whatsapp: "",
  email: "",
  google_maps_url: "",
  description: "",
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SettingsForm>(EMPTY_FORM);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        const s: HotelSettings | null = data.settings;
        if (s) {
          setForm({
            hotel_name: s.hotel_name || "",
            address: s.address || "",
            phone: s.phone || "",
            whatsapp: s.whatsapp || "",
            email: s.email || "",
            google_maps_url: s.google_maps_url || "",
            description: s.description || "",
          });
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load settings.");
      } finally {
        setLoaded(true);
      }
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl text-maroon">Hotel settings</h1>
      <p className="mt-1 text-sm text-charcoal-soft">
        Note: these values are stored in Supabase. The live site currently reads phone /
        WhatsApp / email from environment variables (see <code>.env.example</code>) so the
        buttons keep working exactly as before. If you&rsquo;d like the website to read
        these from here instead, that&rsquo;s a small follow-up change to{" "}
        <code>src/lib/hotel-config.ts</code>.
      </p>

      {!loaded && <p className="mt-6 text-sm text-charcoal-soft">Loading…</p>}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {loaded && (
        <div className="mt-6 rounded-2xl border border-stone bg-white p-6 space-y-4">
          <Field label="Hotel name">
            <input className="input" value={form.hotel_name} onChange={(e) => setForm((f) => ({ ...f, hotel_name: e.target.value }))} />
          </Field>
          <Field label="Address">
            <textarea className="input min-h-20" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Phone (e.g. +919876543210)">
              <input className="input" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            </Field>
            <Field label="WhatsApp (digits + country code, e.g. 919876543210)">
              <input className="input" value={form.whatsapp} onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))} />
            </Field>
          </div>
          <Field label="Email">
            <input className="input" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </Field>
          <Field label="Google Maps share link (optional)">
            <input className="input" value={form.google_maps_url} onChange={(e) => setForm((f) => ({ ...f, google_maps_url: e.target.value }))} />
          </Field>
          <Field label="Description">
            <textarea className="input min-h-20" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </Field>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-full bg-maroon px-5 py-2.5 text-sm font-label font-medium text-ivory hover:bg-maroon-deep disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save settings"}
            </button>
            {saved && <span className="text-sm text-emerald-700">Saved.</span>}
          </div>
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

