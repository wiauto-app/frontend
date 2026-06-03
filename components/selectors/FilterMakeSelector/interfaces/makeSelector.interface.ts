import { HeroCatalogFacetItem } from "@/interfaces/hero-search.interface";

export type SelectAllType = "make" | "model";

export interface SelectedItem {
  value: boolean;
  type: SelectAllType;
  slug: string;
  /** Presente en type=model cuando la API devuelve make_id */
  make_id?: number;
}

export interface MakeSelectorItemProps {
  selectedMakes: HeroCatalogFacetItem[];
  setSelectedMakes: (makes: HeroCatalogFacetItem[]) => void;
  isLoading: boolean;
  models: HeroCatalogFacetItem[];
  item: HeroCatalogFacetItem;
}