import { z } from "zod";

export const reportFormSchema = z.object({
  category_id: z
    .string()
    .min(1, "Selecciona un motivo")
    .uuid("Selecciona un motivo válido"),
  title: z.string().min(1, "El título es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
});

export type ReportFormValues = z.infer<typeof reportFormSchema>;
