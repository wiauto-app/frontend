/**
 * Landing de Colaboración - Tipos Strapi + Mapeados
 * Componentes: hero, caracteristicas, contenido, contenido_dinamico, contenido_extra
 */

import { StrapiHero } from "./strapi-components.interface";

// ============================================================================
// TIPOS COMPARTIDOS REUTILIZABLES
// ============================================================================

export interface StrapiImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: {
      url: string;
      width: number;
      height: number;
    };
    small?: {
      url: string;
      width: number;
      height: number;
    };
    medium?: {
      url: string;
      width: number;
      height: number;
    };
    large?: {
      url: string;
      width: number;
      height: number;
    };
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: unknown;
  createdAt: string;
  updatedAt: string;
}



export interface StrapiFeature {
  id: string;
  label: string;
  descripcion?: string;
  iconName?: string;
  icon?: StrapiImage;
}

export interface StrapiAction {
  id: string;
  label: string;
  href?: string;
  tipo?: 'primary' | 'secondary' | 'tertiary';
  icono?: string;
}

export interface StrapiCard {
  id: string;
  titulo?: string;
  descripcion?: string;
  imagen?: StrapiImage;
}

export interface StrapiCaracteristicas {
  id: string;
  __component: 'planes.caracteristicas';
  header?: {
    titulo?: string;
    descripcion?: string;
  };
  caracteristicas?: StrapiFeature[];
}

export interface StrapiCartaVentaja {
  id: string;
  __component: 'shared.carta-ventaja';
  titulo?: string;
  descripcion?: string;
  imagen?: StrapiImage;
  acciones?: StrapiAction[];
}

// ============================================================================
// TIPOS STRAPI (RAW) - Del endpoint /landings-colaboracion
// ============================================================================

export interface StrapiColaboracionLanding {
  id: number;
  documentId: string;
  nombre: string;
  slug: string;
  key?: string | null;
  descripcion: string;
  iconName: string;
  hero?: StrapiHero;
  caracteristicas?: StrapiCaracteristicas;
  contenido?: StrapiHero;
  contenido_dinamico?: (StrapiHero | StrapiCartaVentaja | StrapiCaracteristicas)[];
  contenido_extra?: StrapiHero;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  locale?: string;
  localizations?: StrapiColaboracionLanding[];
}

export interface StrapiColaboracionListItem {
  id: number;
  documentId: string;
  nombre: string;
  publishedAt: string | null;
}

export interface StrapiColaboracionResponse {
  data: StrapiColaboracionLanding[];
  meta: {
    pagination: {
      start: number;
      limit: number;
      total: number;
    };
  };
}

export interface StrapiColaboracionSingleResponse {
  data: StrapiColaboracionLanding;
  meta: Record<string, unknown>;
}


export interface Feature {
  id: string;
  label: string;
  descripcion?: string;
  iconName?: string;
  iconUrl?: string;
}

export interface Action {
  id: string;
  label: string;
  href?: string;
  tipo?: 'primary' | 'secondary' | 'tertiary';
  icono?: string;
}

export interface Card {
  titulo?: string;
  descripcion?: string;
  imagen?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
}

export interface Caracteristicas {
  header?: {
    titulo?: string;
    descripcion?: string;
  };
  caracteristicas?: Feature[];
}

export interface CartaVentaja {
  titulo?: string;
  descripcion?: string;
  imagen?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  acciones?: Action[];
}

export interface DynamicZoneBlock {
  type: 'hero' | 'carta-ventaja' | 'caracteristicas';
  data: StrapiHero | CartaVentaja | Caracteristicas;
}

export interface ColaboracionLanding {
  id: string;
  nombre: string;
  key?: string | null;
  hero?: StrapiHero;
  caracteristicas?: Caracteristicas;
  contenido?: StrapiHero;
  contenido_dinamico?: DynamicZoneBlock[];
  contenido_extra?: StrapiHero;
  publishedAt?: string;
  locale?: string;
}

export interface ColaboracionListItem {
  id: string;
  nombre: string;
  publishedAt?: string;
}

// ============================================================================
// MAPPERS
// ============================================================================

export const mapStrapiImageToInternal = (
  image: StrapiImage | undefined
): { url: string; alt: string; width: number; height: number } | undefined => {
  if (!image) return undefined;
  return {
    url: image.url,
    alt: image.alternativeText || image.name,
    width: image.width,
    height: image.height,
  };
};

export const mapStrapiColaboracionToInternal = (
  strapi: StrapiColaboracionLanding
): ColaboracionLanding => {
  return {
    id: strapi.documentId,
    key: strapi.key,
    nombre: strapi.nombre,
    hero: strapi.hero ? strapi.hero : undefined,
    caracteristicas: strapi.caracteristicas,

    contenido: strapi.contenido,
    contenido_extra: strapi.contenido_extra,

    publishedAt: strapi.publishedAt || undefined,
    locale: strapi.locale,
  };
};


export const mapStrapiCaracteristicasToInternal = (
  strapi: StrapiCaracteristicas
): Caracteristicas => {
  return {
    header: strapi.header,
    caracteristicas: strapi.caracteristicas?.map((f) => ({
      id: f.id,
      label: f.label,
      descripcion: f.descripcion,
      iconName: f.iconName,
      iconUrl: f.icon?.url,
    })),
  };
};

export const mapStrapiCartaVentajaToInternal = (
  strapi: StrapiCartaVentaja
): CartaVentaja => {
  return {
    titulo: strapi.titulo,
    descripcion: strapi.descripcion,
    imagen: mapStrapiImageToInternal(strapi.imagen),
    acciones: strapi.acciones?.map((a) => ({
      id: a.id,
      label: a.label,
      href: a.href,
      tipo: a.tipo,
      icono: a.icono,
    })),
  };
};


export const mapStrapiListItemsToInternal = (
  items: StrapiColaboracionListItem[]
): ColaboracionListItem[] => {
  return items.map((item) => ({
    id: item.documentId,
    nombre: item.nombre,
    publishedAt: item.publishedAt || undefined,
  }));
};
