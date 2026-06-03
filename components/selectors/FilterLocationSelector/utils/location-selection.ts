import {
  MUNICIPALITY_KEY,
  PROVINCE_KEY,
} from "@/app/(public)/vehiculos/[[...slug]]/constants/filterKeys.constants";
import type { HeroCatalogFacetItem } from "@/interfaces/hero-facet.interface";
import type { LocationSelectedItem } from "../interfaces/locationSelector.interface";

export const getMunicipalitiesForProvince = (
  facet_municipalities: HeroCatalogFacetItem[],
  province_id: number,
): HeroCatalogFacetItem[] =>
  facet_municipalities.filter(
    (municipality) => municipality.province_id === province_id,
  );

export const isFullProvinceMunicipalitySelection = (
  selected_municipality_slugs: string[],
  available_municipalities: HeroCatalogFacetItem[],
): boolean => {
  if (available_municipalities.length === 0) {
    return false;
  }

  const available_slugs = new Set(
    available_municipalities.map((municipality) => municipality.slug),
  );
  const selected_slugs = new Set(selected_municipality_slugs);

  if (selected_slugs.size !== available_slugs.size) {
    return false;
  }

  for (const slug of available_slugs) {
    if (!selected_slugs.has(slug)) {
      return false;
    }
  }

  return true;
};

export const normalizeSelectedItemsForProvince = (
  selected_items: LocationSelectedItem[],
  province: HeroCatalogFacetItem,
  available_municipalities: HeroCatalogFacetItem[],
): LocationSelectedItem[] => {
  const province_id = province.id;
  const without_this_province = selected_items.filter(
    (item) => item.province_id !== province_id,
  );

  const province_entry = selected_items.find(
    (item) => item.type === "province" && item.province_id === province_id,
  );
  const municipality_entries = selected_items.filter(
    (item) => item.type === "municipality" && item.province_id === province_id,
  );

  if (province_entry && municipality_entries.length === 0) {
    return selected_items;
  }

  const selected_municipality_slugs = municipality_entries.map(
    (entry) => entry.slug,
  );

  if (
    isFullProvinceMunicipalitySelection(
      selected_municipality_slugs,
      available_municipalities,
    )
  ) {
    return [
      ...without_this_province,
      {
        value: true,
        type: "province",
        slug: province.slug,
        province_id,
      },
    ];
  }

  if (municipality_entries.length > 0) {
    return [...without_this_province, ...municipality_entries];
  }

  if (province_entry) {
    return [...without_this_province, province_entry];
  }

  return without_this_province;
};

export type LocationUrlPayload = {
  [PROVINCE_KEY]?: string[];
  [MUNICIPALITY_KEY]?: string[];
};

export const buildLocationUrlPayload = (
  selected_items: LocationSelectedItem[],
): LocationUrlPayload => {
  const province_slugs = selected_items
    .filter((entry) => entry.type === "province")
    .map((entry) => entry.slug);
  const municipality_slugs = selected_items
    .filter((entry) => entry.type === "municipality")
    .map((entry) => entry.slug);

  return {
    [PROVINCE_KEY]: province_slugs.length > 0 ? province_slugs : undefined,
    [MUNICIPALITY_KEY]:
      municipality_slugs.length > 0 ? municipality_slugs : undefined,
  };
};
