import {
  VEHICLE_SITEMAP_PRIORITY_DEFAULT,
  VEHICLE_SITEMAP_PRIORITY_FEATURED,
} from "@/lib/seo/vehicle-sitemap.constants";

export function getVehicleSitemapPriority(isFeatured: boolean): number {
  return isFeatured
    ? VEHICLE_SITEMAP_PRIORITY_FEATURED
    : VEHICLE_SITEMAP_PRIORITY_DEFAULT;
}
