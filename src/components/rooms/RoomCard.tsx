import Link from "next/link";
import type { Room } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { ImageFallback } from "@/components/ui/ImageFallback";

export function RoomCard({ room }: { room: Room }) {
  return (
    <div className="group rounded-2xl overflow-hidden bg-white shadow-[var(--shadow-card)] flex flex-col">
      <div className="relative h-56 overflow-hidden">
        <ImageFallback
          src={room.featured_image}
          alt={room.name}
          label={room.name}
          className="h-full w-full transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl text-charcoal">{room.name}</h3>
          <span className="shrink-0 text-xs font-label text-maroon bg-stone/60 rounded-full px-3 py-1">
            {formatPrice(room.price)}
          </span>
        </div>

        <p className="mt-2 text-sm text-charcoal-soft leading-relaxed">{room.short_description}</p>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-charcoal-soft font-label">
          <span>{room.max_guests} Guests</span>
          <span>•</span>
          <span>{room.bed_type}</span>
        </div>

        {room.amenities?.length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {room.amenities.slice(0, 3).map((a) => (
              <span key={a} className="text-[11px] font-label text-charcoal-soft border border-stone rounded-full px-2.5 py-1">
                {a}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-6 flex items-center gap-3 pt-2">
          <Link
            href={`/rooms/${room.slug}`}
            className="inline-flex items-center justify-center rounded-full border border-maroon px-5 py-2.5 text-sm font-label text-maroon hover:bg-maroon hover:text-ivory transition-colors"
          >
            View Details
          </Link>
          <Link
            href={`/booking?room=${room.slug}`}
            className="inline-flex items-center justify-center rounded-full bg-maroon px-5 py-2.5 text-sm font-label text-ivory hover:bg-maroon-deep transition-colors"
          >
            Book / Enquire
          </Link>
        </div>
      </div>
    </div>
  );
}

