// Shared types for Rajput Palace hotel website.
// These mirror the Supabase schema defined in supabase/schema.sql

export interface Room {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number | null; // null / 0 => "Price on request"
  max_guests: number;
  bed_type: string;
  amenities: string[];
  featured_image: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RoomImage {
  id: string;
  room_id: string;
  image_url: string;
  alt_text: string;
  sort_order: number;
  created_at: string;
}

export type BookingStatus = "new" | "contacted" | "confirmed" | "cancelled";

export interface BookingInquiry {
  id?: string;
  guest_name: string;
  phone: string;
  email: string;
  check_in: string; // ISO date
  check_out: string; // ISO date
  guests: number;
  rooms_requested: number;
  room_type: string;
  special_request?: string | null;
  status?: BookingStatus;
  created_at?: string;
}

export interface HotelSettings {
  id: string;
  hotel_name: string;
  address: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  google_maps_url: string | null;
  description: string | null;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  category:
    | "Hotel"
    | "Rooms"
    | "Exterior"
    | "Interiors"
    | "Amenities"
    | "Nearby Ayodhya";
  alt_text: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  guest_name: string;
  quote: string;
  location?: string | null;
  is_active: boolean;
}
