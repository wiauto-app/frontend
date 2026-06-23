export type DealershipListItem = {
  id: string;
  name: string;
  slug: string;
  avatar_url?: string | null;
  banner_url?: string | null;
  description: string;
  website_url?: string | null;
  email: string;
  phone_code: string;
  phone: string;
  address: string;
  lat?: number;
  lng?: number;
  is_featured: boolean;
  show_phone: boolean;
  rating: number | null;
  created_at: string;
  updated_at: string;
  members_count: number;
  reviews_count: number;
  vehicles_count?: number;
  distance?: number | null;
};

export type DealershipDetail = DealershipListItem & {
  members?: Array<{
    id: string;
    dealership_id: string;
    profile_id: string;
    role: "owner" | "admin" | "member";
    created_at: string;
    updated_at: string;
    profile: {
      id: string;
      name: string;
      last_name?: string;
      avatar_url?: string;
      email: string;
    };
  }>;
};

export type CreateDealershipMemberInput = {
  profile_id: string;
  role: "owner" | "admin" | "member";
};

export type CreateDealershipPayload = {
  name: string;
  slug: string;
  avatar_url: string;
  banner_url: string;
  description: string;
  website_url: string;
  email: string;
  phone_code: string;
  phone: string;
  show_phone?: boolean;
  address: string;
  lat: number;
  lng: number;
  members: CreateDealershipMemberInput[];
};

export type CreateMyDealershipPayload = Omit<CreateDealershipPayload, "members">;

export type UpdateDealershipPayload = Partial<CreateMyDealershipPayload>;
