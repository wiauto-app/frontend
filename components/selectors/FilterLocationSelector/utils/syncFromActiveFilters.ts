import type { ActiveFiltersResponse } from "@/interfaces/active-filters.interface";
import type { HeroCatalogFacetItem } from "@/interfaces/hero-facet.interface";
import type { LocationSelectedItem } from "../interfaces/locationSelector.interface";
import {
  getMunicipalitiesForProvince,
  isFullProvinceMunicipalitySelection,
} from "./location-selection";

export type LocationSelectorSyncState = {
  selected_items: LocationSelectedItem[];
  expanded_provinces: HeroCatalogFacetItem[];
};

const resolve_province_id = (
  active_province_id: string | number,
  facet_province?: HeroCatalogFacetItem,
): number => facet_province?.id ?? Number(active_province_id);

const to_facet_province = (
  slug: string,
  province_id: number,
  name: string,
  facet_province?: HeroCatalogFacetItem,
): HeroCatalogFacetItem =>
  facet_province ?? {
    id: province_id,
    slug,
    name,
    vehicle_count: 0,
  };

export const buildLocationSelectorSyncSignature = (
  active_filters: ActiveFiltersResponse | null,
): string | null => {
  if (!active_filters) {
    return null;
  }

  const { provinces, municipalities } = active_filters.resolved;
  const province_slugs = provinces.map((item) => item.slug).sort().join(",");
  const municipality_slugs = municipalities
    .map((item) => item.slug)
    .sort()
    .join(",");
  return `${province_slugs}|${municipality_slugs}`;
};

const resolve_municipality_province_id = (
  municipality_slug: string,
  facet_municipalities: HeroCatalogFacetItem[],
): number | undefined =>
  facet_municipalities.find((item) => item.slug === municipality_slug)
    ?.province_id;

export const syncLocationSelectorFromActiveFilters = (
  active_filters: ActiveFiltersResponse,
  facet_provinces: HeroCatalogFacetItem[],
  facet_municipalities: HeroCatalogFacetItem[] = [],
): LocationSelectorSyncState => {
  const { resolved } = active_filters;
  const facet_by_slug = new Map(
    facet_provinces.map((province) => [province.slug, province]),
  );
  const facet_by_id = new Map(
    facet_provinces.map((province) => [province.id, province]),
  );

  const selected_items: LocationSelectedItem[] = [];
  const expanded_by_id = new Map<number, HeroCatalogFacetItem>();

  const register_expanded_province = (
    slug: string,
    province_id: number,
    name: string,
  ) => {
    const facet_province =
      facet_by_slug.get(slug) ?? facet_by_id.get(province_id);
    expanded_by_id.set(
      province_id,
      to_facet_province(slug, province_id, name, facet_province),
    );
  };

  const province_ids_involved = new Set<number>();

  resolved.provinces.forEach((active_province) => {
    const facet_province = facet_by_slug.get(active_province.slug);
    province_ids_involved.add(
      resolve_province_id(active_province.id, facet_province),
    );
  });

  resolved.municipalities.forEach((active_municipality) => {
    const province_id = resolve_municipality_province_id(
      active_municipality.slug,
      facet_municipalities,
    );
    if (province_id != null) {
      province_ids_involved.add(province_id);
    }
  });

  for (const province_id of province_ids_involved) {
    const active_municipalities_for_province = resolved.municipalities.filter(
      (municipality) =>
        resolve_municipality_province_id(
          municipality.slug,
          facet_municipalities,
        ) === province_id,
    );
    const active_municipality_slugs = active_municipalities_for_province.map(
      (municipality) => municipality.slug,
    );
    const available_municipalities = getMunicipalitiesForProvince(
      facet_municipalities,
      province_id,
    );

    const parent_facet = facet_by_id.get(province_id);
    const parent_active = resolved.provinces.find(
      (province) => Number(province.id) === province_id,
    );
    const parent_slug = parent_facet?.slug ?? parent_active?.slug;
    const parent_name =
      parent_facet?.name ??
      parent_active?.name ??
      active_municipalities_for_province[0]?.name ??
      "";

    if (!parent_slug) {
      continue;
    }

    register_expanded_province(parent_slug, province_id, parent_name);

    const has_province_in_resolved = resolved.provinces.some((active_province) => {
      const facet_province = facet_by_slug.get(active_province.slug);
      return resolve_province_id(active_province.id, facet_province) === province_id;
    });

    const is_full_selection =
      available_municipalities.length > 0 &&
      isFullProvinceMunicipalitySelection(
        active_municipality_slugs,
        available_municipalities,
      );

    const is_province_only =
      has_province_in_resolved &&
      active_municipalities_for_province.length === 0;

    if (is_full_selection || is_province_only) {
      selected_items.push({
        value: true,
        type: "province",
        slug: parent_slug,
        province_id,
      });
      continue;
    }

    if (active_municipalities_for_province.length > 0) {
      active_municipalities_for_province.forEach((active_municipality) => {
        selected_items.push({
          value: true,
          type: "municipality",
          slug: active_municipality.slug,
          province_id,
        });
      });
    }
  }

  return {
    selected_items,
    expanded_provinces: Array.from(expanded_by_id.values()),
  };
};
