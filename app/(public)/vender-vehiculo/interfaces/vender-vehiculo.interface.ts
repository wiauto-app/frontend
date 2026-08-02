import type {
  StrapiCard,
  StrapiDesplegable,
  StrapiLink,
  StrapiVenderComparacion,
  StrapiVenderConsejos,
  StrapiVenderFaqs,
  StrapiVenderFeature,
  StrapiVenderPlan,
  StrapiVenderVentajas,
} from "@/interfaces/strapi-components.interface";
import type { StrapiMedia } from "@/lib/strapi.types";

/** Alias histórico; media canónica. */
export type { StrapiMedia as Media };

/** Alias histórico; link canónico `shared.link`. */
export interface Boton extends StrapiLink {}

/** Alias histórico; card canónica `shared.carta-ventaja`. */
export interface Card extends StrapiCard {}

export interface VentajasSection extends StrapiVenderVentajas {}

export interface ComparacionSection extends StrapiVenderComparacion {}

export interface Plan extends StrapiVenderPlan {}

export interface CaracteristicaPlan extends StrapiVenderFeature {}

export interface ConsejosSection extends StrapiVenderConsejos {}

export interface PreguntasSection extends StrapiVenderFaqs {}

export interface Pregunta extends StrapiDesplegable {}

export interface VenderVehiculoResponse {
  id: number;
  documentId: string;
  titulo: string;
  descripcion: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;

  imagen: StrapiMedia[];

  profesional: Card;
  particular: Card;
  marketingCard: Card;

  ventajas: VentajasSection;
  comparacion: ComparacionSection;
  consejos: ConsejosSection;
  preguntas: PreguntasSection;
}
