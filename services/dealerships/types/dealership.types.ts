export type DealershipListItem = {
  id: string;
  name: string;
  slug: string;
  banner_url?: string | null;
  avatar_url?: string | null;
  is_featured: boolean;
  rating: number | null;
  reviews_count: number;
};
