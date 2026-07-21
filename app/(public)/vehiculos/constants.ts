export const BRAND_BLUE = "#0061F2";
export const BRAND_BLUE_LIGHT = "#EBF2FF";

export const SORT_OPTIONS = [
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "created_at-desc", label: "Más nuevos primero" },
  { value: "created_at-asc", label: "Más antiguos primero" },
  { value: "mileage-asc", label: "Menor kilometraje" },
  { value: "mileage-desc", label: "Mayor kilometraje" },
] as const;

export const BRAND_OPTIONS = [
  { slug: "", label: "Todas las marcas" },
  { slug: "toyota", label: "Toyota" },
  { slug: "chevrolet", label: "Chevrolet" },
  { slug: "kia", label: "Kia" },
  { slug: "hyundai", label: "Hyundai" },
  { slug: "nissan", label: "Nissan" },
  { slug: "mazda", label: "Mazda" },
  { slug: "ford", label: "Ford" },
  { slug: "volkswagen", label: "Volkswagen" },
] as const;

export const GENERATION_OPTIONS = [
  { label: "2010–2013", since: 2010, until: 2013 },
  { label: "2014–2017", since: 2014, until: 2017 },
  { label: "2018–2021", since: 2018, until: 2021 },
  { label: "2022–Actual", since: 2022, until: new Date().getFullYear() },
] as const;

export const VERSION_OPTIONS = ["Base", "Full", "Sport", "Luxury / Premium", "GT / RS"] as const;

export const ENGINE_OPTIONS = ["1.0L", "1.2L", "1.5L", "2.0L", "Turbo", "Híbrido", "Eléctrico"] as const;

export const FUEL_OPTIONS = [
  { label: "Gasolina", slug: "gasolina" },
  { label: "Diésel", slug: "diesel" },
  { label: "Híbrido", slug: "hibrido" },
  { label: "Eléctrico", slug: "electrico" },
] as const;

export const BODY_TYPE_OPTIONS = [
  { slug: "micro", label: "Micro" },
  { slug: "sedan", label: "Sedan" },
  { slug: "cuv", label: "CUV" },
  { slug: "suv", label: "SUV" },
  { slug: "coupe", label: "Coupé" },
  { slug: "cabrio", label: "Cabrio" },
] as const;

export const DOOR_OPTIONS = [2, 3, 4, 5, 6] as const;

export const TRUNK_OPTIONS = ["< 300 L", "300 – 500 L", "+500 L"] as const;

export const TRACTION_OPTIONS = [
  { label: "Delantera (FWD)", slug: "delantera" },
  { label: "Trasera (RWD)", slug: "trasera" },
  { label: "4x4 / AWD", slug: "4x4" },
] as const;

export const DEFAULT_PRICE_RANGE = { min: 90, max: 531_000 };

export const NEWSLETTER_FALLBACK = {
  subtitle: "Subscríbete al Newsletter",
  title: "Obtenga noticias actualizadas",
  description:
    "Mantente al día con las mejores oportunidades y novedades. ¡Suscríbete a nuestro newsletter!",
};


export const VEHICLE_LIST_CLASS = " max-h-[calc(100dvh-200px)] overflow-y-auto ";