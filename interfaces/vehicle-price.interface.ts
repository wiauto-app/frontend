export const VEHICLE_PRICE_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type VehiclePriceStatus =
  (typeof VEHICLE_PRICE_STATUS)[keyof typeof VEHICLE_PRICE_STATUS];

export interface VehiclePriceHistoryItem {
  id: string;
  price: number;
  status: VehiclePriceStatus;
  vehicle_id: string;
  created_at: string;
}

export interface VehiclePricesResponse {
  prices: VehiclePriceHistoryItem[];
}
