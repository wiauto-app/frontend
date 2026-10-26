import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";
import { absoluteUrl } from "@/lib/seo/absolute-url";
import { resolveListingIndexability } from "@/lib/vehicles/listing-url";

import type { VehicleListingSitemapEntry } from "./fetch-vehicle-listing-sitemap";

const toIndexableListingSitemapUrl = (
  params: FindAllVehiclesParams,
): string | null => {
  const { isIndexable, canonicalPath } = resolveListingIndexability(params);

  if (!isIndexable) {
    return null;
  }

  return absoluteUrl(canonicalPath);
};

export const buildCatalogListingSitemapUrl = (
  entry: VehicleListingSitemapEntry,
): string | null =>
  toIndexableListingSitemapUrl({
    makes_slugs: [entry.makeSlug],
    models_slugs: [entry.modelSlug],
  });

export const buildWithProvinceListingSitemapUrl = (
  entry: VehicleListingSitemapEntry,
): string | null => {
  if (!entry.provinceSlug) {
    return null;
  }

  return toIndexableListingSitemapUrl({
    makes_slugs: [entry.makeSlug],
    models_slugs: [entry.modelSlug],
    provinces_slugs: [entry.provinceSlug],
  });
};
