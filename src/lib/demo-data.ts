// ────────────────────────────────────────────────────────────────────────
// DEMO DATA — for local development and as a fallback when Supabase is not
// yet configured or a table is empty. NONE of this should be mistaken for
// real hotel information:
//   • Room prices are left as `null` → the UI always shows "Price on request"
//   • No testimonials are included (fabricated reviews are never allowed)
//   • Image URLs are intentionally empty so the site renders tasteful
//     placeholders (see <ImageFallback />) instead of any stock/copyrighted
//     photography. Replace with real Supabase Storage URLs when available.
//   • Amenities/attractions mirror the candidate lists supplied in the
//     project brief — confirm each one with the hotel owner before launch.
// ────────────────────────────────────────────────────────────────────────

import type { GalleryItem, HotelSettings, Room, Testimonial } from "./types";
import { hotelConfig } from "./hotel-config";

export const demoHotelSettings: HotelSettings = {
  id: "demo",
  hotel_name: hotelConfig.name,
  address: hotelConfig.address,
  phone: hotelConfig.phone || null,
  whatsapp: hotelConfig.whatsapp || null,
  email: hotelConfig.email || null,
  google_maps_url: hotelConfig.googleMapsUrl || null,
  description:
    "A premium and comfortable stay in Ayodhya for pilgrims, families, couples, tourists and business travellers.",
  updated_at: new Date().toISOString(),
};

export const demoRooms: Room[] = [
  {
    id: "demo-deluxe-room",
    name: "Deluxe Room",
    slug: "deluxe-room",
    short_description:
      "A comfortable, well-appointed room suited to couples and solo travellers.",
    description:
      "The Deluxe Room offers a restful base for exploring Ayodhya, with thoughtful comforts for an easy stay after a day of sightseeing. Exact configuration and inclusions will be confirmed by the hotel.",
    price: null,
    max_guests: 2,
    bed_type: "1 Double Bed",
    amenities: ["Air Conditioning", "Wi-Fi", "Television", "Hot Water", "Housekeeping"],
    featured_image: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-super-deluxe-room",
    name: "Super Deluxe Room",
    slug: "super-deluxe-room",
    short_description: "Extra space and comfort, well suited to small families.",
    description:
      "The Super Deluxe Room is designed for guests who value additional space and comfort during their stay in Ayodhya. Final amenities and layout will be confirmed by the hotel.",
    price: null,
    max_guests: 3,
    bed_type: "1 Double Bed + Extra Bed (on request)",
    amenities: ["Air Conditioning", "Wi-Fi", "Television", "Hot Water", "Room Service"],
    featured_image: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-family-room",
    name: "Family Room",
    slug: "family-room",
    short_description: "A spacious option for families travelling together.",
    description:
      "The Family Room is intended for guests travelling in a group, offering more room to settle in comfortably. Bedding configuration and exact capacity will be finalised by the hotel.",
    price: null,
    max_guests: 4,
    bed_type: "2 Beds",
    amenities: ["Air Conditioning", "Wi-Fi", "Television", "Hot Water", "Family Friendly"],
    featured_image: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Candidate amenities from the brief — confirm each with the owner.
export const demoAmenities = [
  "Comfortable Rooms",
  "Wi-Fi",
  "Air Conditioning",
  "Room Service",
  "Housekeeping",
  "Parking",
  "Hot Water",
  "Television",
  "Family Friendly",
  "24/7 Support",
];

export const demoGallery: GalleryItem[] = [
  { id: "g1", title: "Hotel Frontage", image_url: "", category: "Exterior", alt_text: "Rajput Palace hotel exterior", sort_order: 1, is_active: true, created_at: new Date().toISOString() },
  { id: "g2", title: "Deluxe Room", image_url: "", category: "Rooms", alt_text: "Deluxe room interior", sort_order: 2, is_active: true, created_at: new Date().toISOString() },
  { id: "g3", title: "Lobby", image_url: "", category: "Interiors", alt_text: "Hotel lobby", sort_order: 3, is_active: true, created_at: new Date().toISOString() },
  { id: "g4", title: "Family Room", image_url: "", category: "Rooms", alt_text: "Family room interior", sort_order: 4, is_active: true, created_at: new Date().toISOString() },
  { id: "g5", title: "Hallway", image_url: "", category: "Hotel", alt_text: "Hotel hallway", sort_order: 5, is_active: true, created_at: new Date().toISOString() },
  { id: "g6", title: "Saryu Ghat, Ayodhya", image_url: "", category: "Nearby Ayodhya", alt_text: "Saryu river ghat near the hotel", sort_order: 6, is_active: true, created_at: new Date().toISOString() },
];

// No fabricated reviews — empty by default. Populate once the hotel
// shares real, verifiable guest feedback.
export const demoTestimonials: Testimonial[] = [];

export interface Attraction {
  name: string;
  description: string;
}

// Distances/travel times are intentionally omitted — do not invent them.
export const ayodhyaAttractions: Attraction[] = [
  {
    name: "Shri Ram Janmabhoomi",
    description: "One of Ayodhya's most significant spiritual landmarks.",
  },
  {
    name: "Hanuman Garhi",
    description: "A prominent temple and a common stop for visiting pilgrims.",
  },
  {
    name: "Saryu River / Saryu Ghat",
    description: "The ghats along the Saryu are central to Ayodhya's spiritual life.",
  },
  {
    name: "Kanak Bhawan",
    description: "A temple known for its architecture, popular with visitors.",
  },
];
