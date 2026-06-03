import { HeroCatalogFacetItem } from "@/interfaces/hero-facet.interface";

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
}
