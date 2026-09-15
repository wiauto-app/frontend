export const DEALER_FILTER_KEYS = {
  QUERY: "q",
  PROVINCE_SLUG: "province_slug",
  RADIUS: "radius",
  RATING_SINCE: "rating_since",
  VEHICLES_NUMBER: "vehicles_number",
  PAGE: "page",
  LIMIT: "limit",
  SORT: "sort",
} as const;

export const DEALER_FILTER_KEYS_LIST = Object.values(DEALER_FILTER_KEYS);

export const DEFAULT_DEALER_LIMIT = 12;
