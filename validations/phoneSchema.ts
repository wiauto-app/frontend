import { z } from "zod";

export const phoneSchema = z.object({
  phone_code: z.string().min(1, "El código de teléfono es requerido"),
  phone: z.string().min(1, "El teléfono es requerido"),
});