"use client";

import { useMemo, useState } from "react";
import type { GalleryItem } from "@/lib/types";
import { ImageFallback } from "@/components/ui/ImageFallback";
import { EmptyState } from "@/components/ui/EmptyState";

const CATEGORIES = [
  "All",
  "Hotel",
  "Rooms",
  "Exterior",
  "Interiors",
  "Amenities",
  "Nearby Ayodhya",
] as const;

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => (active === "All" ? items : items.filter((i) => i.category === active)),
    [items, active],
  );

  if (!items.length) {
    return (
      <EmptyState
        title="Gallery photos will be updated shortly."
        description="Please check back soon to see more of Rajput Palace."
      />
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`rounded-full px-4 py-2 text-xs font-label transition-colors border ${
              active === cat
                ? "bg-maroon text-ivory border-maroon"
                : "border-stone text-charcoal-soft hover:border-maroon"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10">
          <EmptyState title="No photos in this category yet." />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setLightboxIndex(idx)}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl"
            >
              <ImageFallback
                src={item.image_url}
                alt={item.alt_text || item.title}
                label={item.title}
                className="h-full w-full transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}

      {lightboxIndex !== null && filtered[lightboxIndex] ? (
        <Lightbox
          items={filtered}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      ) : null}
    </div>
  );
}

function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const item = items[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-[60] bg-charcoal/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-5 text-ivory h-10 w-10 rounded-full border border-ivory/30 flex items-center justify-center"
      >
        ✕
      </button>

      {items.length > 1 ? (
        <>
          <button
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((index - 1 + items.length) % items.length);
            }}
            className="absolute left-3 md:left-8 text-ivory h-11 w-11 rounded-full border border-ivory/30 flex items-center justify-center"
          >
            ‹
          </button>
          <button
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((index + 1) % items.length);
            }}
            className="absolute right-3 md:right-8 text-ivory h-11 w-11 rounded-full border border-ivory/30 flex items-center justify-center"
          >
            ›
          </button>
        </>
      ) : null}

      <div className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="aspect-[4/3] rounded-xl overflow-hidden">
          <ImageFallback src={item.image_url} alt={item.alt_text || item.title} label={item.title} className="h-full w-full" />
        </div>
        <p className="mt-3 text-center text-sm text-ivory/80 font-label">{item.title}</p>
      </div>
    </div>
  );
}
