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

export type ProfileSearchParams = {
  page?: number;
  limit?: number;
  name?: string;
  email?: string;
};
