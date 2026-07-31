import { z } from "zod";

import { PLAN_LEAD_CARS_QUANTITY_VALUES } from "@/app/(public)/planes/constants/cars-quantity.constants";
import { phoneSchema } from "@/validations/phoneSchema";

export const planesLeadSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().email("Introduce un correo válido"),
  phone: phoneSchema,
  cars_quantity: z.enum(PLAN_LEAD_CARS_QUANTITY_VALUES, {
    message: "Selecciona la cantidad de vehículos",
  }),
  message: z.string().optional(),
});

export type PlanesLeadFormValues = z.infer<typeof planesLeadSchema>;
