export const BRAND_BLUE = "#0061F2";
export const BRAND_BLUE_LIGHT = "#EBF2FF";

export const SORT_OPTIONS = [
  { value: "relevance", label: "Más relevantes" },
  { value: "rating-desc", label: "Mejor valorados" },
  { value: "vehicles-desc", label: "Más vehículos" },
  { value: "distance-asc", label: "Más cercanos" },
  { value: "reviews-desc", label: "Más reseñas" },
] as const;

export const DEALER_TYPE_OPTIONS = [
  { slug: "oficial", label: "Concesionario oficial" },
  { slug: "multimarca", label: "Multimarca" },
  { slug: "especialista", label: "Especialista" },
] as const;

export const DEALER_SERVICE_OPTIONS = [
  { slug: "financiacion", label: "Financiación" },
  { slug: "garantia-extendida", label: "Garantía extendida" },
  { slug: "entrega-a-domicilio", label: "Entrega a domicilio" },
  { slug: "taller-propio", label: "Taller propio" },
] as const;

export const MIN_RATING_OPTIONS = [
  { value: 0, label: "Cualquier valoración" },
  { value: 3, label: "3.0 o más" },
  { value: 4, label: "4.0 o más" },
  { value: 4.5, label: "4.5 o más" },
] as const;

export const RADIUS_OPTIONS = [
  { value: 10, label: "10 km" },
  { value: 25, label: "25 km" },
  { value: 50, label: "50 km" },
  { value: 100, label: "100 km" },
  { value: 0, label: "Todo el país" },
] as const;

export const MIN_VEHICLES_OPTIONS = [
  { value: 0, label: "Cualquiera" },
  { value: 10, label: "10+" },
  { value: 25, label: "25+" },
  { value: 50, label: "50+" },
  { value: 100, label: "100+" },
] as const;

export const VERIFIED_BADGE_COLOR = "#0061F2";
