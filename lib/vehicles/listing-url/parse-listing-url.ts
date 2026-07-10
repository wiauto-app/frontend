import type { FindAllVehiclesParams, PublisherType, TransmissionType } from "@/interfaces/vehicle.interface";

import { normalizeFilterQueryValue, parseFiltersQueryString } from "./filters-query";
import { mergeCatalogSlugLists } from "./merge-catalog-slugs";
import { parsePathSegments } from "./parse-path-segments";
import {
  ARRAY_DTO_KEYS,
  BOOLEAN_DTO_KEYS,
  DEFAULT_LISTING_PARAMS,
  FRIENDLY_QUERY_TO_DTO,
  LEGACY_API_QUERY_KEYS,
  NUMERIC_DTO_KEYS,
} from "./constants";
import {
  normalizeOrderDirection,
  orderDirectionFromUrlSegment,
} from "./order-direction";

const splitCommaList = (value: string): string[] =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

const to_scalar_query_string = (value: unknown): string => {
  if (value === undefined || value === null) {
    return "";
  }
  if (Array.isArray(value)) {
    return value.map(String).join(",");
  }
  return String(value);
};

const parseOptionalNumber = (value: unknown): number | undefined => {
  const scalar = to_scalar_query_string(value).trim();
  if (scalar === "") {
    return undefined;
  }
  const parsed = Number(scalar);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const parseOptionalBoolean = (value: unknown): boolean | undefined => {
  const scalar = to_scalar_query_string(value).trim();
  if (scalar === "") {
    return undefined;
  }
  const normalized = scalar.toLowerCase();
  if (normalized === "true" || normalized === "1") {
    return true;
  }
  if (normalized === "false" || normalized === "0") {
    return false;
  }
  return undefined;
};

const applyOrdenQuery = (target: FindAllVehiclesParams, raw_value: string): void => {
  const match = raw_value.match(/^(.+)-(asc|desc)$/i);
  if (!match) return;

  const direction = orderDirectionFromUrlSegment(match[2]);
  if (!direction) return;

  target.order_by = match[1];
  target.order_direction = direction;
};

const applyQueryValue = (
  target: FindAllVehiclesParams,
  dto_key: keyof FindAllVehiclesParams,
  raw_value: unknown,
): void => {
  if (ARRAY_DTO_KEYS.has(dto_key)) {
    const normalized = normalizeFilterQueryValue(raw_value);
    const items = Array.isArray(normalized)
      ? normalized
      : normalized
        ? [normalized]
        : [];
    if (items.length > 0) {
      (target as Record<string, unknown>)[dto_key] = items;
    }
    return;
  }

  if (NUMERIC_DTO_KEYS.has(dto_key)) {
    const parsed = parseOptionalNumber(raw_value);
    if (parsed !== undefined) {
      (target as Record<string, unknown>)[dto_key] = parsed;
    }
    return;
  }

  if (BOOLEAN_DTO_KEYS.has(dto_key)) {
    const parsed = parseOptionalBoolean(raw_value);
    if (parsed !== undefined) {
      (target as Record<string, unknown>)[dto_key] = parsed;
    }
    return;
  }

  if (dto_key === "order_direction") {
    const normalized = normalizeOrderDirection(to_scalar_query_string(raw_value));
    if (normalized) {
      target.order_direction = normalized;
    }
    return;
  }

  if (dto_key === "transmission_types") {
    const normalized = normalizeFilterQueryValue(raw_value);
    const items = (
      Array.isArray(normalized) ? normalized : normalized ? [normalized] : []
    ) as TransmissionType[];
    if (items.length > 0) {
      target.transmission_types = items;
    }
    return;
  }

  if (dto_key === "publisher_types") {
    const normalized = normalizeFilterQueryValue(raw_value);
    const items = (
      Array.isArray(normalized) ? normalized : normalized ? [normalized] : []
    ) as PublisherType[];
    if (items.length > 0) {
      target.publisher_types = items;
    }
    return;
  }

  const scalar =
    typeof raw_value === "string"
      ? raw_value
      : Array.isArray(raw_value)
        ? raw_value.map(String).join(",")
        : String(raw_value ?? "");
  const trimmed = scalar.trim();
  if (trimmed.length > 0) {
    (target as Record<string, unknown>)[dto_key] = trimmed;
  }
};

const parseQueryParams = (
  search_params: URLSearchParams,
): Partial<FindAllVehiclesParams> => {
  const query_filters: Partial<FindAllVehiclesParams> = {};
  const parsed_query = parseFiltersQueryString(search_params.toString());

  Object.entries(parsed_query).forEach(([key, raw_value]) => {
    if (key === "orden") {
      applyOrdenQuery(query_filters, String(raw_value));
      return;
    }

    const friendly_dto =
      FRIENDLY_QUERY_TO_DTO[key as keyof typeof FRIENDLY_QUERY_TO_DTO];
    if (friendly_dto) {
      applyQueryValue(
        query_filters,
        friendly_dto as keyof FindAllVehiclesParams,
        raw_value,
      );
      return;
    }

    if (LEGACY_API_QUERY_KEYS.has(key)) {
      if (key === "make_slug") {
        applyQueryValue(query_filters, "makes_slugs", raw_value);
        return;
      }
      if (key === "model_slug") {
        applyQueryValue(query_filters, "models_slugs", raw_value);
        return;
      }
      if (key === "category_slug") {
        applyQueryValue(query_filters, "categories_slugs", raw_value);
        return;
      }
      applyQueryValue(
        query_filters,
        key as keyof FindAllVehiclesParams,
        raw_value,
      );
    }
  });

  return query_filters;
};

export const parseVehicleListingUrl = (
  slug: string[] | undefined,
  search_params: URLSearchParams,
): FindAllVehiclesParams => {
  const path_filters = parsePathSegments(slug);
  const query_filters = parseQueryParams(search_params);

  const makes_slugs = mergeCatalogSlugLists(
    path_filters.makes_slugs,
    query_filters.makes_slugs,
  );
  const models_slugs = mergeCatalogSlugLists(
    path_filters.models_slugs,
    query_filters.models_slugs,
  );
  const provinces_slugs = mergeCatalogSlugLists(
    path_filters.provinces_slugs,
    query_filters.provinces_slugs,
  );
  const comunities_slugs = mergeCatalogSlugLists(
    path_filters.comunities_slugs,
    query_filters.comunities_slugs,
  );
  const municipalities_slugs = mergeCatalogSlugLists(
    path_filters.municipalities_slugs,
    query_filters.municipalities_slugs,
  );

  return {
    ...DEFAULT_LISTING_PARAMS,
    ...path_filters,
    ...query_filters,
    makes_slugs,
    models_slugs,
    provinces_slugs,
    comunities_slugs,
    municipalities_slugs,
    page: query_filters.page ?? DEFAULT_LISTING_PARAMS.page,
    limit: query_filters.limit ?? DEFAULT_LISTING_PARAMS.limit,
    order_by: query_filters.order_by ?? DEFAULT_LISTING_PARAMS.order_by,
    order_direction:
      query_filters.order_direction ?? DEFAULT_LISTING_PARAMS.order_direction,
  };
};
