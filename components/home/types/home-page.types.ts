import type { LucideIcon } from "lucide-react";

import type { StrapiIconFeature, StrapiLink } from "@/interfaces/strapi-components.interface";
import type { HeroFeature } from "@/interfaces/hero-feature.interface";
import type { StrapiMedia } from "@/lib/strapi.types";

import type { StrapiRichTextBlock } from "./strapi-home.types";

export type { StrapiLink };

/** Alias histórico; preferir `HeroFeature`. */
export type HomeHeroFeature = HeroFeature;

export interface HomeHeroData {
  title: string;
  subtitle: string | null;
  download_app_label: string | null;
  background_image_url: string | null;
  hero_images: {
    id: string;
    image_url: string;
    image_alt: string;
    active: boolean;
    order: number;
  }[];
  action_links: StrapiLink[];
  features: StrapiIconFeature[];
}

export interface HomeNewsletterData {
  subtitle: string;
  title: string;
  description: string;
}

export interface StoreButtonLabels {
  line1: string;
  line2: string;
}

export interface HomeAppAdvertisementData {
  title: string;
  phrase: string;
  description: string;
  app_mockup_url: string | null;
  google_store_labels: StoreButtonLabels;
  apple_store_labels: StoreButtonLabels;
}

export interface HomeFeatureItem {
  id: string;
  label: string;
  icon_url: string | null;
  icon_alt: string | null;
}

export interface HomeFeaturesData {
  title: string;
  description: string;
  features: StrapiIconFeature[];
}

export interface HomeSeoData {
  meta_title: string;
  meta_description: string;
  keywords: string | null;
  canonical_url: string | null;
  no_index: boolean;
  share_image_url: string | null;
}

export interface HomeProcessTab {
  id: string;
  label: string;
  heading: string;
  description: StrapiRichTextBlock[];
  image_url: string | null;
  image_alt: string | null;
}

export interface HomeProcessSectionData {
  title: StrapiRichTextBlock[];
  tabs: HomeProcessTab[];
}

/** View-model de tarjeta de herramientas en home (no es el componente CMS). */
export interface StrapiCard {
  titulo: string;
  descripcion: string;
  imagen: StrapiMedia;
  colorFondo: string;
  colorTexto?: string;
  boton: StrapiLink;
}

export interface HomeLowEmissionsLink {
  title: string;
  description: string;
  href: string;
  image_url: string | null;
  border_color: string;
  title_color: string;
}

export interface HomeLowEmissionsData {
  title: string;
  description: string;
  image_url: string | null;
  links: HomeLowEmissionsLink[];
}

export interface HomePageData {
  herramientas: StrapiCard[];
  low_emissions: HomeLowEmissionsData;
  hero: HomeHeroData;
  newsletter: HomeNewsletterData;
  app_advertisement: HomeAppAdvertisementData;
  features: HomeFeaturesData;
  seo: HomeSeoData;
  process_section: HomeProcessSectionData;
}

export interface VehicleExtraServiceItem {
  name: string;
  color?: string;
  description: string;
  icon: LucideIcon;
  href: string;
}
