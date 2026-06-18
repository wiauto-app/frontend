export interface DealerListItem {
  id: string;
  name: string;
  slug: string;
  type: "oficial" | "multimarca" | "especialista";
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  vehicleCount: number;
  distance?: number;
  location: {
    city: string;
    province: string;
    country?: string;
  };
  services: string[];
  image?: string;
  logo?: string;
}

export interface DealerFilters {
  query?: string;
  types?: string[];
  services?: string[];
  minRating?: number;
  minVehicles?: number;
  radius?: number;
  location?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface DealersListingResult {
  dealers: DealerListItem[];
  total: number;
  page: number;
  limit: number;
}
