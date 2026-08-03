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
export type Boton = StrapiLink;

/** Alias histórico; card canónica `shared.carta-ventaja`. */
export type Card = StrapiCard;

export type VentajasSection = StrapiVenderVentajas;

export type ComparacionSection = StrapiVenderComparacion;

export type Plan = StrapiVenderPlan;

export type CaracteristicaPlan = StrapiVenderFeature;

export type ConsejosSection = StrapiVenderConsejos;

export type PreguntasSection = StrapiVenderFaqs;

export type Pregunta = StrapiDesplegable;

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
