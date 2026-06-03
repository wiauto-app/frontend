import { HeroCatalogFacetItem } from "@/interfaces/hero-facet.interface";
import type { PublisherType, TransmissionType } from "@/interfaces/vehicle.interface";

/** Selección jerárquica: padres (marca/provincia) e hijos (modelo/municipio) por slug. */
export type HierarchyMultiValue = {
  parent_slugs: string[];
  child_slugs: string[];
};

export const EMPTY_HIERARCHY_MULTI_VALUE: HierarchyMultiValue = {
  parent_slugs: [],
  child_slugs: [],
};

/** @deprecated Usar HierarchyMultiValue */
export type MakeModelValue = {
  make_slug?: string;
  model_slug?: string;
};

export type NumericRangeValue = {
  since?: number;
  until?: number;
};

export type MultiSlugValue = string[];

export type PriceFilterValue = NumericRangeValue & {
  cuota_slug?: string;
};

export type PublisherTypesValue = PublisherType[];

export type TransmissionTypesValue = TransmissionType[];

export type LocationMultiValue = HierarchyMultiValue;


