import Link from "next/link";
import { ayodhyaAttractions } from "@/lib/demo-data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ImageFallback } from "@/components/ui/ImageFallback";

export function AyodhyaExperience() {
  return (
    <section className="py-20 md:py-28 bg-maroon-deep text-ivory">
      <div className="container-px mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Beyond Your Stay"
          title="Discover Ayodhya"
          description="Rajput Palace places you within convenient reach of the city's most meaningful sites."
          light
        />

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ayodhyaAttractions.map((place) => (
            <div key={place.name} className="rounded-2xl overflow-hidden bg-white/5 border border-ivory/10">
              <div className="h-36">
                <ImageFallback src={null} alt={place.name} label={place.name} className="h-full w-full" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-base text-gold-soft">{place.name}</h3>
                <p className="mt-1.5 text-xs text-ivory/70 leading-relaxed">{place.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/location"
            className="inline-flex items-center justify-center rounded-full border border-ivory/40 px-7 py-3 text-sm font-label text-ivory hover:bg-ivory/10 transition-colors"
          >
            Explore Ayodhya
          </Link>
        </div>
      </div>
    </section>
  );
}
