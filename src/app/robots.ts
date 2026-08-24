import type { MetadataRoute } from "next";
import { hotelConfig } from "@/lib/hotel-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${hotelConfig.siteUrl.replace(/\/$/, "")}/sitemap.xml`,
  };
}
