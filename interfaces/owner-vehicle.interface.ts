import type { VehicleStatus } from "@/components/vehicles/constants/vehicle-status.constants";

export interface OwnerVehicleStatTrend {
  current: number;
  previous: number;
  change_percent: number | null;
}

export interface OwnerVehicleListItem {
  id: string;
  display_name: string;
  price: number;
  mileage: number;
  status: VehicleStatus;
  expires_at: string;
  is_expired: boolean;
  days_until_expiry: number;
  can_renew: boolean;
  can_schedule: boolean;
  scheduled_publish_at: string | null;
  renewed_at: string | null;
  image: { id: string; url: string } | null;
  stats: {
    views: OwnerVehicleStatTrend;
    leads: OwnerVehicleStatTrend;
    favorites: OwnerVehicleStatTrend;
    shares: OwnerVehicleStatTrend;
  };
  created_at: string;
  updated_at: string;
}
