export interface StrapiMediaFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
}

export interface StrapiMediaFormats {
  thumbnail?: StrapiMediaFormat;
  small?: StrapiMediaFormat;
  medium?: StrapiMediaFormat;
  large?: StrapiMediaFormat;
}

export interface StrapiMedia {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  formats: StrapiMediaFormats | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

/** Componente `shared.header` */
export interface SimuladorHeaderStrapi {
  id: number;
  titulo: string | null;
  descripcion: string | null;
}

/** Componente `shared.icon-feature` */
export interface SimuladorIconFeatureStrapi {
  id: number;
  label: string;
  descripcion: string | null;
  icon: StrapiMedia | null;
  iconName: string | null;
}

/** Componente `simulador.reasons` */
export interface SimuladorReasonsStrapi {
  id: number;
  titulo: string;
  razones: SimuladorIconFeatureStrapi[] | null;
}

/** Componente `shared.user` */
export interface SimuladorUserStrapi {
  id: number;
  nombre: string;
  imagen: StrapiMedia | null;
  descripcion: string | null;
}

/** Componente `shared.comment` */
export interface SimuladorCommentItemStrapi {
  id: number;
  usuario: SimuladorUserStrapi;
  rating: number;
  comentario: string;
}

/** Componente `simulador.comments` */
export interface SimuladorCommentsStrapi {
  id: number;
  titulo: string;
  comentario: SimuladorCommentItemStrapi[] | null;
}

/** Single type `simulador` */
export interface SimuladorPageStrapiData {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  header: SimuladorHeaderStrapi | null;
  financiar: SimuladorReasonsStrapi | null;
  facilidades: SimuladorReasonsStrapi | null;
  comentarios: SimuladorCommentsStrapi | null;
}

export interface StrapiSimuladorPageResponse {
  data: SimuladorPageStrapiData | null;
}

export interface SimuladorMediaView {
  url: string | null;
  alt: string;
}

export interface SimuladorBeneficioView {
  id: string;
  titulo: string;
  descripcion: string;
  icon: SimuladorMediaView;
  /** Nombre de icono Strapi (Lu*, Fa*, Hi*, Io*) — prioridad de UI si no hay media. */
  iconName: string | null;
}

export interface SimuladorPasoView {
  id: string;
  orden: number;
  titulo: string;
  descripcion: string;
  icon: SimuladorMediaView;
  /** Nombre de icono Strapi (Lu*, Fa*, Hi*, Io*) — prioridad de UI si no hay media. */
  iconName: string | null;
}

export interface SimuladorTestimonioView {
  id: string;
  nombre: string;
  cita: string;
  rating: number;
  foto: SimuladorMediaView;
  rol: string;
}

/** Textos del panel — constantes locales (no vienen de Strapi). */
export interface SimuladorCopyUiView {
  tituloConfig: string;
  tituloResultados: string;
  botonCalcular: string;
  textoConfianza: string;
  avisoReferencial: string;
  labelPrecio: string;
  labelEntrada: string;
  labelPlazo: string;
  labelTasa: string;
  labelSeguro: string;
  badgeAprobacion: string;
}

export interface SimuladorPageViewModel {
  header: {
    titulo: string;
    descripcion: string;
  };
  beneficiosTitulo: string;
  beneficios: SimuladorBeneficioView[];
  pasosTitulo: string;
  pasos: SimuladorPasoView[];
  testimoniosTitulo: string;
  testimonios: SimuladorTestimonioView[];
  ctaFinal: {
    titulo: string;
    botonTexto: string;
    botonUrl: string;
  };
  copyUi: SimuladorCopyUiView;
  seoTitle: string;
  seoDescription: string;
}
