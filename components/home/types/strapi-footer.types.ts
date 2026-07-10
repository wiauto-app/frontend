import type { StrapiMedia } from "./strapi-home.types";

export interface StrapiFooterLink {
  id: number;
  label: string;
  url: string;
  destacado?: boolean | null;
  imagen?: StrapiMedia | null;
}

export interface StrapiFooterSection {
  id: number;
  titulo: string;
  links?: StrapiFooterLink[] | null;
}

export interface StrapiFooterResponse {
  data: {
    logo?: StrapiMedia | null;
    descripcion?: string | null;
    redesSociales?: StrapiFooterLink[] | null;
    sections?: StrapiFooterSection[] | null;
    derechosReservados?: string | null;
  } | null;
}
