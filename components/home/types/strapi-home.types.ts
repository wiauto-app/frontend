import { StrapiLink } from "./home-page.types";

export type StrapiRichTextBlock = {
  type: string;
  children?: {
    type: string;
    text: string;
    bold?: boolean;
  }[];
};

export type StrapiMedia = {
  url: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
  formats?: {
    large?: { url: string };
    medium?: { url: string };
    small?: { url: string };
    thumbnail?: { url: string };
  } | null;
};

export type StrapiHomepageResponse = {
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
      }[] | null;
      actionLinks?: { id: number; label: string; url: string }[] | null;
      caracteristicas?: {
        id: number;
        label: string;
        descripcion?: string | null;
        icon?: StrapiMedia | null;
      }[] | null;
    } | null;
    herramientas?: {
      titulo: string;
      descripcion: string;
      imagen: StrapiMedia;
      colorFondo: string;
      colorTexto: string;
      boton: StrapiLink;
    }[] | null;
    homeAppAdvertisment?: {
      title?: string | null;
      phrase?: string | null;
      description?: string | null;
      googleLabel?: StrapiRichTextBlock[] | null;
      appleLabel?: StrapiRichTextBlock[] | null;
      appMockup?: StrapiMedia | null;
    } | null;
    homeFeatures?: {
      title?: string | null;
      description?: string | null;
      feature?: {
        id: number;
        label: string;
        icon?: StrapiMedia | null;
      }[] | null;
    } | null;
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
      links?: {
        id?: number;
        titulo: string;
        descripcion: string;
        imagen?: StrapiMedia | null;
        colorFondo: string;
        colorTexto: string;
        boton: StrapiLink;
      }[] | null;
    } | null;
  } | null;
};
