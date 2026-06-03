import type {
  PublisherType,
  TransmissionType,
} from "./vehicle.interface";

export interface ActiveFilterItem {
  id: string | number;
  slug: string;
  name: string;
  make_id?: number;
  model_id?: number;
  hex_code?: string;
  value?: number;
  code?: string;
}

export interface ActiveFiltersApplied {
  since_price?: number;
  until_price?: number;
  price_offer?: boolean;
  lat?: number;
  lng?: number;
  radius?: number;
  publisher_types?: PublisherType[];
  is_seller_featured?: boolean;
  since_year?: number;
  until_year?: number;
  since_mileage?: number;
  until_mileage?: number;
  transmission_types?: TransmissionType[];
  power_since?: number;
  power_until?: number;
  displacement_since?: number;
  displacement_until?: number;
  autonomy_since?: number;
  battery_capacity_since?: number;
  battery_capacity_until?: number;
  time_to_charge?: number;
}

export interface ActiveFiltersResolved {
  vehicle_type: ActiveFilterItem | null;
  makes: ActiveFilterItem[];
  models: ActiveFilterItem[];
  provinces: ActiveFilterItem[];
  communities: ActiveFilterItem[];
  municipalities: ActiveFilterItem[];
  services: ActiveFilterItem[];
  warranties: ActiveFilterItem[];
  colors: ActiveFilterItem[];
  dgt_labels: ActiveFilterItem[];
  features: ActiveFilterItem[];
  fuels: ActiveFilterItem[];
  tractions: ActiveFilterItem[];
  cuotas: ActiveFilterItem[];
}

export interface ActiveFiltersResponse {
  resolved: ActiveFiltersResolved;
  applied: ActiveFiltersApplied;
}
