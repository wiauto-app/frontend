import type { VehicleList } from "@/interfaces/vehicle-list.interface";

export interface VehicleListFavoriteMembership {
  vehicle_id: string;
  list_ids: string[];
}

export interface VehicleListFavoritesSnapshot {
  lists: VehicleList[];
  memberships: VehicleListFavoriteMembership[];
}
