import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";

import { VEHICLES_LISTING_BASE_PATH } from "./constants";
import { hasGeoPrefix } from "./parse-path-segments";

const isLegacyDuplicateSlugPath = (segments: string[]): boolean => {
  if (segments.length === 2 && segments[0] === segments[1]) {
    return true;
  }

  if (
    segments.length === 4 &&
    segments[2] === segments[3] &&
    !segments.some(hasGeoPrefix)
  ) {
    return true;
  }

  return false;
};

export const isIndexableCatalogSlugPath = (segments: string[]): boolean => {
  if (segments.length !== 2 && segments.length !== 3) {
    return false;
  }

  if (segments.some(hasGeoPrefix)) {
    return false;
  }

  return !isLegacyDuplicateSlugPath(segments);
};

interface IndexableCatalogListingPathParams
  extends Pick<
    FindAllVehiclesParams,
    "makes_slugs" | "models_slugs" | "provinces_slugs"
  > {}

export const buildIndexableCatalogListingPath = (
  params: IndexableCatalogListingPathParams,
): string | null => {
  const make = params.makes_slugs?.length === 1 ? params.makes_slugs[0] : null;
  const model = params.models_slugs?.length === 1 ? params.models_slugs[0] : null;

  if (!make || !model) {
    return null;
  }

  const province =
    params.provinces_slugs?.length === 1 ? params.provinces_slugs[0] : null;

  if (province) {
    return `${VEHICLES_LISTING_BASE_PATH}/${make}/${model}/${province}`;
  }

  return `${VEHICLES_LISTING_BASE_PATH}/${make}/${model}`;
};
