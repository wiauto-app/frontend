import {
  MAKE_KEY,
  MODEL_KEY,
} from "@/app/(public)/vehiculos/[[...slug]]/constants/filterKeys.constants";
import type { HeroCatalogFacetItem } from "@/interfaces/hero-facet.interface";
import type { SelectedItem } from "../interfaces/makeSelector.interface";

export const getModelsForMake = (
  facet_models: HeroCatalogFacetItem[],
  make_id: number,
): HeroCatalogFacetItem[] =>
  facet_models.filter((model) => model.make_id === make_id);

export const isFullMakeModelSelection = (
  selected_model_slugs: string[],
  available_models: HeroCatalogFacetItem[],
): boolean => {
  if (available_models.length === 0) {
    return false;
  }

  const available_slugs = new Set(available_models.map((model) => model.slug));
  const selected_slugs = new Set(selected_model_slugs);

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

export const normalizeSelectedItemsForMake = (
  selected_items: SelectedItem[],
  make: HeroCatalogFacetItem,
  available_models: HeroCatalogFacetItem[],
): SelectedItem[] => {
  const make_id = make.id;
  const without_this_make = selected_items.filter(
    (item) => item.make_id !== make_id,
  );

  const make_entry = selected_items.find(
    (item) => item.type === "make" && item.make_id === make_id,
  );
  const model_entries = selected_items.filter(
    (item) => item.type === "model" && item.make_id === make_id,
  );

  if (make_entry && model_entries.length === 0) {
    return selected_items;
  }

  const selected_model_slugs = model_entries.map((entry) => entry.slug);

  if (isFullMakeModelSelection(selected_model_slugs, available_models)) {
    return [
      ...without_this_make,
      {
        value: true,
        type: "make",
        slug: make.slug,
        make_id,
      },
    ];
  }

  if (model_entries.length > 0) {
    return [...without_this_make, ...model_entries];
  }

  if (make_entry) {
    return [...without_this_make, make_entry];
  }

  return without_this_make;
};

export type MakeModelUrlPayload = {
  [MAKE_KEY]?: string[];
  [MODEL_KEY]?: string[];
};

export const buildMakeModelUrlPayload = (
  selected_items: SelectedItem[],
): MakeModelUrlPayload => {
  const make_slugs = selected_items
    .filter((entry) => entry.type === "make")
    .map((entry) => entry.slug);
  const model_slugs = selected_items
    .filter((entry) => entry.type === "model")
    .map((entry) => entry.slug);

  return {
    [MAKE_KEY]: make_slugs.length > 0 ? make_slugs : undefined,
    [MODEL_KEY]: model_slugs.length > 0 ? model_slugs : undefined,
  };
};
