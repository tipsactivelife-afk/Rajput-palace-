import type { Metadata } from "next";
import { LocationSection } from "@/components/location/LocationSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ayodhyaAttractions } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Location",
  description: "Rajput Palace is located near Sabji Mandi, Sapt Sagar Colony, Ayodhya, Uttar Pradesh, India.",
  alternates: { canonical: "/location" },
};

export default function LocationPage() {
  return (
    <div className="py-16 md:py-24">
      <LocationSection />

      <div className="container-px mx-auto max-w-7xl mt-8">
        <SectionHeading eyebrow="Nearby" title="Places to visit in Ayodhya" />
        <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ayodhyaAttractions.map((place) => (
            <li key={place.name} className="rounded-xl border border-stone bg-white p-5">
              <h3 className="font-display text-base text-maroon">{place.name}</h3>
              <p className="mt-1 text-sm text-charcoal-soft">{place.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
