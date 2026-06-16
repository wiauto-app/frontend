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
      backgroundImage?: StrapiMedia | null;
      actionLinks?: { id: number; label: string; url: string }[] | null;
    } | null;
    herramientas?: {
      titulo: string;
      descripcion: string;
      imagen: StrapiMedia;
      colorFondo: string;
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
  } | null;
};
