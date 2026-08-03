import type { BlocksContent } from "@strapi/blocks-react-renderer";

import type { StrapiMedia } from "@/lib/strapi.types";

// ---------------------------------------------------------------------------
// shared/
// ---------------------------------------------------------------------------

/** Componente `shared.link` */
export interface StrapiLink {
  id: number;
  label: string;
  url: string;
  destacado: boolean | null;
  imagen: StrapiMedia | null;
}

/** Componente `shared.icon-feature` */
export interface StrapiIconFeature {
  id: number;
  label: string;
  descripcion: string | null;
  icon?: StrapiMedia | null;
  iconName: string | null;
}

/** Componente `shared.carta-ventaja` (card) */
export interface StrapiCard {
  id: number;
  titulo: string | null;
  descripcion: string | null;
  boton: StrapiLink | null;
  imagen: StrapiMedia | null;
  colorFondo: string | null;
  colorTexto: string | null;
  iconName: string | null;
}

/** Componente `shared.header` */
export interface StrapiHeader {
  id: number;
  titulo: string | null;
  descripcion: string | null;
}

/** Componente `shared.hero` */
export interface StrapiHero {
  id: number;
  titulo: string | null;
  descripcion: string | null;
  acciones: StrapiLink[] | null;
  imagen: StrapiMedia | null;
  caracteristicas: StrapiIconFeature[] | null;
  card: StrapiCard | null;
}

/** Componente `shared.estadistica` */
export interface StrapiEstadistica {
  id: number;
  estadistica: string | null;
  descripcion: string | null;
}

/** Componente `shared.seo` */
export interface StrapiSeo {
  id: number;
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string | null;
  canonicalURL: string | null;
  shareImage: StrapiMedia | null;
  noIndex: boolean | null;
}

/** Componente `shared.image` */
export interface StrapiImage {
  id: number;
  alt: string | null;
  image: StrapiMedia | null;
  order: number;
  active: boolean | null;
}

/** Componente `shared.user` */
export interface StrapiUser {
  id: number;
  nombre: string;
  imagen: StrapiMedia | null;
  descripcion: string | null;
}

/** Componente `shared.comment` */
export interface StrapiComment {
  id: number;
  usuario: StrapiUser | null;
  rating: number;
  comentario: string;
}

/** Componente `shared.pregunta` */
export interface StrapiPregunta {
  id: number;
  pregunta: string | null;
  respuesta: BlocksContent | null;
}

/** Componente `shared.desplegable` */
export interface StrapiDesplegable {
  id: number;
  titulo: string;
  descripcion: BlocksContent | null;
  imagen: StrapiMedia[] | null;
  orientacion: "vertical" | "horizontal" | null;
}

/** Componente `shared.anuncio` */
export interface StrapiAnuncio {
  id: number;
  titulo: string | null;
  descripcion: string | null;
  boton: StrapiLink | null;
}

/** Componente `shared.bloque-caracteristica` */
export interface StrapiBloqueCaracteristica {
  id: number;
  titulo: string;
  descripcion: BlocksContent | null;
  imagen: StrapiMedia | null;
  reversa: boolean;
}

/** Componente `shared.otro-link` */
export interface StrapiOtroLink {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: StrapiMedia | null;
  url: string;
}

/** Componente `shared.mobile-advertisment` */
export interface StrapiMobileAdvertisment {
  id: number;
  header: StrapiHeader | null;
  imagen: StrapiMedia | null;
  apple: StrapiLink | null;
  google: StrapiLink | null;
  caracteristicas: StrapiIconFeature[] | null;
}

// ---------------------------------------------------------------------------
// financiacion/
// ---------------------------------------------------------------------------

/** Componente `financiacion.advantages` */
export interface StrapiFinanciacionAdvantages {
  id: number;
  header: StrapiHeader | null;
  caracteristicas: StrapiIconFeature[] | null;
}

/** Componente `financiacion.steps` */
export interface StrapiFinanciacionSteps {
  id: number;
  header: StrapiHeader | null;
  steps: StrapiIconFeature[] | null;
}

// ---------------------------------------------------------------------------
// home/
// ---------------------------------------------------------------------------

/** Componente `home.features-section` */
export interface StrapiFeaturesSection {
  id: number;
  title: string | null;
  description: string | null;
  feature: StrapiIconFeature[] | null;
}

/** Componente `home.hero` */
export interface StrapiHomeHero {
  id: number;
  title: string | null;
  subtitle: string | null;
  backgroundImage: StrapiMedia | null;
  actionLinks: StrapiLink[] | null;
  caracteristicas: StrapiIconFeature[] | null;
  descarga_app: string | null;
  heroImages: StrapiImage[] | null;
}

/** Componente `home.app-advertisment` */
export interface StrapiAppAdvertisment {
  id: number;
  appMockup: StrapiMedia | null;
  title: string | null;
  phrase: string | null;
  description: string | null;
  googleLabel: BlocksContent | null;
  appleLabel: BlocksContent | null;
}

/** Componente `home.newsletter` */
export interface StrapiNewsletter {
  id: number;
  subtitle: string | null;
  title: string | null;
  description: string | null;
}

/** Componente `home.process-section-tabs` */
export interface StrapiProcessSectionTabs {
  id: number;
  tab: string | null;
  titulo: string | null;
  descripcion: BlocksContent | null;
  image: StrapiMedia | null;
}

/** Componente `home.process-section` */
export interface StrapiProcessSection {
  id: number;
  titulo: BlocksContent | null;
  tabs: StrapiProcessSectionTabs[] | null;
}

/** Componente `home.low-emisions` */
export interface StrapiLowEmisions {
  id: number;
  header: StrapiHeader | null;
  imagen: StrapiMedia | null;
  links: StrapiCard[] | null;
}

// ---------------------------------------------------------------------------
// planes/
// ---------------------------------------------------------------------------

/** Componente `planes.hero` (solo header; distinto de `shared.hero`) */
export interface StrapiPlanesHero {
  id: number;
  header: StrapiHeader | null;
}

/** Componente `planes.caracteristicas` */
export interface StrapiPlanesCaracteristicas {
  id: number;
  header: StrapiHeader | null;
  caracteristicas: StrapiIconFeature[] | null;
}

/** Componente `planes.tech-add` */
export interface StrapiPlanesTechAdd {
  id: number;
  header: StrapiHeader | null;
  caracteristicas: StrapiIconFeature[] | null;
  imagen: StrapiMedia | null;
}

// ---------------------------------------------------------------------------
// about/
// ---------------------------------------------------------------------------

/** Componente `about.business-card` */
export interface StrapiAboutBusinessCard {
  id: number;
  titulo: string | null;
  subtitulo: string | null;
  descripcion: string | null;
  caracteristicas: StrapiIconFeature[] | null;
}

/** Componente `about.team` */
export interface StrapiAboutTeam {
  id: number;
  titulo: string | null;
  subtitulo: string | null;
  persona: StrapiUser[] | null;
}

// ---------------------------------------------------------------------------
// billing/
// ---------------------------------------------------------------------------

/** Componente `billing.plan-item` */
export interface StrapiBillingPlanItem {
  id: number;
  descripcion: string | null;
  incluido: boolean | null;
}

/** Componente `billing.precios` */
export interface StrapiBillingPrecios {
  id: number;
  price: number | null;
  recurrencia: string | null;
  stripe_price_id: string | null;
}

/** Componente `billing.plan` */
export interface StrapiBillingPlan {
  id: number;
  titulo: string | null;
  item: StrapiBillingPlanItem[] | null;
  precios: StrapiBillingPrecios[] | null;
  stripe_product_id: string | null;
  destacado: boolean | null;
  orden: number | null;
  descripcion: string | null;
}

// ---------------------------------------------------------------------------
// footer/
// ---------------------------------------------------------------------------

/** Componente `footer.footer-section` */
export interface StrapiFooterSection {
  id: number;
  titulo: string;
  links: StrapiLink[] | null;
}

// ---------------------------------------------------------------------------
// simulador/
// ---------------------------------------------------------------------------

/** Componente `simulador.reasons` */
export interface StrapiSimuladorReasons {
  id: number;
  titulo: string;
  razones: StrapiIconFeature[] | null;
}

/** Componente `simulador.comments` */
export interface StrapiSimuladorComments {
  id: number;
  titulo: string;
  comentario: StrapiComment[] | null;
}

// ---------------------------------------------------------------------------
// soporte/
// ---------------------------------------------------------------------------

/** Componente `soporte.channels` */
export interface StrapiSoporteChannels {
  id: number;
  header: StrapiHeader | null;
  channel: StrapiCard[] | null;
}

/** Componente `soporte.preguntas` */
export interface StrapiSoportePreguntas {
  id: number;
  header: StrapiHeader | null;
  preguntas: StrapiPregunta[] | null;
}

// ---------------------------------------------------------------------------
// vender-vehiculo/
// ---------------------------------------------------------------------------

/** Componente `vender-vehiculo.feature` */
export interface StrapiVenderFeature {
  id: number;
  titulo: string | null;
  incluido: boolean | null;
}

/** Componente `vender-vehiculo.plan` */
export interface StrapiVenderPlan {
  id: number;
  nombre: string | null;
  caracteristicas: StrapiVenderFeature[] | null;
}

/** Componente `vender-vehiculo.ventajas` */
export interface StrapiVenderVentajas {
  id: number;
  titulo: string | null;
  descripcion: string | null;
  ventaja: StrapiCard[] | null;
}

/** Componente `vender-vehiculo.comparacion` */
export interface StrapiVenderComparacion {
  id: number;
  titulo: string | null;
  planes: StrapiVenderPlan[] | null;
}

/** Componente `vender-vehiculo.consejos` */
export interface StrapiVenderConsejos {
  id: number;
  titulo: string | null;
  descripcion: string | null;
  consejo: StrapiCard[] | null;
}

/** Componente `vender-vehiculo.faqs` */
export interface StrapiVenderFaqs {
  id: number;
  titulo: string | null;
  pregunta: StrapiDesplegable[] | null;
}
