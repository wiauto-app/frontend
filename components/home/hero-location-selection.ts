import {
  COMMUNITY_KEY,
  PROVINCE_KEY,
} from "@/app/(public)/vehiculos/[[...slug]]/constants/filterKeys.constants";
import type { LocationUrlPayload } from "@/components/selectors/FilterLocationSelector/utils/location-selection";
import type { HeroCatalogFacetItem } from "@/interfaces/hero-facet.interface";

export const buildHeroLocationTriggerLabel = (
  selectedCommunities: HeroCatalogFacetItem[],
  selectedProvinces: HeroCatalogFacetItem[],
  placeholder = "Ubicación",
): string => {
  if (selectedProvinces.length > 0) {
    return selectedProvinces.map((province) => province.name).join(", ");
  }

  if (selectedCommunities.length > 0) {
    return selectedCommunities.map((community) => community.name).join(", ");
  }

  return placeholder;
};

export const toHeroLocationPayload = (
  selectedCommunities: HeroCatalogFacetItem[],
  selectedProvinces: HeroCatalogFacetItem[],
): LocationUrlPayload => {
  const province_codes_with_children = new Set(
    selectedProvinces
      .map((province) => province.community_cod_ccaa)
      .filter(Boolean),
  );

  const community_slugs = selectedCommunities
    .filter(
      (community) =>
        !province_codes_with_children.has(community.community_cod_ccaa ?? ""),
    )
    .map((community) => community.slug);

  const province_slugs = selectedProvinces.map((province) => province.slug);

  return {
    [COMMUNITY_KEY]:
      community_slugs.length > 0 ? community_slugs : undefined,
    [PROVINCE_KEY]: province_slugs.length > 0 ? province_slugs : undefined,
  };
};
