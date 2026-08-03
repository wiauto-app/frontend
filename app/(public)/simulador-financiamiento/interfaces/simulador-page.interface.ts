import type {
  StrapiHeader,
  StrapiSimuladorComments,
  StrapiSimuladorReasons,
} from "@/interfaces/strapi-components.interface";
import type { StrapiMedia } from "@/lib/strapi.types";

export type { StrapiMedia };

/** Alias histórico; componente `shared.header`. */
export type SimuladorHeaderStrapi = StrapiHeader;

/** Alias histórico; componente `simulador.reasons`. */
export type SimuladorReasonsStrapi = StrapiSimuladorReasons;

/** Alias histórico; componente `simulador.comments`. */
export type SimuladorCommentsStrapi = StrapiSimuladorComments;

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
  seoTitle: string;
  seoDescription: string;
}
