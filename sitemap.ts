import type { MetadataRoute } from "next";
import { hotelConfig } from "@/lib/hotel-config";
import { getRooms } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = hotelConfig.siteUrl.replace(/\/$/, "");
  const { rooms } = await getRooms();

  const staticRoutes = [
    "",
    "/rooms",
    "/amenities",
    "/gallery",
    "/about",
    "/location",
    "/contact",
    "/booking",
    "/privacy-policy",
    "/terms-and-conditions",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const roomRoutes = rooms.map((room) => ({
    url: `${base}/rooms/${room.slug}`,
    lastModified: new Date(room.updated_at || Date.now()),
  }));

  return [...staticRoutes, ...roomRoutes];
}
