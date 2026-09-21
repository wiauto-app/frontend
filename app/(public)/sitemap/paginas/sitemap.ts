import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo/absolute-url";
import { INDEXABLE_STATIC_PAGES } from "@/lib/seo/static-pages";

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE_STATIC_PAGES.map((path) => ({ url: absoluteUrl(path) }));
}
