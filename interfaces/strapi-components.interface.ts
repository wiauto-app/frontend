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
  iconName: string | null;
  externo?: boolean | null;
  /** Si es true, el CTA dispara una acción en la página (p. ej. submit) en lugar de navegar. */
  funcion?: boolean | null;
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
  boton_secundario: StrapiLink | null;
  imagen: StrapiMedia | null;
  colorFondo: string | null;
  colorTexto: string | null;
  iconName: string | null;
}

/** Componente `shared.text-field` */
export interface StrapiTextField {
  id: number;
  placeholder: string | null;
  label: string | null;
}

/** Componente `shared.header` */
export interface StrapiHeader {
  id: number;
  titulo: string | null;
  descripcion: string | null;
  busqueda: StrapiTextField | null;
}

/** Componente `shared.marcas` */
export interface StrapiMarcas {
  id: number;
  header: StrapiHeader | null;
  marcas: StrapiLink[] | null;
}

/** Componente `shared.hero` */
export interface StrapiHero {
  id: number;
  titulo: string;
  descripcion: string;
  acciones: StrapiLink[];
  imagen: StrapiMedia | null;
  caracteristicas: StrapiIconFeature[];
  card: StrapiCard | null;
  footer?: BlocksContent | null;
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
  noFollow: boolean | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogType: "website" | "article" | null;
  twitterCard: "summary" | "summary_large_image" | null;
  /** JSON-LD propio de la página. */
  structuredData: Record<string, unknown> | null;
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

/** Componente `shared.faq` */
export interface StrapiFaq {
  id: number;
  pregunta: string | null;
  respuesta: BlocksContent | null;
  categoria: string | null;
  iconName: string | null;
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
  appMockup: StrapiMedia ;
  title: string;
  phrase: string;
  description: string;
  googleLabel: BlocksContent;
  appleLabel: BlocksContent;
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

// ---------------------------------------------------------------------------
// ui/
// ---------------------------------------------------------------------------

/** Componente `ui.encabezado` */
export interface StrapiUiEncabezado {
  id: number;
  titulo: string;
  descripcion: string | null;
}

/** Componente `ui.boton` */
export interface StrapiUiBoton {
  id: number;
  label: string;
  label_cargando: string | null;
}

/** Componente `ui.texto-enlace` */
export interface StrapiUiTextoEnlace {
  id: number;
  texto: string | null;
  enlace: StrapiLink | null;
}

/** Componente `ui.aviso` */
export interface StrapiUiAviso {
  id: number;
  texto: string;
  tipo: "info" | "exito" | "alerta" | "error" | null;
}

/** Componente `ui.mensajes-accion` */
export interface StrapiUiMensajesAccion {
  id: number;
  exito: string | null;
  error_generico: string | null;
}

// ---------------------------------------------------------------------------
// formulario/
// ---------------------------------------------------------------------------

/** Componente `formulario.campo` */
export interface StrapiFormularioCampo {
  id: number;
  label: string;
  placeholder: string | null;
  ayuda: string | null;
  mensaje_requerido: string | null;
  mensaje_invalido: string | null;
}

/** Componente `formulario.campo-telefono` */
export interface StrapiFormularioCampoTelefono {
  id: number;
  label: string | null;
  label_numero: string | null;
  placeholder_numero: string | null;
  mensaje_requerido: string | null;
  mensaje_invalido: string | null;
  mensaje_longitud: string | null;
  mensaje_prefijo_requerido: string | null;
}

/** Componente `formulario.casilla` */
export interface StrapiFormularioCasilla {
  id: number;
  texto: BlocksContent | null;
  mensaje_requerido: string | null;
}

// ---------------------------------------------------------------------------
// auth/
// ---------------------------------------------------------------------------

/** Componente `auth.compartido` */
export interface StrapiAuthCompartido {
  id: number;
  panel_titulo: string | null;
  separador: string | null;
  boton_google: string | null;
  boton_apple: string | null;
}

/** Componente `auth.registro` */
export interface StrapiAuthRegistro {
  id: number;
  seo: StrapiSeo | null;
  encabezado: StrapiUiEncabezado | null;
  aviso_invitacion: StrapiUiAviso | null;
  nombre: StrapiFormularioCampo | null;
  apellidos: StrapiFormularioCampo | null;
  email: StrapiFormularioCampo | null;
  telefono: StrapiFormularioCampoTelefono | null;
  contrasena: StrapiFormularioCampo | null;
  terminos: StrapiFormularioCasilla | null;
  boton: StrapiUiBoton | null;
  pie: StrapiUiTextoEnlace | null;
  mensajes: StrapiUiMensajesAccion | null;
}

/** Componente `auth.login` */
export interface StrapiAuthLogin {
  id: number;
  seo: StrapiSeo | null;
  encabezado: StrapiUiEncabezado | null;
  email: StrapiFormularioCampo | null;
  contrasena: StrapiFormularioCampo | null;
  recordar_sesion: StrapiFormularioCasilla | null;
  boton: StrapiUiBoton | null;
  pie: StrapiUiTextoEnlace | null;
  enlace_olvide_contrasena: StrapiLink | null;
  mensajes: StrapiUiMensajesAccion | null;
}

/** Componente `auth.olvide-contrasena` */
export interface StrapiAuthOlvideContrasena {
  id: number;
  seo: StrapiSeo | null;
  encabezado: StrapiUiEncabezado | null;
  encabezado_enviado: StrapiUiEncabezado | null;
  email: StrapiFormularioCampo | null;
  boton: StrapiUiBoton | null;
  enlace_volver: StrapiLink | null;
  mensajes: StrapiUiMensajesAccion | null;
}

/** Componente `auth.cambiar-contrasena` */
export interface StrapiAuthCambiarContrasena {
  id: number;
  seo: StrapiSeo | null;
  encabezado: StrapiUiEncabezado | null;
  contrasena: StrapiFormularioCampo | null;
  confirmar_contrasena: StrapiFormularioCampo | null;
  boton: StrapiUiBoton | null;
  boton_limpiar: string | null;
  pie: StrapiUiTextoEnlace | null;
  mensajes: StrapiUiMensajesAccion | null;
  encabezado_enlace_invalido: StrapiUiEncabezado | null;
  boton_solicitar_enlace: StrapiLink | null;
  enlace_volver: StrapiLink | null;
}

/** Componente `auth.confirmar-correo` */
export interface StrapiAuthConfirmarCorreo {
  id: number;
  seo: StrapiSeo | null;
  encabezado: StrapiUiEncabezado | null;
  ayuda: string | null;
  boton: StrapiLink | null;
  pie: StrapiUiTextoEnlace | null;
}

/** Componente `auth.verificacion-2fa` */
export interface StrapiAuthVerificacion2fa {
  id: number;
  seo: StrapiSeo | null;
  encabezado: StrapiUiEncabezado | null;
  codigo: StrapiFormularioCampo | null;
  boton_verificar: StrapiUiBoton | null;
  codigo_respaldo: StrapiFormularioCampo | null;
  boton_verificar_respaldo: StrapiUiBoton | null;
  boton_usar_respaldo: string | null;
  boton_usar_autenticador: string | null;
  boton_volver: string | null;
  mensajes: StrapiUiMensajesAccion | null;
  mensajes_respaldo: StrapiUiMensajesAccion | null;
  texto_cargando: string | null;
}
