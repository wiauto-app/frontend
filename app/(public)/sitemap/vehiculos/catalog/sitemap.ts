import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo/absolute-url";
import {
  fetchVehicleListingSitemapMeta,
  fetchVehicleListingSitemapPage,
} from "@/lib/seo/fetch-vehicle-listing-sitemap";
import { VEHICLE_LISTING_SITEMAP_CATALOG_PRIORITY } from "@/lib/seo/vehicle-listing-sitemap.constants";
import { getVehicleSitemapSegmentIds } from "@/lib/seo/vehicle-sitemap-segments";
import { buildVehicleListingHref } from "@/lib/vehicles/listing-url";

export async function generateSitemaps() {
  const meta = await fetchVehicleListingSitemapMeta("catalog");

  return getVehicleSitemapSegmentIds(meta.totalPages).map((id) => ({ id }));
}

export default async function sitemap({
  id,
}: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const sitemapId = Number(await id);
  const page = Number.isFinite(sitemapId) ? sitemapId + 1 : 1;
  const result = await fetchVehicleListingSitemapPage("catalog", page);

  return result.data.map((entry) => ({
    url: absoluteUrl(
      buildVehicleListingHref({
        makes_slugs: [entry.makeSlug],
        models_slugs: [entry.modelSlug],
      }),
    ),
    changeFrequency: "weekly",
    priority: VEHICLE_LISTING_SITEMAP_CATALOG_PRIORITY,
  }));
}
