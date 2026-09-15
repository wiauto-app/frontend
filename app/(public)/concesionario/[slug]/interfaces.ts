export interface DealerProfileContact {
  phone?: string;
  email?: string;
  location?: string;
  schedule?: string;
}

export interface DealerQuickStats {
  publishedVehicles: number;
  reviewCount: number;
  transactions?: number;
  yearsOnPlatform?: { years: number; months: number } | undefined;
}

export interface DealerProfile {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  type?: "oficial" | "multimarca" | "especialista";
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  memberSince?: string;
  lastConnection?: string;
  avatar?: string;
  banner?: string;
  about: string;
  highlights?: string[];
  contact: DealerProfileContact;
  quickStats: DealerQuickStats;
}
