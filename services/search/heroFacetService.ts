import qs from "qs";

import type {
  HeroCatalogFacetItem,
  HeroFacetKind,
  HeroFacetsResponse,
  HeroPriceRangeFacetItem,
  HeroSearchFilters,
} from "@/interfaces/hero-facet.interface";
import { apiGet } from "@/lib/api";

export const V1_SEARCH_HERO_FACETS = "/v1/search/hero-facets";

export type HeroFacetQueryParams = HeroSearchFilters & {
  facet: HeroFacetKind;
  search?: string;
};

const fetchFacets = async <T extends HeroCatalogFacetItem | HeroPriceRangeFacetItem>(
  params: HeroFacetQueryParams,
): Promise<T[]> => {
  const query = qs.stringify(params, {
    skipNulls: true,
    addQueryPrefix: true,
  });
  const response = await apiGet<HeroFacetsResponse>(
    `${V1_SEARCH_HERO_FACETS}${query}`,
  );
  return (response.data?.items ?? []) as T[];
};

export const heroFacetService = {
  getMakes: (
    filters: HeroSearchFilters,
    search?: string,
  ): Promise<HeroCatalogFacetItem[]> =>
    fetchFacets<HeroCatalogFacetItem>({
      facet: "makes",
      ...filters,
      search,
    }),

  getModels: (
    make_slug: string,
    filters: HeroSearchFilters,
    search?: string,
  ): Promise<HeroCatalogFacetItem[]> =>
    fetchFacets<HeroCatalogFacetItem>({
      facet: "models",
      ...filters,
      make_slug,
      search,
    }),

  getProvinces: (
    filters: HeroSearchFilters,
    search?: string,
  ): Promise<HeroCatalogFacetItem[]> =>
    fetchFacets<HeroCatalogFacetItem>({
      facet: "provinces",
      ...filters,
      search,
    }),

  getMunicipalities: (
    province_slug: string,
    filters: HeroSearchFilters,
    search?: string,
  ): Promise<HeroCatalogFacetItem[]> =>
    fetchFacets<HeroCatalogFacetItem>({
      facet: "municipalities",
      ...filters,
      province_slug,
      search,
    }),

  getPriceRanges: (
    filters: HeroSearchFilters,
  ): Promise<HeroPriceRangeFacetItem[]> =>
    fetchFacets<HeroPriceRangeFacetItem>({
      facet: "price_ranges",
      ...filters,
    }),
};
