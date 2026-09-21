import { absoluteUrl } from "@/lib/seo/absolute-url";

export function buildVehicleSitemapIndexXml(
  segmentIds: string[],
  lastModified?: string,
): string {
  const lastModifiedTag = lastModified
    ? `\n    <lastmod>${lastModified}</lastmod>`
    : "";
  const entries = segmentIds
    .map(
      (id) => `  <sitemap>
    <loc>${absoluteUrl(`/vehiculo/sitemap/${id}.xml`)}</loc>${lastModifiedTag}
  </sitemap>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;
}
