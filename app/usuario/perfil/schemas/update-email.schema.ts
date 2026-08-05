import { z } from "zod";

export const updateEmailSchema = z.object({
  email: z.email({ error: "Introduce un correo electrónico válido." }),
});

export type UpdateEmailFormValues = z.infer<typeof updateEmailSchema>;
