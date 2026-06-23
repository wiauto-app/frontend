import z from "zod";

import { VEHICLE_TRANSMISSION_TYPE_VALUES } from "@/components/vehicles/constants/vehicle-enums.constants";

export const tasacionSchema = z.object({
  catalog_make_id: z.coerce
    .number({ error: "Selecciona una marca." })
    .int()
    .positive(),
  catalog_model_id: z.coerce
    .number({ error: "Selecciona un modelo." })
    .int()
    .positive(),
  catalog_body_type_id: z.coerce
    .number({ error: "Selecciona una carrocería." })
    .int()
    .positive(),
  catalog_fuel_type_id: z.coerce
    .number({ error: "Selecciona un tipo de combustible." })
    .int()
    .positive(),
  catalog_year_id: z.coerce
    .number({ error: "Selecciona un año." })
    .int()
    .positive(),
  version_id: z.coerce
    .number({ error: "Selecciona una versión." })
    .int()
    .positive(),
  transmission_type: z.enum(VEHICLE_TRANSMISSION_TYPE_VALUES, {
    error: "Selecciona un tipo de transmisión.",
  }),
  mileage: z.coerce
    .number({ error: "Ingresa el kilometraje del vehículo." })
    .min(0, { error: "El kilometraje no puede ser negativo." }),
  postal_code: z
    .string()
    .min(4, { error: "El código postal debe tener al menos 4 caracteres." })
    .max(10, { error: "El código postal no puede superar 10 caracteres." }),
});

export type TasacionFormValues = z.infer<typeof tasacionSchema>;
export type TasacionPayload = TasacionFormValues;

export const createTasacionDefaultValues = (): TasacionFormValues => ({
  catalog_make_id: 0,
  catalog_model_id: 0,
  catalog_body_type_id: 0,
  catalog_fuel_type_id: 0,
  catalog_year_id: 0,
  version_id: 0,
  transmission_type: "manual",
  mileage: 0,
  postal_code: "",
});

export const buildTasacionPayload = (values: TasacionFormValues): TasacionPayload => ({
  ...values,
});
