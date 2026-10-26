export type MyListingsOrderBy = "created_at" | "price" | "views" | "leads";
export type MyListingsOrderDirection = "ASC" | "DESC";

export interface MyListingsOrderOption {
  value: string;
  label: string;
  order_by: MyListingsOrderBy;
  order_direction: MyListingsOrderDirection;
}

export const MY_LISTINGS_ORDER_OPTIONS: MyListingsOrderOption[] = [
  {
    value: "created_at:DESC",
    label: "Más recientes",
    order_by: "created_at",
    order_direction: "DESC",
  },
  {
    value: "created_at:ASC",
    label: "Más antiguos",
    order_by: "created_at",
    order_direction: "ASC",
  },
  {
    value: "price:ASC",
    label: "Precio: menor a mayor",
    order_by: "price",
    order_direction: "ASC",
  },
  {
    value: "price:DESC",
    label: "Precio: mayor a menor",
    order_by: "price",
    order_direction: "DESC",
  },
  {
    value: "views:DESC",
    label: "Más vistas",
    order_by: "views",
    order_direction: "DESC",
  },
  {
    value: "leads:DESC",
    label: "Más contactos",
    order_by: "leads",
    order_direction: "DESC",
  },
];

export const DEFAULT_MY_LISTINGS_ORDER_VALUE = MY_LISTINGS_ORDER_OPTIONS[0].value;

export const getMyListingsOrderOption = (value: string): MyListingsOrderOption =>
  MY_LISTINGS_ORDER_OPTIONS.find((option) => option.value === value) ??
  MY_LISTINGS_ORDER_OPTIONS[0];
