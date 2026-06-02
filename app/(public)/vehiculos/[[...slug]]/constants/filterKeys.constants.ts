

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