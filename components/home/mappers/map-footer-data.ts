import { getStrapiMediaUrl } from "@/lib/strapi-media";
import type { FooterData, FooterLinkItem, FooterSectionItem } from "../types/footer.types";
import type {
  StrapiFooterLink,
  StrapiFooterResponse,
  StrapiFooterSection,
} from "../types/strapi-footer.types";
import type { StrapiMedia } from "../types/strapi-home.types";

const DEFAULT_LOGO_URL = "/branding/white-logo.svg";
const DEFAULT_COPYRIGHT = `Copyright © ${new Date().getFullYear()}. Todos los derechos reservados.`;

const resolveMediaUrl = (media?: StrapiMedia | null): string | null => {
  if (!media) {
    return null;
  }

  return (
    getStrapiMediaUrl(media.formats?.small?.url) ??
    getStrapiMediaUrl(media.formats?.thumbnail?.url) ??
    getStrapiMediaUrl(media.url)
  );
};

const mapFooterLink = (link: StrapiFooterLink): FooterLinkItem | null => {
  const label = link.label?.trim();
  const url = link.url?.trim();

  if (!label || !url) {
    return null;
  }

  return {
    id: String(link.id),
    label,
    url,
    image_url: resolveMediaUrl(link.imagen),
  };
};

const mapFooterSection = (section: StrapiFooterSection): FooterSectionItem | null => {
  const title = section.titulo?.trim();

  if (!title) {
    return null;
  }

  const links = (section.links ?? [])
    .map(mapFooterLink)
    .filter((link): link is FooterLinkItem => link !== null);

  return {
    id: String(section.id),
    title,
    links,
  };
};

export const createDefaultFooterData = (): FooterData => ({
  logo_url: DEFAULT_LOGO_URL,
  description: null,
  social_links: [],
  sections: [],
  copyright: DEFAULT_COPYRIGHT,
});

export const mapFooterData = (response?: StrapiFooterResponse | null): FooterData => {
  const data = response?.data;

  if (!data) {
    return createDefaultFooterData();
  }

  const sections = (data.sections ?? [])
    .map(mapFooterSection)
    .filter((section): section is FooterSectionItem => section !== null);

  const social_links = (data.redesSociales ?? [])
    .map(mapFooterLink)
    .filter((link): link is FooterLinkItem => link !== null);

  return {
    logo_url: resolveMediaUrl(data.logo) ?? DEFAULT_LOGO_URL,
    description: data.descripcion?.trim() || null,
    social_links,
    sections,
    copyright: data.derechosReservados?.trim() || DEFAULT_COPYRIGHT,
  };
};
