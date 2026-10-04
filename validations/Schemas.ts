import { z } from "zod/v4";

import type {
  StrapiAuthCambiarContrasena,
  StrapiAuthLogin,
  StrapiAuthOlvideContrasena,
  StrapiAuthRegistro,
} from "@/interfaces/strapi-components.interface";
import { createPhoneSchema } from "@/validations/phoneSchema";

const EMAIL_INVALIDO = "Email inválido";
const CONTRASENA_MINIMO = "La contraseña debe tener al menos 6 caracteres";

/** Los mensajes salen de los `formulario.campo` de la pantalla; si faltan, se usan los de siempre. */
export const createLoginSchema = (
  content?: Pick<StrapiAuthLogin, "email" | "contrasena"> | null,
) =>
  z.object({
    email: z.email(content?.email?.mensaje_invalido || EMAIL_INVALIDO),
    password: z
      .string()
      .min(6, content?.contrasena?.mensaje_invalido || CONTRASENA_MINIMO),
  });

export const LoginSchema = createLoginSchema();

export type LoginDto = z.infer<typeof LoginSchema>;


export const createRegisterSchema = (
  content?: Pick<
    StrapiAuthRegistro,
    "email" | "contrasena" | "nombre" | "apellidos" | "telefono"
  > | null,
) =>
  z.object({
    email: z.email(content?.email?.mensaje_invalido || EMAIL_INVALIDO),
    password: z
      .string()
      .min(6, content?.contrasena?.mensaje_invalido || CONTRASENA_MINIMO),
    name: z
      .string()
      .min(
        2,
        content?.nombre?.mensaje_invalido ||
          "El nombre debe tener al menos 2 caracteres",
      ),
    last_name: z
      .string()
      .min(
        2,
        content?.apellidos?.mensaje_invalido ||
          "El apellido debe tener al menos 2 caracteres",
      ),
    phone: createPhoneSchema(content?.telefono),
  });

export const RegisterSchema = createRegisterSchema();

export type RegisterFormValues = z.infer<typeof RegisterSchema>;

/** Payload aplanado para POST /auth/register */
export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  last_name: string;
  phone_code: string;
  phone: string;
}


export const createForgotPasswordSchema = (
  content?: Pick<StrapiAuthOlvideContrasena, "email"> | null,
) =>
  z.object({
    email: z.email(content?.email?.mensaje_invalido || EMAIL_INVALIDO),
  });

export const ForgotPasswordSchema = createForgotPasswordSchema();

export type ForgotPasswordDto = z.infer<typeof ForgotPasswordSchema>;

export const ChangePasswordSchema = z.object({
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  token: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>;

//only password and token
export const createResetPasswordSchema = (
  content?: Pick<StrapiAuthCambiarContrasena, "contrasena"> | null,
) =>
  z.object({
    password: z
      .string()
      .min(6, content?.contrasena?.mensaje_invalido || CONTRASENA_MINIMO),
    token: z.string(),
  });

export const ResetPasswordSchema = createResetPasswordSchema();

export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>;


export const UpdateProfileSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  last_name: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;

