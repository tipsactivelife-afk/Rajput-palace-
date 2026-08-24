import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ImageFallback } from "@/components/ui/ImageFallback";
import { hotelConfig } from "@/lib/hotel-config";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Rajput Palace, a premium and comfortable hotel in Ayodhya, Uttar Pradesh.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container-px mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <SectionHeading
            eyebrow="About Us"
            title="Rajput Palace, Ayodhya"
            description={`${hotelConfig.name} offers a premium and comfortable stay in the heart of Ayodhya, designed for pilgrims, families, couples, tourists and business travellers alike.`}
          />
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-charcoal-soft">
            <p>
              Located near Sabji Mandi, Sapt Sagar Colony, the hotel gives guests a convenient
              base for exploring Ayodhya&rsquo;s spiritual and cultural landmarks, while offering
              a calm, well-kept space to rest between visits.
            </p>
            <p>
              Our approach is simple: clean, comfortable rooms, attentive service, and a genuinely
              warm welcome for every guest, whether you are visiting for a day of pilgrimage or a
              longer stay with family.
            </p>
          </div>
        </div>

        <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-[var(--shadow-card)]">
          <ImageFallback src={null} alt="Rajput Palace hotel" label="Rajput Palace" className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}
