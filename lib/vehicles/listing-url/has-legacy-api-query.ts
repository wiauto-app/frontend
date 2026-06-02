import { FRIENDLY_QUERY_TO_DTO, LEGACY_API_QUERY_KEYS } from "./constants";

const FRIENDLY_QUERY_KEYS = new Set(Object.keys(FRIENDLY_QUERY_TO_DTO));

/** Query con nombres del API (make_slug, etc.) que deben redirigir a URL SEO */
export const hasLegacyApiQueryParams = (
  search_params: URLSearchParams,
): boolean => {
  for (const key of LEGACY_API_QUERY_KEYS) {
    if (FRIENDLY_QUERY_KEYS.has(key)) {
      continue;
    }
    if (key === "page" || key === "limit" || key === "order_by" || key === "order_direction") {
      continue;
    }
    if (search_params.has(key)) {
      return true;
    }
  }
  return false;
};
