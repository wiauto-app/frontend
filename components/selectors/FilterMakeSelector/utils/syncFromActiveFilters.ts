import type { ActiveFiltersResponse } from "@/interfaces/active-filters.interface";
import type { HeroCatalogFacetItem } from "@/interfaces/hero-facet.interface";
import type { SelectedItem } from "../interfaces/makeSelector.interface";
import {
  getModelsForMake,
  isFullMakeModelSelection,
} from "./make-model-selection";

export type MakeSelectorSyncState = {
  selected_items: SelectedItem[];
  expanded_makes: HeroCatalogFacetItem[];
};

const resolve_make_id = (
  active_make_id: string | number,
  facet_make?: HeroCatalogFacetItem,
): number => facet_make?.id ?? Number(active_make_id);

const to_facet_make = (
  slug: string,
  make_id: number,
  name: string,
  facet_make?: HeroCatalogFacetItem,
): HeroCatalogFacetItem =>
  facet_make ?? {
    id: make_id,
    slug,
    name,
    vehicle_count: 0,
  };

export const buildMakeSelectorSyncSignature = (
  active_filters: ActiveFiltersResponse | null,
): string | null => {
  if (!active_filters) {
    return null;
  }

  const { makes, models } = active_filters.resolved;
  const make_slugs = makes.map((item) => item.slug).sort().join(",");
  const model_slugs = models.map((item) => item.slug).sort().join(",");
  return `${make_slugs}|${model_slugs}`;
};

export const buildMakeSelectorModelsSyncKey = (
  facet_models: HeroCatalogFacetItem[],
): string =>
  facet_models
    .map((model) => `${model.make_id}:${model.slug}`)
    .sort()
    .join(",");

/**
 * Estado inicial alineado con makeSelectorItem:
 * - type "make" si la marca está activa sin modelos o con todos los modelos de facetas
 * - type "model" solo cuando la selección de modelos es un subconjunto estricto
 * - acordeón expandido en marcas activas o con modelos activos
 */
export const syncMakeSelectorFromActiveFilters = (
  active_filters: ActiveFiltersResponse,
  facet_makes: HeroCatalogFacetItem[],
  facet_models: HeroCatalogFacetItem[] = [],
): MakeSelectorSyncState => {
  const { resolved } = active_filters;
  const facet_by_slug = new Map(
    facet_makes.map((make) => [make.slug, make]),
  );
  const facet_by_id = new Map(facet_makes.map((make) => [make.id, make]));

  const selected_items: SelectedItem[] = [];
  const expanded_by_id = new Map<number, HeroCatalogFacetItem>();

  const register_expanded_make = (
    slug: string,
    make_id: number,
    name: string,
  ) => {
    const facet_make = facet_by_slug.get(slug) ?? facet_by_id.get(make_id);
    expanded_by_id.set(
      make_id,
      to_facet_make(slug, make_id, name, facet_make),
    );
  };

  const make_ids_involved = new Set<number>();

  resolved.makes.forEach((active_make) => {
    const facet_make = facet_by_slug.get(active_make.slug);
    make_ids_involved.add(resolve_make_id(active_make.id, facet_make));
  });

  resolved.models.forEach((active_model) => {
    if (active_model.make_id != null) {
      make_ids_involved.add(active_model.make_id);
    }
  });

  for (const make_id of make_ids_involved) {
    const active_models_for_make = resolved.models.filter(
      (model) => model.make_id === make_id,
    );
    const active_model_slugs = active_models_for_make.map(
      (model) => model.slug,
    );
    const available_models = getModelsForMake(facet_models, make_id);

    const parent_facet = facet_by_id.get(make_id);
    const parent_active = resolved.makes.find(
      (make) => Number(make.id) === make_id,
    );
    const parent_slug = parent_facet?.slug ?? parent_active?.slug;
    const parent_name =
      parent_facet?.name ?? parent_active?.name ?? active_models_for_make[0]?.name ?? "";

    if (!parent_slug) {
      continue;
    }

    register_expanded_make(parent_slug, make_id, parent_name);

    const has_make_in_resolved = resolved.makes.some((active_make) => {
      const facet_make = facet_by_slug.get(active_make.slug);
      return resolve_make_id(active_make.id, facet_make) === make_id;
    });

    const is_full_selection =
      available_models.length > 0 &&
      isFullMakeModelSelection(active_model_slugs, available_models);

    const is_brand_only =
      has_make_in_resolved && active_models_for_make.length === 0;

    if (is_full_selection || is_brand_only) {
      selected_items.push({
        value: true,
        type: "make",
        slug: parent_slug,
        make_id,
      });
      continue;
    }

    if (active_models_for_make.length > 0) {
      active_models_for_make.forEach((active_model) => {
        selected_items.push({
          value: true,
          type: "model",
          slug: active_model.slug,
          make_id,
        });
      });
    }
  }

  return {
    selected_items,
    expanded_makes: Array.from(expanded_by_id.values()),
  };
};
