import Link from "next/link";
import type { Room } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RoomGrid } from "@/components/rooms/RoomGrid";

export function RoomsPreview({ rooms }: { rooms: Room[] }) {
  return (
    <section className="py-20 md:py-28 bg-ivory-dim">
      <div className="container-px mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHeading
            eyebrow="Accommodation"
            title="Rooms designed for a restful stay"
            description="Every room is a comfortable base for exploring Ayodhya's temples, ghats and markets."
          />
          <Link
            href="/rooms"
            className="shrink-0 font-label text-sm text-maroon underline underline-offset-4 hover:text-maroon-deep"
          >
            View all rooms
          </Link>
        </div>

        <div className="mt-12">
          <RoomGrid rooms={rooms.slice(0, 3)} />
        </div>
      </div>
    </section>
  );
}
