import { getGoogleMapsUrl, hotelConfig } from "@/lib/hotel-config";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function LocationSection() {
  const mapsUrl = getGoogleMapsUrl();
  const embedQuery = encodeURIComponent(hotelConfig.address);

  return (
    <section className="py-20 md:py-28">
      <div className="container-px mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <SectionHeading
            eyebrow="Location"
            title="Conveniently placed in Ayodhya"
            description="Rajput Palace is located near Sabji Mandi, Sapt Sagar Colony, putting you within easy reach of the city as you explore its spiritual and cultural sites."
          />

          <div className="mt-6 rounded-xl border border-stone bg-white p-5">
            <span className="eyebrow text-gold">Address</span>
            <p className="mt-2 font-display text-lg text-charcoal">{hotelConfig.address}</p>
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-maroon px-7 py-3.5 text-sm font-label font-medium text-ivory hover:bg-maroon-deep transition-colors"
          >
            Get Directions
          </a>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-[var(--shadow-card)] h-80 lg:h-[26rem]">
          {/* Standard embed via a plain query URL — no paid Maps API key required */}
          <iframe
            title="Rajput Palace location map"
            src={`https://www.google.com/maps?q=${embedQuery}&output=embed`}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

