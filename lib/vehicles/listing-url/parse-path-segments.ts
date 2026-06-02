import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";

import {
  COMMUNITY_PATH_PREFIX,
  MAX_PATH_SEGMENTS,
  MUNICIPALITY_PATH_PREFIX,
  PROVINCE_PATH_PREFIX,
} from "./constants";
import { splitCommaSlugs } from "./split-comma-slugs";

const stripPrefix = (segment: string, prefix: string): string =>
  segment.slice(prefix.length);

const hasGeoPrefix = (segment: string): boolean =>
  segment.startsWith(COMMUNITY_PATH_PREFIX) ||
  segment.startsWith(PROVINCE_PATH_PREFIX) ||
  segment.startsWith(MUNICIPALITY_PATH_PREFIX);

/** URLs antiguas (sin prefijos geo) para normalización 308. */
const parseLegacyPathSegments = (
  segments: string[],
): Pick<
  FindAllVehiclesParams,
  | "makes_slugs"
  | "models_slugs"
  | "comunities_slugs"
  | "provinces_slugs"
  | "municipalities_slugs"
> | null => {
  if (segments.length === 2 && segments[0] === segments[1] && !hasGeoPrefix(segments[0])) {
    return { provinces_slugs: [segments[0]] };
  }

  if (
    segments.length === 4 &&
    segments[2] === segments[3] &&
    !hasGeoPrefix(segments[2])
  ) {
    return {
      makes_slugs: [segments[0]],
      models_slugs: [segments[1]],
      provinces_slugs: [segments[2]],
    };
  }

  if (
    segments.length === 3 &&
    !segments.some(hasGeoPrefix)
  ) {
    return {
      makes_slugs: [segments[0]],
      models_slugs: [segments[1]],
      comunities_slugs: [segments[2]],
    };
  }

  return null;
};

export const parsePathSegments = (
  slug: string[] | undefined,
): Pick<
  FindAllVehiclesParams,
  | "makes_slugs"
  | "models_slugs"
  | "comunities_slugs"
  | "provinces_slugs"
  | "municipalities_slugs"
> => {
  const segments = (slug ?? []).slice(0, MAX_PATH_SEGMENTS);
  const legacy = parseLegacyPathSegments(segments);
  if (legacy) {
    return legacy;
  }

  const result: Pick<
    FindAllVehiclesParams,
    | "makes_slugs"
    | "models_slugs"
    | "comunities_slugs"
    | "provinces_slugs"
    | "municipalities_slugs"
  > = {};

  let has_make = false;
  let has_model = false;

  for (const segment of segments) {
    if (segment.startsWith(COMMUNITY_PATH_PREFIX)) {
      result.comunities_slugs = [
        stripPrefix(segment, COMMUNITY_PATH_PREFIX),
      ];
      continue;
    }
    if (segment.startsWith(PROVINCE_PATH_PREFIX)) {
      result.provinces_slugs = [stripPrefix(segment, PROVINCE_PATH_PREFIX)];
      continue;
    }
    if (segment.startsWith(MUNICIPALITY_PATH_PREFIX)) {
      result.municipalities_slugs = [
        stripPrefix(segment, MUNICIPALITY_PATH_PREFIX),
      ];
      continue;
    }

    if (!has_make) {
      result.makes_slugs = splitCommaSlugs(segment);
      has_make = true;
      continue;
    }

    if (!has_model) {
      result.models_slugs = splitCommaSlugs(segment);
      has_model = true;
    }
  }

  return result;
};
