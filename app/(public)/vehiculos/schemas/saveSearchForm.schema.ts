import { z } from "zod";

import { phoneSchema } from "@/validations/phoneSchema";

export const saveSearchFormSchema = z.object({
  email: z.email("El correo electrónico no es válido"),
  phone: phoneSchema,
});

export type SaveSearchFormValues = z.infer<typeof saveSearchFormSchema>;
