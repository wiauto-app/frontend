import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo/absolute-url";
import { fetchAllDealershipSitemapEntries } from "@/lib/seo/fetch-dealership-sitemap";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await fetchAllDealershipSitemapEntries();

  return entries
    .filter((entry) => entry.slug)
    .map((entry) => ({
      url: absoluteUrl(`/concesionario/${encodeURIComponent(entry.slug)}`),
      lastModified: entry.updatedAt,
    }));
}
