import type {
  StrapiEstadistica,
  StrapiFinanciacionAdvantages,
  StrapiFinanciacionSteps,
  StrapiHero,
} from "@/interfaces/strapi-components.interface";

/** Alias del componente Strapi `shared.hero`. */
export type FinanciacionHero = StrapiHero;

/** Single type `financiacion` */
export interface FinanciacionPageData {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  hero: FinanciacionHero | null;
  /** `financiacion.advantages` */
  ventajas: StrapiFinanciacionAdvantages | null;
  /** `financiacion.steps` */
  pasos: StrapiFinanciacionSteps | null;
  soporte: FinanciacionHero | null;
  /** `shared.estadistica` (repeatable) */
  estadisticas: StrapiEstadistica[] | null;
}

export interface StrapiFinanciacionResponse {
  data: FinanciacionPageData | null;
}
