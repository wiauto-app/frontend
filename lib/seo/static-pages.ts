/** Páginas estáticas indexables: lista blanca para el sitemap de páginas. */
export const INDEXABLE_STATIC_PAGES: readonly string[] = [
  "/",
  "/vehiculos",
  "/concesionarios",
  "/vender-vehiculo",
  "/tasador",
  "/planes",
  "/financiacion",
  "/simulador-financiacion",
  "/soporte",
  "/contacto",
  "/sobre-nosotros",
  "/preguntas-frecuentes",
  "/noticias",
  "/prensa",
  "/privacidad",
  "/terminos",
  "/cookies",
];

/** Páginas públicas con `robots: NOINDEX_ROBOTS`: nunca van al sitemap. */
export const NOINDEX_STATIC_PAGES: readonly string[] = [
  "/seguros",
  "/garantia-mecanica",
  "/revision-vehiculo",
  "/informe-historial-vehiculo",
  "/comparador",
];
