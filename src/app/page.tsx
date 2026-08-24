import { Hero } from "@/components/home/Hero";
import { Highlights } from "@/components/home/Highlights";
import { RoomsPreview } from "@/components/home/RoomsPreview";
import { AyodhyaExperience } from "@/components/home/AyodhyaExperience";
import { Testimonials } from "@/components/home/Testimonials";
import { LocationSection } from "@/components/location/LocationSection";
import { getRooms, getTestimonials } from "@/lib/data";

export default async function HomePage() {
  const [{ rooms }, testimonials] = await Promise.all([getRooms(), getTestimonials()]);

  return (
    <>
      <Hero />
      <Highlights />
      <RoomsPreview rooms={rooms} />
      <AyodhyaExperience />
      <LocationSection />
      <Testimonials testimonials={testimonials} />
    </>
  );
}
