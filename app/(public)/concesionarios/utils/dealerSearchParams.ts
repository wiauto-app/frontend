import {
  DEFAULT_DEALER_LIMIT,
  DEALER_FILTER_KEYS,
} from "../constants/filterKeys.constants";

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
  if (query) {
    params.query = query;
  }

  const province_slug = get(DEALER_FILTER_KEYS.PROVINCE_SLUG);
  if (province_slug) {
    params.province_slug = province_slug;
  }

  const radius = get(DEALER_FILTER_KEYS.RADIUS);
  if (radius) {
    const parsed = parseInt(radius, 10);
    if (!Number.isNaN(parsed)) {
      params.radius = parsed;
    }
  }

  const rating_since = get(DEALER_FILTER_KEYS.RATING_SINCE);
  if (rating_since) {
    const parsed = parseFloat(rating_since);
    if (!Number.isNaN(parsed)) {
      params.rating_since = parsed;
    }
  }

  const vehicles_number = get(DEALER_FILTER_KEYS.VEHICLES_NUMBER);
  if (vehicles_number) {
    const parsed = parseInt(vehicles_number, 10);
    if (!Number.isNaN(parsed)) {
      params.vehicles_number = parsed;
    }
  }

  const page = get(DEALER_FILTER_KEYS.PAGE);
  if (page) {
    const parsed = parseInt(page, 10);
    if (!Number.isNaN(parsed)) {
      params.page = parsed;
    }
  }

  const limit = get(DEALER_FILTER_KEYS.LIMIT);
  if (limit) {
    const parsed = parseInt(limit, 10);
    if (!Number.isNaN(parsed)) {
      params.limit = parsed;
    }
  } else {
    params.limit = DEFAULT_DEALER_LIMIT;
  }

  const sort = get(DEALER_FILTER_KEYS.SORT);
  if (sort) {
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
  return `/concesionarias${qs ? `?${qs}` : ""}`;
};
