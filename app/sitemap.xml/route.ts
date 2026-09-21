import { NextResponse } from "next/server";

import {
  buildMasterSitemapLocs,
  buildSitemapIndexXml,
} from "@/lib/seo/build-sitemap-index";
import { fetchVehicleListingSitemapMeta } from "@/lib/seo/fetch-vehicle-listing-sitemap";
import { fetchVehicleSitemapMeta } from "@/lib/seo/fetch-vehicle-sitemap";

export const revalidate = 3600;

const SITEMAP_INDEX_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
} as const;

export async function GET() {
  const [vehicleMeta, catalogMeta, withProvinceMeta] = await Promise.all([
    fetchVehicleSitemapMeta(),
    fetchVehicleListingSitemapMeta("catalog"),
    fetchVehicleListingSitemapMeta("with-province"),
  ]);
  const locs = buildMasterSitemapLocs({
    vehiclePages: vehicleMeta.totalPages,
    catalogPages: catalogMeta.totalPages,
    withProvincePages: withProvinceMeta.totalPages,
  });
  const xml = buildSitemapIndexXml(locs);

  return new NextResponse(xml, { headers: SITEMAP_INDEX_HEADERS });
}
