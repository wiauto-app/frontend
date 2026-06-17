import type { AlertFilters } from "@/interfaces/alert.interface";
import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";
import { buildVehicleListingHref } from "@/lib/vehicles/listing-url/build-listing-url";

export const alertFiltersToVehicleParams = (
  filters: AlertFilters,
): FindAllVehiclesParams => {
  const { source_vehicle_id: _sourceVehicleId, ...vehicleFilters } = filters;
  return vehicleFilters as FindAllVehiclesParams;
};

export const buildSavedSearchEditHref = (filters: AlertFilters): string =>
  buildVehicleListingHref(alertFiltersToVehicleParams(filters));
