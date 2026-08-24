import type { Room } from "@/lib/types";
import { RoomCard } from "./RoomCard";
import { EmptyState } from "@/components/ui/EmptyState";

export function RoomGrid({ rooms }: { rooms: Room[] }) {
  if (!rooms.length) {
    return (
      <EmptyState
        title="Room information will be updated shortly."
        description="Please check back soon, or contact us directly and our team will help with availability."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}

