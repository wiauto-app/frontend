
import type {
  HeroCatalogFacetItem,
  HeroCountResponse,
  HeroFacetCascadeFilters,
  HeroFacetKind,
  HeroFacetsResponse,
  HeroPriceRangeFacetItem,
} from "@/interfaces/hero-facet.interface";
import { apiGet } from "@/lib/api";

export const V1_SEARCH_HERO_FACETS = "/v1/search/hero-facets";
export const V1_SEARCH_HERO_COUNT = "/v1/search/hero-count";

export type HeroFacetQueryParams = HeroFacetCascadeFilters & {
  facet: HeroFacetKind;
  search?: string;
};

const fetchFacets = async <T extends HeroCatalogFacetItem | HeroPriceRangeFacetItem>(
  params: HeroFacetQueryParams,
): Promise<T[]> => {

  const response = await apiGet<HeroFacetsResponse>(
    `${V1_SEARCH_HERO_FACETS}`,
    params,
    60
  );
  return (response.data?.items ?? []) as T[];
};

export const heroFacetService = {
  getMakes: (
    filters?: HeroFacetCascadeFilters,
    search?: string,
  ): Promise<HeroCatalogFacetItem[]> =>
    fetchFacets<HeroCatalogFacetItem>({
      facet: "makes",
      ...filters,
      search,
    }),

  getModels: (
    make_slugs?: string[],
    filters?: HeroFacetCascadeFilters,
    search?: string,
  ): Promise<HeroCatalogFacetItem[]> =>
    fetchFacets<HeroCatalogFacetItem>({
      facet: "models",
      ...filters,
      ...(make_slugs?.length ? { make_slugs } : {}),
      search,
    }),

  getProvinces: (
    filters: HeroFacetCascadeFilters,
    search?: string,
  ): Promise<HeroCatalogFacetItem[]> =>
    fetchFacets<HeroCatalogFacetItem>({
      facet: "provinces",
      ...filters,
      search,
    }),

  getMunicipalities: (
    province_slug: string,
    filters: HeroFacetCascadeFilters,
    search?: string,
  ): Promise<HeroCatalogFacetItem[]> =>
    fetchFacets<HeroCatalogFacetItem>({
      facet: "municipalities",
      ...filters,
      province_slug,
      search,
    }),

  getPriceRanges: (
    filters: HeroFacetCascadeFilters,
  ): Promise<HeroPriceRangeFacetItem[]> =>
    fetchFacets<HeroPriceRangeFacetItem>({
      facet: "price_ranges",
      ...filters,
    }),

  getCount: async (
    filters?: HeroFacetCascadeFilters,
  ): Promise<HeroCountResponse> => {
    const response = await apiGet<HeroCountResponse>(
      V1_SEARCH_HERO_COUNT,
      filters,
      0,
    );
    return response.data ?? { count: 0 };
  },
};
