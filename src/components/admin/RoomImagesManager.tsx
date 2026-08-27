"use client";

import { useEffect, useState } from "react";
import type { RoomImage } from "@/lib/types";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export function RoomImagesManager({ roomId }: { roomId: string }) {
  const [images, setImages] = useState<RoomImage[] | null>(null);
  const [newUrl, setNewUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  async function load() {
    setError(null);
    try {
      const res = await fetch(`/api/admin/rooms/${roomId}/images`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setImages(data.images);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load photos.");
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- refetch only when the room being edited changes
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  async function addImage(url: string) {
    if (!url) return;
    setAdding(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/rooms/${roomId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: url, sort_order: images?.length ?? 0 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setNewUrl("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add photo.");
    } finally {
      setAdding(false);
    }
  }

  async function removeImage(imageId: string) {
    try {
      const res = await fetch(`/api/admin/rooms/${roomId}/images/${imageId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setImages((prev) => prev?.filter((img) => img.id !== imageId) ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not remove photo.");
    }
  }

  return (
    <div>
      <span className="block text-xs font-label text-charcoal-soft mb-2">
        Additional photos (shown in this room&rsquo;s gallery, besides the featured image above)
      </span>

      {error && <p className="text-xs text-red-600 mb-2">{error}</p>}

      {images && images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
          {images.map((img) => (
            <div key={img.id} className="relative rounded-lg overflow-hidden border border-stone aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.image_url} alt={img.alt_text} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute top-1 right-1 rounded-full bg-black/60 text-white text-[10px] px-1.5 py-0.5"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <ImageUploadField
        label=""
        value={newUrl}
        onChange={(url) => {
          setNewUrl(url);
          addImage(url);
        }}
      />
      {adding && <p className="text-xs text-charcoal-soft mt-1">Adding…</p>}
    </div>
  );
}

