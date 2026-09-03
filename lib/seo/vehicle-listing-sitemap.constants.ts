export const VEHICLE_LISTING_SITEMAP_PAGE_SIZE = 5000;
export const VEHICLE_LISTING_SITEMAP_CATALOG_PRIORITY = 0.7;
export const VEHICLE_LISTING_SITEMAP_WITH_PROVINCE_PRIORITY = 0.65;

export const VEHICLE_LISTING_SITEMAP_CATALOG_BASE_PATH =
  "/sitemap/vehiculos/catalog";
export const VEHICLE_LISTING_SITEMAP_WITH_PROVINCE_BASE_PATH =
  "/sitemap/vehiculos/with-province";
export const VEHICLE_LISTING_SITEMAP_INDEX_PATH =
  "/sitemap/vehiculos/listings-index.xml";

export type VehicleListingSitemapVariant = "catalog" | "with-province";
