import { z } from "zod";
import { acceptedTermsSchema } from "@/validations/acceptedTermsSchema";
import { phoneSchema } from "@/validations/phoneSchema";

export const guestContactFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.email("El correo electrónico no es válido"),
  phone: phoneSchema,
  message: z.string().min(1, "El mensaje es requerido"),
  accepted_terms: acceptedTermsSchema,
});

export const authenticatedContactFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.email("El correo electrónico no es válido"),
  phone: z
    .object({
      phone_code: z.string(),
      phone: z.string(),
    })
    .optional(),
  message: z.string().min(1, "El mensaje es requerido"),
  accepted_terms: acceptedTermsSchema,
});

export type GuestContactFormValues = z.infer<typeof guestContactFormSchema>;
export type AuthenticatedContactFormValues = z.infer<
  typeof authenticatedContactFormSchema
>;
