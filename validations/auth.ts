
import z from "zod";



export const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type LoginDto = z.infer<typeof LoginSchema>;

//registerSchema

export const RegisterSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  last_name: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;




export interface AuthResponseDto {
  type: string;
  token: string;
  token_type: string;
  expires_at: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_sign_in: string;
  };
}


export interface GoogleLoginDto {
  id_token: string;
}

export interface Validate2faDto {
  code: string;
}


export interface ValidateBackupCodeDto {
  email: string;
  code: string;
}

