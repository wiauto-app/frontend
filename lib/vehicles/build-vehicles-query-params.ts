import qs from "qs";

import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";

export const buildVehiclesQueryString = (
  params?: FindAllVehiclesParams,
): string => {
  if (!params) {
    return "";
  }

  const query = qs.stringify(params, {
    skipNulls: true,
    addQueryPrefix: true,
    arrayFormat: "repeat",
  });

  return query === "?" ? "" : query;
};
