import { z } from "zod/v4";
import { CONDITION_VEHICLE, PUBLISHER_TYPE, TRANSMISSION_TYPE } from "@/interfaces/vehicle.interface";

export const CreateVehicleSchema = z.object({
  vehicle_type_id: z.uuid("ID de tipo de vehículo inválido"),
  price: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  mileage: z.number().min(0, "El kilometraje debe ser mayor o igual a 0"),
  lat: z.number("Latitud inválida"),
  lng: z.number("Longitud inválida"),
  condition: z.enum([CONDITION_VEHICLE.NEW, CONDITION_VEHICLE.USED], {
    message: "Condición inválida",
  }),
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  version_id: z.number("ID de versión inválido"),
  phone_code: z.string().min(1, "Código de teléfono requerido"),
  phone: z.string().min(1, "Teléfono requerido"),
  email: z.email("Email inválido"),
  publisher_type: z.enum([PUBLISHER_TYPE.PROFESSIONAL, PUBLISHER_TYPE.PARTICULAR], {
    message: "Tipo de publicador inválido",
  }),
  transmission_type: z.enum([TRANSMISSION_TYPE.MANUAL, TRANSMISSION_TYPE.AUTOMATIC]).optional(),
  traction_id: z.uuid("ID de tracción inválido"),
  power: z.number().min(0, "La potencia debe ser mayor o igual a 0"),
  displacement: z.number().min(0).optional(),
  autonomy: z.number().min(0).optional(),
  battery_capacity: z.number().min(0).optional(),
  time_to_charge: z.number().min(0).optional(),
  license_plate: z.string().min(5).optional(),
  features_ids: z.array(z.uuid()).optional(),
  services_ids: z.array(z.uuid()).optional(),
  color_id: z.uuid().nullable().optional(),
  dgt_label_id: z.uuid().nullable().optional(),
  warranty_type_id: z.uuid().nullable().optional(),
  cuota_id: z.uuid().nullable().optional(),
});

export type CreateVehicleFormDto = z.infer<typeof CreateVehicleSchema>;

export const UpdateVehicleSchema = CreateVehicleSchema.partial().extend({
  id: z.uuid("ID de vehículo inválido"),
});

export type UpdateVehicleFormDto = z.infer<typeof UpdateVehicleSchema>;

export const FindAllVehiclesSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  type_slug: z.string().optional(),
  make_slug: z.string().optional(),
  model_slug: z.string().optional(),
  since_price: z.coerce.number().min(0).optional(),
  until_price: z.coerce.number().min(0).optional(),
  price_offer: z.coerce.boolean().optional(),
  provinces_slugs: z.array(z.string()).optional(),
  comunities_slugs: z.array(z.string()).optional(),
  municipalities_slugs: z.array(z.string()).optional(),
  service_slugs: z.array(z.string()).optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  radius: z.coerce.number().int().positive().optional(),
  publisher_types: z.array(z.enum([PUBLISHER_TYPE.PROFESSIONAL, PUBLISHER_TYPE.PARTICULAR])).optional(),
  is_seller_featured: z.coerce.boolean().optional(),
  warranty_slugs: z.array(z.string()).optional(),
  since_year: z.coerce.number().int().positive().optional(),
  until_year: z.coerce.number().int().positive().optional(),
  since_mileage: z.coerce.number().int().positive().optional(),
  until_mileage: z.coerce.number().int().positive().optional(),
  transmission_types: z.array(z.enum([TRANSMISSION_TYPE.MANUAL, TRANSMISSION_TYPE.AUTOMATIC])).optional(),
  fuel_type_slugs: z.array(z.string()).optional(),
  traction_slugs: z.array(z.string()).optional(),
  power_since: z.coerce.number().int().positive().optional(),
  power_until: z.coerce.number().int().positive().optional(),
  displacement_since: z.coerce.number().int().positive().optional(),
  displacement_until: z.coerce.number().int().positive().optional(),
  dgt_label_ids: z.array(z.uuid()).optional(),
  autonomy_since: z.coerce.number().int().positive().optional(),
  battery_capacity_since: z.coerce.number().int().positive().optional(),
  battery_capacity_until: z.coerce.number().int().positive().optional(),
  time_to_charge: z.coerce.number().int().positive().optional(),
  features_slugs: z.array(z.string()).optional(),
  color_slugs: z.array(z.string()).optional(),
  cuota_slugs: z.array(z.string()).optional(),
});

export type FindAllVehiclesFormDto = z.infer<typeof FindAllVehiclesSchema>;

export const MakeSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  logo_url: z.url().nullable().optional(),
});

export type CreateMakeFormDto = z.infer<typeof MakeSchema>;

export const ModelSchema = z.object({
  make_id: z.uuid("ID de marca inválido"),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
});

export type CreateModelFormDto = z.infer<typeof ModelSchema>;

export const VersionSchema = z.object({
  model_id: z.number("ID de modelo inválido"),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  year: z.number().int().positive("Año inválido"),
  fuel_type_id: z.number("ID de tipo de combustible inválido"),
  body_type_id: z.number("ID de tipo de carrocería inválido"),
  doors: z.number().int().positive("Número de puertas inválido"),
  seats: z.number().int().positive("Número de asientos inválido"),
  power: z.number().min(0, "Potencia inválida"),
  displacement: z.number().min(0, "Cilindrada inválida"),
});

export type CreateVersionFormDto = z.infer<typeof VersionSchema>;

export const FuelTypeSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
});

export type CreateFuelTypeFormDto = z.infer<typeof FuelTypeSchema>;

export const BodyTypeSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
});

export type CreateBodyTypeFormDto = z.infer<typeof BodyTypeSchema>;

export const VehicleTypeSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
});

export type CreateVehicleTypeFormDto = z.infer<typeof VehicleTypeSchema>;

export const TractionSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
});

export type CreateTractionFormDto = z.infer<typeof TractionSchema>;

export const ServiceSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
});

export type CreateServiceFormDto = z.infer<typeof ServiceSchema>;

export const WarrantyTypeSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
});

export type CreateWarrantyTypeFormDto = z.infer<typeof WarrantyTypeSchema>;

export const DgtLabelSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  code: z.string().min(1, "Código requerido"),
});

export type CreateDgtLabelFormDto = z.infer<typeof DgtLabelSchema>;

export const CuotaSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  value: z.number().min(0, "El valor debe ser mayor o igual a 0"),
});

export type CreateCuotaFormDto = z.infer<typeof CuotaSchema>;

export const FeatureSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
});

export type CreateFeatureFormDto = z.infer<typeof FeatureSchema>;

export const ColorSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  hex_code: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Código hex inválido"),
});

export type CreateColorFormDto = z.infer<typeof ColorSchema>;
