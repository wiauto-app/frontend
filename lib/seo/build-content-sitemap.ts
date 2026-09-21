import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo/absolute-url";
import type { StrapiSitemapEntry } from "@/lib/seo/fetch-strapi-sitemap-entries";

export const buildContentSitemap = (
  entries: StrapiSitemapEntry[],
  basePath: "/noticias" | "/colaboraciones",
): MetadataRoute.Sitemap =>
  entries
    .filter((entry) => entry.slug && !entry.noIndex)
    .map((entry) => ({
      url: absoluteUrl(`${basePath}/${encodeURIComponent(entry.slug)}`),
      lastModified: entry.updatedAt,
    }));
