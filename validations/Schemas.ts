import z from "zod";


export const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type LoginDto = z.infer<typeof LoginSchema>;


export const RegisterSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  last_name: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;


export const ForgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

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
export const ResetPasswordSchema = z.object({
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  token: z.string(),
});

export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>;


export const ConfirmEmailVerificationSchema = z.object({
  token: z.string(),
});

export type ConfirmEmailVerificationDto = z.infer<typeof ConfirmEmailVerificationSchema>;