import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo/absolute-url";
import {
  fetchVehicleListingSitemapMeta,
  fetchVehicleListingSitemapPage,
} from "@/lib/seo/fetch-vehicle-listing-sitemap";
import { VEHICLE_LISTING_SITEMAP_WITH_PROVINCE_PRIORITY } from "@/lib/seo/vehicle-listing-sitemap.constants";
import { getVehicleSitemapSegmentIds } from "@/lib/seo/vehicle-sitemap-segments";

export async function generateSitemaps() {
  const meta = await fetchVehicleListingSitemapMeta("with-province");

  return getVehicleSitemapSegmentIds(meta.totalPages).map((id) => ({ id }));
}

export default async function sitemap({
  id,
}: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const sitemapId = Number(await id);
  const page = Number.isFinite(sitemapId) ? sitemapId + 1 : 1;
  const result = await fetchVehicleListingSitemapPage("with-province", page);

  return result.data
    .filter((entry) => entry.provinceSlug)
    .map((entry) => ({
      url: absoluteUrl(
        `/vehiculos/${entry.makeSlug}/${entry.modelSlug}/${entry.provinceSlug}`,
      ),
      changeFrequency: "weekly",
      priority: VEHICLE_LISTING_SITEMAP_WITH_PROVINCE_PRIORITY,
    }));
}
