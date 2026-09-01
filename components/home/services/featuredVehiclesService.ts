import { findAllVehicles } from "@/app/(public)/vehiculos/[[...slug]]/services/findAllVehicles.server";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";

const FEATURED_VEHICLES_LIMIT = 4;

export const getFeaturedVehicles = async (): Promise<VehicleListItem[]> => {
  const listing = await findAllVehicles({
    is_seller_featured: true,
    page: 1,
    limit: FEATURED_VEHICLES_LIMIT,
  });

  return listing.data;
};
