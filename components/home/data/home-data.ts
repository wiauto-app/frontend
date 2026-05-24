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

export const FEATURED_VEHICLES = [
  {
    id: "1",
    badge: "NEW CHEVROLET",
    title: "Trailblazer",
    price: "19.000 €",
    imageSrc:
      "https://images.unsplash.com/photo-1621007947382-bcb3c78379e0?w=600&q=80&auto=format&fit=crop",
    photoCount: 3,
    tags: ["Reservable", "Profesional"],
    progress: 0.25,
  },
  {
    id: "2",
    badge: "NEW CHEVROLET",
    title: "Trailblazer",
    price: "19.000 €",
    imageSrc:
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=80&auto=format&fit=crop",
    photoCount: 3,
    tags: ["Reservable", "Profesional"],
    progress: 0.25,
  },
  {
    id: "3",
    badge: "NEW CHEVROLET",
    title: "Trailblazer",
    price: "19.000 €",
    imageSrc:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80&auto=format&fit=crop",
    photoCount: 3,
    tags: ["Reservable", "Profesional"],
    progress: 0.25,
  },
  {
    id: "4",
    badge: "NEW CHEVROLET",
    title: "Trailblazer",
    price: "19.000 €",
    imageSrc:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80&auto=format&fit=crop",
    photoCount: 3,
    tags: ["Reservable", "Profesional"],
    progress: 0.25,
  },
] as const;

export const VALUE_PROPOSITION_FEATURES = [
  { id: "confianza", label: "Confianza total" },
  { id: "inventario", label: "Gran inventario" },
  { id: "todo-en-uno", label: "Todo en un solo lugar" },
  { id: "digital", label: "100% Digital" },
] as const;

export const BLOG_ARTICLES = [
  {
    id: "electricos-2026",
    title: "Los coches eléctricos siguen ganando terreno en 2026",
    excerpt:
      "El mercado automotriz continúa transformándose con el crecimiento de los vehículos eléctricos, ofreciendo mayor autonomía, tecnología inteligente y opciones cada vez más accesibles para los conductores.",
    href: "/blog/coches-electricos-2026",
    imageSrc:
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=900&q=80&auto=format&fit=crop",
    reverse: false,
  },
  {
    id: "tecnologia-volante",
    title: "La tecnología redefine la experiencia al volante",
    excerpt:
      "Las nuevas generaciones de vehículos incorporan asistentes inteligentes, pantallas interactivas y sistemas de seguridad avanzados que están cambiando la forma en que las personas conducen y compran coches.",
    href: "/blog/tecnologia-al-volante",
    imageSrc:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&q=80&auto=format&fit=crop",
    reverse: true,
  },
] as const;

export const RELATED_NEWS = [
  {
    id: "1",
    title: "Consejos para vender tu vehículo más rápido y al mejor precio",
    date: "Julio 30, 2019",
    comments: "1 Comentario",
    imageSrc:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Cómo elegir el coche ideal según tu estilo de vida",
    date: "Julio 30, 2019",
    comments: "1 Comentario",
    imageSrc:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Las tecnologías automotrices que están revolucionando la conducción",
    date: "Julio 30, 2019",
    comments: "1 Comentario",
    imageSrc:
      "https://images.unsplash.com/photo-1489824904134-891ab04532f1?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Guía básica de mantenimiento para alargar la vida de tu coche",
    date: "Julio 30, 2019",
    comments: "1 Comentario",
    imageSrc:
      "https://images.unsplash.com/photo-1486268115613-67f85a0f648d?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "5",
    title: "Cómo ahorrar combustible y reducir gastos en tu automóvil",
    date: "Julio 30, 2019",
    comments: "1 Comentario",
    imageSrc:
      "https://images.unsplash.com/photo-1570956013296-e48c4c4a8b3c?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "6",
    title: "Tendencias del mercado automotriz que debes conocer en 2026",
    date: "Julio 30, 2019",
    comments: "1 Comentario",
    imageSrc:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "7",
    title: "Errores comunes al comprar un vehículo y cómo evitarlos",
    date: "Julio 30, 2019",
    comments: "1 Comentario",
    imageSrc:
      "https://images.unsplash.com/photo-1551836022-d5d88e1278df?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "8",
    title: "SUV, sedán o hatchback: ¿cuál te conviene más?",
    date: "Julio 30, 2019",
    comments: "1 Comentario",
    imageSrc:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80&auto=format&fit=crop",
  },
] as const;

export const PROCESS_TABS = [
  { id: "comprar", label: "Comprar" },
  { id: "vender", label: "Vender" },
  { id: "comparar", label: "Comparar" },
  { id: "guias", label: "Guías y consejos" },
] as const;

export type ProcessTabId = (typeof PROCESS_TABS)[number]["id"];

export const PROCESS_CONTENT: Record<
  ProcessTabId,
  { heading: string; description: string }
> = {
  comprar: {
    heading: "Comprar un coche",
    description:
      "Encuentra el vehículo ideal según tus necesidades, presupuesto y estilo de vida. Explora opciones, compara modelos y toma una decisión con mayor confianza.",
  },
  vender: {
    heading: "Vender tu coche",
    description:
      "Publica tu vehículo en minutos, llega a miles de compradores interesados y gestiona consultas desde un solo lugar con herramientas pensadas para vendedores.",
  },
  comparar: {
    heading: "Comparar modelos",
    description:
      "Analiza características, precios y valoraciones de distintos vehículos en un solo lugar para elegir la opción que mejor se adapte a ti.",
  },
  guias: {
    heading: "Guías y consejos",
    description:
      "Accede a artículos, guías y recomendaciones del sector automotriz para tomar decisiones informadas en cada etapa del proceso.",
  },
};

export const FOOTER_USEFUL_LINKS = [
  { label: "Políticas de privacidad", href: "/privacidad" },
  { label: "Términos y Condiciones", href: "/terminos" },
  { label: "Iniciar sesión", href: "/iniciar-sesion" },
  { label: "Registrarme", href: "/registro" },
  { label: "FAQ", href: "/faq" },
] as const;

export const FOOTER_QUICK_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Vehículos", href: "/vehiculos" },
  { label: "Blog", href: "/blog" },
  { label: "Prensa", href: "/prensa" },
  { label: "Contacto", href: "/contacto" },
] as const;
