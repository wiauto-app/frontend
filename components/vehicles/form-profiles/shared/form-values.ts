import type { VehicleFormImage, VehicleFormVideo } from "../../schemas/vehicle.schema";
import type {
  ConditionVehicle,
  PublisherType,
  TransmissionType,
} from "@/interfaces/vehicle.interface";

/** Campos específicos por tipo; se persisten en `type_attributes` jsonb. */
export interface VehicleTypeAttributes {
  subtype?: string;
  body_style?: string;
  year?: number;
  payload_kg?: number;
  gvw_kg?: number;
  seats?: number;
  power?: number;
  first_registration_date?: string;
  registration_date?: string;
}

/**
 * Valores del formulario unificado (quick + profesional) para todos los perfiles.
 * Cada perfil Zod exige un subconjunto distinto.
 */
export interface VehicleFormValues {
  vehicle_type_id: string;
  license_plate?: string;
  vin_code?: string;
  images: VehicleFormImage[];
  videos: VehicleFormVideo[];

  /** Catálogo (coche / furgoneta). */
  version_id?: number;
  catalog_make_id?: number;
  catalog_model_id?: number;
  catalog_year_id?: number;
  catalog_fuel_type_id?: number;
  catalog_fuel_can_charge?: boolean;

  /** No-catálogo / parcial. */
  title?: string;
  make_name?: string;
  model_name?: string;
  type_attributes?: VehicleTypeAttributes;

  condition: ConditionVehicle;
  mileage: number;
  price: number;
  color_id?: string | null;
  category_id?: string | null;
  dgt_label_id?: string | null;
  lat: number;
  lng: number;
  phone: { phone_code: string; phone: string };
  show_phone: boolean;
  has_whatsapp: boolean;
  email: string;
  description?: string;
  transmission_type?: TransmissionType;
  power?: number;
  displacement?: number;
  autonomy?: number;
  battery_capacity?: number;
  time_to_charge?: number;
  traction_id?: string;
  features_ids?: string[];
  services_ids?: string[];
  cuota_ids?: string[];
  warranty_type_id?: string | null;
  publisher_type: PublisherType;
}
