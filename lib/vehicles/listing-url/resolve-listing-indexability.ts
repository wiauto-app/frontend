import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";

import { buildFilterSegments } from "./build-filter-segments";
import { VEHICLES_LISTING_BASE_PATH } from "./constants";
import {
  LISTING_PATH_FILTERS,
  mapFilterValueToSlug,
  type PathFilterDefinition,
} from "./path-filters.registry";

const MAX_INDEXABLE_SEGMENTS = 3;

const hasGeoQuery = (params: FindAllVehiclesParams): boolean =>
  params.lat !== undefined ||
  params.lng !== undefined ||
  params.radius !== undefined;

const hasTextQuery = (params: FindAllVehiclesParams): boolean =>
  Boolean(params.query?.trim());

const readArrayParam = (
  params: FindAllVehiclesParams,
  key: keyof FindAllVehiclesParams,
): string[] => {
  const value = params[key];
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map(String).filter((item) => item.length > 0);
};

const readNumber = (
  params: FindAllVehiclesParams,
  key: keyof FindAllVehiclesParams,
): number | undefined => {
  const value = params[key];
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
};

const definitionHasActiveValue = (
  definition: PathFilterDefinition,
  params: FindAllVehiclesParams,
): boolean => {
  if (definition.when && !definition.when(params)) {
    return false;
  }

  if (definition.kind === "flag" && definition.dtoKey) {
    return params[definition.dtoKey] === true;
  }

  if (definition.kind === "single" && definition.dtoKey) {
    const raw = params[definition.dtoKey];
    return typeof raw === "string" && raw.trim().length > 0;
  }

  if (definition.kind === "multi" && definition.dtoKey) {
    return readArrayParam(params, definition.dtoKey).length > 0;
  }

  if (definition.kind === "range" && definition.rangeKeys) {
    return (
      readNumber(params, definition.rangeKeys.since) !== undefined ||
      readNumber(params, definition.rangeKeys.until) !== undefined
    );
  }

  if (definition.kind === "number" && definition.dtoKey) {
    return readNumber(params, definition.dtoKey) !== undefined;
  }

  return false;
};

const buildIndexableParams = (
  params: FindAllVehiclesParams,
): FindAllVehiclesParams => {
  const indexable: FindAllVehiclesParams = {};

  for (const definition of LISTING_PATH_FILTERS) {
    if (!definition.isIndexable) {
      continue;
    }
    if (!definitionHasActiveValue(definition, params)) {
      continue;
    }

    if (definition.kind === "single" && definition.dtoKey) {
      indexable[definition.dtoKey] = params[definition.dtoKey] as never;
      continue;
    }

    if (definition.kind === "multi" && definition.dtoKey) {
      const values = readArrayParam(params, definition.dtoKey);
      if (values.length === 1) {
        indexable[definition.dtoKey] = values as never;
      }
    }
  }

  return indexable;
};

const buildCanonicalSegments = (params: FindAllVehiclesParams): string[] => {
  const indexable_params = buildIndexableParams(params);
  const segments: string[] = [];

  for (const definition of LISTING_PATH_FILTERS) {
    if (!definition.isIndexable) {
      continue;
    }
    if (!definitionHasActiveValue(definition, indexable_params)) {
      continue;
    }

    if (definition.kind === "single" && definition.dtoKey) {
      const raw = indexable_params[definition.dtoKey];
      if (typeof raw === "string") {
        segments.push(
          `${definition.prefix}${mapFilterValueToSlug(definition, raw)}`,
        );
      }
    }

    if (definition.kind === "multi" && definition.dtoKey) {
      const values = readArrayParam(indexable_params, definition.dtoKey);
      if (values.length === 1) {
        segments.push(
          `${definition.prefix}${mapFilterValueToSlug(definition, values[0])}`,
        );
      }
    }

    if (segments.length >= MAX_INDEXABLE_SEGMENTS) {
      break;
    }
  }

  return segments;
};

export interface ListingIndexability {
  isIndexable: boolean;
  canonicalPath: string;
}

export const resolveListingIndexability = (
  params: FindAllVehiclesParams,
): ListingIndexability => {
  const all_segments = buildFilterSegments(params);
  const canonical_segments = buildCanonicalSegments(params);

  const canonicalPath =
    canonical_segments.length > 0
      ? `${VEHICLES_LISTING_BASE_PATH}/${canonical_segments.join("/")}`
      : VEHICLES_LISTING_BASE_PATH;

  const has_non_indexable_filter = LISTING_PATH_FILTERS.some(
    (definition) =>
      !definition.isIndexable && definitionHasActiveValue(definition, params),
  );

  const has_multi_indexable = LISTING_PATH_FILTERS.some((definition) => {
    if (!definition.isIndexable || definition.kind !== "multi" || !definition.dtoKey) {
      return false;
    }
    return readArrayParam(params, definition.dtoKey).length > 1;
  });

  const isIndexable =
    !hasGeoQuery(params) &&
    !hasTextQuery(params) &&
    !has_non_indexable_filter &&
    !has_multi_indexable &&
    all_segments.length <= MAX_INDEXABLE_SEGMENTS &&
    all_segments.every((segment) => {
      const definition = LISTING_PATH_FILTERS.find((item) => {
        if (item.kind === "flag") {
          return segment === item.prefix;
        }
        return segment.startsWith(item.prefix);
      });
      return definition?.isIndexable === true;
    });

  return { isIndexable, canonicalPath };
};
