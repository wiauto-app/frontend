import z from "zod";
import {
  commonVehicleFormFields,
  optionalNonNegativeNumber,
  optionalUuid,
} from "./common-schema";
import type { VehicleFormValues } from "./form-values";

const catalogBaseObject = z.object({
  ...commonVehicleFormFields,
  version_id: z.coerce
    .number({ error: "Selecciona una versión del catálogo." })
    .int()
    .positive({ error: "Selecciona una versión del catálogo." }),
  condition: commonVehicleFormFields.condition,
  mileage: z.coerce
    .number()
    .min(0, { error: "El kilometraje no puede ser negativo." }),
  transmission_type: z.enum(["manual", "automatic"], {
    error: "Selecciona un tipo de transmisión.",
  }),
  power: z.coerce
    .number()
    .min(1, { error: "Introduce la potencia del vehículo." }),
  displacement: z.coerce
    .number()
    .min(0, { error: "Introduce la cilindrada del vehículo." }),
  traction_id: z.uuid({ error: "Selecciona un tipo de tracción." }),
  autonomy: optionalNonNegativeNumber,
  battery_capacity: optionalNonNegativeNumber,
  time_to_charge: optionalNonNegativeNumber,
  color_id: optionalUuid,
});

const withElectricRefine = <T extends z.ZodType>(schema: T) =>
  schema.superRefine((data, ctx) => {
    const values = data as VehicleFormValues;
    if (!values.catalog_fuel_can_charge) {
      return;
    }

    const electricFields = [
      { key: "autonomy" as const, label: "autonomía" },
      { key: "battery_capacity" as const, label: "capacidad de la batería" },
      { key: "time_to_charge" as const, label: "tiempo de carga" },
    ];

    for (const field of electricFields) {
      const value = values[field.key];
      if (value == null || value <= 0) {
        ctx.addIssue({
          code: "custom",
          message: `Introduce la ${field.label} del vehículo eléctrico.`,
          path: [field.key],
        });
      }
    }
  });

export const catalogVehicleSchema = withElectricRefine(catalogBaseObject);

export const furgonetaVehicleSchema = withElectricRefine(
  catalogBaseObject.extend({
    type_attributes: z
      .object({
        body_style: z
          .string()
          .trim()
          .min(1, { error: "Selecciona o indica la carrocería." })
          .optional(),
        subtype: z.string().optional(),
        year: z.coerce.number().int().optional(),
        payload_kg: z.coerce.number().optional(),
        gvw_kg: z.coerce.number().optional(),
        seats: z.coerce.number().int().optional(),
        power: z.coerce.number().optional(),
        first_registration_date: z.string().optional(),
        registration_date: z.string().optional(),
      })
      .optional()
      .default({}),
  }),
);
