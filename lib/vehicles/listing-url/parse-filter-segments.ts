import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";

import {
  findPathFilterDefinition,
  mapSlugToFilterValue,
} from "./path-filters.registry";
import { parseRangeSuffix } from "./parse-range-suffix";
import { splitCommaSlugs } from "./split-comma-slugs";

const setParam = (
  target: Partial<FindAllVehiclesParams>,
  key: keyof FindAllVehiclesParams,
  value: unknown,
) => {
  (target as Record<string, unknown>)[key] = value;
};

const mergeRange = (
  target: Partial<FindAllVehiclesParams>,
  sinceKey: keyof FindAllVehiclesParams,
  untilKey: keyof FindAllVehiclesParams,
  parsed: { since?: number; until?: number },
) => {
  if (parsed.since !== undefined) {
    setParam(target, sinceKey, parsed.since);
  }
  if (parsed.until !== undefined) {
    setParam(target, untilKey, parsed.until);
  }
};

export const parseFilterSegments = (
  segments: string[] | undefined,
): Partial<FindAllVehiclesParams> => {
  const result: Partial<FindAllVehiclesParams> = {};

  for (const raw_segment of segments ?? []) {
    const segment = decodeURIComponent(raw_segment);
    const definition = findPathFilterDefinition(segment);
    if (!definition) {
      continue;
    }

    if (definition.kind === "flag") {
      if (definition.dtoKey === "price_offer") {
        result.price_offer = true;
      }
      if (definition.dtoKey === "is_seller_featured") {
        result.is_seller_featured = true;
      }
      continue;
    }

    const suffix = segment.slice(definition.prefix.length);

    if (definition.kind === "single") {
      if (!definition.dtoKey || !suffix) {
        continue;
      }
      setParam(
        result,
        definition.dtoKey,
        mapSlugToFilterValue(definition, suffix),
      );
      continue;
    }

    if (definition.kind === "multi") {
      if (!definition.dtoKey || !suffix) {
        continue;
      }
      const values = splitCommaSlugs(suffix).map((slug) =>
        mapSlugToFilterValue(definition, slug),
      );
      if (values.length > 0) {
        setParam(result, definition.dtoKey, values);
      }
      continue;
    }

    if (definition.kind === "range" && definition.rangeKeys) {
      const parsed = parseRangeSuffix(suffix);
      mergeRange(
        result,
        definition.rangeKeys.since,
        definition.rangeKeys.until,
        parsed,
      );
      continue;
    }

    if (definition.kind === "number" && definition.dtoKey) {
      const parsed = Number(suffix);
      if (Number.isFinite(parsed)) {
        setParam(result, definition.dtoKey, parsed);
      }
    }
  }

  return result;
};
