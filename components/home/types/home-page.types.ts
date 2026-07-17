import { LucideIcon } from "lucide-react";
import type { StrapiMedia, StrapiRichTextBlock } from "./strapi-home.types";

export type StrapiLink = {
  id?: number;
  label: string;
  url: string;
  destacado?: boolean | null;
};

export interface HomeHeroFeature {
  id: string;
  label: string;
  description: string | null;
  icon_url: string | null;
  icon_alt: string | null;
}

export interface HomeHeroData {
  title: string;
  subtitle: string | null;
  download_app_label: string | null;
  background_image_url: string | null;
  hero_images: {
    id: string;
    image_url: string;
    image_alt: string;
    order: number;
  }[];
  action_links: StrapiLink[];
  features: HomeHeroFeature[];
}

export type HomeNewsletterData = {
  subtitle: string;
  title: string;
  description: string;
};

export type StoreButtonLabels = {
  line1: string;
  line2: string;
};

export type HomeAppAdvertisementData = {
  title: string;
  phrase: string;
  description: string;
  app_mockup_url: string | null;
  google_store_labels: StoreButtonLabels;
  apple_store_labels: StoreButtonLabels;
};

export type HomeFeatureItem = {
  id: string;
  label: string;
  icon_url: string | null;
  icon_alt: string | null;
};

export type HomeFeaturesData = {
  title: string;
  description: string;
  features: HomeFeatureItem[];
};

export type HomeSeoData = {
  meta_title: string;
  meta_description: string;
  keywords: string | null;
  canonical_url: string | null;
  no_index: boolean;
  share_image_url: string | null;
};

export type HomeProcessTab = {
  id: string;
  label: string;
  heading: string;
  description: StrapiRichTextBlock[];
  image_url: string | null;
  image_alt: string | null;
};

export type HomeProcessSectionData = {
  title: StrapiRichTextBlock[];
  tabs: HomeProcessTab[];
};

export type StrapiCard = {
  titulo: string;
  descripcion: string;
  imagen: StrapiMedia;
  colorFondo: string;
  colorTexto?: string;
  boton: StrapiLink;
};

export type HomeLowEmissionsLink = {
  title: string;
  description: string;
  href: string;
  image_url: string | null;
  border_color: string;
  title_color: string;
};

export type HomeLowEmissionsData = {
  title: string;
  description: string;
  image_url: string | null;
  links: HomeLowEmissionsLink[];
};

export type HomePageData = {
  herramientas: StrapiCard[];
  low_emissions: HomeLowEmissionsData;
  hero: HomeHeroData;
  newsletter: HomeNewsletterData;
  app_advertisement: HomeAppAdvertisementData;
  features: HomeFeaturesData;
  seo: HomeSeoData;
  process_section: HomeProcessSectionData;
};


export type VehicleExtraServiceItem = {
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
};