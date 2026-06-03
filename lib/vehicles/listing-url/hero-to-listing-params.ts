import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";
import type { HeroSearchFilters } from "@/interfaces/hero-facet.interface";

import { DEFAULT_LISTING_PARAMS } from "./constants";

export type HeroListingFilters = HeroSearchFilters;

export const heroFiltersToListingParams = (
  filters: HeroSearchFilters,
): FindAllVehiclesParams => ({
  ...DEFAULT_LISTING_PARAMS,
  makes_slugs:
    filters.makes_slugs && filters.makes_slugs.length > 0
      ? filters.makes_slugs
      : undefined,
  models_slugs:
    filters.models_slugs && filters.models_slugs.length > 0
      ? filters.models_slugs
      : undefined,
  provinces_slugs:
    filters.provinces_slugs && filters.provinces_slugs.length > 0
      ? filters.provinces_slugs
      : undefined,
  municipalities_slugs:
    filters.municipalities_slugs && filters.municipalities_slugs.length > 0
      ? filters.municipalities_slugs
      : undefined,
  until_price: filters.until_price,
});
