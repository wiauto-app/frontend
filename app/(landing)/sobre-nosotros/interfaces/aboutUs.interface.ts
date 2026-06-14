export type {
  StrapiAboutUsAttributes,
  StrapiAboutUsBusinessCard,
  StrapiAboutUsEntry,
  StrapiAboutUsFeature,
  StrapiAboutUsSingleResponse,
  StrapiAboutUsTeamSection,
} from "../types/strapi-about-us.types";

/** Vista de dominio para la página (mapeo opcional desde Strapi) */
export type AboutUsFeature = {
  id: number;
  label: string;
  description: string;
};

export type AboutUsBusinessCard = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
};

export type AboutUsTeamSection = {
  id: number;
  title: string;
  subtitle: string;
};

export type AboutUs = {
  id: number;
  documentId: string;
  title: string;
  imageUrl: string | null;
  features: AboutUsFeature[];
  businessCard: AboutUsBusinessCard | null;
  teamSection: AboutUsTeamSection | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};
