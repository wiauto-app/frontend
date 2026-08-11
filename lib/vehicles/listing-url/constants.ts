import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";

export const VEHICLES_LISTING_BASE_PATH = "/vehiculos";

export const PROVINCE_PATH_PREFIX = "provincia-";
export const COMMUNITY_PATH_PREFIX = "comunidad-";
export const MUNICIPALITY_PATH_PREFIX = "municipio-";

/** Máximo: comunidad + provincia + municipio (marca/modelo solo en query). */
export const MAX_PATH_SEGMENTS = 3;

/** Query params de catálogo degradados (no indexables directamente). */
export const CATALOG_DEGRADED_QUERY_KEYS = [
  "marcas",
  "modelos",
  "provincias",
  "comunidades",
  "municipios",
] as const;

export const DEFAULT_LISTING_PARAMS: Required<
  Pick<FindAllVehiclesParams, "page" | "limit" | "order_by" | "order_direction">
> = {
  page: 1,
  limit: 30,
  order_by: "created_at",
  order_direction: "DESC",
};

/** Query amigable → clave DTO */
export const FRIENDLY_QUERY_TO_DTO = {
  tipo: "type_slug",
  marcas: "makes_slugs",
  modelos: "models_slugs",
  categorias: "categories_slugs",
  categoria: "categories_slugs",
  provincias: "provinces_slugs",
  comunidades: "comunities_slugs",
  municipios: "municipalities_slugs",
  precio_desde: "since_price",
  precio_hasta: "until_price",
  cuota_desde: "since_price",
  cuota_hasta: "until_price",
  meses_cuota: "cuota_slugs",
  anio_desde: "since_year",
  anio_hasta: "until_year",
  km_desde: "since_mileage",
  km_hasta: "until_mileage",
  combustible: "fuel_type_slugs",
  cambio: "transmission_types",
  transmision: "transmission_types",
  traccion: "traction_slugs",
  etiqueta: "dgt_label_ids",
  color: "color_slugs",
  extras: "features_slugs",
  equipamiento: "features_slugs",
  servicios: "service_slugs",
  autonomia: "autonomy_since",
  "capacidad_batería": "battery_capacity_since",
  garantia: "warranty_slugs",
  pagina: "page",
  limite: "limit",
  q: "query",
  condicion: "condition",
  oferta: "price_offer",
  destacados: "is_seller_featured",
  lat: "lat",
  lng: "lng",
  radio: "radius",
} as const;

/** Claves legacy (API) aceptadas al parsear para redirects */
export const LEGACY_API_QUERY_KEYS = new Set([
  "page",
  "limit",
  "order_by",
  "order_direction",
  "query",
  "type_slug",
  "make_slug",
  "model_slug",
  "category_slug",
  "makes_slugs",
  "models_slugs",
  "categories_slugs",
  "since_price",
  "until_price",
  "price_offer",
  "provinces_slugs",
  "comunities_slugs",
  "municipalities_slugs",
  "service_slugs",
  "lat",
  "lng",
  "radius",
  "publisher_types",
  "is_seller_featured",
  "warranty_slugs",
  "since_year",
  "until_year",
  "since_mileage",
  "until_mileage",
  "transmission_types",
  "fuel_type_slugs",
  "traction_slugs",
  "power_since",
  "power_until",
  "displacement_since",
  "displacement_until",
  "dgt_label_ids",
  "autonomy_since",
  "battery_capacity_since",
  "battery_capacity_until",
  "time_to_charge",
  "features_slugs",
  "color_slugs",
  "cuota_slugs",
  "condition",
  "dealership_ids",
]);

export const ARRAY_DTO_KEYS = new Set<keyof FindAllVehiclesParams>([
  "makes_slugs",
  "models_slugs",
  "categories_slugs",
  "provinces_slugs",
  "comunities_slugs",
  "municipalities_slugs",
  "service_slugs",
  "publisher_types",
  "warranty_slugs",
  "transmission_types",
  "fuel_type_slugs",
  "traction_slugs",
  "dgt_label_ids",
  "features_slugs",
  "color_slugs",
  "cuota_slugs",
  "dealership_ids",
]);

export const NUMERIC_DTO_KEYS = new Set<keyof FindAllVehiclesParams>([
  "page",
  "limit",
  "since_price",
  "until_price",
  "lat",
  "lng",
  "radius",
  "since_year",
  "until_year",
  "since_mileage",
  "until_mileage",
  "power_since",
  "power_until",
  "displacement_since",
  "displacement_until",
  "autonomy_since",
  "battery_capacity_since",
  "battery_capacity_until",
  "time_to_charge",
]);

export const BOOLEAN_DTO_KEYS = new Set<keyof FindAllVehiclesParams>([
  "price_offer",
  "is_seller_featured",
]);

/** DTO → query amigable (inverso de FRIENDLY_QUERY_TO_DTO) */
export const DTO_TO_FRIENDLY_QUERY: Partial<
  Record<keyof FindAllVehiclesParams, string>
> = Object.fromEntries(
  Object.entries(FRIENDLY_QUERY_TO_DTO).map(([friendly, dto]) => [dto, friendly]),
) as Partial<Record<keyof FindAllVehiclesParams, string>>;
