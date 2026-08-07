export interface MunicipalityCatalogItem {
  id: number;
  name: string | null;
  ineCode: string | null;
  nuts1: string | null;
  nuts2: string | null;
  nuts3: string | null;
  slug: string;
  image_url: string | null;
}

export interface FindAllMunicipalitiesParams {
  page?: number;
  limit?: number;
  order_by?: string;
  order_direction?: "ASC" | "DESC";
  search?: string;
  province_slug?: string;
}
