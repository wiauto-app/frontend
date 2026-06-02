import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";

import { DEFAULT_LISTING_PARAMS } from "./constants";

export type HeroListingFilters = {
  make_slug?: string;
  model_slug?: string;
  province_slug?: string;
  municipality_slug?: string;
  until_price?: number;
};

export const heroFiltersToListingParams = (
  filters: HeroListingFilters,
): FindAllVehiclesParams => ({
  ...DEFAULT_LISTING_PARAMS,
  makes_slugs: filters.make_slug ? [filters.make_slug] : undefined,
  models_slugs: filters.model_slug ? [filters.model_slug] : undefined,
  provinces_slugs: filters.province_slug
    ? [filters.province_slug]
    : undefined,
  municipalities_slugs: filters.municipality_slug
    ? [filters.municipality_slug]
    : undefined,
  until_price: filters.until_price,
});
