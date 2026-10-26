import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";

import { buildFilterSegments } from "./build-filter-segments";

/** @deprecated Usar buildFilterSegments. */
export const buildPathSegments = (
  params: FindAllVehiclesParams,
): string[] => buildFilterSegments(params);
