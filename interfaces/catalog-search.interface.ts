export interface SearchMakeItem {
  id: number;
  name: string;
  slug: string;
  created_at?: string;
  vehicle_count?: number;
}

export interface SearchMakesResponse {
  makes: SearchMakeItem[];
}

export interface SearchModelItem {
  id: number;
  make_id: number;
  model_id: number;
  name: string;
  slug: string;
  created_at?: string;
  vehicle_count?: number;
}

export interface SearchModelsResponse {
  models: SearchModelItem[];
}

/** @deprecated Usar SearchModelItem */
export type CatalogModelItem = SearchModelItem;
