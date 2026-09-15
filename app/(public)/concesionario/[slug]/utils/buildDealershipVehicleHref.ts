import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";
import { buildVehiclesQueryString } from "@/lib/vehicles/build-vehicles-query-params";

export const buildDealershipVehicleHref = (
  slug: string,
  params: FindAllVehiclesParams,
): string => {
  const { dealership_ids: _dealership_ids, ...url_params } = params;
  const query = buildVehiclesQueryString(url_params);
  return `/concesionaria/${slug}${query}`;
};
