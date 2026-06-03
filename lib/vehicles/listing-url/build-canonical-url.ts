import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";

import { buildVehicleListingUrl } from "./build-listing-url";
import { DEFAULT_LISTING_PARAMS } from "./constants";

const toSingleSlugList = (
  slugs: string[] | undefined,
): string[] | undefined => {
  if (!slugs?.length) {
    return undefined;
  }
  return slugs.length === 1 ? slugs : undefined;
};

/** Params con solo dimensiones de catálogo únicas (para path canónico). */
export const toCanonicalCatalogParams = (
  params: FindAllVehiclesParams,
): Pick<
  FindAllVehiclesParams,
  | "comunities_slugs"
  | "provinces_slugs"
  | "municipalities_slugs"
> => ({
  comunities_slugs: toSingleSlugList(params.comunities_slugs),
  provinces_slugs: toSingleSlugList(params.provinces_slugs),
  municipalities_slugs: toSingleSlugList(params.municipalities_slugs),
});

export const buildCanonicalListingPath = (
  params: FindAllVehiclesParams,
): string => {
  const { pathname } = buildVehicleListingUrl({
    ...DEFAULT_LISTING_PARAMS,
    ...toCanonicalCatalogParams(params),
  });
  return pathname;
};

export const buildCanonicalListingHref = (
  params: FindAllVehiclesParams,
): string => buildCanonicalListingPath(params);
