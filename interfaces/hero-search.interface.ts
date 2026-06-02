export type HeroFacetKind =
  | "makes"
  | "models"
  | "provinces"
  | "municipalities"
  | "price_ranges";

export type HeroCatalogFacetItem = {
  id: number;
  slug: string;
  name: string;
  vehicle_count: number;
};

export type HeroPriceRangeFacetItem = {
  until_price: number;
  label: string;
  vehicle_count: number;
};

export type HeroFacetItem = HeroCatalogFacetItem | HeroPriceRangeFacetItem;

export type HeroFacetsResponse = {
  facet: HeroFacetKind;
  items: HeroFacetItem[];
};

export type HeroSearchFilters = {
  make_slug?: string;
  model_slug?: string;
  province_slug?: string;
  municipality_slug?: string;
  until_price?: number;
};

export const HERO_PRICE_UNTIL_OPTIONS = [
  5000, 10000, 15000, 20000, 30000, 50000,
] as const;
