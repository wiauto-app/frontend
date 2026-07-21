import { VehiclePriceHistoryItem } from "./vehicle-price.interface";

export const PUBLISHER_TYPE = {
  PROFESSIONAL: "professional",
  PARTICULAR: "particular",
} as const;

export type PublisherType = (typeof PUBLISHER_TYPE)[keyof typeof PUBLISHER_TYPE];

export const TRANSMISSION_TYPE = {
  MANUAL: "manual",
  AUTOMATIC: "automatic",
} as const;

export type TransmissionType =
  (typeof TRANSMISSION_TYPE)[keyof typeof TRANSMISSION_TYPE];

export const STATUS_VEHICLE = {
  ACTIVE: "active",
  PENDING: "pending",
  INACTIVE: "inactive",
  SOLD: "sold",
  ARCHIVED: "archived",
} as const;

export type StatusVehicle = (typeof STATUS_VEHICLE)[keyof typeof STATUS_VEHICLE];

export const CONDITION_VEHICLE = {
  NEW: "new",
  USED: "used",
} as const;

export type ConditionVehicle =
  (typeof CONDITION_VEHICLE)[keyof typeof CONDITION_VEHICLE];

export interface VehicleImage {
  id: string;
  url: string;
}


export interface VehicleService {
  id: string;
  name: string;
  slug: string;
}

export interface VehicleTypeRef {
  id: string;
  name: string;
  slug: string;
}

export interface ColorRef {
  id: string;
  name: string;
  slug: string;
  hex_code: string;
}

export interface DgtLabelRef {
  id: string;
  name: string;
  code: string;
  slug: string;
}

export interface WarrantyTypeRef {
  id: string;
  name: string;
  slug: string;
}

export interface CuotaRef {
  id: string;
  name: string;
  slug: string;
  value: number;
}

export interface VehicleVersionSummary {
  make_name: string;
  model_name: string;
  version_name: string;
}

export interface VehicleAddressDetails {
  street?: string | null;
  route?: string | null;
  street_number?: string | null;
  neighborhood?: string | null;
  municipality?: string | null;
  province?: string | null;
  postal_code?: string | null;
  country?: string | null;
  formatted_lines: string[];
}

export interface VehicleListItem {
  id: string;
  price: number;
  mileage: number;
  lat: number;
  lng: number;
  address?: string | null;
  address_details?: VehicleAddressDetails | null;
  condition: string;
  version_summary: VehicleVersionSummary;
  created_at: string;
  images: VehicleImage[];
  features: Feature[];
  services: VehicleService[];
  vehicle_type: VehicleTypeRef | null;
  color: ColorRef | null;
  dgt_label: DgtLabelRef | null;
  warranty_type: WarrantyTypeRef | null;
  cuota: CuotaRef | null;
  transmission_type?: TransmissionType;
  publisher_type?: PublisherType;
  power?: number;
  is_featured?: boolean;
}

export interface Publisher {
  id: string;
  name: string;
  avatar_url: string | null;
}

export interface VehicleDetailDealership {
  id: string;
  name: string;
  slug: string;
  avatar_url?: string;
  banner_url?: string;
  description: string;
  website_url?: string;
  email: string;
  phone_code: string;
}

export interface Vehicle {
  id: string;
  price: number;
  prices?: VehiclePriceHistoryItem[];
  vehicle_prices?: VehiclePriceHistoryItem[];
  mileage: number;
  lat: number;
  lng: number;
  condition: ConditionVehicle;
  description: string;
  publisher_type: PublisherType;
  publisher: Publisher;
  dealership?: VehicleDetailDealership;
  version_id: number;
  status: StatusVehicle;
  is_featured: boolean;
  expires_at: string | null;
  views: number;
  transmission_type: TransmissionType;
  traction_id: string;
  power: number;
  displacement: number;
  autonomy: number;
  battery_capacity: number;
  time_to_charge: number;
  license_plate: string;
  vin_code?: string;
  phone_code: string;
  phone: string;
  has_whatsapp?: boolean;
  show_phone?: boolean;
  email: string;
  created_at: string;
  updated_at: string;
  features_ids: string[];
  services_ids: string[];
  vehicle_type_id: string | null;
  color_id: string | null;
  dgt_label_id: string | null;
  warranty_type_id: string | null;
  cuota_id: string | null;
  suggestions: string[];
  profile_id?: string;
  traction: Traction;
  vehicle_type: VehicleType;
  category: Category | null;
  color: Color | null;
  features: Feature[];
  cuotas: Cuota[];
  services: VehicleService[];
  images: VehicleImage[];
  version: Version;
  address?: string | null;
  address_details?: VehicleAddressDetails | null;
  dgt_label: DgtLabel | null;
  warranty_type: WarrantyType | null;
  cuota: Cuota | null;
}

export interface Version {
  id: number;
  make_id: number;
  model_id: number;
  body_type_id: number;
  fuel_type_id: number;
  year_id: number;
  name: string;
  slug: string;
  created_at: Date;
  make: Make;
  model: Model;
  body_type: BodyType;
  fuel_type: FuelType;
  year: Year;
}

export interface Year {
  id: number;
  year: number;
  slug: string;
  created_at: Date;
}



export interface CreateVehicleDto {
  price: number;
  mileage: number;
  lat: number;
  lng: number;
  condition: ConditionVehicle;
  description: string;
  version_id: number;
  publisher_type: PublisherType;
  transmission_type?: TransmissionType;
  traction_id: string;
  power: number;
  displacement?: number;
  autonomy?: number;
  battery_capacity?: number;
  time_to_charge?: number;
  license_plate?: string;
  phone_code: string;
  phone: string;
  email: string;
  vehicle_type_id: string;
  features_ids?: string[];
  services_ids?: string[];
  color_id?: string | null;
  dgt_label_id?: string | null;
  warranty_type_id?: string | null;
  cuota_id?: string | null;
}

export interface UpdateVehicleDto {
  id: string;
  price?: number;
  mileage?: number;
  lat?: number;
  lng?: number;
  condition?: ConditionVehicle;
  description?: string;
  version_id?: number;
  publisher_type?: PublisherType;
  transmission_type?: TransmissionType;
  traction_id?: string;
  power?: number;
  displacement?: number;
  autonomy?: number;
  battery_capacity?: number;
  time_to_charge?: number;
  license_plate?: string;
  phone_code?: string;
  phone?: string;
  email?: string;
  vehicle_type_id?: string;
  features_ids?: string[];
  services_ids?: string[];
  color_id?: string | null;
  dgt_label_id?: string | null;
  warranty_type_id?: string | null;
  cuota_id?: string | null;
}

export interface FindAllVehiclesParams {
  page?: number;
  limit?: number;
  query?: string;
  order_by?: string;
  order_direction?: "ASC" | "DESC";
  condition?: ConditionVehicle;
  type_slug?: string;
  makes_slugs?: string[];
  models_slugs?: string[];
  categories_slugs?: string[];
  since_price?: number;
  until_price?: number;
  price_offer?: boolean;
  provinces_slugs?: string[];
  comunities_slugs?: string[];
  municipalities_slugs?: string[];
  service_slugs?: string[];
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

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface Make {
  id: string;
  name: string;
  slug: string;
  image_url?: string | null;
  created_at: string;
}

export interface CreateMakeDto {
  name: string;
}

export interface UpdateMakeDto {
  name?: string;
}

export interface Model {
  id: number;
  make_id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface CreateModelDto {
  make_id: string;
  name: string;
}

export interface UpdateModelDto {
  make_id?: string;
  name?: string;
}

export interface CreateVersionDto {
  model_id: number;
  name: string;
  year: number;
  fuel_type_id: number;
  body_type_id: number;
  doors: number;
  seats: number;
  power: number;
  displacement: number;
}

export interface UpdateVersionDto {
  model_id?: number;
  name?: string;
  year?: number;
  fuel_type_id?: number;
  body_type_id?: number;
  doors?: number;
  seats?: number;
  power?: number;
  displacement?: number;
}

export interface FuelType {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface CatalogFuelType {
  id?: number;
  fuel_id: number;
  name: string;
  slug: string;
  can_charge: boolean;
  created_at?: string;
}

export interface CreateFuelTypeDto {
  name: string;
}

export interface UpdateFuelTypeDto {
  name?: string;
}

export interface BodyType {
  id: number;
  name: string;
  slug: string;
  doors: number;
  created_at: string;
}

export interface CreateBodyTypeDto {
  name: string;
}

export interface UpdateBodyTypeDto {
  name?: string;
}

export interface VehicleType {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateVehicleTypeDto {
  name: string;
}

export interface UpdateVehicleTypeDto {
  name?: string;
}

export interface Traction {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTractionDto {
  name: string;
}

export interface UpdateTractionDto {
  name?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export type Service = ServiceItem;

export interface CreateServiceDto {
  name: string;
}

export interface UpdateServiceDto {
  name?: string;
}

export interface WarrantyTypeItem {
  id: string;
  name: string;
  description: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export type WarrantyType = WarrantyTypeItem;

export interface CreateWarrantyTypeDto {
  name: string;
}

export interface UpdateWarrantyTypeDto {
  name?: string;
}

export interface DgtLabel {
  id: string;
  name: string;
  code: string;
  description: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDgtLabelDto {
  name: string;
  code: string;
}

export interface UpdateDgtLabelDto {
  name?: string;
  code?: string;
}

export interface Cuota {
  id: string;
  name: string;
  slug: string;
  value: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCuotaDto {
  name: string;
  value: number;
}

export interface UpdateCuotaDto {
  name?: string;
  value?: number;
}

export interface Feature {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface CreateFeatureDto {
  name: string;
}

export interface UpdateFeatureDto {
  name?: string;
}

export interface Color {
  id: string;
  name: string;
  slug: string;
  hex_code: string;
  created_at: string;
  updated_at: string;
}

export interface CreateColorDto {
  name: string;
  hex_code: string;
}

export interface UpdateColorDto {
  name?: string;
  hex_code?: string;
}


export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  created_at: Date;
  updated_at: Date;
}