export interface ProfileUser {
  id: string;
  email: string;
}

export interface Profile {
  id: string;
  user: ProfileUser;
  name?: string;
  last_name?: string;
  avatar_url?: string;
}

/** Respuesta de GET/PATCH /auth/me/profile (sin caché Redis). */
export interface MyProfileResponse {
  id: string;
  name: string;
  last_name?: string;
  avatar_url?: string;
  image_url?: string;
  phone_code?: string | null;
  phone?: string | null;
  province_id?: number | null;
  user?: ProfileUser | null;
}

export type ProfileSearchParams = {
  page?: number;
  limit?: number;
  name?: string;
  email?: string;
};
