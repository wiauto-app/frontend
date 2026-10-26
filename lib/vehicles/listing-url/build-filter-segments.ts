import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";

import {
  LISTING_PATH_FILTERS,
  mapFilterValueToSlug,
  type PathFilterDefinition,
} from "./path-filters.registry";
import { buildRangeSuffix } from "./parse-range-suffix";
import { joinCommaSlugs } from "./split-comma-slugs";

const readNumber = (
  params: FindAllVehiclesParams,
  key: keyof FindAllVehiclesParams,
): number | undefined => {
  const value = params[key];
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
};

const buildMultiSegment = (
  definition: PathFilterDefinition,
  values: string[],
): string | undefined => {
  const slugs = values
    .map((value) => mapFilterValueToSlug(definition, value))
    .sort((a, b) => a.localeCompare(b));
  const joined = joinCommaSlugs(slugs);
  if (!joined) {
    return undefined;
  }
  return `${definition.prefix}${joined}`;
};

export const buildFilterSegments = (
  params: FindAllVehiclesParams,
): string[] => {
  const segments: string[] = [];

  for (const definition of LISTING_PATH_FILTERS) {
    if (definition.when && !definition.when(params)) {
      continue;
    }

    if (definition.kind === "flag" && definition.dtoKey) {
      const flag_value = params[definition.dtoKey];
      if (flag_value === true) {
        segments.push(definition.prefix);
      }
      continue;
    }

    if (definition.kind === "single" && definition.dtoKey) {
      const raw = params[definition.dtoKey];
      if (typeof raw !== "string" || !raw.trim()) {
        continue;
      }
      segments.push(
        `${definition.prefix}${mapFilterValueToSlug(definition, raw)}`,
      );
      continue;
    }

    if (definition.kind === "multi" && definition.dtoKey) {
      const raw = params[definition.dtoKey];
      const values = Array.isArray(raw) ? raw.map(String) : [];
      const segment = buildMultiSegment(definition, values);
      if (segment) {
        segments.push(segment);
      }
      continue;
    }

    if (definition.kind === "range" && definition.rangeKeys) {
      const since = readNumber(params, definition.rangeKeys.since);
      const until = readNumber(params, definition.rangeKeys.until);
      const suffix = buildRangeSuffix(since, until);
      if (suffix) {
        segments.push(`${definition.prefix}${suffix}`);
      }
      continue;
    }

    if (definition.kind === "number" && definition.dtoKey) {
      const value = readNumber(params, definition.dtoKey);
      if (value !== undefined) {
        segments.push(`${definition.prefix}${value}`);
      }
    }
  }

  return segments;
};
