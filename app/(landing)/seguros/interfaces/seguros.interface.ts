import type {
  StrapiFeaturesSection,
  StrapiHero,
} from "@/interfaces/strapi-components.interface";

/** Alias del componente Strapi `home.features-section` (mismo que homeFeatures). */
export type SegurosFeaturesSection = StrapiFeaturesSection;
export type SegurosHero = StrapiHero;

/** Single type `seguro` */
export interface SegurosPageData {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  hero: SegurosHero | null;
  /** `home.features-section` */
  caracteristicas: SegurosFeaturesSection | null;
  seguridad: SegurosHero | null;
  /** `home.features-section` */
  incluido: SegurosFeaturesSection | null;
  /** `home.features-section` */
  aliados: SegurosFeaturesSection | null;
}

export interface StrapiSegurosResponse {
  data: SegurosPageData | null;
}
