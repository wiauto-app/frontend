import { z } from "zod";

import { phoneSchema } from "@/validations/phoneSchema";

export const planesLeadSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().email("Introduce un correo válido"),
  phone: phoneSchema,
  message: z.string().optional(),
});

export type PlanesLeadFormValues = z.infer<typeof planesLeadSchema>;
