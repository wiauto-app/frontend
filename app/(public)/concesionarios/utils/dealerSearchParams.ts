import {
  DEFAULT_DEALER_LIMIT,
  DEALER_FILTER_KEYS,
} from "../constants/filterKeys.constants";

const VALID_SORTS = new Set([
  "rating-desc",
  "vehicles-desc",
  "distance-asc",
  "reviews-desc",
]);

const parseFiniteNumber = (value: string | undefined): number | undefined => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const parsePositiveInteger = (value: string | undefined): number | undefined => {
  const parsed = parseFiniteNumber(value);
  return parsed !== undefined && Number.isInteger(parsed) && parsed > 0
    ? parsed
    : undefined;
};

export type DealerSearchParams = {
  query?: string;
  province_slug?: string;
  radius?: number;
  rating_since?: number;
  vehicles_number?: number;
  page?: number;
  limit?: number;
  sort?: string;
};

export const parseDealerSearchParams = (
  searchParams: Record<string, string | string[] | undefined>,
): DealerSearchParams => {
  const get = (key: string): string | undefined => {
    const value = searchParams[key];
    if (Array.isArray(value)) {
      return value[0];
    }
    return value;
  };

  const params: DealerSearchParams = {};

  const query = get(DEALER_FILTER_KEYS.QUERY);
  if (query?.trim()) {
    params.query = query.trim();
  }

  const province_slug = get(DEALER_FILTER_KEYS.PROVINCE_SLUG);
  if (province_slug) {
    params.province_slug = province_slug;
  }

  const radius = parseFiniteNumber(get(DEALER_FILTER_KEYS.RADIUS));
  if (
    params.province_slug &&
    radius !== undefined &&
    radius >= 0 &&
    radius <= 100
  ) {
    params.radius = radius;
  }

  const rating_since = parseFiniteNumber(
    get(DEALER_FILTER_KEYS.RATING_SINCE),
  );
  if (
    rating_since !== undefined &&
    rating_since >= 1 &&
    rating_since <= 5
  ) {
    params.rating_since = rating_since;
  }

  const vehicles_number = parseFiniteNumber(
    get(DEALER_FILTER_KEYS.VEHICLES_NUMBER),
  );
  if (
    vehicles_number !== undefined &&
    Number.isInteger(vehicles_number) &&
    vehicles_number >= 0
  ) {
    params.vehicles_number = vehicles_number;
  }

  const page = parsePositiveInteger(get(DEALER_FILTER_KEYS.PAGE));
  if (page !== undefined) {
    params.page = page;
  }

  const limit = parsePositiveInteger(get(DEALER_FILTER_KEYS.LIMIT));
  params.limit = limit !== undefined && limit <= 100
    ? limit
    : DEFAULT_DEALER_LIMIT;

  const sort = get(DEALER_FILTER_KEYS.SORT);
  if (sort && VALID_SORTS.has(sort)) {
    params.sort = sort;
  }

  return params;
};

export const buildDealersSearchParams = (
  params: DealerSearchParams,
): URLSearchParams => {
  const url_params = new URLSearchParams();

  if (params.query) {
    url_params.set(DEALER_FILTER_KEYS.QUERY, params.query);
  }
  if (params.province_slug) {
    url_params.set(DEALER_FILTER_KEYS.PROVINCE_SLUG, params.province_slug);
  }
  if (params.radius != null && params.radius > 0) {
    url_params.set(DEALER_FILTER_KEYS.RADIUS, String(params.radius));
  }
  if (params.rating_since != null && params.rating_since > 0) {
    url_params.set(DEALER_FILTER_KEYS.RATING_SINCE, String(params.rating_since));
  }
  if (params.vehicles_number != null && params.vehicles_number > 0) {
    url_params.set(
      DEALER_FILTER_KEYS.VEHICLES_NUMBER,
      String(params.vehicles_number),
    );
  }
  if (params.page && params.page > 1) {
    url_params.set(DEALER_FILTER_KEYS.PAGE, String(params.page));
  }
  if (params.limit && params.limit !== DEFAULT_DEALER_LIMIT) {
    url_params.set(DEALER_FILTER_KEYS.LIMIT, String(params.limit));
  }
  if (params.sort) {
    url_params.set(DEALER_FILTER_KEYS.SORT, params.sort);
  }

  return url_params;
};

export const buildDealersHref = (params: DealerSearchParams): string => {
  const qs = buildDealersSearchParams(params).toString();
  return `/concesionarios${qs ? `?${qs}` : ""}`;
};
