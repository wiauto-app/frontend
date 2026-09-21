import type { MetadataRoute } from "next";

import { buildContentSitemap } from "@/lib/seo/build-content-sitemap";
import { fetchAllStrapiSitemapEntries } from "@/lib/seo/fetch-strapi-sitemap-entries";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await fetchAllStrapiSitemapEntries("/landings-colaboracions", {
    includeSeo: false,
  });

  return buildContentSitemap(entries, "/colaboraciones");
}
