import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";

import { buildFilterSegments } from "./build-filter-segments";
import {
  DEFAULT_LISTING_PARAMS,
  VEHICLES_LISTING_BASE_PATH,
} from "./constants";
import { getPathFilterDtoKeys } from "./path-filters.registry";
import { orderDirectionToUrlSegment } from "./order-direction";

const PATH_DTO_KEYS = getPathFilterDtoKeys();

const QUERY_ONLY_KEYS = new Set<keyof FindAllVehiclesParams>([
  "page",
  "limit",
  "query",
  "order_by",
  "order_direction",
  "lat",
  "lng",
  "radius",
  "dealership_ids",
  "exclude_vehicle_ids",
]);

/** Claves que no van al path pero pueden ir en query (p. ej. UI). */
export const LISTING_UI_QUERY_KEYS = ["show_map"] as const;

const shouldOmitQueryValue = (
  key: keyof FindAllVehiclesParams,
  value: unknown,
): boolean => {
  if (value === undefined || value === null || value === "") {
    return true;
  }

  if (key === "page" && value === DEFAULT_LISTING_PARAMS.page) {
    return true;
  }
  if (key === "limit" && value === DEFAULT_LISTING_PARAMS.limit) {
    return true;
  }
  if (key === "order_by" && value === DEFAULT_LISTING_PARAMS.order_by) {
    return true;
  }
  if (
    key === "order_direction" &&
    value === DEFAULT_LISTING_PARAMS.order_direction
  ) {
    return true;
  }

  return false;
};

const buildFriendlySearch = (params: FindAllVehiclesParams): string => {
  const search = new URLSearchParams();

  const setQuery = (key: string, raw: string) => {
    if (raw.length > 0) {
      search.set(key, raw);
    }
  };

  if (!shouldOmitQueryValue("page", params.page)) {
    setQuery("pagina", String(params.page));
  }
  if (!shouldOmitQueryValue("limit", params.limit)) {
    setQuery("limite", String(params.limit));
  }
  if (params.query?.trim()) {
    setQuery("q", params.query.trim());
  }
  if (params.lat !== undefined) {
    setQuery("lat", String(params.lat));
  }
  if (params.lng !== undefined) {
    setQuery("lng", String(params.lng));
  }
  if (params.radius !== undefined) {
    setQuery("radio", String(params.radius));
  }
  if (params.dealership_ids?.length) {
    setQuery("dealership_ids", params.dealership_ids.join(","));
  }
  if (params.dgt_label_ids?.length) {
    setQuery("etiqueta", params.dgt_label_ids.join(","));
  }

  const order_by = params.order_by ?? DEFAULT_LISTING_PARAMS.order_by;
  const order_direction =
    params.order_direction ?? DEFAULT_LISTING_PARAMS.order_direction;
  const is_default_order =
    order_by === DEFAULT_LISTING_PARAMS.order_by &&
    order_direction === DEFAULT_LISTING_PARAMS.order_direction;

  if (!is_default_order) {
    search.set(
      "orden",
      `${order_by}-${orderDirectionToUrlSegment(order_direction)}`,
    );
  }

  return search.toString();
};

export const buildVehicleListingUrl = (
  params: FindAllVehiclesParams,
): { pathname: string; search: string } => {
  const segments = buildFilterSegments(params);
  const pathname =
    segments.length > 0
      ? `${VEHICLES_LISTING_BASE_PATH}/${segments.join("/")}`
      : VEHICLES_LISTING_BASE_PATH;

  return {
    pathname,
    search: buildFriendlySearch(params),
  };
};

export const appendListingUiQuery = (
  href: string,
  search_params: URLSearchParams,
): string => {
  const url = new URL(href, "http://localhost");
  for (const key of LISTING_UI_QUERY_KEYS) {
    const value = search_params.get(key);
    if (value) {
      url.searchParams.set(key, value);
    }
  }
  const search = url.searchParams.toString();
  return search ? `${url.pathname}?${search}` : url.pathname;
};

export const buildVehicleListingHref = (
  params: FindAllVehiclesParams,
): string => {
  const { pathname, search } = buildVehicleListingUrl(params);
  return search ? `${pathname}?${search}` : pathname;
};

/** @deprecated Usar buildVehicleListingHref; se mantiene temporalmente para imports legacy. */
export const buildClassicCatalogListingHref = (
  params: FindAllVehiclesParams,
): string => buildVehicleListingHref(params);

export const isPathBackedDtoKey = (key: keyof FindAllVehiclesParams): boolean =>
  PATH_DTO_KEYS.has(key) && !QUERY_ONLY_KEYS.has(key);
