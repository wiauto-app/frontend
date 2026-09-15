import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";
import { parseVehicleListingUrl } from "@/lib/vehicles/listing-url/parse-listing-url";

export const parseDealershipVehicleFilters = (
  search_params: URLSearchParams,
): FindAllVehiclesParams => parseVehicleListingUrl([], search_params);
