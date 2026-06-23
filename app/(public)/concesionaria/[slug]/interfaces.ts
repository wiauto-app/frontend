export interface DealerProfileContact {
  phone?: string;
  email?: string;
  location?: string;
  schedule?: string;
}

export interface DealerProfileStats {
  score: number;
  completedSales?: number;
  responseTime?: string;
}

export interface DealerQuickStats {
  publishedVehicles: number;
  positiveReviewsPercent?: number;
  transactions?: number;
  yearsOnPlatform?: number;
}

export interface DealerProfileReview {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  comment: string;
}

export interface DealerRatingDistribution {
  stars: number;
  count: number;
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
  stats: DealerProfileStats;
  quickStats: DealerQuickStats;
  reviews: DealerProfileReview[];
  ratingDistribution: DealerRatingDistribution[];
}
