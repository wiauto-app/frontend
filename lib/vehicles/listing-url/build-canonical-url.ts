import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";

import { resolveListingIndexability } from "./resolve-listing-indexability";

export const buildCanonicalListingPath = (
  params: FindAllVehiclesParams,
): string => resolveListingIndexability(params).canonicalPath;

export const buildCanonicalListingHref = (
  params: FindAllVehiclesParams,
): string => buildCanonicalListingPath(params);
