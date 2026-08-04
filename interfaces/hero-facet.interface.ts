export type HeroFacetKind =
  | "makes"
  | "models"
  | "provinces"
  | "municipalities"
  | "price_ranges";

export interface HeroCatalogFacetItem {
  id: number;
  slug: string;
  name: string;
  vehicle_count: number;
  /** Presente solo cuando facet=makes (desde entidad Make) */
  image_url?: string | null;
  /** Presente solo cuando facet=models */
  make_id?: number;
  /** Presente solo cuando facet=models (para autocompletar marca) */
  make_slug?: string;
  /** Presente solo cuando facet=models (para autocompletar marca) */
  make_name?: string;
  /** Asignado en el cliente cuando facet=municipalities (por provincia expandida) */
  province_id?: number;
}

export interface HeroCountResponse {
  count: number;
}

export interface VehicleByRefResponse {
  id: string;
}

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

/** Estado de filtros del buscador hero (selección múltiple en UI). */
export type HeroSearchFilters = {
  makes_slugs?: string[];
  models_slugs?: string[];
  provinces_slugs?: string[];
  municipalities_slugs?: string[];
  until_price?: number;
};

/**
 * Parámetros de cascada para facetas hero (API: un slug por dimensión).
 * El front envía el primer slug de cada array cuando hay varios seleccionados.
 */
export type HeroFacetCascadeFilters = {
  make_slugs?: string[];
  model_slugs?: string[];
  province_slug?: string;
  municipality_slug?: string;
  until_price?: number;
};

/** @deprecated Usar HeroFacetCascadeFilters */
export type HeroSearchFiltersCascade = HeroFacetCascadeFilters;

export const toHeroFacetCascadeFilters = (
  filters: HeroSearchFilters,
): HeroFacetCascadeFilters => ({
  make_slugs: filters.makes_slugs,
  model_slugs: filters.models_slugs,
  province_slug: filters.provinces_slugs?.[0],
  municipality_slug: filters.municipalities_slugs?.[0],
  until_price: filters.until_price,
});

export const HERO_PRICE_UNTIL_OPTIONS = [
  5000, 10000, 15000, 20000, 30000, 50000,
] as const;

export type HeroPriceUntilOption = (typeof HERO_PRICE_UNTIL_OPTIONS)[number];

export const isHeroCatalogFacetItem = (
  item: HeroFacetItem,
): item is HeroCatalogFacetItem => "slug" in item;

export const isHeroPriceRangeFacetItem = (
  item: HeroFacetItem,
): item is HeroPriceRangeFacetItem => "until_price" in item;
