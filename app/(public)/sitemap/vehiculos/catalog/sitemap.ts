import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo/absolute-url";
import {
  fetchVehicleListingSitemapMeta,
  fetchVehicleListingSitemapPage,
} from "@/lib/seo/fetch-vehicle-listing-sitemap";
import { VEHICLE_LISTING_SITEMAP_CATALOG_PRIORITY } from "@/lib/seo/vehicle-listing-sitemap.constants";
import { getVehicleSitemapSegmentIds } from "@/lib/seo/vehicle-sitemap-segments";

const EMPTY_SITEMAP: MetadataRoute.Sitemap = [];

export async function generateSitemaps() {
  try {
    const meta = await fetchVehicleListingSitemapMeta("catalog");

    return getVehicleSitemapSegmentIds(meta.totalPages).map((id) => ({ id }));
  } catch {
    return [{ id: "0" }];
  }
}

export default async function sitemap({
  id,
}: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  try {
    const sitemapId = Number(await id);
    const page = Number.isFinite(sitemapId) ? sitemapId + 1 : 1;
    const result = await fetchVehicleListingSitemapPage("catalog", page);

    return result.data.map((entry) => ({
      url: absoluteUrl(`/vehiculos/${entry.makeSlug}/${entry.modelSlug}`),
      changeFrequency: "weekly",
      priority: VEHICLE_LISTING_SITEMAP_CATALOG_PRIORITY,
    }));
  } catch {
    return EMPTY_SITEMAP;
  }
}
