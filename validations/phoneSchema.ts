import { z } from "zod";

import { MAX_NATIONAL_PHONE_DIGITS } from "@/lib/phone-limits";

export const phoneSchema = z.object({
  phone_code: z.string().min(1, "El código de teléfono es requerido"),
  phone: z
    .string()
    .min(1, "El teléfono es requerido")
    .max(
      MAX_NATIONAL_PHONE_DIGITS,
      `El teléfono no puede tener más de ${MAX_NATIONAL_PHONE_DIGITS} dígitos`,
    )
    .regex(/^\d+$/, "El teléfono solo puede contener dígitos"),
});
