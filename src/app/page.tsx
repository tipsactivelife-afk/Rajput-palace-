import { Hero } from "@/components/home/Hero";
import { Highlights } from "@/components/home/Highlights";
import { RoomsPreview } from "@/components/home/RoomsPreview";
import { AyodhyaExperience } from "@/components/home/AyodhyaExperience";
import { Testimonials } from "@/components/home/Testimonials";
import { LocationSection } from "@/components/location/LocationSection";
import { getRooms, getTestimonials, getHotelSettings } from "@/lib/data";

// Without this, the homepage would be rendered once at build time and
// never pick up new rooms/testimonials/hero image added later from the
// admin panel until the next deploy. Admin API routes also call
// revalidatePath("/") directly after a save, so changes usually show up
// immediately — this is just the safety-net upper bound.
export const revalidate = 300;

export default async function HomePage() {
  const [{ rooms }, testimonials, hotelSettings] = await Promise.all([
    getRooms(),
    getTestimonials(),
    getHotelSettings(),
  ]);

  return (
    <>
      <Hero heroImage={hotelSettings.hero_image} />
      <Highlights />
      <RoomsPreview rooms={rooms} />
      <AyodhyaExperience />
      <LocationSection />
      <Testimonials testimonials={testimonials} />
    </>
  );
}
