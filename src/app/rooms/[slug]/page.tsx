import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRoomBySlug, getRooms } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { RoomGallery } from "@/components/rooms/RoomGallery";
import { CallButton } from "@/components/ui/CallButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export const revalidate = 300;

export async function generateStaticParams() {
  const { rooms } = await getRooms();
  return rooms.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { room } = await getRoomBySlug(slug);
  if (!room) return { title: "Room" };
  return {
    title: room.name,
    description: room.short_description,
    alternates: { canonical: `/rooms/${room.slug}` },
  };
}

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { room } = await getRoomBySlug(slug);

  if (!room) notFound();

  return (
    <div className="py-16 md:py-24">
      <div className="container-px mx-auto max-w-7xl">
        <nav className="text-xs font-label text-charcoal-soft mb-8">
          <Link href="/rooms" className="hover:text-maroon">
            Rooms
          </Link>
          <span className="mx-2">/</span>
          <span className="text-charcoal">{room.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3">
            <RoomGallery roomName={room.name} images={[]} />
          </div>

          <div className="lg:col-span-2">
            <span className="eyebrow text-gold">Room</span>
            <h1 className="mt-2 font-display text-3xl md:text-4xl text-charcoal">{room.name}</h1>
            <p className="mt-3 text-lg font-label text-maroon">{formatPrice(room.price)}</p>

            <p className="mt-6 text-sm leading-relaxed text-charcoal-soft">{room.description}</p>

            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-charcoal-soft">Guests</dt>
                <dd className="font-label text-charcoal">{room.max_guests}</dd>
              </div>
              <div>
                <dt className="text-charcoal-soft">Bed Type</dt>
                <dd className="font-label text-charcoal">{room.bed_type}</dd>
              </div>
            </dl>

            {room.amenities?.length ? (
              <div className="mt-6">
                <span className="eyebrow text-gold">Amenities</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {room.amenities.map((a) => (
                    <span key={a} className="text-xs font-label text-charcoal-soft border border-stone rounded-full px-3 py-1.5">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-3">
              <Link
                href={`/booking?room=${room.slug}`}
                className="inline-flex items-center justify-center rounded-full bg-maroon px-7 py-3.5 text-sm font-label font-medium text-ivory hover:bg-maroon-deep transition-colors"
              >
                Check Availability
              </Link>
              <div className="flex gap-3">
                <CallButton variant="outline" full />
                <WhatsAppButton
                  variant="outline"
                  full
                  message={`Hello Rajput Palace, I would like to enquire about availability for the ${room.name}.`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
                }
