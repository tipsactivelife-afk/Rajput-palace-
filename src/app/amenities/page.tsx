import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AmenityGrid } from "@/components/amenities/AmenityGrid";
import { demoAmenities } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Amenities",
  description: "Explore the amenities available at Rajput Palace, Ayodhya.",
  alternates: { canonical: "/amenities" },
};

export default function AmenitiesPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container-px mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Amenities"
          title="Everything you need for a comfortable stay"
          description="These amenities are confirmed by the hotel before publishing. Reach out if you have a specific requirement."
        />
        <div className="mt-12">
          <AmenityGrid amenities={demoAmenities} />
        </div>
      </div>
    </div>
  );
}
