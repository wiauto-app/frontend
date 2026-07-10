import { LucideIcon } from "lucide-react";

export interface DiscoveryCatalogItem {
  slug: string;
  name: string;
}

export interface DiscoveryPillLink {
  label: string;
  href: string;
}

export interface QuickLink {
  label: string;
  description?: string;
  href: string;
  Icon?: LucideIcon;
  imageUrl?: string | null;
  borderColor?: string;
  titleColor?: string;
}

export interface DiscoveryAccordionSection {
  id: string;
  title: string;
  Icon?: LucideIcon;
  pills: DiscoveryPillLink[];
}

export interface VehicleDiscoverySectionProps {
  title?: string;
  description?: string;
  imageUrl?: string | null;
  quickLinks?: QuickLink[];
  sections?: DiscoveryAccordionSection[];
  className?: string;
}
