import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BookingForm } from "@/components/booking/BookingForm";
import { getRooms } from "@/lib/data";

export const metadata: Metadata = {
  title: "Book Your Stay",
  description: "Send a booking / reservation inquiry to Rajput Palace, Ayodhya.",
  alternates: { canonical: "/booking" },
};

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ room?: string }>;
}) {
  const { rooms } = await getRooms();
  const { room } = await searchParams;

  return (
    <div className="py-16 md:py-24">
      <div className="container-px mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Reservation"
          title="Book Your Stay"
          description="Share your travel dates and we will get back to you to confirm availability. This is an inquiry — no payment is required here."
        />
        <div className="mt-12">
          <BookingForm rooms={rooms} defaultRoomSlug={room} />
        </div>
      </div>
    </div>
  );
}
