"use client";

import { useState } from "react";
import type { RoomImage } from "@/lib/types";
import { ImageFallback } from "@/components/ui/ImageFallback";

export function RoomGallery({ roomName, images }: { roomName: string; images: RoomImage[] }) {
  const gallery = images.length
    ? images
    : [{ id: "placeholder", room_id: "", image_url: "", alt_text: roomName, sort_order: 0, created_at: "" }];

  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="aspect-[16/10] rounded-2xl overflow-hidden shadow-[var(--shadow-card)]">
        <ImageFallback
          src={gallery[active]?.image_url}
          alt={gallery[active]?.alt_text || roomName}
          label={roomName}
          className="h-full w-full"
        />
      </div>

      {gallery.length > 1 ? (
        <div className="mt-4 grid grid-cols-4 sm:grid-cols-5 gap-3">
          {gallery.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActive(idx)}
              className={`aspect-square rounded-lg overflow-hidden ring-2 transition-colors ${
                idx === active ? "ring-maroon" : "ring-transparent"
              }`}
              aria-label={`Show image ${idx + 1}`}
            >
              <ImageFallback src={img.image_url} alt={img.alt_text || roomName} className="h-full w-full" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
