import { LucideIcon } from "lucide-react";
import type { StrapiRichTextBlock } from "./strapi-home.types";

export type HomeActionLink = {
  label: string;
  url: string;
};

export type HomeHeroData = {
  title: string;
  subtitle: string | null;
  background_image_url: string | null;
  action_links: HomeActionLink[];
};

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

export type HomePageData = {
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