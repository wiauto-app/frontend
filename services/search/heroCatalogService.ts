import type {
  HeroCatalogFacetItem,
  HeroPriceRangeFacetItem,
} from "@/interfaces/hero-facet.interface";
import { HERO_PRICE_UNTIL_OPTIONS } from "@/interfaces/hero-facet.interface";
import type { Make } from "@/interfaces/vehicle.interface";
import type { SearchModelItem } from "@/interfaces/catalog-search.interface";
import { municipalitiesCatalogService } from "@/services/locations/municipalitiesCatalogService";
import { provincesCatalogService } from "@/services/locations/provincesCatalogService";
import type { MunicipalityCatalogItem } from "@/services/locations/types/municipality.types";
import type { ProvinceCatalogItem } from "@/services/locations/types/province.types";
import { makeService } from "@/services/vehicles/makeService";
import { modelService } from "@/services/vehicles/modelService";

const PAGE_LIMIT = 100;

interface PaginatedPage<T> {
  data: T[];
  total?: number;
}

const fetchAllPages = async <T>(
  fetchPage: (page: number, limit: number) => Promise<PaginatedPage<T>>,
): Promise<T[]> => {
  const items: T[] = [];
  let page = 1;

  while (true) {
    const result = await fetchPage(page, PAGE_LIMIT);
    const batch = result.data ?? [];

    if (batch.length === 0) {
      break;
    }

    items.push(...batch);

    if (batch.length < PAGE_LIMIT) {
      break;
    }

    if (result.total !== undefined && items.length >= result.total) {
      break;
    }

    page += 1;
  }

  return items;
};

const formatPriceUntilLabel = (until_price: number): string =>
  `Hasta ${until_price.toLocaleString("es-ES")} €`;

const mapMakeToFacetItem = (make: Make): HeroCatalogFacetItem => ({
  id: Number(make.id),
  slug: make.slug,
  name: make.name,
  vehicle_count: 0,
  image_url: make.image_url ?? null,
});

const mapModelToFacetItem = (
  model: SearchModelItem,
  make?: Pick<HeroCatalogFacetItem, "id" | "slug" | "name">,
): HeroCatalogFacetItem => ({
  id: model.id ?? model.model_id,
  slug: model.slug,
  name: model.name,
  vehicle_count: 0,
  make_id: model.make_id ?? make?.id,
  make_slug: make?.slug,
  make_name: make?.name,
});

const mapProvinceToFacetItem = (
  province: ProvinceCatalogItem,
): HeroCatalogFacetItem => ({
  id: province.id,
  slug: province.slug,
  name: province.name,
  vehicle_count: 0,
  image_url: province.image_url ?? null,
});

const mapMunicipalityToFacetItem = (
  municipality: MunicipalityCatalogItem,
): HeroCatalogFacetItem => ({
  id: municipality.id,
  slug: municipality.slug,
  name: municipality.name?.trim() || municipality.slug,
  vehicle_count: 0,
  image_url: municipality.image_url ?? null,
});

export const heroCatalogService = {
  getMakes: async (search?: string): Promise<HeroCatalogFacetItem[]> => {
    const makes = await fetchAllPages((page, limit) =>
      makeService.findAll({
        page,
        limit,
        search,
        order_by: "name",
        order_direction: "ASC",
      }),
    );
    return makes.map(mapMakeToFacetItem);
  },

  getModels: async (
    makeId: number,
    search?: string,
    make?: Pick<HeroCatalogFacetItem, "id" | "slug" | "name">,
  ): Promise<HeroCatalogFacetItem[]> => {
    const models = await fetchAllPages((page, limit) =>
      modelService.findAll({
        make_id: makeId,
        page,
        limit,
        search,
        order_by: "name",
        order_direction: "ASC",
      }),
    );
    return models.map((model) => mapModelToFacetItem(model, make));
  },

  getProvinces: async (search?: string): Promise<HeroCatalogFacetItem[]> => {
    const provinces = await fetchAllPages(async (page, limit) => {
      const result = await provincesCatalogService.findAll({
        page,
        limit,
        search,
        order_by: "name",
        order_direction: "ASC",
      });
      return result ?? { data: [], total: 0 };
    });
    return provinces.map(mapProvinceToFacetItem);
  },

  getMunicipalities: async (
    provinceSlug: string,
    search?: string,
  ): Promise<HeroCatalogFacetItem[]> => {
    const municipalities = await fetchAllPages((page, limit) =>
      municipalitiesCatalogService.findAll({
        page,
        limit,
        search,
        province_slug: provinceSlug,
        order_by: "name",
        order_direction: "ASC",
      }),
    );
    return municipalities.map(mapMunicipalityToFacetItem);
  },

  getPriceRanges: (): HeroPriceRangeFacetItem[] =>
    HERO_PRICE_UNTIL_OPTIONS.map((until_price) => ({
      until_price,
      label: formatPriceUntilLabel(until_price),
      vehicle_count: 0,
    })),
};
