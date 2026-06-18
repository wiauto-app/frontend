export const BRAND_BLUE = "#0061F2";
export const BRAND_BLUE_LIGHT = "#EBF2FF";

export const SORT_OPTIONS = [
  { value: "relevance", label: "Más relevantes" },
  { value: "rating-desc", label: "Mejor valorados" },
  { value: "vehicles-desc", label: "Más vehículos" },
  { value: "distance-asc", label: "Más cercanos" },
  { value: "reviews-desc", label: "Más reseñas" },
] as const;

export const MIN_VEHICLES_OPTIONS = [
  { value: 0, label: "Cualquiera" },
  { value: 10, label: "10+" },
  { value: 25, label: "25+" },
  { value: 50, label: "50+" },
  { value: 100, label: "100+" },
] as const;

export const VERIFIED_BADGE_COLOR = "#0061F2";
