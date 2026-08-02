import type {
  StrapiCard,
  StrapiFeaturesSection,
  StrapiLink,
} from "@/interfaces/strapi-components.interface";
import type { StrapiMedia } from "@/lib/strapi.types";

export type { StrapiMedia };

export interface StrapiRichTextBlock {
  type: string;
  children?: {
    type: string;
    text: string;
    bold?: boolean;
  }[];
}

export interface StrapiHomepageResponse {
  data: {
    homeSeo?: {
      metaTitle?: string | null;
      metaDescription?: string | null;
      keywords?: string | null;
      canonicalURL?: string | null;
      noIndex?: boolean | null;
      shareImage?: StrapiMedia | null;
    } | null;
    homeHero?: {
      title?: string | null;
      subtitle?: string | null;
      descarga_app?: string | null;
      backgroundImage?: StrapiMedia | null;
      heroImages?: {
        id: number;
        image: StrapiMedia;
        alt: string;
        order: number;
        active: boolean;
      }[] | null;
      actionLinks?: StrapiLink[] | null;
      caracteristicas?: {
        id: number;
        label: string;
        descripcion?: string | null;
        icon?: StrapiMedia | null;
      }[] | null;
    } | null;
    herramientas?: StrapiCard[] | null;
    homeAppAdvertisment?: {
      title?: string | null;
      phrase?: string | null;
      description?: string | null;
      googleLabel?: StrapiRichTextBlock[] | null;
      appleLabel?: StrapiRichTextBlock[] | null;
      appMockup?: StrapiMedia | null;
    } | null;
    /** Componente Strapi `home.features-section` */
    homeFeatures?: StrapiFeaturesSection | null;
    homeNewsletter?: {
      subtitle?: string | null;
      title?: string | null;
      description?: string | null;
    } | null;
    processSection?: {
      titulo?: StrapiRichTextBlock[] | null;
      tabs?: {
        id: number;
        tab?: string | null;
        titulo?: string | null;
        descripcion?: StrapiRichTextBlock[] | null;
        image?: StrapiMedia | null;
      }[] | null;
    } | null;
    bajas_emisiones?: {
      header?: {
        titulo?: string | null;
        descripcion?: string | null;
      } | null;
      imagen?: StrapiMedia | null;
      links?: StrapiCard[] | null;
    } | null;
  } | null;
}
