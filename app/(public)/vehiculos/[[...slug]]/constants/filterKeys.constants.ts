export const MAKE_KEY = "marcas"
export const MODEL_KEY = "modelos"

export const PROVINCE_KEY = "provincias"
export const MUNICIPALITY_KEY = "municipios"

/** Query amigable: `radio` → radius (metros) en API */
export const GEO_LOCATION_KEYS = {
  LAT: "lat",
  LNG: "lng",
  RADIUS: "radio",
} as const;

export const DEFAULT_GEO_RADIUS_METERS = 25_000;
export const MIN_GEO_RADIUS_METERS = 5_000;
export const MAX_GEO_RADIUS_METERS = 200_000;
export const GEO_RADIUS_STEP_METERS = 5_000;

export const PUBLISHER_TYPE_KEY = "publisher_types"


export const YEAR_KEYS = {
  SINCE: "anio_desde",
  UNTIL: "anio_hasta",
} as const;

export const PAGE_KEY = "pagina";

export const ORDER_KEYS = {
  /** Query amigable combinado: `created_at-desc` */
  ORDEN: "orden",
  ORDER_BY: "order_by",
  ORDER_DIRECTION: "order_direction",
} as const;

export const MOTOR_KEYS = {
  TRANSMISSION: "transmision",
  FUEL: "combustible",
  TRACTION: "traccion",
  POWER: "potencia",
  DISPLACEMENT: "cilindrada",
}

export const MILEAGE_KEYS={
  SINCE: "km_desde",
  UNTIL: "km_hasta",
}

export const PRICE_KEYS={
  SINCE: "precio_desde",
  UNTIL: "precio_hasta",
}

export const CUOTA_KEYS = {
  SINCE: "cuota_desde",
  UNTIL: "cuota_hasta",
  TIME_TO_PAY: "meses_cuota",
}

export const DGT_LABEL_KEY = "etiqueta"

export const SERVICE_KEY = "servicios"

export const ELECTRIC_KEYS = {
  AUTONOMY: "autonomia",
  BATTERY: "capacidad_batería",
}

export const FEATURE_KEY = "equipamiento"
export const COLOR_KEY = "color"