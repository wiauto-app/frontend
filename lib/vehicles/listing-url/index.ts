export {
  ARRAY_DTO_KEYS,
  BOOLEAN_DTO_KEYS,
  CATALOG_DEGRADED_QUERY_KEYS,
  COMMUNITY_PATH_PREFIX,
  DEFAULT_LISTING_PARAMS,
  DTO_TO_FRIENDLY_QUERY,
  FRIENDLY_QUERY_TO_DTO,
  LEGACY_API_QUERY_KEYS,
  MAX_PATH_SEGMENTS,
  MUNICIPALITY_PATH_PREFIX,
  NUMERIC_DTO_KEYS,
  PROVINCE_PATH_PREFIX,
  VEHICLES_LISTING_BASE_PATH,
} from "./constants";

export { buildPathSegments } from "./build-path-segments";
export { parsePathSegments } from "./parse-path-segments";

export {
  buildVehicleListingHref,
  buildVehicleListingUrl,
} from "./build-listing-url";

export {
  buildCanonicalListingHref,
  buildCanonicalListingPath,
  toCanonicalCatalogParams,
} from "./build-canonical-url";

export { normalizeVehicleListingHref } from "./normalize-listing-url";
export { isIndexableListingPathname } from "./indexable-listing-url";

export { parseVehicleListingUrl } from "./parse-listing-url";
export { heroFiltersToListingParams } from "./hero-to-listing-params";
export type { HeroListingFilters } from "./hero-to-listing-params";
export {
  buildHeroListingHref,
  type HeroListingSearchState,
} from "./build-hero-listing-href";
export { hasLegacyApiQueryParams } from "./has-legacy-api-query";
export {
  normalizeOrderDirection,
  orderDirectionFromUrlSegment,
  orderDirectionToUrlSegment,
} from "./order-direction";
export type { OrderDirection, UrlOrderDirection } from "./order-direction";
