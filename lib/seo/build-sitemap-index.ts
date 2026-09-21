import { absoluteUrl } from "@/lib/seo/absolute-url";
import {
  VEHICLE_LISTING_SITEMAP_CATALOG_BASE_PATH,
  VEHICLE_LISTING_SITEMAP_WITH_PROVINCE_BASE_PATH,
} from "@/lib/seo/vehicle-listing-sitemap.constants";
import { getVehicleSitemapSegmentIds } from "@/lib/seo/vehicle-sitemap-segments";

export interface MasterSitemapPages {
  vehiclePages: number;
  catalogPages: number;
  withProvincePages: number;
}

const CONTENT_SITEMAP_PATHS = [
  "/sitemap/paginas/sitemap.xml",
  "/sitemap/noticias/sitemap.xml",
  "/sitemap/colaboraciones/sitemap.xml",
  "/sitemap/concesionarios/sitemap.xml",
] as const;

const ABSOLUTE_URL_PATTERN = /^https?:\/\/[^/\s]+/;

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/** Un `<loc>` relativo es inválido: sin host preferimos fallar a publicar basura. */
const assertSiteHost = (): void => {
  if (!ABSOLUTE_URL_PATTERN.test(absoluteUrl("/"))) {
    throw new Error(
      "NEXT_PUBLIC_FRONTEND_URL no está definido: no se puede generar un sitemap con URLs absolutas.",
    );
  }
};

/** Solo hojas (urlset): un sitemap index no puede listar otros índices. */
export function buildMasterSitemapLocs({
  vehiclePages,
  catalogPages,
  withProvincePages,
}: MasterSitemapPages): string[] {
  assertSiteHost();

  return [
    ...getVehicleSitemapSegmentIds(vehiclePages).map((id) =>
      absoluteUrl(`/vehiculo/sitemap/${id}.xml`),
    ),
    ...getVehicleSitemapSegmentIds(catalogPages).map((id) =>
      absoluteUrl(`${VEHICLE_LISTING_SITEMAP_CATALOG_BASE_PATH}/sitemap/${id}.xml`),
    ),
    ...getVehicleSitemapSegmentIds(withProvincePages).map((id) =>
      absoluteUrl(
        `${VEHICLE_LISTING_SITEMAP_WITH_PROVINCE_BASE_PATH}/sitemap/${id}.xml`,
      ),
    ),
    ...CONTENT_SITEMAP_PATHS.map((path) => absoluteUrl(path)),
  ];
}

export function buildSitemapIndexXml(locs: string[]): string {
  if (locs.some((loc) => !ABSOLUTE_URL_PATTERN.test(loc))) {
    throw new Error("El sitemap index solo admite URLs absolutas.");
  }

  const entries = locs
    .map(
      (loc) => `  <sitemap>
    <loc>${escapeXml(loc)}</loc>
  </sitemap>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;
}
