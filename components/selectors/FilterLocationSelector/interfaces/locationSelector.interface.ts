import { HeroCatalogFacetItem } from "@/interfaces/hero-facet.interface";
import type { LocationUrlPayload } from "../utils/location-selection";

export type LocationSelectType = "province" | "municipality";

export interface LocationSelectedItem {
  value: boolean;
  type: LocationSelectType;
  slug: string;
  province_id: number;
}

export interface LocationSelectorItemProps {
  selectedProvinces: HeroCatalogFacetItem[];
  setSelectedProvinces: (provinces: HeroCatalogFacetItem[]) => void;
  isLoading: boolean;
  municipalities: HeroCatalogFacetItem[];
  item: HeroCatalogFacetItem;
  selectedItems?: LocationSelectedItem[];
  setSelectedItems?: (items: LocationSelectedItem[]) => void;
  onApplyLocationPayload?: (payload: LocationUrlPayload) => void;
}
