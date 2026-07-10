import { heroFacetService } from "@/services/search/heroFacetService";

export interface ProvinceQuickBadgeItem {
  slug: string;
  name: string;
}

export const buildPopularProvinceBadges = async (
  limit = 7,
): Promise<ProvinceQuickBadgeItem[]> => {
  const provinces = await heroFacetService.getProvinces({});

  return provinces
    .sort((left, right) => right.vehicle_count - left.vehicle_count)
    .slice(0, limit)
    .map((province) => ({
      slug: province.slug,
      name: province.name,
    }));
};
