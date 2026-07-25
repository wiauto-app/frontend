import type { FindAllVehiclesParams } from "./vehicle.interface";

export interface AlertFilters extends Record<string, unknown> {
  source_vehicle_id?: string;
}

export interface Alert {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  profile_id: string | null;
  email: string;
  phone: string;
  phone_code: string;
  filters: AlertFilters;
  last_sent_at: string | null;
  is_active: boolean;
  notify_new_listings: boolean;
  notify_price_drops: boolean;
  notify_sold_removed: boolean;
  notify_featured: boolean;
  notify_recently_updated: boolean;
  last_viewed_at: string | null;
  new_matches_count: number;
}

export interface CreateAlertFromVehiclePayload {
  name?: string;
  phone?: string;
  phone_code?: string;
  email?: string;
}

export type CreateAlertFilterFields = Pick<
  FindAllVehiclesParams,
  | "type_slug"
  | "makes_slugs"
  | "models_slugs"
  | "since_price"
  | "until_price"
  | "price_offer"
  | "service_slugs"
  | "provinces_slugs"
  | "comunities_slugs"
  | "municipalities_slugs"
  | "lat"
  | "lng"
  | "radius"
  | "publisher_types"
  | "is_seller_featured"
  | "warranty_slugs"
  | "since_year"
  | "until_year"
  | "since_mileage"
  | "until_mileage"
  | "transmission_types"
  | "fuel_type_slugs"
  | "traction_slugs"
  | "power_since"
  | "power_until"
  | "displacement_since"
  | "displacement_until"
  | "dgt_label_ids"
  | "autonomy_since"
  | "battery_capacity_since"
  | "battery_capacity_until"
  | "time_to_charge"
  | "features_slugs"
  | "color_slugs"
  | "cuota_slugs"
>;

export interface CreateAlertPayload extends CreateAlertFilterFields {
  name?: string;
  email: string;
  phone: string;
  phone_code: string;
}

export type UpdateAlertPayload = Partial<{
  name: string;
  filters: AlertFilters;
  is_active: boolean;
  notify_new_listings: boolean;
  notify_price_drops: boolean;
  notify_sold_removed: boolean;
  notify_featured: boolean;
  notify_recently_updated: boolean;
}>;
