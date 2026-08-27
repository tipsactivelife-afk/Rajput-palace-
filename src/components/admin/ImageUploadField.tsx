"use client";

import { useRef, useState } from "react";

export function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <span className="block text-xs font-label text-charcoal-soft mb-1">{label}</span>

      <div className="flex items-start gap-3">
        {value ? (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-stone bg-stone/20">
            {/* Plain img so any external/Supabase URL works without next.config allowlisting */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="h-16 w-16 shrink-0 rounded-lg border border-dashed border-stone flex items-center justify-center text-[10px] text-charcoal-soft text-center px-1">
            No image
          </div>
        )}

        <div className="flex-1 space-y-2">
          <input
            className="w-full rounded-lg border border-stone px-4 py-2.5 text-sm text-charcoal focus:border-maroon outline-none"
            placeholder="Paste an image URL, or upload a file →"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="rounded-full border border-stone px-4 py-1.5 text-xs font-label text-charcoal-soft hover:border-maroon hover:text-maroon disabled:opacity-60"
            >
              {uploading ? "Uploading…" : "Upload from device"}
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {error && <span className="text-xs text-red-600">{error}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

