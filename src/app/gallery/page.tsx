import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { getGallery } from "@/lib/data";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photo gallery of Rajput Palace, Ayodhya — rooms, interiors, exteriors and nearby attractions.",
  alternates: { canonical: "/gallery" },
};

export const revalidate = 300;

export default async function GalleryPage() {
  const { items } = await getGallery();

  return (
    <div className="py-16 md:py-24">
      <div className="container-px mx-auto max-w-7xl">
        <SectionHeading eyebrow="Gallery" title="A closer look at Rajput Palace" />
        <div className="mt-12">
          <GalleryGrid items={items} />
        </div>
      </div>
    </div>
  );
}
