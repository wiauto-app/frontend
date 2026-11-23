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
    phone_code: z.string().optional(),
    phone: z.string().optional(),
  }),

  avatar_url: z.string().nullable().optional(),
  province_id: z.number().optional(),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileFormSchema>;

export type UpdateProfilePayload = {
  name: string;
  last_name?: string;
  phone_code?: string;
  phone?: string;
  /** `null` elimina el avatar en el backend; `undefined` no lo toca. */
  avatar_url?: string | null;
  province_id?: number;
};

export const mapProfileFormToPayload = (
  values: UpdateProfileFormValues,
): UpdateProfilePayload => ({
  name: values.name,
  last_name: values.last_name?.trim() || undefined,
  phone_code: values.phone?.phone_code ?? undefined,
  phone: values.phone?.phone ?? undefined,
  // Se manda `null` explícito: con `undefined` el campo desaparece del JSON
  // y el backend no se entera de que se eliminó la foto.
  avatar_url: values.avatar_url || null,
  province_id: values.province_id ?? undefined,
});
