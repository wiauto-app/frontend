import type { AuthProvider } from "./account.interface";

export interface User {
  id: string;
  email: string;
  providers: AuthProvider[];
  has_password: boolean;
  last_sign_in: Date;
  is_email_verified: boolean;
  two_factor_enabled: boolean;
  two_factor_secret: string | null;
  two_factor_backup_codes: string[] | null;
  created_at: string;
  name?: string;
  last_name?: string;
  avatar_url?: string;
  image_url?: string;
  phone_code?: string;
  phone?: string;
  dni?: string;
  role_id?: string;
}
