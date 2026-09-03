import { NextResponse } from "next/server";

import {
  buildVehicleListingSitemapIndexEntries,
  buildVehicleListingSitemapIndexXml,
} from "@/lib/seo/build-vehicle-listing-sitemap-index";
import { fetchVehicleListingSitemapMeta } from "@/lib/seo/fetch-vehicle-listing-sitemap";

export const revalidate = 3600;

const SITEMAP_INDEX_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=3600, s-maxage=3600",
} as const;

export async function GET() {
  try {
    const [catalogMeta, withProvinceMeta] = await Promise.all([
      fetchVehicleListingSitemapMeta("catalog"),
      fetchVehicleListingSitemapMeta("with-province"),
    ]);
    const entries = buildVehicleListingSitemapIndexEntries(
      catalogMeta.totalPages,
      withProvinceMeta.totalPages,
    );
    const xml = buildVehicleListingSitemapIndexXml(entries);

    return new NextResponse(xml, { headers: SITEMAP_INDEX_HEADERS });
  } catch {
    const xml = buildVehicleListingSitemapIndexXml(
      buildVehicleListingSitemapIndexEntries(0, 0),
    );

    return new NextResponse(xml, { headers: SITEMAP_INDEX_HEADERS });
  }
}
