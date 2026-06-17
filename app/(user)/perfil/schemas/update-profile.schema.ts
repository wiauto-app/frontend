import { z } from "zod";

export const updateProfileFormSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
  last_name: z
    .string()
    .trim()
    .refine(
      (value) => value.length === 0 || value.length >= 2,
      "El apellido debe tener al menos 2 caracteres",
    ),
  phone: z.object({
    phone_code: z.string().min(1, "El prefijo telefónico es obligatorio"),
    phone: z.string().min(6, "El teléfono debe tener al menos 6 dígitos"),
  }),
  dni: z
    .string()
    .trim()
    .refine(
      (value) => value.length === 0 || /^[0-9]{8}[A-Za-z]?$/.test(value),
      "El DNI debe tener 8 dígitos y, opcionalmente, una letra",
    ),
  avatar_url: z.string().nullable().optional(),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileFormSchema>;

export type UpdateProfilePayload = {
  name: string;
  last_name?: string;
  phone_code?: string;
  phone?: string;
  dni?: string;
  avatar_url?: string;
};

export const mapProfileFormToPayload = (
  values: UpdateProfileFormValues,
): UpdateProfilePayload => ({
  name: values.name,
  last_name: values.last_name?.trim() || undefined,
  phone_code: values.phone.phone_code,
  phone: values.phone.phone,
  dni: values.dni?.trim() || undefined,
  avatar_url: values.avatar_url ?? undefined,
});
