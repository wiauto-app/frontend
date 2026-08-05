import type { VehicleListItemPreview } from "@/interfaces/vehicle-list.interface";

/** Suscripción a alerta de bajada de precio por vehículo. */
export interface VehiclePriceWatch {
  id: string;
  profile_id: string;
  vehicle_id: string;
  created_at: string;
}

/** Descarte de un vehículo por el usuario. */
export interface DismissedVehicle {
  id: string;
  profile_id: string;
  vehicle_id: string;
  created_at: string;
}

/** Estado de engagement del usuario sobre un vehículo. */
export interface VehicleEngagementStatus {
  isWatchingPrice: boolean;
  isDismissed: boolean;
}

/**
 * Ítem del listado profesional de descartados.
 * El backend puede embeber un resumen del vehículo (preferido).
 */
export interface DismissedVehicleItem {
  id: string;
  vehicle_id: string;
  created_at: string;
  vehicle?: VehicleListItemPreview | null;
}
