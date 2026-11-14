export interface CatalogSelectorOrderParams {
  order_by: string;
  order_direction: "ASC";
}

export const catalogSelectorNameOrder: CatalogSelectorOrderParams = {
  order_by: "name",
  order_direction: "ASC",
};

export const catalogSelectorYearOrder: CatalogSelectorOrderParams = {
  order_by: "year",
  order_direction: "ASC",
};