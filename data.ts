import { getSupabaseServerClient } from "./supabase/server";
import {
  demoGallery,
  demoHotelSettings,
  demoRooms,
  demoTestimonials,
} from "./demo-data";
import type { GalleryItem, HotelSettings, Room, Testimonial } from "./types";

/**
 * All data-fetching for the public site lives here. Each function tries
 * Supabase first (only when env vars are configured) and gracefully falls
 * back to demo data — so the site never shows a blank/broken page while
 * the owner is still setting up their database.
 */

export async function getRooms(): Promise<{ rooms: Room[]; isDemo: boolean }> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return { rooms: demoRooms, isDemo: true };

  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error || !data || data.length === 0) {
    return { rooms: demoRooms, isDemo: true };
  }
  return { rooms: data as Room[], isDemo: false };
}

export async function getRoomBySlug(
  slug: string,
): Promise<{ room: Room | null; isDemo: boolean }> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return { room: demoRooms.find((r) => r.slug === slug) ?? null, isDemo: true };
  }

  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    return { room: demoRooms.find((r) => r.slug === slug) ?? null, isDemo: true };
  }
  return { room: data as Room, isDemo: false };
}

export async function getGallery(): Promise<{ items: GalleryItem[]; isDemo: boolean }> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return { items: demoGallery, isDemo: true };

  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) {
    return { items: demoGallery, isDemo: true };
  }
  return { items: data as GalleryItem[], isDemo: false };
}

export async function getHotelSettings(): Promise<HotelSettings> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return demoHotelSettings;

  const { data, error } = await supabase
    .from("hotel_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error || !data) return demoHotelSettings;
  return data as HotelSettings;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return demoTestimonials;

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_active", true);

  if (error || !data) return demoTestimonials;
  return data as Testimonial[];
}
