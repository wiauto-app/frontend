import type { MetadataRoute } from "next";

import {
  fetchVehicleSitemapMeta,
  fetchVehicleSitemapPage,
} from "@/lib/seo/fetch-vehicle-sitemap";
import { absoluteUrl } from "@/lib/seo/absolute-url";
import { getVehicleSitemapPriority } from "@/lib/seo/get-vehicle-sitemap-priority";
import { getVehicleSitemapSegmentIds } from "@/lib/seo/vehicle-sitemap-segments";

const EMPTY_SITEMAP: MetadataRoute.Sitemap = [];

export async function generateSitemaps() {
  try {
    const meta = await fetchVehicleSitemapMeta();

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
    const result = await fetchVehicleSitemapPage(page);

    return result.data.map((entry) => ({
      url: absoluteUrl(`/vehiculo/${entry.id}`),
      lastModified: entry.updatedAt,
      changeFrequency: "daily",
      priority: getVehicleSitemapPriority(entry.isFeatured),
    }));
  } catch {
    return EMPTY_SITEMAP;
  }
}
