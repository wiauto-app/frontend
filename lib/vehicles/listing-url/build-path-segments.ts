import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";

import {
  COMMUNITY_PATH_PREFIX,
  MAX_PATH_SEGMENTS,
  MUNICIPALITY_PATH_PREFIX,
  PROVINCE_PATH_PREFIX,
} from "./constants";
import { resolveCatalogForPath } from "./catalog-path-resolution";

export const buildPathSegments = (
  params: Pick<
    FindAllVehiclesParams,
    | "makes_slugs"
    | "models_slugs"
    | "comunities_slugs"
    | "provinces_slugs"
    | "municipalities_slugs"
  >,
): string[] => {
  const in_path = resolveCatalogForPath(params);
  const segments: string[] = [];

  if (in_path.makes_slugs?.[0]) {
    segments.push(in_path.makes_slugs[0]);
  }
  if (in_path.models_slugs?.[0]) {
    segments.push(in_path.models_slugs[0]);
  }
  if (in_path.comunities_slugs?.[0]) {
    segments.push(`${COMMUNITY_PATH_PREFIX}${in_path.comunities_slugs[0]}`);
  }
  if (in_path.provinces_slugs?.[0]) {
    segments.push(`${PROVINCE_PATH_PREFIX}${in_path.provinces_slugs[0]}`);
  }
  if (in_path.municipalities_slugs?.[0]) {
    segments.push(`${MUNICIPALITY_PATH_PREFIX}${in_path.municipalities_slugs[0]}`);
  }

  return segments.slice(0, MAX_PATH_SEGMENTS);
};
