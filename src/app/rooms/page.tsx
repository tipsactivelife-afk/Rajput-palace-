import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RoomGrid } from "@/components/rooms/RoomGrid";
import { getRooms } from "@/lib/data";

export const metadata: Metadata = {
  title: "Rooms",
  description:
    "Browse rooms at Rajput Palace, Ayodhya — comfortable accommodation for pilgrims, families, couples and travellers.",
  alternates: { canonical: "/rooms" },
};

export const revalidate = 300;

export default async function RoomsPage() {
  const { rooms } = await getRooms();

  return (
    <div className="py-16 md:py-24">
      <div className="container-px mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Accommodation"
          title="Our Rooms"
          description="Every room at Rajput Palace is designed as a comfortable base for your time in Ayodhya. Exact pricing and availability are confirmed on enquiry."
        />
        <div className="mt-12">
          <RoomGrid rooms={rooms} />
        </div>
      </div>
    </div>
  );
}
