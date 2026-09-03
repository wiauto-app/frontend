import { absoluteUrl } from "@/lib/seo/absolute-url";

export function buildVehicleSitemapIndexXml(
  segmentIds: string[],
  lastModified = new Date().toISOString(),
): string {
  const entries = segmentIds
    .map(
      (id) => `  <sitemap>
    <loc>${absoluteUrl(`/vehiculo/sitemap/${id}.xml`)}</loc>
    <lastmod>${lastModified}</lastmod>
  </sitemap>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;
}
