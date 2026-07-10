import { heroFacetService } from "@/services/search/heroFacetService";
import { makeService } from "@/services/vehicles/makeService";

export interface MakeLogoBadgeItem {
  slug: string;
  name: string;
  image_url: string;
}

export const buildMakeLogoBadges = async (
  limit = 9,
): Promise<MakeLogoBadgeItem[]> => {
  const [catalog_page, popular_makes] = await Promise.all([
    makeService.findAll({ page: 1, limit: 200 }),
    heroFacetService.getMakes(),
  ]);

  const popularity_by_slug = new Map(
    popular_makes.map((make) => [make.slug, make.vehicle_count]),
  );

  return catalog_page.data
    .filter((make): make is typeof make & { image_url: string } =>
      Boolean(make.image_url?.trim()),
    )
    .sort(
      (left, right) =>
        (popularity_by_slug.get(right.slug) ?? 0) -
        (popularity_by_slug.get(left.slug) ?? 0),
    )
    .slice(0, limit)
    .map((make) => ({
      slug: make.slug,
      name: make.name,
      image_url: make.image_url,
    }));
};
