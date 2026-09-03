import type { MetadataRoute } from "next";

import { FRONTEND_URL } from "@/constants";
import { VEHICLE_LISTING_SITEMAP_INDEX_PATH } from "@/lib/seo/vehicle-listing-sitemap.constants";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = (FRONTEND_URL ?? "https://www.wiauto.es").replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: [
      `${siteUrl}/sitemap.xml`,
      `${siteUrl}/vehiculo/sitemap-index.xml`,
      `${siteUrl}${VEHICLE_LISTING_SITEMAP_INDEX_PATH}`,
    ],
  };
}
