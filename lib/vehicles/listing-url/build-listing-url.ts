import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";

import { buildPathSegments } from "./build-path-segments";
import {
  resolveCatalogForPath,
  resolveCatalogForQuery,
} from "./catalog-path-resolution";
import {
  DEFAULT_LISTING_PARAMS,
  DTO_TO_FRIENDLY_QUERY,
  VEHICLES_LISTING_BASE_PATH,
} from "./constants";
import { orderDirectionToUrlSegment } from "./order-direction";

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

const CATALOG_DTO_KEYS = new Set<keyof FindAllVehiclesParams>([
  "makes_slugs",
  "models_slugs",
  "comunities_slugs",
  "provinces_slugs",
  "municipalities_slugs",
]);

const buildFriendlySearch = (params: FindAllVehiclesParams): string => {
  const search = new URLSearchParams();
  const catalog_in_path = resolveCatalogForPath(params);
  const catalog_query = resolveCatalogForQuery(params, catalog_in_path);

  Object.entries(catalog_query).forEach(([friendly_key, raw]) => {
    if (raw.length > 0) {
      search.set(friendly_key, raw);
    }
  });

  const setFriendly = (friendly_key: string, raw: string) => {
    if (raw.length > 0) {
      search.set(friendly_key, raw);
    }
  };

  (Object.entries(params) as [keyof FindAllVehiclesParams, unknown][]).forEach(
    ([key, value]) => {
      if (CATALOG_DTO_KEYS.has(key) || shouldOmitQueryValue(key, value)) {
        return;
      }

      if (key === "order_by" || key === "order_direction") {
        return;
      }

      let friendly_key = DTO_TO_FRIENDLY_QUERY[key];
      if (key === "since_price") {
        friendly_key = params.cuota_slugs?.length ? "cuota_desde" : "precio_desde";
      }
      if (key === "until_price") {
        friendly_key = params.cuota_slugs?.length ? "cuota_hasta" : "precio_hasta";
      }
      if (!friendly_key) {
        return;
      }

      if (Array.isArray(value)) {
        if (value.length > 0) {
          setFriendly(friendly_key, value.join(","));
        }
        return;
      }

      if (typeof value === "boolean") {
        setFriendly(friendly_key, value ? "true" : "false");
        return;
      }

      setFriendly(friendly_key, String(value));
    },
  );

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
  const segments = buildPathSegments(params);
  const pathname =
    segments.length > 0
      ? `${VEHICLES_LISTING_BASE_PATH}/${segments.join("/")}`
      : VEHICLES_LISTING_BASE_PATH;

  return {
    pathname,
    search: buildFriendlySearch(params),
  };
};

export const buildVehicleListingHref = (params: FindAllVehiclesParams): string => {
  const { pathname, search } = buildVehicleListingUrl(params);
  return search ? `${pathname}?${search}` : pathname;
};
