import type { HeroCatalogFacetItem } from "@/interfaces/hero-facet.interface";
import { heroFacetService } from "@/services/search/heroFacetService";
import { provincesCatalogService } from "@/services/locations/provincesCatalogService";

export type ProvinceZoneItem = HeroCatalogFacetItem & {
  image_url: string | null;
};

export const buildProvinceZones = async (): Promise<ProvinceZoneItem[]> => {
  const [facets, catalog] = await Promise.all([
    heroFacetService.getProvinces({}),
    provincesCatalogService.findAll({ page: 1, limit: 60 }),
  ]);

  const image_by_slug = new Map(
    catalog.data.map((province) => [province.slug, province.image_url]),
  );

  return facets
    .filter((facet) => facet.vehicle_count > 0)
    .map((facet) => ({
      ...facet,
      image_url: image_by_slug.get(facet.slug) ?? null,
    }))
    .sort((a, b) => b.vehicle_count - a.vehicle_count);
};
