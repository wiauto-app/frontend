import { NextResponse } from "next/server";

import { buildVehicleSitemapIndexXml } from "@/lib/seo/build-vehicle-sitemap-index";
import { fetchVehicleSitemapMeta } from "@/lib/seo/fetch-vehicle-sitemap";
import { getVehicleSitemapSegmentIds } from "@/lib/seo/vehicle-sitemap-segments";

export const revalidate = 3600;

const SITEMAP_INDEX_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=3600, s-maxage=3600",
} as const;

export async function GET() {
  try {
    const meta = await fetchVehicleSitemapMeta();
    const segmentIds = getVehicleSitemapSegmentIds(meta.totalPages);
    const xml = buildVehicleSitemapIndexXml(segmentIds);

    return new NextResponse(xml, { headers: SITEMAP_INDEX_HEADERS });
  } catch {
    const xml = buildVehicleSitemapIndexXml(["0"]);

    return new NextResponse(xml, { headers: SITEMAP_INDEX_HEADERS });
  }
}
