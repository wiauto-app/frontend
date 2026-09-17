import { z } from "zod";

export const contactLeadSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.email("Introduce un correo electrónico válido"),
  phone_code: z.string().trim().min(1, "Selecciona un prefijo"),
  phone: z
    .string()
    .trim()
    .min(6, "Introduce un teléfono válido"),
  province_id: z
    .number({ error: "Selecciona una provincia" })
    .int()
    .positive("Selecciona una provincia"),
  province_name: z.string().trim().min(1),
  message: z
    .string()
    .trim()
    .min(10, "Cuéntanos un poco más (mínimo 10 caracteres)"),
});

export type ContactLeadFormValues = z.infer<typeof contactLeadSchema>;

export const contactLeadDefaultValues: Partial<ContactLeadFormValues> = {
  name: "",
  email: "",
  phone_code: "+34",
  phone: "",
  province_name: "",
  message: "",
};
