import type { PublisherType, TransmissionType } from "./vehicle.interface";

export interface SearchVehiclesInput {
  type_slug?: string;
  makes_slugs?: string[];
  models_slugs?: string[];
  since_price?: number;
  until_price?: number;
  price_offer?: boolean;
  service_slugs?: string[];
  provinces_slugs?: string[];
  comunities_slugs?: string[];
  municipalities_slugs?: string[];
  lat?: number;
  lng?: number;
  radius?: number;
  publisher_types?: PublisherType[];
  is_seller_featured?: boolean;
  warranty_slugs?: string[];
  since_year?: number;
  until_year?: number;
  since_mileage?: number;
  until_mileage?: number;
  transmission_types?: TransmissionType[];
  fuel_type_slugs?: string[];
  traction_slugs?: string[];
  power_since?: number;
  power_until?: number;
  displacement_since?: number;
  displacement_until?: number;
  dgt_label_ids?: string[];
  autonomy_since?: number;
  battery_capacity_since?: number;
  battery_capacity_until?: number;
  time_to_charge?: number;
  features_slugs?: string[];
  color_slugs?: string[];
  cuota_slugs?: string[];
  exclude_vehicle_ids?: string[];
  dealership_ids?: string[];
}

export interface AiSearchFiltersResponse {
  filters: SearchVehiclesInput;
}
