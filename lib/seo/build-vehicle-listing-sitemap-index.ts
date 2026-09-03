import { absoluteUrl } from "@/lib/seo/absolute-url";
import type { VehicleListingSitemapVariant } from "@/lib/seo/vehicle-listing-sitemap.constants";
import {
  VEHICLE_LISTING_SITEMAP_CATALOG_BASE_PATH,
  VEHICLE_LISTING_SITEMAP_WITH_PROVINCE_BASE_PATH,
} from "@/lib/seo/vehicle-listing-sitemap.constants";
import { getVehicleSitemapSegmentIds } from "@/lib/seo/vehicle-sitemap-segments";

export interface VehicleListingSitemapIndexEntry {
  variant: VehicleListingSitemapVariant;
  segmentId: string;
}

const LISTING_SITEMAP_PATH_BY_VARIANT: Record<VehicleListingSitemapVariant, string> =
  {
    catalog: VEHICLE_LISTING_SITEMAP_CATALOG_BASE_PATH,
    "with-province": VEHICLE_LISTING_SITEMAP_WITH_PROVINCE_BASE_PATH,
  };

export function buildVehicleListingSitemapIndexEntries(
  catalogTotalPages: number,
  withProvinceTotalPages: number,
): VehicleListingSitemapIndexEntry[] {
  const catalogEntries = getVehicleSitemapSegmentIds(catalogTotalPages).map(
    (segmentId) => ({
      variant: "catalog" as const,
      segmentId,
    }),
  );
  const withProvinceEntries = getVehicleSitemapSegmentIds(
    withProvinceTotalPages,
  ).map((segmentId) => ({
    variant: "with-province" as const,
    segmentId,
  }));

  return [...catalogEntries, ...withProvinceEntries];
}

export function buildVehicleListingSitemapIndexXml(
  entries: VehicleListingSitemapIndexEntry[],
  lastModified = new Date().toISOString(),
): string {
  const sitemapEntries = entries
    .map((entry) => {
      const basePath = LISTING_SITEMAP_PATH_BY_VARIANT[entry.variant];

      return `  <sitemap>
    <loc>${absoluteUrl(`${basePath}/sitemap/${entry.segmentId}.xml`)}</loc>
    <lastmod>${lastModified}</lastmod>
  </sitemap>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;
}
