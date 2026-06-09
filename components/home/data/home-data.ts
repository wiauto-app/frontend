export const BRAND_BLUE = "#0061F2";
export const BRAND_BLUE_LIGHT = "#EBF2FF";
export const BRAND_BLUE_PROCESS = "#E9F1FE";
export const POPULAR_CATEGORIES_GRID = [
  {
    id: "familiares",
    name: "Familiares",
    image:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "primeros",
    name: "Primeros",
    image:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "ecologicos",
    name: "Ecológicos",
    image:
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "lujo",
    name: "Lujo",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80&auto=format&fit=crop",
  },
] as const;

export const CATEGORY_YEAR_TAGS = ["desde 2016", "desde 2016", "desde 2016", "desde 2016", "desde 2016", "desde 2016"] as const;

export const CAR_TYPES = [
  { id: "familiar", name: "Familiar", listings: "255.425 listados" },
  { id: "micro", name: "Micro", listings: "255.425 listados" },
  { id: "sedan", name: "Sedan", listings: "255.425 listados" },
  { id: "hatchback", name: "Hatchback", listings: "255.425 listados" },
  { id: "roadster", name: "Roadster", listings: "255.425 listados" },
  { id: "suv", name: "SUV", listings: "255.425 listados" },
] as const;

/** @deprecated Use CAR_TYPES */
export const POPULAR_CATEGORIES_ICONS = CAR_TYPES;

export const VALUE_PROPOSITION_FEATURES = [
  { id: "confianza", label: "Confianza total" },
  { id: "inventario", label: "Gran inventario" },
  { id: "todo-en-uno", label: "Todo en un solo lugar" },
  { id: "digital", label: "100% Digital" },
] as const;

export const FOOTER_USEFUL_LINKS = [
  { label: "Políticas de privacidad", href: "/privacidad" },
  { label: "Términos y Condiciones", href: "/terminos" },
  { label: "Iniciar sesión", href: "/iniciar-sesion" },
  { label: "Registrarme", href: "/registro" },
  { label: "FAQ", href: "/preguntas-frecuentes" },
] as const;

export const FOOTER_QUICK_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Vehículos", href: "/vehiculos" },
  { label: "Blog", href: "/blog" },
  { label: "Prensa", href: "/prensa" },
  { label: "Contacto", href: "/contacto" },
] as const;
